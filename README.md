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

## Executable coding workflow

The [deterministic coding workflow](workflows/code/README.md) connects six
existing software professionals through executable package exports. It maps
requirements to acceptance cases, creates reproducible JavaScript/Python source,
runs fresh observations, reports bounded readiness and retains verified
construction recipes on request. It works without a model. The tested scope
is explicit typed pure functions; full bodies and maturity counts are unchanged.

## What a Professional Body must eventually contain

A body is more than a role and skill list. The v0.1 contract requires explicit structure for professional purpose and ownership boundaries; inputs/outputs; knowledge/retrieval/uncertainty; reusable skills; tool contracts; deterministic or bounded procedures; memory separation; state interfaces; evidence standards; decision rights; handoffs; failure patterns; professional tests; provenance; and evidence-backed growth/rollback.

The machine should reproduce the **work structure** of a profession, not a stereotype or personality associated with that profession.

## Status

**EXPERIMENTAL PROFESSION FABRIC — v0.1**

The breadth milestone has been reached, but the usable-profession milestone has not.

Machine-validated state after the 2026-09-12 creation/evidence wave:

- **186 mapped profession targets**
- **100 constructed isolated Profession Packages**
- **75 BODY_REVIEWED research packets**
- **75 explicit research compilations**
- **10 packages with validated scoped `TEST` evidence**

All 100 full Professional Bodies remain `EXPERIMENTAL`. The 10 `TEST` records are bounded reusable evidence scopes in `registry/maturity.json`; they do **not** mean ten complete human professions have been reconstructed.

A body should not be called `WORKING` merely because its files validate or a model can talk convincingly about the domain. It must pass profession-relevant tests and produce grounded professional outputs on representative tasks.

## 100+ usable-profession goal

The long-term utility milestone remains **100 or more usable Profession Packages**.

This is deliberately not a file-count or role-name target:

- `registry/profession-targets.json` maps the research backlog. A mapped name is not an implementation.
- `DRAFT` and `EXPERIMENTAL` packages do **not** count toward the usable milestone.
- only scoped maturity records accepted under `registry/coverage-policy.json` count toward usable coverage; v0.1 currently validates `TEST` only and deliberately rejects `WORKING`/`CANON` until stronger gates are defined.
- high-stakes/regulated professions require domain-specific evidence; appearing in the target map grants no authority to execute regulated work.

Run `npm run progress` for the machine-counted state.

The current target map contains profession directions across software, AI/data, product/design, security/privacy, operations, business/finance, legal/governance, science/engineering, creative/media, education/research, health, manufacturing/infrastructure, and community/public systems.

## Institution roles are not automatically professions

Agent/studio role boundaries are useful observations, but Profession Fabric maps the underlying human professional disciplines rather than copying every institutional role one-to-one. `docs/GHOST_STUDIO_COHORT.md` records the first case: Gameplay, Systems, World, QA, and Integration map cleanly enough to isolate; combined institution roles are decomposed before profession-level canon is claimed.

## Foundation files

- `AGENTS.md` — repository governance and truth rules.
- `docs/THESIS.md` — research thesis and success boundary.
- `docs/PROFESSIONAL_BODY_SPEC.md` — semantic contract behind the body schema.
- `docs/PROFESSION_PACKAGE_LAYOUT.md` — isolated reusable package contract.
- `docs/PROFESSION_COMPILER.md` — pipeline for reconstructing a profession.
- `docs/EVIDENCE_STANDARD.md` — evidence labels and professional claim rules.
- `docs/RESEARCH_TEAM.md` — meta-team for mapping and compiling professions.
- `docs/GHOST_STUDIO_COHORT.md` — first observed-role to human-profession decomposition notes.
- `docs/MILESTONE_100.md` — durable 100-body / 10-scoped-TEST checkpoint and next-phase boundary.
- `schemas/` — machine-readable body/package/contracts.
- `templates/` — neutral starting contracts.
- `registry/professions.json` — implemented/discoverable profession packages.
- `registry/profession-targets.json` — broad profession research backlog.
- `registry/coverage-policy.json` — machine-readable definition of usable coverage.
- `registry/maturity.json` — package-local scoped maturity records that currently count toward usable evidence.
- `tests/` — dependency-free structural, research, package, maturity and coverage verification.
- `DECISION_LOG.md` — append-first durable architectural decisions.

## Current milestone

**Breadth milestone reached; evidence, activation and maturity are now the limiting work.**

The repository has 100 constructed bodies, but only evidence-backed scopes move the usable counter. The current ten scoped `TEST` professions are:

1. **Software QA / Playtest**
2. **Software Integration / Release Engineer**
3. **Gameplay Engineer**
4. **Game Systems Designer**
5. **World / Encounter Designer**
6. **Developer Tools Engineer**
7. **Browser / Web Runtime Engineer**
8. **Software Accessibility Engineer**
9. **3D Artist**
10. **Technical Artist**

The latest two promotions are deliberately narrow. Merged Universal Creation RTS foundry/polish work proves bounded real-3D creation, export/re-import inspection, provenance, LOD/geometry/material evidence and the ability to preserve visual failure as failure. It does **not** prove target-RTS import, collision/navigation correctness, target-device FPS, universal visual quality, Art Direction acceptance, or complete game-readiness.

Next-phase priorities are:

- deepen existing bodies from real merged work rather than multiplying names for their own sake;
- compare raw/role-only execution against the same intelligence using a Professional Body, then repeat across another intelligence;
- exercise profession handoffs/composition in real software, AI and creation-machine workflows;
- keep high-stakes domains behind domain-specific evidence and authorization boundaries;
- turn currently explicit unknowns such as target-engine integration, collision/navigation, device performance and human/user acceptance into separate tests rather than inferred success.

## Non-claims

This repository does not currently prove that machines can replace humans, companies, institutions, or professions. It tests whether parts of accumulated professional practice can be encoded into portable, inspectable infrastructure.

Human creativity, lived experience, responsibility, embodiment, relationships, culture, judgment, and values remain distinct sources of capability. The architecture should make human and machine contribution composable without granting automatic rank to either category.
