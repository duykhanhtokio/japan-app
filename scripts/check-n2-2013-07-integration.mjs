import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
const built=spawnSync(process.execPath,['scripts/build-n2-2013-07-structured.mjs','--check'],{encoding:'utf8'});assert.equal(built.status,0,built.stderr);
const data=JSON.parse(fs.readFileSync('src/data/jlpt-official/n2-2013-07/exam.candidate.json','utf8'));
const source=fs.readFileSync('src/data/jlpt-mock/n2-2013-07-official.ts','utf8');const key=n=>source.match(new RegExp(`${n} = \\[([\\s\\S]*?)\\]`))[1].match(/\d+/g).map(Number);
const written=data.questions.filter(q=>q.sectionId==='written'),listening=data.questions.filter(q=>q.sectionId==='listening');
assert.equal(data.examId,'n2-2013-07-exam-01');assert.deepEqual(data.counts,{writtenResponses:75,listeningResponses:31,totalResponses:106,uniqueAudioSegments:30});
assert.deepEqual(written.map(q=>Number(q.correctOptionId)),key('N2_2013_07_WRITTEN_KEY'));assert.deepEqual(listening.map(q=>Number(q.correctOptionId)),key('N2_2013_07_LISTENING_KEY'));
assert.equal(new Set(data.questions.map(q=>q.questionId)).size,106);assert.deepEqual([1,2,3,4,5].map(p=>listening.filter(q=>q.problemNumber===p).length),[5,6,5,11,4]);
for(const q of written){assert.equal(q.options.length,4);assert.ok(q.promptJa.length>1);assert.equal(q.verificationStatus,'candidate_source_transcription');}
for(const q of listening){assert.equal(q.options.length,q.problemNumber===4?3:4);assert.equal(q.audio.timingVerificationStatus,'candidate_unverified');assert.equal(q.audio.humanReviewed,false);assert.equal(q.audio.perceptualApproval,false);assert.equal(q.audio.reviewDisposition,'needs_later_review');assert.ok(q.audio.endMs>q.audio.startMs&&q.audio.endMs<=2228454);}
assert.equal(data.status,'candidate_complete');assert.equal(data.blockers.length,0);
console.log('N2 2013-07 INTEGRATION PASS: 75 written; 31 listening responses; 30 candidate segments; keys, IDs, ranges and status validated.');
