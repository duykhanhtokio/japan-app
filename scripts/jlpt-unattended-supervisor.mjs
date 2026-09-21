#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { appendFileSync, existsSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
process.chdir(root);
const testMode = process.env.JLPT_UNATTENDED_TEST_MODE === '1';
const codexBin = process.env.JLPT_UNATTENDED_CODEX_BIN || 'codex';
const args = process.argv.slice(2);
let dryRun = false;
let maxBatches = Number(process.env.JLPT_UNATTENDED_MAX_BATCHES || 10000);
for (let index = 0; index < args.length; index += 1) {
  if (args[index] === '--dry-run') dryRun = true;
  else if (args[index] === '--max-batches' && /^[1-9][0-9]*$/.test(args[index + 1] || '')) maxBatches = Number(args[++index]);
  else { console.error('usage: scripts/run-jlpt-unattended.sh [--dry-run] [--max-batches N]'); process.exit(64); }
}

const sha = (value) => createHash('sha256').update(value).digest('hex');
const repoKey = sha(root).slice(0, 16);
const runtimeDir = resolve(process.env.TMPDIR || '/tmp', 'japan-app-jlpt-runtime', repoKey);
const statePath = resolve(runtimeDir, 'state.json');
const journalPath = resolve(runtimeDir, 'progress.jsonl');
const cacheDir = resolve(runtimeDir, 'cache');
const lockDir = resolve(runtimeDir, 'supervisor.lock');
const logDir = resolve(runtimeDir, 'logs');
mkdirSync(cacheDir, { recursive: true });
mkdirSync(logDir, { recursive: true });
try { mkdirSync(lockDir); } catch { console.error(`STOP: another supervisor is active: ${lockDir}`); process.exit(3); }
writeFileSync(resolve(lockDir, 'pid'), `${process.pid}\n`);

const atomicJson = (path, value) => {
  mkdirSync(dirname(path), { recursive: true });
  const temp = `${path}.tmp-${process.pid}`;
  writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(temp, path);
};
const loadJson = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const runtimeState = existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : { schemaVersion: 1 };
const setState = (patch) => {
  Object.assign(runtimeState, patch, { schemaVersion: 1, updatedAt: new Date().toISOString() });
  atomicJson(statePath, runtimeState);
};
const journal = (event) => appendFileSync(journalPath, `${JSON.stringify({ timestamp: new Date().toISOString(), ...event })}\n`);
const git = (parameters, options = {}) => {
  const result = spawnSync('git', parameters, { cwd: root, encoding: 'utf8', ...options });
  if (result.status !== 0 && !options.allowFailure) throw new Error(`git ${parameters.join(' ')} failed: ${(result.stderr || result.stdout).trim()}`);
  return result;
};
const node = (script, parameters = [], options = {}) => {
  const result = spawnSync(process.execPath, [script, ...parameters], { cwd: root, encoding: 'utf8', ...options });
  if (result.status !== 0 && !options.allowFailure) throw new Error(`${script} failed: ${(result.stderr || result.stdout).trim()}`);
  return result;
};
const sleep = (milliseconds) => new Promise((done) => setTimeout(done, milliseconds));
const retryLimitMs = Number(process.env.JLPT_RETRY_LIMIT_MS || 6 * 60 * 60 * 1000);
const retryBaseMs = Number(process.env.JLPT_RETRY_BASE_MS || 30000);
const retryMaxMs = Number(process.env.JLPT_RETRY_MAX_MS || 15 * 60 * 1000);
const retryGlobal = async (label, operation) => {
  const started = Date.now();
  let attempt = 0;
  while (true) {
    try { return await operation(); } catch (error) {
      const elapsed = Date.now() - started;
      if (elapsed >= retryLimitMs) throw new Error(`${label} retry limit ${retryLimitMs}ms exhausted: ${error.message}`);
      const exponential = Math.min(retryMaxMs, retryBaseMs * (2 ** attempt));
      const jitter = testMode ? 0 : Math.floor(Math.random() * Math.max(1, exponential * 0.2));
      const waitMs = Math.min(exponential + jitter, retryLimitMs - elapsed);
      journal({ event: 'GLOBAL_RETRY_WAIT', label, attempt: attempt + 1, waitMs, modelCalled: false, error: error.message });
      await sleep(waitMs);
      attempt += 1;
    }
  }
};
const modelRetry = { startedAt: 0, attempt: 0 };
const waitBeforeModelRetry = async (label, error) => {
  if (!modelRetry.startedAt) modelRetry.startedAt = Date.now();
  const elapsed = Date.now() - modelRetry.startedAt;
  if (elapsed >= retryLimitMs) throw new Error(`${label} retry limit ${retryLimitMs}ms exhausted: ${error}`);
  const exponential = Math.min(retryMaxMs, retryBaseMs * (2 ** modelRetry.attempt));
  const jitter = testMode ? 0 : Math.floor(Math.random() * Math.max(1, exponential * 0.2));
  const waitMs = Math.min(exponential + jitter, retryLimitMs - elapsed);
  journal({ event: 'GLOBAL_RETRY_WAIT', label, attempt: modelRetry.attempt + 1, waitMs, modelCalled: false, error });
  await sleep(waitMs);
  modelRetry.attempt += 1;
};

