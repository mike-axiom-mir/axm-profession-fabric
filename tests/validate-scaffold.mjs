import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDraft, findTarget } from '../tools/scaffold-profession.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targets = JSON.parse(fs.readFileSync(path.join(root, 'registry/profession-targets.json'), 'utf8'));
const registry = JSON.parse(fs.readFileSync(path.join(root, 'registry/professions.json'), 'utf8'));
const registered = new Set(registry.professions.map(item => item.profession_id));

let targetId = null;
for (const entries of Object.values(targets.domains)) {
  const candidate = entries.find(([id]) => !registered.has(id));
  if (candidate) {
    targetId = candidate[0];
    break;
  }
}
assert.ok(targetId, 'expected at least one mapped target to remain unregistered');

const target = findTarget(targetId);
assert.equal(target.professionId, targetId);
assert.ok(target.displayName.length > 0);
assert.ok(target.domain.length > 0);

const draft = buildDraft(targetId);
assert.equal(draft.files['package.json'].status, 'DRAFT');
assert.equal(draft.files['body.json'].status, 'DRAFT');
assert.equal(draft.files['package.json'].profession_id, targetId);
assert.equal(draft.files['body.json'].profession_id, targetId);
assert.ok(draft.files['RESEARCH_REQUIRED.md'].includes('Before registration'));
assert.throws(() => buildDraft('not-a-real-profession-target'), /unknown profession target/);
for (const registeredId of ['software-qa-playtest', 'software-architect', 'database-engineer']) {
  assert.ok(registered.has(registeredId), `expected registered fixture: ${registeredId}`);
  assert.throws(() => buildDraft(registeredId), /already registered/);
}

console.log(`Profession scaffold PASS: live unregistered target ${targetId} produces isolated DRAFT plan and existing/unknown targets are refused.`);
