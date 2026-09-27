import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const payloadHash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

const writtenAudit = readJson('docs/jlpt-workspace/conversion/n5-2012-12/written.audit.json');
const listeningAudit = readJson('docs/jlpt-workspace/conversion/n5-2012-12/listening.audit.json');
const written = readJson('docs/jlpt-workspace/conversion/n5-2012-12/written.partial.json');
const listening = readJson('docs/jlpt-workspace/conversion/n5-2012-12/listening.partial.json');
const previousWritten = readJson('docs/jlpt-workspace/conversion/n5-2011-12/written.partial.json');
const manifest = readJson('docs/jlpt-workspace/conversion/n5-2012-12/WORK_MANIFEST.json');
const catalog = fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts', 'utf8');
const registry = fs.readFileSync('src/data/jlpt-official/approved-n1-exams.ts', 'utf8');
const adapter = fs.readFileSync('src/data/jlpt-official/n5-2012-12-trial.ts', 'utf8');

assert.deepEqual(writtenAudit.counts, { vocabulary: 35, grammarReading: 32, total: 67 });
assert.equal(written.questions.length, 67);
assert.equal(written.remainingWritten, 0);
assert.equal(written.remainingListening, 0);
assert.equal(written.status, 'candidate_unverified');
assert.equal(new Set(written.questions.map((question) => question.id)).size, 67);
assert.equal(payloadHash(written.questions), '782d483fad4bd9d5f0e5d56f3f4163da91431ba37fff51d21840b63aa5447d25');
for (const [index, question] of written.questions.entries()) {
  const audit = writtenAudit.records[index];
  assert.equal(question.id, `n5-2012-12-${audit.auditId}`);
  assert.equal(question.answer, Number(audit.correctOptionId));
  assert.ok(question.prompt.trim());
  assert.equal(question.options.length, 4);
  assert.ok(question.options.every((option) => option.trim()));
}

const recovered = writtenAudit.records.filter((record) => record.questionSourcePages.length === 0);
assert.deepEqual(recovered.map((record) => record.overallQuestionNumber), [27, 28, 29]);
assert.ok(recovered.every((record) => record.runtimeTranscriptionStatus === 'verified_against_external_recovery_sources'));
assert.ok(recovered.every((record) => record.recoverySources.length === 2));
assert.equal(writtenAudit.records.filter((record) => record.runtimeTranscriptionStatus === 'verified_character_level_runtime_transcription').length, 64);
assert.equal(writtenAudit.records.filter((record) => record.explanationOrTranslationPages.length > 0).length, 55);
assert.equal(writtenAudit.records.filter((record) => record.explanationTranslationAudit === 'source_absent_for_this_question').length, 12);

assert.deepEqual(listeningAudit.counts, { responses: 24, problems: [7, 6, 5, 6], candidateTimings: 24 });
assert.equal(listening.questions.length, 24);
assert.equal(listening.remainingListening, 0);
assert.equal(listening.status, 'candidate_unverified');
assert.deepEqual(listening.timingReview, { humanReviewed: false, perceptualApproval: false, reviewDisposition: 'needs_later_review' });
assert.equal(new Set(listening.questions.map((question) => question.id)).size, 24);
assert.equal(payloadHash(listening.questions), '2a139bc6d5716032edcb7aafef055b05df0de4fa214295a249a7fc1854686602');

let previousEnd = 0;
for (const [index, question] of listening.questions.entries()) {
  const audit = listeningAudit.records[index];
  assert.equal(question.id, `n5-2012-12-${audit.auditId}`);
  assert.equal(question.answer, Number(audit.correctOptionId));
  assert.equal(question.candidateStartMs, audit.timingMs.start);
  assert.equal(question.candidateEndMs, audit.timingMs.end);
  assert.equal(question.timingVerificationStatus, 'candidate_unverified');
  assert.equal(question.humanReviewed, false);
  assert.equal(question.perceptualApproval, false);
  assert.equal(question.reviewDisposition, 'needs_later_review');
  assert.ok(question.prompt.trim());
  assert.equal(question.options.length, audit.problemNumber <= 2 ? 4 : 3);
  assert.ok(question.options.every((option) => option.trim()));
  assert.equal(Math.round((question.candidateStartMs / 1000) * 1000), question.candidateStartMs);
  assert.equal(Math.round((question.candidateEndMs / 1000) * 1000), question.candidateEndMs);
  assert.ok(question.candidateStartMs >= previousEnd);
  assert.ok(question.candidateEndMs > question.candidateStartMs);
  assert.ok(question.candidateEndMs <= 1843958);
  previousEnd = question.candidateEndMs;
  assert.equal(audit.transcriptAudit, 'printed_transcript_and_audio_cross_checked_runtime_transcribed');
}

