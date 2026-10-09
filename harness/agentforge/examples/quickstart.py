"""Quickstart example for AgentForge multi-agent collaborative framework."""

import asyncio
from agentforge import SwarmOrchestrator, AgentForgeConfig, LLMConfig
from agentforge.llm.factory import LLMProviderFactory
from agentforge.core import AgentEvent, EventType

async def main():
    print("Initializing AgentForge Multi-Agent AI Framework...")

    # Configure Swarm with hybrid provider (defaulting to local Ollama with deepseek-r1:7b)
    config = AgentForgeConfig(
        llm=LLMConfig(
            provider="ollama",
            model="deepseek-r1:7b",
            temperature=0.2
        )
    )

    llm = LLMProviderFactory.create(config.llm)
    orchestrator = SwarmOrchestrator(config=config, llm=llm)

    # Subscribe to live swarm telemetry
    async def on_event(event: AgentEvent):
        print(f"[{event.event_type.value.upper()}] from {event.sender}: {event.payload}")

    orchestrator.message_bus.subscribe(on_event)

    # Mission Objective
    objective = "Design and implement a thread-safe rate limiter in Python with tests and security review."
    print(f"\n--- Launching Mission: {objective} ---\n")

    result = await orchestrator.run(objective)

    print("\n--- Final Executive Synthesis ---")
    print(result["synthesis"])

if __name__ == "__main__":
    asyncio.run(main())
