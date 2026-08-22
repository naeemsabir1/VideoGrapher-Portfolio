'use client';

import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useContact } from '@/context/ContactContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INPUT_CLASS =
  'w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[16px] px-4 py-3.5 text-[15px] text-[var(--text-primary)] placeholder:text-[#A89F95] focus:outline-none focus:ring-2 focus:ring-[var(--accent-terra)]/20 focus:border-[var(--accent-terra)] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-terra)] focus-visible:outline-offset-2';

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { contactEmail } = useContact();

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const whatsapp = (formData.get('whatsapp') as string)?.trim();
    const message = (formData.get('message') as string)?.trim();

    if (!name || !email || !message) {
      setError('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);

    // ── Try Web3Forms (real email delivery) ──────────────────────────────
    const web3Key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

    if (web3Key) {
      try {
        const body = {
          access_key: web3Key,
          name,
          email,
          message,
          whatsapp: whatsapp || 'Not provided',
          subject: `New portfolio inquiry from ${name}`,
          from_name: 'Portfolio Contact Form',
          replyto: email,
        };

        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (data.success) {
          setIsSubmitting(false);
          setIsSuccess(true);
          setTimeout(() => { setIsSuccess(false); onClose(); }, 3000);
          return;
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        console.error('Web3Forms error:', err);
        // Fall through to mailto fallback
      }
    }

    // ── mailto fallback (if no Web3Forms key configured yet) ─────────────
    setIsSubmitting(false);
    setIsSuccess(true);

    const waLine = whatsapp ? `%0D%0AWhatsApp: ${encodeURIComponent(whatsapp)}` : '';
    const mailtoLink = `mailto:${contactEmail}?subject=${encodeURIComponent(`New inquiry from ${name}`)}&body=Name: ${encodeURIComponent(name)}%0D%0AEmail: ${encodeURIComponent(email)}${waLine}%0D%0A%0D%0A${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;

    setTimeout(() => { setIsSuccess(false); onClose(); }, 3000);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setIsSuccess(false); setError(null); }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#1C171480] z-[60] backdrop-blur-[2px]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center pointer-events-none">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.8 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className={cn(
                'w-full bg-[var(--bg-base)] flex flex-col pointer-events-auto',
                'md:max-w-[480px] md:rounded-[24px] rounded-t-[24px]',
                'shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-[0_20px_60px_rgba(0,0,0,0.15)]'
              )}
            >
              {/* Mobile drag handle */}
              <div className="w-full shrink-0 flex justify-center pt-3 pb-2 md:hidden cursor-grab active:cursor-grabbing">
                <div className="w-[40px] h-[4px] rounded-full bg-[var(--border-subtle)]" />
              </div>

              {/* Close button */}
              <div className="absolute top-4 right-4 z-10 md:top-6 md:right-6">
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-[var(--text-primary)]/5 transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-terra)] focus-visible:outline-offset-2"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 pt-2 md:pt-8 flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
                <h2 className="font-display font-bold text-[26px] text-[var(--text-primary)] mb-2 pr-8 leading-tight">
                  Let&apos;s create something great.
                </h2>
                <p className="font-body text-[15px] text-[var(--text-secondary)] mb-8">
                  Tell me about your project and I&apos;ll get back within 24 hours.
                </p>

                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#F3EBE1] flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-[var(--accent-gold)]" />
                    </div>
                    <h3 className="font-display font-bold text-[20px] text-[var(--text-primary)] mb-2">
                      Message sent!
                    </h3>
                    <p className="text-[var(--text-secondary)]">I&apos;ll reply soon.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                    {error && (
                      <div id="form-error" className="p-3 bg-red-50 text-red-600 rounded-lg text-sm" role="alert">
                        {error}
                      </div>
                    )}

                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-[13px] font-medium text-[var(--text-primary)] mb-1.5 ml-1">
                        Name
                      </label>
                      <input
                        type="text" id="name" name="name" required
                        aria-required="true"
                        className={INPUT_CLASS}
                        placeholder="Your name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-[13px] font-medium text-[var(--text-primary)] mb-1.5 ml-1">
                        Email
                      </label>
                      <input
                        type="email" id="email" name="email" required
                        aria-required="true"
                        className={INPUT_CLASS}
                        placeholder="you@example.com"
                      />
                    </div>

                    {/* WhatsApp — optional */}
                    <div>
                      <label htmlFor="whatsapp" className="block text-[13px] font-medium text-[var(--text-primary)] mb-1.5 ml-1">
                        WhatsApp Number{' '}
                        <span className="text-[var(--text-secondary)] font-normal">(optional)</span>
                      </label>
                      <input
                        type="tel" id="whatsapp" name="whatsapp"
                        className={INPUT_CLASS}
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-[13px] font-medium text-[var(--text-primary)] mb-1.5 ml-1">
                        Message
                      </label>
                      <textarea
                        id="message" name="message" rows={4} required
                        aria-required="true"
                        className={cn(INPUT_CLASS, 'resize-none')}
                        placeholder="Tell me about your vision..."
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full mt-2"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-[var(--bg-base)]/30 border-t-[var(--bg-base)] rounded-full animate-spin" />
                      ) : (
                        'Send Message ✉️'
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
