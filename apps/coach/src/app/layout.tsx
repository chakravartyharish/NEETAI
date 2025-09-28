import type { Metadata } from 'next';
import './globals.css';

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
      <body className="font-sans">
        <div className="min-h-screen bg-background font-sans antialiased">
          {children}
        </div>
      </body>
    </html>
  );
}