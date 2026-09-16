#!/usr/bin/env python3
from __future__ import annotations

import argparse
import copy
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SCHEMA = "axm.profession-fabric.bounded-variation-procedure-evidence/v0.1"


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def dotted(value, path: str):
    current = value
    for part in path.split("."):
        if isinstance(current, list):
            current = current[int(part)]
        else:
            current = current[part]
    return current


def is_sha256(value) -> bool:
    return (
        isinstance(value, str)
        and len(value) == 64
        and value == value.lower()
        and all(ch in "0123456789abcdef" for ch in value)
    )


def git_head(checkout: Path) -> str:
    return subprocess.check_output(
        ["git", "-C", str(checkout), "rev-parse", "HEAD"],
        text=True,
    ).strip()


def normalize_case(spec: dict) -> dict:
    checkout = ROOT / spec["checkout_path"]
    summary_path = ROOT / spec["summary_path"]
    summary = load_json(summary_path)
    variants = dotted(summary, spec["variants_path"])
    normalized_variants = []
    for item in variants:
        digests = {path: dotted(item, path) for path in spec["variant_digest_paths"]}
        normalized_variants.append(
            {
                "seed": dotted(item, spec["variant_seed_path"]),
                "status": (
                    dotted(item, spec["variant_status_path"])
                    if spec.get("variant_status_path")
                    else "PASS_BY_SUMMARY_CONSTRUCTION"
                ),
                "digests": digests,
            }
        )
    return {
        "id": spec["id"],
        "repository": spec["repository"],
        "expected_head": spec["expected_head"],
        "observed_head": git_head(checkout),
        "summary_path": spec["summary_path"],
        "summary_sha256": sha256_file(summary_path),
        "summary_state": dotted(summary, spec["summary_state_path"]),
        "summary_pass_states": list(spec["summary_pass_states"]),
        "base_source_digest": dotted(summary, spec["base_digest_path"]),
        "family_digest": dotted(summary, spec["family_digest_path"]),
        "variants": normalized_variants,
        "variant_pass_states": list(spec.get("variant_pass_states", [])),
        "negative_control_state": dotted(summary, spec["negative_state_path"]),
        "negative_hold_states": list(spec["negative_hold_states"]),
        "truth_boundary": dotted(summary, spec["truth_boundary_path"]),
        "mutation_authority": list(spec["mutation_authority"]),
        "immutable_contract": list(spec["immutable_contract"]),
        "domain_owner": spec["domain_owner"],
        "domain_evaluator": spec["domain_evaluator"],
    }


def validate_normalized(case: dict) -> list[str]:
    errors: list[str] = []
    if case["observed_head"] != case["expected_head"]:
        errors.append("exact repository head mismatch")
    if case["summary_state"] not in case["summary_pass_states"]:
        errors.append("source-owned family summary is not PASS")
    if not is_sha256(case["base_source_digest"]):
        errors.append("base source digest is not lowercase sha256")
    if not is_sha256(case["family_digest"]):
        errors.append("family digest is not lowercase sha256")
    if not case["mutation_authority"]:
        errors.append("mutation authority is empty")
    if not case["immutable_contract"]:
        errors.append("immutable contract is empty")
    if not isinstance(case["truth_boundary"], str) or not case["truth_boundary"].strip():
        errors.append("truth boundary is empty")

    variants = case["variants"]
    if len(variants) < 3:
        errors.append("fewer than three retained variants")
    seeds = [item["seed"] for item in variants]
    if len(set(seeds)) != len(seeds):
        errors.append("retained variant seeds are not unique")

    expected_variant_states = case["variant_pass_states"]
    if expected_variant_states:
        for variant in variants:
            if variant["status"] not in expected_variant_states:
                errors.append(f"variant seed {variant['seed']} is not PASS")

    digest_keys = sorted({key for variant in variants for key in variant["digests"]})
    for key in digest_keys:
        values = [variant["digests"].get(key) for variant in variants]
        if not all(is_sha256(value) for value in values):
            errors.append(f"variant digest field {key} is malformed")
        elif len(set(values)) != len(values):
            errors.append(f"variant digest field {key} is not materially distinct")

    if case["negative_control_state"] not in case["negative_hold_states"]:
        errors.append("retained negative control is not an allowed HOLD state")
    return errors


def build_evidence(manifest_path: Path, output_dir: Path) -> dict:
    manifest = load_json(manifest_path)
    required_material_domains = manifest.get("required_material_domains", 2)
    if not isinstance(required_material_domains, int) or isinstance(required_material_domains, bool) or required_material_domains < 2:
        raise ValueError("required_material_domains must be an integer >= 2")

    cases = [normalize_case(spec) for spec in manifest["cases"]]
    case_results = []
    for case in cases:
        errors = validate_normalized(case)
        case_results.append({**case, "state": "PASS" if not errors else "HOLD", "errors": errors})

    # Harness-level negative control: deliberately duplicate one output identity.
    synthetic = copy.deepcopy(cases[0])
    synthetic["variants"][1]["digests"] = copy.deepcopy(synthetic["variants"][0]["digests"])
    synthetic_errors = validate_normalized(synthetic)
    duplicate_detected = any("not materially distinct" in error for error in synthetic_errors)

    checks = {
        "required_material_domains_met": len(case_results) >= required_material_domains,
        "all_source_owned_family_runs_pass": all(item["state"] == "PASS" for item in case_results),
        "all_exact_heads_match": all(item["observed_head"] == item["expected_head"] for item in case_results),
        "all_cases_retain_negative_hold": all(
            item["negative_control_state"] in item["negative_hold_states"] for item in case_results
        ),
        "duplicate_output_identity_negative_control_holds": duplicate_detected,
    }
    state = "PASS_BOUNDED_VARIATION_PROCEDURE_PROBE" if all(checks.values()) else "HOLD_PROCEDURE_PROBE"
    evidence = {
        "schema": SCHEMA,
        "state": state,
        "profession": manifest["profession"],
        "profession_status": manifest["profession_status"],
        "promotion_effect": manifest["promotion_effect"],
        "procedure_id": manifest["procedure_id"],
        "required_material_domains": required_material_domains,
        "observed_material_domains": len(case_results),
        "checks": checks,
        "cases": case_results,
        "harness_negative_control": {
            "mutation": "duplicate all output digests of variant[0] into variant[1]",
            "state": "HOLD_AS_REQUIRED" if duplicate_detected else "FAIL_NEGATIVE_CONTROL",
            "errors": synthetic_errors,
        },
        "historical_observation": manifest.get("historical_observation"),
        "truth_boundary": manifest["truth_boundary"],
        "nonclaims": [
            "No source-domain mutation logic is implemented by Profession Fabric.",
            "No source-domain acceptance decision is replaced by this procedure.",
            "No Universal Creation procedural engine is implied or requested by this evidence.",
            "No aesthetic, runtime, gameplay, biological, meteorological, production-readiness, CANON, or profession-promotion claim follows from this PASS."
        ],
    }
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "summary.json").write_text(json.dumps(evidence, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    (output_dir / "manifest.json").write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return evidence


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    evidence = build_evidence(ROOT / args.manifest, ROOT / args.output)
    print(json.dumps(evidence, indent=2, sort_keys=True))
    return 0 if evidence["state"] == "PASS_BOUNDED_VARIATION_PROCEDURE_PROBE" else 2


if __name__ == "__main__":
    raise SystemExit(main())
