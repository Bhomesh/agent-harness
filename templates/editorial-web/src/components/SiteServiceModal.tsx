import React, { useEffect } from 'react';
import { ServiceItem, siteConfig } from '../data/siteData';
import { ServiceIcon, ArrowRightIcon } from './SiteIcons';

interface SiteServiceModalProps {
  isOpen?: boolean;
  service: ServiceItem | null;
  onClose: () => void;
  onRequestConsultation: (serviceName: string) => void;
  onOpenEstimator: () => void;
  onSelectService: (service: ServiceItem) => void;
}

export const SiteServiceModal: React.FC<SiteServiceModalProps> = ({
  isOpen = true,
  service,
  onClose,
  onRequestConsultation,
  onOpenEstimator,
  onSelectService,
}) => {
  useEffect(() => {
    if (isOpen && service) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen, service]);

  useEffect(() => {
    if (!isOpen || !service) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, service, onClose]);

  if (!isOpen || !service) return null;

  const allServices = siteConfig.services;
  const currentIndex = allServices.findIndex((s) => s.id === service.id);
  const prevService = allServices[(currentIndex - 1 + allServices.length) % allServices.length];
  const nextService = allServices[(currentIndex + 1) % allServices.length];

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#0d0c2b]/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
    >
      {/* Click outside backdrop */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-4xl bg-[#faf7ff] text-[#110f38] rounded-3xl shadow-2xl border-2 border-[#110f38]/20 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5 bg-gradient-to-r from-[#0d0c2b] via-[#161245] to-[#1f1754] text-[#ffffff] border-b border-[#ec4899]/30">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
              <ServiceIcon name={service.icon} />
            </span>
            <span className="font-extrabold tracking-wide uppercase text-xs font-mono text-[#f472b6]">
              Engineering Practice • Jaipur Innovation Pod
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#ffffff]/10 hover:bg-[#ffffff]/20 flex items-center justify-center text-[#ffffff] transition-colors"
            aria-label="Close service details"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 flex-1">
          <div>
            <h2
              id="service-modal-title"
              className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#110f38] leading-snug whitespace-pre-line"
            >
              {service.title}
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#110f38]/85">
              {service.description}
            </p>
          </div>

          {/* Key Value Drivers / Benefits */}
          <div className="p-6 rounded-2xl bg-[#110f38]/5 border border-[#110f38]/15">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#7c3aed] mb-4">
              Core Architectural Guarantees & Deliverables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {service.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-[#ffffff] border border-[#110f38]/10 shadow-sm"
                >
                  <span className="w-5 h-5 rounded-full bg-[#ec4899]/15 text-[#ec4899] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-[#110f38] leading-snug">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Stack & Tooling */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#7c3aed] mb-3">
              Technologies & Production Tooling
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3.5 py-1.5 rounded-full bg-[#110f38] text-[#ffffff] text-xs font-bold tracking-wide shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Engagement Models */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-[#110f38]/15 bg-[#ffffff]">
              <div className="text-xs font-mono uppercase text-[#7c3aed] font-bold mb-1">
                Engagement Model
              </div>
              <div className="text-sm font-bold text-[#110f38]">
                Dedicated Squad or Fractional Pod
              </div>
              <p className="text-xs text-[#110f38]/70 mt-1">
                Direct integration with your daily standups, Jira/Linear, and Slack channels.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[#110f38]/15 bg-[#ffffff]">
              <div className="text-xs font-mono uppercase text-[#7c3aed] font-bold mb-1">
                Timezone Alignment
              </div>
              <div className="text-sm font-bold text-[#110f38]">
                4-6 Hours Global Overlap
              </div>
              <p className="text-xs text-[#110f38]/70 mt-1">
                Synchronous overlap with US (EST/PST), UK (GMT), and European teams daily.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => {
                onClose();
                onRequestConsultation(service.title.replace('\n', ' '));
              }}
              className="site-btn w-full sm:w-auto"
            >
              <span>Request Architectural Consultation</span>
              <span className="site-arrow" aria-hidden="true">
                <ArrowRightIcon />
              </span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenEstimator();
              }}
              className="site-btn site-btn--outline w-full sm:w-auto"
            >
              <span>Calculate Project Cost</span>
            </button>
          </div>
        </div>

        {/* Bottom switcher for services */}
        <div className="px-6 sm:px-10 py-4 bg-[#ffffff] border-t border-[#110f38]/10 flex items-center justify-between text-xs text-[#110f38]/80 font-bold">
          <button
            type="button"
            onClick={() => onSelectService(prevService)}
            className="flex items-center gap-2 hover:text-[#7c3aed] transition-colors"
          >
            <span>← Previous:</span>
            <span className="hidden sm:inline font-normal truncate max-w-[200px]">
              {prevService.title.replace('\n', ' ')}
            </span>
          </button>

          <span className="font-mono text-zinc-400">
            {currentIndex + 1} / {allServices.length}
          </span>

          <button
            type="button"
            onClick={() => onSelectService(nextService)}
            className="flex items-center gap-2 hover:text-[#7c3aed] transition-colors"
          >
            <span className="hidden sm:inline font-normal truncate max-w-[200px]">
              {nextService.title.replace('\n', ' ')}
            </span>
            <span>Next: →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
