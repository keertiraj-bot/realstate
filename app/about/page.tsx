import type { Metadata } from 'next';
import { Building2, Award, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Dreams Home - your trusted partner in finding the perfect property. With years of experience in real estate, we make finding your dream home simple and accessible.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gray-900 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Us
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Your trusted partner in finding the perfect property
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Who We Are
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Dreams Home is a premier real estate platform dedicated to helping you find your perfect property. With years of experience in the real estate industry, we understand that finding the right home is more than just a transaction — it's about building your future.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Our team consists of experienced professionals who are passionate about real estate and committed to providing exceptional service. We believe in transparency, integrity, and putting our clients' needs first.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether you're looking to buy, sell, or invest in property, we guide you through every step of the process with expert advice and personalized attention.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-primary-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">500+</p>
                  <p className="text-gray-600">Properties Sold</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">1000+</p>
                  <p className="text-gray-600">Happy Clients</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-primary-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">15+</p>
                  <p className="text-gray-600">Years Experience</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-primary-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">200+</p>
                  <p className="text-gray-600">Projects Listed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To simplify the real estate journey for our clients by providing transparent, reliable, and personalized services. We strive to make property search and acquisition a seamless experience, helping families and investors find spaces that perfectly match their needs and aspirations.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the most trusted real estate partner in the region, setting new standards of excellence in customer service and industry professionalism. We envision a world where everyone has access to reliable real estate guidance and finds their dream home with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our extensive collection of properties and let us help you find the perfect place to call home.
          </p>
          <Link href="/properties" className="btn-primary inline-flex items-center gap-2">
            Browse Properties
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
