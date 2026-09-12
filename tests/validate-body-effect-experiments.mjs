import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const readJson = rel => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));

const registry = readJson('experiments/body-effect/registry.json');
const professions = readJson('registry/professions.json');
const professionIds = new Set(professions.professions.map(p => p.profession_id));

assert.equal(registry.schema_version, '0.1');
assert.ok(Array.isArray(registry.experiments) && registry.experiments.length > 0, 'body-effect registry must contain at least one experiment');

const seen = new Set();
for (const exp of registry.experiments) {
  assert.ok(!seen.has(exp.experiment_id), `duplicate body-effect experiment id: ${exp.experiment_id}`);
  seen.add(exp.experiment_id);
  assert.ok(professionIds.has(exp.profession_id), `${exp.experiment_id}: unknown profession ${exp.profession_id}`);
  assert.deepEqual(exp.required_arms, ['role-only', 'professional-body'], `${exp.experiment_id}: both exact arms are required`);
  assert.equal(exp.same_executor_required, true, `${exp.experiment_id}: same-executor control must remain required`);
  assert.equal(exp.fresh_context_required, true, `${exp.experiment_id}: fresh contexts must remain required`);
  assert.equal(exp.evaluator_blinded, true, `${exp.experiment_id}: blinded evaluation must remain required`);
  assert.ok(exp.minimum_repeats_before_candidate_effect >= 2, `${exp.experiment_id}: one pair cannot establish candidate effect`);
  assert.equal(exp.second_executor_required_before_transfer_claim, true, `${exp.experiment_id}: transfer claim requires second executor`);
  assert.ok(['READY_NOT_RUN','RUNNING','COMPLETE','BLOCKED'].includes(exp.status), `${exp.experiment_id}: invalid status`);
  assert.ok(fs.existsSync(path.join(root, exp.task)), `${exp.experiment_id}: task missing`);
  assert.ok(fs.existsSync(path.join(root, exp.oracle)), `${exp.experiment_id}: oracle missing`);
  assert.ok(fs.existsSync(path.join(root, exp.trial_schema)), `${exp.experiment_id}: trial schema missing`);

  const task = readJson(exp.task);
  const oracle = readJson(exp.oracle);
  assert.equal(task.fixture_id, exp.experiment_id, `${exp.experiment_id}: task fixture mismatch`);
  assert.equal(task.profession_id, exp.profession_id, `${exp.experiment_id}: task profession mismatch`);
  assert.equal(oracle.fixture_id, exp.experiment_id, `${exp.experiment_id}: oracle fixture mismatch`);
  assert.equal(oracle.profession_id, exp.profession_id, `${exp.experiment_id}: oracle profession mismatch`);
  assert.equal(oracle.visibility, 'EVALUATOR_ONLY', `${exp.experiment_id}: oracle must stay evaluator-only`);
  assert.ok(Array.isArray(task.evidence_limits) && task.evidence_limits.length > 0, `${exp.experiment_id}: task needs explicit evidence limits`);
  assert.ok(Array.isArray(oracle.required_boundaries) && oracle.required_boundaries.length > 0, `${exp.experiment_id}: oracle needs evidence-boundary checks`);

  if (exp.status === 'READY_NOT_RUN') {
    assert.equal(exp.result_claim, 'NONE', `${exp.experiment_id}: unrun experiment cannot claim an effect`);
  }
}

console.log(`Professional Body effect experiment PASS: ${registry.experiments.length} controlled fixture(s); contaminated role-only controls forbidden; no unrun effect claims.`);
