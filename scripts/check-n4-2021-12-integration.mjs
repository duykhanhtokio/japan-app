import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const root = 'docs/jlpt-workspace/conversion/n4-2021-12';
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const payloadHash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

const manifest = readJson(`${root}/WORK_MANIFEST.json`);
const writtenAudit = readJson(`${root}/written.audit.json`);
const listeningAudit = readJson(`${root}/listening.audit.json`);
const written = readJson(`${root}/written.partial.json`);
const listening = readJson(`${root}/listening.partial.json`);
const registry = fs.readFileSync('src/data/jlpt-official/approved-n1-exams.ts', 'utf8');
const catalog = fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts', 'utf8');
const adapter = fs.readFileSync('src/data/jlpt-official/n4-2021-12-trial.ts', 'utf8');

assert.equal(manifest.examId, 'n4-2021-12-exam-09');
assert.deepEqual(manifest.counts, {
  writtenResponsesExpected: 57,
  writtenResponsesObserved: 57,
  missingWrittenResponses: 0,
  externallyRecoveredWrittenResponses: 1,
  listeningResponsesExpected: 28,
  listeningResponsesObserved: 28,
});
assert.equal(manifest.source.answerKeyPresent, false);
assert.equal(manifest.source.externalAnswerReconstructionPresent, true);
assert.equal(manifest.source.externalAnswerReconstructionOfficial, false);
assert.equal(manifest.timing.status, 'candidate_unverified');
assert.deepEqual(manifest.review, { humanReviewed: false, perceptualApproval: false, reviewDisposition: 'needs_later_review' });

assert.equal(written.questions.length, 57);
assert.equal(written.remainingWritten, 0);
assert.equal(written.status, 'candidate_unverified');
assert.equal(payloadHash(written.questions), 'f86ffa5bb46d3a80bd1c4bacf5d4809d7c37dd2a6a998b18a63fa02f4b83b696');
assert.equal(new Set(written.questions.map((question) => question.id)).size, 57);
for (const [index, question] of written.questions.entries()) {
  const audit = writtenAudit.records[index];
  assert.equal(question.id, `n4-2021-12-${audit.auditId}`);
  assert.equal(question.answer, Number(audit.correctOptionId));
  assert.equal(question.answerProvenance, 'external_reconstruction_unverified');
  assert.ok(question.prompt.trim());
  assert.equal(question.options.length, 4);
  assert.ok(question.options.every((option) => option.trim()));
}
const recovered = written.questions.filter((question) => question.contentProvenance === 'externally_recovered_not_in_supplied_scan');
assert.deepEqual(recovered.map((question) => question.id), ['n4-2021-12-vocabulary-p2-q5']);
assert.equal(recovered[0].prompt, 'わからない かんじを じしょで しらべる。');
assert.deepEqual(recovered[0].options, ['探べる', '知べる', '調べる', '研べる']);
assert.equal(recovered[0].answer, 3);

assert.equal(listening.questions.length, 28);
assert.equal(listening.remainingListening, 0);
assert.equal(listening.status, 'candidate_unverified');
assert.equal(payloadHash(listening.questions), '7df6b0df5b49cf4275408b2a943221f424940d3c93103917b86120734692cd43');
assert.equal(new Set(listening.questions.map((question) => question.id)).size, 28);
let previousEnd = 0;
for (const [index, question] of listening.questions.entries()) {
  const audit = listeningAudit.records[index];
  assert.equal(question.id, `n4-2021-12-${audit.auditId}`);
  assert.equal(question.answer, Number(audit.correctOptionId));
  assert.equal(question.answerProvenance, 'external_reconstruction_unverified_audio_cross_checked');
  assert.equal(question.candidateStartMs, audit.timingMs.start);
  assert.equal(question.candidateEndMs, audit.timingMs.end);
  assert.equal(question.timingVerificationStatus, 'candidate_unverified');
  assert.equal(question.humanReviewed, false);
  assert.equal(question.perceptualApproval, false);
  assert.equal(question.reviewDisposition, 'needs_later_review');
  assert.ok(question.candidateStartMs >= previousEnd);
  assert.ok(question.candidateEndMs > question.candidateStartMs);
  assert.ok(question.candidateEndMs <= 2327197);
  assert.equal(Math.round((question.candidateStartMs / 1000) * 1000), question.candidateStartMs);
  assert.equal(Math.round((question.candidateEndMs / 1000) * 1000), question.candidateEndMs);
  assert.ok(question.prompt.trim());
  assert.equal(question.options.length, audit.problemNumber <= 2 ? 4 : 3);
  assert.ok(question.options.every((option) => option.trim()));
  previousEnd = question.candidateEndMs;
}

assert.equal(sha256('assets/jlpt/n4/2021-12/audio/n4-2021-12.mp3'), '4f51258f5a87596d53847e5a983f9c7a016860eb8acbf603d7aa10144f4d6009');
const visualHashes = new Map([
  ['listening-p1-q2.jpg', '9507134ecc6f6cbfc78ec87e78ac6c0e3e3591aa42007b2bd3e2853a9ba5c168'],
  ['listening-p1-q3-q4.jpg', 'a262ab32b44bfa8adf22c382550925dad45ae956b608766bd2869071aedca7b9'],
  ['listening-p1-q6.jpg', '2a45eefa1ebd05f7639574515c67d2c6d325633646af6ceba4f467a036854278'],
  ['listening-p3-q1.jpg', '8b6f6db599a93c9a375cbcec9a22510675823e5d499d203df68116ad51d352a1'],
  ['listening-p3-q2-q3.jpg', '711a32bc2974a150e07a845ba0aaf32298a692bed3e7a828f5d3de785a30ae4c'],
  ['listening-p3-q4-q5.jpg', '68455b339924cf9a26bf8233992b19cfca2a662c51f6c388657258b130247d46'],
]);
for (const [file, expectedHash] of visualHashes) {
  assert.equal(sha256(`assets/jlpt/n4/2021-12/visual-options/${file}`), expectedHash);
}

assert.doesNotMatch(catalog, /'n4-2021-12'/);
assert.match(registry, /import \{ N4_2021_12_SESSION_KEY, N4_2021_12_TRIAL \}/);
assert.match(registry, /id: 'n4-2021-12-exam-09'/);
assert.match(registry, /audioSource: require\('\.\.\/\.\.\/\.\.\/assets\/jlpt\/n4\/2021-12\/audio\/n4-2021-12\.mp3'\)/);
assert.match(adapter, /segmentId: 'n4-2021-12-continuous'/);
assert.match(adapter, /endMs: 2327197/);

console.log('N4 2021-12 INTEGRATION PASS: 57 written and 28 listening responses registered; question 12 recovered independently; answers remain external/unverified and timing remains candidate_unverified.');
