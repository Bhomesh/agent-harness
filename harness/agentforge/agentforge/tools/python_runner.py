"""Python code interpreter tool for quick calculations, data manipulation, and tests."""

import asyncio
import sys
import tempfile
import os
from typing import Dict, Any
from agentforge.tools.base import BaseTool

class PythonRunnerTool(BaseTool):
    name = "python_interpreter"
    description = "Executes arbitrary Python 3 code in an isolated process. Returns printed outputs or traceback errors."
    parameters_schema = {
        "type": "object",
        "properties": {
            "code": {
                "type": "string",
                "description": "Valid Python 3 source code to execute."
            },
            "timeout": {
                "type": "integer",
                "description": "Execution timeout in seconds (default: 30)."
            }
        },
        "required": ["code"]
    }

    async def run(self, code: str, timeout: int = 30, **kwargs) -> str:
        with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False) as f:
            f.write(code)
            tmp_path = f.name

        try:
            proc = await asyncio.create_subprocess_exec(
                sys.executable,
                tmp_path,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )

            try:
                stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=timeout)
                out_str = stdout.decode("utf-8", errors="replace")
                err_str = stderr.decode("utf-8", errors="replace")

                res = []
                if out_str:
                    res.append(f"OUTPUT:\n{out_str}")
                if err_str:
                    res.append(f"STDERR / TRACEBACK:\n{err_str}")
                if not out_str and not err_str:
                    res.append("Execution completed with no output.")
                return "\n".join(res)
            except asyncio.TimeoutError:
                try:
                    proc.kill()
                except Exception:
                    pass
                return f"Error: Python execution timed out after {timeout}s."
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
