import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types/property';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', 'available');

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

    if (error) {
      console.error('Error fetching properties:', error);
      return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }

    return NextResponse.json(data as Property[] || []);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
