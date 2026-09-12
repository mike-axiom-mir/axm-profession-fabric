import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const targets = read('registry/profession-targets.json');
const queue = read('registry/build-queue.json');
const registry = read('registry/professions.json');
const targetIds = new Set(Object.values(targets.domains).flat().map(([id]) => id));
const allowedStates = new Set(queue.states);
const seen = new Set();
let lastPriority = 0;
for (const item of queue.queue) {
  assert.ok(targetIds.has(item.profession_id), `queue target missing from target registry: ${item.profession_id}`);
  assert.ok(!seen.has(item.profession_id), `duplicate queue target: ${item.profession_id}`);
  seen.add(item.profession_id);
  assert.ok(allowedStates.has(item.state), `invalid queue state: ${item.state}`);
  assert.ok(item.priority > lastPriority, 'queue priorities must be strictly increasing');
  lastPriority = item.priority;
}
for (const p of registry.professions) {
  const queued = queue.queue.find(q => q.profession_id === p.profession_id);
  if (queued) assert.ok(['implemented-experimental','evidence-testing'].includes(queued.state), `registered package has stale queue state: ${p.profession_id}`);
}
console.log(`Profession build queue PASS: ${queue.queue.length} priority lanes map to known targets.`);
