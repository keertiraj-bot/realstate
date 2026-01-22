'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
  Phone,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { Property } from '@/types/property';
import EnquiryForm from '@/components/EnquiryForm';
import MobileStickyCTA from '@/components/MobileStickyCTA';
import {
  generateWhatsAppUrl,
  getPropertyWhatsAppMessage,
} from '@/lib/whatsapp';

interface PropertyDetailClientProps {
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

export default function PropertyDetailClient({
  property,
}: PropertyDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(
      localStorage.getItem('favoriteProperties') || '[]'
    );
    setIsFavorited(favorites.includes(property.id));
  }, [property.id]);

  const handleFavorite = () => {
    const favorites = JSON.parse(
      localStorage.getItem('favoriteProperties') || '[]'
    );
    let newFavorites;
    if (favorites.includes(property.id)) {
      newFavorites = favorites.filter((id: string) => id !== property.id);
    } else {
      newFavorites = [...favorites, property.id];
    }
    localStorage.setItem('favoriteProperties', JSON.stringify(newFavorites));
    setIsFavorited(!isFavorited);
  };

  const handleShare = async () => {
    const shareData = {
      title: property.title,
      text: `Check out this property: ${property.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const whatsappMessage = getPropertyWhatsAppMessage({
    title: property.title,
    location: property.location,
    price: property.price,
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: property.title,
    description: property.description,
    image: property.images[0],
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Dreams Home',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/properties"
              className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative">
                  <div className="aspect-[16/10] relative">
                    <Image
                      src={
                        property.images[currentImageIndex] ||
                        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200'
                      }
                      alt={`${property.title} - Image ${currentImageIndex + 1}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover"
                    />
                  </div>

                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  <div className="absolute top-4 left-4 flex gap-2">
                    {property.tag && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          property.tag === 'New'
                            ? 'bg-blue-500'
                            : property.tag === 'Featured'
                            ? 'bg-primary-500'
                            : 'bg-green-500'
                        } text-white`}
                      >
                        {property.tag}
                      </span>
                    )}
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                      {propertyTypeLabels[property.property_type]}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={handleFavorite}
                      className={`p-2 rounded-full shadow-lg transition-colors ${
                        isFavorited
                          ? 'bg-red-500 text-white'
                          : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white'
                      }`}
                      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart
                        className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`}
                      />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors relative"
                      aria-label="Share property"
                    >
                      <Share2 className="w-5 h-5 text-gray-700" />
                      {showShareTooltip && (
                        <div className="absolute top-full right-0 mt-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                          Copied!
                        </div>
                      )}
                    </button>
                  </div>

                  {property.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {property.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex
                              ? 'bg-white'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {property.title}
                      </h1>
                      <div className="flex items-center gap-2 text-gray-500 mt-2">
                        <MapPin className="w-5 h-5" />
                        <span>
                          {property.location}, {property.city}
                        </span>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-3xl font-bold text-primary-600">
                        ₹{property.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹
                        {Math.round(property.price / property.area_sqft).toLocaleString()}
                        /sqft
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-2">
                        <Bed className="w-5 h-5 text-primary-600" />
                        <span className="text-gray-700">
                          {property.bedrooms} Bedrooms
                        </span>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="flex items-center gap-2">
                        <Bath className="w-5 h-5 text-primary-600" />
                        <span className="text-gray-700">
                          {property.bathrooms} Bathrooms
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Square className="w-5 h-5 text-primary-600" />
                      <span className="text-gray-700">
                        {property.area_sqft.toLocaleString()} sqft
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <a
                    href={generateWhatsAppUrl(whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                  <a
                    href="tel:+919876543210"
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                </div>
              </div>

              <EnquiryForm
                propertyId={property.id}
                propertyTitle={property.title}
              />
            </div>
          </div>
        </motion.div>

        <MobileStickyCTA />
      </div>
    </>
  );
}
