"""Ollama local LLM provider supporting DeepSeek-R1, Llama 3, Qwen, etc."""

import re
import json
import httpx
from typing import List, Optional, Dict, Any
from agentforge.core.types import Message, LLMResponse, ToolCall, Role
from agentforge.llm.base import BaseLLMProvider

class OllamaProvider(BaseLLMProvider):
    """Local Ollama backend provider."""

    def __init__(
        self,
        model: str = "deepseek-r1:7b",
        base_url: str = "http://localhost:11434",
        temperature: float = 0.2,
        max_tokens: int = 4096,
        timeout_seconds: float = 180.0
    ):
        super().__init__(model=model, temperature=temperature, max_tokens=max_tokens, timeout_seconds=timeout_seconds)
        self.base_url = base_url.rstrip("/")

    async def check_health(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(f"{self.base_url}/api/tags")
                return res.status_code == 200
        except Exception:
            return False

    async def generate(
        self,
        messages: List[Message],
        system_prompt: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None
    ) -> LLMResponse:
        # Convert internal Message format to Ollama messages
        formatted_messages = []
        if system_prompt:
            formatted_messages.append({"role": "system", "content": system_prompt})

        for msg in messages:
            role_str = msg.role.value
            if msg.role == Role.TOOL:
                role_str = "tool"
            
            item = {"role": role_str, "content": msg.content}
            if msg.tool_calls:
                item["tool_calls"] = [
                    {
                        "function": {
                            "name": tc.name,
                            "arguments": tc.arguments
                        }
                    }
                    for tc in msg.tool_calls
                ]
            formatted_messages.append(item)

        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": formatted_messages,
            "stream": False,
            "options": {
                "temperature": self.temperature,
                "num_predict": self.max_tokens,
            }
        }

        if tools:
            payload["tools"] = tools

        async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
            try:
                response = await client.post(
                    f"{self.base_url}/api/chat",
                    json=payload
                )
                response.raise_for_status()
                data = response.json()
            except httpx.HTTPError as e:
                # If native tools failed (e.g. model unsupported), try fallback without tools schema
                if tools and "tool" in str(e).lower():
                    del payload["tools"]
                    response = await client.post(f"{self.base_url}/api/chat", json=payload)
                    response.raise_for_status()
                    data = response.json()
                else:
                    raise

        msg_data = data.get("message", {})
        raw_content = msg_data.get("content", "")

        # Extract DeepSeek-R1 reasoning <think> ... </think>
        thinking = None
        content = raw_content
        think_match = re.search(r"<think>(.*?)</think>", raw_content, re.DOTALL)
        if think_match:
            thinking = think_match.group(1).strip()
            content = re.sub(r"<think>.*?</think>", "", raw_content, flags=re.DOTALL).strip()

        # Parse tool calls from Ollama native format
        tool_calls: List[ToolCall] = []
        if "tool_calls" in msg_data and msg_data["tool_calls"]:
            for tc in msg_data["tool_calls"]:
                func = tc.get("function", {})
                args = func.get("arguments", {})
                if isinstance(args, str):
                    try:
                        args = json.loads(args)
                    except Exception:
                        args = {"raw": args}
                tool_calls.append(ToolCall(name=func.get("name", ""), arguments=args))

        # Fallback tool parsing from content if model emitted JSON tool blocks
        if not tool_calls:
            tool_calls.extend(self._extract_json_tool_calls(content))

        prompt_tokens = data.get("prompt_eval_count", 0)
        completion_tokens = data.get("eval_count", 0)

        return LLMResponse(
            content=content,
            thinking=thinking,
            tool_calls=tool_calls,
            raw_response=data,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            finish_reason=data.get("done_reason", "stop")
        )

    def _extract_json_tool_calls(self, text: str) -> List[ToolCall]:
        tool_calls = []
        # Pattern 1: ```json { "tool": "name", "arguments": {...} } ```
        patterns = [
            r"```json\s*(\{.*?\})\s*```",
            r"```tool_code\s*(\{.*?\})\s*```",
            r"(\{\s*\"tool\"\s*:\s*\"[^\"]+\"[^\}]+\})"
        ]
        for pat in patterns:
            matches = re.findall(pat, text, re.DOTALL)
            for m in matches:
                try:
                    obj = json.loads(m)
                    tool_name = obj.get("tool") or obj.get("name") or obj.get("action")
                    args = obj.get("arguments") or obj.get("parameters") or obj.get("args") or {}
                    if tool_name and isinstance(args, dict):
                        tool_calls.append(ToolCall(name=tool_name, arguments=args))
                except Exception:
                    pass
        return tool_calls
