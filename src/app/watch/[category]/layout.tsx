import { getCategoryMeta } from '@/lib/videos';
import { VideoCategory } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { ContactProvider } from '@/context/ContactContext';
import { notFound } from 'next/navigation';
import { getSettings } from '@/lib/settings';

export default async function WatchLayout({ 
  children,
  params
}: { 
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = getCategoryMeta(category as VideoCategory);
  const settings = getSettings();

  // If we try to render the layout with an invalid category, 
  // notFound() will trigger the not-found.tsx UI.
  if (!meta) {
    notFound();
  }

  return (
    <ContactProvider contactEmail={settings.contactEmail}>
      <div className="flex flex-col h-[100dvh] overflow-hidden bg-[var(--bg-base)]">
        <Navbar categoryLabel={meta.label} />
        <main className="flex-1 overflow-hidden relative bg-[var(--text-primary)]">
          {children}
        </main>
      </div>
    </ContactProvider>
  );
}
