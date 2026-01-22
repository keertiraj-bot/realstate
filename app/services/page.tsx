import type { Metadata } from 'next';
import { Home, TrendingUp, Users, Building2, Search, HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Explore our comprehensive real estate services including property consulting, buying assistance, and investment guidance.',
};

const services = [
  {
    icon: Search,
    title: 'Real Estate Consulting',
    description: 'Expert guidance on property purchases, sales, and investments. Our experienced consultants analyze your requirements and recommend the best options tailored to your needs and budget.',
  },
  {
    icon: Home,
    title: 'Buying Assistance',
    description: 'End-to-end support in finding and purchasing your dream property. From property discovery to final negotiation, we handle every aspect to ensure a smooth buying experience.',
  },
  {
    icon: TrendingUp,
    title: 'Investment Guidance',
    description: 'Strategic advice for real estate investments. We analyze market trends, growth potential, and ROI to help you make informed investment decisions for maximum returns.',
  },
  {
    icon: Building2,
    title: 'Property Valuation',
    description: 'Professional property assessment using market data and expert analysis. Get accurate valuations for buying, selling, or refinancing purposes.',
  },
  {
    icon: Users,
    title: 'Legal Assistance',
    description: 'Complete support with property documentation and legal formalities. Our team ensures all paperwork is handled professionally and transparently.',
  },
  {
    icon: HeartHandshake,
    title: 'Post-Sale Support',
    description: 'Our relationship does not end at the sale. We provide ongoing support for property management, rental assistance, and future transactions.',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gray-900 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Services
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Comprehensive real estate solutions tailored to your needs
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                  <service.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Customized Solutions?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Every client has unique requirements. Contact us to discuss your specific needs and we will tailor our services accordingly.
            </p>
            <a
              href="https://wa.me/917084499128"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
