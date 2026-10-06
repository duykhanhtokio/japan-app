import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const bytes = readFileSync(new URL('src/data/jlpt-original/n5/01/master.ja.json', root));
const exam = JSON.parse(bytes);
const qa = JSON.parse(readFileSync(new URL('docs/jlpt-workspace/original/n5-01/qa.json', root)));
const expected = {
  'vocabulary:1': 12, 'vocabulary:2': 8, 'vocabulary:3': 10, 'vocabulary:4': 5,
  'grammar_reading:1': 16, 'grammar_reading:2': 5, 'grammar_reading:3': 5,
  'grammar_reading:4': 3, 'grammar_reading:5': 2, 'grammar_reading:6': 1,
  'listening:1': 7, 'listening:2': 6, 'listening:3': 5, 'listening:4': 6,
};
assert.equal(exam.examId, 'jpapp-n5-original-01-v1');
assert.equal(exam.questions.length, 91);
assert.equal(new Set(exam.questions.map(q => q.id)).size, 91);
assert.equal(exam.releaseReady, false);
assert.equal(exam.runtimeIntegrated, true);
assert.equal(exam.publisherReviewed, false);
assert.equal(exam.reviewedByNativeSpeaker, false);
const generatedAudio = exam.audio.status === 'generated_ai_unreviewed';
assert.ok(generatedAudio || ['not_generated','pending_regeneration_after_option_changes'].includes(exam.audio.status));
assert.equal(exam.audio.actualDurationVerified, generatedAudio);
let audioManifest;
if (generatedAudio) {
  audioManifest = JSON.parse(readFileSync(new URL('src/data/jlpt-original/n5/01/audio.manifest.json', root)));
  assert.equal(audioManifest.examId, exam.examId);
  assert.equal(audioManifest.masterSha256, createHash('sha256').update(bytes).digest('hex'));
  assert.equal(audioManifest.items.length, 24);
  assert.equal(audioManifest.perceptualApproval, false);
  assert.equal(audioManifest.nativeReviewCompleted, false);
  assert.equal(audioManifest.rightsReleaseReviewCompleted, false);
  assert.equal(audioManifest.durationMeasuredFromPcm, true);
  assert.equal(audioManifest.settings.speedScale, 0.9);
  assert.equal(audioManifest.settings.afterIntroSeconds * 1000, 2000);
  assert.equal(audioManifest.settings.betweenTurnsSeconds * 1000, 500);
  assert.deepEqual(audioManifest.settings.answerPauseSecondsByProblem, {'1':12,'2':12,'3':10,'4':8});
  assert.equal(audioManifest.examplesCount, 4);
  const continuous = readFileSync(new URL(audioManifest.continuousAudioPath, root));
  assert.equal(createHash('sha256').update(continuous).digest('hex'), audioManifest.continuousSha256);
}
assert.equal(exam.audio.rightsVerified, false);
assert.deepEqual(exam.sectionTimeMinutes, {vocabulary: 20, grammar_reading: 40, listening: 30});
assert.equal(qa.masterSha256, createHash('sha256').update(bytes).digest('hex'));

