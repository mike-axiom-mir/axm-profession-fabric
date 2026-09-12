import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSchemaSubset } from '../tools/json-schema-subset.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));

const bodySchema = readJson('schemas/professional-body.schema.json');
const bodyTemplate = readJson('templates/professional-body.template.json');
const packageSchema = readJson('schemas/profession-package.schema.json');
const packageTemplate = readJson('templates/profession-package.template.json');

assert.equal(bodySchema.$schema, 'https://json-schema.org/draft/2020-12/schema');
assert.equal(bodySchema.properties.schema_version.const, '0.1');
assert.ok(bodySchema.required.length >= 20, 'professional body contract unexpectedly lost major sections');
validateSchemaSubset(bodyTemplate, bodySchema);

assert.deepEqual(bodyTemplate.roots, [
  'Truth',
  'Agency / non-domination',
  'Continuity',
  'Wisdom before speed'
]);
assert.equal(bodyTemplate.intelligence_interface.swappable_intelligence, true);
assert.equal(bodyTemplate.provenance.sources_required, true);
assert.equal(bodyTemplate.provenance.unknowns_preserved, true);
assert.equal(bodyTemplate.growth.rollback_required, true);
assert.equal(bodyTemplate.status, 'DRAFT');

assert.equal(packageSchema.$schema, 'https://json-schema.org/draft/2020-12/schema');
assert.equal(packageSchema.properties.schema_version.const, '0.1');
validateSchemaSubset(packageTemplate, packageSchema);
assert.equal(packageTemplate.isolation.cross_package_access, 'contract-only');
assert.equal(packageTemplate.isolation.no_silent_copy, true);
assert.ok(packageTemplate.execution_surfaces.includes('deterministic-flow'));

console.log(`Profession Fabric foundation PASS: body=${bodySchema.required.length} contract areas; isolated package template valid.`);
