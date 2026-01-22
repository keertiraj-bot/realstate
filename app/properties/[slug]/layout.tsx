import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://realstate-nu-sepia.vercel.app';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { data: property } = await supabase
      .from('properties')
      .select('title, location, city, price, property_type, bedrooms, bathrooms, area_sqft, images')
      .eq('id', params.id)
      .single();

    if (!property) {
      return {
        title: 'Property Not Found | Dreams Home',
        description: 'The property you are looking for does not exist.',
      };
    }

    const title = `${property.title} in ${property.location}, ${property.city} | Dreams Home`;
    const description = `${property.bedrooms > 0 ? `${property.bedrooms} BHK ` : ''}${property.property_type} for sale in ${property.location}, ${property.city}. ${property.area_sqft.toLocaleString()} sqft. Price: ₹${property.price.toLocaleString()}.`;
    const imageUrl = property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200';

    return {
      title,
      description,
      keywords: [
        property.title,
        property.property_type,
        property.location,
        property.city,
        `${property.bedrooms} BHK`,
        'property for sale',
        'real estate',
      ],
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: `${BASE_URL}/properties/${params.id}`,
        siteName: 'Dreams Home',
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: property.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `${BASE_URL}/properties/${params.id}`,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    return {
      title: 'Property | Dreams Home',
      description: 'View property details on Dreams Home.',
    };
  }
}

export default function PropertyDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
