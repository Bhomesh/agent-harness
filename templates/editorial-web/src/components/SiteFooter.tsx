import React from 'react';
import { siteConfig } from '../data/siteData';
import { SocialIcon } from './SiteIcons';
import { Reveal } from './Reveal';

interface SiteFooterProps {
  onOpenLegal: (slug: 'privacy' | 'terms' | 'cookies' | 'security') => void;
  onOpenCookies: () => void;
  onOpenContact: () => void;
  onNavigateSection: (href: string) => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  onOpenLegal,
  onOpenCookies,
  onOpenContact,
  onNavigateSection,
}) => {
  return (
    <footer className="site-footer">
      <div className="site-section">
        <Reveal variant="fade">
          <img
            className="site-footer__logo"
            src={siteConfig.logo}
            alt={siteConfig.name}
          />
        </Reveal>

        <div className="site-footer__grid">
          {siteConfig.footerLinks.map((col, idx) => (
            <Reveal key={col.heading} delay={idx * 70}>
              <h4>{col.heading}</h4>
              {col.links.map((link) => {
                if (link.href === '/contact') {
                  return (
                    <a
                      key={link.label}
                      href="#contact"
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenContact();
                      }}
                    >
                      {link.label}
                    </a>
                  );
                }
                if (link.href.startsWith('#')) {
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigateSection(link.href);
                      }}
                    >
                      {link.label}
                    </a>
                  );
                }
                return (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                );
              })}
            </Reveal>
          ))}
        </div>

        <div className="site-footer__bottom">
          <div className="site-footer__social">
            {siteConfig.socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon name={social.icon} />
              </a>
            ))}
          </div>

          <p className="site-footer__copy">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>

          <div className="site-footer__legal">
            <button type="button" onClick={() => onOpenLegal('privacy')}>
              Privacy Policy
            </button>
            <button type="button" onClick={() => onOpenLegal('terms')}>
              Terms and Conditions
            </button>
            <button type="button" onClick={() => onOpenLegal('cookies')}>
              Cookie Policy
            </button>
            <button type="button" onClick={() => onOpenLegal('security')}>
              Security
            </button>
            <button
              type="button"
              className="site-footer__cookie-btn"
              onClick={onOpenCookies}
            >
              Cookie settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
