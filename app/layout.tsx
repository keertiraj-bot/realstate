import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import WebVitalsMonitor from '@/components/WebVitalsMonitor';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#22c55e',
};

export const metadata: Metadata = {
  title: {
    default: 'Dreams Home | Premium Real Estate Platform',
    template: '%s | Dreams Home',
  },
  description: 'Find your dream home with Dreams Home. Browse premium properties, apartments, villas and more. Expert real estate services for buyers.',
  keywords: ['real estate', 'property', 'homes', 'apartments', 'villas', 'buy property', 'rent property', 'Noida', 'Gurgaon'],
  authors: [{ name: 'Dreams Home' }],
  creator: 'Dreams Home',
  publisher: 'Dreams Home',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://realstate-nu-sepia.vercel.app/',
    siteName: 'Dreams Home',
    title: 'Dreams Home | Premium Real Estate Platform',
    description: 'Find your dream home with Dreams Home. Browse premium properties.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
        width: 1200,
        height: 630,
        alt: 'Dreams Home - Premium Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dreams Home | Premium Real Estate Platform',
    description: 'Find your dream home with Dreams Home. Browse premium properties.',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200'],
    creator: '@dreamshome',
  },
  alternates: {
    canonical: 'https://realstate-nu-sepia.vercel.app/',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
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
        <GoogleAnalytics />
        <WebVitalsMonitor />
        <Header />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
