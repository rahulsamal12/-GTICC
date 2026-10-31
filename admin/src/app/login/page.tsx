'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Building2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }

      router.push('/responses');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#081630] relative overflow-hidden px-4">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#c8a24a]/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#0b1f42]/90 border border-[#c8a24a]/30 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-[#9a7322] via-[#c8a24a] to-[#fce09b] flex items-center justify-center font-black text-black shadow-lg shadow-[#c8a24a]/20">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-serif">GTICC Admin Console</h1>
            <p className="text-[11px] text-[#c8a24a] mt-1.5 uppercase tracking-widest font-semibold">
              Onboarding Submissions Management
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Official Administrator Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gticc.org"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#081630] border border-slate-700/80 focus:border-[#c8a24a] text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Secure Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#081630] border border-slate-700/80 focus:border-[#c8a24a] text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#c8a24a] to-[#b38e3a] hover:from-[#d8b25a] hover:to-[#c8a24a] font-semibold text-black text-sm tracking-wide shadow-lg shadow-[#c8a24a]/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                'Verifying Credentials...'
              ) : (
                <>
                  <span>Sign In to Admin Panel</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">Restricted to authorized GTICC personnel only.</p>
            <p className="text-[10px] text-slate-500 mt-1">Sessions are cryptographically verified and audited.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
