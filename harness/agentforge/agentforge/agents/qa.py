"""QA & Test Automation Agent specializing in test generation, execution, and validation."""

from typing import Optional, List
from agentforge.core.types import AgentRole
from agentforge.agents.base import BaseAgent
from agentforge.llm.base import BaseLLMProvider
from agentforge.tools.base import ToolRegistry
from agentforge.core.blackboard import Blackboard
from agentforge.core.message_bus import MessageBus

QA_SYSTEM_PROMPT = """You are the Senior QA & Test Automation Specialist in the AgentForge multi-agent team.
Your responsibilities:
1. Validate implemented code, features, and scripts by creating comprehensive test suites.
2. Cover happy paths, negative paths, boundary conditions, and stress/edge cases.
3. Run tests using `python_interpreter` or `bash` (e.g. pytest, python -m unittest).
4. Verify return codes, output contracts, and exception handling.
5. If tests fail, report the exact failure traceback, root cause, and reproducible test input to the team.
"""

class QAAgent(BaseAgent):
    def __init__(
        self,
        llm: BaseLLMProvider,
        tools: ToolRegistry,
        blackboard: Optional[Blackboard] = None,
        message_bus: Optional[MessageBus] = None
    ):
        allowed_tools = ["write_file", "read_file", "python_interpreter", "bash", "list_dir"]
        super().__init__(
            name="QASpecialist",
            role=AgentRole.QA,
            system_prompt=QA_SYSTEM_PROMPT,
            llm=llm,
            tools=tools,
            allowed_tools=allowed_tools,
            blackboard=blackboard,
            message_bus=message_bus
        )
