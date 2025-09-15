import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from '@neet/auth';
import { ConditionalGuard } from '../components/auth/conditional-guard';

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEET Prep AI - Admin Dashboard",
  description: "Admin dashboard for managing NEET preparation content and analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <AuthProvider>
          <ConditionalGuard>
            {children}
          </ConditionalGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
