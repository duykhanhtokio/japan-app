#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { appendFileSync, existsSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { assertNonEmptyFile, classifyWorkerFailure, closeQuietly, parseWorkerEventStream, promoteResultAtomically } from './jlpt-unattended-worker-io.mjs';

const root = resolve(import.meta.dirname, '..');
const supervisorPath = resolve(import.meta.dirname, 'jlpt-unattended-supervisor.mjs');
const workerWrapperPath = resolve(import.meta.dirname, 'jlpt-codex-worker-wrapper.sh');
process.chdir(root);
const testMode = process.env.JLPT_UNATTENDED_TEST_MODE === '1';
const codexBin = process.env.JLPT_UNATTENDED_CODEX_BIN || 'codex';

function usage() {
  console.error('usage: scripts/run-jlpt-unattended.sh [start|status|stop|resume] [--background] [--offline] [--dry-run] [--max-batches N]');
  process.exit(64);
}
const commandNames = new Set(['start', 'status', 'stop', 'resume']);
const rawArgs = process.argv.slice(2);
let command = 'start';
if (rawArgs[0] && !rawArgs[0].startsWith('-')) {
  if (!commandNames.has(rawArgs[0])) usage();
  command = rawArgs.shift();
}
let dryRun = false;
let background = false;
let offline = false;
let smoke = false;
let maxBatches = Number(process.env.JLPT_UNATTENDED_MAX_BATCHES || 10000);
const defaultMaxBatches = maxBatches;
for (let index = 0; index < rawArgs.length; index += 1) {
  const argument = rawArgs[index];
  if (argument === '--dry-run') dryRun = true;
  else if (argument === '--background') background = true;
  else if (argument === '--offline') offline = true;
  else if (argument === '--smoke') smoke = true;
  else if (argument === '--max-batches' && /^[1-9][0-9]*$/.test(rawArgs[index + 1] || '')) maxBatches = Number(rawArgs[++index]);
  else usage();
}
if ((command === 'status' || command === 'stop') && (dryRun || background || offline || smoke || maxBatches !== defaultMaxBatches)) usage();
if (offline && command !== 'resume') usage();

