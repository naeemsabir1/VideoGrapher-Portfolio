'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { VideoItem, CategoryMeta } from '@/types';
import { VideoPlayer, VideoPlayerRef } from '@/components/video/VideoPlayer';
import { VideoInfoHUD } from '@/components/feed/VideoInfoHUD';
import { VideoActions } from '@/components/feed/VideoActions';
import { VideoDetailsPanel } from '@/components/feed/VideoDetailsPanel';
import { ContactModal } from '@/components/ui/ContactModal';
import { useContact } from '@/context/ContactContext';

import { Play, Pause, ChevronLeft, VolumeX, Volume2 } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface VideoFeedClientProps {
  videos: VideoItem[];
  categoryMeta: CategoryMeta;
}

export function VideoFeedClient({ videos, categoryMeta }: VideoFeedClientProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isGlobalMuted, setIsGlobalMuted] = useState(true);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  const { isOpen: contactModalOpen, openModal: openContactModal, closeModal: closeContactModal } = useContact();
  const [progress, setProgress] = useState(0);
  const [indicator, setIndicator] = useState<{ type: 'play' | 'pause'; id: number } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const playerRefs = useRef<(VideoPlayerRef | null)[]>([]);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Intersection Observer to detect which video is currently in view
  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      threshold: 0.6, // Adjusted slightly so it triggers when mostly visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'));
          setCurrentIndex(index);
          setIsPaused(false);
          setProgress(0);
          
          playerRefs.current.forEach((player, i) => {
            if (i === index) {
              if (!prefersReducedMotion) {
                player?.play();
              }
            } else {
              player?.pause();
              player?.reset();
            }
          });
        }
      });
    }, observerOptions);

    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // Programmatic scrolling helper
  const scrollToIndex = useCallback((index: number) => {
    if (index >= 0 && index < videos.length) {
      slideRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [videos.length]);

  // Play/Pause toggle on click
  const togglePlayPause = useCallback(() => {
    const activePlayer = playerRefs.current[currentIndex];
    if (isPaused || prefersReducedMotion) { // If prefers reduced motion, it might be paused by default
      activePlayer?.play();
      setIsPaused(false);
      setIndicator({ type: 'play', id: Date.now() });
    } else {
      activePlayer?.pause();
      setIsPaused(true);
      setIndicator({ type: 'pause', id: Date.now() });
    }
  }, [currentIndex, isPaused, prefersReducedMotion]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (detailsPanelOpen || contactModalOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToIndex(currentIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToIndex(currentIndex - 1);
      } else if (e.key === ' ' || e.code === 'Space') {
        // Only trigger if not typing in an input/textarea (like contact form)
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
        e.preventDefault();
        togglePlayPause();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, scrollToIndex, detailsPanelOpen, contactModalOpen, togglePlayPause]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>, index: number) => {
    if (index === currentIndex) {
      const videoEl = e.currentTarget;
      const currentProgress = (videoEl.currentTime / (videoEl.duration || 1)) * 100;
      setProgress(currentProgress);
    }
  };

  // Swipe gesture support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartRef.current.y - touchEndY;

    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        scrollToIndex(currentIndex + 1);
      } else {
        scrollToIndex(currentIndex - 1);
      }
    }
    touchStartRef.current = null;
  };

  const activeVideo = videos[currentIndex] || null;

  if (videos.length === 0) {
    return (
      <div className="w-full h-[100dvh] flex flex-col items-center justify-center bg-[var(--text-primary)] text-[var(--bg-base)] p-6 text-center">
        <span className="text-6xl mb-4" aria-hidden="true">{categoryMeta.emoji || '🎬'}</span>
        <h2 className="text-2xl font-bold mb-2 font-display">No videos in this category yet.</h2>
        <p className="text-gray-400 mb-8">Check back soon.</p>
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 px-6 py-3 bg-[var(--bg-base)] text-[var(--text-primary)] rounded-full font-semibold hover:bg-gray-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-terra)] focus-visible:outline-offset-2"
          aria-label="Go back to categories"
        >
          <ChevronLeft className="w-5 h-5" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[100dvw] h-[100dvh] overflow-x-hidden bg-[var(--text-primary)] grid grid-cols-1 md:grid-cols-[55%_45%] relative z-[10000]">
      <ContactModal 
        isOpen={contactModalOpen} 
        onClose={closeContactModal} 
      />
      
      {/* Left Column: Feed */}
      <div 
        id="main-content"
        ref={containerRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden relative scroll-smooth overscroll-y-contain"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
        aria-label="Video feed"
      >
        {videos.map((video, index) => (
          <div 
            key={video.id}
            data-index={index}
            ref={(el) => { slideRefs.current[index] = el; }}
            className="w-full h-[100dvh] snap-start relative flex items-center justify-center bg-[var(--text-primary)] cursor-pointer overflow-hidden focus-visible:outline focus-visible:outline-4 focus-visible:outline-[var(--accent-terra)] focus-visible:-outline-offset-4"
            onClick={togglePlayPause}
            tabIndex={0}
            aria-label={`Video ${index + 1}: ${video.title}`}
          >
            {/* Progress Bar */}
            {currentIndex === index && (
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--bg-base)]/20 z-50">
                <div 
                  className="h-full bg-[var(--accent-terra)] transition-[width] duration-300 ease-linear" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            )}

            {/* Video Counter Indicator */}
            <div className="absolute top-4 right-4 z-40 bg-[rgba(28,23,20,0.5)] text-[var(--bg-base)] font-body text-[11px] px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
              {index + 1} / {videos.length}
            </div>

            <VideoPlayer
              ref={(el) => { playerRefs.current[index] = el; }}
              url={Math.abs(currentIndex - index) <= 1 ? video.imageKitUrl : undefined}
              title={video.title}
              thumbnailUrl={video.thumbnailUrl}
              priority={index === 0}
              aspectRatio={video.aspectRatio}
              autoPlay={index === 0 && !prefersReducedMotion}
              muted={isGlobalMuted}
              loop={true}
              onTimeUpdate={(e) => handleTimeUpdate(e, index)}
            />
            
            {/* Play/Pause indicator overlay */}
            <AnimatePresence>
              {indicator && currentIndex === index && !prefersReducedMotion && (
                <motion.div
                  key={indicator.id}
                  initial={{ scale: 0.8, opacity: 1 }}
                  animate={{ scale: [0.8, 1.0, 1.2], opacity: [1, 1, 0] }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  onAnimationComplete={() => setIndicator(null)}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
                >
                  {indicator.type === 'play' ? (
                    <Play className="w-[48px] h-[48px] text-[var(--bg-base)] fill-white" />
                  ) : (
                    <Pause className="w-[48px] h-[48px] text-[var(--bg-base)] fill-white" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mute Toggle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsGlobalMuted(!isGlobalMuted);
              }}
              className="absolute bottom-[120px] left-[12px] w-[48px] h-[48px] rounded-full flex items-center justify-center bg-[#F7F3EE]/15 backdrop-blur-[8px] border border-white/20 text-[var(--bg-base)] hover:bg-[rgba(192,96,58,0.85)] hover:border-transparent transition-colors duration-200 z-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-terra)] focus-visible:outline-offset-2"
              aria-label={isGlobalMuted ? "Unmute video" : "Mute video"}
            >
              {isGlobalMuted ? <VolumeX className="w-[22px] h-[22px]" /> : <Volume2 className="w-[22px] h-[22px]" />}
            </button>

            {/* Mobile Bottom HUD */}
            <VideoInfoHUD 
              variant="mobile" 
              video={video} 
              isActive={currentIndex === index} 
              onDetailsOpen={() => setDetailsPanelOpen(true)} 
              onContactClick={openContactModal}
            />

            {/* Right-side action buttons (mobile only) */}
            <div className="md:hidden">
              <VideoActions
                isActive={currentIndex === index}
                onDetailsOpen={() => setDetailsPanelOpen(true)}
                onContactClick={openContactModal}
                onNext={() => scrollToIndex(index + 1)}
              />
            </div>

            {/* Slide-up Drawer */}
            <VideoDetailsPanel
              video={video}
              isOpen={detailsPanelOpen && currentIndex === index}
              onClose={() => setDetailsPanelOpen(false)}
              onContactClick={openContactModal}
            />
          </div>
        ))}
      </div>

      {/* Right Column: Desktop Info */}
      <div className="hidden md:block h-full bg-[var(--bg-base)] border-l border-[var(--border-subtle)] relative z-10">
        {activeVideo && (
          <div key={activeVideo.id} className="w-full h-full animate-in fade-in duration-500 fill-mode-both">
            <VideoInfoHUD 
              variant="desktop" 
              video={activeVideo} 
              isActive={true} 
              onDetailsOpen={() => {}} 
              onContactClick={openContactModal}
            />
          </div>
        )}
      </div>
    </div>
  );
}