assert.equal(payloadHash(previousWritten.questions), '8e7207ef404257c39684c19ce79062c2828beec5d19bc863e74be62e7f056ae0');
assert.equal(manifest.examId, 'n5-2012-12-exam-02');
assert.equal(manifest.catalogPeriodId, 'n5-2012-12');
assert.equal(manifest.status, 'incomplete');
assert.equal(manifest.identity.confidence, 'strong_source_match');
assert.deepEqual(manifest.counts, { writtenResponses: 67, listeningResponses: 24, totalAuditIds: 91 });
assert.equal(manifest.source.missingQuestionSourceRecords, 3);
assert.equal(manifest.source.externallyRecoveredQuestionRecords, 3);
assert.equal(manifest.timing.candidateCount, 24);
assert.equal(manifest.timing.status, 'candidate_unverified');
assert.deepEqual(manifest.review, { humanReviewed: false, perceptualApproval: false, reviewDisposition: 'needs_later_review' });
assert.deepEqual(manifest.runtimeCandidate, {
  registered: true,
  writtenResponses: 67,
  listeningResponses: 24,
  writtenQuestionPayloadSha256: '782d483fad4bd9d5f0e5d56f3f4163da91431ba37fff51d21840b63aa5447d25',
  listeningQuestionPayloadSha256: '2a139bc6d5716032edcb7aafef055b05df0de4fa214295a249a7fc1854686602',
  listeningContentStatus: 'source_pdf_audio_cross_checked_candidate_unverified',
  continuousAudioPlayback: true,
  visualAssetCount: 6,
});

assert.equal(sha256('assets/jlpt/n5/2012-12/audio/n5-2012-12.mp3'), 'c3e99d9445a54f00268d323e1179c38e26cc59f1581c250818e11c92ab00b9dd');
const visualHashes = new Map([
  ['listening-p1-q1-q5.jpg', '7027eaaa20796e0d8a9689045eb4df7e3a42aa8c65bc2bbbaad9aac1b05c0953'],
  ['listening-p1-q6-q7.jpg', 'ee3772da39ec363ce206eb98a25e8396581b4d3242d15cca4a236c8e5771230c'],
  ['listening-p2-q1-q4.jpg', '09223477eaf44763c657a6975d4fed4a0c8a3a3800d6f5f44b7f880f760e6702'],
  ['listening-p3-q1-q3.jpg', 'e6a2a2ceae18bcf054e4bc597416a6544c1dc098db63cbb9e7637e4969dfa4fc'],
  ['listening-p3-q4-q5.jpg', '23a383e8b136861a6d53bafca79e45fac3a512c916d8be26dd941e8958677f25'],
  ['written-p6-q1.jpg', '2da6ed2364bb670340c347ccf6f891cc2e53100ef2b755cb5d034cb73b43fa2f'],
]);
for (const [file, expectedHash] of visualHashes) {
  assert.equal(sha256(`assets/jlpt/n5/2012-12/visual-options/${file}`), expectedHash);
}

assert.doesNotMatch(catalog, /'n5-2012-12'/);
assert.match(registry, /import \{ N5_2012_12_SESSION_KEY, N5_2012_12_TRIAL \}/);
assert.match(registry, /id: 'n5-2012-12-exam-02'/);
assert.match(registry, /audioSource: require\('\.\.\/\.\.\/\.\.\/assets\/jlpt\/n5\/2012-12\/audio\/n5-2012-12\.mp3'\)/);
assert.match(adapter, /segmentId: 'n5-2012-12-continuous'/);
assert.match(adapter, /endMs: 1843958/);

console.log('N5 2012-12 INTEGRATION PASS: 67 complete written responses and 24 complete listening responses registered; missing scan page recovered from two cross-checked sources; timing remains candidate-unverified and prior N5 2010-2011 written payload is unchanged.');
