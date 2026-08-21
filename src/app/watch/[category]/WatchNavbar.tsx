'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface WatchNavbarProps {
  categoryName: string;
}

export function WatchNavbar({ categoryName }: WatchNavbarProps) {
  const router = useRouter();

  return (
    <nav className="h-[52px] shrink-0 w-full flex items-center justify-between px-4 z-50 bg-[var(--bg-base)] text-[var(--text-primary)] border-b border-[var(--border-subtle)]">
      <button 
        onClick={() => router.back()} 
        className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-[var(--text-primary)]/5 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      
      <span className="font-display font-bold text-sm tracking-wide uppercase">
        {categoryName}
      </span>
      
      <a 
        href="mailto:hello@example.com"
        className="px-4 py-1.5 text-xs font-semibold bg-[var(--accent-terra)] text-[var(--bg-base)] rounded-[var(--radius-pill)] hover:opacity-90 transition-opacity"
      >
        Contact
      </a>
    </nav>
  );
}
