import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const targets = read('registry/profession-targets.json');
const registry = read('registry/professions.json');
const policy = read('registry/coverage-policy.json');

assert.equal(targets.schema_version, '0.1');
assert.equal(policy.schema_version, '0.1');
assert.ok(policy.target_profession_count >= 100, 'valuable threshold must remain >=100');
assert.ok(policy.usable_statuses.includes('TEST'));
assert.ok(!policy.usable_statuses.includes('DRAFT'));
assert.ok(!policy.usable_statuses.includes('EXPERIMENTAL'));

const flat = [];
for (const [domain, items] of Object.entries(targets.domains)) {
  assert.ok(items.length > 0, `empty target domain: ${domain}`);
  for (const item of items) {
    assert.ok(Array.isArray(item) && item.length === 2, `bad target entry in ${domain}`);
    flat.push({ domain, id: item[0], name: item[1] });
  }
}
assert.ok(flat.length >= 100, `expected at least 100 profession targets, found ${flat.length}`);
const ids = new Set(flat.map(x => x.id));
assert.equal(ids.size, flat.length, 'duplicate profession target id');

const knownStatuses = new Set([...policy.usable_statuses, ...policy.non_counting_statuses]);
for (const record of registry.professions) {
  assert.ok(ids.has(record.profession_id), `registered profession missing from target map: ${record.profession_id}`);
  assert.ok(knownStatuses.has(record.status), `unclassified maturity status: ${record.status}`);
}

const usable = registry.professions.filter(p => policy.usable_statuses.includes(p.status));
assert.ok(usable.length <= registry.professions.length);
console.log(`Profession coverage PASS: ${flat.length} mapped targets; ${registry.professions.length} packages; ${usable.length}/${policy.target_profession_count} count as usable.`);
