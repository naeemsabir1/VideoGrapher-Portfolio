'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg-base)]">
      <div className="w-16 h-16 rounded-full bg-[var(--bg-card)] flex items-center justify-center mb-6 text-[var(--accent-terra)] shadow-sm">
        <AlertCircle className="w-8 h-8" />
      </div>
      
      <h1 className="font-display font-bold text-3xl md:text-4xl text-[var(--text-primary)] mb-4 text-center">
        Something went wrong 🎬
      </h1>
      
      <p className="text-[var(--text-secondary)] mb-8 text-center max-w-md">
        We encountered an unexpected error while trying to load this page.
      </p>

      {process.env.NODE_ENV === 'development' && (
        <div className="bg-[var(--bg-card)] p-4 rounded-lg w-full max-w-2xl overflow-auto mb-8 border border-[var(--border-subtle)] text-sm font-mono text-red-600">
          <p className="font-bold mb-2">{error.name}: {error.message}</p>
          <pre>{error.stack}</pre>
        </div>
      )}

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button 
            variant="primary"
            size="md"
            onClick={() => reset()}
          >
            Try again
          </Button>
          
          <Link href="/">
            <Button 
              variant="secondary"
              size="md"
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to home
            </Button>
          </Link>
        </div>
    </div>
  );
}
