import React, { useState, useEffect } from 'react';

interface SiteConsentProps {
  isOpen?: boolean;
  onOpenCookiesPolicy: () => void;
  onClose?: () => void;
}

export const SiteConsent: React.FC<SiteConsentProps> = ({
  isOpen,
  onOpenCookiesPolicy,
  onClose,
}) => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (typeof isOpen === 'boolean') {
      setVisible(isOpen);
      return;
    }
    const saved = localStorage.getItem('buildswift_cookie_consent');
    if (!saved) {
      setVisible(true);
    }
  }, [isOpen]);

  const handleDecline = () => {
    localStorage.setItem('buildswift_cookie_consent', 'essential');
    setVisible(false);
    if (onClose) onClose();
  };

  const handleAccept = () => {
    localStorage.setItem('buildswift_cookie_consent', 'accepted');
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div className="site-consent" role="region" aria-label="Cookie preferences">
      <div className="site-consent__inner">
        <p className="site-consent__text">
          We use strictly necessary cookies to ensure secure operations, load balancing, and
          reliable performance. We do not sell personal data or track your behavior across other websites.{' '}
          <button
            type="button"
            onClick={onOpenCookiesPolicy}
            className="text-[#f472b6] underline bg-transparent border-0 cursor-pointer p-0 font-inherit hover:text-[#fbcfe8] transition-colors"
          >
            Review our Cookie Policy
          </button>
          .
        </p>
        <div className="site-consent__actions">
          <button
            type="button"
            className="site-consent__btn"
            onClick={handleDecline}
          >
            Essential Only
          </button>
          <button
            type="button"
            className="site-consent__btn site-consent__btn--accept"
            onClick={handleAccept}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};
