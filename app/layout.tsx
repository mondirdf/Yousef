import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ramzi ZRT | Creator Links',
  description:
    'Premium link-in-bio page for Ramzi ZRT with social links, latest YouTube video, featured content, and subscribe call-to-action.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
