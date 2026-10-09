import React, { useState } from 'react';
import { Calculator, Check, ArrowRight, ShieldCheck, Zap, Server, Cpu, IndianRupee, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { BackgroundGrid } from './ui/BackgroundGrid';

interface ProjectCostEstimatorProps {
  onQuoteRequested: (quoteDetails: string) => void;
}

export const ProjectCostEstimator: React.FC<ProjectCostEstimatorProps> = ({ onQuoteRequested }) => {
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  const [projectType, setProjectType] = useState<'cloud' | 'ai' | 'fullstack' | 'security' | 'mobile'>('cloud');
  const [complexity, setComplexity] = useState<'mvp' | 'growth' | 'enterprise'>('growth');
  const [cloudProvider, setCloudProvider] = useState<'aws' | 'gcp' | 'azure' | 'hybrid'>('aws');
  const [hasAI, setHasAI] = useState<boolean>(false);
  const [complianceTier, setComplianceTier] = useState<'standard' | 'soc2' | 'hipaa'>('standard');
  const [speed, setSpeed] = useState<'standard' | 'expedited'>('standard');

  // Base pricing calculations
  const calculatePricing = () => {
    let baseUsd = 12000;
    let weeks = 6;
    let team = '1 Cloud Architect + 2 Full-Stack Engineers + 1 QA';

    if (projectType === 'cloud') {
      baseUsd = 18000;
      weeks = 8;
      team = '1 Principal Cloud Architect + 2 DevOps/SREs + 1 Security Engineer';
    } else if (projectType === 'ai') {
      baseUsd = 22000;
      weeks = 8;
      team = '1 AI/RAG Specialist + 1 Senior Python Backend + 1 Frontend + 1 MLOps';
    } else if (projectType === 'fullstack') {
      baseUsd = 16000;
      weeks = 7;
      team = '1 Tech Lead + 2 Full-Stack Developers (React/Node) + 1 QA';
    } else if (projectType === 'security') {
      baseUsd = 14000;
      weeks = 4;
      team = '2 Senior Security Auditors + 1 DevSecOps Compliance Lead';
    } else if (projectType === 'mobile') {
      baseUsd = 15000;
      weeks = 7;
      team = '1 Mobile Lead (React Native/Flutter) + 1 Backend API + 1 UI/UX';
    }

    if (complexity === 'mvp') {
      baseUsd *= 0.75;
      weeks = Math.max(4, Math.round(weeks * 0.75));
    } else if (complexity === 'enterprise') {
      baseUsd *= 1.8;
      weeks = Math.round(weeks * 1.5);
      team += ' + 1 Dedicated Delivery Manager';
    }

    if (hasAI && projectType !== 'ai') {
      baseUsd += 6000;
      weeks += 2;
    }

    if (complianceTier === 'soc2') {
      baseUsd += 4500;
    } else if (complianceTier === 'hipaa') {
      baseUsd += 7500;
    }

    if (speed === 'expedited') {
      baseUsd *= 1.25;
      weeks = Math.max(3, Math.round(weeks * 0.7));
    }

    const minUsd = Math.round(baseUsd * 0.9);
    const maxUsd = Math.round(baseUsd * 1.2);

    const inrRate = 86;
    const minInrLakhs = ((minUsd * inrRate) / 100000).toFixed(1);
    const maxInrLakhs = ((maxUsd * inrRate) / 100000).toFixed(1);

    return {
      minUsd: minUsd.toLocaleString(),
      maxUsd: maxUsd.toLocaleString(),
      minInr: minInrLakhs,
      maxInr: maxInrLakhs,
      weeks,
      team,
    };
  };

  const results = calculatePricing();

  const handleBook = () => {
    const summary = `Project: ${projectType.toUpperCase()} | Scale: ${complexity.toUpperCase()} | Cloud: ${cloudProvider.toUpperCase()} | AI: ${hasAI ? 'Yes' : 'No'} | Compliance: ${complianceTier.toUpperCase()} | Speed: ${speed.toUpperCase()} | Est: ${currency === 'USD' ? `$${results.minUsd} - $${results.maxUsd}` : `₹${results.minInr}L - ₹${results.maxInr}L`} (${results.weeks} wks)`;
    onQuoteRequested(summary);
  };

  return (
    <section id="cost-estimator" className="relative border-t border-white/5">
      <BackgroundGrid pattern="grid" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" /> Interactive ROI & Budget Calculator
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Transparent Project Estimator
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-light">
            Configure your technical requirements to generate an instant timeline, pod sizing,
            and budget estimate backed by our Jaipur engineering hub delivery rates.
          </p>

          {/* Currency Switcher */}
          <div className="inline-flex items-center p-1 rounded-xl bg-zinc-900 border border-white/10 mt-2">
            <button
              onClick={() => setCurrency('USD')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                currency === 'USD' ? 'bg-cyan-500 text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" /> USD ($) Global
            </button>
            <button
              onClick={() => setCurrency('INR')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                currency === 'INR' ? 'bg-cyan-500 text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <IndianRupee className="w-3.5 h-3.5" /> INR (₹) India
            </button>
          </div>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-8 p-6 sm:p-8 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-sm"
          >
            
            {/* 1. Project Type */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                1. Engagement Architecture
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'cloud', label: 'Cloud & DevOps', icon: Server },
                  { id: 'ai', label: 'Applied AI & RAG', icon: Cpu },
                  { id: 'fullstack', label: 'Full-Stack Modernization', icon: Zap },
                  { id: 'security', label: 'Cybersecurity Audit', icon: ShieldCheck },
                  { id: 'mobile', label: 'Mobile App Suite', icon: Server },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = projectType === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setProjectType(item.id as any)}
                      className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between h-20 ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-lg shadow-cyan-500/10'
                          : 'border-white/5 bg-zinc-900/60 text-zinc-400 hover:border-white/20 hover:text-zinc-200'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-zinc-500'}`} />
                      <span className="text-xs font-medium leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Scale & Complexity */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                2. System Scale & Complexity
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'mvp', title: 'Lean MVP', desc: 'Fast proof-of-concept' },
                  { id: 'growth', title: 'Scale & Growth', desc: 'Production-ready scaling' },
                  { id: 'enterprise', title: 'Mission Critical', desc: 'High-availability 99.999%' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setComplexity(tier.id as any)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      complexity === tier.id
                        ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-md'
                        : 'border-white/5 bg-zinc-900/60 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{tier.title}</div>
                    <div className="text-[11px] text-zinc-400 mt-1">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Cloud Target & AI Capabilities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                  Cloud Infrastructure
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['aws', 'gcp', 'azure', 'hybrid'] as const).map((prov) => (
                    <button
                      key={prov}
                      onClick={() => setCloudProvider(prov)}
                      className={`py-2 px-3 rounded-lg text-xs font-mono uppercase font-semibold border transition ${
                        cloudProvider === prov
                          ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                          : 'border-white/5 bg-zinc-900/60 text-zinc-400 hover:border-white/10'
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                  Applied AI Integration
                </label>
                <button
                  onClick={() => setHasAI(!hasAI)}
                  className={`w-full py-2.5 px-3 rounded-lg border text-xs font-medium flex items-center justify-between transition ${
                    hasAI
                      ? 'border-indigo-400 bg-indigo-950/40 text-indigo-200'
                      : 'border-white/5 bg-zinc-900/60 text-zinc-400 hover:border-white/10'
                  }`}
                >
                  <span>Include Private LLM/RAG Pipeline</span>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    hasAI ? 'bg-indigo-500 border-indigo-400 text-white' : 'border-zinc-700'
                  }`}>
                    {hasAI && <Check className="w-3 h-3" />}
                  </div>
                </button>
              </div>
            </div>

            {/* 4. Compliance & Speed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                  Regulatory Security Tier
                </label>
                <select
                  value={complianceTier}
                  onChange={(e) => setComplianceTier(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="standard">Standard Enterprise Security (OWASP Top 10)</option>
                  <option value="soc2">SOC 2 Type II & ISO 27001 Readiness</option>
                  <option value="hipaa">HIPAA / ABDM / PCI-DSS Hardening</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                  Delivery Velocity
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSpeed('standard')}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition ${
                      speed === 'standard'
                        ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                        : 'border-white/5 bg-zinc-900/60 text-zinc-400 hover:border-white/10'
                    }`}
                  >
                    Standard Sprints
                  </button>
                  <button
                    onClick={() => setSpeed('expedited')}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition ${
                      speed === 'expedited'
                        ? 'border-amber-400 bg-amber-950/40 text-amber-300'
                        : 'border-white/5 bg-zinc-900/60 text-zinc-400 hover:border-white/10'
                    }`}
                  >
                    Expedited Fast-Track
                  </button>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Output Card (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 rounded-2xl bg-zinc-950/90 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl sticky top-28 space-y-6 backdrop-blur-xl"
          >
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Estimated Project Package
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono">
                Jaipur Hub Delivery
              </span>
            </div>

            {/* Price Range */}
            <div>
              <div className="text-xs text-zinc-400 mb-1">Estimated Investment Range:</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight flex items-baseline gap-2">
                {currency === 'USD' ? (
                  <>
                    <span className="text-cyan-400">{`$${results.minUsd}`}</span>
                    <span className="text-zinc-500 text-2xl font-light">–</span>
                    <span className="text-cyan-400">{`$${results.maxUsd}`}</span>
                  </>
                ) : (
                  <>
                    <span className="text-cyan-400">{`₹${results.minInr}`}</span>
                    <span className="text-zinc-500 text-2xl font-light">–</span>
                    <span className="text-cyan-400">{`₹${results.maxInr} Lakhs`}</span>
                  </>
                )}
              </div>
              <div className="text-xs text-zinc-400 mt-1">
                {currency === 'USD' ? 'Inclusive of global architecture advisory' : 'Excluding 18% GST (Input Tax Credit eligible)'}
              </div>
            </div>

            {/* Timeline & Velocity */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10">
              <div>
                <span className="text-xs text-zinc-500 uppercase font-mono block">Estimated Duration</span>
                <span className="text-xl font-bold text-white font-mono">{results.weeks} Weeks</span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 uppercase font-mono block">Sprint Cycle</span>
                <span className="text-xl font-bold text-amber-400 font-mono">Bi-Weekly</span>
              </div>
            </div>

            {/* Dedicated Pod Composition */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider block">
                Dedicated Engineering Pod:
              </span>
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/10 text-xs text-zinc-300 leading-relaxed font-mono">
                {results.team}
              </div>
            </div>

            {/* Guarantees */}
            <div className="space-y-1.5 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100% Full IP & Source Code Ownership</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>2-Week Risk-Free Trial Sprint</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>NDA executed within 24 hours</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleBook}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-sm shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <span>Lock In Estimate & Request RFP</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </motion.div>

        </div>

      </div>
      </BackgroundGrid>
    </section>
  );
};

export default ProjectCostEstimator;
