import { Metadata } from 'next';

const BASE_URL = 'https://realstate-nu-sepia.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'Properties | Dreams Home',
    template: '%s | Dreams Home',
  },
  description: 'Browse our extensive collection of premium properties including apartments, villas, houses and commercial spaces in Noida, Gurgaon and Delhi NCR.',
  keywords: ['properties', 'real estate listings', 'apartments for sale', 'villas for sale', 'houses for sale', 'commercial properties', 'Noida properties', 'Gurgaon properties'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${BASE_URL}/properties`,
    siteName: 'Dreams Home',
    title: 'Properties | Dreams Home',
    description: 'Browse our extensive collection of premium properties.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
        width: 1200,
        height: 630,
        alt: 'Property Listings - Dreams Home',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Properties | Dreams Home',
    description: 'Browse our extensive collection of premium properties.',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200'],
  },
  alternates: {
    canonical: `${BASE_URL}/properties`,
  },
};

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
