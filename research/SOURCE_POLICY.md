# Profession Research Source Policy v0.1

## Purpose

Profession Fabric should reconstruct human professional work from traceable evidence rather than from model familiarity alone.

The research layer therefore records both **what a source says** and **what kind of source it is**.

## Truth types stay distinct

Examples:

- an O*NET incumbent/expert task statement is occupational evidence;
- an employer-posting software-skill record is labour-market/tool evidence;
- an ESCO essential/optional occupation-skill relation is taxonomy/expert-classification evidence;
- a NICE Work Role is a grouping of cybersecurity work, not automatically a job or occupation;
- a domain standard can define requirements without defining the whole profession;
- an AXM project record can be observed practice without being representative of the whole industry.

The compiler must not flatten these into an unlabeled list of "skills".

## Legal modes

### `ingest-adapt`
The source permits copying/adaptation under known conditions. Preserve required attribution, version and modification notices.

### `ingest-adapt-conditional`
Machine-readable/adaptable use is possible, but an additional condition must be checked (for example artifact-specific copyright markings or ShareAlike obligations) before adapting content.

### `reference-implementation`
The source may be used to guide implementation/reference work but is not treated as freely remixable profession content.

### `reference-only`
Store public metadata, designation, edition/status and links only. Do not copy protected source content into Professional Bodies or machine research packets.

### `conditional-reference`
Rights vary by artifact/version or remain insufficiently established for bulk ingestion. Reference conservatively until exact permission is verified.

## Crosswalk policy

AXM professions are not required to equal an external occupation code.

Every mapping records:

- external source and concept id;
- concept type (occupation, Work Role, classification unit, standard, etc.);
- relation: `exact`, `broader`, `narrower`, `partial`, or `adjacent`;
- confidence;
- rationale.

Multiple mappings are normal. A one-to-one crosswalk is a result to prove, not a default assumption.

## Source-method policy

Where a source exposes method/date metadata, preserve it.

For example O*NET 31.0 uses multiple collection and analysis methods across fields. Job-incumbent tasks, occupational-expert ratings, analyst-derived activities, employer-posting software skills and ML/AI-assisted interest data must remain distinguishable.

## Restricted standards

Under this policy:

- SFIA 9 is reference-only unless AXM later obtains a license that permits the intended use/distribution.
- ISO standards content is reference-only; public designation/edition/status metadata may be stored, but copyrighted standard text is not fed into the compiler/AI without permission.
- IEEE standards content is reference-only absent permission to reproduce it.
- older ISCO-08 descriptive material is conditional-reference; prefer ESCO's reusable ISCO mappings where possible.

## Research vs canon

A research packet can say:

- the current body covers a human-work structure;
- evidence suggests a gap;
- a source conflicts with another source;
- a mapping is uncertain;
- a repair should be investigated.

It cannot silently rewrite the package.

Body changes require a later explicit Profession Compiler / review delta with the research packet as provenance.

Research also cannot promote maturity. TEST/WORKING/CANON remain evidence-gated separately.
