'use client';

import { useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Property } from '@/types/property';
import Filters, { FilterState } from '@/components/Filters';
import PropertiesList from './PropertiesList';
import { trackFilterUsage } from '@/lib/analytics';

function FiltersLoading() {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-4 items-center animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-48" />
        <div className="h-10 bg-gray-200 rounded w-40" />
        <div className="h-10 bg-gray-200 rounded w-32" />
        <div className="h-10 bg-gray-200 rounded w-56" />
        <div className="h-10 bg-gray-200 rounded w-44" />
      </div>
    </div>
  );
}

function PropertiesListLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-xl h-80 animate-pulse" />
      ))}
    </div>
  );
}

function FiltersWrapper({ onFilterChange, isLoading }: { onFilterChange?: (filters: FilterState) => void; isLoading?: boolean }) {
  return <Filters onFilterChange={onFilterChange} isLoading={isLoading} />;
}

function PropertiesListWrapper({ properties, isLoading }: { properties: Property[]; isLoading?: boolean }) {
  return <PropertiesList properties={properties} isLoading={isLoading} />;
}

interface PropertiesPageClientProps {
  initialProperties: Property[];
}

export default function PropertiesPageClient({ initialProperties }: PropertiesPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = useCallback(async (filters: FilterState) => {
    setIsLoading(true);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && (key !== 'sortBy' || value !== 'newest')) {
        trackFilterUsage({
          filterType: key,
          filterValue: value,
          page: 1,
        });
      }
    });
    
    try {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && (key !== 'sortBy' || value !== 'newest')) {
          params.set(key, value);
        } else if (key === 'sortBy' && value === 'newest') {
          params.delete(key);
        } else {
          params.delete(key);
        }
      });

      const response = await fetch(`/api/properties?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching filtered properties:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  return (
    <>
      <Suspense fallback={<FiltersLoading />}>
        <FiltersWrapper onFilterChange={handleFilterChange} isLoading={isLoading} />
      </Suspense>
      <Suspense fallback={<PropertiesListLoading />}>
        <PropertiesListWrapper properties={properties} isLoading={isLoading} />
      </Suspense>
    </>
  );
}
