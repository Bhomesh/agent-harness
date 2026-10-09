import { ServiceItem } from '../types';

export const servicesData: ServiceItem[] = [
  {
    id: 'cloud-architecture',
    title: 'Cloud Architecture & DevOps',
    category: 'Infrastructure',
    shortDesc: 'Resilient multi-cloud engineering, Kubernetes cluster orchestration, and GitOps pipelines engineered for 99.999% SLA.',
    fullDesc: 'We re-architect monolithic systems into event-driven cloud topologies on AWS, Google Cloud, and Azure. From automated zero-downtime deployment workflows to automated cost optimization governance.',
    deliverables: [
      'Multi-region AWS/Azure/GCP Infrastructure as Code (Terraform)',
      'Enterprise Kubernetes (EKS/GKE) with Istio Service Mesh',
      'Automated GitOps CI/CD with automated security gates',
      'FinOps governance reducing infrastructure spend by up to 45%'
    ],
    techStack: ['Kubernetes', 'Terraform', 'AWS', 'GCP', 'Docker', 'ArgoCD', 'Prometheus'],
    icon: 'Cloud',
    stats: '45% Avg Cost Reduction'
  },
  {
    id: 'applied-ai',
    title: 'Applied AI & Autonomous Agents',
    category: 'Artificial Intelligence',
    shortDesc: 'Production LLMs, private enterprise RAG pipelines, fine-tuned domain models, and autonomous workflow agent swarms.',
    fullDesc: 'Move beyond demo toys to resilient enterprise AI architectures. We deploy air-gapped private vector databases, multi-agent reasoning graphs, and deterministic guardrail workflows that ensure data privacy and zero hallucinations.',
    deliverables: [
      'Private RAG architectures with hybrid semantic & BM25 indexing',
      'Self-hosted local LLM pipelines (Ollama, vLLM, DeepSeek, Llama 3)',
      'Autonomous multi-agent orchestration for enterprise workflows',
      'Automated prompt evaluation harnesses and hallucination guards'
    ],
    techStack: ['LangGraph', 'vLLM', 'Qdrant', 'pgvector', 'Python', 'FastAPI', 'PyTorch'],
    icon: 'Cpu',
    stats: '10x Faster Automation'
  },
  {
    id: 'custom-software',
    title: 'Custom Enterprise Software',
    category: 'Engineering',
    shortDesc: 'High-throughput microservices, sub-millisecond event streaming, and fault-tolerant distributed web and mobile platforms.',
    fullDesc: 'We architect robust mission-critical systems designed to handle millions of concurrent operations with rock-solid consistency, domain-driven boundaries, and zero-defect craftsmanship.',
    deliverables: [
      'High-throughput Go, Node.js & Java microservice suites',
      'Event streaming with Apache Kafka & RabbitMQ',
      'Reactive, accessible modern frontends in React and Next.js',
      'Real-time low-latency WebSocket infrastructure'
    ],
    techStack: ['TypeScript', 'Go', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'Kafka'],
    icon: 'Code2',
    stats: '10M+ Daily Events'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Zero Trust',
    category: 'Security & Compliance',
    shortDesc: 'End-to-end security audits, threat modeling, vulnerability scanning, and automated SOC 2 / ISO 27001 readiness.',
    fullDesc: 'Enterprise-grade proactive defense. We implement identity-aware zero-trust architectures, automated SAST/DAST pipelines, container supply chain integrity, and full regulatory compliance mapping.',
    deliverables: [
      'Comprehensive penetration testing and architecture threat modeling',
      'SOC 2 Type II, ISO 27001, and HIPAA compliance engineering',
      'mTLS service-to-service cryptographic mesh authentication',
      'Automated secret management and key rotation engines'
    ],
    techStack: ['HashiCorp Vault', 'Trivy', 'SonarQube', 'OpenVAS', 'OAuth 2.0 / OIDC', 'WireGuard'],
    icon: 'ShieldCheck',
    stats: '100% Audit Compliance'
  },
  {
    id: 'mobile-crossplatform',
    title: 'Cross-Platform Mobile Apps',
    category: 'Mobile Engineering',
    shortDesc: 'Offline-first, native-performance iOS & Android applications with fluid 60FPS animations and real-time syncing.',
    fullDesc: 'We build enterprise-grade mobile experiences using React Native, Expo, and Flutter, with robust local storage, background sync, biometric authentication, and enterprise MDM compliance.',
    deliverables: [
      'Cross-platform iOS and Android apps with single-codebase velocity',
      'Offline-first sync engines using SQLite and WatermelonDB',
      'Biometric authentication and hardware sensor integrations',
      'App Store Optimization (ASO) and automated Fastlane CI/CD releases'
    ],
    techStack: ['React Native', 'Expo', 'Flutter', 'TypeScript', 'Swift', 'Kotlin', 'SQLite'],
    icon: 'Smartphone',
    stats: '4.9★ App Store Rating'
  },
  {
    id: 'legacy-modernization',
    title: 'Legacy Monolith Modernization',
    category: 'Transformation',
    shortDesc: 'Strangler-fig refactoring, database decompensation, zero-downtime data migration, and technical debt elimination.',
    fullDesc: 'Modernize legacy codebases without betting the business on high-risk complete rewrites. We apply proven strangler-fig migration patterns to iteratively carve out scalable services while maintaining 100% production uptime.',
    deliverables: [
      'Strangler-fig incremental architecture migration plans',
      'Zero-downtime database migrations with dual-write CDC replication',
      'Automated regression testing harnesses for legacy interfaces',
      'Up to 80% decrease in change failure rate and maintenance costs'
    ],
    techStack: ['Debezium', 'Kafka', 'PostgreSQL', 'Docker', 'AWS DMS', 'Vitest'],
    icon: 'RefreshCw',
    stats: 'Zero Production Downtime'
  }
];
