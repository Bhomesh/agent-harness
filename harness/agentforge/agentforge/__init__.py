"""AgentForge: Production-grade Collaborative Multi-Agent AI Framework."""

__version__ = "0.1.0"

from agentforge.config import AgentForgeConfig, LLMConfig
from agentforge.core import Blackboard, MessageBus, SubTask, TaskStatus, AgentRole
from agentforge.llm import LLMProviderFactory, OllamaProvider, OpenAIProvider
from agentforge.orchestrator import SwarmOrchestrator
from agentforge.agents import (
    SupervisorAgent,
    ResearcherAgent,
    CoderAgent,
    QAAgent,
    ReviewerAgent
)

__all__ = [
    "AgentForgeConfig",
    "LLMConfig",
    "Blackboard",
    "MessageBus",
    "SubTask",
    "TaskStatus",
    "AgentRole",
    "LLMProviderFactory",
    "OllamaProvider",
    "OpenAIProvider",
    "SwarmOrchestrator",
    "SupervisorAgent",
    "ResearcherAgent",
    "CoderAgent",
    "QAAgent",
    "ReviewerAgent"
]
