import type { Metadata } from "next";
import "./globals.css";
import { seedDatabase } from "@/lib/db/seed";

export const metadata: Metadata = {
  title: "EduPath OS - Backend Learning Platform",
  description: "Master backend development with structured roadmaps, AI guidance, and code-first learning",
};

// Seed database on startup
seedDatabase().catch(console.error);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
