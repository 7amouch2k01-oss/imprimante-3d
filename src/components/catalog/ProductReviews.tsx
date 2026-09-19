'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle, Send, User } from 'lucide-react';

interface ReviewItem {
  _id: string;
  rating: number;
  userName: string;
  userCity?: string;
  comment: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
  locale: string;
}

export function ProductReviews({ productId, productName, locale }: ProductReviewsProps) {
  const isFr = locale === 'fr';
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function loadReviews() {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setAvgRating(data.avgRating || 0);
        setTotalReviews(data.totalReviews || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    if (!userName.trim() || !comment.trim()) {
      setErrorMsg(isFr ? 'Veuillez remplir votre nom et commentaire.' : 'Please enter your name and comment.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating,
          userName,
          userCity,
          comment,
        }),
      });

      if (res.ok) {
        setSuccessMsg(true);
        setUserName('');
        setUserCity('');
        setComment('');
        setRating(5);
        await loadReviews();
        setTimeout(() => setSuccessMsg(false), 5000);
      } else {
        const d = await res.json();
        setErrorMsg(d.error || (isFr ? 'Erreur lors de l’envoi' : 'Error submitting review'));
      }
    } catch (err) {
      setErrorMsg(isFr ? 'Erreur de connexion' : 'Connection error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="pt-10 border-t border-surface-border space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-charcoal-black tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-eco-500" />
            <span>{isFr ? 'Avis Clients & Évaluations' : 'Customer Reviews & Ratings'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
            {isFr
              ? 'Consultez les retours des clients ou donnez votre note de 1 à 5 étoiles sur cet objet.'
              : 'Read verified maker feedback or submit your 1-5 star review for this product.'}
          </p>
        </div>

        {/* Rating Score Summary */}
        <div className="flex items-center gap-3 bg-surface-subtle p-3 rounded-2xl border border-surface-border self-start sm:self-auto">
          <div className="text-2xl font-black text-charcoal-black">
            {totalReviews > 0 ? avgRating.toFixed(1) : '5.0'}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={`${
                    star <= Math.round(totalReviews > 0 ? avgRating : 5)
                      ? 'fill-[#116B36] text-[#116B36]'
                      : 'text-zinc-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] text-charcoal-subtle font-semibold">
              {totalReviews} {isFr ? 'avis déposé(s)' : 'review(s)'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Reviews List */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="p-8 text-center text-charcoal-muted text-xs bg-surface-subtle rounded-2xl">
              {isFr ? 'Chargement des avis...' : 'Loading reviews...'}
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-8 text-center bg-surface-subtle rounded-2xl border border-surface-border space-y-2">
              <Star className="w-8 h-8 text-zinc-300 mx-auto" />
              <p className="font-bold text-sm text-charcoal-black">
                {isFr ? 'Aucun avis pour l’instant' : 'No reviews yet'}
              </p>
              <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
                {isFr
                  ? 'Soyez le premier à commander et donner votre note de 5 étoiles sur cet article !'
                  : 'Be the first to order and rate this 3D printed model!'}
              </p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-5 rounded-2xl bg-white border border-surface-border shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-eco-50 border border-eco-200 flex items-center justify-center text-eco-600 font-bold text-xs">
                      {rev.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-charcoal-black">{rev.userName}</p>
                      <p className="text-[10px] text-charcoal-subtle font-medium">
                        {rev.userCity || 'Tunisie'} • {new Date(rev.createdAt).toLocaleDateString(isFr ? 'fr-TN' : 'en-US')}
                      </p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={13}
                        className={s <= rev.rating ? 'fill-[#116B36] text-[#116B36]' : 'text-zinc-200'}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-charcoal-muted leading-relaxed whitespace-pre-line pl-10">
                  {rev.comment}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Right: Review Submission Form */}
        <div className="lg:col-span-5 bg-surface-subtle p-6 rounded-2xl border border-surface-border space-y-4">
          <h3 className="font-bold text-sm text-charcoal-black">
            {isFr ? 'Laisser un avis sur ce produit' : 'Write a Review'}
          </h3>

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-eco-50 border border-eco-200 text-eco-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-eco-500 flex-shrink-0" />
              <span>{isFr ? 'Merci ! Votre avis a été publié avec succès.' : 'Thank you! Your review is published.'}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Interactive 5-Star Rating Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                {isFr ? 'Votre note (1 à 5 étoiles)' : 'Your rating (1 to 5 stars)'}
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                      aria-label={`${star} étoiles`}
                    >
                      <Star
                        size={22}
                        className={`transition-colors ${
                          filled ? 'fill-[#116B36] text-[#116B36]' : 'text-zinc-300 hover:text-zinc-400'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-xs font-bold text-eco-600 ml-2">
                  {hoverRating || rating}/5
                </span>
              </div>
            </div>

            {/* Name input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1">
                {isFr ? 'Votre Prénom / Nom *' : 'Your Name *'}
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={isFr ? 'Ex: Youssef, Ameni...' : 'Your name'}
                className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-xs text-charcoal focus:border-eco-500 focus:ring-1 focus:ring-eco-500 outline-none"
              />
            </div>

            {/* City input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1">
                {isFr ? 'Ville (optionnel)' : 'City (optional)'}
              </label>
              <input
                type="text"
                value={userCity}
                onChange={(e) => setUserCity(e.target.value)}
                placeholder={isFr ? 'Ex: Tunis, Sousse, Sfax...' : 'Your city'}
                className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-xs text-charcoal focus:border-eco-500 focus:ring-1 focus:ring-eco-500 outline-none"
              />
            </div>

            {/* Comment textarea */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1">
                {isFr ? 'Votre avis & expérience *' : 'Your comment & feedback *'}
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  isFr
                    ? 'Qualité de finition, précision d’impression 3D, solidité...'
                    : 'Print quality, finish, durability...'
                }
                className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-xs text-charcoal focus:border-eco-500 focus:ring-1 focus:ring-eco-500 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl bg-eco-500 hover:bg-eco-600 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? (isFr ? 'Envoi...' : 'Posting...') : (isFr ? 'Publier mon avis' : 'Submit Review')}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
