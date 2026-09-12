# Profession Package Layout v0.1

A Professional Body is the semantic contract for one profession. A **Profession Package** is the reusable filesystem unit that carries that body together with the profession-specific machinery needed to exercise it.

## Separation rule

Every profession owns its own package root:

```text
professions/<domain>/<profession>/
  package.json
  body.json
  README.md
  maps/
  knowledge/
  tools/
  procedures/
  failures/
  handoffs/
  tests/
```

A profession may add deeper local structure when evidence requires it, but must not scatter profession-owned machinery across unrelated repository folders.

The fabric-level repository may provide universal schemas, validators, registries, evidence vocabulary, and institutional interfaces. It must not quietly absorb profession-specific judgment into generic infrastructure merely because several professions use similar words.

## Why isolation matters

The same professional package should be reusable in different situations:

- a human following the procedures and maps;
- an AI/model using the body as professional scaffolding;
- a future machine intelligence using the same contracts;
- a hybrid human-machine team;
- a deterministic program invoking only the procedures and calculations it can execute without open-ended judgment.

The consumer changes. The accepted professional contract does not silently change with it.

## Package manifest

Each package has `package.json` validated against `schemas/profession-package.schema.json`.

The manifest declares:

- identity and status;
- the `body.json` path;
- supported execution surfaces;
- explicit reusable exports;
- every package-owned component file;
- shared institutional services it expects;
- dependencies on other profession packages, if any;
- isolation rules.

Unlisted package files fail validation. This makes hidden specialist machinery harder to accumulate.

## Execution surfaces

The v0.1 package contract recognizes four execution surfaces:

- `human-guided` — a human uses the body, tools, maps, and procedures directly;
- `ai-model` — a generative model reasons through the body;
- `machine-intelligence` — another machine intelligence inhabits or orchestrates the body;
- `deterministic-flow` — deterministic software invokes bounded exported procedures without pretending to possess professional judgment it does not have.

Supporting an execution surface means the package exposes a usable route for that surface. It does not mean every task in the profession can be completed by that surface.

## Contract-only composition

Cross-profession reuse is **contract-only by default**.

A package may export a procedure, skill, evidence contract, decision-support surface, or tool contract. Another profession or institution can invoke that export.

It must not silently copy private internals and then allow the copies to drift.

If two professions genuinely share a capability, first determine whether it is:

1. a universal institutional service;
2. one profession's exported capability consumed by another;
3. two superficially similar capabilities with different professional meaning.

Do not create a shared abstraction until evidence supports the abstraction.

## Maps are first-class

A profession may carry maps for work flow, ownership, evidence, knowledge, tools, state, escalation, failure, or other domain-specific structure.

Maps are not decoration. They should help a human, machine, or deterministic executor answer questions such as:

- Where am I in the professional process?
- What evidence is required next?
- Which decision belongs to this profession?
- When must work stop or escalate?
- Which tool or procedure is applicable?
- What state may be read or changed?

## Status boundary

A package can be structurally valid while remaining `DRAFT` or `EXPERIMENTAL`.

Package validation proves organization and contract integrity only. It does not prove that the profession has been faithfully reconstructed.
