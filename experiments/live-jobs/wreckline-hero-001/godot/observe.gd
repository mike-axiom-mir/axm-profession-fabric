extends SceneTree

const ASSET_PATH := "res://generated/wreckline-hero--lod0.glb"
const HARDPOINTS_PATH := "res://generated/vehicle-hardpoints.json"
const MODULES_PATH := "res://generated/mountable-modules.json"
const RECEIPT_PATH := "res://runtime-receipt.json"
const EMPTY_RENDER_PATH := "res://empty-chassis.png"
const MOUNTED_RENDER_PATH := "res://proof-module-mounted.png"
const EXPECTED_SHA256 := "7cf93c3dd80ab3952a6e8ce82accdd3c76bbc46a8aa631f642e108ceded2930e"
const SIZE := Vector2i(640, 640)
const CLEAR_COLOR := Color(0.025, 0.032, 0.045, 1.0)

func write_receipt(receipt: Dictionary) -> void:
    var file := FileAccess.open(RECEIPT_PATH, FileAccess.WRITE)
    if file == null:
        push_error("Could not open receipt path")
        return
    file.store_string(JSON.stringify(receipt, "  ") + "\n")
    file.close()

func fail(message: String, receipt: Dictionary, code: int = 1) -> void:
    receipt["status"] = "fail"
    receipt["failure"] = message
    receipt["godot_version"] = Engine.get_version_info()
    write_receipt(receipt)
    push_error(message)
    quit(code)

func load_json(path: String) -> Variant:
    var text := FileAccess.get_file_as_string(path)
    if text.is_empty():
        return null
    return JSON.parse_string(text)

func collect_meshes(node: Node, out: Array[MeshInstance3D]) -> void:
    if node is MeshInstance3D:
        out.append(node as MeshInstance3D)
    for child: Node in node.get_children():
        collect_meshes(child, out)

func collect_animation_players(node: Node, out: Array[AnimationPlayer]) -> void:
    if node is AnimationPlayer:
        out.append(node as AnimationPlayer)
    for child: Node in node.get_children():
        collect_animation_players(child, out)

func collect_nodes(node: Node, out: Array[Node]) -> void:
    out.append(node)
    for child: Node in node.get_children():
        collect_nodes(child, out)

func transformed_aabb(local_aabb: AABB, transform: Transform3D) -> AABB:
    var p := local_aabb.position
    var s := local_aabb.size
    var corners: Array[Vector3] = [
        p,
        p + Vector3(s.x, 0.0, 0.0),
        p + Vector3(0.0, s.y, 0.0),
        p + Vector3(0.0, 0.0, s.z),
        p + Vector3(s.x, s.y, 0.0),
        p + Vector3(s.x, 0.0, s.z),
        p + Vector3(0.0, s.y, s.z),
        p + s,
    ]
    var result := AABB(transform * corners[0], Vector3.ZERO)
    for index in range(1, corners.size()):
        result = result.expand(transform * corners[index])
    return result

func aggregate_mesh_bounds(root: Node) -> Dictionary:
    var meshes: Array[MeshInstance3D] = []
    collect_meshes(root, meshes)
    var have_bounds := false
    var merged := AABB()
    for mesh_node in meshes:
        if mesh_node.mesh == null:
            continue
        var world_bounds := transformed_aabb(mesh_node.mesh.get_aabb(), mesh_node.global_transform)
        if not have_bounds:
            merged = world_bounds
            have_bounds = true
        else:
            merged = merged.merge(world_bounds)
    return {"have_bounds": have_bounds, "bounds": merged, "mesh_count": meshes.size()}

func transform_values(node: Node3D) -> Array:
    var t := node.transform
    return [
        t.origin.x, t.origin.y, t.origin.z,
        t.basis.x.x, t.basis.x.y, t.basis.x.z,
        t.basis.y.x, t.basis.y.y, t.basis.y.z,
        t.basis.z.x, t.basis.z.y, t.basis.z.z,
    ]

func collect_transform_snapshot(node: Node, out: Dictionary) -> void:
    if node is Node3D:
        out[str(node.get_path())] = transform_values(node as Node3D)
    for child: Node in node.get_children():
        collect_transform_snapshot(child, out)

