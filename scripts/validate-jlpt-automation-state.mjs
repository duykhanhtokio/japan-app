#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const fail = (message) => { console.error(`JLPT AUTOMATION STATE FAIL: ${message}`); process.exit(1); };
const isSha = (value, length = 40) => typeof value === 'string' && new RegExp(`^[0-9a-f]{${length}}$`).test(value);
const sha256 = (path) => createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');

const decisions = readJson('docs/jlpt-workspace/JLPT_AUTOMATION_DECISIONS.json');
if (decisions.schemaVersion !== 1 || decisions.executionMode !== 'fully_unattended') fail('automation decisions schema/mode changed');
if (JSON.stringify(decisions.examOrder) !== JSON.stringify(['N1', 'N2', 'N3'])) fail('exam order must remain N1, N2, N3');
if (!decisions.reusePriorDecisions || decisions.askUserDuringRun || decisions.workerLifetime !== 'one_complete_exam' || !decisions.uiLocked) fail('fixed unattended decisions changed');
if (decisions.writtenBatchPolicy.minimumQuestions !== 10 || decisions.writtenBatchPolicy.maximumQuestions !== 20 || !decisions.writtenBatchPolicy.crossPageQuestionSameBatch) fail('written batch policy changed');
if (decisions.listeningPolicy.status !== 'candidate_unverified' || decisions.listeningPolicy.humanReviewed || decisions.listeningPolicy.perceptualApproval || !decisions.listeningPolicy.needsLaterReview) fail('listening truthfulness policy changed');
if (decisions.unreadableSourcePolicy.scope !== 'LOCAL' || decisions.unreadableSourcePolicy.inferFromAnswerKey || decisions.unreadableSourcePolicy.maximumAutomatedAttempts !== 2) fail('local blocker policy changed');
if (decisions.retryPolicy.maximumTotalDurationHours !== 6 || !decisions.retryPolicy.doNotConsumeModelTokensWhileWaiting) fail('retry policy changed');

const progressPath = 'docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json';
const progress = readJson(progressPath);
for (const key of ['schemaVersion', 'activeLevel', 'activeExamId', 'phase', 'completedWrittenThrough', 'completedUnits', 'blockedUnits', 'nextAction', 'checkpointPath', 'manifestPath', 'lastValidatedLocalCommit', 'lastDurableUnitSHA', 'lastRemoteHeadSHA', 'pushPending', 'updatedAt']) {
  if (!(key in progress)) fail(`active progress missing ${key}`);
}
if (progress.schemaVersion !== 1 || !['N1', 'N2', 'N3'].includes(progress.activeLevel)) fail('active progress identity invalid');
if (!Number.isInteger(progress.completedWrittenThrough) || progress.completedWrittenThrough < 0) fail('completedWrittenThrough invalid');
if (!isSha(progress.lastValidatedLocalCommit) || !isSha(progress.lastDurableUnitSHA) || !isSha(progress.lastRemoteHeadSHA)) fail('progress SHA invalid');
if (!existsSync(resolve(root, progress.checkpointPath)) || !existsSync(resolve(root, progress.manifestPath))) fail('progress points to a missing checkpoint or manifest');

const manifest = readJson(progress.manifestPath);
for (const key of ['schemaVersion', 'examId', 'level', 'chronologicalOrder', 'questionSourcePages', 'writtenRanges', 'answerKeyPaths', 'answerKeyChecksums', 'listeningSource', 'audioChecksum', 'scriptTranscriptPaths', 'explanationSources', 'translationState', 'integrationState', 'completedUnits', 'remoteVerifiedUnits', 'localOnlyCommittedUnits', 'blockedUnits', 'pendingUnits', 'nextUnit', 'validationCommands', 'allowedOutputPaths', 'sourceChecksums']) {
  if (!(key in manifest)) fail(`work manifest missing ${key}`);
}
if (manifest.schemaVersion !== 1 || manifest.examId !== progress.activeExamId || manifest.level !== progress.activeLevel) fail('manifest/progress identity mismatch');
if (!Array.isArray(manifest.pendingUnits) || !Array.isArray(manifest.validationCommands) || !Array.isArray(manifest.allowedOutputPaths)) fail('manifest queue/validation/allowlist invalid');
for (const [path, expected] of Object.entries(manifest.sourceChecksums)) {
  if (!existsSync(resolve(root, path))) fail(`source missing: ${path}`);
  if (!isSha(expected, 64) || sha256(path) !== expected) fail(`source checksum mismatch: ${path}`);
}
for (const [path, expected] of Object.entries(manifest.answerKeyChecksums)) {
  if (!existsSync(resolve(root, path)) || sha256(path) !== expected) fail(`answer-key checksum mismatch: ${path}`);
}
if (manifest.listeningSource.requiredCandidateStatus !== 'candidate_unverified') fail('listening candidate status invalid');
if (manifest.listeningSource.humanReviewed || manifest.listeningSource.perceptualApproval) fail('manifest falsely claims listening review');

console.log(`JLPT AUTOMATION STATE PASS: ${progress.activeExamId}; phase=${progress.phase}; written=${progress.completedWrittenThrough}; next=${manifest.nextUnit}`);
