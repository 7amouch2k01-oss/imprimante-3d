'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';
import { useCart } from '@/lib/store/cart-context';
import { useCurrency } from '@/lib/store/currency-context';
import { ShieldCheck, ArrowLeft, ArrowRight, CheckCircle2, Lock, CreditCard, Truck, User } from 'lucide-react';

interface CheckoutViewProps {
  locale: Locale;
  dictionary: any;
}

export function CheckoutView({ locale, dictionary }: CheckoutViewProps) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { formatPrice, currency } = useCurrency();

  // Multi-step state: 1 = Contact & Address, 2 = Payment Review, 3 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    street: '',
    city: '',
    postalCode: '',
    country: locale === 'fr' ? 'France' : 'United States',
    cardNumber: '4242 •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '•••',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.street || !formData.city || !formData.postalCode) {
        alert(locale === 'fr' ? 'Veuillez remplir tous les champs obligatoires' : 'Please fill all required delivery fields');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const payload = {
        customerEmail: formData.email,
        customerName: formData.fullName,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        items: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          unitPrice: it.price,
        })),
        currency: currency,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Order creation failed');
      }

      const data = await res.json();
      setOrderResult(data.order);
      setStep(3);
      clearCart();
    } catch (err) {
      console.error(err);
      alert('Checkout error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-charcoal">{dictionary.cart.empty}</h2>
        <p className="text-sm text-charcoal-muted">{dictionary.cart.emptySubtitle}</p>
        <Link
          href={`/${locale}/catalog`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-eco-500 text-white font-bold text-sm hover:bg-eco-600 transition-colors shadow-xs"
        >
          <span>{dictionary.cart.startShopping}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Checkout Multi-Step Header Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-md mx-auto relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-surface-border -z-0" />
          
          {/* Step 1 badge */}
          <div className={`relative z-10 flex flex-col items-center gap-1.5`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= 1 ? 'bg-eco-500 text-white shadow-sm ring-4 ring-eco-50' : 'bg-surface-muted text-charcoal-subtle'
            }`}>
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-charcoal">
              {dictionary.checkout.shippingAddress || 'Shipping'}
            </span>
          </div>

          {/* Step 2 badge */}
          <div className={`relative z-10 flex flex-col items-center gap-1.5`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= 2 ? 'bg-eco-500 text-white shadow-sm ring-4 ring-eco-50' : 'bg-surface-muted text-charcoal-subtle'
            }`}>
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-charcoal">
              {dictionary.checkout.paymentDetails || 'Payment'}
            </span>
          </div>

          {/* Step 3 badge */}
          <div className={`relative z-10 flex flex-col items-center gap-1.5`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === 3 ? 'bg-eco-500 text-white shadow-sm ring-4 ring-eco-50' : 'bg-surface-muted text-charcoal-subtle'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-charcoal">Confirmation</span>
          </div>
        </div>
      </div>

      {step === 3 ? (
        /* Step 3: Confirmation Screen */
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-surface-light border border-surface-border text-center space-y-6 shadow-lg">
          <div className="w-16 h-16 rounded-full bg-eco-50 text-eco-500 flex items-center justify-center mx-auto ring-8 ring-eco-50/50">
            <CheckCircle2 className="w-8 h-8 text-eco-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-charcoal-black">
              {dictionary.orderSuccess.title}
            </h1>
            <p className="text-sm text-charcoal-muted leading-relaxed">
              {dictionary.orderSuccess.subtitle}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-charcoal-subtle">{dictionary.orderSuccess.orderNumber}:</span>
              <span className="font-mono font-bold text-charcoal">{orderResult?.orderNumber || 'CBV-98421'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-subtle">{dictionary.orderSuccess.status}:</span>
              <span className="font-bold text-eco-500">{dictionary.orderSuccess.paid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-subtle">Delivery:</span>
              <span className="font-semibold text-charcoal">{formData.street}, {formData.city}</span>
            </div>
          </div>

          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-eco-500 hover:bg-eco-600 text-white font-bold text-sm shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{dictionary.orderSuccess.backHome}</span>
          </Link>
        </div>
      ) : (
        /* Multi-Step Checkout Form & Summary Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Area */}
          <div className="lg:col-span-7 bg-surface-light p-6 sm:p-8 rounded-2xl border border-surface-border shadow-xs">
            <form onSubmit={handleNextStep} className="space-y-6">
              {step === 1 ? (
                /* Step 1: Customer Contact & Shipping */
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
                    <User className="w-5 h-5 text-eco-500" />
                    <h2 className="text-lg font-bold text-charcoal">
                      {dictionary.checkout.contactInfo}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal mb-1">
                        {dictionary.checkout.fullName} *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-subtle text-sm focus:border-eco-500 focus:bg-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal mb-1">
                        {dictionary.checkout.email} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-subtle text-sm focus:border-eco-500 focus:bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-bold uppercase text-charcoal mb-1">
                      {dictionary.checkout.street} *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                      placeholder="123 Additive Tech Boulevard"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-subtle text-sm focus:border-eco-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal mb-1">
                        {dictionary.checkout.city} *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="Paris"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-subtle text-sm focus:border-eco-500 focus:bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal mb-1">
                        {dictionary.checkout.postalCode} *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        placeholder="75001"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-subtle text-sm focus:border-eco-500 focus:bg-white outline-none"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold uppercase text-charcoal mb-1">
                        {dictionary.checkout.country}
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-surface-subtle text-sm focus:border-eco-500 focus:bg-white outline-none"
                      >
                        <option value="France">France</option>
                        <option value="Germany">Germany</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-eco-500 hover:bg-eco-600 text-white font-bold text-sm shadow-md transition-all"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Step 2: Payment Review & Authorization */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-eco-500" />
                      <h2 className="text-lg font-bold text-charcoal">
                        {dictionary.checkout.paymentDetails}
                      </h2>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-eco-500 bg-eco-50 px-2 py-0.5 rounded-md">
                      <Lock className="w-3 h-3" />
                      SSL Mock Stripe
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border space-y-2 text-xs">
                    <p className="font-bold text-charcoal">Delivery Recipient:</p>
                    <p className="text-charcoal-muted">{formData.fullName} • {formData.email}</p>
                    <p className="text-charcoal-muted">{formData.street}, {formData.city} {formData.postalCode}, {formData.country}</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal mb-1">
                        Card Number (Test Simulation)
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        disabled
                        value={formData.cardNumber}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-subtle font-mono text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-charcoal mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          disabled
                          value={formData.cardExpiry}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-subtle font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-charcoal mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          disabled
                          value={formData.cardCvc}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-subtle font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-charcoal-muted hover:text-charcoal flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Address</span>
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-eco-500 hover:bg-eco-600 disabled:opacity-70 text-white font-bold text-sm shadow-md transition-all"
                    >
                      {loading ? (
                        <span>{dictionary.checkout.processing}</span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>{dictionary.checkout.placeOrder}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Order Summary Column */}
          <div className="lg:col-span-5 bg-surface-subtle p-6 rounded-2xl border border-surface-border space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-charcoal">
              {dictionary.checkout.orderSummary}
            </h3>

            {/* List items */}
            <div className="divide-y divide-surface-border max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=200&q=80'}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover border border-surface-border bg-white"
                    />
                    <div>
                      <p className="font-bold text-charcoal line-clamp-1">
                        {locale === 'fr' ? item.titleFr : item.titleEn}
                      </p>
                      <p className="text-charcoal-subtle">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-charcoal">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-3 border-t border-surface-border space-y-1.5 text-xs">
              <div className="flex justify-between text-charcoal-muted">
                <span>{dictionary.cart.subtotal}</span>
                <span className="font-semibold text-charcoal">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal-muted">
                <span>{dictionary.cart.shipping}</span>
                <span className="text-eco-500 font-bold">{dictionary.cart.shippingCalculated}</span>
              </div>
              <div className="flex justify-between text-charcoal font-bold text-base pt-2 border-t border-surface-border">
                <span>{dictionary.cart.total}</span>
                <span className="text-eco-500">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-light border border-surface-border flex items-center gap-2 text-[11px] text-charcoal-subtle">
              <ShieldCheck className="w-4 h-4 text-eco-500 flex-shrink-0" />
              <span>{dictionary.checkout.badge}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
