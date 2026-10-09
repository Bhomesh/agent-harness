import React from 'react';

const commonStroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const ArrowRightIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <path d="M1.5 6h9M6.8 2.2 10.6 6l-3.8 3.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ServiceIcon: React.FC<{ name: string; className?: string }> = ({ name, className = '' }) => {
  switch (name) {
    case 'team':
      return (
        <svg viewBox="0 0 24 24" {...commonStroke} className={className} aria-hidden="true">
          <circle cx="9" cy="9.5" r="3" />
          <circle cx="17.5" cy="10.5" r="2.4" />
          <path d="M3 20.5c.7-3.4 3.1-5.2 6-5.2s5.3 1.8 6 5.2M17 15.6c2 .5 3.4 2.1 3.9 4.4" />
        </svg>
      );
    case 'extend':
      return (
        <svg viewBox="0 0 24 24" {...commonStroke} className={className} aria-hidden="true">
          <rect x="3" y="4" width="8" height="7" rx="1.6" />
          <rect x="3" y="14" width="8" height="7" rx="1.6" />
          <path d="M15 12.5h6M18 9.5l3 3-3 3M13 8h2M13 17h2" />
        </svg>
      );
    case 'code':
      return (
        <svg viewBox="0 0 24 24" {...commonStroke} className={className} aria-hidden="true">
          <rect x="2.5" y="4" width="19" height="16" rx="2.2" />
          <path d="M2.5 8.5h19M8.5 12.5 6.3 14.7l2.2 2.2M15.5 12.5l2.2 2.2-2.2 2.2" />
        </svg>
      );
    case 'cloud':
      return (
        <svg viewBox="0 0 24 24" {...commonStroke} className={className} aria-hidden="true">
          <path d="M7.2 18.5A4.2 4.2 0 0 1 7 10.2a5.3 5.3 0 0 1 10.1-.7 3.9 3.9 0 0 1 .5 7.7Z" />
          <path d="M9.6 14.6 12 12.2l2.4 2.4M12 12.4v6" />
        </svg>
      );
    case 'data':
      return (
        <svg viewBox="0 0 24 24" {...commonStroke} className={className} aria-hidden="true">
          <ellipse cx="12" cy="6" rx="7" ry="2.8" />
          <path d="M5 6v6c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8V6" />
          <path d="M5 12v5.4c0 1.55 3.13 2.8 7 2.8 1.5 0 2.9-.19 4-.5" />
          <circle cx="18.8" cy="18" r="2.4" />
          <path d="M18.8 15.6v-1.2M18.8 21.6v-1.2M21.2 18h-1.2M17.6 18h-1.2" />
        </svg>
      );
    case 'speed':
    default:
      return (
        <svg viewBox="0 0 24 24" {...commonStroke} className={className} aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
  }
};

export const IndustryIcon: React.FC<{ name: string; className?: string }> = ({ name, className = '' }) => {
  switch (name) {
    case 'bank':
      return (
        <svg viewBox="0 0 24 24" {...commonStroke} className={className} aria-hidden="true">
          <path d="M3 9.5 12 4l9 5.5M4.5 9.5v9M9 9.5v9M15 9.5v9M19.5 9.5v9M2.5 20.5h19" />
        </svg>
      );
    case 'health':
      return (
        <svg viewBox="0 0 24 24" {...commonStroke} className={className} aria-hidden="true">
          <path d="M20.4 6.6a4.6 4.6 0 0 0-7.4-1.2L12 6.4l-1-1a4.6 4.6 0 1 0-6.6 6.4L12 20l7.6-8.2c1.2-1.3 1.5-3.4.8-5.2Z" />
          <path d="M3.8 12.4h3.4l1.4-2.4 1.8 4.4 1.5-3 1 1h5" />
        </svg>
      );
    case 'cart':
      return (
        <svg viewBox="0 0 24 24" {...commonStroke} className={className} aria-hidden="true">
          <path d="M2.5 3.5h2.8l2.3 11.2h9.9l2-7.7H6.2" />
          <circle cx="9.2" cy="19.3" r="1.6" />
          <circle cx="17.2" cy="19.3" r="1.6" />
        </svg>
      );
    case 'factory':
      return (
        <svg viewBox="0 0 24 24" {...commonStroke} className={className} aria-hidden="true">
          <path d="M2.5 20.5h19M4 20.5V9.8l5.5 3.4V9.8l5.5 3.4V6.2h5v14.3" />
          <path d="M8 17.4h2M13.5 17.4h2M18.5 17.4h1" />
        </svg>
      );
    case 'truck':
      return (
        <svg viewBox="0 0 24 24" {...commonStroke} className={className} aria-hidden="true">
          <path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3.2v3.3h-7" />
          <circle cx="7" cy="18.5" r="1.9" />
          <circle cx="17" cy="18.5" r="1.9" />
        </svg>
      );
    case 'cap':
    default:
      return (
        <svg viewBox="0 0 24 24" {...commonStroke} className={className} aria-hidden="true">
          <path d="M12 4 1.8 8.6 12 13.2l10.2-4.6L12 4Z" />
          <path d="M5.8 10.4v5.2c0 1.9 2.8 3.4 6.2 3.4s6.2-1.5 6.2-3.4v-5.2M21.4 9v5.6" />
        </svg>
      );
  }
};

export const SocialIcon: React.FC<{ name: string }> = ({ name }) => {
  switch (name) {
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.9 8.4H3.4V21h3.5V8.4ZM5.15 3a2.03 2.03 0 1 0 0 4.06 2.03 2.03 0 0 0 0-4.06ZM20.6 13.9c0-3.4-1.82-4.98-4.24-4.98-1.96 0-2.83 1.08-3.32 1.83V8.4H9.55c.05 1 0 12.6 0 12.6h3.49v-7.04c0-.31.02-.63.11-.85.26-.63.83-1.28 1.8-1.28 1.28 0 1.79.97 1.79 2.38V21h3.86v-7.1Z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'github':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );
    case 'twitter':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
  }
};
