import React, { useEffect } from 'react';
import { siteConfig } from '../data/siteData';
import { ConsultationForm } from './ConsultationForm';
import { SiteNav } from './SiteNav';
import { Reveal } from './Reveal';

interface SiteContactPageProps {
  onBackToHome: () => void;
  initialService?: string;
  initialQuote?: string;
  onOpenConsultation?: () => void;
  onOpenEstimator?: () => void;
  onNavigateSection?: (href: string) => void;
}

export const SiteContactPage: React.FC<SiteContactPageProps> = ({
  onBackToHome,
  initialService,
  initialQuote,
  onOpenConsultation,
  onOpenEstimator,
  onNavigateSection,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { subhero, contact } = siteConfig;

  return (
    <div className="site-page">
      {/* Signature Forteiva Emerald Subhero Banner */}
      <header className="site-subhero">
        <SiteNav
          floating={false}
          onOpenConsultation={onOpenConsultation}
          onOpenEstimator={onOpenEstimator}
          onNavigateHome={onBackToHome}
          onNavigateSection={onNavigateSection}
          onOpenContact={() => {}}
        />
        <div className="site-section site-subhero__copy">
          <Reveal as="p" className="site-eyebrow">
            {subhero.eyebrow}
          </Reveal>
          <Reveal as="h1" delay={80}>
            {subhero.title}
          </Reveal>
          <Reveal as="p" className="site-subhero__lead" delay={140}>
            {subhero.lead}
          </Reveal>
        </div>
      </header>

      {/* Main Contact Section */}
      <section className="site-contactpage">
        <div className="site-section">
          {/* Navigation Breadcrumb / Return */}
          <div className="mb-8">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#110f38] hover:text-[#7c3aed] transition-colors"
            >
              <span>← Back to Overview</span>
            </button>
          </div>

          {/* 4-Column Contact Details Grid */}
          <dl className="site-contactpage__details">
            <div>
              <dt>General Inquiries</dt>
              <dd>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </dd>
              <p>Typically responds within 4 business hours with an architect assignment.</p>
            </div>

            <div>
              <dt>Direct Hotline</dt>
              <dd>
                <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}>{contact.phone}</a>
              </dd>
              <p>{contact.hours}</p>
            </div>

            <div>
              <dt>Corporate HQ</dt>
              <dd>{contact.address}</dd>
              <p>Physical campus visits and architectural workshops by prior scheduling.</p>
            </div>

            <div>
              <dt>Security & Privacy</dt>
              <dd>Mutual NDA Standard</dd>
              <p>Strict zero-leakage code confidentiality, ISO 27001 & SOC 2 aligned pods.</p>
            </div>
          </dl>

          {/* Embedded Consultation Form */}
          <div className="mt-14 pt-10 border-t border-[#110f38]/15">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#110f38] mb-2 tracking-tight">
                Request a Technical Architecture Proposal
              </h2>
              <p className="text-sm text-[#110f38]/70 max-w-xl">
                Fill out your platform requirements and our principal architects in Jaipur will review your scope under a mutual non-disclosure agreement.
              </p>
            </div>

            <ConsultationForm
              initialService={initialService}
              initialQuote={initialQuote}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
