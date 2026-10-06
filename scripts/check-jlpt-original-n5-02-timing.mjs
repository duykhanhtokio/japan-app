import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const read=p=>JSON.parse(readFileSync(new URL(p,root)));
const master=read('src/data/jlpt-original/n5/02/master.ja.json');
const audio=read('src/data/jlpt-original/n5/02/audio.manifest.json');
const org=read('src/data/jlpt-original/n5/02/listening-organization.ja.json');
function frames(p){return execFileSync('ffmpeg',['-v','error','-i',fileURLToPath(new URL(p,root)),'-f','s16le','-ar','24000','-ac','1','-'],{maxBuffer:128*1024*1024}).length/2;}
assert.equal(audio.items.length,24);assert.equal(audio.settings.speedScale,.9);
assert.equal(audio.settings.afterIntroSeconds*1000,2000);assert.equal(audio.settings.betweenTurnsSeconds*1000,500);
assert.deepEqual(audio.settings.answerPauseSecondsByProblem,{'1':12,'2':12,'3':10,'4':8});
assert.equal(audio.examplesCount,4);assert.equal(org.groups.length,4);
assert.equal(new Set(org.groups.map(g=>g.example.id)).size,4);
for(const g of org.groups){assert.equal(g.example.scored,false);assert.equal(g.example.options.length,g.problem<=2?4:3);assert.equal(g.example.options.filter(o=>o.id===g.example.correctOptionId).length,1);const o=audio.orientationSegments.find(s=>s.problem===g.problem);assert.ok(o.exampleStartMs<o.exampleEndMs&&o.exampleEndMs<=o.endMs&&o.endMs<=audio.items.find(s=>s.group===g.problem).startMs);}
for(const s of audio.items){const q=master.questions.find(q=>q.id===s.questionId);assert.ok(q);assert.ok(Math.abs(Math.round(frames(s.path)/24)-s.durationMs)<=1);assert.deepEqual(s.turns.slice(0,q.script.length).map(t=>[t.actor,t.text]),q.script);if(q.group>=3)assert.deepEqual(s.turns.filter(t=>t.actor.startsWith('option-')).map(t=>[t.actor.slice(7),t.text]),q.options.map(o=>[o.id,o.text]));}
assert.equal(Math.round(frames(audio.continuousAudioPath)/24),audio.durationMs);
assert.equal(frames(audio.break.path),1440000);assert.equal(audio.break.musicEndMs-audio.break.musicStartMs,60000);
assert.equal(audio.break.afterProblem,2);assert.equal(audio.break.beforeProblem,3);
assert.ok(audio.items.filter(s=>s.group===2).at(-1).endMs<=audio.break.announcementStartMs);
assert.ok(audio.break.resumeAnnouncementEndMs<=audio.orientationSegments.find(s=>s.problem===3).startMs);
assert.equal(audio.perceptualApproval,false);assert.equal(audio.nativeReviewCompleted,false);
assert.equal(master.releaseReady,false);
console.log(`N5 02 PCM TIMING PASS: 24 scripts/options, four non-scored examples, music exactly 60000ms; whole ${audio.durationMs}ms. No human/native/perceptual approval.`);
