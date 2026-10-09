# Antigravity Agent Guidelines & Development Team Hierarchy

## 1. Development Subagents & Roles (22 Specialized Agents across 4 Divisions)

When tackling software engineering tasks, the primary agent coordinates with specialized subagents:

### Core Engineering & Ideation
- **`project_ideator`**: High-impact software concept ideation, technical blueprints, feature scoping, and Antigravity execution roadmaps.
- **`code_architect`**: System design, high-level architecture, module decomposition, and API contracts.
- **`aesthetic_ui_architect`**: Art direction, simulated OS environments (Win95/98/XP/7/11, Mac OS, GNOME), cyberpunk HUDs, neobrutalism, glassmorphism, neumorphism, claymorphism, and responsive motion web designs.
- **`fullstack_developer`**: Feature implementation across frontend, backend, databases, and third-party integrations.
- **`frontend_specialist`**: Modern UI/UX, React, Next.js, Vue, Tailwind CSS, accessibility (WCAG), and responsive interfaces.
- **`backend_specialist`**: High-performance microservices, REST/gRPC/GraphQL APIs, async queues (Redis, BullMQ, Celery), caching.
- **`mobile_developer`**: Cross-platform mobile development (React Native, Expo, Flutter), mobile UI, offline-first sync.

### Data, Storage & AI
- **`database_architect`**: SQL/NoSQL schema modeling, zero-downtime migrations, index optimization, query execution plans.
- **`data_engineer`**: Batch & streaming data pipelines (Kafka, Spark, Airflow, dbt), warehousing, and Parquet/Iceberg storage.
- **`ai_rag_engineer`**: LLM orchestration, vector databases (pgvector, Chroma, Qdrant), semantic search, and prompt engineering.

### Quality, Security & Operations
- **`qa_test_engineer`**: Test harness setup, unit/integration/E2E test suite generation, and edge-case regression validation.
- **`debugger_specialist`**: Deep root-cause debugging, race condition isolation, memory leak profiling, and crash dump analysis.
- **`security_auditor`**: OWASP vulnerability assessment, secret detection, and safe dependency management.
- **`devops_engineer`**: CI/CD pipelines, Docker containerization, Linux services, and deployment workflows.
- **`documentation_writer`**: OpenAPI specifications, architecture decision records (ADRs), developer onboarding, and guides.

### High-Velocity Editorial Web Swarm (Forteiva / BuildShift Architecture)
- **`velocity-web-architect`**: Lead orchestrator for luxury-grade editorial web platforms. Coordinates theme tokens, content synthesis, SVG mathematics, component assembly, closed-loop QA, and Vercel release.
- **`velocity-error-healer`**: Autonomous root-cause diagnostic and self-healing agent specializing in TypeScript AST errors, missing props, and automated test regression recovery.
- **`design_tokens_engineer`**: Color palette, fluid gradient systems, and WCAG contrast token generator.
- **`content_narrative_synthesizer`**: Structured data and domain narrative architect (`siteData.ts`, `legalData.ts`).
- **`svg_geometry_architect`**: Computational vector math, Catmull-Rom spline curves, and orbital constellations.
- **`component_assembler`**: Modular React assembler for the 10 Invariant architectural components.
- **`qa_verification_specialist`**: Comprehensive test gatekeeper executing Vitest and AST integrity suites.
- **`release_devops_engineer`**: Production build packager and live Vercel cloud deployment auditor.

