import React, { useState } from 'react';
import { servicesData } from '../data/servicesData';
import { Cloud, Cpu, Code2, ShieldCheck, Smartphone, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { BentoGrid } from './ui/BentoGrid';
import { BentoGridItem } from './ui/BentoGridItem';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Capabilities' },
    { id: 'Infrastructure', label: 'Cloud & DevOps' },
    { id: 'Artificial Intelligence', label: 'Applied AI & RAG' },
    { id: 'Engineering', label: 'Custom Software' },
    { id: 'Security & Compliance', label: 'Cybersecurity' },
    { id: 'Mobile Engineering', label: 'Mobile Apps' },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cloud':
        return <Cloud className="w-5 h-5 text-cyan-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'Code2':
        return <Code2 className="w-5 h-5 text-blue-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-pink-400" />;
      case 'RefreshCw':
        return <RefreshCw className="w-5 h-5 text-amber-400" />;
      default:
        return <Code2 className="w-5 h-5 text-cyan-400" />;
    }
  };

  const filteredServices = activeCategory === 'all'
    ? servicesData
    : servicesData.filter(s => s.category === activeCategory);

  return (
    <section id="services" className="py-24 relative bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            Consulting & Engineering Domains
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Comprehensive IT Advisory & Software Craftsmanship
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-light">
            From greenfield architecture design to high-throughput cloud migration and autonomous AI swarms,
            our Jaipur engineering pods deliver mission-critical excellence.
          </p>

          {/* Minimalist Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-zinc-800 text-white border border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                    : 'bg-zinc-950/80 text-zinc-400 hover:text-white border border-white/5 hover:border-white/15'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Aceternity Bento Grid Layout */}
        <BentoGrid className="md:auto-rows-auto">
          {filteredServices.map((service: ServiceItem) => {
            const isExpanded = expandedService === service.id;

            return (
              <BentoGridItem
                key={service.id}
                className="h-full flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Icon & Category Tag */}
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 group-hover/bento:border-cyan-500/30 transition">
                      {getIcon(service.icon)}
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-900 text-cyan-300 border border-white/10">
                      {service.stats}
                    </span>
                  </div>

                  {/* Title & Short description */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover/bento:text-cyan-300 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed font-light">
                      {service.shortDesc}
                    </p>
                  </div>

                  {/* Deliverables */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
                      Key Deliverables
                    </span>
                    <AnimatePresence>
                      {service.deliverables.slice(0, isExpanded ? 4 : 3).map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-start gap-2 text-xs text-zinc-300"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {service.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-5 mt-5 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => setExpandedService(isExpanded ? null : service.id)}
                    className="text-xs text-zinc-400 hover:text-cyan-400 font-medium transition"
                  >
                    {isExpanded ? 'Show Less' : 'View Full Scope'}
                  </button>

                  <button
                    onClick={() => onSelectService(service.title)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 group-hover/bento:translate-x-1 transition-all"
                  >
                    <span>Request Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </BentoGridItem>
            );
          })}
        </BentoGrid>

      </div>
    </section>
  );
};

export default ServicesSection;
