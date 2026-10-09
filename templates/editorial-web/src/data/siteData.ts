export interface NavLink {
  label: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  icon: 'team' | 'extend' | 'code' | 'cloud' | 'data' | 'speed';
  title: string;
  description: string;
  benefits: string[];
  technologies: string[];
  href: string;
}

export interface ProblemItem {
  label: string;
  tone: 'yellow' | 'lav' | 'lav2' | 'peach' | 'mint';
}

export interface WwdItem {
  num: string;
  title: string;
  text: string;
  deliverables?: string[];
}

export interface IndustryItem {
  icon: 'bank' | 'health' | 'cart' | 'factory' | 'truck' | 'cap';
  label: string;
  highlight: string;
}

export const siteConfig = {
  name: 'BuildShift Technologies',
  short: 'BuildShift',
  logo: '/logo.svg',
  tagline: 'Relentless Engineering. Swift Delivery.',
  hero: {
    eyebrow: 'Scalable. Reliable. Limitless.',
    title: 'Building Smarter Businesses Through High-Velocity Engineering & Cloud Innovation',
    text: 'BuildShift Technologies is a trusted technology partner delivering innovative IT solutions, cloud architecture, and dedicated offshore engineering teams to businesses worldwide.',
    cta: { label: 'Discover Our Services', href: '#services' },
  },
  about: {
    titleLines: ['Relentless Velocity,', 'Modern Architecture,', 'Engineering at Scale'],
    paragraphs: [
      'We help organisations accelerate digital transformation with highly skilled engineering teams, cloud-native architecture and scalable software development services. From product discovery and application development to cloud migration, DevOps automation, data platforms and applied AI, we cover every step of the delivery lifecycle.',
      'Leading with modern tooling, automation and hard-won operational experience, we ship with speed and precision. Whether you need an end-to-end partner or extra capacity at a few points along the way, we are built to plug in.',
    ],
    subhead: 'Engineering Without Limits',
    subcopy: 'We build the platforms, pipelines and teams that give engineering organisations the confidence to ship — turning complex delivery into a routine, repeatable thing.',
    closing: 'We embed with your teams, learn your domain, and use that context in ways an outside vendor cannot — solving the delivery problems behind the roadmap, not just the tickets on it.',
  },
  services: [
    {
      id: 'offshore-teams',
      icon: 'team',
      title: 'DEDICATED OFFSHORE\nDEVELOPMENT TEAMS',
      description: 'Access pre-vetted senior software engineers, cloud architects, DevOps practitioners and full-stack squads based in our state-of-the-art Jaipur innovation center. Fully integrated with your timezone and agile rituals.',
      benefits: ['Zero recruiting overhead', 'Overlapping global timezone coverage', '100% dedicated talent'],
      technologies: ['TypeScript', 'Go', 'Python', 'React', 'Swift', 'Kotlin'],
      href: '#contact',
    },
    {
      id: 'team-extension',
      icon: 'extend',
      title: 'TEAM EXTENSION &\nENGINEERING CAPACITY',
      description: 'Quickly scale your existing engineering pods with specialized senior talent for critical sprints, major architectural pivots, or high-urgency product roadmaps without lengthy hiring cycles.',
      benefits: ['Deploy talent within 72 hours', 'Elastic scale up or down', 'Domain-specific expertise'],
      technologies: ['Kubernetes', 'AWS/GCP', 'PostgreSQL', 'GraphQL', 'Terraform'],
      href: '#contact',
    },
    {
      id: 'software-dev',
      icon: 'code',
      title: 'ENTERPRISE SOFTWARE\nDEVELOPMENT',
      description: 'Design and build resilient, distributed web, mobile and enterprise systems engineered for millions of concurrent users, strict uptime SLAs, and frictionless user experiences.',
      benefits: ['Clean modular architecture', 'Full-cycle automated testing', 'Production-grade telemetry'],
      technologies: ['React/Next.js', 'Node.js', 'NestJS', 'FastAPI', 'SwiftUI'],
      href: '#contact',
    },
    {
      id: 'cloud-devops',
      icon: 'cloud',
      title: 'CLOUD & DEVOPS\nSOLUTIONS',
      description: 'Accelerate cycle time from commit to production through GitOps pipelines, Infrastructure as Code, Kubernetes orchestration, zero-downtime releases, and comprehensive FinOps cost optimization.',
      benefits: ['Sub-15min CI/CD build times', 'Multi-region disaster recovery', '30-40% cloud cost reduction'],
      technologies: ['Terraform', 'ArgoCD', 'Docker', 'AWS EKS', 'Prometheus', 'Datadog'],
      href: '#contact',
    },
    {
      id: 'data-ai',
      icon: 'data',
      title: 'DATA ENGINEERING &\nAI SOLUTIONS',
      description: 'Turn unstructured company data into high-value operational intelligence with real-time streaming pipelines, analytics lakes, custom LLM fine-tuning, and production RAG agents.',
      benefits: ['Sub-second vector retrieval', 'Zero-downtime ETL pipelines', 'Enterprise security & governance'],
      technologies: ['Kafka', 'Snowflake', 'dbt', 'PyTorch', 'LangChain', 'pgvector'],
      href: '#contact',
    },
    {
      id: 'swift-arch',
      icon: 'speed',
      title: 'PERFORMANCE &\nSWIFT ARCHITECTURE',
      description: 'Ultra-low latency system profiling, native Apple ecosystem & iOS Swift acceleration, microservices decoupling, and high-throughput query optimization for mission-critical operations.',
      benefits: ['Sub-50ms p99 latency', 'Native SwiftUI & cross-platform', 'Thread-safe concurrent systems'],
      technologies: ['Swift', 'Rust', 'Redis', 'WebAssembly', 'gRPC', 'eBPF'],
      href: '#contact',
    },
  ] as ServiceItem[],
  seeAll: {
    text: 'Discover our full suite of interconnected engineering services!',
    cta: { label: 'See All Services', href: '#contact' },
  },
  problems: [
    { label: 'Slow Release Cycles', tone: 'yellow' },
    { label: 'Rising Cloud Costs', tone: 'lav' },
    { label: 'Legacy Modernisation', tone: 'peach' },
    { label: 'Scaling Engineering Teams', tone: 'mint' },
    { label: 'Fragmented Data', tone: 'lav2' },
    { label: 'Manual Infrastructure', tone: 'mint' },
    { label: 'Unreliable Deployments', tone: 'yellow' },
    { label: 'Security & Compliance Gaps', tone: 'peach' },
    { label: 'Talent Shortages', tone: 'lav' },
    { label: 'Fragile Integrations', tone: 'mint' },
    { label: 'Architectural Bottlenecks', tone: 'lav2' },
    { label: 'Developer Burnout', tone: 'yellow' },
  ] as ProblemItem[],
  whatWeDo: {
    eyebrow: 'What We Do',
    title: 'Solutions designed to move complex work forward.',
    note: 'From software delivery to cloud transformation, our services connect engineering talent with modern technology.',
    items: [
      {
        num: '01',
        title: 'Dedicated Offshore Development Teams',
        text: 'Access experienced software engineers, cloud specialists, DevOps engineers and data professionals who seamlessly integrate with your existing team.',
      },
      {
        num: '02',
        title: 'Team Extension',
        text: 'Quickly expand your engineering capabilities with skilled professionals for both short-term projects and long-term strategic engagements.',
      },
      {
        num: '03',
        title: 'Software Development',
        text: 'Design and develop secure, scalable and high-performance web, mobile and enterprise applications using modern technologies and best practices.',
      },
      {
        num: '04',
        title: 'Cloud & DevOps',
        text: 'Accelerate software delivery through cloud-native architectures, CI/CD automation, Infrastructure as Code, Kubernetes, containerization, monitoring and cloud optimization.',
      },
      {
        num: '05',
        title: 'Data Engineering & AI',
        text: 'Transform data into actionable insights with modern data platforms, analytics, machine learning and Generative AI solutions that drive smarter decisions.',
      },
    ] as WwdItem[],
    stats: [
      { value: '250+', label: 'Projects Delivered' },
      { value: '120+', label: 'Happy Clients' },
      { value: '80+', label: 'Expert Engineers' },
      { value: '15+ countries,', label: '99% client satisfaction' },
    ],
    partners: [
      'World Wide Technologies',
      'CVS Health',
      'Volkswagen',
      'BMW',
      'ABSA Group',
      'Croma',
      'Adobe',
      'Walmart',
      'Optum',
      'American Express',
    ],
  },
  industries: {
    title: 'Built for Every Industry',
    text: 'We bring domain-aware engineering to regulated, high-volume and fast-moving sectors — pairing modern architecture with the compliance, reliability and scale each one demands.',
    cta: { label: 'Talk to an Expert', href: '#contact' },
    items: [
      { icon: 'bank', label: 'Banking & Finance', highlight: 'SOC2 & PCI-DSS Compliant Microservices' },
      { icon: 'health', label: 'Healthcare & Life Sciences', highlight: 'HIPAA & HL7/FHIR Healthtech' },
      { icon: 'cart', label: 'Retail & E-commerce', highlight: 'High-Concurrency Headless Commerce' },
      { icon: 'factory', label: 'Manufacturing & Industrial IoT', highlight: 'Real-Time Edge Telemetry' },
      { icon: 'truck', label: 'Logistics & Supply Chain', highlight: 'Dynamic Fleet Routing & Tracking' },
      { icon: 'cap', label: 'Education & Enterprise EdTech', highlight: 'Interactive Learning & Assessment Platforms' },
    ] as IndustryItem[],
  },
  statementWords: ['Relentless Innovation', 'Modern Solutions', 'High Velocity', 'BuildShift'],
  careers: {
    titleLines: ['Join the BuildShift', 'Team'],
    text: 'Discover why engineers stay at BuildShift Technologies — deep technical work, flexible engagement models and long-term partnerships with the teams we build for.',
    cta: { label: 'Learn More', href: '#contact' },
    chips: [
      'Cloud-native & DevOps expertise',
      'Agile delivery methodology',
      'Flexible engagement models',
      'Quality, security & scalability',
    ],
  },
  contact: {
    title: 'Connect with BuildShift',
    text: 'Questions? Reach out to learn how our engineering teams can accelerate your roadmap.',
    cta: { label: 'Contact Our Team', href: '/contact' },
    phone: '+91 141 358 9920',
    email: 'contact@buildswift.in',
    address: 'Tower B, 4th Floor, World Trade Park (WTP), Malviya Nagar & Sitapura IT Park, Jaipur, Rajasthan 302017',
    hours: 'Mon - Fri: 9:00 AM - 6:00 PM IST',
  },
  subhero: {
    eyebrow: 'Contact',
    title: 'Let us talk about your roadmap.',
    lead: 'Tell us what you are building and we will put the right engineers in front of you — usually within one working day.',
  },
  socials: [
    { name: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/company/buildswift' },
    { name: 'GitHub', icon: 'github', href: 'https://github.com/buildswift' },
    { name: 'Twitter', icon: 'twitter', href: 'https://twitter.com/buildswift' },
    { name: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/buildswift' },
  ],
  footerLinks: [
    {
      heading: 'Company',
      links: [
        { label: 'About Us', href: '#about' },
        { label: 'Our Mission', href: '#about' },
        { label: 'What We Do', href: '#what-we-do' },
        { label: 'Industries', href: '#industries' },
        { label: 'Careers', href: '#careers' },
      ],
    },
    {
      heading: 'Services',
      links: [
        { label: 'Dedicated Offshore Teams', href: '#services' },
        { label: 'Team Extension', href: '#services' },
        { label: 'Software Development', href: '#services' },
        { label: 'Cloud & DevOps', href: '#services' },
        { label: 'Data Engineering & AI', href: '#services' },
        { label: 'Swift Performance', href: '#services' },
      ],
    },
    {
      heading: 'Industries',
      links: [
        { label: 'Banking & Finance', href: '#industries' },
        { label: 'Healthcare', href: '#industries' },
        { label: 'Retail & E-commerce', href: '#industries' },
        { label: 'Manufacturing', href: '#industries' },
      ],
    },
    {
      heading: 'Support',
      links: [
        { label: 'Contact Us', href: '/contact' },
        { label: '+91 141 358 9920', href: 'tel:+911413589920' },
        { label: 'contact@buildswift.in', href: 'mailto:contact@buildswift.in' },
      ],
    },
  ],
};
