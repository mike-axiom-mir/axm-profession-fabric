import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {runCodeWorkflow} from '../workflows/code/index.mjs';
import {createCodeExecutor} from '../workflows/code/runtime.mjs';

// Compiler location is a host CLI argument, never read from the JSON job.
const [compilerRoot, requestPath, python = 'python3'] = process.argv.slice(2);
if (!compilerRoot || !requestPath) throw Error('Usage: node tools/run-code-workflow.mjs PINNED_GRAMMAR_ROOT REQUEST.json [PYTHON]');
const bytes = fs.readFileSync(requestPath);
if (bytes.length > 1048576) throw Error('REQUEST_BYTES_LIMIT');
const commit = execFileSync('git', ['-C', compilerRoot, 'rev-parse', 'HEAD'], {encoding: 'utf8'}).trim();
if (execFileSync('git', ['-C', compilerRoot, 'status', '--porcelain'], {encoding: 'utf8'}).trim()) throw Error('COMPILER_CHECKOUT_NOT_CLEAN');
const compiler = createRequire(import.meta.url)(path.resolve(compilerRoot, 'code-programs/index.js'));
const result = runCodeWorkflow(JSON.parse(bytes), {compiler, compilerIdentity: {repository: 'mike-axiom-mir/axm-102-grammer', commit}, execute: createCodeExecutor({python})});
process.stdout.write(JSON.stringify(result, null, 2) + '\n');
if (['HOLD', 'BLOCKED'].includes(result.result)) process.exitCode = 2;
