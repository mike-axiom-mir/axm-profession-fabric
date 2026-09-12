# Live Job 001 — Improvised Workshop Specialist Simulation

Date: 2026-09-12

## Purpose

Run one real Universal Creation asset through multiple Profession Bodies as method overlays on the same machine cognition, then preserve what each profession notices, rejects, hands off, or prioritizes.

This is **not** evidence of four independent intelligences. It is one machine cognition applying four bounded professional methods to one real job.

## Exact job identity

Source repository: `mike-axiom-mir/axm-universal-creation`

Workshop source/evidence lane:

- Universal Creation source commit: `2d9128ecb0eb08a21ea9e8f283fe4fb613d2983a`
- merge commit: `fb1f645cffcac1e05f07462b20316b51d270492b`
- tested evidence tree: `54bb1fec77c0315f00b4751181ba09bf9a8f0e1a`
- detailed GLB SHA-256: `d89381854d9f6adad84b44980677d16d021a91ed6dd87ab98295e24f4eccdc9e`
- LOD1 GLB SHA-256: `bcc56d2e217e3f35958cde5ab9370d572e4df7fbacc763817e5c9097409b8c26`

Observed package facts:

- detailed model: 176,043 triangles / 265,043 vertices
- lower-detail model: 63,349 triangles / 102,645 vertices
- 18 material batches in each GLB
- 47 embedded PNG images in each GLB
- no animations or skins in either GLB
- polished package explicitly withholds collider, navigation, target-RTS integration and target-device FPS claims

## Professional Body overlays

### 1. Art Director

Primary finding: the asset has high craft quality and real authored personality, but the dominant read is still **beautiful salvage workshop / miniature diorama** rather than a strongly exaggerated game-faction personality.

The source already contains personality seeds such as a tea engine, mechanic mug, reclaimed car-door cupboard, reused hoist wheel and mismatched repair straps. The next visual-direction gain should therefore come from **two or three large identity anchors**, not another layer of tiny detail.

Recommended direction:

1. strengthen one front-facing faction/personality anchor that reads at RTS distance;
2. strengthen one roof/silhouette invention that feels deliberately improvised rather than merely plausible salvage;
3. make rear/side identity less uniform so the asset remains recognizable away from the hero angle;
4. preserve the current teal/rust/wood craft rather than restarting the style.

Non-claims: no universal aesthetic score; no gameplay/readability acceptance; no target-engine acceptance.

### 2. 3D Artist

Primary finding: the model holds up across hero, rear and close-detail renders and contains real geometry/material craft rather than a painted stand-in.

Useful next work:

1. amplify large-form personality without discarding the current detailed model;
2. preserve editable Blender source and exact GLB artifact identity across revisions;
3. protect silhouette, proportion and visual family while changing the vibe;
4. keep technical/game-ready claims separate from visual craft.

Important structural observation: exported GLBs contain 18 mesh nodes aligned to material groupings. This is acceptable as a rendering/export structure but less useful than semantic object grouping for downstream editing, collision assignment, interaction tagging or targeted LOD policy. The editable `.blend` remains the richer authoring surface.

### 3. Technical Artist

Primary finding: structural validation is strong, but game-readiness remains incomplete.

Measured technical observations:

- LOD1 retains about 36% of detailed triangle count;
- both variants retain 18 material batches and 47 embedded PNG images;
- embedded image bytes are about 17.7 MiB compressed inside the GLB;
- 47 RGB textures represent about 53 MiB if expanded to RGBA8 before mip overhead (target runtime compression remains unknown);
- all 18 exported materials are marked double-sided;
- detailed GLB contains one near-zero-area triangle under the existing inspection threshold;
- no collider, navigation, target-engine import, target-device FPS or LOD perceptual-equivalence evidence exists yet.

Priority technical-art work:

1. add a target-context collision/navigation lane instead of inferring it from geometry;
2. run target-engine import and record exact scale/pivot/material/shader behavior;
3. inspect whether every double-sided material is necessary;
4. set an explicit texture/material budget for the target platform before optimizing blindly;
5. visually compare LOD1 at the intended RTS camera distance before accepting the reduction;
6. preserve art-direction handoff if optimization changes the silhouette or personality anchors.

### 4. Software QA / Playtest

Current PASS evidence:

- exact artifact hashes are recorded;
- geometry/UV/normal/image/bounds inspection exists;
- detailed and LOD1 triangle counts are measured;
- the detailed GLB was freshly re-imported and rendered from three inspected views;
- the package explicitly separates structural/render evidence from game-runtime evidence.

Current HOLD / NOT TESTED surfaces:

- collider correctness for the polished footprint;
- navigation/pathfinding integration;
- target-RTS import and runtime behavior;
- target-device frame rate/performance;
- LOD perceptual equivalence/readability at game camera distance;
- gameplay readability or interaction clearance;
- Art Director acceptance of the final vibe.

QA recommendation: do **not** use the phrase `game-ready` for this package until the relevant target-engine, collision/navigation and runtime evidence exists.

## Combined repair priority

### Priority A — Direction

Move perceived personality from the current bounded user feedback of roughly `vibe ~6` toward the intended playful/game-survivor identity by changing **large readable anchors**, not by increasing micro-detail.

### Priority B — Integration

Add collision/navigation/target-import/performance evidence as separate explicit lanes. Do not let visual quality silently satisfy them.

### Priority C — Cost/readability

Measure whether the 18 materials / 47 textures / double-sided state and current LOD behave acceptably on the intended platform and RTS camera. Optimize only against an explicit target.

## Outcome of this simulation

The four profession methods did not collapse into one generic critique:

- Art Direction isolated **identity/vibe**;
- 3D Art isolated **form/surface/craft**;
- Technical Art isolated **pipeline/runtime preparation**;
- QA isolated **what can and cannot currently be claimed**.

That separation is the useful result of Live Job 001.

## Next action

Use this packet as the handoff for the next workshop iteration. A later run should compare the revised artifact against this exact source identity and record which specialist findings were repaired, rejected, or remained blocked.
