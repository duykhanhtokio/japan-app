import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import ts from 'typescript';

const rebuild = spawnSync(process.execPath, ['scripts/build-n1-2015-12-structured.mjs', '--check'], { encoding: 'utf8' });
assert.equal(rebuild.status, 0, rebuild.stderr);
const data = JSON.parse(fs.readFileSync('src/data/jlpt-official/n1-2015-12/exam.candidate.json', 'utf8'));
const source = fs.readFileSync('src/data/jlpt-mock/n1-2015-12-official.ts', 'utf8');
const sourceKey = (name) => source.match(new RegExp(`${name} = \\[([\\s\\S]*?)\\]`))[1].match(/\d+/g).map(Number);
const written = data.questions.filter((q) => q.sectionId === 'written');
const listening = data.questions.filter((q) => q.sectionId === 'listening');

assert.equal(data.examId, 'n1-2015-12-exam-08');
assert.equal(data.status, 'candidate_complete');
assert.deepEqual(data.counts, { writtenResponses: 70, listeningResponses: 37, totalResponses: 107, uniqueAudioSegments: 36 });
assert.deepEqual(data.blockers, []);
assert.equal(data.questions.length, 107);
assert.equal(new Set(data.questions.map((q) => q.questionId)).size, 107);
assert.deepEqual(written.map((q) => Number(q.correctOptionId)), sourceKey('N1_2015_12_WRITTEN_KEY'));
assert.deepEqual(listening.map((q) => Number(q.correctOptionId)), sourceKey('N1_2015_12_LISTENING_KEY'));
assert.deepEqual([1, 2, 3, 4, 5].map((problem) => listening.filter((q) => q.problemNumber === problem).length), [6, 7, 6, 14, 4]);

for (const q of data.questions) {
  assert.ok(['vocabulary', 'grammar', 'sentenceComposition', 'reading', 'listening'].includes(q.family), q.questionId);
  assert.ok(q.promptJa && q.instructionJa, q.questionId);
  const count = q.family === 'listening' && q.problemNumber === 4 ? 3 : 4;
  assert.deepEqual(q.options.map((option) => option.optionId), Array.from({ length: count }, (_, index) => String(index + 1)), q.questionId);
  assert.ok(q.options.every((option) => typeof option.textJa === 'string' && option.textJa.trim()), q.questionId);
  assert.ok(q.options.some((option) => option.optionId === q.correctOptionId), q.questionId);
  if (q.passageId) assert.ok(data.passages[q.passageId]?.text, q.questionId);
  if (q.family === 'reading') assert.ok(q.passageId, q.questionId);
  if (q.audio) {
    assert.ok(q.audio.transcriptJa.length > 20, q.questionId);
    assert.ok(q.audio.transcriptSourcePages.length, q.questionId);
    assert.equal(q.verificationStatus, 'candidate_unverified', q.questionId);
    assert.equal(q.audio.timingVerificationStatus, 'candidate_unverified', q.questionId);
    assert.equal(q.audio.humanReviewed, false, q.questionId);
    assert.equal(q.audio.perceptualApproval, false, q.questionId);
    assert.equal(q.audio.reviewDisposition, 'needs_later_review', q.questionId);
    assert.equal(q.audio.sourceAudioSha256, data.source.audioSha256, q.questionId);
  }
}

const sha256 = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
for (const [file, hash] of Object.entries(data.source.assets)) assert.equal(sha256(file), hash, file);
const audioPath = 'assets/jlpt/n1/2015-12/audio/n1-2015-12.mp3';
assert.equal(sha256(audioPath), 'ae208c2d4d3000e5a7925ca56ea468e0933aec33470d65e29d248ac0a0b0a81e');
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
  const evidence = audio.timingEvidence.match(/boundaries (\d+\.\d+) s and (\d+\.\d+) s.*rounded to (\d+) ms and (\d+) ms/);
  assert.ok(evidence, `${audio.segmentId} lacks explicit seconds-to-milliseconds evidence`);
  assert.equal(Math.round(Number(evidence[1]) * 1000), audio.startMs, `${audio.segmentId} start seconds-to-ms conversion`);
  assert.equal(Math.round(Number(evidence[2]) * 1000), audio.endMs, `${audio.segmentId} end seconds-to-ms conversion`);
  assert.equal(Number(evidence[3]), audio.startMs, `${audio.segmentId} written start milliseconds`);
  assert.equal(Number(evidence[4]), audio.endMs, `${audio.segmentId} written end milliseconds`);
  const decoded = spawnSync('ffmpeg', ['-v', 'error', '-ss', String(audio.startMs / 1000), '-t', String((audio.endMs - audio.startMs) / 1000), '-i', audioPath, '-f', 'null', '-'], { encoding: 'utf8' });
  assert.equal(decoded.status, 0, `${audio.segmentId}: ${decoded.stderr}`);
}
const shared = listening.filter((q) => q.audio.segmentId === 'n1-2015-12-p5-q03');
assert.deepEqual(shared.map((q) => q.questionId), ['n1-2015-12-p5-q03-a', 'n1-2015-12-p5-q03-b']);
assert.deepEqual(shared.map((q) => q.correctOptionId), ['1', '4']);
assert.deepEqual(shared[0].audio, shared[1].audio);

const adapter = fs.readFileSync('src/data/jlpt-official/n1-2015-12-trial.ts', 'utf8');
const compiled = ts.transpileModule(adapter, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const adapterExports = {};
new Function('require', 'exports', compiled)((name) => {
  assert.equal(name, './n1-2015-12/exam.candidate.json');
  return data;
}, adapterExports);
assert.equal(adapterExports.N1_2015_12_SESSION_KEY, 'jlpt:n1:2015-12:exam-08:session:v1');
assert.equal(adapterExports.N1_2015_12_TRIAL.length, 107);
assert.notEqual(adapterExports.N1_2015_12_TRIAL[105].id, adapterExports.N1_2015_12_TRIAL[106].id);

const registry = fs.readFileSync('src/data/jlpt-official/approved-n1-exams.ts', 'utf8');
const catalog = fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts', 'utf8');
assert.ok(registry.includes("id: 'n1-2015-12-exam-08'"), 'Complete exam must be registered');
assert.ok(!catalog.match(/'n1-2015-12'[,\]]/), 'Complete exam must not remain pending');
console.log('N1 2015-12 INTEGRATION PASS: 70 written; 37 listening; 36 decoded candidate ranges; keys, hashes, IDs, adapter, registry, and seconds-to-milliseconds evidence validated.');
