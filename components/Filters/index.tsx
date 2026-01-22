'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Filter, Loader2 } from 'lucide-react';

interface FiltersProps {
  onFilterChange?: (filters: FilterState) => void;
  isLoading?: boolean;
}

export interface FilterState {
  location: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  sortBy: string;
}

const propertyTypes = [
  { value: '', label: 'All Types' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'condo', label: 'Condo' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
];

const bedroomOptions = [
  { value: '', label: 'Any' },
  { value: '1', label: '1+ BHK' },
  { value: '2', label: '2+ BHK' },
  { value: '3', label: '3+ BHK' },
  { value: '4', label: '4+ BHK' },
  { value: '5', label: '5+ BHK' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

export default function Filters({ onFilterChange, isLoading = false }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>({
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
  });

  const updateFilters = useCallback((key: keyof FilterState, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange?.(newFilters);
    
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/properties?${params.toString()}`, { scroll: false });
  }, [localFilters, onFilterChange, router, searchParams]);

  const clearFilters = useCallback(() => {
    const clearedFilters = {
      location: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      sortBy: 'newest',
    };
    setLocalFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
    router.push('/properties', { scroll: false });
  }, [onFilterChange, router]);

  const hasActiveFilters = Object.entries(localFilters).some(([key, value]) => {
    if (key === 'sortBy') return value !== 'newest';
    return value !== '';
  });

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setIsMobileOpen(true)}
            disabled={isLoading}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Filter className="w-5 h-5" />
            Filters
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              disabled={isLoading}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        <div className="hidden md:flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search location..."
            value={localFilters.location}
            onChange={(e) => updateFilters('location', e.target.value)}
            disabled={isLoading}
            className="input-field w-48 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <select
            value={localFilters.type}
            onChange={(e) => updateFilters('type', e.target.value)}
            disabled={isLoading}
            className="input-field w-40 appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <select
            value={localFilters.bedrooms}
            onChange={(e) => updateFilters('bedrooms', e.target.value)}
            disabled={isLoading}
            className="input-field w-32 appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {bedroomOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.minPrice}
              onChange={(e) => updateFilters('minPrice', e.target.value)}
              disabled={isLoading}
              className="input-field w-28 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={localFilters.maxPrice}
              onChange={(e) => updateFilters('maxPrice', e.target.value)}
              disabled={isLoading}
              className="input-field w-28 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <select
            value={localFilters.sortBy}
            onChange={(e) => updateFilters('sortBy', e.target.value)}
            disabled={isLoading}
            className="input-field w-44 appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setIsMobileOpen(false)} 
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setIsMobileOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={localFilters.location}
                  onChange={(e) => updateFilters('location', e.target.value)}
                  className="input-field"
                  placeholder="Search location..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={localFilters.type}
                  onChange={(e) => updateFilters('type', e.target.value)}
                  className="input-field appearance-none cursor-pointer"
                >
                  {propertyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <select
                  value={localFilters.bedrooms}
                  onChange={(e) => updateFilters('bedrooms', e.target.value)}
                  className="input-field appearance-none cursor-pointer"
                >
                  {bedroomOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (₹)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={localFilters.minPrice}
                    onChange={(e) => updateFilters('minPrice', e.target.value)}
                    className="input-field w-1/2"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={localFilters.maxPrice}
                    onChange={(e) => updateFilters('maxPrice', e.target.value)}
                    className="input-field w-1/2"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={localFilters.sortBy}
                  onChange={(e) => updateFilters('sortBy', e.target.value)}
                  className="input-field appearance-none cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={clearFilters}
                  className="btn-secondary flex-1"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="btn-primary flex-1"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
