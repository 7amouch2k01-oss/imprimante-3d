'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });

    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError('Code PIN incorrect');
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-[#116B36] rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-900">CBV-3D Admin</h1>
          <p className="text-sm text-zinc-400 mt-1">Entrez votre code PIN</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="password"
              placeholder="Code PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#116B36]/30 focus:border-[#116B36] transition-colors"
              autoFocus
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#116B36] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#0e5a2d] transition-colors disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Accéder au dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
