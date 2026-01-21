import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dreams Home | Premium Real Estate Platform',
  description: 'Find your dream home with Dreams Home. Browse premium properties, apartments, villas and more. Expert real estate services for buyers.',
  keywords: 'real estate, property, homes, apartments, villas, buy property, rent property',
  openGraph: {
    title: 'Dreams Home | Premium Real Estate Platform',
    description: 'Find your dream home with Dreams Home. Browse premium properties.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Dreams Home',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dreams Home | Premium Real Estate Platform',
    description: 'Find your dream home with Dreams Home.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
          }}
        />
        <Header />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
