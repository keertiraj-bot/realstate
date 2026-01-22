import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types/property';
import PropertyDetailClient from './PropertyDetailClient';

const BASE_URL = 'https://realstate-nu-sepia.vercel.app';

const demoProperties: Property[] = [
  {
    id: 'demo-1',
    slug: 'modern-3bhk-apartment-noida',
    title: 'Modern 3BHK Apartment in Sector 62, Noida',
    location: 'Sector 62, Noida',
    city: 'Noida',
    price: 8500000,
    property_type: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 1800,
    amenities: ['Gym', 'Swimming Pool', 'Parking', 'Security', 'Lift', 'Power Backup', 'Club House'],
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200',
    ],
    description: `This beautiful 3BHK apartment offers a perfect blend of comfort and luxury living. Located in the heart of Sector 62, Noida, this property provides excellent connectivity to major landmarks.

The apartment features spacious rooms with modern finishes, modular kitchen, and large windows that offer abundant natural light. The society is equipped with world-class amenities including swimming pool, gym, club house, and 24/7 security.

Perfect for families looking for a serene yet well-connected lifestyle.`,
    tag: 'Featured',
    created_at: new Date().toISOString(),
    possession_status: 'Ready to Move',
    verified: true,
    highlights: [
      'Prime location in Sector 62',
      'Well-connected to Delhi and Greater Noida',
      'Near major IT parks and schools',
      '24/7 Security and Power Backup',
      'Modern amenities and club house',
    ],
  },
  {
    id: 'demo-2',
    slug: 'luxury-villa-garden-gurgaon',
    title: 'Luxury Villa with Private Garden in DLF Phase 4',
    location: 'DLF Phase 4, Gurgaon',
    city: 'Gurgaon',
    price: 25000000,
    property_type: 'villa',
    bedrooms: 5,
    bathrooms: 4,
    area_sqft: 4500,
    amenities: ['Garden', 'Swimming Pool', 'Home Theater', 'Smart Home', 'Parking', 'Security'],
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
    ],
    description: `Experience the pinnacle of luxury living with this stunning 5BHK villa in DLF Phase 4, Gurgaon. This exquisite property features a private garden, home theater, and smart home automation throughout.

The villa is designed with premium finishes and offers ample space for comfortable living. Perfect for discerning buyers who seek exclusivity and luxury in one of Gurgaon's most prestigious locations.`,
    tag: 'New',
    created_at: new Date().toISOString(),
    possession_status: 'Ready to Move',
    verified: true,
    highlights: [
      'Private garden with landscaping',
      'Smart home automation',
      'Home theater and entertainment room',
      "Driver's room and servant quarters",
      'Close to shopping and dining options',
    ],
  },
  {
    id: 'demo-3',
    slug: 'commercial-office-space-cyber-city',
    title: 'Premium Commercial Office Space in Cyber City',
    location: 'Cyber City, Gurgaon',
    city: 'Gurgaon',
    price: 15000000,
    property_type: 'commercial',
    bedrooms: 0,
    bathrooms: 2,
    area_sqft: 2500,
    amenities: ['Conference Room', 'Cafeteria', 'Parking', '24/7 Power Backup', 'Security', 'Lift'],
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200',
    ],
    description: `Boost your business with this premium commercial office space in the heart of Cyber City, Gurgaon. This 2500 sqft space is perfect for corporate offices, startups, or professional services.

The space features modern infrastructure, high-speed internet connectivity, and access to world-class amenities. Located in one of Gurgaon's most sought-after commercial destinations.`,
    featured: true,
    created_at: new Date().toISOString(),
    possession_status: 'Ready to Move',
    verified: true,
    highlights: [
      'Prime commercial location',
      'Excellent connectivity to Metro',
      'World-class infrastructure',
      '24/7 Power backup and Security',
      'Dedicated parking space',
    ],
  },
  {
    id: 'demo-4',
    slug: '2bhk-budget-apartment-noida',
    title: 'Affordable 2BHK Apartment in Sector 45',
    location: 'Sector 45, Noida',
    city: 'Noida',
    price: 4500000,
    property_type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area_sqft: 1200,
    amenities: ['Parking', 'Security', 'Power Backup', 'Park', 'Kids Play Area'],
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200',
    ],
    description: `An affordable yet comfortable 2BHK apartment perfect for small families. Located in Sector 45, Noida, this property offers excellent value for money with all essential amenities.

The apartment features spacious rooms, a well-designed kitchen, and a balcony with community views. Ideal for first-time homebuyers looking for a quality home within budget.`,
    created_at: new Date().toISOString(),
    possession_status: 'Ready to Move',
    verified: true,
    highlights: [
      'Budget-friendly pricing',
      'NearSchools and Hospital',
      'Good public transport connectivity',
      'Safe and secure neighborhood',
      'Essential amenities included',
    ],
  },
  {
    id: 'demo-5',
    slug: 'penthouse-city-view-gurgaon',
    title: 'Exclusive Penthouse with Panoramic City View',
    location: 'Golf Course Road, Gurgaon',
    city: 'Gurgaon',
    price: 35000000,
    property_type: 'apartment',
    bedrooms: 4,
    bathrooms: 4,
    area_sqft: 3500,
    amenities: ['Rooftop Terrace', 'Private Lift', 'Smart Home', 'Concierge', 'Gym', 'Swimming Pool'],
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
    ],
    description: `Indulge in luxury with this exclusive penthouse offering breathtaking panoramic views of Gurgaon. Featuring a private terrace, personal lift, and smart home technology, this residence redefines premium living.

The penthouse includes a master suite with walk-in closet, modern kitchen with premium appliances, and access to premium amenities including concierge service.`,
    tag: 'Featured',
    created_at: new Date().toISOString(),
    possession_status: 'Ready to Move',
    verified: true,
    highlights: [
      'Panoramic city views',
      'Private terrace and garden',
      'Smart home technology',
      'Dedicated concierge service',
      'Premium amenities access',
    ],
  },
  {
    id: 'demo-6',
    slug: 'plot-construction-sector-128',
    title: 'Prime Plot for Construction in Sector 128',
    location: 'Sector 128, Noida',
    city: 'Noida',
    price: 8000000,
    property_type: 'land',
    bedrooms: 0,
    bathrooms: 0,
    area_sqft: 2000,
    amenities: ['Wide Road', 'Near Metro', 'Commercial Zone', 'Park', 'Security'],
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200',
      'https://images.unsplash.com/photo-1628744876497-eb30460be9f6?w=1200',
    ],
    description: `A prime residential plot ideal for building your dream home. Located in the rapidly developing Sector 128, Noida, this 2000 sqft plot offers excellent investment potential and building opportunities.

The plot is situated in a well-planned colony with all essential infrastructure including wide roads, proximity to metro, and community facilities.`,
    created_at: new Date().toISOString(),
    possession_status: 'Under Construction',
    verified: true,
    highlights: [
      'Noida Authority approved layout',
      'Close to upcoming metro station',
      'Wide main road access',
      'Near major schools and hospitals',
      'High appreciation potential',
    ],
  },
];

