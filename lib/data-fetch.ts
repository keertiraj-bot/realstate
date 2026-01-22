import { supabase } from './supabase';

export async function getPropertiesCached() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }

  return data || [];
}

export async function getPropertyById(id: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching property:', error);
    return null;
  }

  return data;
}

export async function getLeadsStats() {
  const [propertiesCount, leadsCount] = await Promise.all([
    supabase.from('properties').select('id', { count: 'exact', head: true }),
    supabase.from('leads').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalProperties: propertiesCount.count || 0,
    totalLeads: leadsCount.count || 0,
  };
}
