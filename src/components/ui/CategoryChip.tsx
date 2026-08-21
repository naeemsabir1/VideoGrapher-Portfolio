import { cn } from '@/lib/utils';
import { VideoCategory } from '@/types';
import { CATEGORIES } from '@/data/categories';

interface CategoryChipProps {
  category: VideoCategory;
  size?: 'sm' | 'md';
  className?: string;
}

export function CategoryChip({ category, size = 'md', className }: CategoryChipProps) {
  const meta = CATEGORIES.find(c => c.slug === category);
  if (!meta) return null;

  return (
    <span 
      className={cn(
        "inline-flex items-center bg-[var(--accent-sage)] text-[var(--text-primary)] font-medium rounded-[var(--radius-pill)] shadow-sm label-text",
        size === 'sm' ? "text-[12px] px-[10px] py-[6px]" : "text-[13px] px-[14px] py-[8px]",
        className
      )}
    >
      {meta.emoji && <span className="mr-1.5 text-base" aria-hidden="true">{meta.emoji}</span>}
      {meta.label}
    </span>
  );
}
