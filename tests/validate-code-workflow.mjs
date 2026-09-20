import assert from 'node:assert/strict';
import fs from 'node:fs';
import {data, seal} from '../workflows/code/contract.mjs';
import {planCodeJob} from '../professions/software/software-architect/tools/code-plan.mjs';
import {reviewCodeEvidence} from '../professions/software/qa-playtest/tools/code-evidence.mjs';
import {assessCodeReadiness} from '../professions/software/integration-release/tools/code-readiness.mjs';
import {retainCodeConstruction} from '../professions/software/software-maintainer/tools/code-retention.mjs';
import {createCodeExecutor} from '../workflows/code/runtime.mjs';

// Frozen real Grammar 102 output, not a mock compiler. Regenerate only from the named source.
const build = JSON.parse(fs.readFileSync(new URL('./fixtures/code/build.json', import.meta.url), 'utf8'));
const copy = x => structuredClone(x);
let checks = 0;
function check(name, fn) { fn(); checks++; }
const planInput = () => {const {schema, coverage, planSha256, ...job} = copy(build.plan); return job;};
const observations = build.targets.flatMap(target => [1, 2].map(run => ({language: target.language, run, buildSha256: build.buildSha256, sourceSha256: target.sourceSha256,
  runtime: target.language + ':fixture', status: 'COMPLETE', cases: build.plan.cases.map(c => ({id: c.id, actual: c.expected, inputUnchanged: true}))})));
const review = rows => reviewCodeEvidence(build, rows);
check('baseline contract and role handoff', () => { assert.deepEqual(planCodeJob(planInput()), build.plan); assert.equal(review(observations).result, 'PASS'); });
check('missing requirements', () => {const p = planInput(); p.requirements = []; assert.throws(() => planCodeJob(p), /REQUIREMENTS_REQUIRED/);});
check('conflicting oracle', () => {const p = planInput(); p.cases.push({...p.cases[0], id: 'conflict', expected: 123}); assert.throws(() => planCodeJob(p), /CONFLICTING/);});
check('unmapped acceptance', () => {const p = planInput(); p.requirements.pop(); assert.throws(() => planCodeJob(p), /UNASSIGNED_CASE/);});
check('uncovered export', () => {const p = planInput(); p.program.exports.push('lineCost'); assert.throws(() => planCodeJob(p), /EXPORT_SUCCESS_CASE_MISSING/);});
check('unrelated untested helper', () => {const p = planInput(); p.program.functions.push({...p.program.functions[0], name: 'unused'}); assert.throws(() => planCodeJob(p), /UNREACHABLE_FUNCTION/);});
check('unknown target language', () => {const p = planInput(); p.languages.push('rust'); assert.throws(() => planCodeJob(p), /LANGUAGES|LANGUAGE_UNSUPPORTED/);});
check('duplicate target', () => {const p = planInput(); p.languages = ['python', 'python']; assert.throws(() => planCodeJob(p), /LANGUAGE_UNSUPPORTED/);});
check('unrun is blocked', () => assert.equal(review([]).result, 'BLOCKED'));
check('partly run is blocked', () => assert.equal(review(observations.slice(1)).result, 'BLOCKED'));
check('stale source is refused', () => {const o = copy(observations); o[0].sourceSha256 = '0'.repeat(64); assert.throws(() => review(o), /STALE_OBSERVATION/);});
check('stale build is refused', () => {const o = copy(observations); o[0].buildSha256 = '0'.repeat(64); assert.throws(() => review(o), /STALE_OBSERVATION/);});
check('duplicate observation is refused', () => assert.throws(() => review([observations[0], observations[0]]), /OBSERVATION_DUPLICATE/));
check('missing case refused', () => {const o = copy(observations); o[0].cases.pop(); assert.throws(() => review(o), /CASE_EVIDENCE_INCOMPLETE/);});
check('duplicate case refused', () => {const o = copy(observations); o[0].cases[1] = o[0].cases[0]; assert.throws(() => review(o), /DUPLICATE_OR_UNKNOWN/);});
check('input mutation defeats pass', () => {const o = copy(observations); o[0].cases[0].inputUnchanged = false; assert.ok(review(o).issues.some(i => i.code === 'INPUT_MUTATED'));});
check('wrong result and language parity', () => {const o = copy(observations); o[2].cases[0].actual = false; const q = review(o); assert.equal(q.result, 'HOLD'); assert.ok(q.issues.some(i => i.code === 'LANGUAGE_PARITY_MISMATCH'));});
check('nondeterministic run', () => {const o = copy(observations); o[1].cases[0].actual = 4; assert.ok(review(o).issues.some(i => i.code === 'RUNTIME_NOT_REPEATABLE'));});
check('tool failure cannot become success', () => {const o = copy(observations); o[0] = {...o[0], status: 'FAILED', diagnostic: 'TIMEOUT'}; assert.equal(review(o).result, 'HOLD');});
check('missing runtime stays blocked', () => {const o = copy(observations); o[0] = {...o[0], status: 'BLOCKED', diagnostic: 'ENOENT'}; assert.equal(review(o).result, 'BLOCKED');});
check('tampered build refused', () => {const b = copy(build); b.plan.id = 'other'; assert.throws(() => reviewCodeEvidence(b, observations), /BINDING_MISMATCH/);});
check('stale QA cannot authorize handoff', () => {const q = review(observations); const bad = seal({...q, buildSha256: '0'.repeat(64)}, 'qaSha256'); assert.throws(() => assessCodeReadiness(build, bad), /BINDING|QA_BUILD_MISMATCH/);});
check('failed run cannot retain', () => {const r = assessCodeReadiness(build, review([])); assert.throws(() => retainCodeConstruction({}, build, r), /RETENTION_REQUIRES/);});
check('accessors never executed', () => {let called = false; const x = Object.defineProperty({}, 'action', {get() {called = true;}, enumerable: true}); assert.throws(() => data(x), /ACCESSOR_REFUSED/); assert.equal(called, false);});
check('nonfinite data refused', () => assert.throws(() => data({x: NaN}), /NUMBER_INVALID/));
check('sparse arrays refused', () => assert.throws(() => data(new Array(2)), /ARRAY_INVALID/));
check('native JS fixture actually executes twice', () => {const target = build.targets.find(t => t.language === 'javascript'), execute = createCodeExecutor(); const rows = [1, 2].map(run => execute({build, target, run})); assert.ok(rows.every(r => r.status === 'COMPLETE')); for (const row of rows) assert.deepEqual(row.cases, observations[0].cases);});
console.log(`Code workflow PASS: ${checks} contract, seeded-defect and native-runtime checks; fixture compiler ${build.compiler.commit}.`);
