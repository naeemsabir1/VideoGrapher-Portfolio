'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/data/categories';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const sidebarLinks = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    ...CATEGORIES.map(c => ({
      name: c.label,
      href: `/admin/category/${c.slug}`,
      icon: null
    })),
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden font-body">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[var(--text-primary)]/50 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 w-[240px] bg-[#F0EBE4] border-r border-[var(--border-subtle)] transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col shadow-xl md:shadow-none",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-[64px] flex items-center px-6 border-b border-[var(--border-subtle)] shrink-0">
          <span className="font-display font-bold text-lg text-[var(--text-primary)]">
            The Reel — Admin
          </span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 text-[14px] font-medium transition-colors",
                  isActive 
                    ? "bg-[var(--border-subtle)]/50 text-[var(--text-primary)] border-l-4 border-l-[var(--accent-terra)]" 
                    : "text-[var(--text-secondary)] hover:bg-[var(--border-subtle)] hover:text-[var(--text-primary)] border-l-4 border-l-transparent"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {Icon ? (
                  <Icon className="w-[18px] h-[18px]" />
                ) : (
                  <div className="w-[18px] flex justify-center text-[10px] opacity-40">●</div>
                )}
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-[64px] flex items-center justify-between px-4 md:px-8 bg-[#FAFAF8] border-b border-[var(--border-subtle)] shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleMenu}
              className="p-2 -ml-2 rounded-md hover:bg-[var(--text-primary)]/5 md:hidden text-[var(--text-primary)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-terra)] focus-visible:outline-offset-2"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="font-display font-semibold text-[var(--text-primary)] md:hidden">
              Admin
            </h1>
          </div>
          
          <Link
            href="/admin/logout"
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--accent-terra)] hover:bg-[var(--accent-terra)]/10 transition-colors rounded-[var(--radius-pill)] ml-auto"
          >
            <span className="hidden sm:inline">Log Out</span>
            <LogOut className="w-[18px] h-[18px]" />
          </Link>
        </header>

        {/* Scrollable Main */}
        <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-8 outline-none" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