func changed_transforms(before: Dictionary, after: Dictionary) -> int:
    var changed := 0
    for key in before.keys():
        if not after.has(key):
            continue
        var a: Array = before[key]
        var b: Array = after[key]
        var different := false
        for i in range(mini(a.size(), b.size())):
            if absf(float(a[i]) - float(b[i])) > 0.00001:
                different = true
                break
        if different:
            changed += 1
    return changed

func capture_metrics(viewport: SubViewport, path: String) -> Dictionary:
    var image := viewport.get_texture().get_image()
    if image == null or image.is_empty():
        return {"status": "fail", "failure": "viewport produced no image"}
    var save_error := image.save_png(path)
    if save_error != OK:
        return {"status": "fail", "failure": "could not save PNG", "save_error": save_error}
    var background := image.get_pixel(2, 2)
    var sampled := 0
    var foreground := 0
    var min_luma := 1.0
    var max_luma := 0.0
    for y in range(0, image.get_height(), 3):
        for x in range(0, image.get_width(), 3):
            var color := image.get_pixel(x, y)
            var delta := absf(color.r - background.r) + absf(color.g - background.g) + absf(color.b - background.b)
            if delta > 0.055:
                foreground += 1
            var luma := color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722
            min_luma = minf(min_luma, luma)
            max_luma = maxf(max_luma, luma)
            sampled += 1
    return {
        "status": "pass",
        "path": path,
        "width": image.get_width(),
        "height": image.get_height(),
        "png_bytes": FileAccess.get_file_as_bytes(path).size(),
        "foreground_coverage": float(foreground) / float(maxi(sampled, 1)),
        "luma_range": max_luma - min_luma,
    }

func find_named_node3d(root: Node, candidates: Array[String]) -> Node3D:
    var nodes: Array[Node] = []
    collect_nodes(root, nodes)
    for candidate in candidates:
        var target := candidate.to_lower()
        for node in nodes:
            if node is Node3D and String(node.name).to_lower() == target:
                return node as Node3D
    return null

func array3_leq(a: Array, b: Array) -> bool:
    return a.size() >= 3 and b.size() >= 3 and float(a[0]) <= float(b[0]) and float(a[1]) <= float(b[1]) and float(a[2]) <= float(b[2])

func compatibility(hardpoint: Dictionary, module: Dictionary) -> Dictionary:
    var checks := {
        "mount_class": str(module.get("mount_class", "")) == str(hardpoint.get("mount_class", "")),
        "kind": (hardpoint.get("accepts", []) as Array).has(module.get("kind", "")),
        "envelope": array3_leq(module.get("envelope", []), hardpoint.get("envelope", [])),
        "mass": float(module.get("mass_kg", INF)) <= float(hardpoint.get("mass_limit_kg", -INF)),
        "power": float(module.get("power_kw", INF)) <= float(hardpoint.get("power_kw", -INF)),
        "cooling": float(module.get("heat_kw", INF)) <= float(hardpoint.get("cooling_kw", -INF)),
        "feed": (hardpoint.get("ammo_feeds", []) as Array).has(module.get("ammo_feed", "")),
    }
    var passed := true
    for value in checks.values():
        if not bool(value):
            passed = false
    return {"passed": passed, "checks": checks}

func make_proof_module() -> MeshInstance3D:
    var mesh_instance := MeshInstance3D.new()
    mesh_instance.name = "AXM_Proof_Module_twin_autocannon_contract_proxy"
    var box := BoxMesh.new()
    box.size = Vector3(0.82, 0.34, 1.02)
    mesh_instance.mesh = box
    var material := StandardMaterial3D.new()
    material.albedo_color = Color(0.9, 0.23, 0.11, 1.0)
    material.metallic = 0.55
    material.roughness = 0.42
    mesh_instance.material_override = material
    return mesh_instance

func vector3_from_array(value: Variant) -> Vector3:
    if not (value is Array):
        return Vector3.ZERO
    var arr: Array = value
    if arr.size() < 3:
        return Vector3.ZERO
    return Vector3(float(arr[0]), float(arr[1]), float(arr[2]))

