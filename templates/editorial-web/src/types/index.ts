export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  deliverables: string[];
  techStack: string[];
  icon: string;
  stats: string;
}

export interface TechItem {
  name: string;
  category: 'cloud' | 'backend' | 'frontend' | 'ai' | 'security';
  icon: string;
  description: string;
  proficiency: number; // percentage
  enterpriseUse: string;
}

export interface CaseStudy {
  id: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  metrics: {
    label: string;
    value: string;
  }[];
  techStack: string[];
  duration: string;
  location: string;
}

export interface EstimatorState {
  projectType: string;
  complexity: 'mvp' | 'growth' | 'enterprise';
  cloudPlatform: 'aws' | 'gcp' | 'azure' | 'hybrid';
  aiIntegration: boolean;
  securityCompliance: 'standard' | 'soc2' | 'hipaa';
  timeline: 'standard' | 'expedited' | 'rush';
  currency: 'USD' | 'INR';
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  location: string;
  rating: number;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}
