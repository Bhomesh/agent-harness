"""Event-driven messaging and observer bus for AgentForge."""

import asyncio
from typing import Callable, Coroutine, List, Any
from agentforge.core.types import AgentEvent

EventHandler = Callable[[AgentEvent], Coroutine[Any, Any, None]]

class MessageBus:
    """Central asynchronous pub/sub event bus."""

    def __init__(self):
        self._handlers: List[EventHandler] = []
        self._event_history: List[AgentEvent] = []

    def subscribe(self, handler: EventHandler):
        if handler not in self._handlers:
            self._handlers.append(handler)

    def unsubscribe(self, handler: EventHandler):
        if handler in self._handlers:
            self._handlers.remove(handler)

    async def publish(self, event: AgentEvent):
        self._event_history.append(event)
        # Dispatch to all handlers concurrently
        coros = [handler(event) for handler in self._handlers]
        if coros:
            results = await asyncio.gather(*coros, return_exceptions=True)
            for r in results:
                if isinstance(r, Exception):
                    # Keep bus resilient against subscriber errors
                    pass

    def get_history(self) -> List[AgentEvent]:
        return list(self._event_history)
