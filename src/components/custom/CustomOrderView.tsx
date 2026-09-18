'use client';

import React, { useState } from 'react';
import { Locale } from '@/lib/i18n/config';
import {
  Sparkles,
  Send,
  CheckCircle2,
  Phone,
  MessageCircle,
  HelpCircle,
  Palette,
  Ruler,
  FileText,
  Tag,
} from 'lucide-react';

interface CustomOrderViewProps {
  locale: Locale;
  dictionary: any;
}

const CATEGORIES = [
  {
    id: 'KEYCHAINS',
    icon: '🔑',
    labelFr: 'Porte-clés personnalisés',
    labelEn: 'Custom Keychains',
    descFr: 'Prénom, marque voiture, logo, initiales, flexible (5 – 16 DT)',
    descEn: 'Name, car brand, logo, initials, flexible (5 – 16 DT)',
    priceRange: '5 - 16 DT',
  },
  {
    id: 'PHONE_STANDS',
    icon: '📱',
    labelFr: 'Supports téléphone',
    labelEn: 'Phone Stands',
    descFr: 'Support bureau, voiture, designs anime/gaming, prénom gravé',
    descEn: 'Desk stand, car holder, anime/gaming theme, custom name',
    priceRange: '15 - 28 DT',
  },
  {
    id: 'GAMING_ACCESSORIES',
    icon: '🎧',
    labelFr: 'Accessoires gaming',
    labelEn: 'Gaming Accessories',
    descFr: 'Support casque, support manette PS5/Xbox, passe-câbles',
    descEn: 'Headset stand, PS5/Xbox controller dock, cable management',
    priceRange: '20 - 45 DT',
  },
  {
    id: 'DECORATION',
    icon: '🏠',
    labelFr: 'Décoration & Maison',
    labelEn: 'Home & 3D Decor',
    descFr: 'Prénoms 3D, calligraphie arabe/islamique, fleurs, vases facettés',
    descEn: '3D names, Arabic calligraphy, flowers, faceted modern vases',
    priceRange: '20 - 55 DT',
  },
  {
    id: 'GIFTS',
    icon: '🎁',
    labelFr: 'Cadeaux personnalisés',
    labelEn: 'Custom Gifts',
    descFr: 'Prénom + date, cadeau couple, anniversaire, souvenir diplôme',
    descEn: 'Name + date, couple keepsakes, birthday, graduation gift',
    priceRange: '25 - 60 DT',
  },
  {
    id: 'PIGGY_BANKS',
    icon: '🪙',
    labelFr: 'Tirelires 3D',
    labelEn: '3D Piggy Banks',
    descFr: 'Formes voitures, animaux, gaming avec prénom gravé',
    descEn: 'Cars, animals, gaming characters with custom name',
    priceRange: '18 - 35 DT',
  },
  {
    id: 'UTILITY',
    icon: '🧰',
    labelFr: 'Objets Utilitaires',
    labelEn: 'Utility & Tools',
    descFr: 'Accroche-clés mural, porte-stylo, crochets, organisateurs',
    descEn: 'Wall key holder, pen organizers, hooks, smart brackets',
    priceRange: '6 - 25 DT',
  },
];

