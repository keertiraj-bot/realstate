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
  Shield,
  Clock,
  Map,
  Building,
  TrendingUp,
  Home,
  Star,
  DollarSign,
  Target,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Property } from '@/types/property';
import EnquiryForm from '@/components/EnquiryForm';
import MobileStickyCTA from '@/components/MobileStickyCTA';
import {
  generateWhatsAppUrl,
  getPropertyWhatsAppMessage,
} from '@/lib/whatsapp';
import WhatsAppButton from '@/components/WhatsAppButton';
import { trackPropertyView, trackCTAClick } from '@/lib/analytics';

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

  useEffect(() => {
    trackPropertyView({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyType: property.property_type,
      location: property.location,
      price: property.price,
    });
  }, [property]);

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
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    image: property.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200',
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validFrom: property.created_at,
      seller: {
        '@type': 'Organization',
        name: 'Dreams Home',
        url: 'https://realstate-nu-sepia.vercel.app',
      },
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.location,
      addressLocality: property.city,
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.6139,
      longitude: 77.2090,
    },
    numberOfRooms: property.bedrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.area_sqft,
      unitCode: 'FTK',
    },
    amenityFeature: property.amenities?.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
    })),
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

                  <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
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
                    {property.verified && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-500 text-white flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                    {property.possession_status && (
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        property.possession_status === 'Ready to Move'
                          ? 'bg-green-500'
                          : property.possession_status === 'Under Construction'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      } text-white flex items-center gap-1`}>
                        <Clock className="w-3 h-3" />
                        {property.possession_status}
                      </span>
                    )}
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
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary-600" />
                  About This Property
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
                {property.property_type !== 'land' && (
                  <div className="mt-6 p-4 bg-primary-50 rounded-xl border border-primary-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="font-semibold text-gray-900">Price per sqft</span>
                    </div>
                    <p className="text-2xl font-bold text-primary-600">
                      ₹{Math.round(property.price / property.area_sqft).toLocaleString()} / sqft
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Total: {property.area_sqft.toLocaleString()} sqft × ₹{Math.round(property.price / property.area_sqft).toLocaleString()} = ₹{property.price.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary-600" />
                  Amenities & Features
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities?.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Map className="w-5 h-5 text-primary-600" />
                  Location Advantages
                </h2>
                <p className="text-gray-600 mb-6">
                  Situated in the prime location of <span className="font-medium text-gray-900">{property.location}, {property.city}</span>, 
                  this property offers excellent connectivity and access to essential services for modern living.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Metro Station</p>
                      <p className="text-sm text-gray-500">Within 2 km - Direct metro connectivity to major business districts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Schools & Education</p>
                      <p className="text-sm text-gray-500">Multiple CBSE/ICSE schools within 3 km radius</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Hospitals & Healthcare</p>
                      <p className="text-sm text-gray-500">Multi-specialty hospitals within 5 km</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Business Hubs</p>
                      <p className="text-sm text-gray-500">Major IT parks and commercial centers nearby</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Shopping & Recreation</p>
                      <p className="text-sm text-gray-500">Shopping malls, parks, and entertainment within 3 km</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Airport Connectivity</p>
                      <p className="text-sm text-gray-500">45 km from Indira Gandhi International Airport</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary-600" />
                  Why Buy This Property?
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Prime Location</p>
                      <p className="text-sm text-gray-600">
                        Located in one of the most sought-after areas with excellent infrastructure and future appreciation potential
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">High Investment Value</p>
                      <p className="text-sm text-gray-600">
                        Properties in this area have shown consistent appreciation. Excellent rental demand for investors.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Home className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Modern Lifestyle</p>
                      <p className="text-sm text-gray-600">
                        Premium amenities, smart home features, and contemporary design for comfortable modern living.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Trust & Transparency</p>
                      <p className="text-sm text-gray-600">
                        {property.verified ? 'Verified property with complete documentation and transparent pricing.' : 'Complete legal verification and transparent transaction process.'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-primary-50 rounded-xl border border-primary-100">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Quick Possession</p>
                      <p className="text-sm text-gray-600">
                        {property.possession_status === 'Ready to Move' 
                          ? 'Ready to move - Immediate possession available!' 
                          : property.possession_status === 'Under Construction'
                          ? 'Under construction - Expected completion soon'
                          : 'Upcoming project - Book now for best pricing'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {property.highlights && property.highlights.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Key Highlights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="text-gray-700 text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Property Overview
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-primary-600">
                      ₹{Math.round(property.price / property.area_sqft).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">per sqft</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900">
                      {property.area_sqft.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Total Area (sqft)</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900">
                      {property.bedrooms > 0 ? property.bedrooms : '-'}
                    </p>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900">
                      {property.bathrooms > 0 ? property.bathrooms : '-'}
                    </p>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <WhatsAppButton
                    message={whatsappMessage}
                    propertyId={property.id}
                    propertyTitle={property.title}
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
                  </WhatsAppButton>
                  <a
                    href={`tel:+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}`}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                    onClick={() => trackCTAClick({ ctaType: 'call', ctaLocation: `Property: ${property.title}`, propertyId: property.id })}
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                </div>
              </div>

              <EnquiryForm
                propertySlug={property.slug}
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
