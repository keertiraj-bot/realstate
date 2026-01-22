'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Bed, Bath, Square, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Property } from '@/types/property';
import { generateWhatsAppUrl, getPropertyWhatsAppMessage } from '@/lib/whatsapp';

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

export default function PropertyCard({ property }: PropertyCardProps) {
  const whatsappMessage = getPropertyWhatsAppMessage({
    title: property.title,
    location: property.location,
    price: property.price,
  });

  return (
    <motion.article
      whileHover={{ y: -5 }}
      className="card group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/properties/${property.id}`} aria-label={`View ${property.title}`}>
        <div className="relative h-56 overflow-hidden">
          <Image
            src={property.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'}
            alt={`${property.title} - ${property.location}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {property.tag && (
            <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${getTagColor(property.tag)} text-white`}>
              {property.tag}
            </span>
          )}
          <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
            {propertyTypeLabels[property.property_type]}
          </span>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              <Link href={`/properties/${property.id}`}>
                {property.title}
              </Link>
            </h3>
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span className="line-clamp-1">{property.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-600 mb-4">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm">{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm">{property.bathrooms} Baths</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm">{property.area_sqft.toLocaleString()} sqft</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
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
            <a
              href={generateWhatsAppUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BD5A] transition-colors"
              aria-label="Chat on WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <Link
              href={`/properties/${property.id}`}
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1"
              aria-label={`View ${property.title}`}
            >
              <span className="text-sm font-medium hidden sm:inline">View</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
