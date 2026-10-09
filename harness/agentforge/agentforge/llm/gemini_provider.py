"""Google Gemini API Provider."""

import httpx
from typing import List, Optional, Dict, Any
from agentforge.core.types import Message, LLMResponse, ToolCall, Role
from agentforge.llm.base import BaseLLMProvider

class GeminiProvider(BaseLLMProvider):
    """Google Gemini LLM backend provider."""

    def __init__(
        self,
        model: str = "gemini-2.0-flash",
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
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"

        contents = []
        for msg in messages:
            role = "user" if msg.role in (Role.USER, Role.TOOL) else "model"
            contents.append({
                "role": role,
                "parts": [{"text": msg.content}]
            })

        payload: Dict[str, Any] = {
            "contents": contents,
            "generationConfig": {
                "temperature": self.temperature,
                "maxOutputTokens": self.max_tokens,
            }
        }
        if system_prompt:
            payload["systemInstruction"] = {
                "parts": [{"text": system_prompt}]
            }

        async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
            res = await client.post(url, json=payload)
            res.raise_for_status()
            data = res.json()

        candidates = data.get("candidates", [])
        content_text = ""
        tool_calls: List[ToolCall] = []

        if candidates:
            parts = candidates[0].get("content", {}).get("parts", [])
            for p in parts:
                if "text" in p:
                    content_text += p["text"]
                elif "functionCall" in p:
                    fc = p["functionCall"]
                    tool_calls.append(ToolCall(name=fc.get("name"), arguments=fc.get("args", {})))

        return LLMResponse(
            content=content_text,
            tool_calls=tool_calls,
            raw_response=data
        )
