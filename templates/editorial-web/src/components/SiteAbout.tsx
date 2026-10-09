import React from 'react';
import { siteConfig } from '../data/siteData';
import { Reveal } from './Reveal';
import { AboutGraphic } from './AboutGraphic';
import { ArrowRightIcon } from './SiteIcons';

interface SiteAboutProps {
  onReadMore: () => void;
}

export const SiteAbout: React.FC<SiteAboutProps> = ({ onReadMore }) => {
  return (
    <section className="site-about site-section" id="about">
      <div className="site-about__grid">
        <Reveal className="site-about__copy" variant="left">
          <h2 className="site-h2">
            {siteConfig.about.titleLines.map((line, idx) => (
              <span key={line}>
                {line}
                {idx < siteConfig.about.titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>

          {siteConfig.about.paragraphs.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}

          <h3>{siteConfig.about.subhead}</h3>
          <p>{siteConfig.about.subcopy}</p>
        </Reveal>

        <Reveal className="site-about__panel" variant="right" delay={120}>
          <AboutGraphic />
        </Reveal>
      </div>

      <Reveal className="site-about__bottom" variant="up" delay={150}>
        <p>{siteConfig.about.closing}</p>
        <button
          onClick={onReadMore}
          className="site-btn site-btn--outline"
        >
          <span>Explore Services</span>
          <span className="site-arrow" aria-hidden="true">
            <ArrowRightIcon />
          </span>
        </button>
      </Reveal>
    </section>
  );
};
