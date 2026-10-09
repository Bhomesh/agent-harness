"""FastAPI backend with WebSocket real-time event streaming for AgentForge."""

import asyncio
import os
from typing import Dict, Any, List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
import uvicorn

from agentforge.config import AgentForgeConfig, LLMConfig
from agentforge.core.types import AgentEvent, EventType
from agentforge.orchestrator import SwarmOrchestrator
from agentforge.llm.factory import LLMProviderFactory

app = FastAPI(title="AgentForge Multi-Agent AI Web Platform")

# Active WebSocket clients
connected_clients: List[WebSocket] = []

class RunRequest(BaseModel):
    objective: str
    provider: str = "ollama"
    model: str = "deepseek-r1:7b"

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "version": "0.1.0"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            # Keepalive / listen for client actions
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        connected_clients.remove(websocket)

async def broadcast_event(event: AgentEvent):
    payload = {
        "event_id": event.event_id,
        "event_type": event.event_type.value,
        "sender": event.sender,
        "payload": event.payload,
        "timestamp": event.timestamp
    }
    for client in list(connected_clients):
        try:
            await client.send_json(payload)
        except Exception:
            if client in connected_clients:
                connected_clients.remove(client)

@app.post("/api/run")
async def run_objective(req: RunRequest):
    config = AgentForgeConfig(
        llm=LLMConfig(provider=req.provider, model=req.model)
    )
    llm = LLMProviderFactory.create(config.llm)
    orchestrator = SwarmOrchestrator(config=config, llm=llm)

    async def forward_to_ws(evt: AgentEvent):
        await broadcast_event(evt)

    orchestrator.message_bus.subscribe(forward_to_ws)

    # Run in background task or directly
    result = await orchestrator.run(req.objective)
    return JSONResponse(content=result)

@app.get("/", response_class=HTMLResponse)
async def serve_index():
    static_file = os.path.join(os.path.dirname(__file__), "static", "index.html")
    if os.path.exists(static_file):
        with open(static_file, "r", encoding="utf-8") as f:
            return f.read()
    return "<h1>AgentForge API Server running. UI file missing.</h1>"

def run_web_server(host: str = "127.0.0.1", port: int = 8000):
    uvicorn.run(app, host=host, port=port)

if __name__ == "__main__":
    run_web_server()
