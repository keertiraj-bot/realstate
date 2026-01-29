'use server';

import { createClient } from '@supabase/supabase-js';
// Define types locally to avoid import issues
interface LeadFormData {
  name: string;
  phone: string;
  city: string;
  budget: number;
  property_id?: string;
  message?: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface SubmitEnquiryResult {
  success: boolean;
  error?: string;
}

export async function submitEnquiry(
  data: LeadFormData,
  propertySlug?: string,
  propertyTitle?: string
): Promise<SubmitEnquiryResult> {
  try {
    // If using example credentials, return demo success
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (supabaseUrl.includes('example.supabase.co')) {
      console.log('Demo mode: Enquiry would be saved:', {
        name: data.name,
        phone: data.phone,
        city: data.city,
        budget: data.budget,
        propertySlug,
        message: data.message,
      });
      return { success: true };
    }

    if (!data.name || !data.phone || !data.city || !data.budget) {
      return { success: false, error: 'Missing required fields' };
    }

    if (data.name.trim().length < 2) {
      return { success: false, error: 'Name must be at least 2 characters' };
    }

    if (data.city.trim().length < 2) {
      return { success: false, error: 'Please enter a valid city' };
    }

    if (data.budget < 100000 || data.budget > 1000000000) {
      return { success: false, error: 'Invalid budget amount' };
    }

    const { error } = await supabase
      .from('leads')
      .insert({
        name: data.name.trim(),
        phone: data.phone.trim(),
        city: data.city.trim(),
        budget: data.budget,
        property_id: propertySlug || null,
        property_title: propertyTitle || null,
        message: data.message?.trim() || null,
        source: propertySlug ? 'property_enquiry' : 'general',
        status: 'new',
      });

    if (error) {
      console.error('Supabase error:', error);
      
      if (error.code === '23505') {
        return { success: false, error: 'You have already submitted this enquiry' };
      }
      
      return { success: false, error: 'Database error. Please try again.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
