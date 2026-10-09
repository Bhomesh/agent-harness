import React, { useState, useEffect } from 'react';
import { siteConfig } from '../data/siteData';

interface SiteNavProps {
  floating?: boolean;
  onOpenConsultation?: (service?: string) => void;
  onOpenEstimator?: () => void;
  onNavigateHome?: () => void;
  onNavigateSection?: (href: string) => void;
  onOpenContact?: () => void;
}

export const SiteNav: React.FC<SiteNavProps> = ({
  floating = true,
  onOpenConsultation,
  onOpenEstimator,
  onNavigateHome,
  onNavigateSection,
  onOpenContact,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    if (href === '#estimator') {
      if (onOpenEstimator) {
        onOpenEstimator();
        return;
      }
    }
    if (href === '#contact') {
      if (onOpenContact) {
        onOpenContact();
        return;
      }
      if (onOpenConsultation) {
        onOpenConsultation();
        return;
      }
    }
    if (href.startsWith('#')) {
      if (onNavigateSection) {
        onNavigateSection(href);
      } else {
        if (onNavigateHome) onNavigateHome();
        setTimeout(() => {
          const el = document.querySelector(href);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 60);
      }
    }
  };

  const menuLinks = [
    { label: 'About Us', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Problems We Solve', href: '#problems' },
    { label: 'What We Do', href: '#what-we-do' },
    { label: 'Industries', href: '#industries' },
    { label: 'Cost Estimator', href: '#estimator' },
    { label: 'Careers', href: '#careers' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <div className={`site-nav-wrap ${floating ? '' : 'site-nav-wrap--static'}`}>
        <header className="site-nav">
          <a
            href="#top"
            onClick={(e) => {
              if (onNavigateHome) {
                e.preventDefault();
                onNavigateHome();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="site-nav__logo flex items-center gap-3 cursor-pointer"
            aria-label={`${siteConfig.name} Home`}
          >
            <img src={siteConfig.logo} alt={siteConfig.name} />
          </a>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (onOpenConsultation) onOpenConsultation();
                else {
                  const el = document.querySelector('#contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-400 hover:to-pink-400 text-white text-xs font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-full transition-all duration-200 transform hover:-translate-y-0.5 shadow-md shadow-purple-500/25"
            >
              <span>Get in Touch</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            </button>

            <button
              className="site-nav__toggle"
              type="button"
              aria-label="Open menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(true)}
            >
              <span />
            </button>
          </div>
        </header>
      </div>

      {/* Fullscreen Overlay Menu */}
      <div
        className={`site-menu ${isOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <button
          className="site-menu__close"
          type="button"
          aria-label="Close menu"
          onClick={() => setIsOpen(false)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <nav className="site-menu__links">
          {menuLinks.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleLinkClick(item.href)}
              className="text-left"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-12 pt-8 border-t border-white/10">
          <p className="site-menu__foot !m-0">{siteConfig.tagline}</p>
          <div className="flex items-center gap-6 text-sm text-white/70">
            <span>{siteConfig.contact.phone}</span>
            <span>•</span>
            <span>{siteConfig.contact.email}</span>
          </div>
        </div>
      </div>
    </>
  );
};
