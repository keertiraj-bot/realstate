'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';
import Filters from '@/components/Filters';
import { Loader2 } from 'lucide-react';

function PropertiesInner() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      let query = supabase.from('properties').select('*').eq('status', 'available');

      const location = searchParams.get('location');
      const type = searchParams.get('type');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const bedrooms = searchParams.get('bedrooms');
      const sortBy = searchParams.get('sortBy') || 'newest';

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

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Available Properties
        </h1>
        <p className="text-gray-600">
          {loading ? 'Searching...' : `${properties.length} properties found`}
        </p>
      </div>

      <Filters />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500 mb-4">No properties found matching your criteria</p>
          <a href="/properties" className="btn-primary inline-flex">
            View All Properties
          </a>
        </div>
      ) : (
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
      )}
    </>
  );
}

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Suspense fallback={
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Available Properties
            </h1>
            <p className="text-gray-600">Loading...</p>
          </div>
        }>
          <PropertiesInner />
        </Suspense>
      </div>
    </div>
  );
}
