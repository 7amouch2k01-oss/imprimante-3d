'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Star, StarOff, Plus, Trash2, X, Image as ImageIcon, Check } from 'lucide-react';

const CATEGORIES = [
  { id: 'KEYCHAINS', label: 'Porte-clés' },
  { id: 'PHONE_STANDS', label: 'Supports téléphone' },
  { id: 'GAMING_ACCESSORIES', label: 'Gaming' },
  { id: 'DECORATION', label: 'Décoration' },
  { id: 'GIFTS', label: 'Cadeaux' },
  { id: 'PIGGY_BANKS', label: 'Tirelires' },
  { id: 'UTILITY', label: 'Utilitaires' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, { price?: number; stock?: number }>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Product Form state
  const [titleFr, setTitleFr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionFr, setDescriptionFr] = useState('');
  const [price, setPrice] = useState('15');
  const [stock, setStock] = useState('20');
  const [category, setCategory] = useState('KEYCHAINS');
  const [featured, setFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

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
    setEdits((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
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

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Supprimer définitivement "${title}" ?`)) return;
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    fetchProducts();
  }

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    if (!titleFr.trim() && !titleEn.trim()) {
      setErrorMsg('Veuillez renseigner au moins un titre');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleFr: titleFr.trim() || titleEn.trim(),
          titleEn: titleEn.trim() || titleFr.trim(),
          descriptionFr,
          descriptionEn: descriptionFr,
          price: parseFloat(price) || 10,
          stock: parseInt(stock) || 10,
          category,
          featured,
          images: imageUrl.trim() ? [imageUrl.trim()] : ['/images/hero-printer.jpg'],
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setTitleFr('');
        setTitleEn('');
        setDescriptionFr('');
        setImageUrl('');
        setPrice('15');
        setStock('20');
        fetchProducts();
      } else {
        const d = await res.json();
        setErrorMsg(d.error || 'Erreur lors de la création');
      }
    } catch (err) {
      setErrorMsg('Erreur de connexion');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 mb-1">Gestion du Catalogue</h1>
          <p className="text-sm text-zinc-400">
            {products.length} produit(s) 3D enregistrés dans la boutique
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-xs font-bold text-white bg-[#116B36] hover:bg-[#0e5a2d] transition-colors rounded-xl px-4 py-2.5 shadow-xs"
          >
            <Plus size={15} />
            <span>Nouveau Produit</span>
          </button>
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-800 transition-colors border border-zinc-200 bg-white rounded-xl px-3 py-2.5"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-zinc-400 border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-5 py-3 font-medium">Produit</th>
                <th className="text-left px-5 py-3 font-medium">Catégorie</th>
                <th className="text-left px-5 py-3 font-medium">Prix (DT)</th>
                <th className="text-left px-5 py-3 font-medium">Stock</th>
                <th className="text-left px-5 py-3 font-medium">Vitrine</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-400 text-xs">
                    Chargement des produits...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-400 text-xs">
                    Aucun produit trouvé. Cliquez sur "Nouveau Produit" pour ajouter votre premier article.
                  </td>
                </tr>
              ) : (
                products.map((product: any) => {
                  const hasEdits = !!edits[product._id];
                  const currentStock = edits[product._id]?.stock ?? product.stock;
                  const lowStock = currentStock <= 3;
                  const titleFr = product.translations?.find((t: any) => t.languageCode === 'fr')?.name || product.titleFr;
                  const titleEn = product.translations?.find((t: any) => t.languageCode === 'en')?.name || product.titleEn || product.slug;
                  const displayTitle = titleFr || titleEn;

                  return (
                    <tr key={product._id} className="border-b border-zinc-50 hover:bg-zinc-50/80 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {product.images && product.images[0] ? (
                              <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon size={16} className="text-zinc-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-900 text-sm">{displayTitle}</p>
                            <p className="text-[11px] text-zinc-400 font-mono">/{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-md border border-zinc-200 font-medium">
                          {CATEGORIES.find((c) => c.id === product.category)?.label ?? product.category}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={edits[product._id]?.price ?? product.price ?? 0}
                            onChange={(e) => setEdit(product._id, 'price', parseFloat(e.target.value))}
                            className="w-20 text-xs border border-zinc-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#116B36]/50 focus:border-[#116B36] font-semibold"
                          />
                          <span className="text-xs text-zinc-400 font-bold">DT</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={edits[product._id]?.stock ?? product.stock ?? 0}
                            onChange={(e) => setEdit(product._id, 'stock', parseInt(e.target.value))}
                            className={`w-16 text-xs border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#116B36]/50 focus:border-[#116B36] font-semibold ${
                              lowStock ? 'border-red-300 bg-red-50 text-red-700' : 'border-zinc-200'
                            }`}
                          />
                          {lowStock && (
                            <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                              bas
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => toggleFeatured(product)}
                          disabled={saving === product._id}
                          className="text-zinc-300 hover:text-[#116B36] transition-colors disabled:opacity-50"
                          title={product.featured ? 'Retirer de la vitrine' : 'Mettre en vitrine'}
                        >
                          {product.featured ? (
                            <Star size={16} className="fill-[#116B36] text-[#116B36]" />
                          ) : (
                            <StarOff size={16} />
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => saveEdit(product._id)}
                            disabled={!hasEdits || saving === product._id}
                            className="text-xs bg-[#116B36] text-white px-3 py-1.5 rounded-lg hover:bg-[#0e5a2d] transition-colors disabled:opacity-20 disabled:cursor-not-allowed font-medium"
                          >
                            {saving === product._id ? '...' : 'Sauvegarder'}
                          </button>
                          <button
                            onClick={() => handleDelete(product._id, displayTitle)}
                            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer l'article"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-base font-bold text-zinc-900">Publier un Nouveau Produit 3D</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Nom du produit (Français) *
                </label>
                <input
                  type="text"
                  required
                  value={titleFr}
                  onChange={(e) => setTitleFr(e.target.value)}
                  placeholder="Ex: Porte-clé BMW Personnalisé"
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#116B36]/20 focus:border-[#116B36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Nom du produit (Anglais)
                </label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Ex: Custom 3D BMW Keychain"
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#116B36]/20 focus:border-[#116B36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Prix (DT) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#116B36]/20 focus:border-[#116B36]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Stock initial *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#116B36]/20 focus:border-[#116B36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Catégorie *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#116B36]/20 focus:border-[#116B36]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Lien photo / Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... ou laisser vide pour image par défaut"
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#116B36]/20 focus:border-[#116B36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Description du produit
                </label>
                <textarea
                  rows={3}
                  value={descriptionFr}
                  onChange={(e) => setDescriptionFr(e.target.value)}
                  placeholder="Détails du modèle, filament utilisé (PLA/PETG), dimensions..."
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#116B36]/20 focus:border-[#116B36] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-[#116B36] focus:ring-[#116B36]"
                />
                <label htmlFor="featured-check" className="text-xs font-semibold text-zinc-700 cursor-pointer">
                  Mettre en vedette dans la vitrine d'accueil
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-[#116B36] hover:bg-[#0e5a2d] text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {creating ? 'Publication...' : 'Publier le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
