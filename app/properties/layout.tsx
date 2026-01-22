import { Metadata } from 'next';

const BASE_URL = 'https://realstate-nu-sepia.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'Dreams Home | Premium Real Estate Platform',
    template: '%s | Dreams Home',
  },
  description: 'Find your dream home with Dreams Home. Browse premium properties in Noida, Gurgaon and Delhi NCR. Expert real estate services for buyers.',
  keywords: ['real estate', 'property', 'homes', 'apartments', 'villas', 'buy property', 'rent property', 'Noida', 'Gurgaon', 'Delhi NCR'],
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
    url: BASE_URL,
    siteName: 'Dreams Home',
    title: 'Dreams Home | Premium Real Estate Platform',
    description: 'Find your dream home with Dreams Home. Browse premium properties.',
    images: [
      {
        url: `${BASE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Dreams Home - Premium Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dreams Home | Premium Real Estate Platform',
    description: 'Find your dream home with Dreams Home.',
    images: [`${BASE_URL}/images/og-image.jpg`],
    creator: '@dreamshome',
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
