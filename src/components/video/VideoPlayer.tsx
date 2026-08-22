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

    // Both vertical and horizontal use object-contain so the video is NEVER cropped.
    // The container background is always black (#000) which creates the letterbox effect.
    const videoClassName = cn(
      'w-full h-full object-contain',
      aspectRatio === 'horizontal' ? 'max-h-full aspect-video' : '',
      isLoading || hasError ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'
    );

    return (
      <div
        className={cn(
          // Always black background — provides letterbox for both portrait and landscape
          'w-full h-full relative overflow-hidden flex items-center justify-center bg-black',
          className
        )}
      >
        {hasError ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white/50 bg-black/80 backdrop-blur-sm">
            <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
            <p className="font-medium text-sm">Video unavailable</p>
          </div>
        ) : null}

        {/* Thumbnail shown while video is loading — always object-contain to match video */}
        {thumbnailUrl && !hasError && (
          <Image
            src={thumbnailUrl}
            alt={title || 'Video thumbnail'}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            priority={priority}
            className={cn(
              'object-contain transition-opacity duration-300',
              isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
          />
        )}

        {/* Spinner shown when no thumbnail is available yet */}
        {isLoading && !thumbnailUrl && !hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[28px] h-[28px] border-2 border-[var(--accent-terra)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {url && (
          <video
            ref={videoRef}
            src={url}
            aria-label={title || 'Video player'}
            muted={muted}
            loop={loop}
            playsInline
            // preload="metadata" fetches just enough to show first frame without
            // downloading the entire file — key for faster perceived load time.
            preload="metadata"
            poster={thumbnailUrl}
            onEnded={onEnded}
            onTimeUpdate={onTimeUpdate}
            onError={handleError}
            className={videoClassName}
          />
        )}
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
