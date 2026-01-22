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

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const properties = await getProperties(searchParams);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Available Properties
          </h1>
          <p className="text-gray-600">
            {properties.length} properties found
          </p>
        </div>

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
  );
}
