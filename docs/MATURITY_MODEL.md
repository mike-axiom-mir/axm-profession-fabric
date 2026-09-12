# Profession Fabric maturity model v0.1

Profession Fabric tracks two different questions that must not be collapsed.

## 1. Full-body reconstruction status

`body.json`, `package.json`, and `registry/professions.json` describe the maturity of the **whole declared Professional Body**. A body may remain `EXPERIMENTAL` while important human-profession coverage, contexts, tools, or executor evidence are still missing.

## 2. Scoped usability evidence

`registry/maturity.json` records whether a package has a **bounded reusable scope** that has reached evidence maturity. A package counts toward the 100+ usable-profession goal only when a machine-validated scoped evidence record reaches `TEST` or stronger.

This is not a shortcut around evidence. A `TEST` scoped record requires:

- an explicit tested scope;
- at least two primary/experimental evidence sources tied to exact identities;
- declared professional fixtures mapped to evidence;
- at least one passing success case;
- at least one passing failure, abstention, or boundary case;
- executor/runtime conditions;
- explicit non-claims and remaining unknowns;
- all four AXM roots passing for the promotion;
- package-local evidence declared in the manifest;
- stronger domain-specific gates for high-stakes professions.

`TEST` therefore means **usable under the recorded tested scope**, not "the human profession is fully reconstructed." Full-body `WORKING`/`CANON` remains a much stronger claim.

## v0.1 promotion ceiling

The automated scoped-maturity gate currently allows `TEST`. `WORKING` and `CANON` records are rejected until stronger multi-context / cross-executor / continuity gates are specified. Wisdom before speed: higher labels are not available merely because the enum exists.

## First evidence set

Software QA / Playtest and Software Integration / Release are the first packages evaluated because Ghost Studio generated real merged work, exact-version evidence, failures, HOLDs, handoffs, and truth-boundary behavior before this maturity mechanism existed.
