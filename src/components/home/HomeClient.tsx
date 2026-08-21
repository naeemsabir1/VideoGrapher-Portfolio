'use client';

import { motion } from 'framer-motion';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { SiteSettings } from '@/lib/settings';
import { CategoryMeta } from '@/types';
import { useEffect, useState } from 'react';

export function HomeClient({ settings, categories }: { settings: SiteSettings, categories: CategoryMeta[] }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPointerFine, setIsPointerFine] = useState(false);

  useEffect(() => {
    // Only apply on devices with a mouse (pointer: fine)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setTimeout(() => setIsPointerFine(mediaQuery.matches), 0);
    
    if (!mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-12 md:pt-24 px-6 md:px-12 max-w-7xl mx-auto w-full selection:bg-[var(--accent-terra)] selection:text-[var(--bg-base)] relative z-0">
      {/* Subtle cursor-following glow */}
      {isPointerFine && (
        <div 
          className="pointer-events-none fixed inset-0 z-[-1] transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 168, 75, 0.08), transparent 40%)`
          }}
        />
      )}

      {/* Header Section */}
      <header className="mb-16 md:mb-24 flex flex-col items-start max-w-3xl">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-[var(--accent-terra)] font-semibold text-sm tracking-widest uppercase mb-4"
        >
          {settings.ownerName}
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-display text-[40px] md:text-[56px] lg:text-[80px] font-extrabold text-[var(--text-primary)] leading-[1.05] tracking-tight mb-6 relative"
        >
          Work that{' '}
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative inline-block"
          >
            moves.
            {/* Wavy terracotta underline */}
            <svg
              className="absolute -bottom-2 left-0 w-full h-auto text-[var(--accent-terra)]"
              viewBox="0 0 160 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
                d="M2 13.5C21.3333 13.5 31 2.5 50.5 2.5C70 2.5 79.5 13.5 99 13.5C118.5 13.5 128.5 2.5 148 2.5"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="text-lg md:text-xl text-[var(--text-secondary)] font-medium max-w-lg"
        >
          {settings.tagline}
        </motion.p>
      </header>

      {/* Main Grid */}
      <main id="main-content" className="flex-grow pb-24 outline-none" tabIndex={-1}>
        <CategoryGrid categories={categories} />
      </main>

      {/* Footer Strip */}
      <footer className="border-t border-[var(--border-subtle)] py-8 mt-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p className="text-sm text-[var(--text-secondary)]">© {new Date().getFullYear()} {settings.ownerName}</p>
        
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-[var(--text-primary)]">
          {settings.availableForWork && (
            <span className="relative flex h-2.5 w-2.5 mr-1 items-center justify-center">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent-terra)] animate-pulse-dot"></span>
            </span>
          )}
          <span className="text-[var(--text-secondary)]">
            {settings.availableForWork ? "Available for work" : "Not available for work"}
          </span>
          <span className="text-[var(--text-secondary)] mx-1 hidden sm:inline">→</span>
          <a
            href={`mailto:${settings.contactEmail}`}
            className="hover:text-[var(--accent-terra)] transition-colors underline decoration-[var(--border-subtle)] underline-offset-4 hover:decoration-[var(--accent-terra)] inline-flex items-center justify-center min-h-[44px] min-w-[44px]"
          >
            {settings.contactEmail}
          </a>
        </div>
      </footer>
    </div>
  );
}
