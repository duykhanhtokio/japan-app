import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import ts from 'typescript';

const data = JSON.parse(fs.readFileSync('src/data/jlpt-official/n1-2013-12/exam.candidate.json', 'utf8'));
const reviewDir = 'docs/jlpt-workspace/conversion/n1-2013-12';
const approval = JSON.parse(fs.readFileSync(`${reviewDir}/runtime-review/approval.json`, 'utf8'));
assert.equal(approval.status, 'approved_by_user');
assert.deepEqual(Object.fromEntries(fs.readdirSync(reviewDir).filter((name) => /\.review\.json$/.test(name)).sort()
  .map((name) => [name, createHash('sha256').update(fs.readFileSync(`${reviewDir}/${name}`)).digest('hex')])), approval.reviewInputsSha256);
const source = fs.readFileSync('src/data/jlpt-mock/n1-2013-12-official.ts', 'utf8');
const sourceKey = (name) => source.match(new RegExp(`${name} = \\[([\\s\\S]*?)\\]`))[1].match(/\d+/g).map(Number);
const written = data.questions.filter((q) => q.sectionId === 'written');
const listening = data.questions.filter((q) => q.sectionId === 'listening');
assert.equal(data.examId, 'n1-2013-12-exam-04');
assert.equal(data.questions.length, 106);
assert.equal(new Set(data.questions.map((q) => q.questionId)).size, 106);
assert.equal(written.length, 70);
assert.equal(listening.length, 36);
assert.deepEqual(written.map((q) => q.questionNumber), Array.from({ length: 70 }, (_, i) => i + 1));
assert.deepEqual(written.map((q) => Number(q.correctOptionId)), sourceKey('WRITTEN_KEY'));
assert.deepEqual(listening.map((q) => Number(q.correctOptionId)), sourceKey('LISTENING_KEY'));
assert.deepEqual([1, 2, 3, 4, 5].map((p) => listening.filter((q) => q.problemNumber === p).length), [6, 7, 5, 14, 4]);
for (const q of data.questions) {
  assert.ok(['vocabulary', 'grammar', 'sentenceComposition', 'reading', 'listening'].includes(q.family), q.questionId);
  assert.ok(q.promptJa && q.instructionJa, q.questionId);
  const count = q.family === 'listening' && q.problemNumber === 4 ? 3 : 4;
  assert.deepEqual(q.options.map((o) => o.optionId), Array.from({ length: count }, (_, i) => String(i + 1)), q.questionId);
  assert.ok(q.options.every((o) => typeof o.textJa === 'string' && o.textJa.trim()), q.questionId);
  assert.ok(q.options.some((o) => o.optionId === q.correctOptionId), q.questionId);
  if (q.passageId) assert.ok(data.passages[q.passageId]?.text, q.questionId);
  if (q.family === 'reading' || (q.sectionId === 'written' && q.problemNumber === 7)) assert.ok(q.passageId, q.questionId);
  if (q.family === 'sentenceComposition') assert.equal((q.promptJa.match(/★/g) ?? []).length, 1, q.questionId);
  if (q.audio) {
    assert.ok(q.audio.transcriptJa.length > 20, q.questionId);
    assert.ok(q.audio.transcriptSourcePages.length, q.questionId);
  }
}
const sha256 = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
assert.equal(Object.keys(data.source.assets).length, 28);
for (const [file, hash] of Object.entries(data.source.assets)) assert.equal(sha256(file), hash, file);
const audioPath = 'assets/jlpt/n1/2013-12/audio/n1-2013-12.mp3';
assert.equal(sha256(audioPath), 'ff577435f993cbf20c85d83b8851e4059a423412b91c027d4801103508a0835b');
const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', audioPath], { encoding: 'utf8' });
assert.equal(probe.status, 0, probe.stderr);
const durationMs = Number(probe.stdout.trim()) * 1000;
const segments = [...new Map(listening.map((q) => [q.audio.segmentId, q.audio])).values()];
assert.equal(segments.length, 35);
for (const [i, audio] of segments.entries()) {
  assert.ok(audio.startMs >= 0 && audio.endMs > audio.startMs && audio.endMs <= durationMs, audio.segmentId);
  if (i) assert.ok(segments[i - 1].endMs <= audio.startMs, `Overlapping independent segments: ${audio.segmentId}`);
  const decoded = spawnSync('ffmpeg', ['-v', 'error', '-ss', String(audio.startMs / 1000), '-t', String((audio.endMs - audio.startMs) / 1000), '-i', audioPath, '-f', 'null', '-'], { encoding: 'utf8' });
  assert.equal(decoded.status, 0, `${audio.segmentId}: ${decoded.stderr}`);
}
const shared = listening.filter((q) => q.audio.segmentId === 'n1-2013-12-p5-q03');
assert.deepEqual(shared.map((q) => q.questionId), ['n1-2013-12-p5-q03-a', 'n1-2013-12-p5-q03-b']);
assert.deepEqual(shared.map((q) => q.correctOptionId), ['1', '3']);
assert.deepEqual(shared[0].audio, shared[1].audio);

// Exercise the adapter, including family mapping and independent shared-audio IDs.
const adapter = fs.readFileSync('src/data/jlpt-official/n1-2013-12-trial.ts', 'utf8');
const compiled = ts.transpileModule(adapter, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const adapterExports = {};
new Function('require', 'exports', compiled)((name) => {
  assert.equal(name, './n1-2013-12/exam.candidate.json');
  return data;
}, adapterExports);
assert.equal(adapterExports.N1_2013_12_SESSION_KEY, 'jlpt:n1:2013-12:exam-04:session:v1');
const runtime = adapterExports.N1_2013_12_TRIAL;
assert.equal(runtime.length, 106);
assert.equal(runtime[35].family, 'sentenceComposition');
assert.equal(runtime[45].family, 'reading');
assert.notEqual(runtime[104].id, runtime[105].id);
assert.notEqual(runtime[104].label, runtime[105].label);
assert.ok(runtime.filter((q) => q.family === 'reading').every((q) => q.passageJa));

const registry = fs.readFileSync('src/data/jlpt-official/approved-n1-exams.ts', 'utf8');
const catalog = fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts', 'utf8');
const registered = registry.includes("id: 'n1-2013-12-exam-04'");
if (registered) {
  assert.equal((registry.match(/questions: N1_2013_12_TRIAL/g) ?? []).length, 1);
  assert.ok(!catalog.includes("'n1-2013-12'"), 'Registered exam must replace its pending entry');
} else {
  assert.ok(catalog.includes("'n1-2013-12'"), 'Unregistered candidate must remain visible as pending');
}
if (process.argv.includes('--require-registered')) assert.ok(registered, 'Candidate not registered');
if (process.argv.includes('--require-ready')) {
  assert.equal(data.status, 'structured_ready', 'Simulator and listening review required');
  for (const audio of segments) assert.equal(audio.timingVerificationStatus, 'verified');
}
const ui = fs.readFileSync('src/components/jlpt/N1OfficialTrial.tsx', 'utf8');
assert.match(ui, /\{submitted \? <><JlptReviewFeedback/);
assert.match(ui, /showTranscript && question\.audio\?\.transcriptJa/);
assert.doesNotMatch(ui, /submitted=\{false\}[^\n]*showTranscript=\{true\}/);
console.log(`N1 2013-12 INTEGRATION PASS: 70 written; 36 listening; 35 decoded ranges; source hashes and keys match; adapter exercised; registered=${registered}; status=${data.status}.`);