function getDemoPropertyBySlug(slug: string): Property | null {
  const property = demoProperties.find(p => p.slug === slug);
  if (property) {
    return {
      ...property,
      price_per_sqft: Math.round(property.price / property.area_sqft),
    };
  }
  return null;
}

function getAllDemoProperties(): Property[] {
  return demoProperties.map(p => ({
    ...p,
    price_per_sqft: Math.round(p.price / p.area_sqft),
  }));
}

export async function generateStaticParams() {
  try {
    const { data: properties } = await supabase
      .from('properties')
      .select('slug')
      .eq('status', 'available')
      .limit(50);

    if (!properties || properties.length === 0) {
      return getAllDemoProperties().map((property) => ({
        slug: property.slug,
      }));
    }

    return properties.map((property) => ({
      slug: property.slug,
    }));
  } catch {
    return getAllDemoProperties().map((property) => ({
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

  const title = `${property.title} | Dreams Home`;
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
      const property = data as Property;
      property.price_per_sqft = Math.round(property.price / property.area_sqft);
      return property;
    }

    const demoProperty = getDemoPropertyBySlug(slug);
    if (demoProperty) {
      return demoProperty;
    }

    return null;
  } catch {
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
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
          <p className="text-gray-500 mb-6">The property you are looking for does not exist or has been removed.</p>
          <a href="/properties" className="btn-primary inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Browse Properties
          </a>
        </div>
      </div>
    );
  }

  return <PropertyDetailClient property={property} />;
}
