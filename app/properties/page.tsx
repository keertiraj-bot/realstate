import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types/property';
import PropertiesPageClient from './PropertiesPageClient';

export const revalidate = 120;

async function getProperties(searchParams: { [key: string]: string }): Promise<Property[]> {
  try {
    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', 'available');

    const location = searchParams.location;
    const type = searchParams.type;
    const minPrice = searchParams.minPrice;
    const maxPrice = searchParams.maxPrice;
    const bedrooms = searchParams.bedrooms;
    const sortBy = searchParams.sortBy || 'newest';

    if (location) {
      query = query.or(`location.ilike.%${location}%,city.ilike.%${location}%`);
    }
    if (type) {
      query = query.eq('property_type', type);
    }
    if (minPrice) {
      query = query.gte('price', parseInt(minPrice));
    }
    if (maxPrice) {
      query = query.lte('price', parseInt(maxPrice));
    }
    if (bedrooms) {
      query = query.gte('bedrooms', parseInt(bedrooms));
    }

    switch (sortBy) {
      case 'price_low':
        query = query.order('price', { ascending: true });
        break;
      case 'price_high':
        query = query.order('price', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching properties:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

function generatePropertiesListSchema(properties: Property[]) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: 'Dreams Home - Available Properties',
    description: `Browse ${properties.length} available properties including apartments, houses, villas, and commercial spaces.`,
    url: 'https://realstate-nu-sepia.vercel.app/properties',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: properties.length,
      itemListElement: properties.slice(0, 10).map((property, index) => ({
        '@type': 'RealEstateListing',
        position: index + 1,
        name: property.title,
        description: property.description,
        url: `https://realstate-nu-sepia.vercel.app/properties/${property.id}`,
        offers: {
          '@type': 'Offer',
          price: property.price,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        },
        image: property.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        address: {
          '@type': 'PostalAddress',
          addressLocality: property.city,
          addressRegion: property.location,
        },
      })),
    },
  };

  return schema;
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const properties = await getProperties(searchParams);
  const jsonLd = generatePropertiesListSchema(properties);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Available Properties
            </h1>
            <p className="text-gray-600">
              {properties.length} properties found
            </p>
          </header>

          <Suspense fallback={
            <div>
              <div className="mb-6">
                <div className="h-10 bg-gray-200 rounded w-48 animate-pulse" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl h-80 animate-pulse" />
                ))}
              </div>
            </div>
          }>
            <PropertiesPageClient initialProperties={properties} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
