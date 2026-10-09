import { TechItem } from '../types';

export const techStackData: TechItem[] = [
  // Cloud & DevOps
  {
    name: 'Kubernetes',
    category: 'cloud',
    icon: 'Layers',
    description: 'Enterprise container orchestration with declarative rollouts and self-healing topologies.',
    proficiency: 98,
    enterpriseUse: 'Production clusters handling 50k+ pods across AWS EKS & Google Cloud GKE.'
  },
  {
    name: 'Terraform',
    category: 'cloud',
    icon: 'Terminal',
    description: 'Infrastructure as Code ensuring immutable, reproducible multi-cloud environments.',
    proficiency: 96,
    enterpriseUse: 'Automated drift detection, zero-touch ephemeral preview environments.'
  },
  {
    name: 'AWS Cloud',
    category: 'cloud',
    icon: 'Cloud',
    description: 'Advanced AWS infrastructure engineering (ECS, Lambda, RDS Aurora, S3, CloudFront).',
    proficiency: 99,
    enterpriseUse: 'Certified partner architectures with Well-Architected Framework compliance.'
  },
  {
    name: 'Docker',
    category: 'cloud',
    icon: 'Box',
    description: 'Hardened, multi-stage, rootless container images with minimal attack surfaces.',
    proficiency: 99,
    enterpriseUse: 'Distroless production containers with SBOM generation and CVE scanning.'
  },

  // Backend
  {
    name: 'Go (Golang)',
    category: 'backend',
    icon: 'Zap',
    description: 'High-concurrency microservices, sub-millisecond execution, low memory overhead.',
    proficiency: 95,
    enterpriseUse: 'Financial payment routing and IoT telemetry processing engines.'
  },
  {
    name: 'Node.js & TypeScript',
    category: 'backend',
    icon: 'Code',
    description: 'Enterprise REST, gRPC & GraphQL services with end-to-end type safety.',
    proficiency: 98,
    enterpriseUse: 'High-velocity backend services with NestJS and Fastify.'
  },
  {
    name: 'PostgreSQL',
    category: 'backend',
    icon: 'Database',
    description: 'Enterprise relational data modeling with pgvector, partitioning, and read replicas.',
    proficiency: 97,
    enterpriseUse: 'ACID transactions, petabyte-scale multi-tenant schema isolation.'
  },
  {
    name: 'Apache Kafka',
    category: 'backend',
    icon: 'Activity',
    description: 'Distributed event log for event-driven microservices and real-time CDC.',
    proficiency: 94,
    enterpriseUse: 'Processing 15M+ events per day for smart city logistics.'
  },

  // AI & Data
  {
    name: 'LangGraph & LangChain',
    category: 'ai',
    icon: 'GitBranch',
    description: 'Stateful, cyclic multi-agent AI workflows and deterministic tool calling.',
    proficiency: 96,
    enterpriseUse: 'Autonomous code audit agents and customer enterprise knowledge systems.'
  },
  {
    name: 'Qdrant & pgvector',
    category: 'ai',
    icon: 'Compass',
    description: 'High-dimensional semantic vector indexing with sub-10ms similarity search.',
    proficiency: 94,
    enterpriseUse: 'Secure enterprise internal document search over millions of PDFs.'
  },
  {
    name: 'vLLM & Local LLMs',
    category: 'ai',
    icon: 'Cpu',
    description: 'PagedAttention high-throughput self-hosted inference for private data models.',
    proficiency: 92,
    enterpriseUse: 'Air-gapped on-premise AI deployments protecting intellectual property.'
  },

  // Frontend
  {
    name: 'React 18 & Next.js',
    category: 'frontend',
    icon: 'Layout',
    description: 'Server components, edge rendering, ultra-responsive modern user interfaces.',
    proficiency: 99,
    enterpriseUse: 'Global SaaS enterprise portals with 100/100 Lighthouse performance.'
  },
  {
    name: 'Tailwind CSS',
    category: 'frontend',
    icon: 'Palette',
    description: 'Atomic design system implementation, token-based theming, zero runtime overhead.',
    proficiency: 99,
    enterpriseUse: 'Design tokens shared across 12 enterprise micro-frontends.'
  },
  {
    name: 'React Native',
    category: 'frontend',
    icon: 'Smartphone',
    description: 'Unified cross-platform native iOS & Android applications with native modules.',
    proficiency: 95,
    enterpriseUse: 'Consumer and field-operations apps running on 500k+ active devices.'
  },

  // Security
  {
    name: 'Zero Trust & OAuth2/OIDC',
    category: 'security',
    icon: 'Key',
    description: 'Identity-first microsegmentation, continuous authentication, RBAC & ABAC.',
    proficiency: 96,
    enterpriseUse: 'SOC 2 Type II compliant identity providers with hardware token enforcement.'
  },
  {
    name: 'HashiCorp Vault',
    category: 'security',
    icon: 'Lock',
    description: 'Centralized dynamic secret management, automated PKI, encryption as a service.',
    proficiency: 94,
    enterpriseUse: 'Ephemeral credentials with automatic 1-hour rotation cycles.'
  }
];
