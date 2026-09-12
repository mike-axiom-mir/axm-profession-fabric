# AXM Profession Fabric

AXM Profession Fabric is an experimental attempt to reconstruct the working structure of human professions as inspectable, bounded, machine-usable **Professional Bodies**.

The target is not a persona prompt that says "act like a senior specialist." The target is the machinery that makes a specialist useful: knowledge, procedures, tools, memory boundaries, state access, evidence standards, decision rights, failure checks, handoffs, tests, provenance, and growth rules.

## Core separation

```text
INTELLIGENCE
  reasoning substrate: human, model, local model, future machine intelligence
        |
        v
PROFESSIONAL BODY
  profession-specific knowledge + tools + procedures + evidence + boundaries
        |
        v
INSTITUTION
  shared state + coordination + records + services + governance + continuity
```

The intelligence is not the profession. The profession is not the institution.

A stronger or weaker intelligence may inhabit the same Professional Body. The body may adapt execution detail to the intelligence, but professional standards and accepted truth must not silently change because the model changed.

## AXM roots

Internal Profession Fabric decisions are gated by:

1. **Truth**
2. **Agency / non-domination**
3. **Continuity**
4. **Wisdom before speed**

No founder, model, account owner, maintainer, or other named intelligence is the constitutional merge gate. Technical permission to press a merge button is not constitutional authority.

## Professional Bodies and Profession Packages

A **Professional Body** defines the semantic professional contract.

A **Profession Package** keeps one profession's reusable machinery isolated under `professions/<domain>/<profession>/`: its body, maps, knowledge, tool contracts, procedures, failure library, handoffs, and professional fixtures.

Cross-profession reuse is contract-only by default. Other packages or institutions consume explicit exports rather than silently copying another specialist's internals.

The same package can expose routes for human-guided work, AI/model-guided work, other machine intelligence, and deterministic flows that execute only bounded procedures they can honestly satisfy.

See `docs/PROFESSION_PACKAGE_LAYOUT.md`.

## What a Professional Body must eventually contain

A body is more than a role and skill list. The v0.1 contract requires explicit structure for professional purpose and ownership boundaries; inputs/outputs; knowledge/retrieval/uncertainty; reusable skills; tool contracts; deterministic or bounded procedures; memory separation; state interfaces; evidence standards; decision rights; handoffs; failure patterns; professional tests; provenance; and evidence-backed growth/rollback.

The machine should reproduce the **work structure** of a profession, not a stereotype or personality associated with that profession.

## Status

**EXPERIMENTAL FOUNDATION — v0.1**

The repository defines the Professional Body contract, isolated Profession Package format, target coverage map, and maturity accounting. It does **not** yet claim that any human profession has been fully reconstructed.

A body should not be called `WORKING` merely because its files validate or a model can talk convincingly about the domain. It must pass profession-relevant tests and produce grounded professional outputs on representative tasks.

## 100+ usable-profession goal

The long-term utility milestone is **100 or more usable Profession Packages**.

This is deliberately not a file-count or role-name target:

- `registry/profession-targets.json` maps the research backlog. A mapped name is not an implementation.
- `DRAFT` and `EXPERIMENTAL` packages do **not** count toward the usable milestone.
- only `TEST`, `WORKING`, and `CANON` packages count under `registry/coverage-policy.json`.
- high-stakes/regulated professions require domain-specific evidence; appearing in the target map grants no authority to execute regulated work.

Run `npm run progress` for the machine-counted state.

The current target map contains 100+ profession directions across software, AI/data, product/design, security/privacy, operations, business/finance, legal/governance, science/engineering, creative/media, education/research, health, manufacturing/infrastructure, and community/public systems.

## Institution roles are not automatically professions

Agent/studio role boundaries are useful observations, but Profession Fabric maps the underlying human professional disciplines rather than copying every institutional role one-to-one. `docs/GHOST_STUDIO_COHORT.md` records the first case: Gameplay, Systems, World, QA, and Integration map cleanly enough to isolate; the combined Experience / Art / Audio role must be decomposed, and Game Director spans multiple professional/institutional dimensions that need separate mapping.

## Foundation files

- `AGENTS.md` — repository governance and truth rules.
- `docs/THESIS.md` — research thesis and success boundary.
- `docs/PROFESSIONAL_BODY_SPEC.md` — semantic contract behind the body schema.
- `docs/PROFESSION_PACKAGE_LAYOUT.md` — isolated reusable package contract.
- `docs/PROFESSION_COMPILER.md` — pipeline for reconstructing a profession.
- `docs/EVIDENCE_STANDARD.md` — evidence labels and professional claim rules.
- `docs/RESEARCH_TEAM.md` — meta-team for mapping and compiling professions.
- `docs/GHOST_STUDIO_COHORT.md` — first observed-role to human-profession decomposition notes.
- `schemas/` — machine-readable body/package contracts.
- `templates/` — neutral starting contracts.
- `registry/professions.json` — implemented/discoverable profession packages.
- `registry/profession-targets.json` — broad profession research backlog.
- `registry/coverage-policy.json` — machine-readable definition of what counts toward the 100+ utility goal.
- `tests/` — dependency-free structural and coverage verification.
- `DECISION_LOG.md` — append-first durable architectural decisions.

## Current milestone

**Breadth map + deep profession experiments**

Build a broad 100+ target map while deepening isolated professions one at a time. Breadth identifies what remains; only evidence-backed maturity moves the usable counter.

Current isolated deep experiments:

1. **Software QA / Playtest** — reproduction, regression, input/state edges, evidence boundaries, rendered/human-playtest distinctions, and contract conflict detection.
2. **Software Integration / Release Engineer** — dependency ordering, semantic overlap, stale-base recomposition, exact-head verification, rollback continuity, and bounded release readiness.
3. **Gameplay Engineer** — player-control/action implementation, device/input response, retry/recovery, collision behavior, measurement, and cross-role consequences.
4. **Game Systems Designer** — rules/resources/progression/pressure, invariants, solvability, terminal conditions, and tradeoff contracts.
5. **World / Encounter Designer** — spatial topology, objective/encounter placement, reachability, route costs, traversal rhythm, and spatial evidence boundaries.

All five remain `EXPERIMENTAL` until their professional fixtures and cross-executor evidence justify promotion. The honest usable-profession counter therefore remains separate from implemented-package count.

## Non-claims

This repository does not currently prove that machines can replace humans, companies, institutions, or professions. It tests whether parts of accumulated professional practice can be encoded into portable, inspectable infrastructure.

Human creativity, lived experience, responsibility, embodiment, relationships, culture, judgment, and values remain distinct sources of capability. The architecture should make human and machine contribution composable without granting automatic rank to either category.
