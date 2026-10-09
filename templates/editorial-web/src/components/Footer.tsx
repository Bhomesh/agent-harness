import React from 'react';
import { jaipurHubData } from '../data/jaipurHubData';
import { MapPin, Phone, Mail, ShieldCheck, Heart, ArrowUp, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-white/5 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Jaipur Registration info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/15 flex items-center justify-center font-mono font-bold text-white text-base shadow-lg">
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Build<span className="text-cyan-400">Swift</span>
              </span>
            </div>

            <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm font-light">
              Build Swift is an enterprise IT consultancy and software engineering powerhouse registered in Jaipur, Rajasthan. 
              We design and ship high-throughput distributed systems, autonomous AI agents, and resilient cloud architectures.
            </p>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/10 text-[11px] font-mono space-y-1 text-zinc-400">
              <div className="text-cyan-400 font-semibold">{jaipurHubData.companyName}</div>
              <div>CIN: <span className="text-zinc-300">{jaipurHubData.corporateRegistration.cin}</span></div>
              <div>GSTIN: <span className="text-zinc-300">{jaipurHubData.corporateRegistration.gstin}</span> (Jaipur, Rajasthan)</div>
              <div>DPIIT Startup India ID: <span className="text-zinc-300">{jaipurHubData.corporateRegistration.dpiitRecognition}</span></div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Services
            </h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#services" className="hover:text-cyan-400 transition">Cloud & DevOps (K8s)</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition">Applied AI & RAG Agents</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition">Custom Microservices</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition">Zero Trust Cybersecurity</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition">Cross-Platform Mobile</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition">Legacy Modernization</a></li>
            </ul>
          </div>

          {/* Solutions & Tools */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Solutions & Hub
            </h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#cost-estimator" className="hover:text-cyan-400 transition">Project Cost Estimator</a></li>
              <li><a href="#tech-stack" className="hover:text-cyan-400 transition">Technology Matrix</a></li>
              <li><a href="#case-studies" className="hover:text-cyan-400 transition">Enterprise Case Studies</a></li>
              <li><a href="#jaipur-hub" className="hover:text-cyan-400 transition">Jaipur WTP Campus</a></li>
              <li><a href="#faqs" className="hover:text-cyan-400 transition">Consulting FAQs</a></li>
              <li><a href="#consultation" className="hover:text-cyan-400 transition">Book IT Audit</a></li>
            </ul>
          </div>

          {/* Jaipur Head Office Contact */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Jaipur Headquarters
            </h5>
            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Suite 804, Tower B, World Trade Park, Malviya Nagar, Jaipur, Rajasthan 302017</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`tel:${jaipurHubData.contact.phoneIndia}`} className="hover:text-cyan-400 font-mono">
                  {jaipurHubData.contact.phoneIndia}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${jaipurHubData.contact.emailGeneral}`} className="hover:text-cyan-400 font-mono">
                  {jaipurHubData.contact.emailGeneral}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <span>© {new Date().getFullYear()} BuildSwift Technologies Private Limited. All Rights Reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> ISO 27001
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300">SOC 2 Type II</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300">AWS Certified Partner</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300">Microsoft Solutions Partner</span>
            <span className="text-zinc-600">•</span>
            <span className="flex items-center gap-1 text-zinc-400">
              Crafted in Jaipur, India <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition ml-2 border border-white/5"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
