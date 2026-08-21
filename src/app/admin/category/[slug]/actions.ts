'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { VideoItem, VideoCategory } from '@/types';

const DATA_PATH = path.join(process.cwd(), 'src/data/videos.json');

async function readVideos(): Promise<VideoItem[]> {
  const data = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(data) as VideoItem[];
}

async function writeVideos(videos: VideoItem[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(videos, null, 2), 'utf-8');
}

export async function addVideo(formData: FormData, category: VideoCategory) {
  const videos = await readVideos();
  
  const id = `vid_${Date.now()}`;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const imageKitUrl = formData.get('imageKitUrl') as string;
  const thumbnailUrl = formData.get('thumbnailUrl') as string | null;
  const aspectRatio = formData.get('aspectRatio') as 'vertical' | 'horizontal';
  const tagsString = formData.get('tags') as string;
  const featured = formData.get('featured') === 'on';

  const tags = tagsString ? tagsString.split(',').map(t => t.trim()).filter(Boolean) : [];

  const newVideo: VideoItem = {
    id,
    title,
    description,
    category,
    imageKitUrl,
    thumbnailUrl: thumbnailUrl || undefined,
    aspectRatio,
    tags,
    featured,
    createdAt: new Date().toISOString()
  };

  videos.push(newVideo);
  await writeVideos(videos);

  revalidatePath('/admin');
  revalidatePath(`/admin/category/${category}`);
  revalidatePath(`/watch/${category}`);
  revalidatePath('/');
}

export async function updateVideo(id: string, data: Partial<VideoItem>) {
  const videos = await readVideos();
  const index = videos.findIndex(v => v.id === id);
  if (index === -1) throw new Error('Video not found');

  videos[index] = { ...videos[index], ...data };
  await writeVideos(videos);

  revalidatePath('/admin');
  revalidatePath(`/admin/category/${videos[index].category}`);
  revalidatePath(`/watch/${videos[index].category}`);
  revalidatePath('/');
}

export async function deleteVideo(id: string) {
  const videos = await readVideos();
  const video = videos.find(v => v.id === id);
  if (!video) throw new Error('Video not found');

  const filtered = videos.filter(v => v.id !== id);
  await writeVideos(filtered);

  revalidatePath('/admin');
  revalidatePath(`/admin/category/${video.category}`);
  revalidatePath(`/watch/${video.category}`);
  revalidatePath('/');
}
