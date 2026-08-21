import { notFound } from 'next/navigation';
import { getVideosByCategory, getCategoryMeta } from '@/lib/videos';
import { VideoCategory } from '@/types';
import { VideoFeedClient } from '@/components/feed/VideoFeedClient';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = getCategoryMeta(category as VideoCategory);
  
  return {
    title: meta?.label ?? 'Category',
    description: meta?.description ?? '',
  };
}

export default async function WatchPage({ params }: Props) {
  const { category } = await params;
  const categoryMeta = getCategoryMeta(category as VideoCategory);
  
  if (!categoryMeta) {
    notFound();
  }

  const videos = getVideosByCategory(category as VideoCategory);

  return (
    <VideoFeedClient videos={videos} categoryMeta={categoryMeta} />
  );
}
