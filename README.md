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

The same package can expose routes for:

- human-guided work;
- AI/model-guided work;
- other machine intelligence;
- deterministic flows that execute only bounded procedures they can honestly satisfy.

See `docs/PROFESSION_PACKAGE_LAYOUT.md`.

## What a Professional Body must eventually contain

A body is more than a role and skill list. The v0.1 contract requires explicit structure for:

- professional purpose and ownership boundaries;
- inputs and outputs;
- knowledge domains, references, retrieval rules, and uncertainty rules;
- reusable skills/capabilities;
- tools with allowed and forbidden actions;
- deterministic or bounded procedures;
- canonical, project, and working-memory separation;
- state interfaces and write boundaries;
- evidence labels and claim rules;
- decision rights and consultation boundaries;
- cross-profession handoffs;
- common professional failure patterns and repair paths;
- professional tests/fixtures;
- provenance;
- evidence-backed growth and rollback.

The machine should reproduce the **work structure** of a profession, not a stereotype or personality associated with that profession.

## Status

**EXPERIMENTAL FOUNDATION — v0.1**

The repository defines the Professional Body contract and isolated Profession Package format. It does **not** yet claim that any human profession has been fully reconstructed.

A body should not be called `WORKING` merely because its files validate or a model can talk convincingly about the domain. It must pass profession-relevant tests and produce grounded professional outputs on representative tasks.

## Foundation files

- `AGENTS.md` — repository governance and truth rules.
- `docs/THESIS.md` — research thesis and success boundary.
- `docs/PROFESSIONAL_BODY_SPEC.md` — semantic contract behind the body schema.
- `docs/PROFESSION_PACKAGE_LAYOUT.md` — isolated reusable package contract.
- `docs/PROFESSION_COMPILER.md` — proposed pipeline for reconstructing a profession.
- `docs/EVIDENCE_STANDARD.md` — evidence labels and professional claim rules.
- `docs/RESEARCH_TEAM.md` — initial meta-team for mapping and compiling professions.
- `schemas/professional-body.schema.json` — machine-readable body contract.
- `schemas/profession-package.schema.json` — machine-readable isolated package contract.
- `templates/` — neutral starting contracts.
- `registry/professions.json` — discoverable profession packages.
- `tests/` — dependency-free structural verification.
- `DECISION_LOG.md` — append-first durable architectural decisions.

## Current milestone

**First Profession Experiment**

Use one bounded human profession to attack the contract. Its missing structures and failures should improve the fabric rather than being hidden behind a larger role prompt.

The first experiment is Software QA / Playtest because AXM Ghost Studio already provides observed specialist work across reproduction, input edges, loop closure, rendered evidence, state-dependent consequence testing, cross-role conflict, and explicit non-claims.

## Non-claims

This repository does not currently prove that machines can replace humans, companies, institutions, or professions. It tests whether parts of accumulated professional practice can be encoded into portable, inspectable infrastructure.

Human creativity, lived experience, responsibility, embodiment, relationships, culture, judgment, and values remain distinct sources of capability. The architecture should make human and machine contribution composable without granting automatic rank to either category.
