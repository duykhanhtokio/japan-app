import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
const rebuilt = spawnSync(process.execPath,['scripts/build-n1-2016-07-structured.mjs','--check'],{encoding:'utf8'});
assert.equal(rebuilt.status,0,rebuilt.stderr);
const data=JSON.parse(fs.readFileSync('src/data/jlpt-official/n1-2016-07/exam.candidate.json','utf8'));
const source=fs.readFileSync('src/data/jlpt-mock/n1-2016-07-official.ts','utf8');
const key=(n)=>source.match(new RegExp(`${n} = \\[([\\s\\S]*?)\\]`))[1].match(/\d+/g).map(Number);
const written=data.questions.filter(q=>q.sectionId==='written'), listening=data.questions.filter(q=>q.sectionId==='listening');
assert.equal(data.examId,'n1-2016-07-exam-09'); assert.deepEqual(data.counts,{writtenResponses:70,listeningResponses:37,totalResponses:107,uniqueAudioSegments:36});
assert.deepEqual(written.map(q=>Number(q.correctOptionId)),key('N1_2016_07_WRITTEN_KEY')); assert.deepEqual(listening.map(q=>Number(q.correctOptionId)),key('N1_2016_07_LISTENING_KEY'));
assert.equal(new Set(data.questions.map(q=>q.questionId)).size,107); assert.deepEqual([1,2,3,4,5].map(p=>listening.filter(q=>q.problemNumber===p).length),[6,7,6,14,4]);
for(const q of written){assert.equal(q.options.length,4);assert.equal(q.verificationStatus,'verified_against_source_image');assert.ok(q.promptJa.length>1);assert.ok(!/原本|選択肢[1-4]|転記対象/.test(JSON.stringify(q)));}
let previousEnd=0; const seenSegments=new Set();
for(const q of listening){const a=q.audio; assert.equal(q.options.length,q.problemNumber===4?3:4); assert.equal(q.verificationStatus,'candidate_unverified'); assert.equal(a.timingVerificationStatus,'candidate_unverified'); assert.equal(a.humanReviewed,false); assert.equal(a.perceptualApproval,false); assert.equal(a.reviewDisposition,'needs_later_review'); assert.ok(a.transcriptJa.length>20); assert.ok(!/原本|選択肢[1-4]|後続の人手確認/.test(JSON.stringify(q))); assert.equal(Math.round(Number(a.timingEvidence.match(/boundaries ([\d.]+) s and ([\d.]+) s/)[1])*1000),a.startMs); assert.equal(Math.round(Number(a.timingEvidence.match(/boundaries ([\d.]+) s and ([\d.]+) s/)[2])*1000),a.endMs); if(!seenSegments.has(a.segmentId)){assert.ok(a.startMs>=previousEnd,`${a.segmentId} overlaps prior segment`);previousEnd=a.endMs;seenSegments.add(a.segmentId);}}
assert.equal(seenSegments.size,36); assert.equal(data.blockers.length,0); assert.equal(data.status,'candidate_complete');
console.log('N1 2016-07 INTEGRATION PASS: 70 source-written; 37 listening responses; 36 ordered candidate segments; keys, IDs, provenance, and non-placeholder content validated.');
