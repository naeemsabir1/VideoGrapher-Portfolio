'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

import { useContact } from '@/context/ContactContext';

interface NavbarProps {
  categoryLabel: string;
}

export function Navbar({ categoryLabel }: NavbarProps) {
  const router = useRouter();
  const { openModal } = useContact();

  return (
    <nav className="fixed top-0 w-full h-[52px] bg-[rgba(247,243,238,0.85)] backdrop-blur-[12px] border-b border-[var(--border-subtle)] flex justify-between items-center px-4 z-50">
      {/* Left side: Back arrow button */}
      <button 
        onClick={() => router.back()}
        className="w-[36px] h-[36px] rounded-full flex items-center justify-center hover:bg-[var(--bg-card)] transition-colors group"
      >
        <ArrowLeft className="w-[18px] h-[18px] text-[var(--text-primary)] group-hover:text-[var(--accent-terra)] transition-colors" />
      </button>

      {/* Center: Category label */}
      <span className="font-display text-[14px] font-bold tracking-[0.05em] uppercase text-[var(--text-primary)]">
        {categoryLabel}
      </span>

      {/* Right side: Contact pill button */}
      <motion.button
        onClick={openModal}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="bg-[var(--accent-terra)] text-[var(--bg-base)] font-body text-[13px] font-semibold py-2 px-4 rounded-full"
      >
        Contact
      </motion.button>
    </nav>
  );
}
