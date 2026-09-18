'use client';

import { useEffect, useState } from 'react';
import StatusBadge from '@/components/StatusBadge';
import { RefreshCw } from 'lucide-react';

const STATUSES = ['PENDING', 'IN_PRODUCTION', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  async function fetchOrders() {
    setLoading(true);
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchOrders(); }, []);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    await fetchOrders();
    setUpdating(null);
  }

  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum: number, o: any) => sum + (o.total ?? 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 mb-1">Commandes</h1>
          <p className="text-sm text-zinc-400">
            {orders.length} commande(s) — <span className="font-medium text-zinc-700">{totalRevenue.toFixed(2)} DT</span> de chiffre total
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-800 transition-colors border border-zinc-200 rounded-lg px-3 py-2"
        >
          <RefreshCw size={13} />
          Actualiser
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-zinc-400 border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-5 py-3 font-medium">Client</th>
                <th className="text-left px-5 py-3 font-medium">Ville</th>
                <th className="text-left px-5 py-3 font-medium">Téléphone</th>
                <th className="text-left px-5 py-3 font-medium">Articles</th>
                <th className="text-left px-5 py-3 font-medium">Total</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-400 text-xs">Chargement...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-400 text-xs">Aucune commande pour le moment</td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order._id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-zinc-800">{order.customerName ?? '—'}</td>
                    <td className="px-5 py-3 text-zinc-500">{order.city ?? '—'}</td>
                    <td className="px-5 py-3 text-zinc-500 text-xs">{order.phone ?? '—'}</td>
                    <td className="px-5 py-3 text-zinc-500 text-xs">{order.items?.length ?? 0} article(s)</td>
                    <td className="px-5 py-3 font-semibold text-zinc-900">{order.total?.toFixed(2)} DT</td>
                    <td className="px-5 py-3 text-zinc-400 text-xs">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-TN') : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        disabled={updating === order._id}
                        className="text-xs border border-zinc-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#116B36]/50 focus:border-[#116B36] disabled:opacity-50"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
