import React from 'react';
import { siteConfig, ServiceItem } from '../data/siteData';
import { Reveal } from './Reveal';
import { ServiceIcon, ArrowRightIcon } from './SiteIcons';

interface SiteServicesProps {
  onSelectService: (service: ServiceItem) => void;
  onSeeAllServices: () => void;
}

export const SiteServices: React.FC<SiteServicesProps> = ({
  onSelectService,
  onSeeAllServices,
}) => {
  return (
    <section className="site-services site-section" id="services">
      <Reveal as="h2" className="site-h2" variant="up">
        Uncovering Unseen Opportunities
        <br />
        <span className="site-green-text">For Every Engineering Need</span>
      </Reveal>

      <div className="site-services__grid">
        {siteConfig.services.map((item, idx) => (
          <Reveal key={item.id} variant="scale" delay={idx * 70}>
            <div
              className="site-card cursor-pointer group"
              onClick={() => onSelectService(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSelectService(item);
              }}
            >
              <span className="site-card__icon">
                <ServiceIcon name={item.icon} />
              </span>
              <h3>
                {item.title.split('\n').map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </h3>
              <span className="site-card__read flex items-center justify-center gap-1 group-hover:text-pink-300">
                <span>View Details & Scope</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Reveal>
        ))}

        {/* 7th card: See All */}
        <Reveal variant="scale" delay={siteConfig.services.length * 70}>
          <div className="site-card site-card--see-all">
            <p>{siteConfig.seeAll.text}</p>
            <button
              onClick={onSeeAllServices}
              className="site-btn"
            >
              <span className="site-arrow" aria-hidden="true">
                <ArrowRightIcon />
              </span>
              <span>{siteConfig.seeAll.cta.label}</span>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
