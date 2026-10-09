#!/usr/bin/env python3
"""
Evaluator for Velocity Swarm Suite
"""
import json, time, subprocess, sys

suite_path = "/home/manjaro/agentforge/velocity-swarm/velocity_eval_suite.json"
with open(suite_path, "r") as f:
    tests = json.load(f)

print(f"[*] Executing Velocity Swarm Evaluation Benchmark ({len(tests)} Tasks)...")
passed = 0
total = len(tests)

# Step 1: Run orchestrator
start = time.time()
res1 = subprocess.run(["/home/manjaro/agentforge/velocity-swarm/velocity_orchestrator.py", "/home/manjaro/velocity-template-test", "NovaFlow Cloud"], capture_output=True, text=True)
out1 = res1.stdout + res1.stderr

# Step 2: Run healer test
res2 = subprocess.run(["python3", "/home/manjaro/agentforge/velocity-swarm/test_healing.py"], capture_output=True, text=True)
out2 = res2.stdout + res2.stderr

all_out = out1 + "\n" + out2

for idx, t in enumerate(tests, 1):
    name = t.get("name")
    expected = t.get("expected")
    print(f"\n[Benchmark {idx}/{total}] {name}...")
    if expected.lower() in all_out.lower():
        print(f"  [PASS] Condition matched: '{expected}'")
        passed += 1
    else:
        print(f"  [FAIL] Expected '{expected}' not found.")

print("\n" + "=" * 50)
print(f"Velocity Benchmark Results: {passed}/{total} passed ({(passed/total)*100:.1f}%)")
print("=" * 50)
sys.exit(0 if passed == total else 1)
