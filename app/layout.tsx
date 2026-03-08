import type { Metadata } from 'next';
import { Ubuntu } from 'next/font/google';
import { fetchHeader, fetchFooter } from '@/lib/contentstack';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const ubuntu = Ubuntu({ weight: ['300', '400', '500', '700'], subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Contentstack Demo', template: '%s | Contentstack Demo' },
  description: 'Production-ready Next.js app with Contentstack headless CMS.',
};

// Fetch fresh header every time (no layout cache) so Contentstack updates are visible
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [headerData, footerData] = await Promise.all([fetchHeader(), fetchFooter()]);

  return (
    <html lang="en">
      <body className={`${ubuntu.className} overflow-x-hidden`}>
        {headerData ? (
          <Header data={headerData} />
        ) : (
          <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center px-4">
              <span className="text-sm text-neutral-500">
                Header unavailable (check Contentstack env)
              </span>
            </div>
          </header>
        )}
        <main>
          <div className="mx-auto max-w-[1440px]">{children}</div>
        </main>
        <Footer data={footerData} />
      </body>
    </html>
  );
}
