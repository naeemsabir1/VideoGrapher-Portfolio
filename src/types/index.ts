export interface VideoItem {
  id: string;
  title: string;
  description: string;         // 1–2 sentence description
  category: VideoCategory;
  imageKitUrl: string;          // full ImageKit video URL
  thumbnailUrl?: string;        // optional thumbnail image URL
  aspectRatio: 'vertical' | 'horizontal'; // 9:16 or 16:9
  tags?: string[];
  featured?: boolean;
  createdAt: string;            // ISO date string
}

export type VideoCategory =
  | 'ai-ugc-ads'
  | 'motion-graphics'
  | 'meta-ads'
  | 'app-promo-ads'
  | 'basic-video-editing'
  | 'long-form-content';

export interface CategoryMeta {
  slug: VideoCategory;
  label: string;
  description: string;
  emoji: string;
  color: string;  // Tailwind bg class for category chip
}
