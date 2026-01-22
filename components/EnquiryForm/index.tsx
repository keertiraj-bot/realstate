'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { LeadFormData } from '@/types/lead';

const LEAD_COOKIE_NAME = 'lead_submitted';
const LEAD_COOKIE_EXPIRY_DAYS = 7;

const phoneRegex = /^[6-9]\d{9}$/;

const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  phone: z.string()
    .min(10, 'Please enter a valid phone number')
    .regex(phoneRegex, 'Please enter a valid 10-digit phone number'),
  city: z.string().min(2, 'Please enter your city').max(100, 'City name is too long'),
  budget: z.number({ invalid_type_error: 'Please enter your budget' })
    .min(100000, 'Minimum budget is ₹1,00,000')
    .max(1000000000, 'Maximum budget is ₹100 Crore'),
  message: z.string().max(1000, 'Message is too long').optional(),
});

interface EnquiryFormProps {
  propertyId?: string;
  propertyTitle?: string;
}

export default function EnquiryForm({ propertyId, propertyTitle }: EnquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<LeadFormData>({
    resolver: zodResolver(enquirySchema),
    mode: 'onChange',
  });

  const checkDuplicateLead = useCallback(async (phone: string, propertyId?: string) => {
    let query = supabase
      .from('leads')
      .select('id, created_at')
      .eq('phone', phone)
      .eq('source', propertyId ? 'property_enquiry' : 'general')
      .order('created_at', { ascending: false })
      .limit(1);

    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }

    const { data } = await query;
    
    if (data && data.length > 0) {
      const lastLead = data[0];
      const hoursSinceLastLead = (Date.now() - new Date(lastLead.created_at).getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastLead < 24) {
        return true;
      }
    }
    return false;
  }, []);

  const setLeadCookie = useCallback(() => {
    if (typeof document !== 'undefined') {
      const date = new Date();
      date.setTime(date.getTime() + LEAD_COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
      document.cookie = `${LEAD_COOKIE_NAME}=true; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
    }
  }, []);

  const hasSubmittedLead = useCallback(() => {
    if (typeof document !== 'undefined') {
      return document.cookie.split('; ').find(row => row.startsWith(`${LEAD_COOKIE_NAME}=`)) !== undefined;
    }
    return false;
  }, []);

  const onSubmit = async (data: LeadFormData) => {
    if (hasSubmittedLead()) {
      toast.error('You have already submitted an enquiry recently. Please wait 24 hours.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const isDuplicate = await checkDuplicateLead(data.phone, propertyId);
      if (isDuplicate) {
        toast.error('You have already enquired about this property recently.');
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('leads')
        .insert({
          name: data.name.trim(),
          phone: data.phone.trim(),
          city: data.city.trim(),
          budget: data.budget,
          property_id: propertyId || null,
          message: data.message?.trim() || null,
          source: propertyId ? 'property_enquiry' : 'general',
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('You have already submitted this enquiry.');
        } else {
          throw error;
        }
        return;
      }

      setLeadCookie();
      toast.success('Thank you! We will contact you soon.', {
        duration: 5000,
      });
      reset();
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast.error('Something went wrong. Please try again.', {
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Enquire About This Property
      </h3>
      {propertyTitle && (
        <p className="text-gray-600 mb-6">
          Interested in: <span className="font-medium text-primary-600">{propertyTitle}</span>
        </p>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name *
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter your full name"
            disabled={isSubmitting}
            autoComplete="name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <div className="relative">
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              className={`input-field ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter 10-digit mobile number"
              disabled={isSubmitting}
              autoComplete="tel"
              maxLength={10}
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            Your City *
          </label>
          <input
            {...register('city')}
            type="text"
            id="city"
            className={`input-field ${errors.city ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter your city"
            disabled={isSubmitting}
            autoComplete="address-level2"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
            Budget (₹) *
          </label>
          <input
            {...register('budget', { valueAsNumber: true })}
            type="number"
            id="budget"
            className={`input-field ${errors.budget ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter your budget in INR"
            disabled={isSubmitting}
            min="100000"
            max="1000000000"
            step="100000"
          />
          {errors.budget && (
            <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message (Optional)
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={3}
            className={`input-field resize-none ${errors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Any specific requirements or questions?"
            disabled={isSubmitting}
            maxLength={1000}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Enquiry'
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-4 text-center">
        By submitting, you agree to our Terms & Privacy Policy
      </p>
    </div>
  );
}
