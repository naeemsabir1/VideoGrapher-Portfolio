'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CategoryMeta } from '@/types';

interface CategoryGridProps {
  categories: CategoryMeta[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
    >
      {categories.map((category, i) => (
        <motion.div
          key={category.slug}
          variants={itemVariants}
          className={
            i === categories.length - 1 && categories.length % 2 !== 0
              ? "col-span-2 md:col-span-1" // Mobile 7th card spans full width
              : ""
          }
        >
          <Link
            href={`/watch/${category.slug}`}
            prefetch={true}
            className="group block h-full min-h-[48px] p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[20px] transition-all duration-200 ease-out hover:-translate-y-[4px] hover:shadow-[0_12px_32px_rgba(28,23,20,0.10)] hover:border-[var(--accent-terra)] relative overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-terra)] focus-visible:outline-offset-2"
            aria-label={`View ${category.label} videos`}
          >
            <div className="flex flex-col h-full">
              <span className="text-3xl md:text-4xl mb-4 block" aria-hidden="true">{category.emoji}</span>
              <h3 className="font-display font-bold text-lg md:text-xl text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-terra)] transition-colors duration-200 ease-out">
                {category.label}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] flex-grow leading-relaxed">
                {category.description}
              </p>
              
              <div className="mt-6 flex justify-end" aria-hidden="true">
                <ArrowRight className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-terra)] group-hover:translate-x-[6px] transition-all duration-200 ease-out" />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
