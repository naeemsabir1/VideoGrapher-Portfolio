'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { AlertCircle, Wifi } from 'lucide-react';

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

// Minimum seconds that must be buffered before the video starts playing.
// This prevents the "audio only / stuck thumbnail" problem on slow connections.
const MIN_BUFFER_SECONDS = 10;

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  (
    { url, title, thumbnailUrl, priority, aspectRatio, autoPlay = false, muted = true, loop = false, className, onEnded, onTimeUpdate },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // isLoading   — true until the video has buffered enough to play smoothly
    // isBuffering — true when playback stalled mid-play waiting for more data
    // hasStarted  — true once the first real video frame has been painted
    // hasError    — true when the video failed to load at all
    const [isLoading, setIsLoading] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Tracks whether the caller asked us to play but we are still buffering
    const wantsToPlay = useRef(false);

    // ── Buffer check ────────────────────────────────────────────────────────
    const hasSufficientBuffer = useCallback(() => {
      const video = videoRef.current;
      if (!video || video.buffered.length === 0) return false;
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const target = Math.min(MIN_BUFFER_SECONDS, isFinite(video.duration) ? video.duration : MIN_BUFFER_SECONDS);
      return bufferedEnd >= target;
    }, []);

    // ── Imperative handle ────────────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      play: () => {
        const video = videoRef.current;
        if (!video || hasError) return;
        if (hasSufficientBuffer()) {
          video.play().catch(() => {});
          wantsToPlay.current = false;
        } else {
          // Tell the video to start loading, then play once buffered enough
          wantsToPlay.current = true;
          // Some browsers need an explicit load() call when preload="metadata"
          if (video.readyState < 2) {
            video.load();
          }
        }
      },
      pause: () => {
        wantsToPlay.current = false;
        videoRef.current?.pause();
      },
      reset: () => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }
      },
    }));

    // ── Auto-play on mount ───────────────────────────────────────────────────
    useEffect(() => {
      if (autoPlay && !hasError) {
        const video = videoRef.current;
        if (!video) return;
        if (hasSufficientBuffer()) {
          video.play().catch(() => {});
        } else {
          wantsToPlay.current = true;
          if (video.readyState < 2) video.load();
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoPlay, hasError]);

    // ── Video event listeners ────────────────────────────────────────────────
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      // Called whenever new data arrives — checks if we finally have enough buffer
      const handleProgress = () => {
        if (hasSufficientBuffer()) {
          setIsLoading(false);
          setIsBuffering(false);
          if (wantsToPlay.current) {
            wantsToPlay.current = false;
            video.play().catch(() => {});
          }
        }
      };

      // Browser can play from current position, but may not have full buffer yet
      const handleCanPlay = () => {
        // Only clear loading if we already have enough buffer
        if (hasSufficientBuffer()) {
          setIsLoading(false);
        }
      };

      // Video literally started rendering frames — hide the thumbnail poster
      const handlePlaying = () => {
        setIsLoading(false);
        setIsBuffering(false);
        setHasStarted(true);
      };

      // Playback stalled mid-play — show the buffering indicator again
      const handleWaiting = () => {
        setIsBuffering(true);
      };

      // Stall recovered
      const handleStalled = () => {
        setIsBuffering(true);
      };

      // New src loaded — reset state
      const handleLoadStart = () => {
        setIsLoading(true);
        setIsBuffering(false);
        setHasStarted(false);
      };

      video.addEventListener('progress', handleProgress);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('stalled', handleStalled);
      video.addEventListener('loadstart', handleLoadStart);

      // Fast path: if the browser already has data (e.g. cached)
      if (hasSufficientBuffer()) {
        setIsLoading(false);
      }

      return () => {
        video.removeEventListener('progress', handleProgress);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('stalled', handleStalled);
        video.removeEventListener('loadstart', handleLoadStart);
      };
    }, [hasSufficientBuffer, hasError]);

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
      setIsBuffering(false);
    };

    // ── Derived states ───────────────────────────────────────────────────────
    // Show the thumbnail until the video has actually painted its first frame
    const showThumbnail = !hasStarted || isBuffering;
    // Show a spinner whenever we are waiting for data (loading or buffering mid-play)
    const showSpinner = isLoading || isBuffering;
    // Show buffering label instead of generic spinner when video was already playing
    const showBufferingLabel = isBuffering && hasStarted;

    return (
      <div
        className={cn(
          // Full-size, black background for letterbox/pillarbox effect
          'w-full h-full relative overflow-hidden flex items-center justify-center bg-black',
          className
        )}
      >
        {/* ── Error state ─────────────────────────────────────── */}
        {hasError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white/40 gap-3">
            <AlertCircle className="w-10 h-10" />
            <p className="font-medium text-sm">Video unavailable</p>
          </div>
        )}

        {/* ── Thumbnail / poster ──────────────────────────────── */}
        {/* Stays visible until the first real frame is painted, and re-appears during buffering */}
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

        {/* ── Buffering / loading overlay ─────────────────────── */}
        {showSpinner && !hasError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 pointer-events-none">
            {/* Spinner ring */}
            <div className="relative w-[44px] h-[44px]">
              {/* Background track */}
              <div className="absolute inset-0 rounded-full border-[3px] border-white/10" />
              {/* Animated arc */}
              <div className="absolute inset-0 rounded-full border-[3px] border-t-[var(--accent-terra)] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            </div>

            {/* Label — show "Buffering…" when stalled mid-play, else just spinner */}
            {showBufferingLabel ? (
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                <Wifi className="w-3.5 h-3.5 text-white/60" />
                <span className="text-[12px] font-medium text-white/70">Buffering…</span>
              </div>
            ) : (
              <span className="text-[11px] font-medium text-white/40">Loading video…</span>
            )}
          </div>
        )}

        {/* ── Video element ───────────────────────────────────── */}
        {url && !hasError && (
          <video
            ref={videoRef}
            src={url}
            aria-label={title || 'Video player'}
            muted={muted}
            loop={loop}
            playsInline
            // metadata only — browser won't download the full file before play
            preload="metadata"
            // poster acts as fallback before our Image component takes over
            poster={thumbnailUrl}
            onEnded={onEnded}
            onTimeUpdate={onTimeUpdate}
            onError={handleError}
            className={cn(
              // max-w/max-h + object-contain: video fills as much space as possible
              // without EVER being cropped. Works for both 9:16 and 16:9 in any container.
              'max-w-full max-h-full object-contain block',
              // Keep invisible until the first frame is painted — this prevents the
              // "transparent black flash" before the video renders
              hasStarted && !isBuffering
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
