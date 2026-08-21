import { notFound } from 'next/navigation';
import { getCategoryMeta, getVideosByCategory } from '@/lib/videos';
import { VideoCategory } from '@/types';
import { CategoryManagerClient } from '@/components/admin/CategoryManagerClient';

export default async function CategoryManagerPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  
  const categoryMeta = getCategoryMeta(slug as VideoCategory);
  
  if (!categoryMeta) {
    notFound();
  }

  const videos = getVideosByCategory(slug as VideoCategory);

  return <CategoryManagerClient category={categoryMeta} videos={videos} />;
}
