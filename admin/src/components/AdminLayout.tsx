'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FileCheck,
  Building2,
  Award,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Globe2,
  ShieldCheck,
  MailQuestion,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
      })
      .then((data) => {
        setCurrentUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const navItems = [
    { label: 'Onboarding Responses', href: '/responses', icon: FileCheck },
    { label: 'Collaboration Enquiries', href: '/enquiries', icon: MailQuestion },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#081630]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#c8a24a]/30 border-t-[#c8a24a] rounded-full animate-spin" />
          <p className="text-[#c8a24a] font-medium tracking-wide text-xs uppercase">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#061124] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#081630] border-b border-[#c8a24a]/20 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#9a7322] via-[#c8a24a] to-[#fce09b] flex items-center justify-center font-bold text-black text-sm shadow">
            GT
          </div>
          <div>
            <span className="font-bold text-white tracking-wider text-sm font-serif block leading-none">GTICC ADMIN</span>
            <span className="text-[10px] text-[#c8a24a] font-semibold tracking-wider">MANAGEMENT</span>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-[#0e244d] text-slate-200 border border-slate-700/80 hover:text-white"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#081630] border-r border-[#c8a24a]/20 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 shrink-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-[#c8a24a]/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9a7322] via-[#c8a24a] to-[#fce09b] flex items-center justify-center font-black text-black shadow-lg shadow-[#c8a24a]/20 text-base">
              GT
            </div>
            <div>
              <h1 className="font-bold tracking-wider text-base text-white font-serif leading-none">GTICC</h1>
              <p className="text-[10px] font-semibold text-[#c8a24a] tracking-widest uppercase mt-1">Admin Console</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Card */}
        <div className="mx-4 my-4 p-3 rounded-xl bg-[#0c2248] border border-[#c8a24a]/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#183a73] border border-[#c8a24a]/40 flex items-center justify-center font-bold text-xs text-[#c8a24a] shrink-0">
            {currentUser?.name?.substring(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="text-xs font-semibold text-white truncate">{currentUser?.name || 'Administrator'}</p>
            <p className="text-[10px] text-slate-400 capitalize truncate">{currentUser?.role?.replace('_', ' ') || 'Master Admin'}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#c8a24a]/20 to-transparent text-[#c8a24a] border border-[#c8a24a]/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-[#0e254d]'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#c8a24a]' : 'text-slate-400'} />
                <span className="font-semibold">{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-[#c8a24a]" />}
              </Link>
            );
          })}
        </nav>

        {/* Public Website Link & Logout */}
        <div className="p-4 border-t border-[#c8a24a]/15 space-y-2 mt-auto">
          <a
            href={process.env.NEXT_PUBLIC_SITE_URL || '/'}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-[#0e254d] border border-transparent hover:border-slate-700/80 transition-colors"
          >
            <Globe2 size={16} className="text-[#c8a24a]" />
            <span>Open Public Website</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-900/40 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#081630]/95 backdrop-blur-md border-b border-[#c8a24a]/15 shrink-0 z-20">
          <div>
            <h2 className="text-xs font-semibold text-white tracking-widest uppercase font-serif">
              Global Trade & Investment Commercial Community
            </h2>
            <p className="text-[11px] text-[#c8a24a] font-medium">Executive Onboarding & Screening Console</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              MySQL Engine Active
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
