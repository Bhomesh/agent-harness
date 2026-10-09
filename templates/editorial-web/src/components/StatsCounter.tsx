import React from 'react';
import { Award, Globe2, TrendingDown, Users2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const StatsCounter: React.FC = () => {
  const stats = [
    {
      label: 'Production Uptime SLA',
      value: '99.99%',
      description: 'Zero-downtime fault-tolerant architectures',
      icon: Award,
      color: 'text-cyan-400'
    },
    {
      label: 'Enterprise Projects',
      value: '150+',
      description: 'Production-grade enterprise rollouts',
      icon: Users2,
      color: 'text-blue-400'
    },
    {
      label: 'Cloud Cost Reduction',
      value: '45%',
      description: 'Average FinOps infrastructure savings',
      icon: TrendingDown,
      color: 'text-emerald-400'
    },
    {
      label: 'Countries Served',
      value: '15+',
      description: 'US, UK, EU, UAE, Singapore & India',
      icon: Globe2,
      color: 'text-amber-400'
    }
  ];

  return (
    <div className="relative py-12 bg-zinc-950 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-5 sm:p-6 rounded-2xl bg-zinc-900/40 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-400">
                    {stat.label}
                  </span>
                  <div className="p-2 rounded-xl bg-zinc-900/80 border border-white/5 group-hover:border-cyan-500/20 transition">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div>
                  <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${stat.color} font-mono mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-zinc-400 leading-relaxed font-light">
                    {stat.description}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsCounter;
