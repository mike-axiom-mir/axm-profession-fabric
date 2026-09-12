# Professional Evidence Standard v0.1

Profession Fabric separates **what happened** from **what we think it means**.

Evidence labels are not prestige levels. Use the label that describes the actual observation.

## Core labels

### TESTED

A defined check was executed against the identified body/runtime/artifact and produced a recorded result.

State what was tested and on which exact version/composition.

### MEASURED

A quantity was observed with an explicit method/unit or reproducible calculation.

Do not turn a measurement into a quality claim without a justified interpretation.

### VISUALLY_INSPECTED

Rendered/visible output was actually viewed.

Static source inspection, DOM checks, image metadata, or captured drawing commands are not equivalent to viewing the rendered result.

### PLAYTESTED

A real interaction session was performed through the relevant player/user interaction surface.

Automated input simulation is useful evidence but must not be relabeled as a human/fresh-user playtest.

### OBSERVED

A real event, professional artifact, process, behavior, or environment was directly inspected but does not fit a more specific label.

### INFERRED

A conclusion follows from available evidence/reasoning but was not directly observed or tested.

State the supporting evidence and uncertainty.

### BLOCKED

A relevant evidence path was attempted or identified but could not be completed. State why.

### NOT_TESTED

The claim/dimension has not been tested. Use this explicitly rather than leaving silence that can be mistaken for success.

## Claim rules

1. Never upgrade evidence through wording.
2. Evidence applies to the exact body/version/composition tested unless transfer is explicitly justified.
3. A successful tool call is not automatically a successful professional outcome.
4. Schema validity proves structure only.
5. Passing deterministic tests does not prove subjective quality, ethics, usability, creativity, judgment, or real-world suitability unless the tests legitimately measure those dimensions.
6. Strong model performance must not be used to hide a missing Professional Body component.
7. Negative and contradictory evidence stays visible.
8. Professional abstention/escalation can be a passing result when the fixture requires it.

## Evidence packet

A reusable professional evidence packet should include:

- body id/version/status;
- intelligence/runtime used;
- task/fixture;
- relevant input/state version;
- tools/procedures invoked;
- output/artifact;
- evidence labels;
- measurements;
- failures/unknowns;
- cross-profession dependencies;
- provenance;
- reproduction route where possible.

## Lifecycle evidence

### DRAFT

No evidence minimum.

### EXPERIMENTAL

At least one executable path exists and unknowns are explicit.

### TEST

Representative fixtures exist, including failure/abstention cases appropriate to the profession.

### WORKING

The individual profession body defines its own minimum, but it must include representative successful work, important failure detection, evidence boundaries, and handoff/escalation behavior for the declared scope.

### CANON

Requires stable scoped evidence, provenance, continuity, root fit, rollback/repair routes, and explicit supersession for future incompatible changes.

## Baseline comparison

Where practical, evaluate:

1. role-only instruction + intelligence A;
2. Professional Body + intelligence A;
3. Professional Body + intelligence B.

Useful metrics may include correctness, omissions, unsupported claims, recovery, tool use, evidence quality, handoff quality, consistency, time/compute, and professional boundary adherence.

No single metric is automatically the objective. Profession-specific value determines what matters.
