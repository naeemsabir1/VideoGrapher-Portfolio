import type { Metadata, Viewport } from "next";
import { ImageKitProvider } from "@imagekit/next";
import "./globals.css";
import { Syne, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { OfflineBanner } from "@/components/ui/OfflineBanner";

const syne = Syne({ subsets: ['latin'], variable: '--font-display', weight: ['600','700','800'], display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'The Reel — Video Portfolio',
    template: '%s | The Reel',
  },
  description: 'Swipe through curated video work: motion graphics, AI UGC ads, app promos & more. Available for freelance work.',
  keywords: ['video editor', 'motion graphics', 'AI UGC ads', 'app promo', 'freelance video', 'video portfolio'],
  authors: [{ name: 'Naeem' }],
  openGraph: {
    type: 'website',
    title: 'The Reel — Video Portfolio',
    description: 'Swipe through curated video work: motion graphics, AI UGC ads & more.',
    siteName: 'The Reel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Reel — Video Portfolio',
    description: 'Swipe through curated video work.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable, syne.variable)}>
      <body className="bg-[var(--bg-base)] text-[var(--text-primary)] antialiased grain-overlay">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--accent-terra)] focus:text-[var(--bg-base)] focus:rounded-[var(--radius-pill)] focus:font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-terra)]"
        >
          Skip to main content
        </a>
        <OfflineBanner />
        <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}>
          {children}
        </ImageKitProvider>
        <Toaster />
      </body>
    </html>
  );
}
