'use client';

import { motion } from 'framer-motion';
import { Star, User } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Rahul Sharma',
    role: 'Home Buyer',
    rating: 5,
    content: 'Found my dream apartment through Dreams Home. The team was extremely helpful and guided me through every step. Highly recommended!',
    property: '3BHK in Sector 62, Noida',
  },
  {
    id: 2,
    name: 'Priya Singh',
    role: 'Investor',
    rating: 5,
    content: 'Excellent service and genuine properties. The team understood my requirements perfectly and helped me find a great investment opportunity.',
    property: 'Villa in DLF Phase 4, Gurgaon',
  },
  {
    id: 3,
    name: 'Amit Kumar',
    role: 'First-time Buyer',
    rating: 5,
    content: 'As a first-time buyer, I was nervous but Dreams Home made the process seamless. Very transparent and professional.',
    property: '2BHK in Greater Noida',
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real stories from real clients who found their perfect property with us
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <p className="text-xs text-primary-600 mt-1">{testimonial.property}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
