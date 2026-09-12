# Software Backbone Cohort

This cohort extends Profession Fabric from five to ten isolated `EXPERIMENTAL` packages:

- Software Architect
- Backend Engineer
- Frontend Engineer
- DevOps Engineer
- Site Reliability Engineer

These are intentionally separate professions. Architecture does not silently own implementation; Backend does not own database/security/reliability policy; Frontend does not own product/UX/accessibility acceptance; DevOps does not own SLO policy; SRE does not own deployment mechanics or product priority.

## Primary reference seeds

- Software Architect: ISO/IEC/IEEE 42010:2022 (`https://www.iso.org/standard/74393.html`)
- Backend Engineer: RFC 9110 / STD 97 (`https://www.rfc-editor.org/rfc/rfc9110.html`)
- Frontend Engineer: WCAG 2.2 (`https://www.w3.org/TR/wcag/`)
- DevOps Engineer: DORA software-delivery performance guidance (`https://dora.dev/guides/dora-metrics/`)
- Site Reliability Engineer: Google SRE SLO practice (`https://sre.google/workbook/implementing-slos/`) and OpenTelemetry (`https://opentelemetry.io/docs/specs/otel/`)

A primary reference seeds bounded knowledge; it does not define an entire human profession.

## Truth boundary

All ten implemented packages remain `EXPERIMENTAL`. This cohort increases implemented breadth but leaves the usable milestone unchanged at `0/100` until packages pass profession-relevant evidence for `TEST` or higher.
