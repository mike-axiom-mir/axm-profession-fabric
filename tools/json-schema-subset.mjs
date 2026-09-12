import assert from 'node:assert/strict';

export function validateSchemaSubset(value, schema, location = '$', rootSchema = schema) {
  if (schema.$ref) {
    assert.ok(schema.$ref.startsWith('#/$defs/'), `${location}: unsupported ref ${schema.$ref}`);
    const key = schema.$ref.slice('#/$defs/'.length);
    assert.ok(rootSchema.$defs?.[key], `${location}: missing schema definition ${key}`);
    return validateSchemaSubset(value, rootSchema.$defs[key], location, rootSchema);
  }

  if (schema.const !== undefined) {
    assert.deepEqual(value, schema.const, `${location}: expected const ${JSON.stringify(schema.const)}`);
  }

  if (schema.enum) {
    assert.ok(schema.enum.includes(value), `${location}: value not in enum`);
  }

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const matches = types.some(type => {
      if (type === 'array') return Array.isArray(value);
      if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
      if (type === 'null') return value === null;
      if (type === 'integer') return Number.isInteger(value);
      if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
      return typeof value === type;
    });
    assert.ok(matches, `${location}: wrong type`);
  }

  if (typeof value === 'string') {
    if (schema.minLength !== undefined) assert.ok(value.length >= schema.minLength, `${location}: string too short`);
    if (schema.pattern) assert.match(value, new RegExp(schema.pattern), `${location}: pattern mismatch`);
  }

  if (Array.isArray(value)) {
    if (schema.minItems !== undefined) assert.ok(value.length >= schema.minItems, `${location}: too few items`);
    if (schema.maxItems !== undefined) assert.ok(value.length <= schema.maxItems, `${location}: too many items`);
    if (schema.uniqueItems) {
      assert.equal(new Set(value.map(item => JSON.stringify(item))).size, value.length, `${location}: duplicate items`);
    }
    schema.prefixItems?.forEach((child, index) => validateSchemaSubset(value[index], child, `${location}[${index}]`, rootSchema));
    if (schema.items && schema.items !== false) {
      value.forEach((item, index) => validateSchemaSubset(item, schema.items, `${location}[${index}]`, rootSchema));
    }
  }

  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const required of schema.required ?? []) {
      assert.ok(Object.hasOwn(value, required), `${location}: missing required key ${required}`);
    }
    if (schema.additionalProperties === false && schema.properties) {
      for (const key of Object.keys(value)) {
        assert.ok(Object.hasOwn(schema.properties, key), `${location}: unexpected key ${key}`);
      }
    }
    for (const [key, child] of Object.entries(schema.properties ?? {})) {
      if (Object.hasOwn(value, key)) validateSchemaSubset(value[key], child, `${location}.${key}`, rootSchema);
    }
  }
}
