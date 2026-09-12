import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSchemaSubset } from '../tools/json-schema-subset.mjs';
import { buildOnetSlice, buildEscoSlice, discoverOnetCandidates, discoverEscoCandidates } from '../tools/local-research-intake.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const onetDir = path.join(root, 'tests/fixtures/research-intake/onet');
const escoDir = path.join(root, 'tests/fixtures/research-intake/esco');
const schema = JSON.parse(fs.readFileSync(path.join(root, 'schemas/research-source-slice.schema.json'), 'utf8'));
const sourceRegistry = JSON.parse(fs.readFileSync(path.join(root, 'research/source-registry.json'), 'utf8'));

const onet = buildOnetSlice(onetDir, '15-1253.00');
validateSchemaSubset(onet, schema, 'onet.slice');
assert.equal(onet.source_id, 'onet-31.0');
assert.ok(onet.records.some(r => r.record_type === 'task' && r.method.domain_source === 'Incumbent'));
assert.ok(onet.records.some(r => r.record_type === 'software-skill'));
assert.ok(onet.source_files.every(x => /^[0-9a-f]{64}$/.test(x.sha256)));
assert.deepEqual(onet, buildOnetSlice(onetDir, '15-1253.00'), 'O*NET slice must be deterministic');

const onetCandidates = discoverOnetCandidates(onetDir, 'software qa tester');
assert.equal(onetCandidates[0].external_id, '15-1253.00');
assert.equal(onetCandidates[0].relation, 'CANDIDATE_ONLY');

const esco = buildEscoSlice(escoDir, 'qa-1');
validateSchemaSubset(esco, schema, 'esco.slice');
assert.equal(esco.source_id, 'esco-1.2.1');
assert.equal(esco.records.filter(r => r.record_type === 'occupation-skill-relation').length, 2);
assert.ok(esco.records.some(r => r.method.relation_type === 'essential'));
assert.deepEqual(esco, buildEscoSlice(escoDir, 'qa-1'), 'ESCO slice must be deterministic');

const escoCandidates = discoverEscoCandidates(escoDir, 'quality assurance tester');
assert.equal(escoCandidates[0].external_id, 'http://example/occupation/qa');
assert.equal(escoCandidates[0].relation, 'CANDIDATE_ONLY');

for (const id of ['onet-31.0', 'esco-1.2.1']) {
  const source = sourceRegistry.sources.find(item => item.id === id);
  assert.ok(source, `missing source policy ${id}`);
  assert.equal(source.legal_mode, 'ingest-adapt');
  assert.equal(source.machine_access.local_first_preferred, true);
}

const toolSource = fs.readFileSync(path.join(root, 'tools/local-research-intake.mjs'), 'utf8');
assert.ok(!toolSource.includes('node:http') && !toolSource.includes('node:https') && !/\bfetch\s*\(/.test(toolSource), 'local intake must not acquire network access');
console.log('Local research intake PASS: deterministic O*NET + ESCO slices, provenance hashes, candidate-only crosswalk discovery, no network runtime.');
