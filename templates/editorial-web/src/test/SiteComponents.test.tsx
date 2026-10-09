import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SiteNav } from '../components/SiteNav';
import { SiteHero } from '../components/SiteHero';
import { SiteAbout } from '../components/SiteAbout';
import { SiteServices } from '../components/SiteServices';
import { SiteProblems } from '../components/SiteProblems';
import { SiteWhatWeDo } from '../components/SiteWhatWeDo';
import { SiteIndustries } from '../components/SiteIndustries';
import { SiteCareers } from '../components/SiteCareers';
import { SiteFooter } from '../components/SiteFooter';
import { SiteConsent } from '../components/SiteConsent';
import { SiteLegalModal } from '../components/SiteLegalModal';
import { SiteLegalPage } from '../components/SiteLegalPage';
import { SiteServiceModal } from '../components/SiteServiceModal';
import { SiteContactPage } from '../components/SiteContactPage';
import { StatementCurve } from '../components/StatementCurve';
import { App } from '../App';
import { siteConfig } from '../data/siteData';

describe('Forteiva Architecture & Components', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('SiteNav Component', () => {
    it('renders logo and get in touch button', () => {
      const handleConsultation = vi.fn();
      render(<SiteNav onOpenConsultation={handleConsultation} />);

      expect(screen.getByRole('button', { name: /Get in Touch/i })).toBeInTheDocument();
      const logoLink = screen.getByLabelText(/(Build Shift|BuildShift) Technologies Home/i);
      expect(logoLink).toBeInTheDocument();
    });

    it('opens full-screen menu overlay when clicking hamburger toggle', () => {
      render(<SiteNav />);

      const toggleBtn = screen.getByRole('button', { name: /Open menu/i });
      fireEvent.click(toggleBtn);

      expect(screen.getByRole('dialog', { name: /Site menu/i })).toHaveClass('is-open');
      expect(screen.getByRole('button', { name: 'About Us' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Services' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cost Estimator' })).toBeInTheDocument();

      // Close menu
      const closeBtn = screen.getByRole('button', { name: /Close menu/i });
      fireEvent.click(closeBtn);
      expect(screen.getByRole('dialog', { name: /Site menu/i })).not.toHaveClass('is-open');
    });

    it('triggers consultation callback when Get in Touch is clicked', () => {
      const handleConsultation = vi.fn();
      render(<SiteNav onOpenConsultation={handleConsultation} />);

      const getInTouchBtn = screen.getByRole('button', { name: /Get in Touch/i });
      fireEvent.click(getInTouchBtn);
      expect(handleConsultation).toHaveBeenCalledTimes(1);
    });
  });

  describe('SiteHero Component', () => {
    it('renders hero eyebrow, title, text, and cta', () => {
      const handleDiscover = vi.fn();
      render(<SiteHero onDiscoverServices={handleDiscover} />);

      expect(screen.getByText(siteConfig.hero.eyebrow)).toBeInTheDocument();
      expect(screen.getByText(siteConfig.hero.title)).toBeInTheDocument();
      expect(screen.getByText(siteConfig.hero.text)).toBeInTheDocument();

      const ctaBtn = screen.getByRole('link', { name: new RegExp(siteConfig.hero.cta.label, 'i') });
      fireEvent.click(ctaBtn);
      expect(handleDiscover).toHaveBeenCalledTimes(1);
    });
  });

  describe('SiteAbout Component', () => {
    it('renders about headlines, paragraphs, and svg pipeline graphic', () => {
      const handleReadMore = vi.fn();
      render(<SiteAbout onReadMore={handleReadMore} />);

      expect(screen.getByText(siteConfig.about.subhead)).toBeInTheDocument();
      expect(screen.getByText(siteConfig.about.subcopy)).toBeInTheDocument();
      expect(screen.getByText('Architect')).toBeInTheDocument();
      expect(screen.getByText('Build Swiftly')).toBeInTheDocument();

      const exploreBtn = screen.getByRole('button', { name: /Explore Services/i });
      fireEvent.click(exploreBtn);
      expect(handleReadMore).toHaveBeenCalledTimes(1);
    });
  });

  describe('SiteServices Component', () => {
    it('renders all 6 service cards plus the See All card', () => {
      const handleSelect = vi.fn();
      const handleSeeAll = vi.fn();
      render(<SiteServices onSelectService={handleSelect} onSeeAllServices={handleSeeAll} />);

      expect(screen.getByText(/Uncovering Unseen Opportunities/i)).toBeInTheDocument();
      expect(screen.getByText(/DEDICATED OFFSHORE/i)).toBeInTheDocument();
      expect(screen.getByText(/CLOUD & DEVOPS/i)).toBeInTheDocument();

      const seeAllBtn = screen.getByRole('button', { name: new RegExp(siteConfig.seeAll.cta.label, 'i') });
      fireEvent.click(seeAllBtn);
      expect(handleSeeAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('SiteProblems Component', () => {
    it('renders 3-lane marquee problem pills', () => {
      render(<SiteProblems />);

      expect(screen.getByText(/The Problems We Solve/i)).toBeInTheDocument();
      expect(screen.getAllByText('Slow Release Cycles').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Rising Cloud Costs').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Developer Burnout').length).toBeGreaterThan(0);
    });
  });

  describe('SiteWhatWeDo Component', () => {
    it('renders numbered rows, metrics, and partner marquee', () => {
      const handleRow = vi.fn();
      render(<SiteWhatWeDo onRowClick={handleRow} />);

      expect(screen.getByText(siteConfig.whatWeDo.eyebrow)).toBeInTheDocument();
      expect(screen.getByText('01')).toBeInTheDocument();
      expect(screen.getByText('05')).toBeInTheDocument();
      expect(screen.getByText('250+')).toBeInTheDocument();
      expect(screen.getByText('120+')).toBeInTheDocument();

      const bmwTags = screen.getAllByText('BMW');
      expect(bmwTags.length).toBeGreaterThan(0);
    });
  });

  describe('SiteIndustries Component', () => {
    it('renders constellation graphic, industries items, and CTA', () => {
      const handleExpert = vi.fn();
      render(<SiteIndustries onTalkToExpert={handleExpert} />);

      expect(screen.getByText(siteConfig.industries.title)).toBeInTheDocument();
      expect(screen.getByText('Banking & Finance')).toBeInTheDocument();
      expect(screen.getByText('Healthcare & Life Sciences')).toBeInTheDocument();

      const talkBtn = screen.getByRole('button', { name: new RegExp(siteConfig.industries.cta.label, 'i') });
      fireEvent.click(talkBtn);
      expect(handleExpert).toHaveBeenCalledTimes(1);
    });
  });

  describe('StatementCurve Component', () => {
    it('renders SVG curve path, definitions, and animated text ribbon', () => {
      render(<StatementCurve />);

      const section = screen.getByLabelText(/Brand statement/i);
      expect(section).toBeInTheDocument();
      expect(screen.getAllByText(/Relentless Innovation/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/(Build Swift|BuildShift)/i).length).toBeGreaterThan(0);
    });
  });

  describe('SiteCareers Component', () => {
    it('renders career chips and graphic', () => {
      const handleLearn = vi.fn();
      render(<SiteCareers onLearnMore={handleLearn} />);

      expect(screen.getByText(/Join the (Build Swift|BuildShift)/i)).toBeInTheDocument();
      expect(screen.getByText('Cloud-native & DevOps expertise')).toBeInTheDocument();
      expect(screen.getByText('DevOps Lead')).toBeInTheDocument();

      const learnBtn = screen.getByRole('button', { name: new RegExp(siteConfig.careers.cta.label, 'i') });
      fireEvent.click(learnBtn);
      expect(handleLearn).toHaveBeenCalledTimes(1);
    });
  });

  describe('SiteFooter Component', () => {
    it('renders footer directory, social links, and legal links', () => {
      const handleLegal = vi.fn();
      const handleCookies = vi.fn();
      const handleContact = vi.fn();
      const handleNav = vi.fn();

      render(
        <SiteFooter
          onOpenLegal={handleLegal}
          onOpenCookies={handleCookies}
          onOpenContact={handleContact}
          onNavigateSection={handleNav}
        />
      );

      expect(screen.getByRole('heading', { level: 4, name: 'Company' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 4, name: 'Services' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 4, name: 'Industries' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 4, name: 'Support' })).toBeInTheDocument();

      const privacyBtn = screen.getByRole('button', { name: /Privacy Policy/i });
      fireEvent.click(privacyBtn);
      expect(handleLegal).toHaveBeenCalledWith('privacy');

      const cookieSettingsBtn = screen.getByRole('button', { name: /Cookie settings/i });
      fireEvent.click(cookieSettingsBtn);
      expect(handleCookies).toHaveBeenCalledTimes(1);
    });
  });

  describe('SiteConsent Component', () => {
    it('renders consent banner and saves preference to localStorage on Accept All', () => {
      const handlePolicy = vi.fn();
      render(<SiteConsent onOpenCookiesPolicy={handlePolicy} />);

      expect(screen.getByText(/We use strictly necessary cookies/i)).toBeInTheDocument();

      const acceptBtn = screen.getByRole('button', { name: /Accept All/i });
      fireEvent.click(acceptBtn);

      expect(localStorage.getItem('buildswift_cookie_consent')).toBe('accepted');
      expect(screen.queryByText(/We use strictly necessary cookies/i)).not.toBeInTheDocument();
    });

    it('saves essential preference when clicking Essential Only', () => {
      const handlePolicy = vi.fn();
      render(<SiteConsent onOpenCookiesPolicy={handlePolicy} />);

      const essentialBtn = screen.getByRole('button', { name: /Essential Only/i });
      fireEvent.click(essentialBtn);

      expect(localStorage.getItem('buildswift_cookie_consent')).toBe('essential');
      expect(screen.queryByText(/We use strictly necessary cookies/i)).not.toBeInTheDocument();
    });
  });

  describe('SiteLegalModal Component', () => {
    it('renders modal and switches between legal tabs', () => {
      const handleClose = vi.fn();
      render(<SiteLegalModal isOpen={true} initialSlug="privacy" onClose={handleClose} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/How Build Swift Technologies handles personal data/i)).toBeInTheDocument();

      // Switch to terms tab
      const termsBtn = screen.getByRole('button', { name: 'Terms and Conditions' });
      fireEvent.click(termsBtn);
      expect(screen.getByText(/The terms governing your access and use/i)).toBeInTheDocument();

      // Switch to security tab
      const secBtn = screen.getByRole('button', { name: 'Security & Trust' });
      fireEvent.click(secBtn);
      expect(screen.getByText(/Defense in depth/i)).toBeInTheDocument();

      // Close modal
      const closeBtn = screen.getByRole('button', { name: /Close legal documents/i });
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('SiteLegalPage Component', () => {
    it('renders subhero header, legal sidebar nav, and switches documents', () => {
      const handleSelectSlug = vi.fn();
      const handleNavigateHome = vi.fn();
      const handleConsult = vi.fn();
      const handleEstimator = vi.fn();
      const handleNavSection = vi.fn();
      const handleContact = vi.fn();

      render(
        <SiteLegalPage
          slug="privacy"
          onSelectSlug={handleSelectSlug}
          onNavigateHome={handleNavigateHome}
          onOpenConsultation={handleConsult}
          onOpenEstimator={handleEstimator}
          onNavigateSection={handleNavSection}
          onOpenContact={handleContact}
        />
      );

      expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Terms and Conditions' })).toBeInTheDocument();
      expect(screen.getByText(/How Build Swift Technologies handles personal data/i)).toBeInTheDocument();

      const termsBtn = screen.getByRole('button', { name: 'Terms and Conditions' });
      fireEvent.click(termsBtn);
      expect(handleSelectSlug).toHaveBeenCalledWith('terms');
    });
  });

  describe('SiteServiceModal Component', () => {
    it('renders service details, guarantees, and calls consultation callback', () => {
      const handleClose = vi.fn();
      const handleSelect = vi.fn();
      const handleConsult = vi.fn();
      const handleEstimator = vi.fn();

      const testService = siteConfig.services[0];
      render(
        <SiteServiceModal
          isOpen={true}
          service={testService}
          onClose={handleClose}
          onSelectService={handleSelect}
          onRequestConsultation={handleConsult}
          onOpenEstimator={handleEstimator}
        />
      );

      expect(screen.getByText(/DEDICATED OFFSHORE/i)).toBeInTheDocument();
      expect(screen.getByText(/Zero recruiting overhead/i)).toBeInTheDocument();
      expect(screen.getByText(/TypeScript/i)).toBeInTheDocument();

      const consultBtn = screen.getByRole('button', { name: /Request Architectural Consultation/i });
      fireEvent.click(consultBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
      expect(handleConsult).toHaveBeenCalledWith(testService.title.replace('\n', ' '));
    });
  });

  describe('SiteContactPage Component', () => {
    it('renders 4-column details grid and embedded consultation form', () => {
      const handleBack = vi.fn();
      render(<SiteContactPage onBackToHome={handleBack} />);

      expect(screen.getByText(/General Inquiries/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Direct Hotline/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Corporate HQ/i)).toBeInTheDocument();
      expect(screen.getByText(/Security & Privacy/i)).toBeInTheDocument();

      const backBtn = screen.getByRole('button', { name: /Back to Overview/i });
      fireEvent.click(backBtn);
      expect(handleBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Full App Integration', () => {
    it('renders full Forteiva landing page with all key sections', () => {
      render(<App />);

      expect(screen.getByLabelText(/(Build Swift|BuildShift) Technologies Home/i)).toBeInTheDocument();
      expect(screen.getByText(siteConfig.hero.title)).toBeInTheDocument();
      expect(screen.getByText(/Uncovering Unseen Opportunities/i)).toBeInTheDocument();
      expect(screen.getByText(/The Problems We Solve/i)).toBeInTheDocument();
      expect(screen.getByText(siteConfig.whatWeDo.title)).toBeInTheDocument();
      expect(screen.getByText(siteConfig.industries.title)).toBeInTheDocument();
      expect(screen.getByText(/Join the (Build Swift|BuildShift)/i)).toBeInTheDocument();
      expect(screen.getByText(siteConfig.contact.title)).toBeInTheDocument();
    });

    it('opens consultation modal when clicking Get in Touch in nav', async () => {
      render(<App />);

      const getInTouchBtn = screen.getByRole('button', { name: /Get in Touch/i });
      fireEvent.click(getInTouchBtn);

      await waitFor(() => {
        expect(screen.getByText(/Book Free Architectural Consultation/i)).toBeInTheDocument();
      });
    });

    it('opens service detail modal when clicking a service card', async () => {
      render(<App />);

      const viewDetailsButtons = screen.getAllByText(/View Details & Scope/i);
      fireEvent.click(viewDetailsButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Core Architectural Guarantees & Deliverables/i)).toBeInTheDocument();
      });
    });

    it('opens legal modal when clicking Privacy Policy in footer', async () => {
      render(<App />);

      const privacyBtn = screen.getByRole('button', { name: /Privacy Policy/i });
      fireEvent.click(privacyBtn);

      await waitFor(() => {
        expect(screen.getByText(/(Build Swift|BuildShift) Legal & Compliance/i)).toBeInTheDocument();
      });
    });
  });
});
