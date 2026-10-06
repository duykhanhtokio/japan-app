import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const number = process.argv[2] || '01';
assert.match(number, /^0[1-6]$/);
const root = new URL('../', import.meta.url);
const read = p => JSON.parse(readFileSync(new URL(p, root)));
const sha = p => createHash('sha256').update(readFileSync(new URL(p, root))).digest('hex');
const base = `src/data/jlpt-original/n5/${number}/`;
const exam = read(base + 'master.ja.json');
const audio = read(base + 'audio.manifest.json');
const org = read(base + 'listening-organization.ja.json');
const casting = read('src/data/jlpt-original/voice-casting.json');
const settings = {...casting.settings, ...casting.levelPacing.n5}; delete settings.answerPauseSeconds;
assert.deepEqual(audio.settings, settings);
assert.equal(audio.masterSha256, sha(base + 'master.ja.json'));
assert.equal(audio.organizationSha256, sha(base + 'listening-organization.ja.json'));
assert.equal(audio.continuousSha256, sha(audio.continuousAudioPath));
assert.equal(audio.examplesCount, 4);
assert.equal(org.groups.length, 4);
assert.equal(new Set(org.groups.map(g => g.example.id)).size, 4);
function frames(p) {
 const pcm = execFileSync('ffmpeg', ['-v','error','-i',fileURLToPath(new URL(p, root)), '-f','s16le','-ar','24000','-ac','1','-'], {maxBuffer:128*1024*1024});
 assert.equal(pcm.length % 2, 0); return pcm.length/2;
}
let previousEnd = 0;
for (const item of audio.items) {
 const q = exam.questions.find(q => q.id === item.questionId); assert.ok(q);
 assert.equal(item.sha256, sha(item.path));
 assert.ok(Math.abs(Math.round(frames(item.path)/24) - item.durationMs) <= 1, q.id + ': decoded length');
 assert.deepEqual(item.turns.slice(0,q.script.length).map(t => [t.actor,t.text]), q.script, q.id + ': script');
 assert.ok(item.turns.every(t => Object.hasOwn(casting.roles, t.role)));
 if (q.group >= 3) assert.deepEqual(item.turns.filter(t => t.actor.startsWith('option-')).map(t => [t.actor.slice(7),t.text]), q.options.map(o => [o.id,o.text]));
 if (q.optionVoiceRole) assert.ok(item.turns.filter(t => t.actor.startsWith('option-')).every(t => t.role === q.optionVoiceRole), q.id + ': requested option speaker role');
 assert.ok(item.startMs >= previousEnd && item.endMs <= audio.durationMs);
 previousEnd = item.endMs;
 assert.equal(item.playbackReviewed, false);
}
assert.equal(audio.items.length, 24);
assert.equal(Math.round(frames(audio.continuousAudioPath)/24), audio.durationMs);
assert.equal(frames(audio.break.path), 1440000);
assert.equal(audio.break.musicDurationMs,60000);
assert.equal(audio.break.musicEndMs - audio.break.musicStartMs,60000);
assert.equal(audio.break.afterProblem,2); assert.equal(audio.break.beforeProblem,3);
assert.ok(audio.items.filter(q => q.group === 2).at(-1).endMs <= audio.break.announcementStartMs);
assert.ok(audio.break.resumeAnnouncementEndMs <= audio.orientationSegments.find(s => s.problem === 3).startMs);
for (const group of org.groups) {
 const e = group.example; assert.equal(e.scored,false);
 assert.equal(e.options.length, group.problem <= 2 ? 4 : 3);
 assert.equal(e.options.filter(o => o.id === e.correctOptionId).length,1);
 const orientation = audio.orientationSegments.find(s => s.problem === group.problem);
 assert.equal(orientation.exampleId,e.id); assert.equal(orientation.scored,false);
 assert.ok(orientation.exampleStartMs < orientation.exampleEndMs && orientation.exampleEndMs <= orientation.endMs);
 assert.ok(orientation.endMs <= audio.items.find(s => s.group === group.problem).startMs);
}
for (const flag of ['publisherReviewed','nativeReviewCompleted','perceptualApproval','rightsReleaseReviewCompleted']) assert.equal(audio[flag],false);
assert.equal(exam.releaseReady,false);
console.log(`N5 ${number} AUDIO PASS: 24 decoded recordings, scripts/spoken choices, four ungraded examples, complete track ${audio.durationMs}ms and exact 60000ms music. No perceptual/native/release claim.`);
