'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types/property';
import Sidebar from '@/components/Admin/Sidebar';
import ProtectedRoute from '@/components/Admin/ProtectedRoute';
import { ArrowLeft, Upload, Loader2, X } from 'lucide-react';
import Link from 'next/link';

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  location: z.string().min(2, 'Location is required'),
  city: z.string().min(2, 'City is required'),
  price: z.number().min(1, 'Price is required'),
  property_type: z.enum(['apartment', 'house', 'villa', 'condo', 'land', 'commercial']),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  area_sqft: z.number().min(1, 'Area is required'),
  status: z.enum(['available', 'sold', 'rented']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tag: z.enum(['New', 'Featured', 'Ready']).optional(),
});

type PropertyFormInputs = z.infer<typeof propertySchema>;

const amenitiesList = [
  'Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden',
  'Lift', 'Power Backup', 'Club House', 'Kids Play Area',
  'CCTV', 'Intercom', 'Park', 'Shopping Complex', 'Hospital',
  'School', 'Metro Station', 'Railway Station', 'Airport',
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

async function generateUniqueSlugForUpdate(title: string, currentId: string, supabaseClient: any): Promise<string> {
  let slug = generateSlug(title);
  let counter = 1;
  let uniqueSlug = slug;

  while (true) {
    const { data } = await supabaseClient
      .from('properties')
      .select('slug')
      .eq('slug', uniqueSlug)
      .neq('id', currentId)
      .single();

    if (!data) {
      return uniqueSlug;
    }
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
}

export default function EditProperty() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormInputs>({
    resolver: zodResolver(propertySchema),
  });

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (error) throw error;

      if (data) {
        setImages(data.images || []);
        setSelectedAmenities(data.amenities || []);
        Object.keys(data).forEach((key) => {
          if (key !== 'images' && key !== 'amenities') {
            setValue(key as any, data[key]);
          }
        });
      }
    } catch (error) {
      toast.error('Failed to fetch property');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const onSubmit = async (data: PropertyFormInputs) => {
    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setSaving(true);
    try {
      const slug = await generateUniqueSlugForUpdate(data.title, propertyId, supabase);

      const propertyData = {
        ...data,
        slug,
        amenities: selectedAmenities,
        images,
      };

      const { error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', propertyId);

      if (error) {
        if (error.code === '23505') {
          toast.error('A property with similar title already exists. Please modify the title.');
        } else {
          throw error;
        }
        setSaving(false);
        return;
      }
      
      toast.success('Property updated successfully');
      router.push('/admin/properties');
      router.refresh();
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <main className="md:ml-64 p-6">
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        
        <main className="md:ml-64 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Link href="/admin/properties" className="p-2 hover:bg-gray-200 rounded-lg">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Title *
                    </label>
                    <input
                      {...register('title')}
                      className="input-field"
                      placeholder="e.g., Modern 3BHK Apartment in Sector 62"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Location *
                    </label>
                    <input
                      {...register('location')}
                      className="input-field"
                      placeholder="e.g., Sector 62, Noida"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      {...register('city')}
                      className="input-field"
                      placeholder="e.g., Noida"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      {...register('price', { valueAsNumber: true })}
                      type="number"
                      className="input-field"
                      placeholder="e.g., 8500000"
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type *
                    </label>
                    <select {...register('property_type')} className="input-field appearance-none cursor-pointer">
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="villa">Villa</option>
                      <option value="condo">Condo</option>
                      <option value="land">Land</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select {...register('status')} className="input-field appearance-none cursor-pointer">
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="rented">Rented</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tag
                    </label>
                    <select {...register('tag')} className="input-field appearance-none cursor-pointer">
                      <option value="">None</option>
                      <option value="New">New</option>
                      <option value="Featured">Featured</option>
                      <option value="Ready">Ready</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Property Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bedrooms
                    </label>
                    <input
                      {...register('bedrooms', { valueAsNumber: true })}
                      type="number"
                      className="input-field"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bathrooms
                    </label>
                    <input
                      {...register('bathrooms', { valueAsNumber: true })}
                      type="number"
                      className="input-field"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area (sqft) *
                    </label>
                    <input
                      {...register('area_sqft', { valueAsNumber: true })}
                      type="number"
                      className="input-field"
                      placeholder="e.g., 1800"
                    />
                    {errors.area_sqft && (
                      <p className="text-red-500 text-sm mt-1">{errors.area_sqft.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Description</h2>
                <textarea
                  {...register('description')}
                  rows={5}
                  className="input-field resize-none"
                  placeholder="Describe the property in detail..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {amenitiesList.map((amenity) => (
                    <label
                      key={amenity}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedAmenities.includes(amenity)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="sr-only"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Images</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <img src={img} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {images.length < 5 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Add Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                <p className="text-sm text-gray-500">Upload up to 5 images</p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
