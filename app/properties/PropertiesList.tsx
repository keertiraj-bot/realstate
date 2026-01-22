'use client';

import { useSearchParams } from 'next/navigation';
import { Property } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';

interface PropertiesListProps {
  properties: Property[];
  isLoading?: boolean;
}

function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="h-56 bg-gray-200" />
      <div className="p-5">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="flex gap-4 mb-4">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        <div className="flex justify-between pt-4 border-t">
          <div className="h-8 bg-gray-200 rounded w-24" />
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-gray-200 rounded-lg" />
            <div className="h-10 w-10 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesList({ properties, isLoading = false }: PropertiesListProps) {
  const searchParams = useSearchParams();
  const hasFilters = searchParams.has('location') || 
                   searchParams.has('type') || 
                   searchParams.has('minPrice') || 
                   searchParams.has('maxPrice') || 
                   searchParams.has('bedrooms');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

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
          <button className="btn-secondary" disabled>
            Load More Properties
          </button>
        </div>
      )}
    </>
  );
}
