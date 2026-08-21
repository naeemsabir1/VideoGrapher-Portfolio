import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg-base)] text-center relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vh] font-display font-extrabold text-[var(--border-subtle)] opacity-30 select-none z-0">
        404
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="font-display font-bold text-4xl md:text-5xl text-[var(--text-primary)] mb-4 tracking-tight">
          This reel doesn&apos;t exist.
        </h1>
        
        <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-md font-medium">
          The page or video you&apos;re looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link href="/">
          <Button variant="primary" size="lg" icon={<ArrowLeft className="w-5 h-5" />}>
            Browse all categories
          </Button>
        </Link>
      </div>
    </div>
  );
}