const counts = {};
const seen = {};
let scripts = 0, illustrationBriefs = 0;
for (const q of exam.questions) {
  const key = `${q.section}:${q.group}`;
  counts[key] = (counts[key] ?? 0) + 1;
  assert.equal(q.number, counts[key], `${q.id}: sequential numbering`);
  assert.ok(q.id.startsWith(exam.examId + '-'));
  assert.ok(q.prompt.trim());
  assert.ok(q.learningObjective.trim());
  const n = q.section === 'listening' && q.group >= 3 ? 3 : 4;
  assert.equal(q.options.length, n, `${q.id}: choice cardinality`);
  assert.equal(new Set(q.options.map(o => o.text)).size, n, `${q.id}: duplicated options`);
  assert.deepEqual(q.options.map(o => o.id), Array.from({length: n}, (_, i) => String(i + 1)));
  assert.equal(q.options.filter(o => o.id === q.correctOptionId).length, 1);
  q.options.forEach(o => assert.ok(o.text.trim() && o.rationale.trim(), `${q.id}: empty option/rationale`));
  if (q.passageId) {
    assert.ok(exam.passages[q.passageId]?.trim(), `${q.id}: missing passage`);
    seen[q.passageId] = true;
  }
  if (q.section === 'grammar_reading' && q.group === 2) {
    assert.equal(q.slots, 4);
    assert.deepEqual([...q.solutionOrder].sort(), [1, 2, 3, 4]);
    assert.ok(q.starSlot >= 1 && q.starSlot <= 4);
    assert.equal(String(q.solutionOrder[q.starSlot - 1]), q.correctOptionId);
    assert.equal(q.completedSentence, q.prefix + q.solutionOrder.map(i => q.options[i-1].text).join('') + q.suffix);
  }
  if (q.section === 'listening') {
    scripts++;
    assert.ok(q.script.length >= 1);
    q.script.forEach(turn => assert.ok(turn.length === 2 && turn[0].trim() && turn[1].trim()));
    assert.equal(q.audioStatus, generatedAudio ? 'generated_ai_unreviewed' : 'not_generated');
    if (generatedAudio) {
      const item = audioManifest.items.find(item => item.questionId === q.id);
      assert.ok(item, `${q.id}: missing recording`);
      assert.equal(item.group, q.group);
      assert.equal(item.number, q.number);
      assert.ok(item.startMs >= 0 && item.endMs > item.startMs && item.endMs <= audioManifest.durationMs);
      assert.ok(Math.abs(item.endMs - item.startMs - item.durationMs) <= 1);
      assert.equal(item.playbackReviewed, false);
      const audio = readFileSync(new URL(item.path, root));
      assert.equal(createHash('sha256').update(audio).digest('hex'), item.sha256);
      if (q.group >= 3) assert.equal(item.turns.filter(turn => turn.actor.startsWith('option-')).length, 3);
      const voices = JSON.parse(readFileSync(new URL('src/data/jlpt-original/voice-casting.json', root)));
      assert.ok(item.turns.every(turn => Object.hasOwn(voices.roles, turn.role)));
    }
    assert.equal(q.playbackReviewed, false);
    if (q.group >= 3) assert.equal(q.spokenOptions, true);
    if (q.group === 3) {
      assert.ok(q.visualBrief.trim());
      illustrationBriefs++;
    }
  }
}
assert.deepEqual(counts, expected);
assert.equal(scripts, 24);
assert.equal(illustrationBriefs, 5);
assert.deepEqual(Object.keys(seen).sort(), Object.keys(exam.passages).sort());
for (let i = 0; i < 3; i++) {
  const positions = exam.questions.filter(q => q.section === ['vocabulary','grammar_reading','listening'][i]);
  for (let j = 2; j < positions.length; j++) {
    assert.ok(!(positions[j].correctOptionId === positions[j-1].correctOptionId && positions[j].correctOptionId === positions[j-2].correctOptionId), 'Three repeated answer positions');
  }
}
console.log('N5 ORIGINAL PILOT STRUCTURE PASS: 91 unique items, approved group/choice counts, complete passage links and answer keys, 24 scripts, 5 illustration briefs. Academic, perceptual audio, rights and publisher approval remain pending.');

const allPositions = exam.questions.map(q => q.correctOptionId);
for (let i = 2; i < allPositions.length; i++) assert.ok(!(allPositions[i] === allPositions[i-1] && allPositions[i] === allPositions[i-2]), 'Full-exam triple repeat');
for (let period = 2; period <= 4; period++) for (let i = 0; i + period * 3 <= allPositions.length; i++) {
 const cell = allPositions.slice(i, i + period).join('');
 assert.notEqual(allPositions.slice(i, i + period * 3).join(''), cell.repeat(3), `Predictable period ${period} at ${i}`);
}
for (const cardinality of [3,4]) {
 const counts = Array.from({length:cardinality}, (_, i) => exam.questions.filter(q => q.options.length === cardinality && q.correctOptionId === String(i+1)).length);
 assert.ok(Math.max(...counts)-Math.min(...counts) <= 1, 'Unbalanced whole-exam option pool');
}
const illustrations = JSON.parse(readFileSync(new URL('src/data/jlpt-original/n5/01/images.manifest.json', root)));
assert.equal(illustrations.items.length, 5);
for (const item of illustrations.items) {
 assert.equal(createHash('sha256').update(readFileSync(new URL(item.path, root))).digest('hex'), item.sha256);
 assert.equal(exam.questions.find(q => q.id === item.questionId).illustrationPath, item.path);
}
if (generatedAudio) {
 assert.equal(audioManifest.break.afterProblem,2); assert.equal(audioManifest.break.beforeProblem,3);
 assert.equal(audioManifest.break.musicDurationMs,60000);
 assert.equal(audioManifest.break.musicEndMs-audioManifest.break.musicStartMs,60000);
 assert.equal(audioManifest.break.musicPcmFrames,1440000);
 assert.ok(audioManifest.items.filter(q=>q.group===2).every(q=>q.endMs<=audioManifest.break.announcementStartMs));
 assert.ok(audioManifest.items.filter(q=>q.group===3).every(q=>q.startMs>=audioManifest.break.resumeAnnouncementEndMs));
}
console.log('N5 AUTHORING ADVANCE PASS: balanced pools, no short repeated cycles, 5 mapped image hashes; fixed musical break when audio regenerated. Full-duration integration remains a separate check.');
