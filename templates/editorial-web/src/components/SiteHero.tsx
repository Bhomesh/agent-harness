import React from 'react';
import { siteConfig } from '../data/siteData';
import { ArrowRightIcon } from './SiteIcons';

interface SiteHeroProps {
  onDiscoverServices: () => void;
}

export const SiteHero: React.FC<SiteHeroProps> = ({ onDiscoverServices }) => {
  return (
    <>
      <header className="site-hero" id="top">
        <img
          className="site-hero__img"
          src="/hero-bg.png"
          alt="Build Swift Technologies Engineering Hub"
          aria-hidden="true"
        />
        <div className="site-hero__scrim" aria-hidden="true" />

        <div className="site-hero__card">
          <p className="site-hero__eyebrow">{siteConfig.hero.eyebrow}</p>
          <h1>{siteConfig.hero.title}</h1>
          <p className="site-hero__text">{siteConfig.hero.text}</p>
          <a
            href={siteConfig.hero.cta.href}
            onClick={(e) => {
              e.preventDefault();
              onDiscoverServices();
            }}
            className="site-btn"
          >
            <span className="site-arrow" aria-hidden="true">
              <ArrowRightIcon />
            </span>
            <span>{siteConfig.hero.cta.label}</span>
          </a>
        </div>
      </header>
      <div className="site-wave" aria-hidden="true" />
    </>
  );
};
