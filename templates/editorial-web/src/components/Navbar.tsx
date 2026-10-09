import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

interface NavbarProps {
  onOpenConsultation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenConsultation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Technologies', href: '#tech-stack' },
    { label: 'Cost Estimator', href: '#cost-estimator' },
    { label: 'Case Studies', href: '#case-studies' },
    { label: 'Jaipur Campus', href: '#jaipur-hub' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQs', href: '#faqs' },
  ];

  return (
    <>
      {/* Top Banner announcing Jaipur, Rajasthan Registration */}
      <div className="bg-zinc-950 border-b border-white/5 text-xs py-2 px-4 text-center text-zinc-400 flex items-center justify-center gap-2 sm:gap-3">
        <span className="inline-flex items-center gap-1.5 text-cyan-400 font-medium">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          Headquartered in Jaipur, Rajasthan, India
        </span>
        <span className="hidden md:inline text-zinc-600">•</span>
        <span className="hidden md:inline text-zinc-400 font-mono text-[11px]">
          CIN: U72900RJ2024PTC089124 • World Trade Park Campus
        </span>
        <span className="hidden md:inline text-zinc-600">•</span>
        <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> ISO 27001 & SOC 2 Aligned
        </span>
      </div>

      <nav
        className={`relative z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-zinc-950/85 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl'
            : 'bg-zinc-950/40 backdrop-blur-md border-b border-white/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/15 flex items-center justify-center shadow-lg group-hover:border-cyan-500/50 transition">
              <span className="font-mono font-bold text-sm text-cyan-300 tracking-tighter">BS</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  Build<span className="text-cyan-400">Swift</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Systems Active" />
              </div>
              <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-mono">
                IT Consultancy • Jaipur
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-cyan-400 after:absolute after:bottom-0 after:left-0 after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="tel:+911413589920"
              className="hidden xl:inline-flex text-xs font-mono text-zinc-300 hover:text-white px-3 py-2 rounded-lg border border-white/10 hover:border-white/20 transition"
            >
              +91 141 358-9920
            </a>
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <span>Book Free Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-zinc-950/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-zinc-200 hover:text-cyan-400 font-medium py-1.5 border-b border-white/5 text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="pt-2 flex flex-col gap-3">
              <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                World Trade Park, Jaipur, Rajasthan
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-black font-semibold text-xs shadow-lg"
              >
                <span>Book Free IT Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
