import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://yousef-rdbk.vercel.app'),
  title: 'Youcef RDBK | Creator Links',
  description:
    'Premium link-in-bio page for Youcef RDBK with social links, latest YouTube video, featured content, and subscribe call-to-action.',
  openGraph: {
    title: 'Youcef RDBK | Creator Links',
    description:
      'Premium link-in-bio page for Youcef RDBK with social links, latest YouTube video, featured content, and subscribe call-to-action.',
    images: [{ url: '/og-image.svg', type: 'image/svg+xml', width: 1200, height: 630, alt: 'Youcef RDBK OG Image' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Youcef RDBK | Creator Links',
    description:
      'Premium link-in-bio page for Youcef RDBK with social links, latest YouTube video, featured content, and subscribe call-to-action.',
    images: ['/og-image.svg']
  },
  icons: {
    icon: '/yousef.svg',
    shortcut: '/yousef.svg',
    apple: '/yousef.svg'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
