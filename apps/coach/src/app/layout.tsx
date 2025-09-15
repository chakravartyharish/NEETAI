import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NEETAI Coach Portal',
  description: 'Comprehensive coaching institute management platform for NEET preparation',
  keywords: ['NEET', 'coaching', 'education', 'management', 'institute'],
  authors: [{ name: 'NEETAI Team' }],
  robots: 'noindex, nofollow', // Private portal
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background font-sans antialiased">
          {children}
        </div>
      </body>
    </html>
  );
}