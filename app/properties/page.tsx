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
    }

    if (data && data.length > 0) {
      return data;
    }

    return getDemoProperties(searchParams);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return getDemoProperties(searchParams);
  }
}

function getDemoProperties(searchParams: { [key: string]: string }): Property[] {
  const demoProperties: Property[] = [
    {
      id: 'demo-1',
      title: 'Modern 3BHK Apartment',
      location: 'Sector 62, Noida',
      city: 'Noida',
      price: 8500000,
      property_type: 'apartment',
      bedrooms: 3,
      bathrooms: 2,
      area_sqft: 1800,
      amenities: ['Gym', 'Swimming Pool', 'Parking', 'Security'],
      status: 'available',
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
      description: 'Beautiful modern apartment with all amenities',
      tag: 'Featured',
      created_at: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      title: 'Luxury Villa with Garden',
      location: 'DLF Phase 4, Gurgaon',
      city: 'Gurgaon',
      price: 25000000,
      property_type: 'villa',
      bedrooms: 5,
      bathrooms: 4,
      area_sqft: 4500,
      amenities: ['Garden', 'Swimming Pool', 'Home Theater', 'Smart Home'],
      status: 'available',
      images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
      description: 'Stunning luxury villa with premium finishes',
      tag: 'New',
      created_at: new Date().toISOString(),
    },
    {
      id: 'demo-3',
      title: 'Commercial Office Space',
      location: 'Cyber City, Gurgaon',
      city: 'Gurgaon',
      price: 15000000,
      property_type: 'commercial',
      bedrooms: 0,
      bathrooms: 2,
      area_sqft: 2500,
      amenities: ['Conference Room', 'Cafeteria', 'Parking', '24/7 Power Backup'],
      status: 'available',
      images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
      description: 'Premium commercial space in prime location',
      featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'demo-4',
      title: '2BHK Budget Apartment',
      location: 'Sector 45, Noida',
      city: 'Noida',
      price: 4500000,
      property_type: 'apartment',
      bedrooms: 2,
      bathrooms: 2,
      area_sqft: 1200,
      amenities: ['Parking', 'Security', 'Power Backup'],
      status: 'available',
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      description: 'Affordable apartment in a good location',
      created_at: new Date().toISOString(),
    },
    {
      id: 'demo-5',
      title: 'Penthouse with City View',
      location: 'Golf Course Road, Gurgaon',
      city: 'Gurgaon',
      price: 35000000,
      property_type: 'apartment',
      bedrooms: 4,
      bathrooms: 4,
      area_sqft: 3500,
      amenities: ['Rooftop Terrace', 'Private Lift', 'Smart Home', 'Concierge'],
      status: 'available',
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
      description: 'Exclusive penthouse with panoramic city views',
      tag: 'Featured',
      created_at: new Date().toISOString(),
    },
    {
      id: 'demo-6',
      title: 'Plot for Construction',
      location: 'Sector 128, Noida',
      city: 'Noida',
      price: 8000000,
      property_type: 'land',
      bedrooms: 0,
      bathrooms: 0,
      area_sqft: 2000,
      amenities: ['Wide Road', 'Near Metro', 'Commercial Zone'],
      status: 'available',
      images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
      description: 'Prime plot ideal for building your dream home',
      created_at: new Date().toISOString(),
    },
  ];

  let filtered = demoProperties;

  if (searchParams.location) {
    const loc = searchParams.location.toLowerCase();
    filtered = filtered.filter(p => 
      p.location.toLowerCase().includes(loc) || 
      p.city.toLowerCase().includes(loc)
    );
  }

  if (searchParams.type) {
    filtered = filtered.filter(p => p.property_type === searchParams.type);
  }

  if (searchParams.minPrice) {
    filtered = filtered.filter(p => p.price >= parseInt(searchParams.minPrice));
  }

  if (searchParams.maxPrice) {
    filtered = filtered.filter(p => p.price <= parseInt(searchParams.maxPrice));
  }

  if (searchParams.bedrooms) {
    filtered = filtered.filter(p => p.bedrooms >= parseInt(searchParams.bedrooms));
  }

  const sortBy = searchParams.sortBy || 'newest';
  switch (sortBy) {
    case 'price_low':
      filtered = [...filtered].sort((a, b) => a.price - b.price);
      break;
    case 'price_high':
      filtered = [...filtered].sort((a, b) => b.price - a.price);
      break;
    default:
      filtered = [...filtered].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  return filtered;
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
