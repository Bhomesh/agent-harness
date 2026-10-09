"""OpenAI-compatible LLM provider (OpenAI, Groq, OpenRouter, DeepSeek API, vLLM)."""

import json
import httpx
from typing import List, Optional, Dict, Any
from agentforge.core.types import Message, LLMResponse, ToolCall, Role
from agentforge.llm.base import BaseLLMProvider

class OpenAIProvider(BaseLLMProvider):
    """OpenAI / OpenAI-compatible API backend provider."""

    def __init__(
        self,
        model: str = "gpt-4o",
        api_key: Optional[str] = None,
        base_url: str = "https://api.openai.com/v1",
        temperature: float = 0.2,
        max_tokens: int = 4096,
        timeout_seconds: float = 120.0
    ):
        super().__init__(model=model, temperature=temperature, max_tokens=max_tokens, timeout_seconds=timeout_seconds)
        self.api_key = api_key or ""
        self.base_url = base_url.rstrip("/")

    async def check_health(self) -> bool:
        if not self.api_key and "localhost" not in self.base_url and "127.0.0.1" not in self.base_url:
            return False
        return True

    async def generate(
        self,
        messages: List[Message],
        system_prompt: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None
    ) -> LLMResponse:
        headers = {
            "Content-Type": "application/json"
        }
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        formatted_messages = []
        if system_prompt:
            formatted_messages.append({"role": "system", "content": system_prompt})

        for msg in messages:
            role_str = msg.role.value
            item: Dict[str, Any] = {"role": role_str, "content": msg.content}
            if msg.role == Role.TOOL and msg.tool_result:
                item["tool_call_id"] = msg.tool_result.tool_call_id
                item["name"] = msg.tool_result.name
            elif msg.tool_calls:
                item["tool_calls"] = [
                    {
                        "id": tc.id,
                        "type": "function",
                        "function": {
                            "name": tc.name,
                            "arguments": json.dumps(tc.arguments)
                        }
                    }
                    for tc in msg.tool_calls
                ]
            formatted_messages.append(item)

        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": formatted_messages,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
        }

        if tools:
            payload["tools"] = tools

        async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            data = response.json()

        choice = data["choices"][0]
        msg = choice.get("message", {})
        content = msg.get("content") or ""

        tool_calls: List[ToolCall] = []
        if "tool_calls" in msg and msg["tool_calls"]:
            for tc in msg["tool_calls"]:
                func = tc.get("function", {})
                args_str = func.get("arguments", "{}")
                try:
                    args = json.loads(args_str)
                except Exception:
                    args = {"raw": args_str}
                tool_calls.append(ToolCall(id=tc.get("id"), name=func.get("name", ""), arguments=args))

        usage = data.get("usage", {})
        return LLMResponse(
            content=content,
            thinking=None,
            tool_calls=tool_calls,
            raw_response=data,
            prompt_tokens=usage.get("prompt_tokens", 0),
            completion_tokens=usage.get("completion_tokens", 0),
            finish_reason=choice.get("finish_reason", "stop")
        )
