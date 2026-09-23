import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');

const written = readJson('docs/jlpt-workspace/conversion/n5-2012-12/written.audit.json');
const listening = readJson('docs/jlpt-workspace/conversion/n5-2012-12/listening.audit.json');
const manifest = readJson('docs/jlpt-workspace/conversion/n5-2012-12/WORK_MANIFEST.json');
const catalog = fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts', 'utf8');

assert.deepEqual(written.counts, { vocabulary: 35, grammarReading: 32, total: 67 });
assert.equal(written.records.length, 67);
assert.equal(new Set(written.records.map((record) => record.auditId)).size, 67);
assert.ok(written.records.every((record) => /^[1-4]$/.test(record.correctOptionId)));
assert.ok(written.records.every((record) => record.answerKeyPage === 13));
assert.equal(written.records.filter((record) => record.explanationOrTranslationPages.length > 0).length, 55);
assert.equal(written.records.filter((record) => record.explanationTranslationAudit === 'source_absent_for_this_question').length, 12);
assert.deepEqual(written.records.filter((record) => record.questionSourcePages.length === 0).map((record) => record.overallQuestionNumber), [27, 28, 29]);
assert.ok(written.records.filter((record) => record.questionSourcePages.length === 0).every((record) => record.runtimeTranscriptionStatus === 'blocked_missing_question_source'));

assert.deepEqual(listening.counts, { responses: 24, problems: [7, 6, 5, 6], candidateTimings: 24 });
assert.equal(listening.records.length, 24);
assert.equal(new Set(listening.records.map((record) => record.auditId)).size, 24);
assert.ok(listening.records.every((record) => /^[1-4]$/.test(record.correctOptionId)));
assert.ok(listening.records.every((record) => record.answerKeyPage === 13));
assert.ok(listening.records.every((record) => record.transcriptSourcePages.length > 0));
assert.ok(listening.records.every((record) => record.timingVerificationStatus === 'candidate_unverified'));
assert.ok(listening.records.every((record) => record.humanReviewed === false && record.perceptualApproval === false && record.reviewDisposition === 'needs_later_review'));
let previousEnd = 0;
for (const record of listening.records) {
  assert.ok(Number.isInteger(record.timingMs.start) && Number.isInteger(record.timingMs.end));
  assert.ok(record.timingMs.start >= previousEnd);
  assert.ok(record.timingMs.end > record.timingMs.start);
  assert.ok(record.timingMs.end <= 1843958);
  previousEnd = record.timingMs.end;
}

assert.equal(manifest.examId, 'n5-2012-12-exam-02');
assert.equal(manifest.catalogPeriodId, 'n5-2012-12');
assert.equal(manifest.status, 'incomplete');
assert.equal(manifest.identity.confidence, 'strong_source_match');
assert.equal(manifest.counts.writtenResponses, 67);
assert.equal(manifest.counts.listeningResponses, 24);
assert.equal(manifest.counts.totalAuditIds, 91);
assert.equal(manifest.source.answerKeyPresent, true);
assert.equal(manifest.source.japaneseListeningTranscriptPresent, true);
assert.equal(manifest.source.simplifiedChineseExplanationRecords, 55);
assert.equal(manifest.source.missingExplanationRecords, 12);
assert.equal(manifest.source.missingQuestionSourceRecords, 3);
assert.equal(manifest.timing.candidateCount, 24);
assert.notEqual(manifest.timing.supportArtifactSha256, 'PENDING_WHISPER_OUTPUT');
assert.equal(manifest.review.humanReviewed, false);
assert.equal(manifest.review.perceptualApproval, false);
assert.equal(manifest.review.reviewDisposition, 'needs_later_review');
assert.ok(manifest.blockers.length >= 5);
assert.equal(sha256('assets/jlpt/n5/2012-12/audio/n5-2012-12.mp3'), manifest.runtimeAudio.sha256);
assert.match(catalog, /'n5-2012-12'/);
assert.doesNotMatch(catalog, /n5-2012-12-exam-02/);

console.log('N5 2012-12 SOURCE AUDIT PASS: 67 written and 24 listening IDs; answers, partial Chinese explanations, transcript, runtime audio, and 24 unverified candidate timings recorded; three written source records remain absent and status remains incomplete.');
