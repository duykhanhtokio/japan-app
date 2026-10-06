import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const read = path => JSON.parse(readFileSync(new URL(path, root)));
const master = read('src/data/jlpt-original/n5/01/master.ja.json');
const manifest = read('src/data/jlpt-original/n5/01/audio.manifest.json');
const audit = read('docs/jlpt-workspace/original/n5-01/listening-duration-audit.json');
function frames(path) {
  const decoded = execFileSync('ffmpeg', ['-v','error','-i',fileURLToPath(new URL(path, root)), '-f','s16le','-ar','24000','-ac','1','-'], {maxBuffer: 128 * 1024 * 1024});
  assert.equal(decoded.length % 2, 0);
  return decoded.length / 2;
}
assert.equal(manifest.settings.speedScale, 0.9);
const casting = read('src/data/jlpt-original/voice-casting.json');
const effective = {...casting.settings, ...casting.levelPacing.n5}; delete effective.answerPauseSeconds;
assert.deepEqual(manifest.settings, effective);
assert.equal(effective.status, 'publisher_approved');
assert.equal(audit.pauseSettingsChanged, true);
assert.equal(audit.pacingPublisherApproved, true);
assert.equal(audit.dialogueReplayAdded, false);
assert.equal(audit.silencePaddingAdded, false);
assert.equal(audit.examplesAdded, 4);
const organization = read('src/data/jlpt-original/n5/01/listening-organization.ja.json');
assert.equal(new Set(organization.groups.map(g => g.example.id)).size, 4);
assert.equal(manifest.orientationSegments.filter(s => s.exampleCount === 1 && s.scored === false).length, 4);
for(const group of organization.groups) {
  const e = group.example; assert.equal(e.scored, false);
  assert.equal(e.options.length, group.problem <= 2 ? 4 : 3);
  assert.equal(e.options.filter(o => o.id === e.correctOptionId).length, 1);
  assert.ok(e.answerExplanationJa.length > 0);
}
for(const group of [1,2,3,4]) {
 const orientation = manifest.orientationSegments.find(s => s.problem === group);
 const first = manifest.items.find(s => s.group === group);
 assert.ok(orientation.exampleStartMs < orientation.exampleEndMs);
 assert.ok(orientation.exampleEndMs <= orientation.endMs && orientation.endMs <= first.startMs);
}
assert.ok(manifest.items.filter(s => s.group === 2).at(-1).endMs <= manifest.break.announcementStartMs);
assert.ok(manifest.break.resumeAnnouncementEndMs <= manifest.orientationSegments.find(s => s.problem === 3).startMs);
assert.equal(audit.publisherFinalDurationToleranceMs, null);
assert.equal(audit.rows.length, 24);
let total = 0;
for (const item of manifest.items) {
  const q = master.questions.find(q => q.id === item.questionId);
  const row = audit.rows.find(row => row.questionId === item.questionId);
  assert.ok(q && row);
  const durationMs = Math.round(frames(item.path) / 24);
  assert.ok(Math.abs(durationMs - item.durationMs) <= 1, `${q.id}: decoded duration`);
  assert.equal(row.actualMs, item.durationMs);
  assert.ok(Math.abs(row.actualMs - row.baselineMs - row.approvedPacingIncreaseMs) <= 1);
  assert.equal(q.timingBudget.actualDurationMs, item.durationMs);
  assert.deepEqual(item.turns.slice(0, q.script.length).map(t => [t.actor,t.text]), q.script);
  if (q.group >= 3) assert.deepEqual(item.turns.filter(t => t.actor.startsWith('option-')).map(t => [t.actor.slice(7),t.text]), q.options.map(o => [o.id,o.text]));
  total += item.durationMs;
}
assert.equal(total, audit.scoredActualMs);
assert.equal(Math.round(frames(manifest.continuousAudioPath) / 24), manifest.durationMs);
assert.equal(frames(manifest.break.path), 1440000);
assert.equal(manifest.break.musicEndMs - manifest.break.musicStartMs, 60000);
assert.equal(audit.shortfallMs, 1800000 - manifest.durationMs);
assert.equal(manifest.matchesThirtyMinuteTarget, true);
assert.ok(manifest.targetMatchAssessment.includes("approximately"));
assert.equal(manifest.targetDeviationMs, manifest.durationMs - 1800000);
assert.equal(master.audio.targetDurationMatched, true);
assert.equal(master.runtimeIntegrated, true);
assert.equal(master.releaseReady, false);
console.log(`N5 CONTENT TIMING PASS: 24 decoded item durations and rendered scripts/options match; scored ${total}ms, whole ${manifest.durationMs}ms; fixed 60000ms music. Measured approximately 30 minutes; nominal-target deviation ${manifest.targetDeviationMs}ms, no fixed publisher tolerance.`);
