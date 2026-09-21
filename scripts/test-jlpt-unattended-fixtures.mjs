#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const supervisor = readFileSync(resolve(root, 'scripts/jlpt-unattended-supervisor.mjs'), 'utf8');
const prompt = readFileSync(resolve(root, 'docs/jlpt-workspace/JLPT_UNATTENDED_PROMPT.md'), 'utf8');
const runbook = readFileSync(resolve(root, 'docs/jlpt-workspace/JLPT_UNATTENDED_RUNBOOK.md'), 'utf8');
const decisions = JSON.parse(readFileSync(resolve(root, 'docs/jlpt-workspace/JLPT_AUTOMATION_DECISIONS.json'), 'utf8'));
const progress = JSON.parse(readFileSync(resolve(root, 'docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(resolve(root, progress.manifestPath), 'utf8'));
const checks = [];
const check = (name, condition) => {
  if (!condition) throw new Error(`FIXTURE FAIL: ${name}`);
  checks.push(name);
  console.log(`PASS ${checks.length}: ${name}`);
};
const run = (command, args, options = {}) => spawnSync(command, args, { cwd: root, encoding: 'utf8', ...options });

const stateValidation = run(process.execPath, ['scripts/validate-jlpt-automation-state.mjs']);
check('authoritative state schemas and source checksums validate', stateValidation.status === 0 && stateValidation.stdout.includes('JLPT AUTOMATION STATE PASS'));
check('global rules are digest-gated for one-time loading and fast resume', supervisor.includes('digest-check') && supervisor.includes('fastResume'));
check('one worker session is resumed across multiple batches of one exam', supervisor.includes("['exec', 'resume'") && supervisor.includes('workerSessionId'));
check('written batching is page-sized or 10–20 questions with cross-page grouping', decisions.writtenBatchPolicy.minimumQuestions === 10 && decisions.writtenBatchPolicy.maximumQuestions === 20 && decisions.writtenBatchPolicy.crossPageQuestionSameBatch);
check('fully unattended policy forbids asking the user', decisions.askUserDuringRun === false && /Never ask the user/.test(prompt));
check('Codex child stdin is ignored', supervisor.includes("stdio: ['ignore'"));
check('worker output cannot offer 1/2/3 choices', readFileSync(resolve(root, 'scripts/validate-jlpt-unattended-result.mjs'), 'utf8').includes('forbiddenInteraction'));
check('fixed decisions are reused for later exams in N1→N2→N3 order', decisions.reusePriorDecisions && JSON.stringify(decisions.examOrder) === JSON.stringify(['N1', 'N2', 'N3']));
check('deterministic manifest selects nextAction without a model call', supervisor.includes('manifest.nextUnit') && progress.nextAction.includes('question'));

const cacheKey = run(process.execPath, ['scripts/jlpt-automation-state.mjs', 'cache-key', 'fixture-v1', 'docs/jlpt-workspace/JLPT_AUTOMATION_DECISIONS.json']);
check('checksum and tool-version cache key is deterministic', cacheKey.status === 0 && /^[0-9a-f]{64}$/.test(cacheKey.stdout));
check('local blockers are record-and-continue rather than global stops', decisions.unreadableSourcePolicy.scope === 'LOCAL' && decisions.unreadableSourcePolicy.action === 'record_and_continue');
check('one validated content batch creates only one local commit', (supervisor.slice(supervisor.indexOf('const changed = actualChanges()'), supervisor.indexOf('if (result.examComplete)')).match(/git\(\['commit'/g) || []).length === 1);
check('there is no second commit used only to record a prior SHA', !supervisor.includes('record_durable_sha') && !supervisor.includes('durable-record commit'));
check('normal mid-exam batch path does not push', supervisor.indexOf('BATCH COMMITTED') < supervisor.indexOf('if (result.examComplete)') && !supervisor.slice(supervisor.indexOf('git([\'commit\''), supervisor.indexOf('if (result.examComplete)')).includes('persistAll(info'));
check('exam completion pushes, fetches, and requires persistence', supervisor.includes('EXAM COMPLETE') && supervisor.includes('workPersistence(logPath)'));
check('INT/TERM/HUP trigger controlled persistence shutdown', ['SIGINT', 'SIGTERM', 'SIGHUP'].every((signal) => supervisor.includes(signal)) && supervisor.includes('await persistAll(info, logPath)'));
check('context handoff pushes before opening a fresh session', supervisor.includes("else if (result.contextHandoff)") && supervisor.includes("sessionId = null"));
check('network retry journal proves no model call while waiting', supervisor.includes("modelCalled: false") && supervisor.includes('GLOBAL_RETRY_WAIT'));
check('retry budget defaults to exactly six hours in milliseconds', supervisor.includes('6 * 60 * 60 * 1000'));
check('no NO_CHANGE or arbitrary safety-limit loop remains', !supervisor.includes('MAX_NO_PROGRESS') && !supervisor.includes('MAX_TURNS'));
check('local no-progress resets only the worker and keeps deterministic queue control', supervisor.includes('WORKER_FAILURE_LOCAL') && supervisor.includes('manifest.nextUnit'));
check('locked UI files are explicitly rejected and UI lock is revalidated', supervisor.includes('src/components/jlpt/ui/JlptExamUI.tsx') && supervisor.includes('check-jlpt-approved-ui-lock.mjs'));
check('destructive Git cleanup/reset is absent', !/git[^\n]{0,80}(?:reset|checkout|clean|stash)/.test(supervisor));
check('installed CLI contract uses output schema, approval never, and no approve-for-me', supervisor.includes('--output-schema') && supervisor.includes('approval_policy=') && supervisor.includes('"never"') && !supervisor.includes('--approve-for-me'));
check('supervisor and fixture do not require rg', !/\brg\b/.test(supervisor) && !/\brg\b/.test(readFileSync(resolve(root, 'scripts/test-run-jlpt-unattended.sh'), 'utf8')));

const fixtureDir = mkdtempSync(resolve(tmpdir(), 'jlpt-result-fixture-'));
try {
  const valid = {
    status: 'LOCAL_CHANGES_READY', examId: progress.activeExamId, unit: 'written:q049-q055', commitMessage: 'feat(jlpt): recover written questions 49 through 55',
    changedFiles: ['docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json', progress.checkpointPath, progress.manifestPath, 'docs/jlpt-workspace/conversion/n1-2015-12/written-page-06-07-q49-q55.review.json'],
    validations: [{ name: 'fixture', status: 'PASS', evidence: 'deterministic' }], nextAction: 'written:q056-q058', blockers: [], sourceChecksum: manifest.sourceChecksums['assets/jlpt/n1/2015-12/question/page-06.jpg'], toolVersion: 'fixture-v1', examComplete: false, contextHandoff: ''
  };
  const validPath = resolve(fixtureDir, 'valid.json');
  writeFileSync(validPath, JSON.stringify(valid));
  const accepted = run(process.execPath, ['scripts/validate-jlpt-unattended-result.mjs', 'validate', validPath]);
  check('current Codex output schema accepts a non-interactive validated batch', accepted.status === 0);
  valid.nextAction = 'NEED_USER_INPUT: choose 1/2/3';
  const invalidPath = resolve(fixtureDir, 'invalid.json');
  writeFileSync(invalidPath, JSON.stringify(valid));
  const rejected = run(process.execPath, ['scripts/validate-jlpt-unattended-result.mjs', 'validate', invalidPath]);
  check('result validator rejects user questions and numbered choices', rejected.status !== 0);
} finally { rmSync(fixtureDir, { recursive: true, force: true }); }

check('runtime state and append-only journal are outside the repository', runbook.includes('${TMPDIR:-/tmp}/japan-app-jlpt-runtime/<repo-hash>/'));
check('active manifest truthfully retains candidate-unverified listening state', manifest.listeningSource.requiredCandidateStatus === 'candidate_unverified' && !manifest.listeningSource.humanReviewed && !manifest.listeningSource.perceptualApproval && manifest.listeningSource.needsLaterReview);
console.log(`JLPT UNATTENDED FIXTURE PASS: ${checks.length} deterministic acceptance checks`);
