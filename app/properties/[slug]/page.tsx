import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types/property';
import PropertyDetailClient from './PropertyDetailClient';

const BASE_URL = 'https://realstate-nu-sepia.vercel.app';

const demoProperties: Property[] = [
  {
    id: 'demo-1',
    slug: 'modern-3bhk-apartment-noida',
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
    description: 'Beautiful modern apartment with all amenities. Features a spacious living area, modular kitchen, and premium fittings throughout.',
    tag: 'Featured',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    slug: 'luxury-villa-garden-gurgaon',
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
    description: 'Stunning luxury villa with premium finishes. Features a private garden, home theater, and smart home automation.',
    tag: 'New',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    slug: 'commercial-office-space-cyber-city',
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
    description: 'Premium commercial space in prime location. Perfect for corporate offices with modern amenities.',
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    slug: '2bhk-budget-apartment-noida',
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
    description: 'Affordable apartment in a good location. Ideal for small families looking for comfortable living.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-5',
    slug: 'penthouse-city-view-gurgaon',
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
    description: 'Exclusive penthouse with panoramic city views. Features private terrace and concierge service.',
    tag: 'Featured',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-6',
    slug: 'plot-construction-sector-128',
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
    description: 'Prime plot ideal for building your dream home. Located in a developing area with good connectivity.',
    created_at: new Date().toISOString(),
  },
];

function getDemoPropertyBySlug(slug: string): Property | null {
  return demoProperties.find(p => p.slug === slug) || null;
}

export async function generateStaticParams() {
  try {
    const { data: properties } = await supabase
      .from('properties')
      .select('slug')
      .eq('status', 'available')
      .limit(50);

    if (!properties || properties.length === 0) {
      return demoProperties.map((property) => ({
        slug: property.slug,
      }));
    }

    return properties.map((property) => ({
      slug: property.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return demoProperties.map((property) => ({
      slug: property.slug,
    }));
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const property = await getProperty(params.slug);

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
      url: `${BASE_URL}/properties/${property.slug}`,
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
      canonical: `${BASE_URL}/properties/${property.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

async function getProperty(slug: string): Promise<Property | null> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('slug', slug)
      .single();

    if (data && !error) {
      return data as Property;
    }

    const demoProperty = getDemoPropertyBySlug(slug);
    if (demoProperty) {
      return demoProperty;
    }

    console.error('Property not found:', slug);
    return null;
  } catch (error) {
    console.error('Error fetching property:', error);
    const demoProperty = getDemoPropertyBySlug(slug);
    return demoProperty;
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const property = await getProperty(params.slug);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-500 mb-4 text-lg">Property not found</p>
        <a href="/properties" className="btn-primary">
          Back to Properties
        </a>
      </div>
    );
  }

  return <PropertyDetailClient property={property} />;
}
