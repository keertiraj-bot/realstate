'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Property } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';
import { Search, Home, ArrowRight, RotateCcw } from 'lucide-react';

interface PropertiesListProps {
  properties: Property[];
  isLoading?: boolean;
}

function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
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

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  const router = useRouter();

  if (hasFilters) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-amber-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          No Properties Found
        </h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          We couldn't find any properties matching your criteria. Try adjusting your filters or browse all available properties.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/properties')}
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Clear All Filters
          </button>
          <a
            href="/properties"
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            View All Properties
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Home className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        No Properties Available
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        We don't have any properties available at the moment. Check back soon or contact us for personalized assistance.
      </p>
      <a
        href="/contact"
        className="btn-primary inline-flex items-center justify-center gap-2"
      >
        Contact Us
        <ArrowRight className="w-4 h-4" />
      </a>
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
    return <EmptyState hasFilters={hasFilters} />;
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
