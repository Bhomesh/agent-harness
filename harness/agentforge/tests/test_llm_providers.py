"""Unit tests for LLM providers."""

import pytest
from agentforge.config import LLMConfig
from agentforge.llm.factory import LLMProviderFactory
from agentforge.llm.ollama import OllamaProvider
from agentforge.llm.openai_provider import OpenAIProvider
from agentforge.core.types import Message, Role

def test_llm_factory_creation():
    cfg_ollama = LLMConfig(provider="ollama", model="deepseek-r1:7b")
    p1 = LLMProviderFactory.create(cfg_ollama)
    assert isinstance(p1, OllamaProvider)
    assert p1.model == "deepseek-r1:7b"

    cfg_openai = LLMConfig(provider="openai", model="gpt-4o", openai_api_key="sk-test")
    p2 = LLMProviderFactory.create(cfg_openai)
    assert isinstance(p2, OpenAIProvider)
    assert p2.model == "gpt-4o"

def test_ollama_json_tool_extraction():
    provider = OllamaProvider()
    content_with_tool = """
I will now write the file to disk.
```json
{
  "tool": "write_file",
  "arguments": {
    "path": "hello.py",
    "content": "print('hello')"
  }
}
```
"""
    calls = provider._extract_json_tool_calls(content_with_tool)
    assert len(calls) == 1
    assert calls[0].name == "write_file"
    assert calls[0].arguments["path"] == "hello.py"
