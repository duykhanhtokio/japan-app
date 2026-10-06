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
assert.deepEqual(manifest.settings, read('src/data/jlpt-original/voice-casting.json').settings);
assert.equal(audit.pauseSettingsChanged, false);
assert.equal(audit.dialogueReplayAdded, false);
assert.equal(audit.silencePaddingAdded, false);
assert.equal(audit.examplesAdded, 0);
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
assert.equal(manifest.matchesThirtyMinuteTarget, false);
assert.equal(master.audio.targetDurationMatched, false);
assert.equal(master.runtimeIntegrated, false);
assert.equal(master.releaseReady, false);
console.log(`N5 CONTENT TIMING PASS: 24 decoded item durations and rendered scripts/options match; scored ${total}ms, whole ${manifest.durationMs}ms; fixed 60000ms music. Full 30-minute target remains NOT MET (${audit.shortfallMs}ms short).`);
