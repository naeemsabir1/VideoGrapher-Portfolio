'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { VideoItem } from '@/types';
import { X, Play } from 'lucide-react';
import Image from 'next/image';
import { getVideoThumbnailUrl } from '@/lib/imagekit';

interface VideoGalleryDrawerProps {
  /** All videos in the current category */
  videos: VideoItem[];
  /** Currently active video index */
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  /** Called when the user taps a thumbnail to jump to that video */
  onSelectVideo: (index: number) => void;
}

export function VideoGalleryDrawer({
  videos,
  currentIndex,
  isOpen,
  onClose,
  onSelectVideo,
}: VideoGalleryDrawerProps) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  // Drag-to-close
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  // Scroll the active card into view when the drawer opens
  useEffect(() => {
    if (isOpen && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-[2px]"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="fixed inset-x-0 bottom-0 z-[70] bg-[#1a1a1a] rounded-t-[24px] shadow-[0_-10px_60px_rgba(0,0,0,0.5)] flex flex-col"
            style={{ maxHeight: '75dvh' }}
          >
            {/* Drag Handle */}
            <div className="w-full shrink-0 flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-[40px] h-[4px] rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 shrink-0">
              <div>
                <h3 className="font-display font-bold text-[18px] text-white leading-tight">
                  All Videos
                </h3>
                <p className="text-white/50 text-[13px] mt-0.5">
                  {videos.length} video{videos.length !== 1 ? 's' : ''} in this category
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-[36px] h-[36px] rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                aria-label="Close gallery"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Scrollable thumbnail grid */}
            <div className="flex-1 overflow-y-auto px-5 pb-8 scrollbar-none [&::-webkit-scrollbar]:hidden">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {videos.map((video, index) => {
                  const isActive = index === currentIndex;
                  const thumbUrl = video.thumbnailUrl || getVideoThumbnailUrl(video.imageKitUrl, video.aspectRatio);

                  return (
                    <button
                      key={video.id}
                      ref={isActive ? activeRef : null}
                      onClick={() => {
                        onSelectVideo(index);
                        onClose();
                      }}
                      aria-label={`Play ${video.title}`}
                      aria-current={isActive ? 'true' : undefined}
                      className={`
                        relative rounded-[12px] overflow-hidden group focus-visible:outline
                        focus-visible:outline-2 focus-visible:outline-[var(--accent-terra)]
                        focus-visible:outline-offset-2 transition-transform active:scale-95
                        ${isActive ? 'ring-2 ring-[var(--accent-terra)] ring-offset-2 ring-offset-[#1a1a1a]' : ''}
                      `}
                    >
                      {/* Aspect ratio container */}
                      <div
                        className={`
                          w-full bg-black relative
                          ${video.aspectRatio === 'horizontal' ? 'aspect-video' : 'aspect-[9/16]'}
                        `}
                      >
                        {thumbUrl ? (
                          <Image
                            src={thumbUrl}
                            alt={video.title}
                            fill
                            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
                            className="object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                            <Play className="w-5 h-5 text-white/30" />
                          </div>
                        )}

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>

                        {/* Active badge */}
                        {isActive && (
                          <div className="absolute top-1.5 right-1.5 bg-[var(--accent-terra)] rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                            NOW
                          </div>
                        )}

                        {/* Index number */}
                        <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white/80 leading-none">
                          {index + 1}
                        </div>
                      </div>

                      {/* Video title below thumbnail */}
                      <p className="text-[11px] text-white/60 mt-1.5 px-0.5 text-left leading-tight line-clamp-2">
                        {video.title}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
