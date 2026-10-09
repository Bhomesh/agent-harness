"""Agent conversation and scratchpad working memory."""

from typing import List, Optional
from agentforge.core.types import Message, Role

class AgentMemory:
    """Manages an agent's individual memory and dialogue history."""

    def __init__(self, max_messages: int = 50):
        self.max_messages = max_messages
        self._system_prompt: Optional[str] = None
        self._history: List[Message] = []

    def set_system_prompt(self, prompt: str):
        self._system_prompt = prompt

    def get_system_prompt(self) -> Optional[str]:
        return self._system_prompt

    def add_message(self, message: Message):
        self._history.append(message)
        # Prune if too long while preserving context
        if len(self._history) > self.max_messages:
            # Keep the first user prompt and prune older middle messages
            self._history = [self._history[0]] + self._history[-(self.max_messages - 1):]

    def add_user(self, text: str):
        self.add_message(Message(role=Role.USER, content=text))

    def add_assistant(self, text: str, tool_calls=None):
        self.add_message(Message(role=Role.ASSISTANT, content=text, tool_calls=tool_calls))

    def add_tool_result(self, tool_call_id: str, name: str, output: str, success: bool = True):
        from agentforge.core.types import ToolResult
        res = ToolResult(tool_call_id=tool_call_id, name=name, success=success, output=output)
        self.add_message(Message(role=Role.TOOL, content=output, name=name, tool_result=res))

    def get_messages(self) -> List[Message]:
        return list(self._history)

    def clear(self):
        self._history.clear()
