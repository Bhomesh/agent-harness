"""HTTP Client Tool for testing REST endpoints and fetching remote resources."""

import httpx
import json
from typing import Dict, Any, Optional
from agentforge.tools.base import BaseTool

class HTTPClientTool(BaseTool):
    name = "http_request"
    description = "Make HTTP GET or POST requests to test APIs, microservices, or scrape content."
    parameters_schema = {
        "type": "object",
        "properties": {
            "method": {"type": "string", "enum": ["GET", "POST", "PUT", "DELETE"], "description": "HTTP method."},
            "url": {"type": "string", "description": "Target URL."},
            "headers": {"type": "object", "description": "Optional HTTP headers."},
            "body": {"type": "string", "description": "Optional request body (JSON or text)."}
        },
        "required": ["method", "url"]
    }

    async def run(self, method: str, url: str, headers: Optional[Dict[str, str]] = None, body: Optional[str] = None, **kwargs) -> str:
        async with httpx.AsyncClient(timeout=15.0) as client:
            json_body = None
            data_body = None
            if body:
                try:
                    json_body = json.loads(body)
                except Exception:
                    data_body = body

            res = await client.request(
                method=method.upper(),
                url=url,
                headers=headers,
                json=json_body,
                content=data_body
            )
            return f"Status: {res.status_code}\nHeaders: {dict(res.headers)}\nBody:\n{res.text[:2000]}"
