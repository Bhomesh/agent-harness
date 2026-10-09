# ⚡ AgentForge: Autonomous Collaborative Multi-Agent AI Framework

**AgentForge** is an extensible, production-grade multi-agent AI framework designed for complex software engineering and problem-solving missions. It combines autonomous reasoning loops (ReAct), a shared Blackboard memory architecture, an asynchronous event bus, sandboxed tool execution, and hybrid LLM support (**Local Ollama** + **Cloud APIs**).

---

## 🌟 Key Architecture & Features

### 1. Collaborative Multi-Agent Team (Swarm Mesh)
- 👑 **Supervisor Agent (`TeamSupervisor`)**: Decomposes high-level objectives into dependency-linked DAG subtasks, schedules task execution, monitors progress, and synthesizes the final executive mission report.
- 🔬 **Researcher Agent (`ResearchSpecialist`)**: Performs web searches, code repository inspection, documentation discovery, and technical blueprint design.
- 💻 **Coder Agent (`CodeEngineer`)**: Writes clean, modular, typed production code and script files directly to disk.
- 🧪 **QA Agent (`QASpecialist`)**: Crafts automated unit/integration test suites (pytest/unittest), executes them in real-time, and validates edge cases and crash resilience.
- 🛡️ **Reviewer Agent (`SecurityReviewer`)**: Audits implementations against OWASP Top 10 vulnerabilities, validates code design, checks time complexity, and enforces quality gates.

### 2. Hybrid LLM Backend (Local + Cloud)
- **Local Ollama**: Out-of-the-box native support for models like `deepseek-r1:7b`, `llama3`, and `qwen2.5`. Automatically parses reasoning blocks (`<think>...</think>`) and handles tool calls.
- **OpenAI Compatible**: Supports GPT-4o, Groq, OpenRouter, DeepSeek API, and vLLM.
- **Google Gemini**: Direct REST integration with `gemini-2.0-flash` / `gemini-1.5-pro`.
- **Anthropic Claude**: Full support for Claude 3.5 Sonnet / Haiku.
- **Auto-detection & Fallback**: Automatically connects to local Ollama if no cloud API keys are present.

### 3. Integrated Tool Execution Engine
- ⚡ **`bash`**: Asynchronous shell execution with timeout and returncode capture.
- 📁 **`read_file` / `write_file` / `list_dir` / `search_code`**: Full repository inspection and authoring tools.
- 🐍 **`python_interpreter`**: Runs Python code snippets in isolated subprocesses.
- 🌐 **`web_search`**: Live web information gathering and search snippet extraction.
- 🔗 **`http_request`**: Direct REST/HTTP endpoint querying.

### 4. Shared Blackboard & Event Bus
- Thread-safe **Blackboard** tracks artifacts, subtasks, DAG dependencies, and shared key-value context.
- High-throughput **MessageBus** broadcasts live telemetry (`TASK_STARTED`, `AGENT_THINKING`, `TOOL_STARTED`, `TOOL_FINISHED`, `TASK_COMPLETED`) to CLI and Web clients.

---

## 🚀 Quick Start

### Installation

AgentForge runs in its dedicated virtual environment:
```bash
cd /home/manjaro/agentforge
source .venv/bin/activate
pip install -e .
```

---

## 🖥️ Command-Line Interface (CLI)

### 1. Execute an Objective via CLI
Run a mission using your local Ollama model (`deepseek-r1:7b`):
```bash
agentforge run "Build a resilient LRU cache in Python with thread-safety and unit tests"
```

Run with OpenAI, Gemini, or Claude:
```bash
# Using OpenAI
OPENAI_API_KEY="your-key" agentforge run "Create a JWT auth middleware" --provider openai --model gpt-4o

# Using Google Gemini
GEMINI_API_KEY="your-key" agentforge run "Create a Redis pub/sub client" --provider gemini --model gemini-2.0-flash
```

### 2. Interactive REPL Mode
```bash
agentforge interactive
```

### 3. Web Dashboard Mode
Launch the real-time Glassmorphism Web UI:
```bash
agentforge web --port 8000
```
Open your browser at `http://localhost:8000` to monitor active agents, live telemetry logs via WebSockets, and mission synthesis reports.

---

## 💻 Programmatic Python API

```python
import asyncio
from agentforge import SwarmOrchestrator, AgentForgeConfig, LLMConfig
from agentforge.llm.factory import LLMProviderFactory

async def main():
    # Configure Swarm
    config = AgentForgeConfig(
        llm=LLMConfig(provider="ollama", model="deepseek-r1:7b")
    )
    llm = LLMProviderFactory.create(config.llm)
    orchestrator = SwarmOrchestrator(config=config, llm=llm)

    # Run multi-agent mission
    result = await orchestrator.run("Design and implement an async token bucket rate limiter")
    print(result["synthesis"])

if __name__ == "__main__":
    asyncio.run(main())
```

---

## 🧪 Running Automated Tests

Run the full pytest suite:
```bash
/home/manjaro/agentforge/.venv/bin/pytest /home/manjaro/agentforge/tests -v
```
All 9 unit and integration tests verify tool execution, blackboard memory DAG resolution, Ollama/OpenAI provider factories, and end-to-end swarm orchestration.
