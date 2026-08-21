import { CATEGORIES } from '@/data/categories';
import { getSettings } from '@/lib/settings';
import { HomeClient } from '@/components/home/HomeClient';

export default function HomePage() {
  const settings = getSettings();

  return <HomeClient settings={settings} categories={CATEGORIES} />;
}
