import { Metadata } from 'next';
import Link from 'next/link';
import { Building2, ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Dreams Home',
  description: 'Find answers to common questions about buying, selling, and renting properties with Dreams Home.',
};

const faqs = [
  {
    question: 'How can I schedule a property visit?',
    answer: 'You can schedule a property visit by contacting us via WhatsApp at +91 7084499128, calling us directly, or filling out the enquiry form on any property page. Our team will arrange a convenient time for you.',
  },
  {
    question: 'Do you charge any brokerage fees?',
    answer: 'No, Dreams Home does not charge any brokerage fees. We connect buyers directly with property owners and developers, saving you the commission.',
  },
  {
    question: 'Are the properties verified?',
    answer: 'Yes, all properties listed on Dreams Home go through a verification process. We display a verified badge on properties that have been thoroughly checked for authenticity and legal clearance.',
  },
  {
    question: 'Can I get home loan assistance?',
    answer: 'Yes, we have partnerships with leading banks and financial institutions. Our team can help you with home loan eligibility checks and guide you through the application process.',
  },
  {
    question: 'How do I list my property for sale/rent?',
    answer: 'You can list your property by visiting our admin portal or contacting us directly. Our team will assist you with property valuation, photography, and listing creation.',
  },
  {
    question: 'What documents are required to buy a property?',
    answer: 'Required documents typically include identity proof, address proof, income documents, and bank statements. Our team will guide you through the complete documentation process based on your specific requirements.',
  },
  {
    question: 'Do you provide property investment advice?',
    answer: 'Yes, our experienced team provides comprehensive investment advice including market analysis, property valuation, ROI projections, and legal due diligence.',
  },
  {
    question: 'What areas do you cover?',
    answer: 'We primarily serve Noida, Greater Noida, and Gurgaon. Contact us for properties in other locations as we have a network of trusted partners across major Indian cities.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-primary-500 hover:text-primary-600">
              <Building2 className="w-6 h-6" />
              <span className="text-xl font-bold">Dreams Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-500 mb-8">
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600 mb-8">
            Find answers to common questions about our services and property buying process.
          </p>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h2>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-primary-50 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Still have questions?</h2>
            <p className="text-gray-600 mb-6">
              Contact us directly and we'll be happy to help.
            </p>
            <a
              href="https://wa.me/917084499128"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg hover:bg-[#20BD5A] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
