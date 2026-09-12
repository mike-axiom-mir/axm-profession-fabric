import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const targets = read('registry/profession-targets.json');
const registry = read('registry/professions.json');
const maturity = read('registry/maturity.json');
const policy = read('registry/coverage-policy.json');

assert.equal(targets.schema_version, '0.1');
assert.equal(policy.schema_version, '0.1');
assert.equal(maturity.schema_version, '0.1');
assert.ok(policy.target_profession_count >= 100, 'valuable threshold must remain >=100');
assert.ok(policy.usable_statuses.includes('TEST'));
assert.ok(!policy.usable_statuses.includes('DRAFT'));
assert.ok(!policy.usable_statuses.includes('EXPERIMENTAL'));
assert.equal(policy.maturity_registry, 'registry/maturity.json');

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

const constructionStatuses = new Set([...policy.usable_statuses, ...policy.non_counting_statuses]);
for (const record of registry.professions) {
  assert.ok(ids.has(record.profession_id), `registered profession missing from target map: ${record.profession_id}`);
  assert.ok(constructionStatuses.has(record.status), `unclassified full-body status: ${record.status}`);
}

const registered = new Set(registry.professions.map(x => x.profession_id));
const maturityIds = new Set();
for (const record of maturity.records) {
  assert.ok(registered.has(record.profession_id), `usable maturity record missing registered package: ${record.profession_id}`);
  assert.ok(policy.usable_statuses.includes(record.status), `non-usable status in maturity registry: ${record.status}`);
  assert.ok(!maturityIds.has(record.profession_id), `duplicate maturity profession: ${record.profession_id}`);
  maturityIds.add(record.profession_id);
}

const usable = maturity.records.filter(p => policy.usable_statuses.includes(p.status));
console.log(`Profession coverage PASS: ${flat.length} mapped targets; ${registry.professions.length} packages; ${usable.length}/${policy.target_profession_count} have validated usable scoped evidence.`);
