"""Anthropic Claude API Provider."""

import httpx
from typing import List, Optional, Dict, Any
from agentforge.core.types import Message, LLMResponse, ToolCall, Role
from agentforge.llm.base import BaseLLMProvider

class AnthropicProvider(BaseLLMProvider):
    """Anthropic Claude LLM backend provider."""

    def __init__(
        self,
        model: str = "claude-3-5-sonnet-20241022",
        api_key: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 4096,
        timeout_seconds: float = 120.0
    ):
        super().__init__(model=model, temperature=temperature, max_tokens=max_tokens, timeout_seconds=timeout_seconds)
        self.api_key = api_key or ""

    async def check_health(self) -> bool:
        return bool(self.api_key)

    async def generate(
        self,
        messages: List[Message],
        system_prompt: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None
    ) -> LLMResponse:
        url = "https://api.anthropic.com/v1/messages"
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }

        formatted_messages = []
        for msg in messages:
            role = "user" if msg.role in (Role.USER, Role.TOOL) else "assistant"
            formatted_messages.append({
                "role": role,
                "content": msg.content
            })

        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": formatted_messages,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature
        }
        if system_prompt:
            payload["system"] = system_prompt

        async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
            res = await client.post(url, headers=headers, json=payload)
            res.raise_for_status()
            data = res.json()

        content_blocks = data.get("content", [])
        text = ""
        tool_calls: List[ToolCall] = []
        for b in content_blocks:
            if b.get("type") == "text":
                text += b.get("text", "")
            elif b.get("type") == "tool_use":
                tool_calls.append(ToolCall(id=b.get("id"), name=b.get("name"), arguments=b.get("input", {})))

        usage = data.get("usage", {})
        return LLMResponse(
            content=text,
            tool_calls=tool_calls,
            raw_response=data,
            prompt_tokens=usage.get("input_tokens", 0),
            completion_tokens=usage.get("output_tokens", 0)
        )
