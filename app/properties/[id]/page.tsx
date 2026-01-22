import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import PropertyDetailClient from './PropertyDetailClient';

const BASE_URL = 'https://realstate-nu-sepia.vercel.app';

export async function generateStaticParams() {
  try {
    const { data: properties } = await supabase
      .from('properties')
      .select('id')
      .eq('status', 'available')
      .limit(50);

    if (!properties || properties.length === 0) {
      return [];
    }

    return properties.map((property) => ({
      id: property.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
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

async function getProperty(id: string) {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching property:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const property = await getProperty(params.id);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Property not found</p>
        <a href="/properties" className="btn-primary">
          Back to Properties
        </a>
      </div>
    );
  }

  return <PropertyDetailClient property={property} />;
}
