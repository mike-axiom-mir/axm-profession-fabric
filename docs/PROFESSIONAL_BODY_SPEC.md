# Professional Body Specification v0.1

A **Professional Body** is an inspectable package of profession-specific machinery that an intelligence can use to perform bounded professional work.

It is not the intelligence itself and it is not a claim of human equivalence.

## Required contract areas

Every body must explicitly define the following areas. The machine-readable counterpart is `schemas/professional-body.schema.json`.

### Identity and purpose

- stable profession id;
- display name;
- status;
- bounded purpose;
- AXM roots.

### Scope

Define:

- what this profession owns;
- what it does not own;
- when it must escalate or request another profession.

Scope exists to prevent a capable intelligence from silently absorbing every adjacent discipline.

### Intelligence interface

A body must state the minimum reasoning capabilities it assumes and how execution may adapt between intelligences.

The intelligence is swappable by design. Model-specific tricks should not silently become professional standards.

### Institution interface

Define what institutional state/services the body reads and writes, including coordination contracts with other professions.

### Inputs and outputs

Professional work needs explicit expected inputs and artifacts/decisions produced. Missing required input should be detectable rather than filled with invented certainty.

### Knowledge

Knowledge must include:

- domains;
- references/sources;
- authority level;
- retrieval rules;
- uncertainty rules.

Professional knowledge should be retrievable and source-aware rather than copied indiscriminately into one enormous prompt.

### Skills / capabilities

Capabilities are reusable units of professional action. Each capability declares whether it is:

- deterministic;
- model-assisted;
- human-assisted;
- hybrid.

It also states what evidence is needed to claim success.

### Tools

Each tool declares:

- purpose;
- allowed actions;
- forbidden actions;
- failure boundary.

Possessing a tool does not grant professional authority outside the body's scope.

### Procedures

A procedure is an explicit professional workflow with:

- trigger;
- ordered steps;
- stop conditions;
- outputs.

Not every judgment should become a rigid checklist. Procedures are useful where they create repeatability, diagnosis, evidence, or safety.

### Memory

Keep at least four distinctions visible:

1. **canonical professional memory** — validated durable profession knowledge;
2. **project memory** — accepted facts for the current project/case;
3. **working memory** — hypotheses, temporary analysis, partial state;
4. **forbidden silent promotions** — information that may not become accepted truth without evidence.

Retention and promotion rules must be explicit.

### State interfaces

A body declares which state it may:

- read;
- propose changes to;
- write in a bounded way.

State authority should follow professional ownership and evidence rather than model capability.

### Evidence

The body defines accepted evidence labels, claim rules, and the minimum evidence needed for its lifecycle status.

A stronger model does not lower the evidence standard.

### Decision rights

Define:

- what the profession may decide independently;
- what requires consultation;
- what it must not decide.

Correct escalation is professional competence, not failure.

### Handoffs

Cross-profession handoffs must identify:

- destination role/body;
- trigger;
- minimum packet needed so the receiver can continue without reconstructing hidden chat reasoning.

### Failure library

A useful body should accumulate known professional failure modes with:

- symptom;
- likely causes;
- checks;
- repair path.

Failures are growth material when preserved honestly.

### Professional tests

Tests should measure professional behavior, not just file validity. Fixtures may include:

- seeded defects;
- incomplete requirements;
- misleading evidence;
- stale state;
- tool failure;
- cross-role conflicts;
- edge conditions;
- tasks where abstention or escalation is the correct response.

### Provenance

Knowledge and body changes require visible origins. Unknowns and dissent should survive instead of being polished away.

### Growth

A body may grow. Promotion of new capability requires explicit evidence/provenance and a rollback or repair route.

## Lifecycle statuses

### DRAFT

Structure may be incomplete. No performance claim.

### EXPERIMENTAL

The body can be executed or studied, but important professional behavior remains unproven.

### TEST

Representative fixtures exist and the body is being evaluated against them.

### WORKING

Profession-specific minimum evidence has been met on a defined scope. `WORKING` is always scoped; it does not mean the whole human profession has been reconstructed.

### CANON

A stable accepted Professional Body contract for its declared scope. CANON requires root fit, evidence, continuity, provenance, and explicit supersession when changed. It is not granted by a person or model status.

## Completeness is scoped

No profession body should claim universal completeness. Human professions vary by jurisdiction, institution, seniority, sub-discipline, culture, tooling, era, and task.

A truthful body should state the slice it reconstructs, for example:

- `software-qa / browser-game-regression / local-first / v0.3`
- not simply `QA expert`.

## Portability test

A key Profession Fabric experiment is whether the same body improves more than one intelligence.

Where practical, test at least:

- body + target intelligence;
- role-only baseline + same intelligence;
- body + a different intelligence.

The aim is to distinguish **professional machinery** from raw model capability.
