"""Supervisor & Orchestrator Agent for multi-agent planning, delegation, and result synthesis."""

import json
import re
from typing import List, Optional, Dict, Any
from agentforge.core.types import (
    AgentRole,
    SubTask,
    TaskStatus,
    EventType,
    Message,
    LLMResponse
)
from agentforge.agents.base import BaseAgent
from agentforge.llm.base import BaseLLMProvider
from agentforge.tools.base import ToolRegistry
from agentforge.core.blackboard import Blackboard
from agentforge.core.message_bus import MessageBus

SUPERVISOR_PLAN_PROMPT = """You are the Lead Project Supervisor & Architect of the AgentForge autonomous multi-agent system.
Your job is to take a high-level objective and decompose it into a clean, sequential/parallel execution plan for your specialized subagents:
- `researcher`: Conducts technical research, API exploration, architecture planning, and gathering specifications.
- `coder`: Implements features, writes source code, scripts, and algorithms.
- `qa`: Creates and runs tests (pytest, unit tests, sanity checks) to verify the code works properly.
- `reviewer`: Audits the final code for security, best practices, edge cases, and performance.

Given the user objective below, generate a JSON array of subtasks. Each task must have:
- `title`: Short title
- `description`: Detailed task instructions for the specialist
- `assigned_to`: One of ["researcher", "coder", "qa", "reviewer"]
- `dependencies`: List of preceding subtask indices or empty list []

Return ONLY the JSON array enclosed in a ```json codeblock.
Objective: {objective}
"""

SUPERVISOR_SYNTHESIS_PROMPT = """You are the Lead Project Supervisor. Your multi-agent team has completed their tasks for the objective:
"{objective}"

Here are the results and artifacts produced by your team:
{blackboard_state}

Synthesize a comprehensive, executive final report for the user. Summarize:
1. Executive Summary & Accomplishments
2. Architecture & Implementation Details
3. Test Results & Verification
4. Security & Code Review Assessment
5. Usage instructions / How to run
"""

class SupervisorAgent(BaseAgent):
    def __init__(
        self,
        llm: BaseLLMProvider,
        tools: ToolRegistry,
        blackboard: Optional[Blackboard] = None,
        message_bus: Optional[MessageBus] = None
    ):
        super().__init__(
            name="TeamSupervisor",
            role=AgentRole.SUPERVISOR,
            system_prompt="You are the Lead Supervisor orchestrating an autonomous multi-agent engineering team.",
            llm=llm,
            tools=tools,
            allowed_tools=["read_file", "list_dir"],
            blackboard=blackboard,
            message_bus=message_bus
        )

    async def plan_objective(self, objective: str) -> List[SubTask]:
        """Decomposes user objective into structured SubTasks."""
        prompt = SUPERVISOR_PLAN_PROMPT.format(objective=objective)
        
        await self.emit_event(
            EventType.AGENT_THINKING,
            {"stage": "planning", "message": f"Decomposing objective: '{objective}'"}
        )

        response: LLMResponse = await self.llm.generate(
            messages=[Message(role="user", content=prompt)],
            system_prompt=self.system_prompt
        )

        raw = response.content
        subtasks: List[SubTask] = []

        # Extract JSON from markdown
        json_match = re.search(r"```(?:json)?\s*(\[.*?\])\s*```", raw, re.DOTALL)
        if json_match:
            try:
                task_dicts = json.loads(json_match.group(1))
                task_id_map = {}
                for idx, td in enumerate(task_dicts):
                    assigned_str = td.get("assigned_to", "coder").lower()
                    try:
                        role_enum = AgentRole(assigned_str)
                    except ValueError:
                        role_enum = AgentRole.CODER

                    st = SubTask(
                        title=td.get("title", f"Subtask {idx + 1}"),
                        description=td.get("description", ""),
                        assigned_to=role_enum,
                        dependencies=[]
                    )
                    task_id_map[idx] = st.id
                    subtasks.append(st)

                # Link dependencies
                for idx, td in enumerate(task_dicts):
                    raw_deps = td.get("dependencies", [])
                    for d in raw_deps:
                        if isinstance(d, int) and d in task_id_map:
                            subtasks[idx].dependencies.append(task_id_map[d])
            except Exception:
                pass

        # Fallback default robust pipeline if LLM returned free text
        if not subtasks:
            t1 = SubTask(
                title="Research & System Specification",
                description=f"Analyze requirements, design architecture, and plan components for: {objective}",
                assigned_to=AgentRole.RESEARCHER
            )
            t2 = SubTask(
                title="Implementation & Development",
                description=f"Implement all required modules and functional code for: {objective}",
                assigned_to=AgentRole.CODER,
                dependencies=[t1.id]
            )
            t3 = SubTask(
                title="Testing & Quality Verification",
                description="Write and execute automated test suites to verify functionality and catch edge cases.",
                assigned_to=AgentRole.QA,
                dependencies=[t2.id]
            )
            t4 = SubTask(
                title="Security & Code Quality Review",
                description="Perform a security audit, review code structure, and ensure high reliability.",
                assigned_to=AgentRole.REVIEWER,
                dependencies=[t3.id]
            )
            subtasks = [t1, t2, t3, t4]

        # Register all subtasks on blackboard
        if self.blackboard:
            for st in subtasks:
                await self.blackboard.add_task(st)

        return subtasks

    async def synthesize_results(self, objective: str) -> str:
        """Produces final executive synthesis report from Blackboard state."""
        state_summary = ""
        if self.blackboard:
            tasks = await self.blackboard.get_all_tasks()
            artifacts = await self.blackboard.list_artifacts()
            task_details = "\n\n".join([
                f"### Task: {t.title} (Status: {t.status.value}, Owner: {t.assigned_to.value})\n"
                f"**Result:**\n{t.result or 'No output'}"
                for t in tasks
            ])
            art_details = "\n".join([f"- Artifact: {a.name} ({a.artifact_type})" for a in artifacts])
            state_summary = f"{task_details}\n\n### Generated Artifacts:\n{art_details}"

        prompt = SUPERVISOR_SYNTHESIS_PROMPT.format(
            objective=objective,
            blackboard_state=state_summary
        )

        response: LLMResponse = await self.llm.generate(
            messages=[Message(role="user", content=prompt)],
            system_prompt=self.system_prompt
        )

        return response.content
