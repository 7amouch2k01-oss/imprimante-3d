'use client';

import { useEffect, useState } from 'react';
import StatusBadge from '@/components/StatusBadge';
import { RefreshCw, Search, Eye, X, Mail, MapPin, Phone, Package, Calendar, CreditCard, MessageSquare } from 'lucide-react';

const STATUSES = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      await fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder((prev: any) => ({ ...prev, status }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  }

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      (o.orderNumber || '').toLowerCase().includes(q) ||
      (o.customerName || '').toLowerCase().includes(q) ||
      (o.customerEmail || '').toLowerCase().includes(q) ||
      (o.shippingAddress?.city || '').toLowerCase().includes(q) ||
      (o.phone || '').toLowerCase().includes(q)
    );
  });

  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum: number, o: any) => sum + (o.totalAmount ?? o.total ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 mb-1">Commandes Clients</h1>
          <p className="text-sm text-zinc-400">
            {orders.length} commande(s) au total —{' '}
            <span className="font-semibold text-zinc-800">{totalRevenue.toFixed(2)} DT</span> de chiffre d'affaires
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-900 transition-colors border border-zinc-200 bg-white rounded-lg px-3 py-2 self-start sm:self-auto"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Actualiser
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par nom, email, n° commande, ville..."
          className="w-full pl-9 pr-4 py-2 text-xs border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#116B36]/20 focus:border-[#116B36]"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-zinc-400 border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-5 py-3 font-medium">N° Commande</th>
                <th className="text-left px-5 py-3 font-medium">Client</th>
                <th className="text-left px-5 py-3 font-medium">Destination</th>
                <th className="text-left px-5 py-3 font-medium">Articles</th>
                <th className="text-left px-5 py-3 font-medium">Total</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Statut</th>
                <th className="text-left px-5 py-3 font-medium">Détails</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-zinc-400 text-xs">Chargement des commandes...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-zinc-400 text-xs">
                    {searchQuery ? 'Aucune commande ne correspond à votre recherche' : 'Aucune commande enregistrée pour le moment'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order: any) => {
                  const amount = order.totalAmount ?? order.total ?? 0;
                  const itemCount = order.items?.reduce((s: number, it: any) => s + (it.quantity || 1), 0) ?? 0;
                  const city = order.shippingAddress?.city || order.city || '—';

                  return (
                    <tr key={order._id} className="border-b border-zinc-50 hover:bg-zinc-50/80 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs font-semibold text-zinc-800">
                        {order.orderNumber || order._id.substring(0, 8)}
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-zinc-900">{order.customerName || 'Client'}</p>
                        <p className="text-xs text-zinc-400">{order.customerEmail || order.phone || ''}</p>
                      </td>
                      <td className="px-5 py-3 text-xs text-zinc-600">
                        {city} {order.shippingAddress?.country ? `(${order.shippingAddress.country})` : ''}
                      </td>
                      <td className="px-5 py-3 text-xs text-zinc-600">
                        <span className="font-semibold text-zinc-800">{itemCount}</span> article(s)
                      </td>
                      <td className="px-5 py-3 font-bold text-zinc-900 text-sm">
                        {amount.toFixed(2)} DT
                      </td>
                      <td className="px-5 py-3 text-zinc-400 text-xs">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-TN') : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={order.status || 'PENDING'}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          disabled={updating === order._id}
                          className="text-xs border border-zinc-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#116B36]/50 focus:border-[#116B36] disabled:opacity-50"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors"
                          title="Voir fiche complète"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Customer & Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h2 className="text-base font-bold text-zinc-900">
                  Détails Commande #{selectedOrder.orderNumber || selectedOrder._id}
                </h2>
                <p className="text-xs text-zinc-400">
                  Passée le {new Date(selectedOrder.createdAt).toLocaleString('fr-TN')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Information Card */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                  Informations Client & Expédition
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-400 block">Nom complet :</span>
                    <span className="font-semibold text-zinc-900 text-sm">{selectedOrder.customerName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Email :</span>
                    <span className="font-medium text-zinc-800">{selectedOrder.customerEmail || '—'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Adresse de livraison :</span>
                    <span className="font-medium text-zinc-800">
                      {selectedOrder.shippingAddress?.street || selectedOrder.street || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Ville & Code postal :</span>
                    <span className="font-medium text-zinc-800">
                      {selectedOrder.shippingAddress?.city || selectedOrder.city || '—'}{' '}
                      {selectedOrder.shippingAddress?.postalCode ? `(${selectedOrder.shippingAddress.postalCode})` : ''}
                    </span>
                  </div>
                  {selectedOrder.phone && (
                    <div>
                      <span className="text-zinc-400 block">Téléphone :</span>
                      <span className="font-semibold text-zinc-900">{selectedOrder.phone}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-zinc-400 block">Mode de règlement :</span>
                    <span className="font-semibold text-zinc-800">
                      {selectedOrder.paymentMethod || 'Paiement à la livraison'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ordered Items List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                  Articles Commandés ({selectedOrder.items?.length || 0})
                </h3>
                <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-100">
                  {(selectedOrder.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-zinc-50">
                      <div className="space-y-0.5">
                        <p className="font-bold text-zinc-900 text-sm">{item.name || item.slug}</p>
                        <p className="text-zinc-400 text-[11px]">
                          Quantité : <span className="font-semibold text-zinc-700">{item.quantity}</span> × {item.unitPrice} DT
                        </p>
                      </div>
                      <div className="font-bold text-zinc-900 text-sm">
                        {((item.quantity || 1) * (item.unitPrice || 0)).toFixed(2)} DT
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Summary */}
                <div className="flex justify-between items-center p-3 rounded-xl bg-[#116B36]/8 border border-[#116B36]/20">
                  <span className="font-bold text-sm text-[#116B36]">Montant Total de la Commande</span>
                  <span className="font-black text-lg text-[#116B36]">
                    {(selectedOrder.totalAmount ?? selectedOrder.total ?? 0).toFixed(2)} DT
                  </span>
                </div>
              </div>

              {/* Status Update from Modal */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 font-medium">Modifier le statut :</span>
                  <select
                    value={selectedOrder.status || 'PENDING'}
                    onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                    className="text-xs border border-zinc-200 rounded-lg px-2.5 py-1.5 bg-white font-medium"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
