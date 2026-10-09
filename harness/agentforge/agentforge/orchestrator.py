"""Multi-Agent Swarm Orchestrator managing collaborative workflows."""

import asyncio
import time
from typing import Dict, Any, List, Optional
from agentforge.config import AgentForgeConfig, default_config
from agentforge.core.types import (
    AgentRole,
    SubTask,
    TaskStatus,
    EventType,
    AgentEvent
)
from agentforge.core.blackboard import Blackboard
from agentforge.core.message_bus import MessageBus
from agentforge.tools import create_default_tool_registry, ToolRegistry
from agentforge.llm.base import BaseLLMProvider
from agentforge.llm.factory import LLMProviderFactory
from agentforge.agents.supervisor import SupervisorAgent
from agentforge.agents.researcher import ResearcherAgent
from agentforge.agents.coder import CoderAgent
from agentforge.agents.qa import QAAgent
from agentforge.agents.reviewer import ReviewerAgent
from agentforge.agents.base import BaseAgent

class SwarmOrchestrator:
    """Coordinates the multi-agent team across planning, execution, verification, and review."""

    def __init__(
        self,
        config: Optional[AgentForgeConfig] = None,
        llm: Optional[BaseLLMProvider] = None,
        tools: Optional[ToolRegistry] = None
    ):
        self.config = config or default_config
        self.blackboard = Blackboard()
        self.message_bus = MessageBus()
        self.tools = tools or create_default_tool_registry()
        self.llm = llm or LLMProviderFactory.create(self.config.llm)

        # Initialize specialized subagents
        self.supervisor = SupervisorAgent(
            llm=self.llm,
            tools=self.tools,
            blackboard=self.blackboard,
            message_bus=self.message_bus
        )
        self.researcher = ResearcherAgent(
            llm=self.llm,
            tools=self.tools,
            blackboard=self.blackboard,
            message_bus=self.message_bus
        )
        self.coder = CoderAgent(
            llm=self.llm,
            tools=self.tools,
            blackboard=self.blackboard,
            message_bus=self.message_bus
        )
        self.qa = QAAgent(
            llm=self.llm,
            tools=self.tools,
            blackboard=self.blackboard,
            message_bus=self.message_bus
        )
        self.reviewer = ReviewerAgent(
            llm=self.llm,
            tools=self.tools,
            blackboard=self.blackboard,
            message_bus=self.message_bus
        )

        self._agent_map: Dict[AgentRole, BaseAgent] = {
            AgentRole.SUPERVISOR: self.supervisor,
            AgentRole.RESEARCHER: self.researcher,
            AgentRole.CODER: self.coder,
            AgentRole.QA: self.qa,
            AgentRole.REVIEWER: self.reviewer,
        }

    async def run(self, objective: str) -> Dict[str, Any]:
        """Runs the collaborative multi-agent workflow for the given user objective."""
        start_time = time.time()
        await self.blackboard.set_objective(objective)

        await self.message_bus.publish(AgentEvent(
            event_type=EventType.TASK_STARTED,
            sender="Orchestrator",
            payload={"objective": objective}
        ))

        # Phase 1: Planning by Supervisor
        subtasks = await self.supervisor.plan_objective(objective)

        # Phase 2: Autonomous DAG Task Execution
        execution_order = []
        while True:
            ready_tasks = await self.blackboard.get_ready_tasks()
            if not ready_tasks:
                all_tasks = await self.blackboard.get_all_tasks()
                # Check if all completed or failed
                incomplete = [t for t in all_tasks if t.status in (TaskStatus.PENDING, TaskStatus.RUNNING)]
                if not incomplete:
                    break
                # Deadlock detection or failed dependency
                blocked = [t for t in all_tasks if t.status == TaskStatus.PENDING]
                if blocked:
                    # Force execute next pending task
                    ready_tasks = [blocked[0]]
                else:
                    break

            for task in ready_tasks:
                await self.blackboard.update_task_status(task.id, TaskStatus.RUNNING)
                agent = self._agent_map.get(task.assigned_to, self.coder)

                try:
                    result = await agent.execute_task(task)
                    execution_order.append({
                        "task_id": task.id,
                        "title": task.title,
                        "agent": agent.name,
                        "role": task.assigned_to.value,
                        "status": "completed",
                        "result_snippet": result[:200]
                    })
                except Exception as e:
                    await self.blackboard.update_task_status(task.id, TaskStatus.FAILED, error=str(e))
                    execution_order.append({
                        "task_id": task.id,
                        "title": task.title,
                        "agent": agent.name,
                        "role": task.assigned_to.value,
                        "status": "failed",
                        "error": str(e)
                    })

        # Phase 3: Final Synthesis
        synthesis = await self.supervisor.synthesize_results(objective)

        total_time = round(time.time() - start_time, 2)
        artifacts = await self.blackboard.list_artifacts()
        all_tasks = await self.blackboard.get_all_tasks()

        await self.message_bus.publish(AgentEvent(
            event_type=EventType.TASK_COMPLETED,
            sender="Orchestrator",
            payload={"objective": objective, "duration_s": total_time}
        ))

        return {
            "objective": objective,
            "duration_seconds": total_time,
            "synthesis": synthesis,
            "tasks": [t.model_dump() for t in all_tasks],
            "artifacts": [a.model_dump() for a in artifacts],
            "execution_order": execution_order
        }
