# Local Profession Research Intake

This layer turns **version-pinned local occupational datasets** into deterministic AXM research slices. It does not fetch live data and it does not decide that an external occupation/work role equals an AXM profession.

## Supported local sources

- **O*NET 31.0**: use the downloadable JSON database (or individual JSON files). The importer currently understands occupation data, task statements, tasks→DWAs, knowledge, work activities, work context, software skills, job titles, and sample reported titles when present.
- **ESCO 1.2.1**: use the English CSV dataset plus the language-independent occupation-skill relation file. The importer joins occupation URIs to skill URIs while preserving relation type.

Real source snapshots belong under `research/local-intake/local-data/` and are ignored by Git. Pin the exact release in the source registry and keep source archive checksums outside generated profession canon.

## Commands

```bash
node tools/local-research-intake.mjs onet-slice <onet-json-dir> <O*NET-SOC-code> [out.json]
node tools/local-research-intake.mjs esco-slice <esco-csv-dir> <occupation-uri-or-id> [out.json]
node tools/local-research-intake.mjs discover-onet <onet-json-dir> "search words" [out.json]
node tools/local-research-intake.mjs discover-esco <esco-csv-dir> "search words" [out.json]
```

If no output path is supplied, JSON is written to stdout.

## Truth boundary

Discovery returns **candidate matches only**. Exact/broader/narrower/partial/adjacent crosswalk relations remain research judgments recorded in a Profession Research Packet. Source slices preserve field/source metadata instead of flattening every record into one confidence level.

The importer is local-first and dependency-free. Network retrieval, source-license upgrades, automatic body edits, and automatic maturity promotion are deliberately outside this tool.