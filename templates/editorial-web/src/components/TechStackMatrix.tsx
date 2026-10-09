import React, { useState } from 'react';
import { techStackData } from '../data/techStackData';
import { Terminal, Database, Cpu, Layout, Lock } from 'lucide-react';
import { TechItem } from '../types';
import { motion } from 'framer-motion';
import { CardHoverEffect } from './ui/CardHoverEffect';

export const TechStackMatrix: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Technologies', icon: Terminal },
    { id: 'cloud', label: 'Cloud & DevOps', icon: Terminal },
    { id: 'backend', label: 'Backend & Data', icon: Database },
    { id: 'ai', label: 'Applied AI & RAG', icon: Cpu },
    { id: 'frontend', label: 'Frontend & Mobile', icon: Layout },
    { id: 'security', label: 'Security & Auth', icon: Lock },
  ];

  const filteredTech = filter === 'all'
    ? techStackData
    : techStackData.filter(t => t.category === filter);

  return (
    <section id="tech-stack" className="py-24 relative bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            Technical Arsenal
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Battle-Tested Engineering Stack
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-light">
            We reject fragile boilerplate. Every tool in our ecosystem is chosen for strict enterprise uptime, 
            low latency, deterministic scalability, and developer ergonomics.
          </p>

          {/* Minimalist Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  onClick={() => setFilter(c.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    filter === c.id
                      ? 'bg-zinc-800 text-white border border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                      : 'bg-zinc-950/80 text-zinc-400 hover:text-white border border-white/5 hover:border-white/15'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Aceternity Card Hover Effect Grid */}
        <CardHoverEffect
          className="gap-4 py-0"
          items={filteredTech.map((item: TechItem) => ({
            title: item.name,
            description: item.description,
            badge: `${item.proficiency}% Proficiency`,
            meta: (
              <div>
                <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden mt-1">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.proficiency}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full"
                  />
                </div>
                <div className="mt-4 pt-3 border-t border-white/5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1">
                    Enterprise Proven In:
                  </span>
                  <p className="text-xs text-zinc-400 font-mono italic">
                    "{item.enterpriseUse}"
                  </p>
                </div>
              </div>
            ),
          }))}
        />

      </div>
    </section>
  );
};

export default TechStackMatrix;
