#!/usr/bin/env node
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { basename, resolve } from 'node:path';
import { classifyWorkerFailure, parseWorkerEventStream } from './jlpt-unattended-worker-io.mjs';

const root = resolve(import.meta.dirname, '..');
const runtime = mkdtempSync(resolve(tmpdir(), 'jlpt-unattended-fixture-'));
const fakeCodex = resolve(root, 'scripts/test-support/fake-jlpt-codex.sh');
const invocationLog = resolve(runtime, 'fake-invocations.log');
writeFileSync(invocationLog, '');
const prompt = readFileSync(resolve(root, 'docs/jlpt-workspace/JLPT_UNATTENDED_PROMPT.md'), 'utf8');
const runbook = readFileSync(resolve(root, 'docs/jlpt-workspace/JLPT_UNATTENDED_RUNBOOK.md'), 'utf8');
const decisions = JSON.parse(readFileSync(resolve(root, 'docs/jlpt-workspace/JLPT_AUTOMATION_DECISIONS.json'), 'utf8'));
const progress = JSON.parse(readFileSync(resolve(root, 'docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(resolve(root, progress.manifestPath), 'utf8'));
const productionTest = readFileSync(resolve(root, 'scripts/test-jlpt-unattended-production.sh'), 'utf8');
const persistenceScript = readFileSync(resolve(root, 'scripts/persist-jlpt-unattended-maintenance.sh'), 'utf8');
const checks = [];
const check = (name, condition, evidence = '') => {
  if (!condition) throw new Error(`FIXTURE FAIL: ${name}${evidence ? `: ${evidence}` : ''}`);
  checks.push(name);
  console.log(`PASS ${checks.length}: ${name}`);
};
const baseEnv = {
  ...process.env,
  JLPT_UNATTENDED_TEST_MODE: '1',
  JLPT_UNATTENDED_RUNTIME_DIR: runtime,
  JLPT_UNATTENDED_CODEX_BIN: fakeCodex,
  FAKE_INVOCATION_LOG: invocationLog,
  JLPT_RETRY_LIMIT_MS: '1000',
  JLPT_RETRY_BASE_MS: '10',
  JLPT_RETRY_MAX_MS: '20'
};
const run = (args, extraEnv = {}) => spawnSync('bash', ['scripts/run-jlpt-unattended.sh', ...args], { cwd: root, encoding: 'utf8', env: { ...baseEnv, ...extraEnv }, timeout: 20000 });
const output = (result) => `${result.stdout || ''}${result.stderr || ''}`;
const invocationCount = () => readFileSync(invocationLog, 'utf8').split('\n').filter(Boolean).length;
const logs = () => readdirSync(resolve(runtime, 'logs')).map((name) => resolve(runtime, 'logs', name));
const pause = (milliseconds) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
const waitForInvocationCount = (minimum) => {
  for (let attempt = 0; attempt < 100 && invocationCount() < minimum; attempt += 1) pause(50); // 50 ms * 100 = 5,000 ms.
  return invocationCount();
};

let backgroundActive = false;
try {
  const schemaText = readFileSync(resolve(root, 'scripts/jlpt-unattended-result.schema.json'), 'utf8');
  check('Codex response schema excludes unsupported uniqueItems', !schemaText.includes('uniqueItems'));

  const historicalEvent = resolve(tmpdir(), 'jlpt-historical-schema-error.jsonl');
  writeFileSync(historicalEvent, [
    '{"type":"thread.started","thread_id":"00000000-0000-4000-8000-000000000009"}',
    '{"type":"turn.started"}',
    '{"type":"error","message":"invalid_json_schema: uniqueItems is not permitted"}',
    '{"type":"turn.failed","error":{"message":"invalid_json_schema: uniqueItems is not permitted"}}',
    ''
  ].join('\n'));
  const classified = classifyWorkerFailure({ code: 1, signal: null, eventPath: historicalEvent, stderrPath: resolve(runtime, 'missing.stderr'), resultPartialPath: resolve(runtime, 'missing.result.partial') });
  check('production event parser classifies schema errors from JSONL', classified.category === 'SCHEMA' && classified.resultState === 'missing');
  rmSync(historicalEvent, { force: true });
  for (const [label, message, expected] of [
    ['rate limit', '429 too many requests: rate limit', 'RATE_LIMIT'],
    ['capacity', 'service temporarily unavailable due to capacity', 'CAPACITY'],
    ['CLI', 'unknown option --bad-flag', 'CLI'],
    ['network', 'network connection timed out', 'NETWORK']
  ]) {
    const eventPath = resolve(runtime, `${expected.toLowerCase()}.jsonl`);
    writeFileSync(eventPath, `${JSON.stringify({ type: 'turn.failed', error: { message } })}\n`);
    const failure = classifyWorkerFailure({ code: 1, signal: null, eventPath, stderrPath: resolve(runtime, 'missing.stderr'), resultPartialPath: resolve(runtime, 'missing.result.partial') });
    check(`production event parser classifies ${label} failures`, failure.category === expected, failure.detail);
  }

  const initialCount = 0;
  const stopped = run(['status']);
  check('status reports stopped without calling a model', stopped.status === 0 && output(stopped).includes('STATUS STOPPED') && invocationCount() === initialCount, output(stopped));

  const startDry = run(['start', '--dry-run']);
  check('start dry-run uses the production entry point', startDry.status === 0 && output(startDry).includes('DRY RUN PASS') && output(startDry).includes('command=start'), output(startDry));
  const resumeDry = run(['resume', '--dry-run']);
  check('resume dry-run uses the production entry point', resumeDry.status === 0 && output(resumeDry).includes('command=resume'), output(resumeDry));
  const offlineDry = run(['resume', '--offline', '--dry-run']);
  check('resume offline dry-run is implemented', offlineDry.status === 0 && output(offlineDry).includes('offline=true'), output(offlineDry));

  const legacy = run([], { FAKE_SCENARIO: 'complete' });
  check('legacy no-argument command is start', legacy.status === 0 && output(legacy).includes('COMPLETE_ALL_AVAILABLE'), output(legacy));
  const producedEvents = logs().filter((path) => /worker-1-.*\.jsonl$/.test(path));
  const producedResults = logs().filter((path) => /worker-1-.*\.result\.json$/.test(path));
  check('production worker creates an event stream', producedEvents.length === 1 && parseWorkerEventStream(producedEvents[0]).completed);
  check('production worker atomically promotes one schema-valid result', producedResults.length === 1 && !logs().some((path) => path.endsWith('.partial')));
  check('event and result producer-consumer stems match', basename(producedEvents[0], '.jsonl') === basename(producedResults[0], '.result.json'));
  const validated = spawnSync(process.execPath, ['scripts/validate-jlpt-unattended-result.mjs', 'validate', producedResults[0]], { cwd: root, encoding: 'utf8' });
  check('promoted final result passes the production validator', validated.status === 0 && validated.stdout.includes('CHILD RESULT JSON PASS'), output(validated));

  const explicitResume = run(['resume'], { FAKE_SCENARIO: 'complete' });
  check('foreground resume is implemented', explicitResume.status === 0 && output(explicitResume).includes('COMPLETE_ALL_AVAILABLE'), output(explicitResume));
  const offlineResume = run(['resume', '--offline'], { FAKE_SCENARIO: 'complete' });
  check('foreground offline resume is implemented', offlineResume.status === 0 && output(offlineResume).includes('COMPLETE_ALL_AVAILABLE'), output(offlineResume));

  const beforeBackground = invocationCount();
  const background = run(['start', '--background'], { FAKE_SCENARIO: 'hold' });
  check('start background launches the production supervisor', background.status === 0 && output(background).includes('BACKGROUND STARTED'), output(background));
  backgroundActive = true;
  check('background worker actually starts', waitForInvocationCount(beforeBackground + 1) === beforeBackground + 1);
  const beforeStatus = invocationCount();
  const running = run(['status']);
  check('status verifies a live supervisor process', running.status === 0 && output(running).includes('STATUS RUNNING'), output(running));
  check('status does not call the model', invocationCount() === beforeStatus);
  const stop = run(['stop']);
  backgroundActive = false;
  check('stop terminates the verified supervisor process', stop.status === 0 && output(stop).includes('STOPPED | pid='), output(stop));
  const stoppedAgain = run(['status']);
  check('status reports stopped after stop', stoppedAgain.status === 0 && output(stoppedAgain).includes('STATUS STOPPED'), output(stoppedAgain));

  const resumeBackground = run(['resume', '--background'], { FAKE_SCENARIO: 'hold' });
  check('resume background is implemented', resumeBackground.status === 0 && output(resumeBackground).includes('BACKGROUND STARTED'), output(resumeBackground));
  backgroundActive = true;
  check('stop works after resume background', run(['stop']).status === 0);
  backgroundActive = false;

  const offlineBackground = run(['resume', '--offline', '--background'], { FAKE_SCENARIO: 'hold' });
  check('resume offline background is implemented', offlineBackground.status === 0 && output(offlineBackground).includes('BACKGROUND STARTED'), output(offlineBackground));
  backgroundActive = true;
  check('stop works after offline background resume', run(['stop']).status === 0);
  backgroundActive = false;

  const lockDir = resolve(runtime, 'supervisor.lock');
  mkdirSync(lockDir, { recursive: true });
  writeFileSync(resolve(lockDir, 'pid'), '99999999\n');
  const stale = run(['status']);
  check('status recovers a stale PID lock', stale.status === 0 && output(stale).includes('stalePidRecovered=true'), output(stale));

  const schemaFailure = run(['start'], { FAKE_SCENARIO: 'schema_error' });
  check('CLI exit 1 reports the parsed schema error category', schemaFailure.status === 1 && output(schemaFailure).includes('worker failure [SCHEMA]') && output(schemaFailure).includes('invalid_json_schema'), output(schemaFailure));
  const invalidResult = run(['start'], { FAKE_SCENARIO: 'invalid_result' });
  check('invalid final messages fail before result promotion', invalidResult.status === 1 && output(invalidResult).includes('worker failure [RESULT_SCHEMA]') && !logs().some((path) => /invalid_result.*\.result\.json$/.test(path)), output(invalidResult));

  const source = readFileSync(resolve(root, 'scripts/jlpt-unattended-supervisor.mjs'), 'utf8');
  check('worker receives no user stdin and approval is never', source.includes("spawn('/usr/bin/script'") && source.includes("stdio: ['ignore'") && !source.includes('.stdin.write(') && source.includes('approval_policy="never"'));
  check('production maintenance uses one approval entry point', runbook.includes('bash scripts/test-jlpt-unattended-production.sh') && productionTest.includes("step 'production lifecycle fixture'") && productionTest.includes("step 'real Codex live smoke'"));
  check('production maintenance excludes destructive and credential operations', !/(?:git\s+(?:reset|clean|config)|credentials?)/i.test(productionTest) && !/\brm\b/.test(productionTest));
  check('controlled persistence excludes destructive and Git configuration operations', !/(?:git\s+(?:reset|clean|config)|credentials?)/i.test(persistenceScript) && persistenceScript.includes('node scripts/check-work-persistence.mjs'));
  check('live smoke cannot enter remote persistence', source.includes("if (!smoke && !dirty && !offline && !testMode)") && source.includes("if (!smoke) {\n      setState({ pushPending: true"));
  check('one unique stem defines event, stderr, partial, and result paths', source.includes('const stem = `worker-${turn}-${Date.now()}-${process.pid}-${workerPathSerial}`'));
  check('result promotion occurs only after production schema validation', source.indexOf("['validate', paths.resultPartialPath]") < source.indexOf('promoteResultAtomically(paths.resultPartialPath'));
  check('status uses PID liveness and process command verification', source.includes('process.kill(pid, 0)') && source.includes("spawnSync('/bin/ps'"));
  check('retry budget is six hours in milliseconds', source.includes('6 * 60 * 60 * 1000'));
  const stateValidation = spawnSync(process.execPath, ['scripts/validate-jlpt-automation-state.mjs'], { cwd: root, encoding: 'utf8' });
  check('authoritative state schemas and source checksums validate', stateValidation.status === 0 && stateValidation.stdout.includes('JLPT AUTOMATION STATE PASS'));
  check('global rules are digest-gated for fast resume', source.includes('digest-check') && source.includes('fastResume'));
  const ruleDigest = JSON.parse(readFileSync(resolve(root, 'docs/jlpt-workspace/JLPT_RULE_DIGEST.json'), 'utf8'));
  check('worker parser wrapper and runbook are digest-gated', ['scripts/jlpt-unattended-worker-io.mjs', 'scripts/jlpt-codex-worker-wrapper.sh', 'docs/jlpt-workspace/JLPT_UNATTENDED_RUNBOOK.md'].every((path) => typeof ruleDigest.files[path] === 'string'));
  check('one worker session resumes across batches of one exam', source.includes("['exec', 'resume'") && source.includes('workerSessionId'));
  check('written batching policy remains page-sized or 10–20 questions', decisions.writtenBatchPolicy.minimumQuestions === 10 && decisions.writtenBatchPolicy.maximumQuestions === 20 && decisions.writtenBatchPolicy.crossPageQuestionSameBatch);
  check('fully unattended policy still forbids asking the user', decisions.askUserDuringRun === false && /Never ask the user/.test(prompt));
  check('result validator still rejects interactive output', readFileSync(resolve(root, 'scripts/validate-jlpt-unattended-result.mjs'), 'utf8').includes('forbiddenInteraction'));
  check('fixed decisions retain N1 to N2 to N3 order', decisions.reusePriorDecisions && JSON.stringify(decisions.examOrder) === JSON.stringify(['N1', 'N2', 'N3']));
  check('manifest deterministically selects the next unit', source.includes('manifest.nextUnit') && progress.nextAction.includes('question'));
  const cacheKey = spawnSync(process.execPath, ['scripts/jlpt-automation-state.mjs', 'cache-key', 'fixture-v2', 'docs/jlpt-workspace/JLPT_AUTOMATION_DECISIONS.json'], { cwd: root, encoding: 'utf8' });
  check('checksum and tool-version cache key remains deterministic', cacheKey.status === 0 && /^[0-9a-f]{64}$/.test(cacheKey.stdout.trim()));
  check('local blockers remain record-and-continue', decisions.unreadableSourcePolicy.scope === 'LOCAL' && decisions.unreadableSourcePolicy.action === 'record_and_continue');
  const batchSlice = source.slice(source.indexOf('const changed = actualChanges()'), source.indexOf('if (result.examComplete)'));
  check('one validated content batch creates one local commit', (batchSlice.match(/git\(\['commit'/g) || []).length === 1);
  check('no SHA-only durability commit exists', !source.includes('record_durable_sha') && !source.includes('durable-record commit'));
  check('normal mid-exam batches do not push', !batchSlice.includes('persistAll(info'));
  check('exam completion retains push/fetch/persistence', source.includes('EXAM COMPLETE') && source.includes('workPersistence(logPath)'));
  check('INT TERM and HUP retain controlled shutdown', ['SIGINT', 'SIGTERM', 'SIGHUP'].every((signal) => source.includes(signal)) && source.includes('await persistAll(info, logPath)'));
  check('context handoff persists before a fresh session', source.includes('else if (result.contextHandoff)') && source.includes('sessionId = null'));
  check('retry waits never call the model', source.includes('modelCalled: false') && source.includes('GLOBAL_RETRY_WAIT'));
  const heartbeatStart = source.indexOf('heartbeat = setInterval');
  const heartbeatEnd = source.indexOf('}, testMode ? 250 : 60000);', heartbeatStart);
  const heartbeatSlice = source.slice(heartbeatStart, heartbeatEnd);
  check('heartbeat does not call the model', heartbeatSlice.includes('RUNNING |') && !heartbeatSlice.includes('invokeWorker') && !heartbeatSlice.includes('codexBin'));
  check('no arbitrary turn limit was introduced', !source.includes('MAX_NO_PROGRESS') && !source.includes('MAX_TURNS'));
  check('local no-progress keeps deterministic queue control', source.includes('WORKER_FAILURE_LOCAL') && source.includes('manifest.nextUnit'));
  check('locked UI paths remain explicitly rejected', source.includes('src/components/jlpt/ui/JlptExamUI.tsx') && source.includes('check-jlpt-approved-ui-lock.mjs'));
  check('destructive Git cleanup remains absent', !/git[^\n]{0,80}(?:reset|checkout|clean|stash)/.test(source));
  check('approve-for-me remains absent', !source.includes('--approve-for-me'));
  check('runtime state remains outside the repository', runbook.includes('${TMPDIR:-/tmp}/japan-app-jlpt-runtime/<repo-hash>/'));
  check('listening provenance remains candidate-unverified', manifest.listeningSource.requiredCandidateStatus === 'candidate_unverified' && !manifest.listeningSource.humanReviewed && !manifest.listeningSource.perceptualApproval && manifest.listeningSource.needsLaterReview);
  console.log(`JLPT UNATTENDED FIXTURE PASS: ${checks.length} production-path acceptance checks`);
} finally {
  if (backgroundActive) run(['stop']);
  rmSync(runtime, { recursive: true, force: true });
}
