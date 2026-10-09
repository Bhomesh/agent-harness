import React, { useState } from 'react';
import { caseStudiesData } from '../data/caseStudiesData';
import { Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { CaseStudy } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export const CaseStudiesSection: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<CaseStudy>(caseStudiesData[0]);

  return (
    <section id="case-studies" className="py-24 relative bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-emerald-400 text-xs font-mono uppercase tracking-wider">
            Quantified Enterprise Impact
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Case Studies & Proven Deliverables
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-light">
            Real architectural transformations delivered by our engineering pods for financial institutions,
            telemedicine providers, logistics networks, and global SaaS companies.
          </p>
        </div>

        {/* Interactive Case Study Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Selector List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            {caseStudiesData.map((cs) => {
              const isSelected = selectedCase.id === cs.id;
              return (
                <button
                  key={cs.id}
                  onClick={() => setSelectedCase(cs)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-zinc-900 border-cyan-400/60 shadow-xl shadow-cyan-950/20 translate-x-1'
                      : 'bg-zinc-950/60 border-white/5 hover:bg-zinc-900/50 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                    <span className="font-mono text-cyan-400">{cs.industry}</span>
                    <span className="flex items-center gap-1 text-zinc-500 font-mono">
                      <Clock className="w-3 h-3" /> {cs.duration}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    {cs.client}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{cs.location}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Deep-Dive View (8 cols) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCase.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-8 p-7 sm:p-9 rounded-2xl bg-zinc-950/90 border border-white/10 space-y-7 shadow-2xl backdrop-blur-sm"
            >
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
                <div>
                  <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 block mb-1">
                    Client Case Study • {selectedCase.industry}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {selectedCase.client}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-white/10 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> {selectedCase.location}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-zinc-900 text-cyan-300 border border-white/10 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {selectedCase.duration}
                  </span>
                </div>
              </div>

              {/* Metrics Ribbon */}
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-zinc-400 block mb-3">
                  Key Quantified Outcomes:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedCase.metrics.map((m, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 text-center">
                      <div className="text-2xl font-extrabold text-cyan-400 font-mono">
                        {m.value}
                      </div>
                      <div className="text-xs text-zinc-400 mt-1 font-light">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* The Challenge & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/40 border border-white/5 space-y-2">
                  <span className="text-xs font-bold font-mono text-red-400 flex items-center gap-1.5 uppercase">
                    <span>Critical Challenge</span>
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                    {selectedCase.challenge}
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/40 border border-cyan-500/20 space-y-2">
                  <span className="text-xs font-bold font-mono text-emerald-400 flex items-center gap-1.5 uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Build Swift Architectural Solution</span>
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                    {selectedCase.solution}
                  </p>
                </div>
              </div>

              {/* Technologies Deployed */}
              <div className="pt-2 border-t border-white/10">
                <span className="text-xs uppercase font-mono tracking-wider text-zinc-500 block mb-2">
                  Technologies Deployed:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-3 py-1 rounded-md bg-zinc-900 text-zinc-200 border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
};

export default CaseStudiesSection;
