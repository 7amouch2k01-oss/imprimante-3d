import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CBV-3D Admin — Login',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-[#f5f5f3] text-[#1a1a1a] min-h-screen flex items-center justify-center`}>
        {children}
      </body>
    </html>
  );
}