let stopping = false;
let activeChild = null;
let heartbeat = null;
let finalReason = 'EXIT';
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(signal, () => {
  if (stopping) return;
  stopping = true;
  finalReason = signal;
  setState({ status: 'stopping', signal, acceptNewUnit: false });
  if (activeChild) activeChild.kill('SIGINT');
});

const statusPorcelain = () => git(['status', '--porcelain=v1', '--untracked-files=all']).stdout.trim();
const branchInfo = () => {
  const branch = git(['branch', '--show-current']).stdout.trim();
  const upstream = git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}']).stdout.trim();
  if (!branch || !upstream.includes('/')) throw new Error('current branch must have a configured upstream');
  const slash = upstream.indexOf('/');
  return { branch, upstream, remote: upstream.slice(0, slash), remoteBranch: upstream.slice(slash + 1) };
};
const runCommand = (command, logPath) => {
  let result;
  if (command === 'git diff --check') result = git(['diff', '--check'], { allowFailure: true });
  else {
    const match = /^node (scripts\/[A-Za-z0-9._/-]+\.mjs)$/.exec(command);
    if (!match) throw new Error(`manifest validation command is not allowlisted: ${command}`);
    result = node(match[1], [], { allowFailure: true });
  }
  appendFileSync(logPath, `$ ${command}\n${result.stdout}${result.stderr}`);
  if (result.status !== 0) throw new Error(`validation failed: ${command}`);
};
const startupValidators = testMode ? ['scripts/check-jlpt-approved-ui-lock.mjs'] : [
  'scripts/validate-jlpt-automation-state.mjs', 'scripts/check-jlpt-approved-ui-lock.mjs',
  'scripts/check-jlpt-catalog-completeness.mjs', 'scripts/check-jlpt-structured-exams.mjs',
  'scripts/check-jlpt-no-scanned-runtime.mjs', 'scripts/check-jlpt-navigation-contract.mjs',
  'scripts/check-jlpt-50-exams-integration.mjs', 'scripts/check-n1-2012-12-integration.mjs',
  'scripts/check-n1-2013-07-integration.mjs'
];
const runStartupValidation = (logPath) => startupValidators.forEach((script) => runCommand(`node ${script}`, logPath));
const runFastValidation = (logPath) => {
  runCommand('node scripts/validate-jlpt-automation-state.mjs', logPath);
  runCommand('node scripts/check-jlpt-approved-ui-lock.mjs', logPath);
};
const workPersistence = (logPath) => {
  const result = node('scripts/check-work-persistence.mjs', [], { allowFailure: true });
  appendFileSync(logPath, result.stdout + result.stderr);
  if (result.status !== 0 || !result.stdout.includes('WORK PERSISTENCE PASS')) throw new Error('WORK PERSISTENCE PASS not emitted');
};
const persistAll = async (info, logPath) => {
  await retryGlobal('git push/fetch/persistence', async () => {
    const push = git(['push', info.remote, `HEAD:refs/heads/${info.remoteBranch}`], { allowFailure: true });
    appendFileSync(logPath, push.stdout + push.stderr);
    if (push.status !== 0) throw new Error('push failed');
    const fetch = git(['fetch', info.remote, info.remoteBranch], { allowFailure: true });
    appendFileSync(logPath, fetch.stdout + fetch.stderr);
    if (fetch.status !== 0) throw new Error('fetch failed');
    workPersistence(logPath);
  });
  setState({ pushPending: false, lastRemoteHeadSHA: git(['rev-parse', 'HEAD']).stdout.trim() });
};

