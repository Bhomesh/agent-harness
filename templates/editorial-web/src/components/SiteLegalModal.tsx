import React, { useState, useEffect } from 'react';
import { legalData, LegalPage } from '../data/legalData';

export type LegalSlug = 'privacy' | 'terms' | 'cookies' | 'security';

interface SiteLegalModalProps {
  isOpen: boolean;
  initialSlug?: LegalSlug;
  onClose: () => void;
}

export const SiteLegalModal: React.FC<SiteLegalModalProps> = ({
  isOpen,
  initialSlug = 'privacy',
  onClose,
}) => {
  const [activeSlug, setActiveSlug] = useState<LegalSlug>(initialSlug);

  useEffect(() => {
    if (initialSlug) {
      setActiveSlug(initialSlug);
    }
  }, [initialSlug]);

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

  const currentDoc: LegalPage = legalData[activeSlug] || legalData.privacy;
  const docsList: { slug: LegalSlug; label: string }[] = [
    { slug: 'privacy', label: 'Privacy Policy' },
    { slug: 'terms', label: 'Terms and Conditions' },
    { slug: 'cookies', label: 'Cookie Policy' },
    { slug: 'security', label: 'Security & Trust' },
  ];

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#0d0c2b]/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      {/* Click outside backdrop to close */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-5xl bg-[#faf7ff] text-[#110f38] rounded-3xl shadow-2xl border-2 border-[#110f38]/20 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5 bg-gradient-to-r from-[#0d0c2b] via-[#161245] to-[#1f1754] text-[#ffffff] border-b border-[#ec4899]/30">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899] animate-pulse" />
            <span className="font-extrabold tracking-wide uppercase text-xs font-mono text-[#f472b6]">
              BuildShift Legal & Compliance
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#fffdf7]/10 hover:bg-[#fffdf7]/20 flex items-center justify-center text-[#fffdf7] transition-colors"
            aria-label="Close legal documents"
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

        {/* Inner Content Grid */}
        <div className="overflow-y-auto p-6 sm:p-10 flex-1">
          <div className="site-legal !p-0">
            {/* Sidebar nav */}
            <nav className="site-legal__nav" aria-label="Legal document selection">
              {docsList.map((doc) => (
                <button
                  key={doc.slug}
                  type="button"
                  onClick={() => setActiveSlug(doc.slug)}
                  className={activeSlug === doc.slug ? 'is-current' : ''}
                >
                  {doc.label}
                </button>
              ))}
            </nav>

            {/* Document Body */}
            <article className="site-legal__body">
              <p className="site-legal__updated">Last Updated: {currentDoc.updated}</p>
              <h2 id="legal-modal-title">{currentDoc.title}</h2>
              <p className="text-lg leading-relaxed font-semibold text-[#103b35]/85 mb-8">
                {currentDoc.lead}
              </p>

              {currentDoc.sections.map((sec, sIdx) => (
                <section key={sIdx} className="mb-8">
                  <h3>{sec.heading}</h3>

                  {sec.blocks.map((b, bIdx) => (
                    <div key={bIdx} className="space-y-4">
                      {b.h && <h4 className="text-base font-bold mt-4 mb-2 text-[#087e54]">{b.h}</h4>}
                      {b.p && <p>{b.p}</p>}

                      {b.ul && (
                        <ul>
                          {b.ul.map((item, iIdx) => (
                            <li key={iIdx}>{item}</li>
                          ))}
                        </ul>
                      )}

                      {b.table && (
                        <div className="site-legal__scroll">
                          <table>
                            <thead>
                              <tr>
                                {b.table.head.map((col, cIdx) => (
                                  <th key={cIdx}>{col}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {b.table.rows.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  {row.map((cell, cellIdx) => (
                                    <td key={cellIdx}>{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              ))}
            </article>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-6 sm:px-10 py-4 bg-[#faf7ff] border-t border-[#110f38]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#110f38]/70">
          <span>Need custom enterprise terms or a signed DPA? Reach our legal counsel at legal@buildswift.in</span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-[#110f38] hover:text-[#7c3aed] underline"
          >
            Back to Site
          </button>
        </div>
      </div>
    </div>
  );
};
