import React from 'react';
import { siteConfig } from '../data/siteData';
import { Reveal } from './Reveal';
import { ArrowRightIcon } from './SiteIcons';

interface SiteContactBannerProps {
  onContactClick: () => void;
}

export const SiteContactBanner: React.FC<SiteContactBannerProps> = ({ onContactClick }) => {
  const { contact } = siteConfig;

  return (
    <section className="site-contact" id="contact">
      {/* Wave transition from orange section to warm cream */}
      <svg
        className="site-contact__wave"
        viewBox="0 0 1260 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,160 L0,104 C120,142 250,152 400,130 C560,106 690,44 850,30 C1000,17 1140,52 1260,86 L1260,160 Z"
          fill="#fff3e2"
        />
      </svg>

      <div className="site-section">
        <Reveal as="h2" className="site-h2" variant="up">
          {contact.title}
        </Reveal>
        <Reveal as="p" className="site-contact__lead" delay={80}>
          {contact.text}
        </Reveal>
        <Reveal variant="scale" delay={140}>
          <button
            onClick={onContactClick}
            className="site-btn"
          >
            <span>{contact.cta.label}</span>
            <span className="site-arrow" aria-hidden="true">
              <ArrowRightIcon />
            </span>
          </button>
        </Reveal>
      </div>
    </section>
  );
};
