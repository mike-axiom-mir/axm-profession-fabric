import assert from 'node:assert/strict';
import path from 'node:path';
import {createRequire} from 'node:module';
import {runCodeWorkflow} from '../workflows/code/index.mjs';
import {createCodeExecutor} from '../workflows/code/runtime.mjs';
import {bindCodeBuild} from '../professions/software/build-engineer/tools/code-build.mjs';
import {compileCodePlan} from '../professions/software/developer-tools-engineer/tools/code-compiler.mjs';
import {seal} from '../workflows/code/contract.mjs';

const compiler = createRequire(import.meta.url)(path.resolve(process.env.AXM_CODE_COMPILER || '../axm-102-grammer', 'code-programs/index.js'));
const compilerIdentity = {repository: 'mike-axiom-mir/axm-102-grammer', commit: '6e9efc2ebf759f9e2d03c933eafaf71856357471'};
const options = {compiler, compilerIdentity, execute: createCodeExecutor({python: process.env.AXM_CODE_PYTHON || 'python3'})};
let archive = compiler.emptyArchive(), jobs = 0, observedCases = 0, processes = 0;
for (const recipe of compiler.catalog().recipes) {
  const input = {action: 'retain', job: {id: recipe.id, recipeId: recipe.id}, archive};
  const before = JSON.stringify(input);
  const output = runCodeWorkflow(input, options);
  assert.equal(output.result, 'VERIFIED_FOR_CASES', JSON.stringify(output));
  assert.equal(JSON.stringify(input), before, 'caller input mutated');
  assert.equal(output.build.reproducibility.identical, true);
  observedCases += output.qa.observations.reduce((n, o) => n + o.cases.length, 0);
  processes += output.qa.observations.length;
  archive = output.retention.archive; jobs++;
}
const baseline = runCodeWorkflow({action: 'build', job: {id: 'invoice', recipeId: 'invoice-totals'}}, options);
assert.equal(baseline.result, 'CANDIDATE'); assert.equal(baseline.qa, null);
assert.deepEqual(baseline, runCodeWorkflow({action: 'build', job: {id: 'invoice', recipeId: 'invoice-totals'}}, options));
const pair = compileCodePlan(baseline.build.plan, compiler, compilerIdentity);
const drift = structuredClone(pair); drift.repeated[0].artifacts[0].content += '\n'; delete drift.compilationPairSha256;
assert.throws(() => bindCodeBuild(baseline.build.plan, seal(drift, 'compilationPairSha256')), /BUILD_NOT_REPRODUCIBLE/);
const entry = baseline.build.targets[0].reusableFunctions.find(f => f.name === 'invoice');
const restored = compiler.restore({archive, structuralSha256: entry.structuralSha256, name: 'quoteBase'});
const invoice = compiler.getRecipe('invoice-totals');
const cases = invoice.cases.map((c, i) => ({...c, id: 'accept-' + i, function: 'quoteBase'}));
const restoredJob = {id: 'restored-invoice', program: restored, cases, requirements: [{id: 'quote', statement: 'Restored invoice preserves exact accepted calculations.', cases: cases.map(c => c.id)}]};
const output = runCodeWorkflow({action: 'retain', job: restoredJob, archive}, options);
assert.equal(output.result, 'VERIFIED_FOR_CASES', JSON.stringify(output));
assert.equal(output.retention.archive.entries.length, archive.entries.length, 'rename added structural recipes');
assert.equal(runCodeWorkflow({action: 'verify', job: restoredJob}, {...options, execute: undefined}).result, 'BLOCKED');
const broken = structuredClone(restoredJob); broken.cases[0].expected.total = 999;
const held = runCodeWorkflow({action: 'retain', job: broken, archive}, options);
assert.equal(held.result, 'HOLD'); assert.equal(held.retention, null);
const badSource = structuredClone(restoredJob); badSource.program.functions[0].body = {op: 'raw', source: 'process.exit()'};
assert.match(runCodeWorkflow({action: 'verify', job: badSource}, options).diagnostic, /PROGRAM_HELD/);
observedCases += output.qa.observations.reduce((n, o) => n + o.cases.length, 0); processes += output.qa.observations.length; jobs++;
console.log(JSON.stringify({result: 'PASS', compiler: compilerIdentity, jobs, successfulRuntimeProcesses: processes, successfulCaseObservations: observedCases, archiveEntries: archive.entries.length,
  challenges: ['build drift', 'fresh repeat', 'dependency-closure restore', 'rename deduplication', 'missing executor', 'wrong oracle blocks retention', 'raw source refused']}));
