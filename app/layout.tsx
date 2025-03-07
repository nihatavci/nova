import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer';
import { NavBarDemo } from '@/components/ui/navbar-demo';
import ButtonDebugger from '@/components/ButtonDebugger';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nova - Financial Advisory for German Expats',
  description: 'Premium web application for German expats providing tailored financial advisory services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-b from-gray-50 to-white min-h-screen`}>
        <NavBarDemo />
        <main className="min-h-screen pt-24 sm:pt-28 h-full">{children}</main>
        <Footer />
        <ButtonDebugger />
      </body>
    </html>
  );
} 