export function CustomOrderView({ locale, dictionary }: CustomOrderViewProps) {
  const isFr = locale === 'fr';

  const [selectedCat, setSelectedCat] = useState<string>('KEYCHAINS');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customText, setCustomText] = useState('');
  const [colorPreference, setColorPreference] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/custom-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          category: selectedCat,
          customText,
          colorPreference,
          dimensions,
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Error sending request');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour CBV 3D Printing ! Je souhaite commander un produit personnalisé :
Catégorie: ${selectedCat}
Texte / Prénom: ${customText || 'À préciser'}
Couleur: ${colorPreference || 'À préciser'}
Mon nom: ${customerName || ''}`
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-50 text-eco-600 border border-eco-200 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isFr ? 'Sur-Mesure & Personnalisation' : 'Custom 3D Printing On-Demand'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-charcoal-black tracking-tight">
          {isFr ? 'Commandez Votre Produit 3D Personnalisé' : 'Request Your Custom 3D Printed Creation'}
        </h1>
        <p className="text-sm sm:text-base text-charcoal-muted max-w-2xl mx-auto leading-relaxed">
          {isFr
            ? 'Vous avez une idée, un prénom, un logo ou un modèle précis en tête ? Notre équipe fabrique votre pièce sur nos imprimantes 3D en Tunisie avec livraison rapide.'
            : 'Have a personalized name, car brand, 3D gift or special design in mind? Our additive team will manufacture and ship it across Tunisia.'}
        </p>
      </div>

      {submitted ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-surface-light border-2 border-eco-500/30 text-center space-y-6 shadow-xl animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-eco-100 text-eco-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-charcoal-black">
              {isFr ? 'Demande Reçue avec Succès !' : 'Custom Request Received!'}
            </h2>
            <p className="text-sm text-charcoal-muted max-w-md mx-auto">
              {isFr
                ? 'Merci ! Notre équipe vous contactera par téléphone ou WhatsApp dans les plus brefs délais pour confirmer le prix et le délai de fabrication.'
                : 'Thank you! Our team will contact you via phone or WhatsApp shortly to confirm pricing, preview design, and delivery.'}
            </p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/21699999999?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm shadow-md transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{isFr ? 'Discuter sur WhatsApp' : 'Direct WhatsApp Chat'}</span>
            </a>
            <button
              onClick={() => {
                setSubmitted(false);
                setCustomText('');
                setNotes('');
              }}
              className="px-6 py-3.5 rounded-xl bg-surface-subtle hover:bg-surface-border text-charcoal-black font-bold text-sm transition-all"
            >
              {isFr ? 'Nouvelle Commande' : 'New Request'}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Category Selection Grid */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-charcoal-black flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-eco-500 text-white text-xs flex items-center justify-center font-black">
                1
              </span>
              <span>{isFr ? 'Choisissez votre catégorie' : 'Choose category'}</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCat(cat.id)}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-eco-500 bg-eco-50/50 shadow-md ring-2 ring-eco-500/20'
                        : 'border-surface-border bg-surface-light hover:border-charcoal/30'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="text-2xl">{cat.icon}</div>
                      <h3 className="text-sm font-bold text-charcoal-black">
                        {isFr ? cat.labelFr : cat.labelEn}
                      </h3>
                      <p className="text-xs text-charcoal-muted leading-relaxed">
                        {isFr ? cat.descFr : cat.descEn}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-surface-border/60 flex items-center justify-between text-[11px] font-bold text-eco-600">
                      <span>{cat.priceRange}</span>
                      {isSelected && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-eco-500 text-white">
                          ✓
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Customization Inputs */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface-light border border-surface-border space-y-6 shadow-sm">
            <label className="block text-sm font-bold text-charcoal-black flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-eco-500 text-white text-xs flex items-center justify-center font-black">
                2
              </span>
              <span>{isFr ? 'Détails de personnalisation' : 'Customization details'}</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-charcoal-black flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-eco-500" />
                  <span>
                    {isFr
                      ? 'Texte à imprimer (Prénom, Marque, Initiales, Date, etc.)'
                      : 'Text to print (Name, Car model, Initials, Date)'}
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={
                    isFr ? 'Ex: Mohamed / BMW M / 18-09-2026 / Club Gaming' : 'Ex: Alex / BMW / Love'
                  }
                  className="w-full px-4 py-3 rounded-xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500 text-sm text-charcoal-black font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-black flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-eco-500" />
                  <span>{isFr ? 'Couleur(s) préférée(s)' : 'Color preference'}</span>
                </label>
                <input
                  type="text"
                  value={colorPreference}
                  onChange={(e) => setColorPreference(e.target.value)}
                  placeholder={isFr ? 'Ex: Noir mat & Or, Rouge, Blanc...' : 'Ex: Matte Black, Red...'}
                  className="w-full px-4 py-3 rounded-xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500 text-sm text-charcoal-black"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-black flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-eco-500" />
                  <span>{isFr ? 'Dimensions souhaitées (optionnel)' : 'Dimensions (optional)'}</span>
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder={isFr ? 'Ex: Environ 8 cm, Taille standard...' : 'Ex: 10 cm, Compact...'}
                  className="w-full px-4 py-3 rounded-xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500 text-sm text-charcoal-black"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-charcoal-black flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-eco-500" />
                  <span>{isFr ? 'Précisions supplémentaires / Idée' : 'Additional Notes / Ideas'}</span>
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    isFr
                      ? 'Décrivez votre besoin en détail (style d’écriture, support avec trou pour chargeur, etc.)'
                      : 'Describe your vision, specific angles or special requirements...'
                  }
                  className="w-full px-4 py-3 rounded-xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500 text-sm text-charcoal-black"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Contact Details (Tunisia) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface-light border border-surface-border space-y-6 shadow-sm">
            <label className="block text-sm font-bold text-charcoal-black flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-eco-500 text-white text-xs flex items-center justify-center font-black">
                3
              </span>
              <span>{isFr ? 'Vos Coordonnées (Tunisie)' : 'Contact Details (Tunisia)'}</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-black">
                  {isFr ? 'Nom & Prénom' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={isFr ? 'Ex: Oussema Ben Said' : 'Full Name'}
                  className="w-full px-4 py-3 rounded-xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500 text-sm text-charcoal-black font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-black flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-eco-500" />
                  <span>{isFr ? 'Numéro de Téléphone / WhatsApp' : 'Phone / WhatsApp'} *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+216 -- --- ---"
                  className="w-full px-4 py-3 rounded-xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500 text-sm text-charcoal-black font-medium"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-charcoal-black">
                  {isFr ? 'Email (optionnel)' : 'Email (optional)'}
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="contact@exemple.com"
                  className="w-full px-4 py-3 rounded-xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500 text-sm text-charcoal-black"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-semibold border border-red-200">
              {error}
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-eco-500 hover:bg-eco-600 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>
                {submitting
                  ? isFr
                    ? 'Envoi en cours...'
                    : 'Sending...'
                  : isFr
                  ? 'Envoyer la Demande de Personnalisation'
                  : 'Submit Custom Request'}
              </span>
            </button>

            <a
              href={`https://wa.me/21699999999?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-surface-light border border-surface-border hover:border-charcoal/30 text-charcoal-black font-bold text-sm shadow-xs transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>{isFr ? 'Commander directement via WhatsApp' : 'Order via WhatsApp'}</span>
            </a>
          </div>
        </form>
      )}
    </div>
  );
}
