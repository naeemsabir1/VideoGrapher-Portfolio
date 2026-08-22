'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
  reset: () => void;
}

interface VideoPlayerProps {
  url?: string;
  title?: string;
  thumbnailUrl?: string;
  priority?: boolean;
  aspectRatio: 'vertical' | 'horizontal';
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  onEnded?: () => void;
  onTimeUpdate?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
}

/**
 * Phase state machine:
 *   idle      — no src yet, or src just reset
 *   loading   — play() called, browser is fetching / decoding first frame
 *   playing   — browser painted first frame, video playing normally
 *   buffering — was playing, stalled mid-play waiting for more network data
 */
type Phase = 'idle' | 'loading' | 'playing' | 'buffering';

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  (
    {
      url,
      title,
      thumbnailUrl,
      priority,
      autoPlay = false,
      muted = true,
      loop = false,
      className,
      onEnded,
      onTimeUpdate,
    },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [phase, setPhase] = useState<Phase>('idle');
    const [hasError, setHasError] = useState(false);

    // ── Reset when the video source changes ──────────────────────────────
    useEffect(() => {
      setPhase('idle');
      setHasError(false);
    }, [url]);

    // ── Imperative handle (called by VideoFeedClient via IntersectionObserver) ──
    useImperativeHandle(ref, () => ({
      play: () => {
        const video = videoRef.current;
        if (!video || hasError) return;
        setPhase('loading');
        // play() starts buffering + playback simultaneously.
        // The browser will show the first frame when ready and fire "playing".
        video.play().catch(() => {});
      },
      pause: () => {
        videoRef.current?.pause();
      },
      reset: () => {
        if (videoRef.current) videoRef.current.currentTime = 0;
      },
    }));

    // ── Auto-play for the very first slide ──────────────────────────────
    useEffect(() => {
      if (autoPlay && !hasError && videoRef.current) {
        setPhase('loading');
        videoRef.current.play().catch(() => {});
      }
    }, [autoPlay, hasError]);

    // ── Video event listeners — re-attach whenever url changes so the fresh
    //    video element reference is always captured ───────────────────────
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      // First real frame rendered → hide thumbnail, show video
      const onPlaying = () => setPhase('playing');
      // Stalled mid-play (network too slow)
      const onWaiting = () => setPhase(prev => (prev === 'playing' ? 'buffering' : prev));
      const onStalled = () => setPhase(prev => (prev === 'playing' ? 'buffering' : prev));

      video.addEventListener('playing', onPlaying);
      video.addEventListener('waiting', onWaiting);
      video.addEventListener('stalled', onStalled);

      return () => {
        video.removeEventListener('playing', onPlaying);
        video.removeEventListener('waiting', onWaiting);
        video.removeEventListener('stalled', onStalled);
      };
    }, [url]); // url as dep ensures fresh videoRef when src changes

    // ── Derived visibility ───────────────────────────────────────────────
    // Thumbnail covers the player until the very first frame is painted,
    // and reappears if playback stalls (cleaner than frozen frame)
    const showThumbnail =
      !url || phase === 'idle' || phase === 'loading' || phase === 'buffering';

    // Spinner shown while waiting for first frame or re-buffering
    const showSpinner = !!url && !hasError && (phase === 'loading' || phase === 'buffering');

    // Video element made visible only once playing (prevents black flash)
    const showVideo = !!url && !hasError && phase === 'playing';

    return (
      <div
        className={cn(
          // Black bg gives the natural letterbox / pillarbox for both 9:16 and 16:9
          'w-full h-full relative overflow-hidden flex items-center justify-center bg-black',
          className
        )}
      >
        {/* ── Error ─────────────────────────────────────────── */}
        {hasError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white/40 gap-3 pointer-events-none">
            <AlertCircle className="w-10 h-10" />
            <p className="text-sm font-medium">Video unavailable</p>
          </div>
        )}

        {/* ── Thumbnail / poster ────────────────────────────── */}
        {/* Stays on top until the browser has painted the first real video frame */}
        {thumbnailUrl && !hasError && (
          <Image
            src={thumbnailUrl}
            alt={title || 'Video thumbnail'}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            priority={priority}
            className={cn(
              'object-contain transition-opacity duration-300',
              showThumbnail ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
          />
        )}

        {/* ── Loading / buffering spinner ───────────────────── */}
        {showSpinner && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 pointer-events-none">
            {/* Terracotta spinner ring */}
            <div className="relative w-[44px] h-[44px]">
              <div className="absolute inset-0 rounded-full border-[3px] border-white/10" />
              <div className="absolute inset-0 rounded-full border-[3px] border-t-[var(--accent-terra)] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            </div>
            <span className="text-[11px] font-medium text-white/60 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
              {phase === 'buffering' ? 'Buffering…' : 'Loading video…'}
            </span>
          </div>
        )}

        {/* ── Video element ─────────────────────────────────── */}
        {/* max-w/max-h + object-contain = correct aspect ratio in any container,
            never cropped, black letterbox/pillarbox fills the gaps */}
        {url && !hasError && (
          <video
            ref={videoRef}
            src={url}
            aria-label={title || 'Video player'}
            muted={muted}
            loop={loop}
            playsInline
            preload="metadata"
            poster={thumbnailUrl}
            onEnded={onEnded}
            onTimeUpdate={onTimeUpdate}
            onError={() => {
              setHasError(true);
              setPhase('idle');
            }}
            className={cn(
              'max-w-full max-h-full object-contain block',
              showVideo
                ? 'opacity-100 transition-opacity duration-300'
                : 'opacity-0'
            )}
          />
        )}
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