const lockedPaths = new Set([
  'src/components/jlpt/N1OfficialTrial.tsx', 'src/components/jlpt/ui/JlptExamUI.tsx',
  'src/theme/jlpt-exam-design-system.ts', 'src/services/jlpt-trial-session-storage.ts',
  'src/app/[level]/[section].tsx', 'src/components/jlpt/ApprovedJlptExamCatalog.tsx'
]);
const globMatch = (path, pattern) => {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replaceAll('**', '\u0000').replaceAll('*', '[^/]*').replaceAll('\u0000', '.*');
  return new RegExp(`^${escaped}$`).test(path);
};
const allowedPath = (path, manifest) => !lockedPaths.has(path) && !path.startsWith('.git/') && !/(^|\/)\.env(?:\.|$)/.test(path) && manifest.allowedOutputPaths.some((pattern) => globMatch(path, pattern));
const actualChanges = () => [...new Set([
  ...git(['diff', '--name-only', '-z']).stdout.split('\0').filter(Boolean),
  ...git(['diff', '--cached', '--name-only', '-z']).stdout.split('\0').filter(Boolean),
  ...git(['ls-files', '--others', '--exclude-standard', '-z']).stdout.split('\0').filter(Boolean)
])].sort();

const invokeWorker = (sessionId, prompt, resultPath, eventPath) => new Promise((done) => {
  const common = ['--json', '--output-schema', resolve(root, 'scripts/jlpt-unattended-result.schema.json'), '--output-last-message', resultPath];
  const workerArgs = sessionId
    ? ['exec', 'resume', ...common, sessionId, prompt]
    : ['exec', '--sandbox', 'workspace-write', '-c', 'approval_policy="never"', '-C', root, ...common, prompt];
  const output = openSync(eventPath, 'a');
  activeChild = spawn(codexBin, workerArgs, { cwd: root, stdio: ['ignore', output, output] });
  activeChild.on('exit', (code, signal) => { activeChild = null; done({ code, signal }); });
});
const extractSessionId = (eventPath) => {
  for (const line of readFileSync(eventPath, 'utf8').split('\n')) {
    try { const event = JSON.parse(line); if (event.type === 'thread.started' && event.thread_id) return event.thread_id; } catch {}
  }
  return null;
};
const workerPrompt = (progress, manifest, resume, cacheHit) => {
  const base = readFileSync(resolve(root, 'docs/jlpt-workspace/JLPT_UNATTENDED_PROMPT.md'), 'utf8');
  return `${base}\n\nSUPERVISOR STATE (authoritative, compact):\n${JSON.stringify({ progress, nextUnit: manifest.nextUnit, pendingUnits: manifest.pendingUnits, resume, cacheHit })}`;
};

