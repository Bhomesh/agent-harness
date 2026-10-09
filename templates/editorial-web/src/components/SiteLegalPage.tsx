import React, { useEffect } from 'react';
import { legalData, LegalPage } from '../data/legalData';
import { LegalSlug } from './SiteLegalModal';
import { SiteNav } from './SiteNav';
import { Reveal } from './Reveal';

interface SiteLegalPageProps {
  slug: LegalSlug;
  onSelectSlug: (slug: LegalSlug) => void;
  onNavigateHome: () => void;
  onOpenConsultation: () => void;
  onOpenEstimator: () => void;
  onNavigateSection: (href: string) => void;
  onOpenContact: () => void;
}

export const SiteLegalPage: React.FC<SiteLegalPageProps> = ({
  slug,
  onSelectSlug,
  onNavigateHome,
  onOpenConsultation,
  onOpenEstimator,
  onNavigateSection,
  onOpenContact,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const currentDoc: LegalPage = legalData[slug] || legalData.privacy;
  const docsList: { slug: LegalSlug; label: string }[] = [
    { slug: 'privacy', label: 'Privacy Policy' },
    { slug: 'terms', label: 'Terms and Conditions' },
    { slug: 'cookies', label: 'Cookie Policy' },
    { slug: 'security', label: 'Security & Trust' },
  ];

  return (
    <div className="site-page">
      {/* Subhero Header matching Forteiva */}
      <header className="site-subhero">
        <SiteNav
          floating={false}
          onOpenConsultation={onOpenConsultation}
          onOpenEstimator={onOpenEstimator}
          onNavigateHome={onNavigateHome}
          onNavigateSection={onNavigateSection}
          onOpenContact={onOpenContact}
        />
        <div className="site-section site-subhero__copy">
          <Reveal as="p" className="site-eyebrow">
            Legal & Compliance
          </Reveal>
          <Reveal as="h1" delay={80}>
            {currentDoc.title}
          </Reveal>
          <Reveal as="p" className="site-subhero__lead" delay={140}>
            {currentDoc.lead}
          </Reveal>
        </div>
      </header>

      {/* Main Legal Content Container */}
      <div className="site-legal site-section">
        {/* Sticky Left Navigation Sidebar */}
        <nav className="site-legal__nav" aria-label="Legal pages">
          {docsList.map((doc) => (
            <button
              key={doc.slug}
              type="button"
              onClick={() => onSelectSlug(doc.slug)}
              className={doc.slug === slug ? 'is-current' : ''}
              aria-current={doc.slug === slug ? 'page' : undefined}
            >
              {doc.label}
            </button>
          ))}
          <div className="pt-4 border-t border-[#110f38]/15 mt-4">
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs font-bold text-[#110f38]/70 hover:text-[#7c3aed]"
            >
              ← Back to Overview
            </button>
          </div>
        </nav>

        {/* Legal Document Body */}
        <article className="site-legal__body">
          <p className="site-legal__updated">Last updated: {currentDoc.updated}</p>

          {currentDoc.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>

              {section.blocks.map((block, bIdx) => (
                <React.Fragment key={bIdx}>
                  {block.h && <h3>{block.h}</h3>}
                  {block.p && <p>{block.p}</p>}
                  {block.ul && (
                    <ul>
                      {block.ul.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {block.table && (
                    <div className="site-legal__scroll">
                      <table>
                        <thead>
                          <tr>
                            {block.table.head.map((col, idx) => (
                              <th key={idx}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {block.table.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
};
