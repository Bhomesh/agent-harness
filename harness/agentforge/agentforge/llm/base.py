"""Base LLM Provider interface."""

from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from agentforge.core.types import Message, LLMResponse

class BaseLLMProvider(ABC):
    """Abstract interface for LLM backends."""

    def __init__(self, model: str, temperature: float = 0.2, max_tokens: int = 4096, timeout_seconds: float = 120.0):
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.timeout_seconds = timeout_seconds

    @abstractmethod
    async def generate(
        self,
        messages: List[Message],
        system_prompt: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None
    ) -> LLMResponse:
        """Generates response from the LLM given conversation messages and optional tools."""
        pass

    @abstractmethod
    async def check_health(self) -> bool:
        """Verifies connection to the LLM backend."""
        pass
