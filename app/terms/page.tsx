import { Metadata } from 'next';
import Link from 'next/link';
import { Building2, ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Dreams Home',
  description: 'Terms and conditions governing the use of Dreams Home website and services.',
};

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-gray-600 mb-8">
            Last updated: January 2026
          </p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use of Website</h2>
              <p className="text-gray-600 mb-4">
                This website is intended for legitimate property enquiries and information purposes only. You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use and enjoyment of this site by any third party.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Property Information</h2>
              <p className="text-gray-600 mb-4">
                All property information, including prices, specifications, and availability, is subject to change without notice. While we strive to provide accurate information, we do not warrant that the content on this website is complete, reliable, or current.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                All content on this website, including text, graphics, logos, images, and software, is the property of Dreams Home or its content suppliers and is protected by copyright and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                Dreams Home shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of this website or with the delay or inability to use this website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Third-Party Links</h2>
              <p className="text-gray-600 mb-4">
                This website may contain links to third-party websites that are not owned or controlled by Dreams Home. We have no control over and assume no responsibility for, the content, privacy policies, or practices of any third-party websites.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy Policy</h2>
              <p className="text-gray-600 mb-4">
                Your use of this website is also governed by our Privacy Policy. By using this website, you consent to the collection and use of information as described in our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                Dreams Home reserves the right to modify, alter, or otherwise update these terms at any time. Such modifications shall be effective immediately upon posting. Your continued use of the site after such modifications constitutes your acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-gray-700"><strong>Dreams Home</strong></p>
                <p className="text-gray-600">123 Business Park, Sector 62, Noida</p>
                <p className="text-gray-600">Phone: +91 7084499128</p>
                <p className="text-gray-600">Email: info@dreamshome.com</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
