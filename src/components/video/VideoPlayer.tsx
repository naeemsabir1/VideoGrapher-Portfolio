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

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  (
    { url, title, thumbnailUrl, priority, aspectRatio, autoPlay = false, muted = true, loop = false, className, onEnded, onTimeUpdate },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useImperativeHandle(ref, () => ({
      play: () => {
        if (!hasError) {
          videoRef.current?.play().catch(() => {});
        }
      },
      pause: () => {
        videoRef.current?.pause();
      },
      reset: () => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }
      }
    }));

    useEffect(() => {
      if (autoPlay && videoRef.current && !hasError) {
        videoRef.current.play().catch(() => {});
      }
    }, [autoPlay, hasError]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleCanPlay = () => setIsLoading(false);
      const handleWaiting = () => setIsLoading(true);
      const handlePlaying = () => setIsLoading(false);
      const handleLoadStart = () => {
        if (video.readyState < 3 && !hasError) {
          setIsLoading(true);
        }
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('canplaythrough', handleCanPlay);
      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('loadstart', handleLoadStart);

      if (video.readyState >= 3) {
        setIsLoading(false);
      }

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('canplaythrough', handleCanPlay);
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('loadstart', handleLoadStart);
      };
    }, [hasError]);

    const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Video error:', e.currentTarget.error);
      }
      setHasError(true);
      setIsLoading(false);
    };

    return (
      <div
        className={cn(
          "w-full h-full relative overflow-hidden flex items-center justify-center",
          aspectRatio === 'horizontal' ? "bg-[var(--text-primary)]" : "bg-transparent",
          className
        )}
      >
        {hasError ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-[var(--bg-base)]/50 bg-[var(--text-primary)]/80 backdrop-blur-sm">
            <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
            <p className="font-medium text-sm">Video unavailable</p>
          </div>
        ) : null}

        {thumbnailUrl && !hasError && (
          <Image
            src={thumbnailUrl}
            alt={title || "Video thumbnail"}
            fill
            sizes="100vw"
            priority={priority}
            className={cn(
              aspectRatio === 'horizontal' ? "object-contain" : "object-cover",
              "transition-opacity duration-300",
              isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          />
        )}
        {isLoading && !thumbnailUrl && !hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center animate-shimmer pointer-events-none">
            <div className="w-[24px] h-[24px] border-2 border-[var(--accent-terra)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {url && (
          <video
            ref={videoRef}
            src={url}
            aria-label={title || "Video player"}
            muted={muted}
            loop={loop}
            playsInline
            onEnded={onEnded}
            onTimeUpdate={onTimeUpdate}
            onError={handleError}
            className={cn(
              "w-full h-full",
              aspectRatio === 'horizontal' ? "object-contain aspect-video" : "object-cover",
              isLoading || hasError ? "opacity-0" : "opacity-100 transition-opacity duration-300"
            )}
          />
        )}
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
