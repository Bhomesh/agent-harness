export interface LegalBlock {
  h?: string;
  p?: string;
  ul?: string[];
  table?: {
    head: string[];
    rows: string[][];
  };
}

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalPage {
  slug: string;
  path: string;
  label: string;
  title: string;
  lead: string;
  updated: string;
  sections: LegalSection[];
}

export const legalData: Record<string, LegalPage> = {
  privacy: {
    slug: 'privacy',
    path: '/privacy',
    label: 'Privacy Policy',
    title: 'Privacy Policy',
    lead: 'How Build Swift Technologies handles personal data collected through this website and digital channels.',
    updated: 'October 2026',
    sections: [
      {
        heading: '1. Who we are',
        blocks: [
          {
            p: 'Build Swift Technologies Private Limited provides software engineering, cloud architecture, DevOps, data platforms and dedicated offshore development teams. We are registered in Jaipur, Rajasthan, India, operating from World Trade Park (WTP) and Sitapura IT Park. We act as the data fiduciary / data controller for personal data collected through this website.',
          },
          {
            ul: [
              'Email: contact@buildswift.in',
              'Phone: +91 141 358 9920',
              'Address: Tower B, 4th Floor, World Trade Park (WTP), Malviya Nagar & Sitapura IT Park, Jaipur, Rajasthan 302017',
            ],
          },
        ],
      },
      {
        heading: '2. What this policy covers',
        blocks: [
          {
            p: 'This policy covers personal data we collect when you visit this website, request a consultation, or contact our engineering teams. It does not cover data we process on behalf of clients under enterprise services agreements — that is governed by the master services agreement (MSA) and data processing addendum (DPA) executed with that client.',
          },
        ],
      },
      {
        heading: '3. What we collect',
        blocks: [
          {
            h: 'Information you choose to give us',
          },
          {
            p: 'When you submit a consultation request, estimator quote, email us, or call us, we receive whatever details you provide — typically your name, business email address, company name, phone number, and architectural scope description.',
          },
          {
            h: 'Technical data',
          },
          {
            p: 'Standard web traffic telemetry generated when accessing our site, including IP address, browser type, device characteristics, timestamps, and page views, used strictly to ensure platform security and prevent malicious traffic.',
          },
          {
            h: 'What we do not collect',
          },
          {
            p: 'We do not sell personal data, do not profile users for behavioural ad retargeting, and do not buy third-party marketing lists. Our typefaces and primary assets are served locally from our domain.',
          },
        ],
      },
      {
        heading: '4. Why we use it, and legal basis',
        blocks: [
          {
            table: {
              head: ['Purpose', 'Data Used', 'Legal Basis'],
              rows: [
                ['Responding to engineering inquiries & quotes', 'Contact details, project specifications', 'Contractual necessity / legitimate interest'],
                ['Maintaining site reliability & security', 'IP address, technical request logs', 'Legitimate interest in secure operations'],
                ['Statutory & compliance recordkeeping', 'Engagement correspondence & agreements', 'Compliance with applicable legal obligations'],
              ],
            },
          },
        ],
      },
    ],
  },
  terms: {
    slug: 'terms',
    path: '/terms',
    label: 'Terms and Conditions',
    title: 'Terms and Conditions',
    lead: 'The terms governing your access and use of the Build Swift Technologies website.',
    updated: 'October 2026',
    sections: [
      {
        heading: '1. Acceptance of terms',
        blocks: [
          {
            p: 'By accessing this website, requesting consultations, or communicating with Build Swift Technologies, you agree to comply with these terms. If you do not agree with any part of these terms, you should discontinue using the site.',
          },
        ],
      },
      {
        heading: '2. Intellectual property',
        blocks: [
          {
            p: 'All code, copy, logos, trademarks, diagrams, and visual designs published on this site are the intellectual property of Build Swift Technologies Private Limited or used under license. Third-party brand marks (such as client or partner logos) remain the property of their respective owners.',
          },
        ],
      },
      {
        heading: '3. Enquiries and commercial engagements',
        blocks: [
          {
            p: 'Submitting a consultation request, using the cost estimator, or initiating correspondence does not constitute a binding commercial contract. A binding engagement takes effect solely upon the bilateral execution of a written Master Services Agreement (MSA) and Statement of Work (SOW).',
          },
        ],
      },
      {
        heading: '4. Governing law and jurisdiction',
        blocks: [
          {
            p: 'These terms are governed by the laws of India. The courts of Jaipur, Rajasthan shall have exclusive jurisdiction over any disputes arising under or in connection with the use of this website.',
          },
        ],
      },
    ],
  },
  cookies: {
    slug: 'cookies',
    path: '/cookies',
    label: 'Cookie Policy',
    title: 'Cookie Policy',
    lead: 'How Build Swift Technologies uses storage and cookies, and how you retain complete control.',
    updated: 'October 2026',
    sections: [
      {
        heading: '1. Our approach to cookies',
        blocks: [
          {
            p: 'We believe in data minimization. Build Swift sets no tracking cookies or invasive third-party ad pixels. We store only essential preferences (such as your cookie consent choice and UI settings) locally in your browser storage.',
          },
        ],
      },
      {
        heading: '2. Controlling your preferences',
        blocks: [
          {
            p: 'You can modify or withdraw your preferences at any time by using the "Cookie settings" button in the footer or by clearing your browser cache.',
          },
        ],
      },
    ],
  },
  security: {
    slug: 'security',
    path: '/security',
    label: 'Security',
    title: 'Security Architecture & Practices',
    lead: 'How Build Swift protects our website, client data, and production engineering environments.',
    updated: 'October 2026',
    sections: [
      {
        heading: '1. Defense in depth',
        blocks: [
          {
            p: 'Security is embedded at every phase of our delivery lifecycle rather than bolted on at the conclusion. Whether developing offshore squads or managing enterprise cloud migrations, we enforce strict zero-trust standards.',
          },
          {
            ul: [
              'Mandatory least-privilege role-based access control (RBAC)',
              'Encrypted data in transit (TLS 1.3) and at rest (AES-256)',
              'Automated SAST and dependency vulnerability scanning in CI/CD pipelines',
              'Secrets isolation in AWS Secrets Manager / HashiCorp Vault — never committed to repositories',
              'Strict SOC2 Type II, HIPAA, and ISO 27001 readiness alignment',
            ],
          },
        ],
      },
      {
        heading: '2. Reporting vulnerabilities',
        blocks: [
          {
            p: 'If you discover a potential vulnerability or security concern, please disclose responsibly to security@buildswift.in. We acknowledge all reports within 24 hours and keep researchers updated throughout triage.',
          },
        ],
      },
    ],
  },
};
