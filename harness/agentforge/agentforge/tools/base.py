"""Base tool definition and registry."""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
import time
from agentforge.core.types import ToolResult

class BaseTool(ABC):
    """Abstract base class for all agent tools."""

    name: str
    description: str
    parameters_schema: Dict[str, Any]

    @abstractmethod
    async def run(self, **kwargs) -> str:
        """Executes the tool logic and returns string output."""
        pass

    async def execute(self, tool_call_id: str, **kwargs) -> ToolResult:
        start_time = time.time()
        try:
            output = await self.run(**kwargs)
            duration = (time.time() - start_time) * 1000.0
            return ToolResult(
                tool_call_id=tool_call_id,
                name=self.name,
                success=True,
                output=str(output),
                execution_time_ms=round(duration, 2)
            )
        except Exception as e:
            duration = (time.time() - start_time) * 1000.0
            return ToolResult(
                tool_call_id=tool_call_id,
                name=self.name,
                success=False,
                output=f"Error executing {self.name}: {str(e)}",
                error=str(e),
                execution_time_ms=round(duration, 2)
            )

    def to_function_schema(self) -> Dict[str, Any]:
        """Converts tool to standard OpenAI / Ollama function calling schema."""
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.parameters_schema
            }
        }

class ToolRegistry:
    """Registry managing available tools for agents."""

    def __init__(self):
        self._tools: Dict[str, BaseTool] = {}

    def register(self, tool: BaseTool):
        self._tools[tool.name] = tool

    def get(self, name: str) -> Optional[BaseTool]:
        return self._tools.get(name)

    def get_schemas(self, tool_names: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        if tool_names is None:
            return [t.to_function_schema() for t in self._tools.values()]
        return [self._tools[name].to_function_schema() for name in tool_names if name in self._tools]

    async def execute(self, tool_call_id: str, name: str, arguments: Dict[str, Any]) -> ToolResult:
        tool = self.get(name)
        if not tool:
            return ToolResult(
                tool_call_id=tool_call_id,
                name=name,
                success=False,
                output=f"Tool '{name}' is not registered or unavailable.",
                error=f"ToolNotFound: {name}"
            )
        return await tool.execute(tool_call_id=tool_call_id, **arguments)
