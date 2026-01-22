'use client';

import { useSearchParams } from 'next/navigation';
import { Property } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';

interface PropertiesListProps {
  properties: Property[];
}

export default function PropertiesList({ properties }: PropertiesListProps) {
  const searchParams = useSearchParams();
  const hasFilters = searchParams.has('location') || 
                   searchParams.has('type') || 
                   searchParams.has('minPrice') || 
                   searchParams.has('maxPrice') || 
                   searchParams.has('bedrooms');

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <p className="text-gray-500 mb-4">
          {hasFilters 
            ? 'No properties found matching your criteria'
            : 'No properties available at the moment'}
        </p>
        {hasFilters && (
          <a href="/properties" className="btn-primary inline-flex">
            View All Properties
          </a>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      
      {properties.length >= 12 && (
        <div className="text-center mt-10">
          <button className="btn-secondary">
            Load More Properties
          </button>
        </div>
      )}
    </>
  );
}
