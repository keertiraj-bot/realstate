'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Bed, Bath, Square, MapPin, ArrowRight, Shield, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import { Property } from '@/types/property';
import { getPropertyWhatsAppMessage } from '@/lib/whatsapp';
import WhatsAppButton from '@/components/WhatsAppButton';

interface PropertyCardProps {
  property: Property;
}

const propertyTypeLabels: Record<Property['property_type'], string> = {
  apartment: 'Apartment',
  house: 'House',
  villa: 'Villa',
  condo: 'Condo',
  land: 'Land',
  commercial: 'Commercial',
};

const getTagColor = (tag?: string) => {
  if (tag === 'New') return 'bg-blue-500';
  if (tag === 'Featured') return 'bg-primary-500';
  if (tag === 'Ready') return 'bg-green-500';
  return 'bg-primary-500';
};

const getPossessionColor = (status?: string) => {
  if (status === 'Ready to Move') return 'bg-green-500';
  if (status === 'Under Construction') return 'bg-amber-500';
  return 'bg-blue-500';
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const whatsappMessage = getPropertyWhatsAppMessage({
    title: property.title,
    location: property.location,
    price: property.price,
  });

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="card group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/properties/${property.slug}`} aria-label={`View ${property.title}`} className="block relative h-48 sm:h-56 overflow-hidden flex-shrink-0">
        <Image
          src={property.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'}
          alt={`${property.title} - ${property.location}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {property.tag && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getTagColor(property.tag)} text-white shadow-sm`}>
              {property.tag}
            </span>
          )}
          {property.possession_status && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getPossessionColor(property.possession_status)} text-white flex items-center gap-1 shadow-sm`}>
              <Clock className="w-3 h-3" />
              {property.possession_status === 'Ready to Move' ? 'Ready' : 'Under Construction'}
            </span>
          )}
          {property.verified && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500 text-white flex items-center gap-1 shadow-sm">
              <Shield className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
          {propertyTypeLabels[property.property_type]}
        </span>

        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 shadow-sm">
            <Eye className="w-4 h-4" />
            View Details
          </span>
        </div>
      </Link>

      <div className=" flex-col flex-growp-5 flex">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              <Link href={`/properties/${property.slug}`}>
                {property.title}
              </Link>
            </h3>
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1.5">
              <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span className="line-clamp-1">{property.location}, {property.city}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-600 mb-4 flex-wrap">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
              <Bed className="w-4 h-4 text-primary-600" aria-hidden="true" />
              <span className="text-sm font-medium">{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
              <Bath className="w-4 h-4 text-primary-600" aria-hidden="true" />
              <span className="text-sm font-medium">{property.bathrooms} Baths</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
            <Square className="w-4 h-4 text-primary-600" aria-hidden="true" />
            <span className="text-sm font-medium">{property.area_sqft.toLocaleString()} sqft</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary-600">
                ₹{property.price.toLocaleString()}
              </p>
              {property.property_type === 'land' ? (
                <p className="text-xs text-gray-500">{propertyTypeLabels[property.property_type]}</p>
              ) : (
                <p className="text-xs text-gray-500">
                  ₹{Math.round(property.price / property.area_sqft).toLocaleString()}/sqft
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <WhatsAppButton
                message={whatsappMessage}
                className="p-2.5 bg-[#25D366] text-white rounded-lg hover:bg-[#20BD5A] transition-all hover:scale-105 active:scale-95 shadow-sm"
                aria-label="Chat on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </WhatsAppButton>
              <Link
                href={`/properties/${property.slug}`}
                className="p-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-1 shadow-sm"
                aria-label={`View ${property.title}`}
              >
                <span className="text-sm font-medium hidden sm:inline">View</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
