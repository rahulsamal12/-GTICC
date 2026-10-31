import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/components/QueryProvider';

export const metadata: Metadata = {
  title: 'GTICC Admin Console | Global Trade & Investment Commercial Community',
  description: 'Executive management portal for GTICC member applications, institutional positioning, and corporate screening.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#081630] text-slate-100 min-h-screen selection:bg-[#c8a24a] selection:text-black antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
