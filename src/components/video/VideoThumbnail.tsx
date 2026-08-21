import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface VideoThumbnailProps {
  thumbnailUrl?: string;
  className?: string;
}

export function VideoThumbnail({ thumbnailUrl, className }: VideoThumbnailProps) {
  return (
    <div className={cn("relative w-full aspect-[9/16] bg-[var(--text-primary)] overflow-hidden group", className)}>
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt="Video thumbnail"
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-slate-800 animate-pulse" />
      )}
      
      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-[var(--text-primary)]/20 group-hover:bg-[var(--text-primary)]/10 transition-colors">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--bg-base)]/20 backdrop-blur-md">
          <Play className="w-6 h-6 text-[var(--bg-base)] ml-1" fill="currentColor" />
        </div>
      </div>
    </div>
  );
}
