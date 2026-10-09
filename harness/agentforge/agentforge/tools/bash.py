"""Bash shell execution tool."""

import asyncio
import os
from typing import Dict, Any, Optional
from agentforge.tools.base import BaseTool

class BashTool(BaseTool):
    """Executes safe bash commands asynchronously with timeout and output capture."""

    name = "bash"
    description = "Execute shell commands in the workspace. Returns stdout, stderr, and exit status."
    parameters_schema = {
        "type": "object",
        "properties": {
            "command": {
                "type": "string",
                "description": "The exact shell command to execute."
            },
            "cwd": {
                "type": "string",
                "description": "Optional working directory path."
            },
            "timeout": {
                "type": "integer",
                "description": "Timeout in seconds (default: 30)."
            }
        },
        "required": ["command"]
    }

    def __init__(self, default_cwd: Optional[str] = None):
        self.default_cwd = default_cwd or os.getcwd()

    async def run(self, command: str, cwd: Optional[str] = None, timeout: int = 30, **kwargs) -> str:
        target_dir = cwd or self.default_cwd
        if not os.path.exists(target_dir):
            os.makedirs(target_dir, exist_ok=True)

        proc = await asyncio.create_subprocess_shell(
            command,
            cwd=target_dir,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        try:
            stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=timeout)
            out_str = stdout.decode("utf-8", errors="replace")
            err_str = stderr.decode("utf-8", errors="replace")
            exit_code = proc.returncode

            result_parts = []
            if out_str:
                result_parts.append(f"STDOUT:\n{out_str}")
            if err_str:
                result_parts.append(f"STDERR:\n{err_str}")
            result_parts.append(f"EXIT_CODE: {exit_code}")
            return "\n\n".join(result_parts)
        except asyncio.TimeoutError:
            try:
                proc.kill()
            except Exception:
                pass
            return f"Error: Command timed out after {timeout} seconds."
