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

## 2026-09-12 — 100+ usable-profession milestone

**Decision:** Profession Fabric becomes materially broad when at least 100 Profession Packages reach a usable evidence maturity, not when 100 role names or files exist.

**Consequence:** `DRAFT` and `EXPERIMENTAL` do not count. Under v0.1, only `TEST`, `WORKING`, and `CANON` count toward the machine-readable utility milestone.

## 2026-09-12 — Broad target map is not capability

**Decision:** Maintain a broad profession target registry so gaps are visible, while keeping target entries separate from implemented profession packages.

**Consequence:** The target map may grow quickly; it grants no professional capability, status, execution authority, or evidence by itself.

## 2026-09-12 — High-stakes profession promotion

**Decision:** Regulated/high-stakes profession targets require domain-specific evidence and boundaries before maturity promotion.

**Consequence:** Structural package validity, generic model performance, or target-map inclusion must never be used to imply authorization or safe independent practice in law, health, finance, security, infrastructure, or other consequential domains.

## 2026-09-12 — Second profession experiment

**Decision:** Software Integration / Release Engineer is the second deep package experiment, seeded from observed Ghost Studio integration behavior.

**Consequence:** The experiment focuses on dependency composition, semantic overlap, stale-base recomposition, exact-head verification, rollback continuity, and release readiness while preserving domain-profession decision boundaries. It remains `EXPERIMENTAL` until its own professional evidence supports promotion.

## 2026-09-12 — Institution roles are not automatically professions

**Decision:** Multi-discipline agent/studio roles may be used as observation sources but are not copied one-to-one into Profession Fabric unless the boundary corresponds to a defensible human profession/specialization.

**Consequence:** Ghost Studio's combined Experience / Art / Audio role will be decomposed into its constituent professional disciplines before any optional institution-level composite is defined. Game Director evidence will likewise be mapped carefully across creative direction, product identity, scope/milestone governance, and coordination rather than silently becoming a generic profession.

## 2026-09-12 — First game-development cohort

**Decision:** Gameplay Engineer, Game Systems Designer, and World / Encounter Designer become separate `EXPERIMENTAL` Profession Packages seeded from Ghost Studio observations.

**Consequence:** Their tools, maps, procedures, evidence, memory, failures, tests, and decision rights remain independently reusable. Cross-role consequences flow through declared handoffs rather than a blended game-development super-agent.

## 2026-09-12 — Scoped usability evidence is separate from full-body reconstruction status

**Decision:** Supersede the earlier simplistic assumption that the package/body construction `status` alone must drive the 100+ usable-profession counter. Full-body reconstruction maturity and bounded reusable evidence maturity are separate axes.

**Consequence:** A Professional Body may remain globally `EXPERIMENTAL` while a package-local, machine-validated maturity record establishes a `TEST` scope that is genuinely reusable. The usable counter reads `registry/maturity.json`, not package presence or rhetoric. `TEST` never means the complete human profession has been reconstructed.

## 2026-09-12 — Hard scoped TEST gate

**Decision:** A package can count as scoped `TEST` only with package-local evidence declaring exact sources/identities, representative professional fixtures, at least one success and one failure/abstention/boundary case, executor conditions, non-claims, remaining unknowns, roots assessment, and rollback/repair route.

**Consequence:** High-stakes domains require an additional domain-specific evidence and authorization-nonclaim gate. Automated v0.1 maturity validation rejects `WORKING` or `CANON` until stronger gates are explicitly designed.

## 2026-09-12 — First scoped TEST packages

**Decision:** Software QA / Playtest and Software Integration / Release are the first packages with scoped `TEST` evidence, based on merged Ghost Studio work that predates the maturity mechanism.

**Consequence:** Both full bodies remain `EXPERIMENTAL`. The tested scopes are the exact scopes recorded in their package-local evidence files; enterprise/general profession equivalence, human replacement, and broader production claims remain explicitly unsupported.