### 3D Graphics & Spatial Web (7 Specialized Agents)
- **`3d_web_architect`**: Lead spatial computing and 3D web systems architect. Owns end-to-end 3D stack selection, framework integration (Three.js, R3F, Threlte, TresJS, Babylon.js, WebGPU/TSL, 3DGS), scene decomposition, and performance budgeting.
- **`scene_architect`**: Viewport composition, camera frustum calculations, dynamic Box3 bounding sphere responsive auto-framing math, HDR lighting, and resilient WebGL context loss recovery without unmounting.
- **`shader_vfx_specialist`**: Custom GLSL ShaderMaterials with mobile precision guards, Three Shading Language (TSL) node graphs for WebGPU/WGSL, GPGPU compute particles, and post-processing pipelines.
- **`interaction_physics_specialist`**: Camera choreography with forward tangent look-ahead, Lenis smooth scroll bindings, GSAP ScrollTrigger timelines, and Rapier WASM physics integration.
- **`asset_pipeline_optimizer`**: Model preparation, multi-step glTF decimation (`gltf-transform simplify` followed by `optimize`), Meshopt/KTX2 transcoding, LOD hierarchies, and draw call reduction (`InstancedMesh`, `BatchedMesh`).
- **`a11y_fallback_specialist`**: WCAG accessibility for WebGL canvases, screen-reader DOM mirroring, keyboard navigation rigs, `prefers-reduced-motion` dampening, and GPU Tier 0 static WebP fallbacks.
- **`webgl_qa_auditor`**: Static AST rule enforcement (the 10 Invariant Code Rules), headless SwiftShader browser test harness, zero console errors/warnings gating, and framebuffer non-black readback.

## 2. Global Skills Integration

Over 750+ specialized Agent Skills are installed globally at `~/.gemini/config/skills/` and registered in `~/.gemini/config/skills.json`.
Agents can leverage on-demand progressive disclosure:
- Check `SKILL.md` in any skill directory to load procedural knowledge for specific frameworks, tools, or workflows.
- Never duplicate procedures that already exist in skills.

## 3. Harness & Evaluation Capabilities

The system includes the **Antigravity Harness** CLI:
- Run programmatic agent sessions: `antigravity-harness run "<prompt>"`
- Run interactive REPL: `antigravity-harness interactive`
- Run automated benchmarks & test suites: `antigravity-harness eval <suite.json>`
- Search available skills: `antigravity-harness skills search <keyword>`
- List available agents: `antigravity-harness agents`

<!-- graft:start -->
## Graft — repo context graph

This repo is indexed in `graft/`: small linked markdown nodes that explain each
system and carry exact file:line spans, kept in sync with the code through git.

For ANY task here — understanding how something works, finding where code lives,
or scoping a change — get context from the graph before grepping or opening
source files. Re-ask freely (it's cheap) and reuse literal identifiers you
already have (symbol, error string, file name) as the query. New to this repo?
Run `graft map` first — a token-budgeted orientation (dir clusters, hubs,
hotspots), no LLM, no key.

- Run `graft ask "<your question>" --source` → ranked nodes with the relevant
  code spans inlined (each hit's ≤8-line crux by default; `--full` for whole
  definitions when the crux isn't enough). Match the tool to the task shape:
  for understanding or editing, the top node IS the answer — cite its
  `covers:` file:line spans and edit straight from `--source`. For
  exhaustive tasks ("every occurrence / every caller of this pattern"), ranked
  results are top-N, not complete — run `graft grep "<literal>"` instead
  (exhaustive over indexed files, grouped by enclosing symbol), falling back
  to raw `grep -rn` only for unindexed files.
- `graft skeleton <file>` → every definition's signature + span, ~10× cheaper
  than reading the file; use it to skim an API surface.
- `graft callers <symbol>` gives precomputed, exact edges — who calls this.
  Add `--direction out` for what it calls, or `--depth N` to walk
  transitively for the full blast radius. For structural questions, skip
  ranking and use this directly.
- Or browse: `graft/INDEX.md` lists every node; follow the links.
- Monorepos and folders of multiple repos rank fairly across sub-projects —
  hits carry `[scope/]` labels naming which one they're from. Narrow with
  `graft ask "<task>" --in <scope>/` once you know where you're working.

If a returned span is truncated ("+N more lines"), open the file at that exact
range before finalizing. Only open source files when a node genuinely lacks a
needed detail, and then at the exact file:line the node points to — never
re-read whole files.

After big code changes, refresh the graph with `graft build` (deterministic,
no API key, $0).
<!-- graft:end -->