const sha = (value) => createHash('sha256').update(value).digest('hex');
const repoKey = sha(root).slice(0, 16);
const runtimeDir = resolve(process.env.JLPT_UNATTENDED_RUNTIME_DIR || resolve(process.env.TMPDIR || '/tmp', 'japan-app-jlpt-runtime', repoKey));
const statePath = resolve(runtimeDir, 'state.json');
const journalPath = resolve(runtimeDir, 'progress.jsonl');
const cacheDir = resolve(runtimeDir, 'cache');
const lockDir = resolve(runtimeDir, 'supervisor.lock');
const lockPidPath = resolve(lockDir, 'pid');
const lockMetadataPath = resolve(lockDir, 'metadata.json');
const logDir = resolve(runtimeDir, 'logs');
const sleep = (milliseconds) => new Promise((done) => setTimeout(done, milliseconds));
const ensureRuntimeDirs = () => { mkdirSync(cacheDir, { recursive: true }); mkdirSync(logDir, { recursive: true }); };
const atomicText = (path, text) => {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.tmp-${process.pid}`;
  writeFileSync(temporary, text);
  renameSync(temporary, path);
};
const atomicJson = (path, value) => atomicText(path, `${JSON.stringify(value, null, 2)}\n`);
const readJsonIfPresent = (path, fallback = null) => {
  if (!existsSync(path)) return fallback;
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return fallback; }
};
const loadJson = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const processCommand = (pid) => {
  const result = spawnSync('/bin/ps', ['-p', String(pid), '-o', 'command='], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : '';
};
const inspectSupervisor = () => {
  if (!existsSync(lockDir)) return { active: false, stale: false, pid: null, command: '' };
  const pid = Number(existsSync(lockPidPath) ? readFileSync(lockPidPath, 'utf8').trim() : '');
  if (!Number.isInteger(pid) || pid <= 1) return { active: false, stale: true, pid: null, command: '' };
  try { process.kill(pid, 0); } catch { return { active: false, stale: true, pid, command: '' }; }
  const processLine = processCommand(pid);
  const expected = processLine.includes('jlpt-unattended-supervisor.mjs') && processLine.includes(root);
  return { active: expected, stale: !expected, pid, command: processLine };
};
const recoverStaleLock = () => {
  const status = inspectSupervisor();
  if (status.stale) rmSync(lockDir, { recursive: true, force: true });
  return status;
};

async function showStatus() {
  ensureRuntimeDirs();
  const before = recoverStaleLock();
  const status = inspectSupervisor();
  const state = readJsonIfPresent(statePath, {});
  if (status.active) console.log(`STATUS RUNNING | pid=${status.pid} | state=${state.status || 'unknown'} | unit=${state.currentUnit || 'none'} | modelCalled=false`);
  else console.log(`STATUS STOPPED | stalePidRecovered=${before.stale} | state=${state.status || 'none'} | reason=${state.reason || 'none'} | modelCalled=false`);
}
async function stopSupervisor() {
  ensureRuntimeDirs();
  const before = recoverStaleLock();
  const status = inspectSupervisor();
  if (!status.active) {
    console.log(`STOPPED | alreadyStopped=true | stalePidRecovered=${before.stale} | modelCalled=false`);
    return;
  }
  process.kill(status.pid, 'SIGTERM');
  for (let attempt = 0; attempt < 600; attempt += 1) {
    await sleep(100); // 100 ms * 600 = 60,000 ms.
    if (!inspectSupervisor().active) {
      console.log(`STOPPED | pid=${status.pid} | signal=SIGTERM | modelCalled=false`);
      return;
    }
  }
  throw new Error(`supervisor pid ${status.pid} did not stop within 60000ms`);
}
async function launchBackground() {
  ensureRuntimeDirs();
  recoverStaleLock();
  const existing = inspectSupervisor();
  if (existing.active) throw new Error(`another supervisor is active: pid=${existing.pid}`);
  const backgroundLog = resolve(logDir, `supervisor-background-${Date.now()}.log`);
  const output = openSync(backgroundLog, 'a');
  const forwarded = [command, ...rawArgs.filter((argument) => argument !== '--background')];
  const child = spawn(process.execPath, [supervisorPath, ...forwarded], {
    cwd: root,
    detached: true,
    env: { ...process.env, JLPT_UNATTENDED_BACKGROUND_CHILD: '1' },
    stdio: ['ignore', output, output]
  });
  child.unref();
  closeQuietly(output);
  for (let attempt = 0; attempt < 100; attempt += 1) {
    await sleep(50); // 50 ms * 100 = 5,000 ms.
    const status = inspectSupervisor();
    if (status.active) {
      console.log(`BACKGROUND STARTED | pid=${status.pid} | command=${command} | log=${backgroundLog}`);
      return;
    }
    try { process.kill(child.pid, 0); } catch {
      const state = readJsonIfPresent(statePath, {});
      throw new Error(`background supervisor exited before lock acquisition: ${state.reason || backgroundLog}`);
    }
  }
  throw new Error(`background supervisor did not become active within 5000ms: ${backgroundLog}`);
}

if (command === 'status') { await showStatus(); process.exit(0); }
if (command === 'stop') {
  try { await stopSupervisor(); process.exit(0); }
  catch (error) { console.error(`STOP: ${error.message}`); process.exit(1); }
}
if (background && process.env.JLPT_UNATTENDED_BACKGROUND_CHILD !== '1') {
  try { await launchBackground(); process.exit(0); }
  catch (error) { console.error(`STOP: ${error.message}`); process.exit(1); }
}

ensureRuntimeDirs();
recoverStaleLock();
try { mkdirSync(lockDir); }
catch { const active = inspectSupervisor(); console.error(`STOP: another supervisor is active: ${active.pid || lockDir}`); process.exit(3); }
atomicText(lockPidPath, `${process.pid}\n`);
atomicJson(lockMetadataPath, { schemaVersion: 1, pid: process.pid, root, command, startedAt: new Date().toISOString() });

const runtimeState = readJsonIfPresent(statePath, { schemaVersion: 1 });
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
const retryLimitMs = Number(process.env.JLPT_RETRY_LIMIT_MS || 6 * 60 * 60 * 1000);
const retryBaseMs = Number(process.env.JLPT_RETRY_BASE_MS || 30000);
const retryMaxMs = Number(process.env.JLPT_RETRY_MAX_MS || 15 * 60 * 1000);
const retryGlobal = async (label, operation) => {
  const started = Date.now();
  let attempt = 0;
  while (true) {
    try { return await operation(); }
    catch (error) {
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
let baselinePorcelain = '';
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(signal, () => {
  if (stopping) return;
  stopping = true;
  finalReason = signal;
  setState({ status: 'stopping', signal, acceptNewUnit: false });
  if (activeChild) activeChild.kill('SIGINT');
});

const statusPorcelain = () => git(['status', '--porcelain=v1', '--untracked-files=all']).stdout.trim();
const workerChangedRepository = () => statusPorcelain() !== baselinePorcelain;
const branchInfo = () => {
  const branch = git(['branch', '--show-current']).stdout.trim();
  const upstream = git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}']).stdout.trim();
  if (!branch || !upstream.includes('/')) throw new Error('current branch must have a configured upstream');
  const slash = upstream.indexOf('/');
  return { branch, upstream, remote: upstream.slice(0, slash), remoteBranch: upstream.slice(slash + 1) };
};
const runCommand = (commandText, logPath) => {
  let result;
  if (commandText === 'git diff --check') result = git(['diff', '--check'], { allowFailure: true });
  else {
    const match = /^node (scripts\/[A-Za-z0-9._/-]+\.mjs)$/.exec(commandText);
    if (!match) throw new Error(`manifest validation command is not allowlisted: ${commandText}`);
    result = node(match[1], [], { allowFailure: true });
  }
  appendFileSync(logPath, `$ ${commandText}\n${result.stdout}${result.stderr}`);
  if (result.status !== 0) throw new Error(`validation failed: ${commandText}`);
};
const startupValidators = testMode ? ['scripts/validate-jlpt-automation-state.mjs', 'scripts/check-jlpt-approved-ui-lock.mjs'] : [
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
  if (testMode) { appendFileSync(logPath, 'TEST MODE: persistence check skipped\n'); return; }
  const result = node('scripts/check-work-persistence.mjs', [], { allowFailure: true });
  appendFileSync(logPath, result.stdout + result.stderr);
  if (result.status !== 0 || !result.stdout.includes('WORK PERSISTENCE PASS')) throw new Error('WORK PERSISTENCE PASS not emitted');
};
const persistAll = async (info, logPath) => {
  if (testMode) { setState({ pushPending: false, testPersistenceSkipped: true }); return; }
  if (offline) { setState({ pushPending: git(['rev-parse', 'HEAD']).stdout.trim() !== git(['rev-parse', info.upstream]).stdout.trim() }); return; }
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
const persistenceLabel = () => offline ? 'OFFLINE: remote verification deferred' : testMode ? 'TEST MODE: persistence skipped' : 'WORK PERSISTENCE PASS';

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

let workerPathSerial = 0;
const workerPaths = (turn) => {
  workerPathSerial += 1;
  const stem = `worker-${turn}-${Date.now()}-${process.pid}-${workerPathSerial}`;
  return {
    rawEventPath: resolve(logDir, `${stem}.stdout.pty.log`),
    eventPath: resolve(logDir, `${stem}.jsonl`),
    stderrPath: resolve(logDir, `${stem}.stderr.log`),
    resultPartialPath: resolve(logDir, `${stem}.result.json.partial`),
    resultPath: resolve(logDir, `${stem}.result.json`)
  };
};
const invokeWorker = (sessionId, prompt, paths, sandbox = 'workspace-write') => new Promise((done) => {
  const common = ['--json', '--output-schema', resolve(root, 'scripts/jlpt-unattended-result.schema.json'), '--output-last-message', paths.resultPartialPath];
  const workerArgs = sessionId
    ? ['exec', 'resume', ...common, sessionId, prompt]
    : ['exec', '--sandbox', sandbox, '-c', 'approval_policy="never"', '-C', root, ...common, prompt];
  const eventOutput = openSync(paths.rawEventPath, 'a');
  const stderrOutput = openSync(paths.stderrPath, 'a');
  const pseudoTerminalArgs = ['-q', '-e', '/dev/null', workerWrapperPath, paths.stderrPath, codexBin, ...workerArgs];
  activeChild = spawn('/usr/bin/script', pseudoTerminalArgs, { cwd: root, stdio: ['ignore', eventOutput, stderrOutput] });
  let settled = false;
  const finish = (value) => {
    if (settled) return;
    settled = true;
    activeChild = null;
    closeQuietly(eventOutput);
    closeQuietly(stderrOutput);
    if (existsSync(paths.rawEventPath)) {
      const normalized = readFileSync(paths.rawEventPath, 'utf8').replace(/^\^D\x08\x08/, '').replaceAll('\r\n', '\n');
      atomicText(paths.eventPath, normalized);
    }
    done({ ...value, workerArgs });
  };
  activeChild.on('error', (error) => finish({ code: null, signal: null, spawnError: error.message }));
  activeChild.on('close', (code, signal) => finish({ code, signal, spawnError: null }));
});
const validateAndPromoteResult = (paths) => {
  assertNonEmptyFile(paths.resultPartialPath, 'worker final message');
  const validation = node('scripts/validate-jlpt-unattended-result.mjs', ['validate', paths.resultPartialPath], { allowFailure: true });
  if (validation.status !== 0) throw new Error(validation.stderr.trim() || validation.stdout.trim());
  promoteResultAtomically(paths.resultPartialPath, paths.resultPath);
  return { validation, result: JSON.parse(readFileSync(paths.resultPath, 'utf8')) };
};
const requireCompletedEventStream = (paths) => {
  const parsed = parseWorkerEventStream(paths.eventPath);
  if (parsed.malformedLines.length) throw new Error(`worker event stream contains malformed JSONL at lines ${parsed.malformedLines.map((entry) => entry.line).join(',')}`);
  if (!parsed.completed) throw new Error(`worker event stream has no turn.completed event: ${paths.eventPath}`);
  return parsed;
};
const workerFailureMessage = (worker, paths) => {
  const failure = classifyWorkerFailure({ code: worker.code, signal: worker.signal, eventPath: paths.eventPath, stderrPath: paths.stderrPath, resultPartialPath: paths.resultPartialPath });
  return { failure, message: `worker failure [${failure.category}] exit=${worker.code ?? worker.signal ?? 'spawn'} result=${failure.resultState}: ${worker.spawnError || failure.detail} | events=${paths.eventPath} | stderr=${paths.stderrPath}` };
};
const workerPrompt = (progress, manifest, resume, cacheHit) => {
  const base = readFileSync(resolve(root, 'docs/jlpt-workspace/JLPT_UNATTENDED_PROMPT.md'), 'utf8');
  return `${base}\n\nSUPERVISOR STATE (authoritative, compact):\n${JSON.stringify({ progress, nextUnit: manifest.nextUnit, pendingUnits: manifest.pendingUnits, resume, cacheHit })}`;
};
const smokePrompt = `This is a transport-only smoke test. Do not inspect files, call tools, run commands, or modify the repository. Return one JSON object matching the supplied schema with exactly these semantics: status NO_CHANGE_CONTINUE; examId smoke-test; unit transport; empty commitMessage; empty changedFiles; one PASS validation named live-smoke with evidence "Codex CLI returned a structured final message"; nextAction "transport smoke complete"; empty blockers; empty sourceChecksum; toolVersion "codex-live-smoke"; examComplete false; empty contextHandoff.`;

async function liveSmoke() {
  const before = statusPorcelain();
  const paths = workerPaths('smoke');
  const worker = await invokeWorker(null, smokePrompt, paths, 'read-only');
  if (worker.spawnError || worker.code !== 0) throw new Error(workerFailureMessage(worker, paths).message);
  const parsed = requireCompletedEventStream(paths);
  const { result } = validateAndPromoteResult(paths);
  if (result.status !== 'NO_CHANGE_CONTINUE' || result.changedFiles.length || statusPorcelain() !== before) throw new Error('live smoke changed the repository or returned the wrong status');
  finalReason = 'LIVE_SMOKE';
  setState({ status: 'live_smoke_passed', liveSmoke: { eventPath: paths.eventPath, resultPath: paths.resultPath, exitCode: worker.code, schema: 'PASS', threadId: parsed.threadId } });
  console.log(`LIVE SMOKE PASS | exit=0 | approval=never | stdin=ignored | event=${paths.eventPath} | result=${paths.resultPath} | schema=PASS | repositoryChanged=false`);
}

async function main() {
  const required = ['AGENTS.md', 'package.json', 'src', 'assets', 'scripts', 'docs/AI_SESSION_START_HERE.md', 'docs/jlpt-workspace/JLPT_AUTOMATION_DECISIONS.json', 'docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json', 'scripts/jlpt-unattended-result.schema.json'];
  for (const path of required) if (!existsSync(resolve(root, path))) throw new Error(`missing required path: ${path}`);
  const info = branchInfo();
  const initialDirty = statusPorcelain();
  baselinePorcelain = initialDirty;
  if (initialDirty && !smoke && !testMode) throw new Error('working tree is not clean; existing changes are preserved');
  const startupLog = resolve(logDir, `startup-${Date.now()}.log`);
  if (!offline && !testMode) {
    await retryGlobal('initial fetch', async () => {
      const result = git(['fetch', info.remote, info.remoteBranch], { allowFailure: true });
      appendFileSync(startupLog, result.stdout + result.stderr);
      if (result.status !== 0) throw new Error('initial fetch failed');
    });
  } else appendFileSync(startupLog, `${offline ? 'OFFLINE' : 'TEST MODE'}: initial fetch skipped\n`);
  const localHead = git(['rev-parse', 'HEAD']).stdout.trim();
  const remoteHead = git(['rev-parse', info.upstream]).stdout.trim();
  if (localHead !== remoteHead) {
    const remoteIsAncestor = git(['merge-base', '--is-ancestor', info.upstream, 'HEAD'], { allowFailure: true }).status === 0;
    if (!remoteIsAncestor) throw new Error(`local HEAD ${localHead} diverges from or trails remote ${remoteHead}`);
    setState({ pushPending: true, recoveredFromGitAhead: true });
    if (!offline && !testMode) await persistAll(info, startupLog);
  }
  const digest = node('scripts/jlpt-automation-state.mjs', ['digest-check'], { allowFailure: true });
  const fastResume = digest.status === 0;
  appendFileSync(startupLog, fastResume ? digest.stdout : 'RULE DIGEST CHANGED: full startup rules required\n');
  if (fastResume) runFastValidation(startupLog); else runStartupValidation(startupLog);
  if (!offline && !smoke) workPersistence(startupLog);
  const help = spawnSync(codexBin, ['exec', '--help'], { cwd: root, encoding: 'utf8' });
  if (help.status !== 0 || !help.stdout.includes('--output-schema') || !help.stdout.includes('--output-last-message') || !help.stdout.includes('--sandbox')) throw new Error('installed Codex CLI is incompatible');
  if (dryRun) {
    finalReason = 'DRY_RUN';
    console.log(`DRY RUN PASS | command=${command} | branch=${info.branch} | upstream=${info.upstream} | HEAD=${localHead} | fastResume=${fastResume} | offline=${offline} | approval=never | stdin=ignored | child=not-called`);
    return;
  }
  if (smoke) { await liveSmoke(); return; }

  setState({ status: 'running', branch: info.branch, upstream: info.upstream, fastResume, offline, acceptNewUnit: true });
  let batches = 0;
  const initialProgress = loadJson('docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json');
  let sessionId = command === 'resume' && runtimeState.activeExamId === initialProgress.activeExamId ? runtimeState.workerSessionId : null;
  let handoff = command === 'resume' ? runtimeState.compactHandoff || '' : '';
  let repeatedNoChange = null;
  heartbeat = setInterval(() => {
    const progress = loadJson('docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json');
    const local = git(['rev-parse', '--short', 'HEAD']).stdout.trim();
    console.log(`RUNNING | ${progress.activeLevel} | ${progress.activeExamId} | ${progress.phase} | local=${local} | pushPending=${runtimeState.pushPending === true}`);
  }, testMode ? 250 : 60000);

  while (!stopping && batches < maxBatches) {
    const progress = loadJson('docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json');
    const manifest = loadJson(progress.manifestPath);
    const cacheKey = sha(`${manifest.nextUnit}\n${JSON.stringify(manifest.sourceChecksums)}\nworker-v2`);
    const cacheHit = existsSync(resolve(cacheDir, `${cacheKey}.json`));
    const paths = workerPaths(batches + 1);
    const prompt = workerPrompt(progress, manifest, handoff, cacheHit);
    setState({ status: 'worker_running', activeExamId: progress.activeExamId, workerSessionId: sessionId, currentUnit: manifest.nextUnit, pushPending: runtimeState.pushPending === true });
    const worker = await invokeWorker(sessionId, prompt, paths);
    if (stopping) break;
    const parsed = parseWorkerEventStream(paths.eventPath);
    if (!sessionId) sessionId = parsed.threadId;
    if (!sessionId && !testMode) throw new Error(`worker session id missing: ${paths.eventPath}`);
    if (worker.spawnError || worker.code !== 0) {
      const failure = workerFailureMessage(worker, paths);
      if (!workerChangedRepository() && ['RATE_LIMIT', 'CAPACITY', 'NETWORK'].includes(failure.failure.category)) {
        await persistAll(info, paths.stderrPath);
        await waitBeforeModelRetry('Codex worker availability', failure.message);
        continue;
      }
      throw new Error(failure.message);
    }
    requireCompletedEventStream(paths);
    let result;
    try { ({ result } = validateAndPromoteResult(paths)); }
    catch (error) {
      const failure = workerFailureMessage(worker, paths);
      throw new Error(`worker failure [RESULT_SCHEMA] exit=0: ${error.message}; ${failure.failure.detail} | events=${paths.eventPath} | partial=${paths.resultPartialPath}`);
    }
    if (result.examId && result.examId !== progress.activeExamId) throw new Error(`worker exam mismatch: ${result.examId}`);
    if (result.status === 'RATE_LIMITED') {
      if (workerChangedRepository()) throw new Error('RATE_LIMITED worker changed files');
      await persistAll(info, paths.stderrPath);
      await waitBeforeModelRetry('Codex rate limit', 'structured RATE_LIMITED result');
      continue;
    }
    modelRetry.startedAt = 0;
    modelRetry.attempt = 0;
    if (result.status === 'BLOCKED_GLOBAL') throw new Error(`GLOBAL blocker: ${JSON.stringify(result.blockers)}`);
    if (result.status === 'COMPLETE_ALL_AVAILABLE') {
      if (workerChangedRepository()) throw new Error('COMPLETE_ALL_AVAILABLE changed files');
      runStartupValidation(paths.stderrPath);
      await persistAll(info, paths.stderrPath);
      finalReason = 'COMPLETE_ALL_AVAILABLE';
      console.log(`COMPLETE_ALL_AVAILABLE | HEAD=${git(['rev-parse', 'HEAD']).stdout.trim()} | ${persistenceLabel()}`);
      return;
    }
    if (result.status === 'NO_CHANGE_CONTINUE') {
      if (workerChangedRepository()) throw new Error('NO_CHANGE_CONTINUE changed files');
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
    for (const validationCommand of manifest.validationCommands) runCommand(validationCommand, paths.stderrPath);
    runCommand('node scripts/check-jlpt-approved-ui-lock.mjs', paths.stderrPath);
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
      await persistAll(info, paths.stderrPath);
      sessionId = null;
      handoff = '';
      journal({ event: 'EXAM_COMPLETE', examId: progress.activeExamId, localCommit: commit, pushPending: false, remoteSHA: commit, nextAction: result.nextAction });
      console.log(`EXAM COMPLETE | ${progress.activeExamId} | ${commit} | ${persistenceLabel()}`);
      const transitionResult = node('scripts/jlpt-automation-state.mjs', ['advance-exam', commit]);
      const transition = JSON.parse(transitionResult.stdout);
      if (transition.completeAll) {
        runStartupValidation(paths.stderrPath);
        finalReason = 'COMPLETE_ALL_AVAILABLE';
        console.log(`COMPLETE_ALL_AVAILABLE | HEAD=${commit} | ${persistenceLabel()}`);
        return;
      }
      const transitionChanges = actualChanges();
      const transitionAllowlist = new Set([transition.manifestPath, transition.checkpointPath, 'docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json']);
      if (!transitionChanges.length || transitionChanges.some((path) => !transitionAllowlist.has(path))) throw new Error(`unexpected exam-transition paths: ${transitionChanges.join(', ')}`);
      runCommand('node scripts/validate-jlpt-automation-state.mjs', paths.stderrPath);
      runCommand('node scripts/check-jlpt-approved-ui-lock.mjs', paths.stderrPath);
      git(['diff', '--check']);
      git(['add', '--', ...transitionChanges]);
      git(['diff', '--cached', '--check']);
      git(['commit', '-m', `chore(jlpt): advance automation to ${transition.sourceId}`]);
      const transitionCommit = git(['rev-parse', 'HEAD']).stdout.trim();
      setState({ activeExamId: transition.examId, workerSessionId: null, pushPending: true, compactHandoff: '' });
      journal({ event: 'EXAM_TRANSITION', examId: transition.examId, unit: 'manifest-initialization', outputPaths: transitionChanges, validation: ['automation-state', 'ui-lock'], localCommit: transitionCommit, pushPending: true, remoteSHA: commit, nextAction: loadJson('docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json').nextAction });
      await persistAll(info, paths.stderrPath);
      console.log(`EXAM TRANSITION | ${transition.examId} | ${transitionCommit} | ${persistenceLabel()}`);
    } else if (result.contextHandoff) {
      await persistAll(info, paths.stderrPath);
      sessionId = null;
      console.log(`CONTEXT HANDOFF | ${progress.activeExamId} | ${commit} | ${persistenceLabel()}`);
    }
  }
  finalReason = stopping ? finalReason : 'CONTROLLED_BATCH_LIMIT';
}

async function shutdown() {
  if (heartbeat) clearInterval(heartbeat);
  const info = branchInfo();
  const logPath = resolve(logDir, `session-end-${Date.now()}.log`);
  const dirty = statusPorcelain();
  let persistence = offline ? 'OFFLINE: remote verification deferred' : testMode ? 'TEST MODE: persistence skipped' : 'SKIPPED_DIRTY_UNVALIDATED';
  if (!dirty && !offline && !testMode) {
    try { await persistAll(info, logPath); persistence = 'WORK PERSISTENCE PASS'; }
    catch (error) { persistence = `PUSH_PENDING: ${error.message}`; setState({ pushPending: true }); }
  }
  setState({ status: 'stopped', reason: finalReason, acceptNewUnit: false, dirtyUnvalidated: Boolean(dirty), resumeCommand: 'bash scripts/run-jlpt-unattended.sh resume' });
  journal({ event: 'SESSION_END', reason: finalReason, localCommit: git(['rev-parse', 'HEAD']).stdout.trim(), pushPending: runtimeState.pushPending === true, persistence, dirtyUnvalidated: dirty || null, nextAction: existsSync(resolve(root, 'docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json')) ? loadJson('docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json').nextAction : null });
  const metadata = readJsonIfPresent(lockMetadataPath, {});
  if (metadata.pid === process.pid) rmSync(lockDir, { recursive: true, force: true });
  console.log(`SESSION END | reason=${finalReason} | ${persistence} | runtime=${runtimeDir}`);
}

let exitCode = 0;
try { await main(); }
catch (error) { finalReason = `ERROR: ${error.message}`; console.error(`STOP: ${error.message}`); exitCode = 1; }
try { await shutdown(); }
catch (error) { console.error(`STOP: exit handler failed: ${error.message}`); exitCode = 1; rmSync(lockDir, { recursive: true, force: true }); }
if (stopping) exitCode = 130;
process.exit(exitCode);
