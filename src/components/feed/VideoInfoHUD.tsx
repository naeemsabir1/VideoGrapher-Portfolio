'use client';

import { motion } from 'framer-motion';
import { VideoItem, VideoCategory } from '@/types';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { Button } from '@/components/ui/button';

interface VideoInfoHUDProps {
  video: VideoItem;
  isActive: boolean;
  onDetailsOpen: () => void;
  onContactClick?: () => void;
  variant?: 'mobile' | 'desktop' | 'both';
}

export function VideoInfoHUD({ video, isActive, onDetailsOpen, onContactClick, variant = 'both' }: VideoInfoHUDProps) {
  return (
    <>
      {/* Mobile Bottom Overlay */}
      {(variant === 'mobile' || variant === 'both') && (
        <motion.div 
          className="absolute bottom-0 left-0 right-0 pt-[64px] pl-[20px] pr-[72px] pb-[32px] bg-gradient-to-t from-[rgba(28,23,20,0.75)] to-transparent md:hidden pointer-events-auto z-10 flex flex-col items-start"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Note: extra pt-[64px] ensures the gradient fades smoothly above the text */}
          <CategoryChip category={video.category as VideoCategory} size="sm" className="mb-2" />
          <h3 className="font-display font-bold text-[20px] text-[var(--bg-base)] mb-3 drop-shadow-md">
            {video.title}
          </h3>
          <Button 
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDetailsOpen();
            }}
            className="border border-[var(--bg-base)]/80 text-[var(--bg-base)]"
          >
            Details ↑
          </Button>
        </motion.div>
      )}

      {/* Desktop Right Panel Info */}
      {(variant === 'desktop' || variant === 'both') && (
        <div className="hidden md:flex flex-col h-full bg-[var(--bg-base)] py-[48px] px-[40px] justify-center w-full relative z-10">
          <div className="w-full max-w-lg mx-auto">
            <CategoryChip category={video.category as VideoCategory} size="md" className="mb-6 bg-[var(--accent-terra)] text-[var(--bg-base)]" />
            <h1 className="font-display font-bold text-[32px] text-[var(--text-primary)] mb-4 leading-tight">
              {video.title}
            </h1>
            <p className="font-body text-[16px] text-[var(--text-secondary)] mb-10 leading-relaxed">
              {video.description}
            </p>
            
            <hr className="border-t border-[var(--border-subtle)] w-full mb-10" />
            
            <h2 className="font-display font-semibold text-[20px] text-[var(--text-primary)] mb-6">
              Let&apos;s work together
            </h2>
            <Button 
              variant="primary"
              size="lg"
              onClick={onContactClick}
              className="w-full mb-4"
            >
              Contact Me
            </Button>
            <p className="text-center text-[var(--text-secondary)] text-[12px]">
              Response within 24 hours ⚡
            </p>
          </div>
        </div>
      )}
    </>
  );
}
