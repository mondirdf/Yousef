import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ramzi.zrt'),
  title: 'Ramzi ZRT | Creator Links',
  description:
    'Premium link-in-bio page for Ramzi ZRT with social links, latest YouTube video, featured content, and subscribe call-to-action.',
  openGraph: {
    title: 'Ramzi ZRT | Creator Links',
    description:
      'Premium link-in-bio page for Ramzi ZRT with social links, latest YouTube video, featured content, and subscribe call-to-action.',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Ramzi ZRT OG Image' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ramzi ZRT | Creator Links',
    description:
      'Premium link-in-bio page for Ramzi ZRT with social links, latest YouTube video, featured content, and subscribe call-to-action.',
    images: ['/og-image.svg']
  },
  icons: {
    icon: '/ramzi-logo.svg',
    shortcut: '/ramzi-logo.svg',
    apple: '/ramzi-logo.svg'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
