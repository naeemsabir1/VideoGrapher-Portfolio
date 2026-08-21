'use client';

import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { loginAdmin } from './actions';
import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    startTransition(async () => {
      const result = await loginAdmin(password);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[var(--bg-base)] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[380px] bg-[var(--bg-card)] rounded-[20px] p-[40px] shadow-sm border border-[var(--border-subtle)]"
      >
        <div className="text-center mb-8">
          <span className="inline-block text-[var(--accent-terra)] text-xs font-bold uppercase tracking-wider mb-2">
            The Reel
          </span>
          <h1 className="font-display font-bold text-[28px] text-[var(--text-primary)]">
            Admin Panel
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-[12px] px-4 py-3 text-[15px] text-[var(--text-primary)] placeholder:text-[#A89F95] focus:outline-none focus:ring-2 focus:ring-[var(--accent-terra)]/20 focus:border-[var(--accent-terra)] transition-all"
              required
            />
          </div>

          {error && (
            <p className="text-[var(--accent-terra)] text-xs font-medium text-center">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isPending || !password}
            className="w-full mt-2"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-[var(--bg-base)]/30 border-t-[var(--bg-base)] rounded-full animate-spin" />
            ) : (
              "Enter →"
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
