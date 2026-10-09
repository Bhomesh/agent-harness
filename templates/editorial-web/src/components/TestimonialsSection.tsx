import React from 'react';
import { testimonialsData } from '../data/testimonialsData';
import { Star, Quote, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export const TestimonialsSection: React.FC = () => {
  const trustPartners = [
    'AWS Advanced Partner',
    'Microsoft Solutions Partner',
    'Google Cloud Partner',
    'Kubernetes Certified Service Provider',
    'HashiCorp Ecosystem',
    'GitLab Select Partner'
  ];

  return (
    <section id="testimonials" className="py-24 relative bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            Verified Client Praise
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Trusted by CTOs & Technical Founders
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-light">
            See how engineering leaders across North America, Europe, Singapore, and India rely on Build Swift 
            for mission-critical systems and velocity.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonialsData.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-7 sm:p-8 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-6 backdrop-blur-sm group"
            >
              <div className="space-y-4">
                {/* Rating stars & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-zinc-700 group-hover:text-cyan-500/50 transition-colors" />
                </div>

                {/* Quote Text */}
                <p className="text-sm text-zinc-300 leading-relaxed italic font-light">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {item.author}
                  </h4>
                  <p className="text-xs text-cyan-400">
                    {item.role} • <span className="text-zinc-400">{item.company}</span>
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-500">
                  {item.location}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Partner Badges Bar */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <div className="text-center text-xs font-mono uppercase tracking-wider text-zinc-500 mb-6">
            Aligned with Global Infrastructure & Cloud Standards
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {trustPartners.map((partner, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/60 border border-white/5 text-xs font-medium text-zinc-400"
              >
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>{partner}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
