'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Property } from '@/types/property';
import Filters, { FilterState } from '@/components/Filters';
import PropertiesList from './PropertiesList';

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
      <Filters onFilterChange={handleFilterChange} isLoading={isLoading} />
      <PropertiesList properties={properties} isLoading={isLoading} />
    </>
  );
}