async function main() {
  const required = ['AGENTS.md', 'package.json', 'src', 'assets', 'scripts', 'docs/AI_SESSION_START_HERE.md', 'docs/jlpt-workspace/JLPT_AUTOMATION_DECISIONS.json', 'docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json', 'scripts/jlpt-unattended-result.schema.json'];
  for (const path of required) if (!existsSync(resolve(root, path))) throw new Error(`missing required path: ${path}`);
  const info = branchInfo();
  if (statusPorcelain()) throw new Error('working tree is not clean; existing changes are preserved');
  const startupLog = resolve(logDir, `startup-${Date.now()}.log`);
  await retryGlobal('initial fetch', async () => {
    const result = git(['fetch', info.remote, info.remoteBranch], { allowFailure: true });
    appendFileSync(startupLog, result.stdout + result.stderr);
    if (result.status !== 0) throw new Error('initial fetch failed');
  });
  const localHead = git(['rev-parse', 'HEAD']).stdout.trim();
  const remoteHead = git(['rev-parse', info.upstream]).stdout.trim();
  if (localHead !== remoteHead) {
    const remoteIsAncestor = git(['merge-base', '--is-ancestor', info.upstream, 'HEAD'], { allowFailure: true }).status === 0;
    if (!remoteIsAncestor) throw new Error(`local HEAD ${localHead} diverges from or trails remote ${remoteHead}`);
    setState({ pushPending: true, recoveredFromGitAhead: true });
    await persistAll(info, startupLog);
  }
  const digest = node('scripts/jlpt-automation-state.mjs', ['digest-check'], { allowFailure: true });
  const fastResume = digest.status === 0;
  appendFileSync(startupLog, fastResume ? digest.stdout : 'RULE DIGEST CHANGED: full startup rules required\n');
  if (fastResume) runFastValidation(startupLog); else runStartupValidation(startupLog);
  workPersistence(startupLog);
  const help = spawnSync(codexBin, ['exec', '--help'], { cwd: root, encoding: 'utf8' });
  if (help.status !== 0 || !help.stdout.includes('--output-schema') || !help.stdout.includes('--output-last-message') || !help.stdout.includes('--sandbox')) throw new Error('installed Codex CLI is incompatible');
  if (dryRun) {
    finalReason = 'DRY_RUN';
    console.log(`DRY RUN PASS | branch=${info.branch} | upstream=${info.upstream} | HEAD=${localHead} | fastResume=${fastResume} | approval=never | stdin=ignored | child=not-called`);
    return;
  }

  setState({ status: 'running', branch: info.branch, upstream: info.upstream, fastResume, acceptNewUnit: true });
  let batches = 0;
  const initialProgress = loadJson('docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json');
  let sessionId = runtimeState.activeExamId === initialProgress.activeExamId ? runtimeState.workerSessionId : null;
  let handoff = runtimeState.compactHandoff || '';
  let repeatedNoChange = null;
  let interactionRetries = 0;
  heartbeat = setInterval(() => {
    const progress = loadJson('docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json');
    const local = git(['rev-parse', '--short', 'HEAD']).stdout.trim();
    console.log(`RUNNING | ${progress.activeLevel} | ${progress.activeExamId} | ${progress.phase} | local=${local} | pushPending=${runtimeState.pushPending === true}`);
  }, testMode ? 250 : 60000);

  while (!stopping && batches < maxBatches) {
    const progress = loadJson('docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json');
    const manifest = loadJson(progress.manifestPath);
    const cacheKey = sha(`${manifest.nextUnit}\n${JSON.stringify(manifest.sourceChecksums)}\nworker-v1`);
    const cacheHit = existsSync(resolve(cacheDir, `${cacheKey}.json`));
    const turn = batches + 1;
    const eventPath = resolve(logDir, `worker-${turn}-${Date.now()}.jsonl`);
    const resultPath = resolve(logDir, `worker-${turn}-${Date.now()}.result.json`);
    const prompt = workerPrompt(progress, manifest, handoff, cacheHit);
    setState({ status: 'worker_running', activeExamId: progress.activeExamId, workerSessionId: sessionId, currentUnit: manifest.nextUnit, pushPending: runtimeState.pushPending === true });
    const worker = await invokeWorker(sessionId, prompt, resultPath, eventPath);
    if (stopping) break;
    if (!sessionId) sessionId = extractSessionId(eventPath);
    if (!sessionId && !testMode) throw new Error(`worker session id missing: ${eventPath}`);
    if (worker.code !== 0 || !existsSync(resultPath)) {
      const workerLog = existsSync(eventPath) ? readFileSync(eventPath, 'utf8') : '';
      if (!statusPorcelain() && /rate.?limit|capacity|temporarily unavailable|resource exhausted|network/i.test(workerLog)) {
        await persistAll(info, eventPath);
        await waitBeforeModelRetry('Codex worker availability', `worker exited ${worker.code ?? worker.signal}`);
        continue;
      }
      throw new Error(`worker exited ${worker.code ?? worker.signal}; result=${resultPath}`);
    }
    const validation = node('scripts/validate-jlpt-unattended-result.mjs', ['validate', resultPath], { allowFailure: true });
    if (validation.status !== 0) {
      const validationError = validation.stderr.trim();
      if (/attempted to ask the user|stdin|numbered choices/i.test(validationError) && !statusPorcelain()) {
        if (interactionRetries === 0) {
          interactionRetries = 1;
          handoff = 'The prior result violated fully unattended mode. Apply JLPT_AUTOMATION_DECISIONS.json and complete the manifest unit without asking the user.';
          continue;
        }
        journal({ event: 'WORKER_FAILURE_LOCAL', examId: progress.activeExamId, unit: manifest.nextUnit, reason: validationError, retryCount: 1 });
        sessionId = null;
        interactionRetries = 0;
        handoff = `Skip failed unit ${manifest.nextUnit} for this worker session and deterministically take the next pending manifest unit; do not ask the user.`;
        continue;
      }
      throw new Error(validationError);
    }
    const result = JSON.parse(readFileSync(resultPath, 'utf8'));
    interactionRetries = 0;
    if (result.examId && result.examId !== progress.activeExamId) throw new Error(`worker exam mismatch: ${result.examId}`);
    if (result.status === 'RATE_LIMITED') {
      if (statusPorcelain()) throw new Error('RATE_LIMITED worker changed files');
      await persistAll(info, eventPath);
      await waitBeforeModelRetry('Codex rate limit', 'structured RATE_LIMITED result');
      continue;
    }
    modelRetry.startedAt = 0;
    modelRetry.attempt = 0;
    if (result.status === 'BLOCKED_GLOBAL') throw new Error(`GLOBAL blocker: ${JSON.stringify(result.blockers)}`);
    if (result.status === 'COMPLETE_ALL_AVAILABLE') {
      if (statusPorcelain()) throw new Error('COMPLETE_ALL_AVAILABLE changed files');
      runStartupValidation(eventPath);
      await persistAll(info, eventPath);
      finalReason = 'COMPLETE_ALL_AVAILABLE';
      console.log(`COMPLETE_ALL_AVAILABLE | HEAD=${git(['rev-parse', 'HEAD']).stdout.trim()} | WORK PERSISTENCE PASS`);
      return;
    }
    if (result.status === 'NO_CHANGE_CONTINUE') {
      if (statusPorcelain()) throw new Error('NO_CHANGE_CONTINUE changed files');
      if (repeatedNoChange === result.nextAction) {
        journal({ event: 'WORKER_FAILURE_LOCAL', examId: progress.activeExamId, unit: result.unit, reason: 'repeated no progress', nextAction: result.nextAction });
        sessionId = null;
      }
      repeatedNoChange = result.nextAction;
      handoff = `Previous worker made no change. Deterministically take the next pending manifest unit after: ${result.nextAction}`;
      continue;
    }

    const changed = actualChanges();
    if (JSON.stringify(changed) !== JSON.stringify([...result.changedFiles].sort())) throw new Error(`changed-file manifest mismatch: actual=${JSON.stringify(changed)}`);
    if (changed.some((path) => !allowedPath(path, manifest))) throw new Error(`worker changed forbidden path: ${changed.filter((path) => !allowedPath(path, manifest)).join(', ')}`);
    if (!/^((feat|fix|docs|test|chore)\(jlpt\): .{1,100})$/.test(result.commitMessage)) throw new Error('unsafe commit message');
    for (const command of manifest.validationCommands) runCommand(command, eventPath);
    runCommand('node scripts/check-jlpt-approved-ui-lock.mjs', eventPath);
    git(['diff', '--check']);
    git(['add', '--', ...changed]);
    const staged = git(['diff', '--cached', '--name-only']).stdout.trim().split('\n').filter(Boolean).sort();
    if (JSON.stringify(staged) !== JSON.stringify(changed)) throw new Error('staged set differs from validated manifest');
    git(['diff', '--cached', '--check']);
    git(['commit', '-m', result.commitMessage]);
    const commit = git(['rev-parse', 'HEAD']).stdout.trim();
    atomicJson(resolve(cacheDir, `${cacheKey}.json`), { schemaVersion: 1, examId: progress.activeExamId, unit: result.unit, sourceChecksum: result.sourceChecksum, toolVersion: result.toolVersion, outputPaths: changed, validation: result.validations, localCommit: commit });
    setState({ status: 'batch_committed', activeExamId: progress.activeExamId, workerSessionId: sessionId, lastValidatedLocalCommit: commit, pushPending: true, compactHandoff: result.contextHandoff });
    journal({ event: 'BATCH_COMMITTED', examId: progress.activeExamId, unit: result.unit, sourceChecksum: result.sourceChecksum, outputPaths: changed, validation: result.validations, localCommit: commit, pushPending: true, remoteSHA: git(['rev-parse', info.upstream]).stdout.trim(), nextAction: result.nextAction });
    console.log(`BATCH COMMITTED | ${progress.activeExamId} | ${result.unit} | ${commit} | pushPending=true`);
    batches += 1;
    repeatedNoChange = null;
    handoff = result.contextHandoff;
    if (result.examComplete) {
      await persistAll(info, eventPath);
      sessionId = null;
      handoff = '';
      journal({ event: 'EXAM_COMPLETE', examId: progress.activeExamId, localCommit: commit, pushPending: false, remoteSHA: commit, nextAction: result.nextAction });
      console.log(`EXAM COMPLETE | ${progress.activeExamId} | ${commit} | WORK PERSISTENCE PASS`);
      const transitionResult = node('scripts/jlpt-automation-state.mjs', ['advance-exam', commit]);
      const transition = JSON.parse(transitionResult.stdout);
      if (transition.completeAll) {
        runStartupValidation(eventPath);
        finalReason = 'COMPLETE_ALL_AVAILABLE';
        console.log(`COMPLETE_ALL_AVAILABLE | HEAD=${commit} | WORK PERSISTENCE PASS`);
        return;
      }
      const transitionChanges = actualChanges();
      const transitionAllowlist = new Set([transition.manifestPath, transition.checkpointPath, 'docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json']);
      if (!transitionChanges.length || transitionChanges.some((path) => !transitionAllowlist.has(path))) throw new Error(`unexpected exam-transition paths: ${transitionChanges.join(', ')}`);
      runCommand('node scripts/validate-jlpt-automation-state.mjs', eventPath);
      runCommand('node scripts/check-jlpt-approved-ui-lock.mjs', eventPath);
      git(['diff', '--check']);
      git(['add', '--', ...transitionChanges]);
      git(['diff', '--cached', '--check']);
      git(['commit', '-m', `chore(jlpt): advance automation to ${transition.sourceId}`]);
      const transitionCommit = git(['rev-parse', 'HEAD']).stdout.trim();
      setState({ activeExamId: transition.examId, workerSessionId: null, pushPending: true, compactHandoff: '' });
      journal({ event: 'EXAM_TRANSITION', examId: transition.examId, unit: 'manifest-initialization', outputPaths: transitionChanges, validation: ['automation-state', 'ui-lock'], localCommit: transitionCommit, pushPending: true, remoteSHA: commit, nextAction: loadJson('docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json').nextAction });
      await persistAll(info, eventPath);
      console.log(`EXAM TRANSITION | ${transition.examId} | ${transitionCommit} | WORK PERSISTENCE PASS`);
    } else if (result.contextHandoff) {
      await persistAll(info, eventPath);
      sessionId = null;
      console.log(`CONTEXT HANDOFF | ${progress.activeExamId} | ${commit} | WORK PERSISTENCE PASS`);
    }
  }
  finalReason = stopping ? finalReason : 'CONTROLLED_BATCH_LIMIT';
}

