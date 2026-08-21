'use client';

import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { VideoItem } from '@/types';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { Button } from '@/components/ui/button';

interface VideoDetailsPanelProps {
  video: VideoItem | null;
  isOpen: boolean;
  onClose: () => void;
  onContactClick?: () => void;
}

export function VideoDetailsPanel({ video, isOpen, onClose, onContactClick }: VideoDetailsPanelProps) {
  // Drag to close logic
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If dragged down by more than 100px or fast swipe
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && video && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1C171480] z-40 md:hidden"
          />

          {/* Bottom Sheet Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="fixed inset-x-0 bottom-0 h-[70dvh] bg-[var(--bg-card)] rounded-t-[24px] z-50 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col"
          >
            {/* Drag Handle Area */}
            <div className="w-full shrink-0 flex justify-center pt-3 pb-5 cursor-grab active:cursor-grabbing">
              <div className="w-[40px] h-[4px] rounded-full bg-[var(--border-subtle)]" />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 pb-10 scrollbar-none [&::-webkit-scrollbar]:hidden">
              <CategoryChip category={video.category as import('@/types').VideoCategory} size="sm" className="mb-3" />
              
              <h2 className="font-display font-bold text-[24px] text-[var(--text-primary)] mb-4 leading-tight">
                {video.title}
              </h2>
              
              <p className="font-body text-[16px] text-[var(--text-secondary)] mb-6 leading-relaxed">
                {video.description}
              </p>

              {/* Tags Row */}
              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {video.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1.5 bg-[var(--bg-base)] text-[var(--text-secondary)] text-[13px] font-medium rounded-full border border-[var(--border-subtle)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <hr className="border-t border-[var(--border-subtle)] w-full mb-8" />

              <h3 className="font-display font-bold text-[18px] text-[var(--text-primary)] mb-6">
                Interested in this work?
              </h3>

              <Button 
                variant="primary"
                size="lg"
                onClick={() => {
                  onClose();
                  onContactClick?.();
                }}
                className="w-full mb-6"
                icon={<Mail className="w-5 h-5" />}
              >
                Send a message
              </Button>

              <p className="text-center text-[var(--text-secondary)] text-sm">
                or reach out on{' '}
                <Link href="#" className="font-medium text-[var(--text-primary)] underline underline-offset-4 decoration-[var(--border-subtle)] hover:decoration-[var(--accent-terra)] transition-colors">Instagram</Link> 
                {' / '}
                <Link href="#" className="font-medium text-[var(--text-primary)] underline underline-offset-4 decoration-[var(--border-subtle)] hover:decoration-[var(--accent-terra)] transition-colors">LinkedIn</Link>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
