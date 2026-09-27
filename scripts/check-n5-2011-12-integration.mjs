import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const payloadHash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

const writtenAudit = readJson('docs/jlpt-workspace/conversion/n5-2011-12/written.audit.json');
const listeningAudit = readJson('docs/jlpt-workspace/conversion/n5-2011-12/listening.audit.json');
const written = readJson('docs/jlpt-workspace/conversion/n5-2011-12/written.partial.json');
const listening = readJson('docs/jlpt-workspace/conversion/n5-2011-12/listening.partial.json');
const matchingSourceText = readJson('docs/jlpt-workspace/conversion/n5-2017-07/listening.partial.json');
const manifest = readJson('docs/jlpt-workspace/conversion/n5-2011-12/WORK_MANIFEST.json');
const catalog = fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts', 'utf8');
const registry = fs.readFileSync('src/data/jlpt-official/approved-n1-exams.ts', 'utf8');
const adapter = fs.readFileSync('src/data/jlpt-official/n5-2011-12-trial.ts', 'utf8');

assert.deepEqual(writtenAudit.counts, { vocabulary: 33, grammarReading: 32, total: 65 });
assert.equal(written.questions.length, 65);
assert.equal(written.remainingWritten, 0);
assert.equal(written.remainingListening, 0);
assert.equal(written.status, 'candidate_unverified');
assert.equal(new Set(written.questions.map((question) => question.id)).size, 65);
assert.equal(
  payloadHash(written.questions),
  '8e7207ef404257c39684c19ce79062c2828beec5d19bc863e74be62e7f056ae0',
  'The 65 previously verified written question payloads must stay byte-equivalent after JSON parsing.',
);

assert.deepEqual(listeningAudit.counts, { responses: 24, problems: [7, 6, 5, 6], candidateTimings: 24 });
assert.equal(listening.questions.length, 24);
assert.equal(listening.remainingListening, 0);
assert.equal(listening.status, 'candidate_unverified');
assert.deepEqual(listening.timingReview, {
  humanReviewed: false,
  perceptualApproval: false,
  reviewDisposition: 'needs_later_review',
});
assert.equal(new Set(listening.questions.map((question) => question.id)).size, 24);

for (const [index, question] of listening.questions.entries()) {
  const audit = listeningAudit.records[index];
  const matching = matchingSourceText.questions[index];
  const expectedId = audit.auditId.replace(/^listening-/, 'n5-2011-12-listening-');
  assert.equal(question.id, expectedId);
  assert.equal(question.answer, Number(audit.correctOptionId));
  assert.equal(question.candidateStartMs, audit.timingMs.start);
  assert.equal(question.candidateEndMs, audit.timingMs.end);
  assert.ok(audit.transcriptSourcePages.every((page) => question.transcriptSourcePages.includes(page)));
  assert.equal(question.reviewStatus, 'source_pdf_audio_cross_checked_candidate_unverified');
  assert.equal(question.prompt, matching.prompt);
  assert.deepEqual(question.options, matching.options);
  assert.equal(question.answer, matching.answer);
  assert.ok(question.prompt.trim());
  assert.equal(question.options.length, audit.problemNumber <= 2 ? 4 : 3);
  assert.ok(question.options.every((option) => option.trim()));
  assert.equal(Math.round((question.candidateStartMs / 1000) * 1000), question.candidateStartMs);
  assert.equal(Math.round((question.candidateEndMs / 1000) * 1000), question.candidateEndMs);
}

assert.equal(manifest.examId, 'n5-2011-12-exam-01');
assert.equal(manifest.status, 'incomplete');
assert.equal(manifest.identity.confidence, 'unresolved');
assert.deepEqual(manifest.counts, { writtenResponses: 65, listeningResponses: 24, totalAuditIds: 89 });
assert.deepEqual(manifest.runtimeCandidate, {
  registered: true,
  writtenResponses: 65,
  listeningResponses: 24,
  writtenQuestionPayloadSha256: '8e7207ef404257c39684c19ce79062c2828beec5d19bc863e74be62e7f056ae0',
  listeningContentStatus: 'source_pdf_audio_cross_checked_candidate_unverified',
  continuousAudioPlayback: true,
  visualAssetCount: 6,
});
assert.equal(manifest.review.humanReviewed, false);
assert.equal(manifest.review.perceptualApproval, false);
assert.equal(manifest.review.reviewDisposition, 'needs_later_review');
assert.equal(sha256('assets/jlpt/n5/2011-12/audio/n5-2011-12.mp3'), manifest.runtimeAudio.sha256);

const visualHashes = new Map([
  ['written-p3-q9-q10.jpg', '52828ab2420bf2f7b36c305e07ba07e9fedbb698775f12486f2029624d817d0b'],
  ['written-p4-q2.jpg', 'f9ba7e0262b0b59f8ef4f5d946e4e470cc3cdd528eb6ed10e3ccd526e61c1cd5'],
  ['written-p6-q1.jpg', '6c9271421432c95d8f184f3ec9c33763e4ba582b8b33e47014b7c1eb8ff70cd9'],
  ['listening-p1-options.jpg', '08b910372669aaf9b0a4e32f4b8f2ef92abd2dacf860573c7da16a3947716738'],
  ['listening-p3-q1-q4.jpg', '2b6216adb204187d202fdad9daaf2162350eb2cbc5f7754fc4b92a96eb7986e4'],
  ['listening-p3-q5.jpg', '5c1fac85e6e4b93f313b22e57968cfad2b478029bc10d0393d2cc3fe6e8650dd'],
]);
for (const [file, expectedHash] of visualHashes) {
  assert.equal(sha256(`assets/jlpt/n5/2011-12/visual-options/${file}`), expectedHash);
}

assert.doesNotMatch(catalog, /'n5-2011-12'/);
assert.match(registry, /import \{ N5_2011_12_SESSION_KEY, N5_2011_12_TRIAL \}/);
assert.match(registry, /id: 'n5-2011-12-exam-01'/);
assert.match(registry, /audioSource: require\('\.\.\/\.\.\/\.\.\/assets\/jlpt\/n5\/2011-12\/audio\/n5-2011-12\.mp3'\)/);
assert.match(adapter, /segmentId: 'n5-2011-12-continuous'/);
assert.match(adapter, /endMs: 1712901/);

console.log('N5 2010–2011 INTEGRATION PASS: preserved 65 written responses; completed and registered 24 source-cross-checked listening responses with continuous audio and candidate-unverified timing metadata.');
