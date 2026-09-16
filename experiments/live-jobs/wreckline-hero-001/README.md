# Live Job 002 — Wreckline Hero Vehicle 001

Date: 2026-09-16

Profession under test: `3d-game-asset-specialist`

Profession status entering task: **EXPERIMENTAL**

## Purpose

Use a real, already-authored game asset as the first live evidence task for the new 3D Game Asset Specialist body.

This job does not ask the profession to praise the asset. It asks the profession to preserve candidate identity, inspect the existing receipts, separate proven surfaces from open surfaces, and define the smallest target-runtime observation that could close the next evidence gap.

A correct outcome may be `HOLD`. Refusing promotion when runtime evidence is missing is positive evidence for the profession's truth boundary.

This is one machine cognition applying the profession method to one real AXM asset. It is not evidence of an independent specialist intelligence and it is not general proof of professional competence.

## Exact task identity

Source repository: `mike-axiom-mir/axm-wreckline`

Source PR: `#2` — `Build AXM Wreckline vertical slice v0.1`

Pinned source head: `ec382b15d642acfe647428094a5718053ef4ce20`

Candidate package: `assets/hero-vehicle-001`

Primary runtime candidate:

- path: `assets/hero-vehicle-001/models/wreckline-hero--lod0.glb`
- SHA-256: `7cf93c3dd80ab3952a6e8ce82accdd3c76bbc46a8aa631f642e108ceded2930e`
- instantiated triangles: `21,358`
- vertices: `47,870`
- nodes: `130`
- materials: `60`
- animation clip: `AssemblyMotion`
- clip channels: `22`

Related candidates:

- far LOD: `assets/hero-vehicle-001/models/wreckline-hero--lod1.glb` — `10,354` instantiated triangles according to Wreckline PR #2
- conservative collision: `assets/hero-vehicle-001/collision/wreckline-hero.glb` — `36` triangles according to Wreckline PR #2
- hardpoints: `assets/hero-vehicle-001/vehicle-hardpoints.json`
- module catalog: `assets/hero-vehicle-001/mountable-modules.json`
- initial loadout: `assets/hero-vehicle-001/initial-loadout.json`
- motion sidecar: `assets/hero-vehicle-001/vehicle-motion.json`

Authorship / rights state recorded by the Wreckline package: original AXM Wreckline modular vehicle recipe, no downloaded art/reference pixels, PolyForm Noncommercial 1.0.0 product license.

## Existing evidence accepted as input

The specialist may consume these receipts but must not silently widen them:

- generated Universal Creation asset package with editable/reconstructable authoring state;
- exact GLB identity and structural inspection;
- embedded base-colour, normal and ORM texture state;
- UV and tangent retention;
- decoded geometry validation for the generated leaf assets;
- near/far LOD measurements;
- separate collision candidate;
- five permanent chassis sockets and five module contracts;
- sampled animation poses and semantic node bindings;
- four retained software-rendered views;
- Wreckline static visual review passing the replacement-direction/modular-candidate claim only;
- Wreckline repository tests passing on the pinned head.

These inputs are evidence for their named surfaces. They are not target-runtime acceptance.

## Specialist task

### Gate A — identity and source continuity

Verify that every observation remains bound to the pinned Wreckline head and exact candidate SHA. Do not substitute a regenerated asset or a later branch head without opening a new receipt.

Expected state: **PASS from retained evidence**.

### Gate B — structural game-asset preparation

Check scale/units, up/forward convention, transforms, hierarchy, semantic node bindings, LOD presence, collision separation, hardpoint definitions, material/texture state and provenance.

Expected state: **PARTIAL PASS from retained evidence**. This does not prove host interpretation.

### Gate C — target/native runtime import

Import the exact LOD0 candidate into the declared Wreckline native target or, if Wreckline explicitly chooses a bounded proof host first, record that host as a proof runtime rather than silently calling it the final target.

Retain:

- runtime/engine name and exact version;
- importer settings;
- candidate SHA;
- imported scale/orientation/pivot result;
- required node/material/animation discovery;
- import warnings/errors;
- one reproducible launch command or project entrypoint;
- captured runtime frames or screenshots tied to the exact run.

Current state: **BLOCKED / NOT RUN**. Wreckline's native engineering manifest says host integration is pending and does not name a completed target-engine import.

### Gate D — continuous animation observation

Observe `AssemblyMotion` continuously rather than accepting sampled pose bounds alone. Check wheel/body/suspension motion for discontinuity, obvious penetration, detached geometry or broken node binding.

Current state: **NOT TESTED**. The asset receipt explicitly records `continuous_playback_verified: false`.

### Gate E — live module swap

Exercise at least one compatible empty-socket -> mounted-module -> alternate/empty transition through the native/runtime path. The module must remain separate from the chassis and the receipt must identify the socket, module contract, compatibility decision and observed result.

Current state: **NOT TESTED**. Wreckline has module contracts and empty hardpoints, but no retained native live-swap observation.

### Gate F — chase-context readability

Place the candidate in the representative Wreckline chase-camera/road context. Observe near/far LOD transition, wheel/contact read, silhouette, hardpoint/module clarity and material/glass behavior at gameplay distance.

Current state: **NOT TESTED**.

### Gate G — performance claim discipline

If no target hardware/performance budget is declared, do not invent one. If one is declared, measure it in the relevant runtime/context and retain the setup.

Current state: **BLOCKED_MISSING_TARGET_BUDGET** for any performance-certification claim.

## Current finding

The asset is a valid first real task because it contains enough genuine geometry, materials, LOD, collision, animation and modularity state to exercise the specialist body, while still containing important unresolved runtime surfaces.

The profession correctly has enough evidence to say:

- the exact candidate is real and structurally substantial;
- game-asset preparation evidence exists for several surfaces;
- the static replacement-direction/modularity claim has retained visual evidence;
- target/native runtime acceptance, continuous animation, live module swaps, chase-context readability and performance are not yet proven.

It does **not** have enough evidence to say the asset is fully game-ready or to promote the profession's maturity.

## Promotion decision

**NO PROMOTION. Keep `3d-game-asset-specialist` at `EXPERIMENTAL`.**

Reason:

1. the profession's own truth boundary requires target-runtime observation for the relevant claims;
2. the pinned Wreckline branch explicitly records native host integration as pending;
3. continuous animation and live module swaps remain unobserved;
4. one asset, even after a successful runtime pass, would still be too narrow to establish broad professional competence across representative asset classes and executors.

A later scoped maturity review may cite this job only for the exact gates actually completed. No evidence transfers automatically to characters, foliage, environments, deforming assets, other engines, other platforms or other intelligences.

## Next evidence action

The smallest meaningful continuation is not more modeling. It is a retained native/runtime observation packet for this exact vehicle:

`exact GLB -> native import -> continuous clip -> one live socket swap -> chase-context capture -> receipt`

If that packet passes, update this live job with the new exact runtime receipts. Do not rewrite the historical missing-evidence state; append/supersede it with dated evidence.
