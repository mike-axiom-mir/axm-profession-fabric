# Professional Body Effect Experiment v0.1

This lane tests the central Profession Fabric hypothesis: **does the same intelligence do measurably better professional work when it receives an exact Professional Body than when it receives only a generic role instruction?**

It is not a prompt-quality contest and it does not assume the Professional Body wins.

## Experimental arms

### Arm A — role-only

Receives the exact task fixture plus a minimal instruction such as `Act as a software QA/playtest specialist.` It must not receive the Professional Body, package exports, package-derived summaries, or prior memory of those materials.

### Arm B — Professional Body

Receives the same task fixture, same tools/time budget, and the exact version-pinned Professional Body/package surfaces declared for the profession.

## Isolation rules

1. Use the same model/executor family and materially equivalent configuration for both arms whenever the platform allows it.
2. Each arm starts in a fresh context. No scratchpad, output, hidden state, or cross-arm conversation may transfer.
3. A role-only executor that has already read the tested Professional Body or a derivative summary is **contaminated** and cannot count as a clean control.
4. Task bytes, tool permissions, time/turn budget, and externally supplied evidence must be identical across arms except for the treatment itself.
5. Run order should be randomized or alternated across repeats so first/second-run effects do not silently become body effects.
6. Evaluators score anonymized outputs before the arm mapping is revealed.
7. Exact task, body, prompt, model/config, output and evaluator identities must be recorded by digest or stable version identifier where available.
8. Failed/blocked runs stay in the record; they are not silently discarded because they hurt one arm.

## Primary measures

The first fixtures prioritize measures that can be grounded from the task rather than aesthetics:

- supported-task success / correct findings;
- false-positive or invented-claim rate;
- reproduction / procedure precision;
- evidence and observation boundaries;
- uncertainty handling and explicit unknowns;
- correct handoffs when another profession or authority owns the next decision.

Time, token use, and tool-call count are secondary efficiency measures. Faster is not better if evidence quality drops.

## Claim boundary

A single pair of outputs cannot prove that Professional Bodies generally improve intelligence. One successful fixture is at most a **candidate effect** for that profession/task/executor combination.

Transfer claims require repeated tasks and a second intelligence/executor. No body maturity promotion follows automatically from an A/B win.

## Current clean-control boundary

The chat/session that authored or inspected a Professional Body is ineligible to serve as the clean role-only arm for that body. This repository explicitly records that limitation rather than simulating an uncontaminated control after exposure.

## First fixture

`qa-playtest-001` is a deterministic trace-review task for Software QA / Playtest. It contains three supported regressions and several tempting unsupported conclusions. The evaluator oracle is kept separate from the task packet and must not be provided to either execution arm.

Current state: **READY_NOT_RUN**. No body-effect result is claimed yet.
