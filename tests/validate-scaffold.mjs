import assert from 'node:assert/strict';
import { buildDraft, findTarget } from '../tools/scaffold-profession.mjs';

const target = findTarget('database-engineer');
assert.equal(target.displayName, 'Database Engineer');
assert.equal(target.domain, 'software');

const draft = buildDraft('database-engineer');
assert.equal(draft.files['package.json'].status, 'DRAFT');
assert.equal(draft.files['body.json'].status, 'DRAFT');
assert.equal(draft.files['package.json'].profession_id, 'database-engineer');
assert.equal(draft.files['body.json'].profession_id, 'database-engineer');
assert.ok(draft.files['RESEARCH_REQUIRED.md'].includes('Before registration'));
assert.throws(() => buildDraft('not-a-real-profession-target'), /unknown profession target/);
assert.throws(() => buildDraft('software-qa-playtest'), /already registered/);
assert.throws(() => buildDraft('software-architect'), /already registered/);

console.log('Profession scaffold PASS: known unregistered target produces isolated DRAFT plan and existing/unknown targets are refused.');
