"""Base Autonomous Agent with ReAct reasoning & tool execution loop."""

import asyncio
import time
from typing import List, Optional, Dict, Any
from agentforge.core.types import (
    AgentRole,
    Message,
    Role,
    ToolCall,
    ToolResult,
    LLMResponse,
    EventType,
    AgentEvent,
    SubTask,
    TaskStatus
)
from agentforge.core.memory import AgentMemory
from agentforge.core.blackboard import Blackboard
from agentforge.core.message_bus import MessageBus
from agentforge.tools.base import ToolRegistry
from agentforge.llm.base import BaseLLMProvider

class BaseAgent:
    """Core autonomous agent supporting tool usage, memory, and ReAct loops."""

    def __init__(
        self,
        name: str,
        role: AgentRole,
        system_prompt: str,
        llm: BaseLLMProvider,
        tools: ToolRegistry,
        allowed_tools: Optional[List[str]] = None,
        blackboard: Optional[Blackboard] = None,
        message_bus: Optional[MessageBus] = None,
        max_iterations: int = 8
    ):
        self.name = name
        self.role = role
        self.system_prompt = system_prompt
        self.llm = llm
        self.tools = tools
        self.allowed_tools = allowed_tools
        self.blackboard = blackboard
        self.message_bus = message_bus
        self.max_iterations = max_iterations
        self.memory = AgentMemory()

    async def emit_event(self, event_type: EventType, payload: Dict[str, Any]):
        if self.message_bus:
            evt = AgentEvent(
                event_type=event_type,
                sender=f"{self.name} ({self.role.value})",
                payload=payload
            )
            await self.message_bus.publish(evt)

    async def execute_task(self, task: SubTask) -> str:
        """Executes an assigned subtask using autonomous reasoning and tools."""
        await self.emit_event(
            EventType.TASK_STARTED,
            {"task_id": task.id, "title": task.title, "description": task.description}
        )

        # Build context from blackboard if available
        context_str = ""
        if self.blackboard:
            context_str = await self.blackboard.get_summary()

        initial_prompt = (
            f"You have been assigned the following task:\n"
            f"Task ID: {task.id}\n"
            f"Title: {task.title}\n"
            f"Description: {task.description}\n\n"
            f"{context_str}\n\n"
            f"Please execute this task thoroughly using your available tools. "
            f"When you have finished, provide a clear, comprehensive summary of the outcome."
        )

        self.memory.clear()
        self.memory.add_user(initial_prompt)

        iteration = 0
        final_answer = ""

        tool_schemas = self.tools.get_schemas(self.allowed_tools)

        while iteration < self.max_iterations:
            iteration += 1

            # 1. LLM Generation
            response: LLMResponse = await self.llm.generate(
                messages=self.memory.get_messages(),
                system_prompt=self.system_prompt,
                tools=tool_schemas if tool_schemas else None
            )

            # Emit thinking event if present
            if response.thinking:
                await self.emit_event(
                    EventType.AGENT_THINKING,
                    {"iteration": iteration, "thinking": response.thinking}
                )

            # Record assistant response in memory
            self.memory.add_assistant(
                text=response.content,
                tool_calls=response.tool_calls if response.tool_calls else None
            )

            # 2. Check if agent performed tool calls
            if response.tool_calls:
                for tc in response.tool_calls:
                    await self.emit_event(
                        EventType.TOOL_STARTED,
                        {"tool": tc.name, "arguments": tc.arguments, "call_id": tc.id}
                    )

                    # Execute the tool
                    result: ToolResult = await self.tools.execute(
                        tool_call_id=tc.id,
                        name=tc.name,
                        arguments=tc.arguments
                    )

                    await self.emit_event(
                        EventType.TOOL_FINISHED,
                        {
                            "tool": tc.name,
                            "success": result.success,
                            "duration_ms": result.execution_time_ms,
                            "output_snippet": result.output[:300]
                        }
                    )

                    # Feed tool output back into memory
                    self.memory.add_tool_result(
                        tool_call_id=tc.id,
                        name=tc.name,
                        output=result.output,
                        success=result.success
                    )
            else:
                # No tool calls made, agent has reached conclusion
                final_answer = response.content
                break

        if not final_answer and iteration >= self.max_iterations:
            final_answer = (
                f"Task reached maximum allowed iterations ({self.max_iterations}). "
                f"Last output: {response.content}"
            )

        # Update blackboard task status
        if self.blackboard:
            await self.blackboard.update_task_status(
                task_id=task.id,
                status=TaskStatus.COMPLETED,
                result=final_answer
            )

        await self.emit_event(
            EventType.TASK_COMPLETED,
            {"task_id": task.id, "title": task.title, "result_summary": final_answer[:500]}
        )

        return final_answer
