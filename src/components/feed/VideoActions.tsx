'use client';

import { motion } from 'framer-motion';
import { Info, Mail, ChevronDown } from 'lucide-react';

interface VideoActionsProps {
  isActive: boolean;
  onDetailsOpen: () => void;
  onContactClick: () => void;
  onNext: () => void;
}

const containerVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 25 }
  }
};

const itemVariants = {
  hidden: { x: 20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } },
};

export function VideoActions({ isActive, onDetailsOpen, onContactClick, onNext }: VideoActionsProps) {
  return (
    <motion.div
      className="absolute bottom-[120px] right-[12px] flex flex-col gap-[20px] z-20 pointer-events-auto md:hidden"
      variants={containerVariants}
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
    >
      <ActionBtn icon={Info} onClick={onDetailsOpen} ariaLabel="View video details" />
      <ActionBtn icon={Mail} onClick={onContactClick} ariaLabel="Contact me" />
      <ActionBtn icon={ChevronDown} onClick={onNext} ariaLabel="Next video" />
    </motion.div>
  );
}

function ActionBtn({ icon: Icon, onClick, ariaLabel }: { icon: React.ElementType; onClick: () => void; ariaLabel: string }) {
  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation(); // prevent pausing the video
        onClick();
      }}
      className="w-[48px] h-[48px] rounded-full flex items-center justify-center bg-[#F7F3EE]/15 backdrop-blur-[8px] border border-white/20 text-[var(--bg-base)] hover:bg-[rgba(192,96,58,0.85)] hover:border-transparent transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-terra)] focus-visible:outline-offset-2"
      variants={itemVariants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={ariaLabel}
    >
      <Icon className="w-[22px] h-[22px]" />
    </motion.button>
  );
}
