'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Star, StarOff } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  KEYCHAINS: 'Porte-clés',
  PHONE_STANDS: 'Supports téléphone',
  GAMING_ACCESSORIES: 'Gaming',
  DECORATION: 'Décoration',
  GIFTS: 'Cadeaux',
  PIGGY_BANKS: 'Tirelires',
  UTILITY: 'Utilitaires',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, { price?: number; stock?: number }>>({});

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchProducts(); }, []);

  function setEdit(id: string, field: 'price' | 'stock', value: number) {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? {}), [field]: value },
    }));
  }

  async function saveEdit(id: string) {
    const changes = edits[id];
    if (!changes) return;
    setSaving(id);
    await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...changes }),
    });
    setSaving(null);
    setEdits((prev) => { const n = { ...prev }; delete n[id]; return n; });
    fetchProducts();
  }

  async function toggleFeatured(product: any) {
    setSaving(product._id);
    await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: product._id, featured: !product.featured }),
    });
    setSaving(null);
    fetchProducts();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 mb-1">Produits</h1>
          <p className="text-sm text-zinc-400">{products.length} produit(s) dans le catalogue</p>
        </div>
        <button
          onClick={fetchProducts}
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
                <th className="text-left px-5 py-3 font-medium">Produit</th>
                <th className="text-left px-5 py-3 font-medium">Catégorie</th>
                <th className="text-left px-5 py-3 font-medium">Prix (DT)</th>
                <th className="text-left px-5 py-3 font-medium">Stock</th>
                <th className="text-left px-5 py-3 font-medium">En vedette</th>
                <th className="text-left px-5 py-3 font-medium">Sauvegarder</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-400 text-xs">Chargement...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-400 text-xs">Aucun produit trouvé</td>
                </tr>
              ) : (
                products.map((product: any) => {
                  const hasEdits = !!edits[product._id];
                  const lowStock = (edits[product._id]?.stock ?? product.stock) <= 3;
                  return (
                    <tr key={product._id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-medium text-zinc-800 text-sm">{product.titleEn ?? product.title ?? '—'}</p>
                        <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{product.titleFr ?? ''}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded border border-zinc-200">
                          {CATEGORY_LABELS[product.category] ?? product.category}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={edits[product._id]?.price ?? product.price ?? 0}
                          onChange={(e) => setEdit(product._id, 'price', parseFloat(e.target.value))}
                          className="w-20 text-xs border border-zinc-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#116B36]/50 focus:border-[#116B36]"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={edits[product._id]?.stock ?? product.stock ?? 0}
                            onChange={(e) => setEdit(product._id, 'stock', parseInt(e.target.value))}
                            className={`w-16 text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#116B36]/50 focus:border-[#116B36] ${
                              lowStock ? 'border-red-300 bg-red-50 text-red-700' : 'border-zinc-200'
                            }`}
                          />
                          {lowStock && (
                            <span className="text-xs text-red-500">faible</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => toggleFeatured(product)}
                          disabled={saving === product._id}
                          className="text-zinc-300 hover:text-[#116B36] transition-colors disabled:opacity-50"
                          title={product.featured ? 'Retirer de la vitrine' : 'Mettre en vedette'}
                        >
                          {product.featured ? (
                            <Star size={16} className="fill-[#116B36] text-[#116B36]" />
                          ) : (
                            <StarOff size={16} />
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => saveEdit(product._id)}
                          disabled={!hasEdits || saving === product._id}
                          className="text-xs bg-[#116B36] text-white px-3 py-1 rounded-md hover:bg-[#0e5a2d] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {saving === product._id ? '...' : 'Sauver'}
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
    </div>
  );
}
