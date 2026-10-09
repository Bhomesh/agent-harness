"""Filesystem operations tools for agents."""

import os
import glob
from typing import Dict, Any, Optional
from agentforge.tools.base import BaseTool

class ReadFileTool(BaseTool):
    name = "read_file"
    description = "Read contents of a file from disk with optional line ranges."
    parameters_schema = {
        "type": "object",
        "properties": {
            "path": {"type": "string", "description": "Absolute or relative file path to read."},
            "start_line": {"type": "integer", "description": "1-based starting line number (optional)."},
            "end_line": {"type": "integer", "description": "1-based ending line number (optional)."}
        },
        "required": ["path"]
    }

    async def run(self, path: str, start_line: Optional[int] = None, end_line: Optional[int] = None, **kwargs) -> str:
        if not os.path.exists(path):
            return f"Error: File '{path}' does not exist."
        if not os.path.isfile(path):
            return f"Error: '{path}' is not a regular file."

        with open(path, "r", encoding="utf-8", errors="replace") as f:
            lines = f.readlines()

        total = len(lines)
        start = max(1, start_line or 1) - 1
        end = min(total, end_line or total)

        selected = lines[start:end]
        indexed_lines = [f"{i + start + 1:4d} | {line}" for i, line in enumerate(selected)]
        return "".join(indexed_lines)

class WriteFileTool(BaseTool):
    name = "write_file"
    description = "Write or overwrite content to a file on disk. Creates parent directories if needed."
    parameters_schema = {
        "type": "object",
        "properties": {
            "path": {"type": "string", "description": "File path to write."},
            "content": {"type": "string", "description": "The exact content to write."}
        },
        "required": ["path", "content"]
    }

    async def run(self, path: str, content: str, **kwargs) -> str:
        os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        bytes_written = len(content.encode("utf-8"))
        return f"Successfully wrote {bytes_written} bytes to '{path}'."

class ListDirTool(BaseTool):
    name = "list_dir"
    description = "List files and directories in a given path."
    parameters_schema = {
        "type": "object",
        "properties": {
            "path": {"type": "string", "description": "Directory path (defaults to current dir)."},
            "pattern": {"type": "string", "description": "Optional glob pattern like '*.py'."}
        }
    }

    async def run(self, path: str = ".", pattern: Optional[str] = None, **kwargs) -> str:
        if not os.path.exists(path):
            return f"Error: Directory '{path}' does not exist."

        if pattern:
            matches = glob.glob(os.path.join(path, pattern))
            return "\n".join(matches) or "No files matching pattern."

        items = []
        for entry in os.scandir(path):
            t = "DIR " if entry.is_dir() else "FILE"
            size = entry.stat().st_size if entry.is_file() else "-"
            items.append(f"{t}  {size:>10}  {entry.name}")
        return "\n".join(sorted(items)) or "(Empty directory)"

class FileSearchTool(BaseTool):
    name = "search_code"
    description = "Search for a keyword or regex inside files within a directory."
    parameters_schema = {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "The text string or keyword to search for."},
            "directory": {"type": "string", "description": "Root directory to search (default: .)."}
        },
        "required": ["query"]
    }

    async def run(self, query: str, directory: str = ".", **kwargs) -> str:
        matches = []
        for root, _, files in os.walk(directory):
            if any(part.startswith(".") or part in ("__pycache__", "node_modules", "target") for part in root.split(os.sep)):
                continue
            for file in files:
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                        for line_idx, line in enumerate(f, 1):
                            if query in line:
                                matches.append(f"{filepath}:{line_idx}: {line.strip()}")
                                if len(matches) >= 50:
                                    break
                except Exception:
                    pass
        return "\n".join(matches) if matches else f"No matches found for '{query}'."
