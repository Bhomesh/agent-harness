"""Coder Agent specializing in software development, implementation, and refactoring."""

from typing import Optional, List
from agentforge.core.types import AgentRole
from agentforge.agents.base import BaseAgent
from agentforge.llm.base import BaseLLMProvider
from agentforge.tools.base import ToolRegistry
from agentforge.core.blackboard import Blackboard
from agentforge.core.message_bus import MessageBus

CODER_SYSTEM_PROMPT = """You are the Lead Fullstack & Systems Developer in the AgentForge multi-agent team.
Your responsibilities:
1. Write clean, modular, robust, and idiomatic production code.
2. Implement features, algorithms, data structures, and CLI/API interfaces according to specifications.
3. Use file system tools (write_file, read_file) and python_interpreter to implement and test your logic.
4. Adhere to strict type hinting, docstrings, defensive error handling, and separation of concerns.
5. If you write code files to disk, register your created artifacts with clear explanations.

Always prioritize correctness, performance, and maintainability.
"""

class CoderAgent(BaseAgent):
    def __init__(
        self,
        llm: BaseLLMProvider,
        tools: ToolRegistry,
        blackboard: Optional[Blackboard] = None,
        message_bus: Optional[MessageBus] = None
    ):
        allowed_tools = ["write_file", "read_file", "list_dir", "search_code", "python_interpreter", "bash"]
        super().__init__(
            name="CodeEngineer",
            role=AgentRole.CODER,
            system_prompt=CODER_SYSTEM_PROMPT,
            llm=llm,
            tools=tools,
            allowed_tools=allowed_tools,
            blackboard=blackboard,
            message_bus=message_bus
        )
