import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const built = spawnSync(process.execPath, ['scripts/build-n1-2014-12-structured.mjs', '--check'], { encoding: 'utf8' });
assert.equal(built.status, 0, built.stderr);
const data = JSON.parse(fs.readFileSync('src/data/jlpt-official/n1-2014-12/exam.candidate.json', 'utf8'));
const written = data.questions.filter((question) => question.sectionId === 'written');
const listening = data.questions.filter((question) => question.sectionId === 'listening');
assert.equal(data.examId, 'n1-2014-12-exam-06');
assert.equal(data.status, 'candidate_complete');
assert.deepEqual(data.counts, { writtenResponses: 70, listeningResponses: 37, totalResponses: 107, uniqueAudioSegments: 36 });
assert.equal(written.length, 70); assert.equal(listening.length, 37);
assert.equal(new Set(data.questions.map((question) => question.questionId)).size, 107);
assert.ok(written.filter((question) => question.family === 'reading').every((question) => data.passages[question.passageId]?.text));
for (const question of listening) {
  assert.ok(question.audio.endMs > question.audio.startMs && question.audio.endMs <= 2913140);
  assert.equal(question.audio.timingVerificationStatus, 'candidate_unverified');
  assert.equal(question.audio.humanReviewed, false); assert.equal(question.audio.perceptualApproval, false);
  assert.equal(question.audio.reviewDisposition, 'needs_later_review');
}
assert.equal(new Set(listening.map((question) => question.audio.segmentId)).size, 36);
const registry = fs.readFileSync('src/data/jlpt-official/approved-n1-exams.ts', 'utf8');
const catalog = fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts', 'utf8');
assert.ok(registry.includes("id: 'n1-2014-12-exam-06'"));
assert.ok(!catalog.includes("'n1-2014-12'"));
console.log('N1 2014-12 INTEGRATION PASS: 70 written; 37 listening; 36 candidate segments; passages, IDs, ranges and status validated.');
