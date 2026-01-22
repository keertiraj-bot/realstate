import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://realstate-nu-sepia.vercel.app';

async function getPropertyUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const { data: properties } = await supabase
      .from('properties')
      .select('id, title, created_at')
      .eq('status', 'available')
      .limit(100);

    if (!properties || properties.length === 0) {
      return [];
    }

    return properties.map((property) => ({
      url: `${BASE_URL}/properties/${property.id}`,
      lastModified: new Date(property.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();
  
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/properties`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const propertyUrls = await getPropertyUrls();
  
  return [...staticUrls, ...propertyUrls];
}
