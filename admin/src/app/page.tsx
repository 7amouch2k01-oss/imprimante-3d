import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import CustomRequest from '@/lib/models/CustomRequest';
import Product from '@/lib/models/Product';
import { ShoppingCart, Hammer, Package, AlertTriangle } from 'lucide-react';

async function getStats() {
  try {
    await dbConnect();
    const [totalOrders, pendingCustom, totalProducts, lowStock] = await Promise.all([
      Order.countDocuments({}),
      CustomRequest.countDocuments({ status: 'PENDING' }),
      Product.countDocuments({}),
      Product.countDocuments({ stock: { $lte: 3 } }),
    ]);

    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    const revenue = revenueResult[0]?.total ?? 0;

    return { totalOrders, pendingCustom, totalProducts, lowStock, revenue };
  } catch {
    return { totalOrders: 0, pendingCustom: 0, totalProducts: 0, lowStock: 0, revenue: 0 };
  }
}

async function getRecentOrders() {
  try {
    await dbConnect();
    return await Order.find({}).sort({ createdAt: -1 }).limit(5).lean();
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const stats = await getStats();
  const recentOrders = await getRecentOrders();

  const statCards = [
    {
      label: 'Commandes totales',
      value: stats.totalOrders,
      icon: ShoppingCart,
      sub: `${stats.revenue.toFixed(2)} DT de chiffre`,
    },
    {
      label: 'Demandes custom en attente',
      value: stats.pendingCustom,
      icon: Hammer,
      sub: 'À traiter',
    },
    {
      label: 'Produits catalogue',
      value: stats.totalProducts,
      icon: Package,
      sub: 'Références actives',
    },
    {
      label: 'Stock critique',
      value: stats.lowStock,
      icon: AlertTriangle,
      sub: 'Produits ≤ 3 unités',
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900 mb-1">Dashboard</h1>
      <p className="text-sm text-zinc-400 mb-8">Vue d&apos;ensemble — CBV-3D</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon, sub }) => (
          <div key={label} className="bg-white border border-zinc-200 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-zinc-400 font-medium">{label}</p>
                <p className="text-3xl font-bold text-zinc-900 mt-1">{value}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center">
                <Icon size={16} className="text-zinc-500" />
              </div>
            </div>
            <p className="text-xs text-zinc-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-800">Commandes récentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-zinc-400 border-b border-zinc-100">
                <th className="text-left px-5 py-3 font-medium">Client</th>
                <th className="text-left px-5 py-3 font-medium">Ville</th>
                <th className="text-left px-5 py-3 font-medium">Total</th>
                <th className="text-left px-5 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-zinc-400 text-xs">
                    Aucune commande pour le moment
                  </td>
                </tr>
              ) : (
                recentOrders.map((order: any) => (
                  <tr key={order._id?.toString()} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-zinc-800">{order.customerName ?? '—'}</td>
                    <td className="px-5 py-3 text-zinc-500">{order.city ?? '—'}</td>
                    <td className="px-5 py-3 text-zinc-700">{order.total?.toFixed(2)} DT</td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded border border-zinc-200">
                        {order.status}
                      </span>
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
