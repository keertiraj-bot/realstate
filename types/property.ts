export interface Property {
  id: string;
  slug: string;
  title: string;
  location: string;
  city: string;
  price: number;
  property_type: 'apartment' | 'house' | 'villa' | 'condo' | 'land' | 'commercial';
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  amenities: string[];
  status: 'available' | 'sold' | 'rented';
  images: string[];
  description: string;
  featured?: boolean;
  tag?: 'New' | 'Featured' | 'Ready';
  created_at: string;
}

export interface PropertyFormData {
  title: string;
  location: string;
  city: string;
  price: number;
  property_type: Property['property_type'];
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  amenities: string[];
  status: Property['status'];
  images: string[];
  description: string;
  tag?: Property['tag'];
}
