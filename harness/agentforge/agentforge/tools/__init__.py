"""AgentForge tools module."""

from agentforge.tools.base import BaseTool, ToolRegistry
from agentforge.tools.bash import BashTool
from agentforge.tools.filesystem import ReadFileTool, WriteFileTool, ListDirTool, FileSearchTool
from agentforge.tools.python_runner import PythonRunnerTool
from agentforge.tools.web_search import WebSearchTool
from agentforge.tools.http_client import HTTPClientTool

def create_default_tool_registry() -> ToolRegistry:
    registry = ToolRegistry()
    registry.register(BashTool())
    registry.register(ReadFileTool())
    registry.register(WriteFileTool())
    registry.register(ListDirTool())
    registry.register(FileSearchTool())
    registry.register(PythonRunnerTool())
    registry.register(WebSearchTool())
    registry.register(HTTPClientTool())
    return registry

__all__ = [
    "BaseTool",
    "ToolRegistry",
    "BashTool",
    "ReadFileTool",
    "WriteFileTool",
    "ListDirTool",
    "FileSearchTool",
    "PythonRunnerTool",
    "WebSearchTool",
    "HTTPClientTool",
    "create_default_tool_registry"
]
