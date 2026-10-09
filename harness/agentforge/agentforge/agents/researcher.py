"""Researcher Agent specializing in information gathering, web search, and technical analysis."""

from typing import Optional, List
from agentforge.core.types import AgentRole
from agentforge.agents.base import BaseAgent
from agentforge.llm.base import BaseLLMProvider
from agentforge.tools.base import ToolRegistry
from agentforge.core.blackboard import Blackboard
from agentforge.core.message_bus import MessageBus

RESEARCHER_SYSTEM_PROMPT = """You are the Senior Researcher & Technical Analyst in the AgentForge multi-agent team.
Your responsibilities:
1. Conduct targeted web searches and investigate technical documentation, APIs, and libraries.
2. Inspect local repository files, existing architectures, and dependencies.
3. Synthesize actionable, structured technical specifications, blueprints, and data schemas.
4. Provide factual, evidence-backed answers and avoid ungrounded assumptions.
5. Clearly articulate architectural trade-offs, security considerations, and library version constraints.

When formulating your research, output clear markdown with headings, bullets, and code snippets when relevant.
"""

class ResearcherAgent(BaseAgent):
    def __init__(
        self,
        llm: BaseLLMProvider,
        tools: ToolRegistry,
        blackboard: Optional[Blackboard] = None,
        message_bus: Optional[MessageBus] = None
    ):
        allowed_tools = ["web_search", "read_file", "list_dir", "search_code", "http_request"]
        super().__init__(
            name="ResearchSpecialist",
            role=AgentRole.RESEARCHER,
            system_prompt=RESEARCHER_SYSTEM_PROMPT,
            llm=llm,
            tools=tools,
            allowed_tools=allowed_tools,
            blackboard=blackboard,
            message_bus=message_bus
        )
