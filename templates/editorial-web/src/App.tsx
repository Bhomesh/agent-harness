import React, { useState, useEffect } from 'react';
import { siteConfig, ServiceItem, WwdItem } from './data/siteData';
import { SiteNav } from './components/SiteNav';
import { SiteHero } from './components/SiteHero';
import { SiteAbout } from './components/SiteAbout';
import { SiteServices } from './components/SiteServices';
import { SiteProblems } from './components/SiteProblems';
import { SiteWhatWeDo } from './components/SiteWhatWeDo';
import { SiteIndustries } from './components/SiteIndustries';
import { StatementCurve } from './components/StatementCurve';
import { SiteCareers } from './components/SiteCareers';
import { SiteContactBanner } from './components/SiteContactBanner';
import { SiteFooter } from './components/SiteFooter';
import { SiteConsent } from './components/SiteConsent';
import { SiteLegalModal, LegalSlug } from './components/SiteLegalModal';
import { SiteLegalPage } from './components/SiteLegalPage';
import { SiteServiceModal } from './components/SiteServiceModal';
import { SiteEstimatorModal } from './components/SiteEstimatorModal';
import { SiteContactPage } from './components/SiteContactPage';
import { ConsultationForm } from './components/ConsultationForm';

export type AppView = 'home' | 'contact' | 'privacy' | 'terms' | 'cookies' | 'security';

const getViewFromPath = (): AppView => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.replace(/^\/+/, '').toLowerCase();
  const hash = window.location.hash.replace(/^#+/, '').toLowerCase();
  if (path === 'contact' || hash === 'contact-page') return 'contact';
  if (['privacy', 'terms', 'cookies', 'security'].includes(path)) return path as AppView;
  if (['privacy', 'terms', 'cookies', 'security'].includes(hash)) return hash as AppView;
  return 'home';
};

