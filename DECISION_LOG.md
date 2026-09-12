# AXM Profession Fabric — Decision Log

Durable architectural decisions. Prefer append/supersede over silent historical rewrite.

## 2026-09-12 — Profession Fabric identity

**Decision:** The repository studies reconstruction of human professional work structures as portable, inspectable **Professional Bodies**.

**Consequence:** Do not reduce the project to role prompts, agent personas, or generic skill lists.

## 2026-09-12 — Three-layer separation

**Decision:** Intelligence, Professional Body, and Institution are separate architectural layers.

**Consequence:** Model-specific behavior must not silently become professional canon, and institution-specific authority must not silently become profession knowledge.

## 2026-09-12 — Work structure before personality

**Decision:** Reconstruct the work structure of a profession, not the stereotype/personality of a professional.

**Consequence:** Profession mapping focuses on observations, decisions, knowledge, tools, procedures, evidence, artifacts, memory, failure modes, handoffs, and boundaries.

## 2026-09-12 — Evidence before status

**Decision:** Schema validity and convincing output are insufficient for `WORKING` or `CANON` status.

**Consequence:** Each profession body must define and satisfy profession-relevant evidence and professional fixtures for its declared scope.

## 2026-09-12 — Swappable intelligence

**Decision:** A Professional Body is designed to be usable by more than one intelligence where feasible.

**Consequence:** Cross-intelligence portability and role-only baselines are important research tests for separating professional machinery from raw model capability.

## 2026-09-12 — AXM internal merge authority

**Decision:** Profession Fabric internal constitutional merge gates are Truth, Agency / non-domination, Continuity, and Wisdom before speed.

**Consequence:** No founder, maintainer, human, model, or account holder receives automatic constitutional rank. Technical write/merge permission remains an execution capability only.

## 2026-09-12 — First milestone

**Decision:** The first milestone is **Foundation Contract**, not mass production of profession profiles.

**Consequence:** The initial schema/spec/compiler/evidence/test structure should be attacked by one or two bounded profession experiments before scaling to many professions.

## 2026-09-12 — Profession package isolation

**Decision:** Every reconstructed profession owns an isolated package containing its body, maps, knowledge, tool contracts, procedures, failures, handoffs, and professional tests.

**Consequence:** Profession-owned machinery stays package-local by default. Cross-profession reuse happens through declared exports/contracts or explicit institutional services, not silent copying or shared hidden prompts.

## 2026-09-12 — Execution-neutral reuse

**Decision:** Profession packages should be reusable by humans, AI models, other machine intelligences, hybrids, and deterministic flows where the bounded procedure permits it.

**Consequence:** Execution surface never upgrades professional authority or evidence. A deterministic flow must stop at judgment boundaries it cannot satisfy; a powerful model may not bypass the same professional evidence boundary.

## 2026-09-12 — First profession experiment

**Decision:** Software QA / Playtest is the first profession used to attack the package/body contract.

**Consequence:** It remains `EXPERIMENTAL`; Ghost Studio observations seed the first body, but the experiment must expose missing human-profession knowledge rather than being mislabeled as a complete reconstruction of software QA.
