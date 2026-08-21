'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { SiteSettings } from '@/lib/settings';

const SETTINGS_PATH = path.join(process.cwd(), 'src/data/settings.json');

export async function updateSettings(formData: FormData) {
  const settings: SiteSettings = {
    ownerName: formData.get('ownerName') as string,
    contactEmail: formData.get('contactEmail') as string,
    instagramUrl: formData.get('instagramUrl') as string,
    linkedInUrl: formData.get('linkedInUrl') as string,
    twitterUrl: formData.get('twitterUrl') as string,
    tagline: formData.get('tagline') as string,
    availableForWork: formData.get('availableForWork') === 'on',
  };

  await fs.writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8');

  // Revalidate layout and pages
  revalidatePath('/', 'layout');
  revalidatePath('/admin/settings');
  revalidatePath('/');
  
  return { success: true };
}
