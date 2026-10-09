"""LLM Provider factory with intelligent fallback and auto-detection."""

import os
from typing import Optional
from agentforge.config import LLMConfig
from agentforge.llm.base import BaseLLMProvider
from agentforge.llm.ollama import OllamaProvider
from agentforge.llm.openai_provider import OpenAIProvider
from agentforge.llm.gemini_provider import GeminiProvider
from agentforge.llm.anthropic_provider import AnthropicProvider

class LLMProviderFactory:
    """Creates configured LLM provider instances with seamless fallback."""

    @staticmethod
    def create(config: Optional[LLMConfig] = None) -> BaseLLMProvider:
        if config is None:
            config = LLMConfig()

        provider = config.provider.lower()

        if provider == "ollama":
            return OllamaProvider(
                model=config.model,
                base_url=config.ollama_base_url,
                temperature=config.temperature,
                max_tokens=config.max_tokens,
                timeout_seconds=config.timeout_seconds
            )
        elif provider in ("openai", "groq", "openrouter", "deepseek"):
            return OpenAIProvider(
                model=config.model,
                api_key=config.openai_api_key,
                base_url=config.openai_base_url,
                temperature=config.temperature,
                max_tokens=config.max_tokens,
                timeout_seconds=config.timeout_seconds
            )
        elif provider == "gemini":
            return GeminiProvider(
                model=config.model,
                api_key=config.gemini_api_key,
                temperature=config.temperature,
                max_tokens=config.max_tokens,
                timeout_seconds=config.timeout_seconds
            )
        elif provider in ("anthropic", "claude"):
            return AnthropicProvider(
                model=config.model,
                api_key=config.anthropic_api_key,
                temperature=config.temperature,
                max_tokens=config.max_tokens,
                timeout_seconds=config.timeout_seconds
            )
        else:
            # Default to Ollama if available
            return OllamaProvider(model=config.model, base_url=config.ollama_base_url)

    @staticmethod
    async def create_auto() -> BaseLLMProvider:
        """Auto-detects the best available provider based on environment and local services."""
        # 1. Check if local Ollama is active
        ollama = OllamaProvider()
        if await ollama.check_health():
            return ollama

        # 2. Check OpenAI API key
        if os.getenv("OPENAI_API_KEY"):
            return OpenAIProvider(api_key=os.getenv("OPENAI_API_KEY"))

        # 3. Check Gemini API key
        if os.getenv("GEMINI_API_KEY"):
            return GeminiProvider(api_key=os.getenv("GEMINI_API_KEY"))

        # 4. Check Anthropic API key
        if os.getenv("ANTHROPIC_API_KEY"):
            return AnthropicProvider(api_key=os.getenv("ANTHROPIC_API_KEY"))

        # Fallback to local Ollama
        return ollama
