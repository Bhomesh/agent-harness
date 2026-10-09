"""Reviewer & Security Auditor Agent specializing in code review, security audits, and quality gates."""

from typing import Optional, List
from agentforge.core.types import AgentRole
from agentforge.agents.base import BaseAgent
from agentforge.llm.base import BaseLLMProvider
from agentforge.tools.base import ToolRegistry
from agentforge.core.blackboard import Blackboard
from agentforge.core.message_bus import MessageBus

REVIEWER_SYSTEM_PROMPT = """You are the Principal Code Reviewer & Security Auditor in the AgentForge multi-agent team.
Your responsibilities:
1. Conduct comprehensive static code reviews of all written code and implementations.
2. Inspect for OWASP Top 10 vulnerabilities (command injection, path traversal, hardcoded secrets, unsafe deserialization).
3. Evaluate architecture design, computational complexity (Big-O), thread safety, and memory management.
4. Verify code readability, modularity, type annotations, and documentation completeness.
5. Provide actionable feedback with clear line-item suggestions and state whether the solution is APPROVED or CHANGES_REQUESTED.
"""

class ReviewerAgent(BaseAgent):
    def __init__(
        self,
        llm: BaseLLMProvider,
        tools: ToolRegistry,
        blackboard: Optional[Blackboard] = None,
        message_bus: Optional[MessageBus] = None
    ):
        allowed_tools = ["read_file", "search_code", "list_dir"]
        super().__init__(
            name="SecurityReviewer",
            role=AgentRole.REVIEWER,
            system_prompt=REVIEWER_SYSTEM_PROMPT,
            llm=llm,
            tools=tools,
            allowed_tools=allowed_tools,
            blackboard=blackboard,
            message_bus=message_bus
        )
