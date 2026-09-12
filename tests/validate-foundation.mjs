import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));

const schema = readJson('schemas/professional-body.schema.json');
const body = readJson('templates/professional-body.template.json');

function resolveRef(ref) {
  assert.ok(ref.startsWith('#/$defs/'), `unsupported ref: ${ref}`);
  const key = ref.slice('#/$defs/'.length);
  assert.ok(schema.$defs[key], `missing schema definition: ${key}`);
  return schema.$defs[key];
}

function typeMatches(value, type) {
  if (type === 'array') return Array.isArray(value);
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  if (type === 'null') return value === null;
  if (type === 'integer') return Number.isInteger(value);
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
  return typeof value === type;
}

function validate(value, rule, location = '$') {
  if (rule.$ref) return validate(value, resolveRef(rule.$ref), location);

  if (rule.const !== undefined) {
    assert.deepEqual(value, rule.const, `${location}: expected const ${JSON.stringify(rule.const)}`);
  }

  if (rule.enum) {
    assert.ok(rule.enum.includes(value), `${location}: value not in enum`);
  }

  if (rule.type) {
    const types = Array.isArray(rule.type) ? rule.type : [rule.type];
    assert.ok(types.some(type => typeMatches(value, type)), `${location}: wrong type`);
  }

  if (typeof value === 'string') {
    if (rule.minLength !== undefined) assert.ok(value.length >= rule.minLength, `${location}: string too short`);
    if (rule.pattern) assert.match(value, new RegExp(rule.pattern), `${location}: pattern mismatch`);
  }

  if (Array.isArray(value)) {
    if (rule.minItems !== undefined) assert.ok(value.length >= rule.minItems, `${location}: too few items`);
    if (rule.maxItems !== undefined) assert.ok(value.length <= rule.maxItems, `${location}: too many items`);
    if (rule.uniqueItems) assert.equal(new Set(value.map(item => JSON.stringify(item))).size, value.length, `${location}: duplicate items`);

    if (rule.prefixItems) {
      rule.prefixItems.forEach((itemRule, index) => validate(value[index], itemRule, `${location}[${index}]`));
    }

    if (rule.items && rule.items !== false) {
      value.forEach((item, index) => validate(item, rule.items, `${location}[${index}]`));
    }
  }

  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const required of rule.required ?? []) {
      assert.ok(Object.hasOwn(value, required), `${location}: missing required key ${required}`);
    }

    if (rule.additionalProperties === false && rule.properties) {
      for (const key of Object.keys(value)) {
        assert.ok(Object.hasOwn(rule.properties, key), `${location}: unexpected key ${key}`);
      }
    }

    for (const [key, childRule] of Object.entries(rule.properties ?? {})) {
      if (Object.hasOwn(value, key)) validate(value[key], childRule, `${location}.${key}`);
    }
  }
}

assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema');
assert.equal(schema.properties.schema_version.const, '0.1');
assert.ok(schema.required.length >= 20, 'professional body contract unexpectedly lost major sections');

validate(body, schema);

assert.deepEqual(body.roots, [
  'Truth',
  'Agency / non-domination',
  'Continuity',
  'Wisdom before speed'
]);
assert.equal(body.intelligence_interface.swappable_intelligence, true);
assert.equal(body.provenance.sources_required, true);
assert.equal(body.provenance.unknowns_preserved, true);
assert.equal(body.growth.rollback_required, true);
assert.equal(body.status, 'DRAFT');

console.log(`Profession Fabric foundation PASS: template satisfies ${schema.required.length} required contract areas.`);
