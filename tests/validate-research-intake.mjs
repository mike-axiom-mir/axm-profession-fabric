import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSchemaSubset } from '../tools/json-schema-subset.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));

const sourceSchema = readJson('schemas/research-source-registry.schema.json');
const packetSchema = readJson('schemas/profession-research-packet.schema.json');
const sourceRegistry = readJson('research/source-registry.json');
const professionRegistry = readJson('registry/professions.json');
const targets = readJson('registry/profession-targets.json');
const template = readJson('templates/profession-research-packet.template.json');

validateSchemaSubset(sourceRegistry, sourceSchema, 'research.source-registry');
validateSchemaSubset(template, packetSchema, 'research.packet-template');

const sourceById = new Map();
for (const source of sourceRegistry.sources) {
  assert.ok(!sourceById.has(source.id), `duplicate research source id: ${source.id}`);
  sourceById.set(source.id, source);
  if (source.legal_mode === 'reference-only') {
    assert.ok(source.forbidden_actions.length > 0, `${source.id}: reference-only source must declare forbidden actions`);
    assert.ok(source.truth_scope.length > 20, `${source.id}: reference-only source needs explicit truth scope`);
  }
}

const professionById = new Map(professionRegistry.professions.map(record => [record.profession_id, record]));
const targetDomainById = new Map();
for (const [domain, items] of Object.entries(targets.domains)) {
  for (const [id] of items) targetDomainById.set(id, domain);
}
const highStakesDomains = new Set(targets.high_stakes_domains ?? []);

function gitBlobSha(buffer) {
  const header = Buffer.from(`blob ${buffer.length}\0`);
  return crypto.createHash('sha1').update(Buffer.concat([header, buffer])).digest('hex');
}

function collectJson(relativeDir) {
  const absolute = path.join(root, relativeDir);
  if (!fs.existsSync(absolute)) return [];
  const found = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = path.posix.join(relativeDir, entry.name);
    if (entry.isDirectory()) found.push(...collectJson(relative));
    else if (entry.isFile() && entry.name.endsWith('.json')) found.push(relative);
  }
  return found;
}

const files = [...collectJson('research/pilots'), ...collectJson('research/cohorts')].sort();
assert.ok(files.length >= 10, `research intake unexpectedly small after cohort expansion: ${files.length}`);
const seenProfessions = new Set();

for (const relative of files) {
  const packet = readJson(relative);
  validateSchemaSubset(packet, packetSchema, relative);

  assert.ok(!seenProfessions.has(packet.profession_id), `${relative}: duplicate body-reviewed research packet for ${packet.profession_id}`);
  seenProfessions.add(packet.profession_id);

  const profession = professionById.get(packet.profession_id);
  assert.ok(profession, `${relative}: profession is not registered: ${packet.profession_id}`);
  assert.equal(packet.research_state, 'BODY_REVIEWED', `${relative}: research packet must reach BODY_REVIEWED`);
  assert.equal(packet.coverage.body_review, true, `${relative}: body review flag must be true`);

  const bodyAbsolute = path.join(root, packet.body_snapshot.path);
  assert.ok(fs.existsSync(bodyAbsolute), `${relative}: body snapshot path missing: ${packet.body_snapshot.path}`);
  const actualBodySha = gitBlobSha(fs.readFileSync(bodyAbsolute));
  assert.equal(actualBodySha, packet.body_snapshot.git_blob_sha, `${relative}: audited body changed after research snapshot; refresh/reconcile the packet instead of silently transferring findings`);

  const pinnedSources = new Map();
  for (const used of packet.source_versions) {
    const source = sourceById.get(used.source_id);
    assert.ok(source, `${relative}: unknown source ${used.source_id}`);
    assert.equal(used.version, source.version, `${relative}: source version drift for ${used.source_id}`);
    assert.ok(!pinnedSources.has(used.source_id), `${relative}: duplicate source pin ${used.source_id}`);
    pinnedSources.set(used.source_id, used);

    if (used.use_mode === 'adapted') {
      assert.ok(
        source.legal_mode === 'ingest-adapt' || source.legal_mode === 'ingest-adapt-conditional',
        `${relative}: ${used.source_id} cannot be adapted under legal mode ${source.legal_mode}`
      );
    }
    if (source.legal_mode === 'reference-only') {
      assert.equal(used.use_mode, 'referenced', `${relative}: reference-only source ${used.source_id} may not be ingested/crosswalk-imported`);
    }
    if (source.legal_mode === 'conditional-reference') {
      assert.notEqual(used.use_mode, 'adapted', `${relative}: conditional-reference source ${used.source_id} may not be adapted without an explicit rights upgrade`);
    }
  }

  for (const crosswalk of packet.crosswalks) {
    assert.ok(pinnedSources.has(crosswalk.source_id), `${relative}: crosswalk source is not version-pinned: ${crosswalk.source_id}`);
  }

  for (const finding of packet.findings) {
    assert.ok(finding.method_labels.length > 0, `${relative}: finding ${finding.id} has no method labels`);
    for (const sourceId of finding.source_ids) {
      assert.ok(pinnedSources.has(sourceId), `${relative}: finding ${finding.id} uses unpinned source ${sourceId}`);
    }
  }

  for (const gap of packet.gaps_against_body) {
    assert.ok(gap.body_area.length > 0, `${relative}: gap ${gap.id} missing body area`);
    for (const sourceId of gap.evidence_source_ids) {
      assert.ok(pinnedSources.has(sourceId), `${relative}: gap ${gap.id} uses unpinned source ${sourceId}`);
    }
  }

  for (const contradiction of packet.contradictions) {
    for (const sourceId of contradiction.source_ids) {
      assert.ok(pinnedSources.has(sourceId), `${relative}: contradiction ${contradiction.id} uses unpinned source ${sourceId}`);
    }
  }

  const targetDomain = targetDomainById.get(packet.profession_id);
  assert.ok(targetDomain, `${relative}: profession missing from target registry`);
  const expectedHighStakes = highStakesDomains.has(targetDomain);
  assert.equal(packet.high_stakes.is_high_stakes, expectedHighStakes, `${relative}: high-stakes flag disagrees with target-domain policy`);
  if (expectedHighStakes) {
    assert.ok(packet.high_stakes.authorization_nonclaim.length >= 40, `${relative}: high-stakes packet needs a substantive authorization non-claim`);
  }
}

console.log(`Profession research intake PASS: ${sourceRegistry.sources.length} source policies; ${files.length} body-reviewed research packet(s); restricted-source ingestion blocked.`);
