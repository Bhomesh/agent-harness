"""Core data types and structures for AgentForge."""

from enum import Enum
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
import time
import uuid

class Role(str, Enum):
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"
    TOOL = "tool"

class AgentRole(str, Enum):
    SUPERVISOR = "supervisor"
    RESEARCHER = "researcher"
    CODER = "coder"
    QA = "qa"
    REVIEWER = "reviewer"

class TaskStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    BLOCKED = "blocked"

class ToolCall(BaseModel):
    id: str = Field(default_factory=lambda: f"call_{uuid.uuid4().hex[:8]}")
    name: str
    arguments: Dict[str, Any]

class ToolResult(BaseModel):
    tool_call_id: str
    name: str
    success: bool
    output: str
    error: Optional[str] = None
    execution_time_ms: float = 0.0

class Message(BaseModel):
    role: Role
    content: str
    name: Optional[str] = None
    tool_calls: Optional[List[ToolCall]] = None
    tool_result: Optional[ToolResult] = None
    timestamp: float = Field(default_factory=time.time)

class LLMResponse(BaseModel):
    content: str
    thinking: Optional[str] = None
    tool_calls: List[ToolCall] = Field(default_factory=list)
    raw_response: Optional[Dict[str, Any]] = None
    prompt_tokens: int = 0
    completion_tokens: int = 0
    finish_reason: Optional[str] = "stop"

class SubTask(BaseModel):
    id: str = Field(default_factory=lambda: f"task_{uuid.uuid4().hex[:6]}")
    title: str
    description: str
    assigned_to: AgentRole
    dependencies: List[str] = Field(default_factory=list)
    status: TaskStatus = TaskStatus.PENDING
    result: Optional[str] = None
    artifacts: List[str] = Field(default_factory=list)
    error: Optional[str] = None

class EventType(str, Enum):
    TASK_STARTED = "task_started"
    TASK_UPDATED = "task_updated"
    TASK_COMPLETED = "task_completed"
    AGENT_THINKING = "agent_thinking"
    AGENT_ACTION = "agent_action"
    TOOL_STARTED = "tool_started"
    TOOL_FINISHED = "tool_finished"
    AGENT_MESSAGE = "agent_message"
    ERROR = "error"

class AgentEvent(BaseModel):
    event_id: str = Field(default_factory=lambda: uuid.uuid4().hex)
    event_type: EventType
    sender: str
    payload: Dict[str, Any]
    timestamp: float = Field(default_factory=time.time)
