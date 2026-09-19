'use client';

import { useEffect, useState } from 'react';
import StatusBadge from '@/components/StatusBadge';
import { MessageSquare, RefreshCw } from 'lucide-react';

const STATUSES = ['PENDING', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED'];

const CATEGORY_LABELS: Record<string, string> = {
  KEYCHAINS: 'Porte-clés',
  PHONE_STANDS: 'Supports téléphone',
  GAMING_ACCESSORIES: 'Accessoires gaming',
  DECORATION: 'Décoration',
  GIFTS: 'Cadeaux',
  PIGGY_BANKS: 'Tirelires',
  UTILITY: 'Utilitaires',
};

export default function CustomOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch('/api/custom-orders');
      const data = await res.json();
      const list = data.requests || data.orders || [];
      setOrders(list);
    } catch (e) {
      console.error('Failed to fetch custom orders:', e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchOrders(); }, []);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    await fetch('/api/custom-orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    await fetchOrders();
    setUpdating(null);
  }

  function whatsappLink(order: any) {
    const rawPhone = order.customerPhone || order.phone || '';
    const phone = rawPhone.replace(/\D/g, '');
    const name = order.customerName || order.name || 'client';
    const cat = CATEGORY_LABELS[order.category] ?? order.category;
    const msg = encodeURIComponent(
      `Bonjour ${name}, nous avons bien reçu votre demande personnalisée CBV-3D (${cat}). Nous allons vous contacter très bientôt pour confirmer les détails.`
    );
    return `https://wa.me/216${phone}?text=${msg}`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 mb-1">Commandes personnalisées</h1>
          <p className="text-sm text-zinc-400">{orders.length} demande(s) au total</p>
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
                <th className="text-left px-5 py-3 font-medium">Catégorie</th>
                <th className="text-left px-5 py-3 font-medium">Description</th>
                <th className="text-left px-5 py-3 font-medium">Budget</th>
                <th className="text-left px-5 py-3 font-medium">Statut</th>
                <th className="text-left px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-400 text-xs">Chargement...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-400 text-xs">Aucune demande pour le moment</td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order._id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-zinc-800">{order.customerName || order.name || '—'}</p>
                      <p className="text-xs text-zinc-400">{order.customerPhone || order.phone || ''}</p>
                      {order.customerEmail && <p className="text-[11px] text-zinc-400">{order.customerEmail}</p>}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded border border-zinc-200">
                        {CATEGORY_LABELS[order.category] ?? order.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-zinc-600 max-w-xs">
                      {order.customText && (
                        <p className="text-xs font-medium text-zinc-800">
                          Texte: <span className="font-normal">{order.customText}</span>
                        </p>
                      )}
                      {order.colorPreference && (
                        <p className="text-xs text-zinc-500">
                          Couleur: {order.colorPreference}
                        </p>
                      )}
                      {order.dimensions && (
                        <p className="text-xs text-zinc-500">
                          Dim: {order.dimensions}
                        </p>
                      )}
                      {order.notes && (
                        <p className="text-xs text-zinc-500 line-clamp-1 italic">
                          {order.notes}
                        </p>
                      )}
                      {order.description && (
                        <p className="text-xs text-zinc-500 line-clamp-1">{order.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-zinc-700 font-medium text-xs">
                      {order.budget ? `${order.budget} DT` : 'Sur devis'}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
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
                        <a
                          href={whatsappLink(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-400 hover:text-[#116B36] transition-colors"
                          title="WhatsApp"
                        >
                          <MessageSquare size={15} />
                        </a>
                      </div>
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
