'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (propertyType) params.set('type', propertyType);
    if (budget) params.set('budget', budget);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="py-8 px-4 -mt-8 relative z-20" aria-label="Property Search">
      <div className="container mx-auto">
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
          role="search"
          aria-label="Search properties"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <label htmlFor="search-location" className="sr-only">Location</label>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
              <input
                type="text"
                id="search-location"
                placeholder="Location (City or Area)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field pl-12"
                aria-label="Search by location"
              />
            </div>
            
            <div>
              <label htmlFor="search-type" className="sr-only">Property Type</label>
              <select
                id="search-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="input-field appearance-none cursor-pointer"
                aria-label="Select property type"
              >
                <option value="">Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="search-budget" className="sr-only">Budget</label>
              <select
                id="search-budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="input-field appearance-none cursor-pointer"
                aria-label="Select budget range"
              >
                <option value="">Budget</option>
                <option value="0-5000000">Under ₹50 Lakh</option>
                <option value="5000000-10000000">₹50 Lakh - ₹1 Crore</option>
                <option value="10000000-20000000">₹1 - ₹2 Crore</option>
                <option value="20000000-50000000">₹2 - ₹5 Crore</option>
                <option value="50000000-100000000">Above ₹5 Crore</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2"
              aria-label="Search properties"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
