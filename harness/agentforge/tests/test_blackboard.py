"""Unit tests for Blackboard shared memory and DAG task resolution."""

import pytest
from agentforge.core.blackboard import Blackboard
from agentforge.core.types import SubTask, AgentRole, TaskStatus

@pytest.mark.asyncio
async def test_blackboard_artifacts():
    bb = Blackboard("Build an autonomous agent")
    await bb.put_artifact(
        name="spec.md",
        content="# Architecture Specification",
        artifact_type="markdown",
        author="Researcher"
    )

    art = await bb.get_artifact("spec.md")
    assert art is not None
    assert art.created_by == "Researcher"
    assert art.version == 1

    # Overwrite creates v2
    await bb.put_artifact(
        name="spec.md",
        content="# Architecture Specification Updated",
        artifact_type="markdown",
        author="Supervisor"
    )
    art2 = await bb.get_artifact("spec.md")
    assert art2.version == 2
    assert "Updated" in art2.content

@pytest.mark.asyncio
async def test_blackboard_task_dag_dependencies():
    bb = Blackboard("Test DAG")

    t1 = SubTask(id="task_1", title="Research", description="Do research", assigned_to=AgentRole.RESEARCHER)
    t2 = SubTask(id="task_2", title="Implement", description="Do coding", assigned_to=AgentRole.CODER, dependencies=["task_1"])
    t3 = SubTask(id="task_3", title="QA Test", description="Run QA", assigned_to=AgentRole.QA, dependencies=["task_2"])

    await bb.add_task(t1)
    await bb.add_task(t2)
    await bb.add_task(t3)

    # Initial ready tasks should only be task_1
    ready = await bb.get_ready_tasks()
    assert len(ready) == 1
    assert ready[0].id == "task_1"

    # Complete task_1
    await bb.update_task_status("task_1", TaskStatus.COMPLETED, result="Research done")

    # Now task_2 should be ready
    ready2 = await bb.get_ready_tasks()
    assert len(ready2) == 1
    assert ready2[0].id == "task_2"

    # Complete task_2
    await bb.update_task_status("task_2", TaskStatus.COMPLETED, result="Coding done")

    # Now task_3 should be ready
    ready3 = await bb.get_ready_tasks()
    assert len(ready3) == 1
    assert ready3[0].id == "task_3"
