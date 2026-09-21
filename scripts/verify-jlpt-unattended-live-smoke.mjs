#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseWorkerEventStream } from './jlpt-unattended-worker-io.mjs';

const root = resolve(import.meta.dirname, '..');
const runtime = spawnSync(process.execPath, ['scripts/jlpt-automation-state.mjs', 'runtime-dir'], { cwd: root, encoding: 'utf8' });
if (runtime.status !== 0 || !runtime.stdout.trim()) throw new Error('could not resolve JLPT runtime directory');
const statePath = resolve(runtime.stdout.trim(), 'state.json');
if (!existsSync(statePath)) throw new Error(`live smoke state missing: ${statePath}`);
const state = JSON.parse(readFileSync(statePath, 'utf8'));
const smoke = state.liveSmoke;
if (state.reason !== 'LIVE_SMOKE' || !smoke || smoke.exitCode !== 0 || smoke.schema !== 'PASS') throw new Error('runtime state does not record a passing live smoke');
for (const [label, path] of [['event stream', smoke.eventPath], ['result', smoke.resultPath]]) {
  if (!existsSync(path) || statSync(path).size === 0) throw new Error(`${label} missing or empty: ${path}`);
}
const stderrPath = smoke.eventPath.replace(/\.jsonl$/, '.stderr.log');
const partialPath = `${smoke.resultPath}.partial`;
if (!existsSync(stderrPath) || statSync(stderrPath).size !== 0) throw new Error(`live smoke stderr is not empty: ${stderrPath}`);
if (existsSync(partialPath)) throw new Error(`unpromoted partial result remains: ${partialPath}`);
const events = parseWorkerEventStream(smoke.eventPath);
if (!events.completed || events.malformedLines.length || events.errors.length || !events.threadId) throw new Error('live smoke JSONL event stream is incomplete or invalid');
const validation = spawnSync(process.execPath, ['scripts/validate-jlpt-unattended-result.mjs', 'validate', smoke.resultPath], { cwd: root, encoding: 'utf8' });
if (validation.status !== 0 || !validation.stdout.includes('CHILD RESULT JSON PASS')) throw new Error(validation.stderr || validation.stdout || 'live smoke result schema failed');
const result = JSON.parse(readFileSync(smoke.resultPath, 'utf8'));
if (result.status !== 'NO_CHANGE_CONTINUE' || result.changedFiles.length !== 0) throw new Error('live smoke result is not transport-only');
console.log(`LIVE SMOKE EVIDENCE PASS: exit=0; approval=never; stdin=ignored; stderr=0; events=${smoke.eventPath}; result=${smoke.resultPath}; schema=PASS; repositoryChanged=false`);
