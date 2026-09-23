import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');

const written = readJson('docs/jlpt-workspace/conversion/n5-2011-12/written.audit.json');
const listening = readJson('docs/jlpt-workspace/conversion/n5-2011-12/listening.audit.json');
const manifest = readJson('docs/jlpt-workspace/conversion/n5-2011-12/WORK_MANIFEST.json');
const catalog = fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts', 'utf8');

assert.deepEqual(written.counts, { vocabulary: 33, grammarReading: 32, total: 65 });
assert.equal(written.records.length, 65);
assert.equal(new Set(written.records.map((record) => record.auditId)).size, 65);
assert.ok(written.records.every((record) => /^[1-4]$/.test(record.correctOptionId)));
assert.ok(written.records.every((record) => record.answerKeyPage === 13));
assert.equal(written.records.filter((record) => record.explanationOrTranslationPages.length > 0).length, 53);
assert.equal(written.records.filter((record) => record.explanationTranslationAudit === 'source_absent_for_this_question').length, 12);

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
  assert.ok(record.timingMs.end <= 1712901);
  previousEnd = record.timingMs.end;
}

assert.equal(manifest.examId, 'n5-2011-12-exam-01');
assert.equal(manifest.catalogPeriodId, 'n5-2011-12');
assert.equal(manifest.status, 'incomplete');
assert.equal(manifest.identity.confidence, 'unresolved');
assert.equal(manifest.counts.writtenResponses, 65);
assert.equal(manifest.counts.listeningResponses, 24);
assert.equal(manifest.source.answerKeyPresent, true);
assert.equal(manifest.source.japaneseListeningTranscriptPresent, true);
assert.equal(manifest.source.simplifiedChineseExplanationRecords, 53);
assert.equal(manifest.source.missingExplanationRecords, 12);
assert.equal(manifest.timing.candidateCount, 24);
assert.equal(manifest.review.humanReviewed, false);
assert.equal(manifest.review.perceptualApproval, false);
assert.equal(manifest.review.reviewDisposition, 'needs_later_review');
assert.ok(manifest.blockers.length >= 4);
assert.equal(sha256('assets/jlpt/n5/2011-12/audio/n5-2011-12.mp3'), manifest.runtimeAudio.sha256);
assert.match(catalog, /'n5-2011-12'/);
assert.doesNotMatch(catalog, /n5-2011-12-exam-01/);

console.log('N5 2010-2011 SOURCE AUDIT PASS: 65 written and 24 listening IDs; answers, partial Chinese explanations, transcript, runtime audio, and 24 unverified candidate timings recorded; identity remains unresolved and incomplete.');
