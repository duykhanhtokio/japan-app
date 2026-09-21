import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const rebuild = spawnSync(process.execPath, ['scripts/build-n1-2015-07-structured.mjs', '--check'], { encoding: 'utf8' });
assert.equal(rebuild.status, 0, rebuild.stderr);
const data = JSON.parse(fs.readFileSync('src/data/jlpt-official/n1-2015-07/exam.candidate.json', 'utf8'));
const source = fs.readFileSync('src/data/jlpt-mock/n1-2015-07-official.ts', 'utf8');
const sourceKey = (name) => source.match(new RegExp(`${name} = \\[([\\s\\S]*?)\\]`))[1].match(/\d+/g).map(Number);
const written = data.questions.filter((q) => q.sectionId === 'written');
const listening = data.questions.filter((q) => q.sectionId === 'listening');
assert.equal(data.examId, 'n1-2015-07-exam-07');
assert.equal(data.status, 'candidate_complete');
assert.deepEqual(data.counts, { writtenResponses: 70, listeningResponses: 37, totalResponses: 107, uniqueAudioSegments: 36 });
assert.deepEqual(data.blockers, []);
assert.equal(data.questions.length, 107);
assert.equal(new Set(data.questions.map((q) => q.questionId)).size, 107);
assert.equal(written.length, 70);
assert.equal(listening.length, 37);
assert.deepEqual(written.map((q) => q.questionNumber), Array.from({ length: 70 }, (_, i) => i + 1));
const writtenKey = sourceKey('WRITTEN_KEY');
for (const q of written) assert.equal(Number(q.correctOptionId), writtenKey[q.questionNumber - 1], q.questionId);
assert.deepEqual(listening.map((q) => Number(q.correctOptionId)), sourceKey('LISTENING_KEY'));
assert.deepEqual([1, 2, 3, 4, 5].map((p) => listening.filter((q) => q.problemNumber === p).length), [6, 7, 6, 14, 4]);
for (const q of data.questions) {
  assert.ok(['vocabulary', 'grammar', 'sentenceComposition', 'reading', 'listening'].includes(q.family), q.questionId);
  assert.ok(q.promptJa && q.instructionJa, q.questionId);
  const count = q.family === 'listening' && q.problemNumber === 4 ? 3 : 4;
  assert.deepEqual(q.options.map((o) => o.optionId), Array.from({ length: count }, (_, i) => String(i + 1)), q.questionId);
  assert.ok(q.options.every((o) => typeof o.textJa === 'string' && o.textJa.trim()), q.questionId);
  assert.ok(q.options.some((o) => o.optionId === q.correctOptionId), q.questionId);
  if (q.passageId) assert.ok(data.passages[q.passageId]?.text, q.questionId);
  if (q.family === 'reading') assert.ok(q.passageId, q.questionId);
  if (q.family === 'sentenceComposition') assert.equal((q.promptJa.match(/★/g) ?? []).length, 1, q.questionId);
  if (q.audio) {
    assert.ok(q.audio.transcriptJa.length > 20, q.questionId);
    assert.ok(q.audio.transcriptSourcePages.length, q.questionId);
    assert.equal(q.verificationStatus, 'candidate_unverified', q.questionId);
    assert.equal(q.audio.timingVerificationStatus, 'candidate_unverified', q.questionId);
    assert.equal(q.audio.humanReviewed, false, q.questionId);
    assert.equal(q.audio.perceptualApproval, false, q.questionId);
    assert.equal(q.audio.reviewDisposition, 'needs_later_review', q.questionId);
    assert.equal(q.audio.sourceAudioSha256, data.source.audioSha256, q.questionId);
    assert.match(q.audio.timingEvidence, /Candidate only|Candidate\/unverified/i, q.questionId);
  }
}

