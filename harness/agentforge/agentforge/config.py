"""Configuration management for AgentForge."""

import os
from typing import Optional
from pydantic import BaseModel, Field

class LLMConfig(BaseModel):
    provider: str = Field(default_factory=lambda: os.getenv("AGENT_PROVIDER", "ollama"))
    model: str = Field(default_factory=lambda: os.getenv("AGENT_MODEL", "deepseek-r1:7b"))
    temperature: float = Field(default=0.2)
    max_tokens: int = Field(default=4096)
    timeout_seconds: float = Field(default=120.0)
    
    # Provider-specific endpoints / keys
    ollama_base_url: str = Field(default_factory=lambda: os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"))
    openai_api_key: Optional[str] = Field(default_factory=lambda: os.getenv("OPENAI_API_KEY"))
    openai_base_url: str = Field(default_factory=lambda: os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1"))
    anthropic_api_key: Optional[str] = Field(default_factory=lambda: os.getenv("ANTHROPIC_API_KEY"))
    gemini_api_key: Optional[str] = Field(default_factory=lambda: os.getenv("GEMINI_API_KEY"))

class AgentForgeConfig(BaseModel):
    llm: LLMConfig = Field(default_factory=LLMConfig)
    workspace_root: str = Field(default_factory=lambda: os.getenv("WORKSPACE_ROOT", os.getcwd()))
    max_iterations_per_task: int = Field(default=10)
    enable_web_search: bool = Field(default=True)
    verbose: bool = Field(default=True)
    log_file: Optional[str] = Field(default="agentforge_audit.jsonl")

# Global singleton config
default_config = AgentForgeConfig()
