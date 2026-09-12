# Data / Security / Product Cohort

Adds five isolated `EXPERIMENTAL` professions:

- Database Engineer
- Application Security Engineer
- Privacy Engineer
- Product Manager
- Product Designer

## Boundary decisions

- Database Engineering owns database mechanics/integrity/recovery, not business meaning or privacy/security acceptance.
- Application Security is defensive and authorization-bounded; package capability never expands permission or performs risk acceptance.
- Privacy Engineering owns technical privacy risk/data-lifecycle work, not legal advice or compliance certification.
- Product Management owns delegated product problem/outcome/scope decisions, not research/design/engineering/high-stakes specialist findings.
- Product Design owns interaction/flow/information/state artifacts, not user-research findings, product priority, accessibility certification, or implementation authority.

## Reference truth

- ISO/IEC 9075-1:2023 remains the published SQL framework; a 2026 corrigendum exists and a later edition is still under development.
- OWASP ASVS 5.0.0 is the current stable ASVS seed.
- NIST Privacy Framework 1.0 is used as final guidance; PF 1.1 is explicitly stored as Initial Public Draft context, not final.
- ISO 9241-210:2019 was reviewed/confirmed in 2025 and remains current for human-centred design principles/activities.

## Truth boundary

After this cohort the registry has 15 implemented packages, all `EXPERIMENTAL`; the usable counter remains `0/100` until profession-relevant evidence supports `TEST` or higher.
