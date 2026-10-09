"""Integration tests for Swarm Orchestration with Mock LLM."""

import pytest
from typing import List, Optional, Dict, Any
from agentforge.core.types import Message, LLMResponse, ToolCall
from agentforge.llm.base import BaseLLMProvider
from agentforge.orchestrator import SwarmOrchestrator
from agentforge.config import AgentForgeConfig

class MockLLMProvider(BaseLLMProvider):
    """Deterministic Mock LLM for integration testing."""

    def __init__(self):
        super().__init__(model="mock-v1")
        self.call_count = 0

    async def check_health(self) -> bool:
        return True

    async def generate(
        self,
        messages: List[Message],
        system_prompt: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None
    ) -> LLMResponse:
        self.call_count += 1
        last_msg = messages[-1].content if messages else ""

        # Planning step
        if "Decompose" in system_prompt or "JSON array of subtasks" in last_msg:
            plan_json = """```json
[
  {"title": "Explore Architecture", "description": "Research best patterns", "assigned_to": "researcher", "dependencies": []},
  {"title": "Implement Core", "description": "Write Python code", "assigned_to": "coder", "dependencies": [0]},
  {"title": "Verify QA", "description": "Run tests", "assigned_to": "qa", "dependencies": [1]},
  {"title": "Security Review", "description": "Audit security", "assigned_to": "reviewer", "dependencies": [2]}
]
```"""
            return LLMResponse(content=plan_json)

        # Synthesis step
        if "Synthesize a comprehensive" in last_msg:
            return LLMResponse(content="# Final Executive Report\nAll tasks completed successfully. Architecture validated.")

        # Worker tasks: first call might use tool, second call finalizes
        if tools and "python_interpreter" in [t["function"]["name"] for t in tools if "function" in t] and self.call_count % 2 == 1:
            return LLMResponse(
                content="I will run the code to verify.",
                tool_calls=[ToolCall(name="python_interpreter", arguments={"code": "print('All tests passed')"})]
            )

        return LLMResponse(content=f"Task executed with full adherence to specifications. Verified output.")

@pytest.mark.asyncio
async def test_swarm_orchestrator_mock():
    mock_llm = MockLLMProvider()
    orchestrator = SwarmOrchestrator(llm=mock_llm)

    events_received = []
    async def listener(evt):
        events_received.append(evt.event_type)

    orchestrator.message_bus.subscribe(listener)

    result = await orchestrator.run("Design and verify a secure token hashing utility")

    assert result["objective"] == "Design and verify a secure token hashing utility"
    assert len(result["tasks"]) == 4
    assert result["duration_seconds"] >= 0
    assert "Final Executive Report" in result["synthesis"]
    assert len(events_received) > 0
