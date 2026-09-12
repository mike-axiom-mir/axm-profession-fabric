import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSchemaSubset } from '../tools/json-schema-subset.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const bodySchema = readJson('schemas/professional-body.schema.json');
const packageSchema = readJson('schemas/profession-package.schema.json');
const registry = readJson('registry/professions.json');

assert.equal(registry.schema_version, '0.1');
assert.ok(Array.isArray(registry.professions), 'registry.professions must be an array');

const packageIds = new Set();
const roots = new Set();
const requiredSurfaces = ['human-guided', 'ai-model', 'machine-intelligence', 'deterministic-flow'];

function walkFiles(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(absolute, base));
    else out.push(path.relative(base, absolute).split(path.sep).join('/'));
  }
  return out.sort();
}

for (const record of registry.professions) {
  for (const key of ['package_id', 'profession_id', 'display_name', 'status', 'root', 'manifest']) {
    assert.equal(typeof record[key], 'string', `registry record missing ${key}`);
    assert.ok(record[key].length > 0, `registry record empty ${key}`);
  }

  assert.ok(!packageIds.has(record.package_id), `duplicate package id: ${record.package_id}`);
  assert.ok(!roots.has(record.root), `duplicate profession root: ${record.root}`);
  packageIds.add(record.package_id);
  roots.add(record.root);

  const packageRoot = path.resolve(root, record.root);
  assert.ok(packageRoot.startsWith(path.resolve(root, 'professions') + path.sep), `${record.package_id}: root must be under professions/`);
  assert.ok(fs.statSync(packageRoot).isDirectory(), `${record.package_id}: package root missing`);

  const manifestRel = path.posix.join(record.root, record.manifest);
  const manifest = readJson(manifestRel);
  validateSchemaSubset(manifest, packageSchema, `${record.package_id}.package`);

  assert.equal(manifest.package_id, record.package_id, `${record.package_id}: manifest id mismatch`);
  assert.equal(manifest.profession_id, record.profession_id, `${record.package_id}: profession id mismatch`);
  assert.equal(manifest.display_name, record.display_name, `${record.package_id}: display name mismatch`);
  assert.equal(manifest.status, record.status, `${record.package_id}: status mismatch`);
  for (const surface of requiredSurfaces) {
    assert.ok(manifest.execution_surfaces.includes(surface), `${record.package_id}: missing execution surface ${surface}`);
  }

  const declared = new Set(['package.json', manifest.body]);
  for (const list of Object.values(manifest.components)) for (const relative of list) declared.add(relative);

  for (const relative of declared) {
    const absolute = path.resolve(packageRoot, relative);
    assert.ok(absolute === packageRoot || absolute.startsWith(packageRoot + path.sep), `${record.package_id}: path escaped package root: ${relative}`);
    assert.ok(fs.existsSync(absolute), `${record.package_id}: declared file missing: ${relative}`);
  }

  for (const exported of manifest.exports) {
    assert.ok(declared.has(exported.path), `${record.package_id}: export path is not a declared package component: ${exported.path}`);
  }

  const actualFiles = walkFiles(packageRoot);
  assert.deepEqual(actualFiles, [...declared].sort(), `${record.package_id}: package has undeclared or missing files`);

  const body = readJson(path.posix.join(record.root, manifest.body));
  validateSchemaSubset(body, bodySchema, `${record.package_id}.body`);
  assert.equal(body.profession_id, record.profession_id, `${record.package_id}: body profession id mismatch`);
  assert.equal(body.display_name, record.display_name, `${record.package_id}: body display name mismatch`);
  assert.equal(body.status, record.status, `${record.package_id}: body status mismatch`);
}

for (const record of registry.professions) {
  const manifest = readJson(path.posix.join(record.root, record.manifest));
  for (const dependency of manifest.dependencies.profession_packages) {
    assert.ok(packageIds.has(dependency), `${record.package_id}: unknown profession dependency ${dependency}`);
  }
}

console.log(`Profession package PASS: ${registry.professions.length} isolated profession package(s) validated.`);
