'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Hammer,
  Package,
  Star,
  RefreshCw,
  Award,
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

const CATEGORY_NAMES: Record<string, string> = {
  KEYCHAINS: 'Porte-clés',
  PHONE_STANDS: 'Supports téléphone',
  GAMING_ACCESSORIES: 'Accessoires Gaming',
  DECORATION: 'Décoration & Maison',
  GIFTS: 'Cadeaux personnalisés',
  PIGGY_BANKS: 'Tirelires 3D',
  UTILITY: 'Utilitaires & Bureau',
};

export default function AnalyticsPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error('Failed to fetch analytics:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 space-y-3">
        <RefreshCw size={24} className="animate-spin text-[#116B36]" />
        <p className="text-xs font-semibold">Calcul des métriques et indicateurs en cours...</p>
      </div>
    );
  }

  const s = data?.summary || {};
  const categories = data?.categoryStats || [];
  const stars = data?.starDistribution || [];
  const customStats = data?.customStats || [];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 mb-1">Rapports & Statistiques Atelier</h1>
          <p className="text-sm text-zinc-400">
            Analyse des ventes, performance du catalogue 3D, demandes sur-mesure et satisfaction client
          </p>
        </div>
        <button
          onClick={loadAnalytics}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors border border-zinc-200 bg-white rounded-xl px-3.5 py-2 self-start sm:self-auto shadow-2xs"
        >
          <RefreshCw size={13} />
          <span>Actualiser les données</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Chiffre d'affaires */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Chiffre Global</span>
            <div className="w-8 h-8 rounded-lg bg-[#116B36]/10 text-[#116B36] flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-zinc-900">
            {(s.totalRevenue || 0).toFixed(2)} <span className="text-sm font-bold text-zinc-500">DT</span>
          </p>
          <p className="text-[11px] text-zinc-400">
            Panier moyen : <span className="font-semibold text-zinc-700">{(s.averageOrderValue || 0).toFixed(2)} DT</span>
          </p>
        </div>

        {/* Card 2: Commandes Boutique */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Commandes Totales</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center">
              <ShoppingCart size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-zinc-900">{s.totalOrders || 0}</p>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
              <Clock size={12} /> {s.pendingOrders || 0} en attente
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-[#116B36] font-semibold">
              <CheckCircle2 size={12} /> {s.completedOrders || 0} livrées
            </span>
          </div>
        </div>

        {/* Card 3: Demandes Sur-Mesure */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Projets Sur-Mesure</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Hammer size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-zinc-900">{s.totalCustomRequests || 0}</p>
          <p className="text-[11px] text-zinc-400">
            <span className="font-semibold text-amber-600">{s.pendingCustomRequests || 0}</span> demande(s) urgente(s) à chiffrer
          </p>
        </div>

        {/* Card 4: Satisfaction Client (5 Stars) */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Satisfaction Moyenne</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star size={16} className="fill-amber-500 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-zinc-900 flex items-baseline gap-1.5">
            {(s.averageRating || 5).toFixed(1)} <span className="text-xs font-bold text-zinc-400">/ 5</span>
          </p>
          <p className="text-[11px] text-zinc-400">
            Basé sur <span className="font-semibold text-zinc-700">{s.totalReviews || 0}</span> avis déposé(s)
          </p>
        </div>
      </div>

      {/* Grid: Category Breakdown & Ratings Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product Catalog Distribution */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-2">
              <Layers size={17} className="text-[#116B36]" />
              <h2 className="text-sm font-bold text-zinc-900">Répartition du Catalogue par Catégorie</h2>
            </div>
            <span className="text-xs font-semibold text-zinc-400">{s.totalProducts || 0} références</span>
          </div>

          <div className="space-y-3.5">
            {categories.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-6">Aucune donnée de catégorie disponible</p>
            ) : (
              categories.map((cat: any) => {
                const total = s.totalProducts || 1;
                const pct = Math.round((cat.count / total) * 100);
                const label = CATEGORY_NAMES[cat._id] || cat._id;

                return (
                  <div key={cat._id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-800">{label}</span>
                      <span className="text-zinc-400">
                        <strong className="text-zinc-900">{cat.count}</strong> objet(s) ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full bg-[#116B36] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Star Ratings Breakdown & Custom Orders Pipeline */}
        <div className="lg:col-span-5 space-y-6">
          {/* Ratings Distribution Card */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-[#116B36]" />
                <h3 className="text-sm font-bold text-zinc-900">Évaluations par Étoiles</h3>
              </div>
              <span className="text-xs font-bold text-zinc-500">{s.totalReviews || 0} notes</span>
            </div>

            <div className="space-y-2.5">
              {[5, 4, 3, 2, 1].map((starVal) => {
                const found = stars.find((x: any) => x._id === starVal);
                const count = found?.count || 0;
                const total = s.totalReviews || 1;
                const pct = s.totalReviews > 0 ? Math.round((count / total) * 100) : 0;

                return (
                  <div key={starVal} className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 w-12 text-zinc-700 font-bold">
                      <span>{starVal}</span>
                      <Star size={12} className="fill-[#116B36] text-[#116B36]" />
                    </div>
                    <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-zinc-400 w-8 text-right font-semibold">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Low Stock Watchlist */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle size={16} />
              <h4 className="text-xs font-bold uppercase tracking-wider">Alerte Stock Atelier</h4>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Il y a actuellement <strong className="text-zinc-900 font-bold">{s.lowStockProducts || 0} produit(s)</strong> avec 3 unités ou moins en réserve. Pensez à relancer l'impression 3D ou mettre à jour le stock.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
