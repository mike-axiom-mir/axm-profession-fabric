# Research → Profession Compilation Policy

Research evidence is upstream of Professional Packages. Compilation is an explicit diff, not silent mutation.

For every body-reviewed research packet, each declared gap receives one disposition:

- **ADOPTED** — the bounded finding is compiled into package machinery.
- **PARTIAL** — a boundary, handoff, or supporting mechanism is compiled, but the underlying professional depth remains open.
- **HOLD** — evidence says more research is required before safe compilation.
- **REJECTED** — the finding is intentionally not imported, with rationale.

`research-more` gaps may not become fully ADOPTED from the same packet. They require new evidence or remain PARTIAL/HOLD.

This v0.1 compiler pass does **not** rewrite audited `body.json` files. It adds package-local maps/tools/procedures/handoffs around the stable audited body and records the disposition in `research/compilations/`. A future body-contract supersession is a separate event.

Compilation never upgrades maturity automatically. New compiled machinery begins `NOT_TESTED`; existing scoped TEST records remain bounded to their recorded surfaces until new professional evidence is added.

High-stakes compilation must preserve authorization boundaries. Adding a security, maintenance, health, legal, finance, or infrastructure capability never grants permission to act, certify, sign off, access, test, isolate, energize, repair, or accept risk.