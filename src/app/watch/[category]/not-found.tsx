import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--bg-base)] text-[var(--text-primary)] px-6 text-center absolute inset-0 z-50">
      <div className="w-16 h-16 mb-6 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-3xl">
        🎬
      </div>
      <h2 className="font-display font-bold text-2xl mb-2">Category Not Found</h2>
      <p className="text-[var(--text-secondary)] mb-8 max-w-sm">
        We couldn&apos;t find the reel you&apos;re looking for. It might have been moved or doesn&apos;t exist.
      </p>
      <Link 
        href="/"
        className="flex items-center gap-2 px-6 py-3 bg-[var(--accent-terra)] text-[var(--bg-base)] rounded-[var(--radius-pill)] font-medium hover:bg-[#A95230] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all work
      </Link>
    </div>
  );
}
