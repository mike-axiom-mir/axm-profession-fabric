# Software QA / Playtest — Experimental Professional Body

This package is the first Profession Fabric experiment.

It is **not** a claim that AXM has reconstructed the full human software-QA profession. It is a bounded compilation seeded by observed QA / playtest work in AXM Ghost Studio and by the repository-wide evidence rules.

## What this package is trying to capture

The useful specialist behavior is not "be skeptical" or "act like QA." It is a repeatable professional structure:

1. establish the exact candidate and accepted expectation;
2. reproduce through the most faithful available surface;
3. isolate product behavior from harness/environment behavior;
4. probe boundaries, transitions, recovery, and negative/control cases;
5. preserve accepted behavior as bounded regression evidence;
6. label evidence no stronger than the execution/observation supports;
7. detect cross-role contract changes instead of treating every red test as a product defect;
8. stop or hand off when QA would otherwise invent the expected behavior.

## Reuse surfaces

The same package is intended to support:

- a human tester following the maps/procedures;
- a model operating with the body as professional scaffolding;
- another machine intelligence;
- deterministic software traversing deterministic procedure steps and stopping at judgment/observation boundaries.

No surface is automatically more authoritative.

## Package contents

- `body.json` — semantic Professional Body.
- `maps/workflow.json` — professional workflow graph.
- `maps/ownership.json` — QA decision/consult/escalation map.
- `maps/evidence.json` — claim-to-evidence map.
- `knowledge/map.json` — current knowledge coverage and research gaps.
- `tools/manifest.json` — executor-neutral QA tool contracts.
- `procedures/` — reusable procedures with deterministic/judgment/observation boundaries.
- `failures/library.json` — characteristic professional failure modes.
- `handoffs/contracts.json` — packets for adjacent professions.
- `tests/professional-fixtures.json` — adversarial fixtures for testing the body itself.

## Current truth boundary

Ghost Studio gives unusually good experimental observations of QA behavior, including input edges, deterministic/browser distinction, rendered evidence, loop closure, state-dependent consequence testing, and cross-role conflicts.

It does **not** provide the full breadth of human software QA across enterprise software, mobile, distributed systems, accessibility, performance, security, regulated environments, test planning, team leadership, and other contexts.

Those missing areas are recorded in `knowledge/map.json` rather than being invented.
