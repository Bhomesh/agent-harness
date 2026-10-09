"""Unit tests for AgentForge tool execution engine."""

import pytest
import tempfile
import os
from agentforge.tools import (
    BashTool,
    ReadFileTool,
    WriteFileTool,
    ListDirTool,
    FileSearchTool,
    PythonRunnerTool,
    WebSearchTool,
    create_default_tool_registry
)

@pytest.mark.asyncio
async def test_bash_tool():
    tool = BashTool()
    res = await tool.execute("call_1", command="echo 'Hello AgentForge'")
    assert res.success is True
    assert "Hello AgentForge" in res.output

@pytest.mark.asyncio
async def test_filesystem_tools():
    with tempfile.TemporaryDirectory() as tmpdir:
        test_file = os.path.join(tmpdir, "test.txt")
        
        # Write
        writer = WriteFileTool()
        w_res = await writer.execute("call_w", path=test_file, content="Line 1\nLine 2\nLine 3\n")
        assert w_res.success is True
        assert os.path.exists(test_file)

        # Read
        reader = ReadFileTool()
        r_res = await reader.execute("call_r", path=test_file, start_line=1, end_line=2)
        assert r_res.success is True
        assert "Line 1" in r_res.output
        assert "Line 2" in r_res.output

        # List
        lister = ListDirTool()
        l_res = await lister.execute("call_l", path=tmpdir)
        assert l_res.success is True
        assert "test.txt" in l_res.output

        # Search
        searcher = FileSearchTool()
        s_res = await searcher.execute("call_s", query="Line 2", directory=tmpdir)
        assert s_res.success is True
        assert "test.txt:2: Line 2" in s_res.output

@pytest.mark.asyncio
async def test_python_runner_tool():
    runner = PythonRunnerTool()
    code = """
x = [i**2 for i in range(5)]
print(f"CALCULATED: {x}")
"""
    res = await runner.execute("call_py", code=code)
    assert res.success is True
    assert "CALCULATED: [0, 1, 4, 9, 16]" in res.output

@pytest.mark.asyncio
async def test_tool_registry():
    registry = create_default_tool_registry()
    schemas = registry.get_schemas()
    assert len(schemas) >= 6
    
    # Test dispatching
    res = await registry.execute("call_disp", "bash", {"command": "echo 'ok'"})
    assert res.success is True
    assert "ok" in res.output
