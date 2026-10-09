"""Shared Blackboard memory architecture for multi-agent coordination."""

import asyncio
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from agentforge.core.types import SubTask, TaskStatus

class Artifact(BaseModel):
    name: str
    content: str
    artifact_type: str  # "code", "markdown", "json", "report", "test"
    created_by: str
    version: int = 1
    metadata: Dict[str, Any] = Field(default_factory=dict)

class Blackboard:
    """Thread-safe shared knowledge store and workspace for collaborating agents."""

    def __init__(self, objective: str = ""):
        self.objective: str = objective
        self._artifacts: Dict[str, Artifact] = {}
        self._tasks: Dict[str, SubTask] = {}
        self._shared_data: Dict[str, Any] = {}
        self._logs: List[str] = []
        self._lock = asyncio.Lock()

    async def set_objective(self, objective: str):
        async with self._lock:
            self.objective = objective

    async def put_artifact(self, name: str, content: str, artifact_type: str, author: str, metadata: Optional[Dict[str, Any]] = None) -> Artifact:
        async with self._lock:
            version = 1
            if name in self._artifacts:
                version = self._artifacts[name].version + 1
            art = Artifact(
                name=name,
                content=content,
                artifact_type=artifact_type,
                created_by=author,
                version=version,
                metadata=metadata or {}
            )
            self._artifacts[name] = art
            self._logs.append(f"[{author}] Saved artifact '{name}' (v{version})")
            return art

    async def get_artifact(self, name: str) -> Optional[Artifact]:
        async with self._lock:
            return self._artifacts.get(name)

    async def list_artifacts(self) -> List[Artifact]:
        async with self._lock:
            return list(self._artifacts.values())

    async def add_task(self, task: SubTask):
        async with self._lock:
            self._tasks[task.id] = task

    async def update_task_status(self, task_id: str, status: TaskStatus, result: Optional[str] = None, error: Optional[str] = None):
        async with self._lock:
            if task_id in self._tasks:
                self._tasks[task_id].status = status
                if result is not None:
                    self._tasks[task_id].result = result
                if error is not None:
                    self._tasks[task_id].error = error

    async def get_task(self, task_id: str) -> Optional[SubTask]:
        async with self._lock:
            return self._tasks.get(task_id)

    async def get_all_tasks(self) -> List[SubTask]:
        async with self._lock:
            return list(self._tasks.values())

    async def get_ready_tasks(self) -> List[SubTask]:
        """Returns pending tasks whose dependencies have all completed successfully."""
        async with self._lock:
            ready = []
            completed_ids = {t.id for t in self._tasks.values() if t.status == TaskStatus.COMPLETED}
            for task in self._tasks.values():
                if task.status == TaskStatus.PENDING:
                    if all(dep in completed_ids for dep in task.dependencies):
                        ready.append(task)
            return ready

    async def set_data(self, key: str, value: Any):
        async with self._lock:
            self._shared_data[key] = value

    async def get_data(self, key: str, default: Any = None) -> Any:
        async with self._lock:
            return self._shared_data.get(key, default)

    async def get_summary(self) -> str:
        async with self._lock:
            task_status_summary = ", ".join([f"{t.title} ({t.status.value})" for t in self._tasks.values()]) or "No tasks yet"
            artifacts_list = ", ".join([f"{a.name} ({a.artifact_type})" for a in self._artifacts.values()]) or "No artifacts yet"
            return (
                f"=== Current Blackboard State ===\n"
                f"Objective: {self.objective}\n"
                f"Tasks: {task_status_summary}\n"
                f"Artifacts: {artifacts_list}\n"
            )
