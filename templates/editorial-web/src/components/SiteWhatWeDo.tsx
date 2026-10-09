import React from 'react';
import { siteConfig, WwdItem } from '../data/siteData';
import { Reveal } from './Reveal';

interface SiteWhatWeDoProps {
  onRowClick?: (item: WwdItem) => void;
}

export const SiteWhatWeDo: React.FC<SiteWhatWeDoProps> = ({ onRowClick }) => {
  const { whatWeDo } = siteConfig;

  return (
    <section className="site-wwd" id="what-we-do">
      <div className="site-section">
        <div className="site-wwd__head">
          <Reveal>
            <p className="site-eyebrow">{whatWeDo.eyebrow}</p>
            <h2>{whatWeDo.title}</h2>
          </Reveal>
          <Reveal as="p" className="site-wwd__note" delay={120}>
            {whatWeDo.note}
          </Reveal>
        </div>

        {/* Numbered Rows */}
        <div className="site-wwd__list">
          {whatWeDo.items.map((item, idx) => (
            <Reveal
              key={item.num}
              as="article"
              className="site-wwd__row group"
              delay={idx * 60}
              onClick={() => onRowClick && onRowClick(item)}
            >
              <span className="site-wwd__num">{item.num}</span>
              <h3 className="group-hover:text-pink-300 transition-colors">{item.title}</h3>
              <p>{item.text}</p>
              <span className="site-wwd__arrow" aria-hidden="true">
                ↗
              </span>
            </Reveal>
          ))}
        </div>

        {/* Stats Row */}
        <div className="site-wwd__stats">
          {whatWeDo.stats.map((stat, idx) => (
            <Reveal key={stat.label} className="site-stat" delay={idx * 80}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Global Partner & Enterprise Client Marquee */}
      <Reveal className="site-wwd__partners site-marquee" variant="fade">
        <div className="site-marquee__track site-marquee__track--left site-wwd__partner-track">
          {Array.from({ length: 4 }, (_, setIdx) => (
            <div
              key={setIdx}
              className="site-marquee__set"
              aria-hidden={setIdx > 0 ? true : undefined}
            >
              {whatWeDo.partners.map((partner, pIdx) => (
                <span key={`${partner}-${pIdx}`} className="site-partner">
                  {partner}
                </span>
              ))}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
};
