import { CaseStudy } from '../types';

export const caseStudiesData: CaseStudy[] = [
  {
    id: 'paystream-fintech',
    client: 'FinTech PayStream',
    industry: 'Financial Technology & Payments',
    challenge: 'Legacy payment gateway suffered frequent 504 gateway timeouts during peak flash sales, with latency spiking beyond 1,800ms and infrastructure costs spiraling out of control.',
    solution: 'Build Swift re-architected their transaction engine into event-driven Go microservices running on AWS EKS, paired with Redis caching and Apache Kafka for asynchronous ledger reconciliation.',
    metrics: [
      { label: 'Daily Transactions', value: '10M tx/day' },
      { label: 'Switch Reliability SLA', value: '99.999%' },
      { label: 'P99 Latency', value: '< 22ms' },
      { label: 'Cloud Cost Cut', value: '-52%' }
    ],
    techStack: ['Go', 'AWS EKS', 'Apache Kafka', 'PostgreSQL', 'Redis', 'Terraform'],
    duration: '4 Months',
    location: 'Singapore & Mumbai'
  },
  {
    id: 'healthlink-telemedicine',
    client: 'HealthLink India',
    industry: 'Healthcare & ABDM Telemedicine',
    challenge: 'Need for ABDM & HIPAA-compliant telehealth platform connecting 5,000+ doctors across tier-1 and tier-2 Indian cities with end-to-end encrypted video consultations and EHR synchronization.',
    solution: 'Engineered a modern React & WebRTC consultation suite with zero-knowledge encrypted clinical record vaults, edge media routing, and automated appointment routing microservices.',
    metrics: [
      { label: 'Reduced Video Latency', value: '40% Lower' },
      { label: 'Compliance Status', value: '100% ABDM/HIPAA' },
      { label: 'Encrypted Calls', value: '1.2M+' },
      { label: 'Active Doctors', value: '7,500+' }
    ],
    techStack: ['React', 'WebRTC', 'Node.js', 'MongoDB', 'AWS KMS', 'Docker'],
    duration: '5 Months',
    location: 'Jaipur & New Delhi'
  },
  {
    id: 'rajasthan-smart-logistics',
    client: 'Rajasthan Smart Logistics',
    industry: 'Supply Chain & Heavy Fleet Telematics',
    challenge: 'Freight operators faced heavy diesel fuel wastage and unpredictable vehicle breakdowns across 14,000+ commercial fleet routes across Rajasthan and Gujarat highway corridors.',
    solution: 'Build Swift designed a real-time IoT telemetry ingestion pipeline with an AI dynamic routing optimizer that predicts traffic bottlenecks, diesel theft, and scheduled predictive maintenance.',
    metrics: [
      { label: 'Fleet Fuel Cost Reduction', value: '28% Saved' },
      { label: 'Daily GPS Pings', value: '15M+' },
      { label: 'Breakdown Reduction', value: '-41%' },
      { label: 'Telemetry Lag', value: '< 150ms' }
    ],
    techStack: ['Python', 'FastAPI', 'Apache Kafka', 'TimescaleDB', 'PyTorch', 'Grafana'],
    duration: '6 Months',
    location: 'Jaipur, Rajasthan'
  },
  {
    id: 'saas-modernization',
    client: 'Global SaaS Modernization',
    industry: 'Enterprise B2B Cloud Software',
    challenge: 'A 10-year-old monolithic application with 45-minute build times, cascading database deadlocks, and severe technical debt preventing new feature rollouts.',
    solution: 'Executed a zero-downtime strangler-fig migration to modular microservices with high-throughput backend services, Kafka CDC replication, and automated canary deployments.',
    metrics: [
      { label: 'Cloud Cost Reduction', value: '50% Cut' },
      { label: 'Deploy Frequency', value: '45x / day' },
      { label: 'CI Pipeline Time', value: '3.5 min' },
      { label: 'Deadlock Errors', value: '0 Sec Downtime' }
    ],
    techStack: ['Go', 'TypeScript', 'Next.js', 'PostgreSQL', 'Docker', 'AWS ECS', 'Kafka'],
    duration: '3.5 Months',
    location: 'London & San Francisco'
  }
];
