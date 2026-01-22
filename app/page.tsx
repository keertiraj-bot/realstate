import Hero from '@/components/Hero';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import Testimonials from '@/components/Testimonials';
import MobileStickyCTA from '@/components/MobileStickyCTA';
import { Property } from '@/types/property';

const featuredProperties: Property[] = [
  {
    id: '1',
    slug: 'modern-3bhk-apartment',
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
    id: '2',
    slug: 'luxury-villa-garden',
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
    id: '3',
    slug: 'commercial-office-space',
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
];

export default function Home() {
  return (
    <>
      <Hero />
      <SearchBar />
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties tailored for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <a
              href="/properties"
              className="btn-primary inline-flex items-center gap-2"
            >
              View All Properties
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
      
      <Testimonials />
      <MobileStickyCTA />
    </>
  );
}
