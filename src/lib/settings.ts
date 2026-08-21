import fs from 'fs';
import path from 'path';

export interface SiteSettings {
  ownerName: string;
  contactEmail: string;
  instagramUrl: string;
  linkedInUrl: string;
  twitterUrl: string;
  tagline: string;
  availableForWork: boolean;
}

const SETTINGS_PATH = path.join(process.cwd(), 'src/data/settings.json');

export function getSettings(): SiteSettings {
  try {
    const data = fs.readFileSync(SETTINGS_PATH, 'utf-8');
    return JSON.parse(data) as SiteSettings;
  } catch {
    // Fallback if file is missing
    return {
      ownerName: "Your Name",
      contactEmail: "yourname@email.com",
      instagramUrl: "",
      linkedInUrl: "",
      twitterUrl: "",
      tagline: "Video editor & motion designer crafting stories that move.",
      availableForWork: true
    };
  }
}
