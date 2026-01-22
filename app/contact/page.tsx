'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Mail, Clock, Send,
  MessageCircle, Building2
} from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: <MapPin className="w-6 h-6" aria-hidden="true" />,
    title: 'Visit Us',
    details: ['123 Business Park, Sector 62', 'Noida, Uttar Pradesh 201301'],
  },
  {
    icon: <Phone className="w-6 h-6" aria-hidden="true" />,
    title: 'Call Us',
    details: ['+91 1234567890', '+91 0987654321'],
  },
  {
    icon: <Mail className="w-6 h-6" aria-hidden="true" />,
    title: 'Email Us',
    details: ['info@dreamshome.com', 'support@dreamshome.com'],
  },
  {
    icon: <Clock className="w-6 h-6" aria-hidden="true" />,
    title: 'Working Hours',
    details: ['Mon - Sat: 9:00 AM - 7:00 PM', 'Sunday: 10:00 AM - 2:00 PM'],
  },
];

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Dreams Home',
  description: 'Your trusted partner in finding the perfect property.',
  url: 'https://realstate-nu-sepia.vercel.app',
  telephone: '+91-1234567890',
  email: 'info@dreamshome.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Business Park, Sector 62',
    addressLocality: 'Noida',
    addressRegion: 'Uttar Pradesh',
    postalCode: '201301',
    addressCountry: 'IN',
  },
};

function ContactJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
    />
  );
}

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          name: data.name,
          phone: data.phone,
          city: 'N/A',
          budget: 0,
          message: `Subject: ${data.subject}\n\n${data.message}`,
          source: 'contact_page',
        });

      if (error) throw error;
      
      toast.success('Message sent successfully! We will get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <>
      <ContactJsonLd />
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gray-900 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Contact Us
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name *
                        </label>
                        <input
                          {...register('name')}
                          id="name"
                          type="text"
                          className="input-field"
                          placeholder="Enter your name"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                          autoComplete="name"
                        />
                        {errors.name && (
                          <p id="name-error" className="text-red-500 text-sm mt-1" role="alert">{errors.name.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          {...register('phone')}
                          id="phone"
                          type="tel"
                          className="input-field"
                          placeholder="Enter your phone"
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? 'phone-error' : undefined}
                          autoComplete="tel"
                        />
                        {errors.phone && (
                          <p id="phone-error" className="text-red-500 text-sm mt-1" role="alert">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        {...register('email')}
                        id="email"
                        type="email"
                        className="input-field"
                        placeholder="Enter your email"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        autoComplete="email"
                      />
                      {errors.email && (
                        <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject *
                      </label>
                      <input
                        {...register('subject')}
                        id="subject"
                        type="text"
                        className="input-field"
                        placeholder="How can we help?"
                        aria-invalid={!!errors.subject}
                        aria-describedby={errors.subject ? 'subject-error' : undefined}
                      />
                      {errors.subject && (
                        <p id="subject-error" className="text-red-500 text-sm mt-1" role="alert">{errors.subject.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message *
                      </label>
                      <textarea
                        {...register('message')}
                        id="message"
                        rows={5}
                        className="input-field resize-none"
                        placeholder="Write your message here..."
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                      />
                      {errors.message && (
                        <p id="message-error" className="text-red-500 text-sm mt-1" role="alert">{errors.message.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      aria-busy={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="w-5 h-5" aria-hidden="true" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contactInfo.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-sm p-6"
                    >
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4" aria-hidden="true">
                        {item.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      {item.details.map((detail, i) => (
                        <p key={i} className="text-gray-600 text-sm">{detail}</p>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary-600" aria-hidden="true" />
                    Quick Support
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Prefer talking to someone? Chat with us on WhatsApp for quick responses!
                  </p>
                  <a
                    href="https://wa.me/1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full flex items-center justify-center gap-2"
                    aria-label="Chat with us on WhatsApp"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>

                <div className="bg-primary-600 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className="w-8 h-8" aria-hidden="true" />
                    <span className="text-xl font-bold">Dreams Home</span>
                  </div>
                  <p className="text-primary-100">
                    Your trusted partner in finding the perfect property. We make real estate simple, transparent, and accessible for everyone.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
