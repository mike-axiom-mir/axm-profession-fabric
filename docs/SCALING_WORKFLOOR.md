# Profession Fabric Scaling Workfloor v0.1

The path from five experiments to 100+ usable professions must preserve depth, provenance, isolation, and anti-overlap discipline.

## Counts mean different things

1. **Target** — named research direction in `registry/profession-targets.json`.
2. **Draft** — isolated package shell under construction; not registered and not capability.
3. **EXPERIMENTAL** — registered package with a real body and initial source/evidence structure; still not counted as usable.
4. **TEST** — representative professional fixtures have been exercised with evidence under the package's declared scope.
5. **WORKING** — broader representative evidence and portability thresholds are satisfied.
6. **CANON** — mature accepted professional contract under current AXM roots/evidence.

Only TEST / WORKING / CANON count toward the 100+ usable-profession milestone.

## Worker lane protocol

Before claiming a target:

1. refresh `main`, `registry/professions.json`, `registry/build-queue.json`, open PRs/branches, and existing profession directories;
2. treat semantic profession overlap as overlap even when target IDs differ;
3. prefer an unoccupied profession/problem over duplicate research;
4. record source/provenance and known gaps before status promotion;
5. no-change/HOLD is better than a duplicate or fake-deep package.

Before publishing:

1. rescan newest work;
2. ensure the package is isolated and its dependencies are contract-only;
3. run all repository validators;
4. state what professional evidence exists and what does not;
5. do not upgrade maturity merely because structure validates.

## Scaffold flow

`npm run scaffold -- <profession-id> --dry-run`

prints the deterministic plan.

`npm run scaffold -- <profession-id> --write`

creates an **unregistered DRAFT** from the canonical body/package templates plus a research checklist. The tool refuses an existing registered package or an existing draft path.

A generated draft intentionally contains placeholders. It must go through profession mapping, evidence design, tools/procedures, failures/handoffs, fixtures, and review before registration.

## Research/deepening order

A useful package should be built from actual professional work structure where possible:

- authoritative standards/references;
- observed professional workflows/artifacts;
- real failure cases and edge conditions;
- tools and decision boundaries;
- cross-profession handoffs;
- representative and adversarial fixtures;
- executor/intelligence portability evidence.

The strongest early targets are high-leverage professions that improve building/testing/integration/research of later professions, but the queue is advisory rather than authority.

## High-stakes domains

Health, legal, finance, security, infrastructure and other consequential targets need domain-specific evidence and constraints before promotion. Scaffolding or registration never implies authorization for regulated practice.
