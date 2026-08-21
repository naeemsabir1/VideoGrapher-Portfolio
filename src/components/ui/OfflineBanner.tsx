'use client';

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Only run on the client
    if (typeof window !== 'undefined') {
      setTimeout(() => setIsOffline(!navigator.onLine), 0);

      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[200] bg-amber-500 text-amber-950 px-4 py-2 flex items-center justify-center shadow-md font-medium text-sm"
          role="alert"
        >
          <WifiOff className="w-4 h-4 mr-2" />
          You&apos;re offline — videos may not load
        </motion.div>
      )}
    </AnimatePresence>
  );
}
