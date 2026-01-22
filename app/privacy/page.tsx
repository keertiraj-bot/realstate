import { Metadata } from 'next';
import Link from 'next/link';
import { Building2, ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Dreams Home',
  description: 'Privacy policy governing the collection and use of your personal information.',
};

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">
            Last updated: January 2026
          </p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                At Dreams Home, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Data We Collect</h2>
              <p className="text-gray-600 mb-4">We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together follows:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Identity Data</strong> - Includes first name, last name, or similar identifier.</li>
                <li><strong>Contact Data</strong> - Includes email address, telephone numbers, and address.</li>
                <li><strong>Technical Data</strong> - Includes internet protocol (IP) address, browser type and version, time zone setting and location.</li>
                <li><strong>Usage Data</strong> - Includes information about how you use our website and services.</li>
                <li><strong>Enquiry Data</strong> - Includes information you provide when making property enquiries.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Data</h2>
              <p className="text-gray-600 mb-4">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To respond to your enquiries and provide customer support</li>
                <li>To notify you about changes to our service</li>
                <li>To provide you with information about other goods and services we offer</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing</h2>
              <p className="text-gray-600 mb-4">
                We may share your personal data with third parties including property developers, financial institutions for loan purposes, and service providers who assist in operating our website. We require all third parties to respect the security of your personal data and to treat it in accordance with the law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-600 mb-4">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. We also limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-600 mb-4">
                We will only retain your personal data for as long as reasonably necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting, or reporting requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Legal Rights</h2>
              <p className="text-gray-600 mb-4">Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Withdraw consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies</h2>
              <p className="text-gray-600 mb-4">
                Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site. You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date at the top of this privacy policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this privacy policy or our privacy practices, please contact us:
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
