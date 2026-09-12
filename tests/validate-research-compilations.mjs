import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSchemaSubset } from '../tools/json-schema-subset.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const readJson = rel => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
const schema = readJson('schemas/research-compilation-record.schema.json');
const registry = readJson('registry/professions.json');
const professions = new Map(registry.professions.map(p => [p.profession_id, p]));

function gitBlobSha(buffer) {
  const header = Buffer.from(`blob ${buffer.length}\0`);
  return crypto.createHash('sha1').update(Buffer.concat([header, buffer])).digest('hex');
}
function declaredFiles(manifest) {
  const out = new Set(['package.json', manifest.body]);
  for (const files of Object.values(manifest.components)) for (const file of files) out.add(file);
  return out;
}

const dir = path.join(root, 'research/compilations');
const files = fs.readdirSync(dir).filter(name => name.endsWith('.json')).sort();
assert.ok(files.length >= 5, `expected at least five compilation records, found ${files.length}`);

for (const name of files) {
  const record = readJson(path.posix.join('research/compilations', name));
  validateSchemaSubset(record, schema, `research.compilation.${name}`);
  const profession = professions.get(record.profession_id);
  assert.ok(profession, `${name}: unknown profession ${record.profession_id}`);
  const packetPath = path.join(root, record.research_packet);
  assert.ok(fs.existsSync(packetPath), `${name}: research packet missing`);
  const packetBytes = fs.readFileSync(packetPath);
  assert.equal(gitBlobSha(packetBytes), record.research_packet_blob_sha, `${name}: research packet changed after compilation; reconcile explicitly`);
  const packet = JSON.parse(packetBytes.toString('utf8'));
  assert.equal(packet.profession_id, record.profession_id, `${name}: packet profession mismatch`);
  assert.equal(packet.body_snapshot.git_blob_sha, record.audited_body_blob_sha, `${name}: audited body sha mismatch`);
  const currentBody = fs.readFileSync(path.join(root, packet.body_snapshot.path));
  assert.equal(gitBlobSha(currentBody), record.audited_body_blob_sha, `${name}: body rewrite is not allowed in this compilation pass`);

  const gaps = new Map(packet.gaps_against_body.map(gap => [gap.id, gap]));
  assert.equal(new Set(record.dispositions.map(d => d.gap_id)).size, record.dispositions.length, `${name}: duplicate gap disposition`);
  assert.deepEqual(new Set(record.dispositions.map(d => d.gap_id)), new Set(gaps.keys()), `${name}: every research gap must receive exactly one disposition`);

  const manifest = readJson(path.posix.join(profession.root, profession.manifest));
  const declared = declaredFiles(manifest);
  for (const disposition of record.dispositions) {
    const gap = gaps.get(disposition.gap_id);
    if (gap.proposed_action === 'research-more') assert.notEqual(disposition.decision, 'ADOPTED', `${name}: research-more gap cannot be fully adopted from same packet`);
    if (disposition.decision === 'ADOPTED' || disposition.decision === 'PARTIAL') {
      assert.ok(disposition.target_files.length > 0, `${name}: ${disposition.gap_id} needs target files`);
      for (const target of disposition.target_files) {
        assert.ok(declared.has(target), `${name}: compiled target not declared by package: ${target}`);
        assert.ok(fs.existsSync(path.join(root, profession.root, target)), `${name}: compiled target missing: ${target}`);
      }
    }
    if (disposition.decision === 'HOLD') assert.ok(disposition.residual_gap.length > 10, `${name}: HOLD needs substantive residual gap`);
  }
  for (const file of record.adopted_files) {
    assert.ok(declared.has(file), `${name}: adopted file is not package-declared: ${file}`);
    assert.ok(fs.existsSync(path.join(root, profession.root, file)), `${name}: adopted file missing: ${file}`);
  }
  if (packet.high_stakes.is_high_stakes) {
    assert.equal(record.authority_boundary_preserved, true);
    assert.ok(record.nonclaims.some(text => /authori|permission|certif|access|risk|physical/i.test(text)), `${name}: high-stakes compilation needs authorization nonclaim`);
  }
}
console.log(`Research compilation PASS: ${files.length} packet(s) explicitly disposed into package-local machinery; audited bodies and maturity unchanged.`);
