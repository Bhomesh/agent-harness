# ⚡ Agent Harness & Multi-Agent Swarm Ecosystem

An enterprise-grade, unified agent orchestration framework, multi-agent development swarm, and skill catalog built for high-velocity software engineering, automated testing, and self-healing systems.

---

## 🌟 Key Highlights

- **280+ Specialized Agent Profiles** (`agents/`): Full behavioral system prompts, role boundaries, tool interfaces, and operational guidelines.
- **1,000+ Agent Skills** (`skills/`): Modular capabilities covering fullstack architecture, cloud/DevOps, AI/RAG, 3D graphics, cybersecurity, and testing.
- **High-Velocity Editorial Web Swarm (`velocity-web-architect`)**: Autonomous swarm implementing the luxury editorial web architecture (Forteiva / BuildShift pattern).
- **Closed-Loop Error Healer (`velocity-error-healer`)**: Automated diagnostic agent detecting TypeScript AST errors, prop mismatches, and test failures, applying surgical code patches without human intervention.
- **Antigravity Harness Engine (`harness/`, `bin/`)**: Unified CLI and programmatic runner (`antigravity-harness`, `velocity-swarm`) supporting interactive REPL, single-prompt execution, and benchmark evaluations.
- **Evaluation & Benchmark Suite (`evaluations/`)**: Automated benchmark test suites validating agent invariant compliance, test coverage, and self-healing.

---

## 📂 Repository Structure

```
agent-harness/
├── agents/                     # 280+ system prompt agent specifications (.md)
│   ├── velocity-web-architect.md # Lead editorial web orchestrator
│   ├── velocity-error-healer.md  # Autonomous AST & TypeScript diagnostic healer
│   ├── code_architect.md         # Senior systems architect
│   ├── fullstack_developer.md    # End-to-end fullstack developer
│   └── ...                       # 280+ engineering, data, AI, & ops specialists
├── skills/                     # 1,000+ modular agent skills with SKILL.md specs
│   ├── agency-agents-orchestrator/
│   ├── tdd-workflows-tdd-cycle/
│   ├── debugging-toolkit-smart-debug/
│   └── ...
├── harness/                    # Core orchestration runner engines
│   ├── agentforge/             # Multi-agent framework and execution engine
│   └── velocity-swarm/         # High-velocity web swarm pipeline & test harness
├── bin/                        # Global CLI executables
│   ├── antigravity-harness     # General agent harness runner (run, eval, interactive)
│   └── velocity-swarm          # Velocity swarm orchestrator and scaffold CLI
├── evaluations/                # Automated evaluation suites & benchmarks (.json)
│   ├── velocity_eval_suite.json# 4-stage architectural and healing benchmark
│   └── agent_eval_suite.json   # Token budget, caching, and security eval suite
├── templates/                  # Ready-to-scaffold starter blueprints
│   └── editorial-web/          # Forteiva / BuildShift 10-invariant web template
└── AGENTS.md                   # Complete hierarchy map and engineering guidelines
```

---

## 🚀 Quick Start

### 1. Installation & Environment

Make sure Python 3.10+ and Node.js 18+ are available:

```bash
git clone https://github.com/Bhomesh/agent-harness.git
cd agent-harness

# Add bin/ to your PATH (optional)
export PATH="$PWD/bin:$PATH"
```

### 2. Running the Agent Harness

```bash
# List all available agent profiles
antigravity-harness agents

# Search the 1,000+ skills catalog
antigravity-harness skills search "kubernetes"

# Run an automated benchmark suite
antigravity-harness eval evaluations/velocity_eval_suite.json
```

### 3. Using the High-Velocity Web Swarm

Generate and deploy luxury editorial web platforms conforming to the **10 Invariant Architectural Rules**:

```bash
# 1. Scaffold a fresh template repository
velocity-swarm scaffold /path/to/my-new-site "Acme Cloud Technologies"

# 2. Run the 6-phase autonomous multi-agent pipeline
# (Design tokens -> Content -> SVG Geometry -> Components -> QA -> Vite Build)
velocity-swarm run /path/to/my-new-site "Acme Cloud Technologies"

# 3. Test the automated error-healing engine
velocity-swarm test-heal

# 4. Run the benchmark evaluation
velocity-swarm eval
```

---

## 🏛️ The 10 Invariant Architectural Rules

Every website scaffolded by `velocity-swarm` implements:
1. **Floating Pill Navigation (`.site-nav`)**: Glassmorphic floating pill with hamburger fullscreen overlay menu.
2. **Organic Wave Dividers (`.site-wave`)**: Cubic Bézier curve transitions between light and dark sections.
3. **Double-Sided Pipeline Visualizer (`AboutGraphic`)**: Animated SVG architectural pipeline.
4. **Interactive 6+1 Service Grid**: Bespoke geometric line-art cards with detailed view modals.
5. **3-Lane Infinite Marquee (`.site-problems`)**: Reverse-scrolling pill marquee with hover-pause physics.
6. **Numbered Editorial Section (`01`-`05`)**: High-contrast dark rows, diagonal arrow triggers, and stat counters.
7. **Orbital Constellation (`IndustriesGraphic`)**: SVG multi-ring planetary orbit diagram.
8. **Catmull-Rom Ribbon (`StatementCurve`)**: Exact mathematical spline path with continuous `<textPath>` ribbon.
9. **Interactive Estimation & Consultation Modals**: Multi-step project cost calculator and booking form.
10. **Compliance Suite**: Full Privacy, Terms, Cookies, Security views with cookie consent banner.

---

## 🛡️ Closed-Loop Self-Healing Engine

When a build or test fails:
1. **Trace Analysis**: The `velocity-error-healer` agent inspects stdout/stderr and AST compiler logs.
2. **Root Cause Isolation**: Distinguishes between TypeScript type mismatches, missing props, and assertion drift.
3. **Surgical Patching**: Applies minimal diffs to resolve errors while preserving code integrity.
4. **Re-Verification**: Automatically re-runs QA test suites until 100% green.

---

## 📄 License
MIT License. Built for autonomous agentic workflows and high-craft software engineering.
