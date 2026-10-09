import React from 'react';
import { siteConfig } from '../data/siteData';
import { Reveal } from './Reveal';
import { IndustriesGraphic } from './IndustriesGraphic';
import { IndustryIcon, ArrowRightIcon } from './SiteIcons';

interface SiteIndustriesProps {
  onTalkToExpert: () => void;
}

export const SiteIndustries: React.FC<SiteIndustriesProps> = ({ onTalkToExpert }) => {
  const { industries } = siteConfig;

  return (
    <section className="site-industries" id="industries">
      <div className="site-section site-industries__grid">
        <Reveal className="site-industries__panel" variant="left">
          <IndustriesGraphic />
        </Reveal>

        <Reveal className="site-industries__copy" variant="right" delay={120}>
          <h2 className="site-h2">{industries.title}</h2>
          <p>{industries.text}</p>

          <ul className="site-industries__list">
            {industries.items.map((item) => (
              <li key={item.label}>
                <span className="site-industries__icon">
                  <IndustryIcon name={item.icon} />
                </span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={onTalkToExpert}
            className="site-btn site-btn--outline"
          >
            <span>{industries.cta.label}</span>
            <span className="site-arrow" aria-hidden="true">
              <ArrowRightIcon />
            </span>
          </button>
        </Reveal>
      </div>
    </section>
  );
};
