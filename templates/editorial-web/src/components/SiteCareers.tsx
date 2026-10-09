import React from 'react';
import { siteConfig } from '../data/siteData';
import { Reveal } from './Reveal';
import { CareersGraphic } from './CareersGraphic';
import { ArrowRightIcon } from './SiteIcons';

interface SiteCareersProps {
  onLearnMore: () => void;
}

export const SiteCareers: React.FC<SiteCareersProps> = ({ onLearnMore }) => {
  const { careers } = siteConfig;

  return (
    <section className="site-careers" id="careers">
      <div className="site-section site-careers__grid">
        <Reveal className="site-careers__copy" variant="left">
          <h2 className="site-h2">
            {careers.titleLines.map((line, idx) => (
              <span key={line}>
                {idx > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>
          <p>{careers.text}</p>

          <ul className="site-careers__chips">
            {careers.chips.map((chip) => (
              <li key={chip}>{chip}</li>
            ))}
          </ul>

          <button
            onClick={onLearnMore}
            className="site-btn site-btn--outline"
          >
            <span>{careers.cta.label}</span>
            <span className="site-arrow" aria-hidden="true">
              <ArrowRightIcon />
            </span>
          </button>
        </Reveal>

        <Reveal className="site-careers__panel" variant="right" delay={120}>
          <CareersGraphic />
        </Reveal>
      </div>
    </section>
  );
};
