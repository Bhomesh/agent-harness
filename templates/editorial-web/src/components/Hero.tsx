import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calculator, CheckCircle2, Shield, Sparkles, Building2, Terminal } from 'lucide-react';
import { Spotlight } from './ui/Spotlight';
import { BackgroundGrid } from './ui/BackgroundGrid';
import { Button as MovingBorderButton } from './ui/MovingBorder';
import { HoverBorderGradient } from './ui/HoverBorderGradient';

interface HeroProps {
  onOpenConsultation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenConsultation }) => {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-black">
      {/* Aceternity Spotlight Lighting */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="rgba(6, 182, 212, 0.45)"
      />
      <Spotlight
        className="top-20 right-0 md:right-40"
        fill="rgba(255, 255, 255, 0.2)"
      />

      {/* Aceternity Dot Background with Radial Gradient Mask */}
      <BackgroundGrid className="py-8" pattern="dots">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Minimalist Pill Badge with Aceternity Hover Border */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center"
            >
              <HoverBorderGradient
                containerClassName="rounded-full max-w-full"
                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-cyan-300 backdrop-blur-md"
              >
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Jaipur, Rajasthan Registered IT Consultancy & Engineering Firm</span>
                <span className="sm:hidden">Jaipur, Rajasthan Registered IT Firm</span>
                <span className="text-zinc-600 hidden sm:inline">|</span>
                <span className="text-zinc-400 hidden sm:inline">Global Delivery Pods</span>
              </HoverBorderGradient>
            </motion.div>

            {/* Minimalist Clean Typography Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]"
            >
              Engineering Next-Gen{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 via-cyan-200 to-cyan-500">
                Cloud, AI & Enterprise Software
              </span>{' '}
              at Startup Speed
            </motion.h1>

            {/* Minimalist Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Build Swift is Jaipur’s premier global IT consultancy, transforming ideas into scalable 
              digital powerhouses. From our state-of-the-art Innovation Lab in Jaipur, Rajasthan, we architect 
              high-throughput microservices, sovereign AI agent systems, and automated multi-cloud infrastructures.
            </motion.p>

            {/* Minimalist Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-zinc-400 pt-1"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Client IP Ownership</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>ISO 27001 & SOC 2 Aligned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>World Trade Park Innovation Lab</span>
              </div>
            </motion.div>

            {/* Action CTAs with Aceternity Moving Border & Interactive Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="#services"
                className="w-full sm:w-auto"
              >
                <MovingBorderButton
                  borderRadius="0.875rem"
                  containerClassName="w-full sm:w-auto"
                  className="px-6 py-3.5 font-semibold text-white bg-zinc-950/90 hover:bg-zinc-900 border border-white/10 flex items-center gap-2 group transition"
                >
                  <span>Explore Capabilities</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </MovingBorderButton>
              </a>

              <a
                href="#cost-estimator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/90 text-zinc-200 hover:text-white font-medium text-sm border border-white/10 hover:border-cyan-500/40 transition-all backdrop-blur-sm"
              >
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span>Instant Project Estimate</span>
              </a>

              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 font-medium text-sm border border-cyan-500/30 hover:border-cyan-400 transition-all backdrop-blur-sm"
              >
                <span>Book Free Consultation</span>
              </button>
            </motion.div>

            {/* Minimalist Terminal Shell Simulation */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="pt-8 max-w-2xl mx-auto"
            >
              <div className="rounded-2xl bg-zinc-950/90 border border-white/10 shadow-2xl p-4 sm:p-5 text-left font-mono text-xs sm:text-sm text-zinc-300 backdrop-blur-xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-zinc-500 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                    <span className="ml-2 text-zinc-400">buildswift-consulting-mesh ~ jaipur-node</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span className="text-[11px]">v2026.1-prod</span>
                  </div>
                </div>
                <div className="pt-3 space-y-1.5 leading-relaxed overflow-x-auto">
                  <p className="text-zinc-400">
                    <span className="text-emerald-400">$</span> buildswift init --location="Jaipur, Rajasthan" --tier="Enterprise"
                  </p>
                  <p className="text-cyan-300">
                    ✔ Registered Entity: BuildSwift Technologies Pvt. Ltd. [CIN: U72900RJ2024PTC089124]
                  </p>
                  <p className="text-zinc-300">
                    ✔ Deploying dedicated engineering pod (Architect + DevOps + AI Engine + SRE)
                  </p>
                  <p className="text-amber-300">
                    ✔ Architecture SLA: 99.999% • Multi-Cloud Kubernetes & Private RAG Pipelines
                  </p>
                  <p className="text-emerald-400 font-semibold">
                    🚀 Ready for sprint 0 kickoff in &lt; 5 business days.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </BackgroundGrid>
    </div>
  );
};

export default Hero;