func _initialize() -> void:
    var receipt: Dictionary = {
        "schema": "axm.profession-fabric.wreckline-godot-proof/v0.1",
        "evidence_scope": "Bounded Godot proof host for the exact Wreckline Hero Vehicle 001 candidate. Godot is not silently declared to be Wreckline's final target engine. The contract-proxy module proves a live attach/detach mechanism only; it is not final module visual evidence.",
        "source_repository": "mike-axiom-mir/axm-wreckline",
        "source_head": "ec382b15d642acfe647428094a5718053ef4ce20",
        "asset": ASSET_PATH,
        "expected_sha256": EXPECTED_SHA256,
        "proof_runtime": "Godot 4.7.2",
    }

    if not FileAccess.file_exists(ASSET_PATH):
        fail("Exact Wreckline candidate was not staged", receipt)
        return
    var observed_sha := FileAccess.get_sha256(ASSET_PATH)
    receipt["observed_sha256"] = observed_sha
    if observed_sha != EXPECTED_SHA256:
        fail("Candidate SHA-256 does not match pinned Wreckline receipt", receipt)
        return

    var hardpoints_value := load_json(HARDPOINTS_PATH)
    var modules_value := load_json(MODULES_PATH)
    if not (hardpoints_value is Dictionary) or not (modules_value is Array):
        fail("Hardpoint/module contracts could not be parsed", receipt)
        return
    var hardpoints_doc: Dictionary = hardpoints_value
    var modules: Array = modules_value

    var selected_hardpoint: Dictionary = {}
    for hp_value in hardpoints_doc.get("hardpoints", []):
        if hp_value is Dictionary and str((hp_value as Dictionary).get("id", "")) == "roof-medium":
            selected_hardpoint = hp_value
            break
    var selected_module: Dictionary = {}
    for module_value in modules:
        if module_value is Dictionary and str((module_value as Dictionary).get("id", "")) == "twin-autocannon-mk1":
            selected_module = module_value
            break
    if selected_hardpoint.is_empty() or selected_module.is_empty():
        fail("Expected roof hardpoint or module contract is missing", receipt)
        return
    var compatibility_result := compatibility(selected_hardpoint, selected_module)
    receipt["module_contract_check"] = {
        "hardpoint": "roof-medium",
        "module": "twin-autocannon-mk1",
        "result": compatibility_result,
    }

    RenderingServer.set_default_clear_color(CLEAR_COLOR)
    var document := GLTFDocument.new()
    var state := GLTFState.new()
    var parse_error := document.append_from_file(ASSET_PATH, state)
    receipt["append_from_file_error"] = int(parse_error)
    if parse_error != OK:
        fail("Godot GLTFDocument rejected the exact Wreckline GLB", receipt)
        return
    var imported := document.generate_scene(state)
    if imported == null:
        fail("Godot parsed GLB but could not generate scene", receipt)
        return

    var viewport := SubViewport.new()
    viewport.name = "AXM_Wreckline_Evidence_Viewport"
    viewport.size = SIZE
    viewport.own_world_3d = true
    viewport.transparent_bg = false
    viewport.render_target_clear_mode = SubViewport.CLEAR_MODE_ALWAYS
    viewport.render_target_update_mode = SubViewport.UPDATE_ALWAYS
    get_root().add_child(viewport)

    var scene_root := Node3D.new()
    scene_root.name = "AXM_Wreckline_Proof"
    viewport.add_child(scene_root)
    scene_root.add_child(imported)
    await process_frame

    var meshes: Array[MeshInstance3D] = []
    collect_meshes(imported, meshes)
    var total_surfaces := 0
    var total_vertices := 0
    var total_indices := 0
    var material_surfaces := 0
    for mesh_node in meshes:
        if mesh_node.mesh == null:
            continue
        total_surfaces += mesh_node.mesh.get_surface_count()
        for surface in range(mesh_node.mesh.get_surface_count()):
            total_vertices += mesh_node.mesh.surface_get_array_len(surface)
            total_indices += mesh_node.mesh.surface_get_array_index_len(surface)
            if mesh_node.mesh.surface_get_material(surface) != null:
                material_surfaces += 1
    receipt["import"] = {
        "state": "PASS",
        "mesh_instances": meshes.size(),
        "surfaces": total_surfaces,
        "vertices": total_vertices,
        "indices": total_indices,
        "material_surfaces": material_surfaces,
    }
    if meshes.is_empty() or total_surfaces <= 0 or total_vertices <= 0 or total_indices <= 0:
        fail("Generated Godot scene has no usable mesh data", receipt)
        return

    var bounds_state := aggregate_mesh_bounds(imported)
    if not bool(bounds_state.get("have_bounds", false)):
        fail("Imported scene has no non-empty mesh bounds", receipt)
        return
    var bounds: AABB = bounds_state["bounds"]
    var center := bounds.get_center()
    var radius := maxf(bounds.size.length() * 0.5, 0.05)
    receipt["world_bounds"] = {
        "position": [bounds.position.x, bounds.position.y, bounds.position.z],
        "size": [bounds.size.x, bounds.size.y, bounds.size.z],
    }

    var environment := Environment.new()
    environment.background_mode = Environment.BG_COLOR
    environment.background_color = CLEAR_COLOR
    environment.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
    environment.ambient_light_color = Color(0.5, 0.54, 0.62, 1.0)
    environment.ambient_light_energy = 0.9
    var world_environment := WorldEnvironment.new()
    world_environment.environment = environment
    scene_root.add_child(world_environment)

    var key := DirectionalLight3D.new()
    key.rotation_degrees = Vector3(-48.0, -35.0, 0.0)
    key.light_energy = 1.7
    scene_root.add_child(key)
    var fill := OmniLight3D.new()
    fill.position = center + Vector3(-1.0, 0.8, 1.2).normalized() * radius * 2.1
    fill.omni_range = radius * 6.0
    fill.light_energy = 2.2
    scene_root.add_child(fill)

    var camera := Camera3D.new()
    camera.fov = 42.0
    camera.near = 0.01
    camera.far = maxf(100.0, radius * 20.0)
    var camera_position := center + Vector3(1.35, 0.60, 1.25).normalized() * (radius / tan(deg_to_rad(camera.fov * 0.5)) * 1.35)
    camera.look_at_from_position(camera_position, center, Vector3.UP)
    scene_root.add_child(camera)
    camera.make_current()
    for _i in range(12):
        await process_frame
    receipt["empty_chassis_render"] = capture_metrics(viewport, EMPTY_RENDER_PATH)

    var players: Array[AnimationPlayer] = []
    collect_animation_players(imported, players)
    var animation_names: Array[String] = []
    var chosen_player: AnimationPlayer = null
    var chosen_animation := ""
    for player in players:
        for name in player.get_animation_list():
            animation_names.append(str(name))
            if str(name) == "AssemblyMotion":
                chosen_player = player
                chosen_animation = str(name)
    if chosen_player == null:
        for player in players:
            for name in player.get_animation_list():
                if str(name) != "RESET":
                    chosen_player = player
                    chosen_animation = str(name)
                    break
            if chosen_player != null:
                break
    receipt["animation_players"] = players.size()
    receipt["animation_names"] = animation_names
    if chosen_player == null:
        receipt["continuous_animation"] = {
            "state": "NOT_PROVEN",
            "reason": "Godot generated no playable non-RESET animation from the exact GLB",
        }
    else:
        var animation := chosen_player.get_animation(chosen_animation)
        var duration := animation.length if animation != null else 0.0
        var previous: Dictionary = {}
        collect_transform_snapshot(imported, previous)
        var samples: Array = []
        var changed_total := 0
        chosen_player.play(chosen_animation)
        var interval := clampf(duration / 5.0 if duration > 0.0 else 0.20, 0.08, 0.26)
        for sample_index in range(5):
            await create_timer(interval).timeout
            var current: Dictionary = {}
            collect_transform_snapshot(imported, current)
            var changed := changed_transforms(previous, current)
            changed_total += changed
            samples.append({
                "sample": sample_index + 1,
                "position_s": chosen_player.current_animation_position,
                "changed_node_transforms": changed,
            })
            previous = current
        var progressed := changed_total > 0
        receipt["continuous_animation"] = {
            "state": "PASS" if progressed else "NOT_PROVEN",
            "animation": chosen_animation,
            "duration_s": duration,
            "wall_observation_s": interval * 5.0,
            "changed_node_pairs_total": changed_total,
            "samples": samples,
            "method": "AnimationPlayer.play with five timer-separated live process intervals; not manual seek-only sampling",
        }
        chosen_player.stop()
        chosen_player.seek(0.0, true)
        await process_frame

    var imported_anchor := find_named_node3d(imported, ["hardpoint-roof", "roof-medium", "hardpoint_roof", "roof_medium"])
    var anchor: Node3D
    var anchor_source := "imported_semantic_node"
    if imported_anchor != null:
        anchor = imported_anchor
    else:
        anchor = Node3D.new()
        anchor.name = "AXM_ProofSocket_roof_medium_from_contract"
        anchor.position = vector3_from_array(selected_hardpoint.get("position", []))
        imported.add_child(anchor)
        anchor_source = "contract_coordinate_fallback"
        await process_frame

    var proxy := make_proof_module()
    var before_children := anchor.get_child_count()
    anchor.add_child(proxy)
    await process_frame
    var attached := proxy.get_parent() == anchor and anchor.get_child_count() == before_children + 1
    for _i in range(5):
        await process_frame
    receipt["mounted_proxy_render"] = capture_metrics(viewport, MOUNTED_RENDER_PATH)
    anchor.remove_child(proxy)
    proxy.free()
    await process_frame
    var detached := anchor.get_child_count() == before_children
    receipt["live_module_swap"] = {
        "state": "MECHANISM_PASS" if bool(compatibility_result.get("passed", false)) and attached and detached else "NOT_PROVEN",
        "anchor_source": anchor_source,
        "hardpoint": "roof-medium",
        "module_contract": "twin-autocannon-mk1",
        "compatibility_pass": bool(compatibility_result.get("passed", false)),
        "attached": attached,
        "detached": detached,
        "scope": "Real Godot live attach/render/detach of a bounded contract proxy. This does not prove final autocannon geometry, weapon behavior, gameplay balance, or Wreckline final-engine integration.",
    }

    var empty_render: Dictionary = receipt["empty_chassis_render"]
    var mounted_render: Dictionary = receipt["mounted_proxy_render"]
    var render_pass := str(empty_render.get("status", "fail")) == "pass" and int(empty_render.get("png_bytes", 0)) > 1000 and float(empty_render.get("foreground_coverage", 0.0)) >= 0.01 and str(mounted_render.get("status", "fail")) == "pass" and int(mounted_render.get("png_bytes", 0)) > 1000
    receipt["runtime_capture_state"] = "PASS" if render_pass else "NOT_PROVEN"
    receipt["godot_version"] = Engine.get_version_info()
    receipt["limitations"] = [
        "Godot is a bounded proof runtime, not an undeclared choice of Wreckline's final native engine.",
        "The mounted object is a contract proxy, not the final twin-autocannon asset.",
        "No Wreckline road loop, chase-camera gameplay context, collision response, final normal/glass acceptance, or target-device performance is proven here.",
        "A successful single-asset proof does not promote the 3D Game Asset Specialist beyond EXPERIMENTAL by itself.",
    ]

    var animation_state := str((receipt.get("continuous_animation", {}) as Dictionary).get("state", "NOT_PROVEN"))
    var swap_state := str((receipt.get("live_module_swap", {}) as Dictionary).get("state", "NOT_PROVEN"))
    if animation_state == "PASS" and swap_state == "MECHANISM_PASS" and render_pass:
        receipt["status"] = "pass_scoped_proof_runtime"
    else:
        receipt["status"] = "partial_scoped_proof_runtime"
    write_receipt(receipt)
    print("AXM WRECKLINE GODOT EVIDENCE ", JSON.stringify(receipt))
    viewport.queue_free()
    quit(0)
