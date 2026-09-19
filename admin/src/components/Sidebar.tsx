'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Hammer,
  BarChart3,
  LogOut,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analytics', label: 'Statistiques & Analytics', icon: BarChart3 },
  { href: '/custom-orders', label: 'Commandes custom', icon: Hammer },
  { href: '/orders', label: 'Commandes', icon: ShoppingCart },
  { href: '/products', label: 'Produits', icon: Package },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-zinc-200 flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#116B36] rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-900 leading-none">CBV-3D</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Administration</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors group
                ${active
                  ? 'bg-[#116B36]/8 text-[#116B36]'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}
              `}
            >
              <Icon
                size={16}
                className={`transition-colors ${active ? 'text-[#116B36]' : 'text-zinc-400 group-hover:text-zinc-700'}`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors w-full group"
        >
          <LogOut size={16} className="text-zinc-400 group-hover:text-red-500 transition-colors" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
