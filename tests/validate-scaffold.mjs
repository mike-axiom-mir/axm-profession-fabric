import assert from 'node:assert/strict';
import { buildDraft, findTarget } from '../tools/scaffold-profession.mjs';

const target = findTarget('software-architect');
assert.equal(target.displayName, 'Software Architect');
assert.equal(target.domain, 'software');

const draft = buildDraft('software-architect');
assert.equal(draft.files['package.json'].status, 'DRAFT');
assert.equal(draft.files['body.json'].status, 'DRAFT');
assert.equal(draft.files['package.json'].profession_id, 'software-architect');
assert.equal(draft.files['body.json'].profession_id, 'software-architect');
assert.ok(draft.files['RESEARCH_REQUIRED.md'].includes('Before registration'));
assert.throws(() => buildDraft('not-a-real-profession-target'), /unknown profession target/);
assert.throws(() => buildDraft('software-qa-playtest'), /already registered/);

console.log('Profession scaffold PASS: known target produces isolated unregistered DRAFT plan and existing/unknown targets are refused.');