const sha256 = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
assert.equal(Object.keys(data.source.assets).length, 28);
for (const [file, hash] of Object.entries(data.source.assets)) assert.equal(sha256(file), hash, file);
const audioPath = 'assets/jlpt/n1/2015-07/audio/n1-2015-07.mp3';
assert.equal(sha256(audioPath), '37bb9bc85dba19522939e546b8d964bbd3f840160ec99f129a8154ebc11fb6a2');
const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', audioPath], { encoding: 'utf8' });
assert.equal(probe.status, 0, probe.stderr);
const durationSeconds = Number(probe.stdout.trim());
const durationMs = durationSeconds * 1000;
assert.ok(Number.isFinite(durationSeconds) && durationSeconds > 0);
const segments = [...new Map(listening.map((q) => [q.audio.segmentId, q.audio])).values()];
assert.equal(segments.length, 36);
for (const [index, audio] of segments.entries()) {
  assert.ok(Number.isInteger(audio.startMs) && Number.isInteger(audio.endMs), audio.segmentId);
  assert.ok(audio.startMs >= 0 && audio.endMs > audio.startMs && audio.endMs <= durationMs, audio.segmentId);
  if (index) assert.ok(segments[index - 1].endMs <= audio.startMs, `Overlapping independent segments: ${audio.segmentId}`);
  const conversionEvidence = audio.timingEvidence.match(/boundaries (\d+\.\d+) s and (\d+\.\d+) s/);
  if (conversionEvidence) {
    assert.equal(Math.round(Number(conversionEvidence[1]) * 1000), audio.startMs, `${audio.segmentId} start seconds-to-ms conversion`);
    assert.equal(Math.round(Number(conversionEvidence[2]) * 1000), audio.endMs, `${audio.segmentId} end seconds-to-ms conversion`);
  }
  const decoded = spawnSync('ffmpeg', ['-v', 'error', '-ss', String(audio.startMs / 1000), '-t', String((audio.endMs - audio.startMs) / 1000), '-i', audioPath, '-f', 'null', '-'], { encoding: 'utf8' });
  assert.equal(decoded.status, 0, `${audio.segmentId}: ${decoded.stderr}`);
}
const shared = listening.filter((q) => q.audio.segmentId === 'n1-2015-07-p5-q03');
assert.deepEqual(shared.map((q) => q.questionId), ['n1-2015-07-p5-q03-a', 'n1-2015-07-p5-q03-b']);
assert.deepEqual(shared.map((q) => q.correctOptionId), ['1', '4']);
assert.deepEqual(shared[0].audio, shared[1].audio);
assert.equal(shared[0].audio.endMs, 3112155, 'Closing announcement must remain excluded after 3112.155329 seconds');
assert.equal(Math.round(3112.155329 * 1000), shared[0].audio.endMs, 'Closing boundary seconds-to-ms conversion');

const adapter = fs.readFileSync('src/data/jlpt-official/n1-2015-07-trial.ts', 'utf8');
assert.match(adapter, /N1_2015_07_SESSION_KEY\s*=\s*'jlpt:n1:2015-07:exam-07:session:v1'/);
assert.match(adapter, /DATASET\.questions\.map/);
assert.match(adapter, /N1_2015_07_TRIAL\.length\s*!==\s*107/);
assert.match(adapter, /family\s*!==\s*'listening'\)\.length\s*!==\s*70/);
assert.match(adapter, /family\s*===\s*'listening'\)\.length\s*!==\s*37/);
assert.ok(data.questions.some((q) => q.questionId === 'n1-2015-07-written-q29'));
assert.match(adapter, /passageJa:/);

const registry = fs.readFileSync('src/data/jlpt-official/approved-n1-exams.ts', 'utf8');
const catalog = fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts', 'utf8');
assert.ok(registry.includes("id: 'n1-2015-07-exam-07'"), 'Complete candidate must be registered');
assert.ok(!catalog.includes("'n1-2015-07'"), 'Complete candidate must not remain pending');
console.log(`N1 2015-07 INTEGRATION PASS: 70 written; 37 listening; 36 decoded candidate ranges; source hashes, keys, IDs, adapter, and seconds-to-ms evidence validated.`);
