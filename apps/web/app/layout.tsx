import "@neet/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEET Prep AI - India's Most Intelligent NEET Preparation Platform",
  description: "Transform your NEET preparation with AI-powered personalized learning, adaptive quizzes, voice tutoring in 8 Indian languages, and predictive analytics. Join 230,000+ students preparing smarter.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
