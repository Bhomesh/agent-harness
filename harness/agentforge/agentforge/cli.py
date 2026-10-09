"""Interactive CLI & Live Multi-Agent Console for AgentForge."""

import asyncio
import sys
import argparse
from typing import Optional
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text
from rich.live import Live
from rich.spinner import Spinner
from rich.syntax import Syntax

from agentforge.config import AgentForgeConfig, LLMConfig
from agentforge.core.types import AgentEvent, EventType
from agentforge.orchestrator import SwarmOrchestrator
from agentforge.llm.factory import LLMProviderFactory

console = Console()

BANNER = """
[bold cyan]   ___                    __   ______                     [/bold cyan]
[bold cyan]  / _ | ___ ____ ___  ___/ /_ / __/ /_ ____ ___ ____      [/bold cyan]
[bold cyan] / __ |/ _ `/ -_) _ \\/ _  / // _// _ `/ __// _ `/ -_)     [/bold cyan]
[bold cyan]/_/ |_|\\_, /\\__/_//_/\\_,_/   /_/   \\_,_/_/   \\_, /\\__/    [/bold cyan]
[bold cyan]      /___/                                 /___/         [/bold cyan]
[bold green]  Autonomous Collaborative Multi-Agent AI Framework v0.1.0  [/bold green]
"""

ROLE_COLORS = {
    "supervisor": "bold magenta",
    "researcher": "bold cyan",
    "coder": "bold green",
    "qa": "bold yellow",
    "reviewer": "bold red",
    "orchestrator": "bold blue"
}

def format_event(event: AgentEvent) -> None:
    sender_lower = event.sender.lower()
    color = "white"
    for r, c in ROLE_COLORS.items():
        if r in sender_lower:
            color = c
            break

    if event.event_type == EventType.TASK_STARTED:
        console.print(f"[{color}]▶ [{event.sender}][/{color}] Starting Task: [bold]{event.payload.get('title', '')}[/bold]")
        if "description" in event.payload:
            console.print(f"   [dim]{event.payload['description'][:120]}...[/dim]")

    elif event.event_type == EventType.AGENT_THINKING:
        thinking = event.payload.get("thinking") or event.payload.get("message", "")
        console.print(f"[{color}]💭 [{event.sender}][/{color}] Thinking: [italic dim]{thinking[:160]}...[/italic dim]")

    elif event.event_type == EventType.TOOL_STARTED:
        tool = event.payload.get("tool")
        args = event.payload.get("arguments", {})
        console.print(f"   [yellow]⚡ Tool Call:[/yellow] [bold]{tool}[/bold] args: [dim]{str(args)[:100]}[/dim]")

    elif event.event_type == EventType.TOOL_FINISHED:
        tool = event.payload.get("tool")
        success = event.payload.get("success")
        duration = event.payload.get("duration_ms", 0)
        status_tag = "[green]✓ Success[/green]" if success else "[red]✗ Failed[/red]"
        console.print(f"   {status_tag} [bold]{tool}[/bold] ({duration}ms)")

    elif event.event_type == EventType.TASK_COMPLETED:
        title = event.payload.get("title", "")
        console.print(f"[{color}]✔ [{event.sender}][/{color}] Finished Task: [bold]{title}[/bold]\n")

async def run_swarm_cli(objective: str, provider: str, model: str):
    console.print(BANNER)
    console.print(Panel(
        f"[bold white]Target Objective:[/bold white] [bold yellow]{objective}[/bold yellow]\n"
        f"[bold white]LLM Backend:[/bold white] [green]{provider.upper()}[/green] ([cyan]{model}[/cyan])\n"
        f"[bold white]Active Swarm:[/bold white] Supervisor, Researcher, Coder, QA Engineer, Reviewer",
        title="[bold green]Mission Briefing[/bold green]",
        border_style="green"
    ))

    config = AgentForgeConfig(
        llm=LLMConfig(provider=provider, model=model)
    )
    llm = LLMProviderFactory.create(config.llm)

    # Health check
    console.print(f"[dim]Checking connection to {provider} backend...[/dim]")
    healthy = await llm.check_health()
    if not healthy:
        console.print(f"[bold red]Warning: Backend {provider} health check failed or API key not set. Continuing anyway...[/bold red]")
    else:
        console.print(f"[bold green]Connected successfully to {provider} ({model}).[/bold green]\n")

    orchestrator = SwarmOrchestrator(config=config, llm=llm)

    # Attach live event logger to bus
    async def bus_listener(event: AgentEvent):
        format_event(event)

    orchestrator.message_bus.subscribe(bus_listener)

    console.print("[bold cyan]══════════════════ Collaboration Commencing ══════════════════[/bold cyan]\n")
    result = await orchestrator.run(objective)
    console.print("[bold cyan]══════════════════ Collaboration Complete ══════════════════[/bold cyan]\n")

    # Display final synthesis report
    console.print(Panel(
        result["synthesis"],
        title="[bold green]Executive Mission Synthesis[/bold green]",
        subtitle=f"Duration: {result['duration_seconds']}s",
        border_style="bright_blue"
    ))

    # Summary table
    table = Table(title="Swarm Task Execution Ledger")
    table.add_column("Task ID", style="dim")
    table.add_column("Title", style="bold")
    table.add_column("Assigned Role", style="cyan")
    table.add_column("Status", style="green")

    for t in result["tasks"]:
        status_style = "green" if t["status"] == "completed" else "red"
        table.add_row(t["id"], t["title"], t["assigned_to"], f"[{status_style}]{t['status']}[/{status_style}]")

    console.print(table)

def main():
    parser = argparse.ArgumentParser(description="AgentForge: Autonomous Multi-Agent AI Framework")
    subparsers = parser.add_subparsers(dest="command")

    # Run command
    run_parser = subparsers.add_parser("run", help="Run a multi-agent objective")
    run_parser.add_argument("objective", type=str, help="Goal or problem description for the multi-agent team")
    run_parser.add_argument("--provider", type=str, default="ollama", help="LLM Provider (ollama, openai, gemini, anthropic)")
    run_parser.add_argument("--model", type=str, default="deepseek-r1:7b", help="Model name (e.g. deepseek-r1:7b, gpt-4o)")

    # Interactive REPL command
    subparsers.add_parser("interactive", help="Start interactive agent swarm REPL")

    # Web dashboard command
    web_parser = subparsers.add_parser("web", help="Launch AgentForge web dashboard")
    web_parser.add_argument("--host", type=str, default="127.0.0.1", help="Web host")
    web_parser.add_argument("--port", type=int, default=8000, help="Web port")

    args = parser.parse_args()

    if args.command == "run":
        asyncio.run(run_swarm_cli(args.objective, args.provider, args.model))
    elif args.command == "web":
        from agentforge.web.app import run_web_server
        run_web_server(host=args.host, port=args.port)
    elif args.command == "interactive" or args.command is None:
        console.print(BANNER)
        console.print("[bold yellow]Entering Interactive Mode. Type 'exit' to quit.[/bold yellow]\n")
        while True:
            try:
                user_input = console.input("[bold green]AgentForge > [/bold green]")
                if user_input.strip().lower() in ("exit", "quit", "q"):
                    break
                if not user_input.strip():
                    continue
                asyncio.run(run_swarm_cli(user_input.strip(), "ollama", "deepseek-r1:7b"))
            except (KeyboardInterrupt, EOFError):
                break
        console.print("\n[dim]Session terminated.[/dim]")

if __name__ == "__main__":
    main()
