import { VideoItem, VideoCategory, CategoryMeta } from '@/types';
import videosData from '@/data/videos.json';
import { CATEGORIES } from '@/data/categories';

export function getAllVideos(): VideoItem[] {
  return videosData as VideoItem[];
}

export function getVideosByCategory(category: VideoCategory): VideoItem[] {
  return (videosData as VideoItem[]).filter((video) => video.category === category);
}

export function getCategoryMeta(slug: VideoCategory): CategoryMeta | undefined {
  return CATEGORIES.find((cat) => cat.slug === slug);
}