async function shutdown() {
  if (heartbeat) clearInterval(heartbeat);
  const info = branchInfo();
  const logPath = resolve(logDir, `session-end-${Date.now()}.log`);
  const dirty = statusPorcelain();
  let persistence = 'SKIPPED_DIRTY_UNVALIDATED';
  if (!dirty) {
    try { await persistAll(info, logPath); persistence = 'WORK PERSISTENCE PASS'; }
    catch (error) { persistence = `PUSH_PENDING: ${error.message}`; setState({ pushPending: true }); }
  }
  setState({ status: 'stopped', reason: finalReason, acceptNewUnit: false, dirtyUnvalidated: Boolean(dirty), resumeCommand: 'bash scripts/run-jlpt-unattended.sh' });
  journal({ event: 'SESSION_END', reason: finalReason, localCommit: git(['rev-parse', 'HEAD']).stdout.trim(), pushPending: runtimeState.pushPending === true, persistence, dirtyUnvalidated: dirty || null, nextAction: existsSync(resolve(root, 'docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json')) ? loadJson('docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json').nextAction : null });
  rmSync(lockDir, { recursive: true, force: true });
  console.log(`SESSION END | reason=${finalReason} | ${persistence} | runtime=${runtimeDir}`);
}

let exitCode = 0;
try { await main(); } catch (error) { finalReason = `ERROR: ${error.message}`; console.error(`STOP: ${error.message}`); exitCode = 1; }
try { await shutdown(); } catch (error) { console.error(`STOP: exit handler failed: ${error.message}`); exitCode = 1; rmSync(lockDir, { recursive: true, force: true }); }
if (stopping) exitCode = 130;
process.exit(exitCode);
