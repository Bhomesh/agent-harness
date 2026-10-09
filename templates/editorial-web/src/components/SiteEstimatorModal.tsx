import React, { useEffect } from 'react';
import { ProjectCostEstimator } from './ProjectCostEstimator';

interface SiteEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuoteRequested: (quoteDetails: string) => void;
}

export const SiteEstimatorModal: React.FC<SiteEstimatorModalProps> = ({
  isOpen,
  onClose,
  onQuoteRequested,
}) => {
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
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-2 sm:p-6 overflow-y-auto bg-[#0d0c2b]/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="estimator-modal-title"
    >
      {/* Click outside backdrop */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-6xl bg-[#09090b] text-zinc-100 rounded-3xl shadow-2xl border border-white/10 overflow-hidden z-10 flex flex-col max-h-[95vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5 bg-zinc-950 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 id="estimator-modal-title" className="font-bold text-sm tracking-wide uppercase font-mono text-cyan-400">
              Interactive Project Cost & Timeline Estimator
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close cost estimator"
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

        {/* Estimator Content */}
        <div className="overflow-y-auto p-4 sm:p-8 flex-1">
          <ProjectCostEstimator
            onQuoteRequested={(quote) => {
              onClose();
              onQuoteRequested(quote);
            }}
          />
        </div>
      </div>
    </div>
  );
};
