import React from 'react';
import { jaipurHubData } from '../data/jaipurHubData';
import { MapPin, Phone, Mail, Building, ShieldCheck, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { DotBackground } from './ui/DotBackground';

interface JaipurHubShowcaseProps {
  onScheduleVisit: () => void;
}

export const JaipurHubShowcase: React.FC<JaipurHubShowcaseProps> = ({ onScheduleVisit }) => {
  return (
    <section id="jaipur-hub" className="relative border-t border-white/5">
      <DotBackground className="py-24">
        {/* Decorative gradient glow */}
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-amber-600/5 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-amber-300 text-xs font-mono uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            Headquarters & Registration Hub
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Jaipur, Rajasthan: The Silicon Desert
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-light">
            Proudly registered and rooted in the Pink City of Jaipur. We combine Rajasthan's 
            exceptional engineering density with world-class cloud infrastructure to serve global enterprises.
          </p>
        </div>

        {/* Main Grid: Corporate Details & Campus Features */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Official Legal Registration & Contact Card (6 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-amber-500/30 p-7 sm:p-9 space-y-6 flex flex-col justify-between backdrop-blur-sm transition-all"
          >
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 block">
                    Registered Corporate Entity
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-0.5">
                    {jaipurHubData.companyName}
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-amber-400">
                  <Building className="w-6 h-6" />
                </div>
              </div>

              {/* Registration Badges Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5">
                  <span className="text-zinc-500 block text-[10px] uppercase">Corporate CIN</span>
                  <span className="text-cyan-300 font-bold">{jaipurHubData.corporateRegistration.cin}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5">
                  <span className="text-zinc-500 block text-[10px] uppercase">GSTIN (Rajasthan)</span>
                  <span className="text-cyan-300 font-bold">{jaipurHubData.corporateRegistration.gstin}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5">
                  <span className="text-zinc-500 block text-[10px] uppercase">MSME Udyam Reg.</span>
                  <span className="text-zinc-300">{jaipurHubData.corporateRegistration.msmeRegistration}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5">
                  <span className="text-zinc-500 block text-[10px] uppercase">Startup India DPIIT</span>
                  <span className="text-zinc-300">{jaipurHubData.corporateRegistration.dpiitRecognition}</span>
                </div>
              </div>

              {/* Physical Campus Address */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                  Engineering Campus & Head Office
                </span>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/40 border border-white/5 text-xs sm:text-sm text-zinc-300">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <p className="font-semibold text-white">{jaipurHubData.headquarters.addressLine1}</p>
                    <p>{jaipurHubData.headquarters.addressLine2}</p>
                    <p className="text-zinc-400">{jaipurHubData.headquarters.techCampus}</p>
                    <p className="text-amber-300 font-mono mt-1">
                      {jaipurHubData.headquarters.city}, {jaipurHubData.headquarters.state} — {jaipurHubData.headquarters.pincode}, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Hotlines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <a
                  href={`tel:${jaipurHubData.contact.phoneIndia}`}
                  className="p-3 rounded-xl bg-zinc-900/40 border border-white/5 hover:border-cyan-500/40 transition flex items-center gap-3 text-zinc-300"
                >
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Jaipur Office Desk</span>
                    <span className="font-mono font-medium">{jaipurHubData.contact.phoneIndia}</span>
                  </div>
                </a>

                <a
                  href={`mailto:${jaipurHubData.contact.emailGeneral}`}
                  className="p-3 rounded-xl bg-zinc-900/40 border border-white/5 hover:border-cyan-500/40 transition flex items-center gap-3 text-zinc-300"
                >
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Direct Inquiries</span>
                    <span className="font-mono font-medium">{jaipurHubData.contact.emailGeneral}</span>
                  </div>
                </a>
              </div>

            </div>

            <div className="pt-4 border-t border-white/10">
              <button
                onClick={onScheduleVisit}
                className="w-full py-3.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-amber-500/40 text-amber-300 font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <Building className="w-4 h-4" />
                <span>Schedule an In-Person Visit to our WTP Campus</span>
              </button>
            </div>
          </motion.div>

          {/* Right: Regional Strategic Advantages (6 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-6 space-y-4 flex flex-col justify-between"
          >
            
            <div className="space-y-4">
              {jaipurHubData.regionalHighlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-white/20 transition-all space-y-2 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    <h4 className="text-base font-bold text-white">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 pl-6 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Certifications & Accreditations bar */}
            <div className="p-5 rounded-2xl bg-zinc-950/90 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Governance & Accreditations
                </span>
                <span className="text-[11px] font-mono text-cyan-400">100% Verified</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {jaipurHubData.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="text-[11px] font-medium px-2.5 py-1 rounded bg-zinc-900 text-zinc-300 border border-white/5 flex items-center gap-1.5"
                  >
                    <Award className="w-3 h-3 text-amber-400" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>

          </motion.div>

        </div>

      </div>
      </DotBackground>
    </section>
  );
};

export default JaipurHubShowcase;