export const App: React.FC = () => {
  // Navigation / Page View State
  const [activeView, setActiveView] = useState<AppView>(getViewFromPath);

  // Interactive Modals State
  const [consultationOpen, setConsultationOpen] = useState<boolean>(false);
  const [selectedServiceTitle, setSelectedServiceTitle] = useState<string>('');
  const [quoteDetails, setQuoteDetails] = useState<string>('');

  const [serviceModalOpen, setServiceModalOpen] = useState<boolean>(false);
  const [activeService, setActiveService] = useState<ServiceItem | null>(null);

  const [estimatorOpen, setEstimatorOpen] = useState<boolean>(false);

  const [legalModalOpen, setLegalModalOpen] = useState<boolean>(false);
  const [activeLegalSlug, setActiveLegalSlug] = useState<LegalSlug>('privacy');

  const [consentOpen, setConsentOpen] = useState<boolean | undefined>(undefined);

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setActiveView(getViewFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToView = (view: AppView, targetHash?: string) => {
    setActiveView(view);
    const targetPath = view === 'home' ? (targetHash || '/') : `/${view}`;
    try {
      if (window.location.pathname !== (view === 'home' ? '/' : `/${view}`)) {
        window.history.pushState(null, '', targetPath);
      }
    } catch (e) {
      // In testing environments without history API support
    }
    if (!targetHash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handlers
  const handleOpenConsultation = (serviceName?: string) => {
    if (serviceName) {
      setSelectedServiceTitle(serviceName);
    } else {
      setSelectedServiceTitle('');
    }
    setConsultationOpen(true);
  };

  const handleSelectService = (service: ServiceItem) => {
    setActiveService(service);
    setServiceModalOpen(true);
  };

  const handleSeeAllServices = () => {
    setActiveService(siteConfig.services[0]);
    setServiceModalOpen(true);
  };

  const handleWwdRowClick = (item: WwdItem) => {
    const matchedService = siteConfig.services.find((s) =>
      s.title.toLowerCase().includes(item.title.toLowerCase().slice(0, 10))
    );
    if (matchedService) {
      handleSelectService(matchedService);
    } else {
      handleOpenConsultation(item.title);
    }
  };

  const handleOpenEstimator = () => {
    setEstimatorOpen(true);
  };

  const handleQuoteRequested = (details: string) => {
    setQuoteDetails(details);
    setSelectedServiceTitle('Custom Architecture Scope (Estimator Quote)');
    setEstimatorOpen(false);
    setConsultationOpen(true);
  };

  const handleOpenLegal = (slug: LegalSlug) => {
    setActiveLegalSlug(slug);
    setLegalModalOpen(true);
  };

  const handleOpenCookiesPolicy = () => {
    setActiveLegalSlug('cookies');
    setLegalModalOpen(true);
  };

  const handleOpenCookieSettings = () => {
    setConsentOpen(true);
  };

  const handleOpenContactPage = () => {
    navigateToView('contact');
  };

  const handleNavigateHome = () => {
    navigateToView('home');
  };

  const handleNavigateSection = (href: string) => {
    navigateToView('home', href);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  const handleScrollToServices = () => {
    handleNavigateSection('#services');
  };

  return (
    <div className="site-page">
      {/* Main View Router */}
      {activeView === 'contact' ? (
        <main className="flex-1">
          <SiteContactPage
            onBackToHome={handleNavigateHome}
            initialService={selectedServiceTitle}
            initialQuote={quoteDetails}
            onOpenConsultation={() => handleOpenConsultation()}
            onOpenEstimator={handleOpenEstimator}
            onNavigateSection={handleNavigateSection}
          />
        </main>
      ) : activeView === 'privacy' ||
        activeView === 'terms' ||
        activeView === 'cookies' ||
        activeView === 'security' ? (
        <main className="flex-1">
          <SiteLegalPage
            slug={activeView}
            onSelectSlug={(slug) => navigateToView(slug)}
            onNavigateHome={handleNavigateHome}
            onOpenConsultation={() => handleOpenConsultation()}
            onOpenEstimator={handleOpenEstimator}
            onNavigateSection={handleNavigateSection}
            onOpenContact={handleOpenContactPage}
          />
        </main>
      ) : (
        <main className="flex-1">
          {/* Floating Top Pill Nav with Fullscreen Menu */}
          <SiteNav
            floating={true}
            onOpenConsultation={() => handleOpenConsultation()}
            onOpenEstimator={handleOpenEstimator}
            onNavigateHome={handleNavigateHome}
            onNavigateSection={handleNavigateSection}
            onOpenContact={handleOpenContactPage}
          />

          {/* Hero Section */}
          <SiteHero onDiscoverServices={handleScrollToServices} />

          {/* About Us Section */}
          <SiteAbout onReadMore={handleScrollToServices} />

          {/* Services Section */}
          <SiteServices
            onSelectService={handleSelectService}
            onSeeAllServices={handleSeeAllServices}
          />

          {/* Problems We Solve Section (3-lane infinite marquee) */}
          <SiteProblems />

          {/* What We Do Section (Emerald numbered items + stats + partner marquee) */}
          <SiteWhatWeDo onRowClick={handleWwdRowClick} />

          {/* Industries Section (Purple with constellation graphic) */}
          <SiteIndustries
            onTalkToExpert={() => handleOpenConsultation('Industry-Specific Architecture')}
          />

          {/* Signature Animated Curved Statement Ribbon */}
          <StatementCurve />

          {/* Careers & Culture Section (Sunset orange with avatar graphic) */}
          <SiteCareers
            onLearnMore={() => handleOpenConsultation('Offshore Engineering Squads & Careers')}
          />

          {/* Contact Banner with organic wave divider */}
          <SiteContactBanner onContactClick={handleOpenContactPage} />
        </main>
      )}

      {/* Footer */}
      <SiteFooter
        onOpenLegal={handleOpenLegal}
        onOpenCookies={handleOpenCookieSettings}
        onOpenContact={handleOpenContactPage}
        onNavigateSection={handleNavigateSection}
      />

      {/* Cookie Consent Banner */}
      <SiteConsent
        isOpen={consentOpen}
        onOpenCookiesPolicy={handleOpenCookiesPolicy}
        onClose={() => setConsentOpen(false)}
      />

      {/* Interactive Consultation Modal */}
      {consultationOpen && (
        <ConsultationForm
          isOpenModal={true}
          initialService={selectedServiceTitle}
          initialQuote={quoteDetails}
          onCloseModal={() => setConsultationOpen(false)}
        />
      )}

      {/* Interactive Service Detail Modal */}
      <SiteServiceModal
        isOpen={serviceModalOpen}
        service={activeService}
        onClose={() => setServiceModalOpen(false)}
        onSelectService={(s) => setActiveService(s)}
        onRequestConsultation={(title) => handleOpenConsultation(title)}
        onOpenEstimator={handleOpenEstimator}
      />

      {/* Interactive Cost Estimator Modal */}
      <SiteEstimatorModal
        isOpen={estimatorOpen}
        onClose={() => setEstimatorOpen(false)}
        onQuoteRequested={handleQuoteRequested}
      />

      {/* Legal Documents Modal */}
      <SiteLegalModal
        isOpen={legalModalOpen}
        initialSlug={activeLegalSlug}
        onClose={() => setLegalModalOpen(false)}
      />
    </div>
  );
};

export default App;
