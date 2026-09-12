import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSchemaSubset } from '../tools/json-schema-subset.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const registry = readJson('registry/professions.json');
const maturity = readJson('registry/maturity.json');
const targets = readJson('registry/profession-targets.json');
const schema = readJson('schemas/profession-maturity-evidence.schema.json');

assert.equal(maturity.schema_version, '0.1');
assert.ok(Array.isArray(maturity.records));
const packageById = new Map(registry.professions.map(p => [p.profession_id, p]));
const highStakes = new Set(targets.high_stakes_domains ?? []);
const seen = new Set();

for (const record of maturity.records) {
  assert.ok(!seen.has(record.profession_id), `duplicate maturity record: ${record.profession_id}`);
  seen.add(record.profession_id);
  const pkg = packageById.get(record.profession_id);
  assert.ok(pkg, `maturity record references unknown profession: ${record.profession_id}`);
  assert.equal(record.status, 'TEST', `${record.profession_id}: maturity gate v0.1 supports TEST only; define a stronger gate before WORKING/CANON`);

  const manifest = readJson(path.posix.join(pkg.root, pkg.manifest));
  assert.ok(Array.isArray(manifest.components.evidence), `${record.profession_id}: manifest must declare components.evidence`);
  assert.ok(manifest.components.evidence.includes(record.evidence), `${record.profession_id}: maturity evidence must be package-local and declared`);

  const evidence = readJson(path.posix.join(pkg.root, record.evidence));
  validateSchemaSubset(evidence, schema, `${record.profession_id}.maturity`);
  assert.equal(evidence.profession_id, record.profession_id);
  assert.equal(evidence.evidence_status, record.status);
  assert.equal(evidence.promotion_decision, 'PROMOTE', `${record.profession_id}: HOLD cannot count as usable`);
  assert.equal(evidence.package_status_at_evaluation, pkg.status, `${record.profession_id}: evidence must name current full-body status`);

  const sources = new Set(evidence.source_evidence.map(x => x.id));
  assert.equal(sources.size, evidence.source_evidence.length, `${record.profession_id}: duplicate source evidence id`);
  const pass = evidence.fixture_results.filter(x => x.result === 'PASS');
  assert.ok(pass.length >= 2, `${record.profession_id}: TEST requires at least two passing representative fixtures`);
  assert.ok(pass.some(x => x.category === 'success'), `${record.profession_id}: TEST requires a passing success case`);
  assert.ok(pass.some(x => ['failure','abstention','boundary'].includes(x.category)), `${record.profession_id}: TEST requires a passing failure/abstention/boundary case`);

  const declaredFixtureIds = new Set();
  for (const testPath of manifest.components.tests) {
    const doc = readJson(path.posix.join(pkg.root, testPath));
    for (const fixture of doc.fixtures ?? []) if (fixture.id) declaredFixtureIds.add(fixture.id);
  }
  for (const fixture of evidence.fixture_results) {
    assert.ok(declaredFixtureIds.has(fixture.fixture_id), `${record.profession_id}: unknown professional fixture ${fixture.fixture_id}`);
    for (const id of fixture.source_evidence_ids) assert.ok(sources.has(id), `${record.profession_id}: fixture references unknown evidence source ${id}`);
  }

  for (const rootName of ['Truth','Agency / non-domination','Continuity','Wisdom before speed']) {
    assert.equal(evidence.roots[rootName], 'PASS', `${record.profession_id}: root ${rootName} must PASS for TEST promotion`);
  }

  if (highStakes.has(manifest.domain)) {
    assert.ok(evidence.high_stakes_gate, `${record.profession_id}: high-stakes TEST requires domain-specific evidence gate`);
    assert.equal(evidence.high_stakes_gate.domain_specific_evidence, true);
    assert.equal(evidence.high_stakes_gate.authorization_nonclaim, true);
  }
}

console.log(`Profession maturity PASS: ${maturity.records.length} package(s) have validated scoped TEST evidence.`);
