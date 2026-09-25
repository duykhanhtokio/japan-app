import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const root='docs/jlpt-workspace/conversion/n4-2014-07';
const manifest=JSON.parse(fs.readFileSync(`${root}/WORK_MANIFEST.json`));
const written=JSON.parse(fs.readFileSync(`${root}/written.audit.json`));
const listening=JSON.parse(fs.readFileSync(`${root}/listening.audit.json`));
const dataset=JSON.parse(fs.readFileSync('src/data/jlpt-official/n4-2014-07/exam.candidate.json'));
const registry=fs.readFileSync('src/data/jlpt-official/approved-n1-exams.ts','utf8');
const catalog=fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts','utf8');
const hash=p=>{
  const contents=fs.readFileSync(p);
  const lfsPointer=contents.toString('utf8').match(/^oid sha256:([a-f0-9]{64})$/m);
  return lfsPointer?.[1] ?? createHash('sha256').update(contents).digest('hex');
};

assert.equal(manifest.examId,'n4-2014-07-exam-05');
assert.equal(manifest.status,'incomplete');
assert.equal(manifest.identity.confidence,'high');
assert.equal(manifest.identity.coverPrintsPeriod,true);
assert.deepEqual(manifest.counts,{writtenResponsesObserved:70,listeningResponsesObserved:28});
assert.deepEqual(written.counts,{vocabulary:35,grammarReading:35,total:70});
assert.deepEqual(listening.counts,{responses:28,problems:[8,7,5,8]});
assert.equal(written.records.length,70);
assert.equal(listening.records.length,28);
assert.equal(new Set([...written.records,...listening.records].map(record=>record.auditId)).size,98);
const buildIds=(section,counts)=>counts.flatMap((count,problemIndex)=>Array.from({length:count},(_,questionIndex)=>`${section}-p${problemIndex+1}-q${questionIndex+1}`));
assert.deepEqual(written.records.map(record=>record.auditId),[
  ...buildIds('vocabulary',[9,6,10,5,5]),
  ...buildIds('grammar-reading',[15,5,5,4,4,2]),
]);
assert.deepEqual(listening.records.map(record=>record.auditId),buildIds('listening',[8,7,5,8]));
assert.ok(written.records.every(record=>record.answerKeyPage===15&&record.answerAudit==='checked_against_page_15_key'));
assert.ok(listening.records.every(record=>record.answerKeyPage===15&&record.answerAudit==='checked_against_page_15_key'));
assert.deepEqual(written.records.map(record=>Number(record.correctOptionId)),[4,3,1,2,4,1,2,2,3,3,2,1,4,3,2,2,4,4,2,3,1,4,1,1,3,2,4,4,1,3,2,1,1,3,4,2,3,1,2,4,1,2,3,3,4,1,1,2,3,4,2,3,4,1,3,2,4,3,1,2,1,1,1,2,4,3,2,4,3,3]);
assert.deepEqual(listening.records.map(record=>Number(record.correctOptionId)),[3,3,1,1,4,3,3,2,2,2,2,1,3,3,4,2,2,1,3,2,3,3,2,3,1,1,2,1]);
assert.deepEqual(listening.records.map(record=>[record.timingMs.start,record.timingMs.end]),[
  [153280,220600],[220600,287820],[287820,365440],[365440,434800],[434800,522580],[522580,595300],[595300,681240],[681240,781080],
  [918360,1013480],[1013480,1119180],[1119180,1198440],[1198440,1297800],[1297800,1409200],[1409200,1515020],[1515020,1648220],
  [1732360,1775060],[1775060,1819920],[1819920,1858140],[1858140,1897560],[1897560,1934220],
  [2020880,2055140],[2055140,2087760],[2087760,2123140],[2123140,2156640],[2156640,2192040],[2192040,2225900],[2225900,2260040],[2260040,2298906],
]);
let previousEnd=0;
for(const record of listening.records){
  assert.equal(record.timingVerificationStatus,'candidate_unverified');
  assert.equal(record.humanReviewed,false);
  assert.equal(record.perceptualApproval,false);
  assert.equal(record.reviewDisposition,'needs_later_review');
  assert.equal(record.timingEvidence.authoritativeSourceTiming,false);
  assert.ok(record.timingMs.start>=previousEnd);
  assert.ok(record.timingMs.start<record.timingMs.end);
  assert.ok(record.timingMs.end<=manifest.runtimeAudio.durationMsCeiling);
  previousEnd=record.timingMs.end;
}
assert.equal(manifest.source.sourceTimingPresent,false);
assert.equal(manifest.timing.candidateCount,28);
assert.equal(manifest.timing.status,'candidate_unverified');
assert.equal(manifest.review.humanReviewed,false);
assert.equal(manifest.review.perceptualApproval,false);
assert.equal(manifest.review.reviewDisposition,'needs_later_review');
assert.equal(dataset.examId,'n4-2014-07-exam-05');
assert.deepEqual(dataset.counts,{writtenResponses:70,listeningResponses:28,totalResponses:98,uniqueAudioSegments:28});
assert.equal(dataset.questions.length,98);
assert.equal(dataset.questions.filter(question=>question.family!=='listening').length,70);
assert.equal(dataset.questions.filter(question=>question.family==='listening').length,28);
assert.equal(dataset.questions.every(question=>question.promptJa&&question.instructionJa&&question.options.length>=3&&question.options.every(option=>option.textJa)&&question.correctOptionId),true);
assert.equal(dataset.questions.filter(question=>question.family==='listening').every(question=>question.audio.transcriptJa&&question.audio.timingStatus==='candidate_unverified'&&question.audio.humanReviewed===false&&question.audio.perceptualApproval===false&&question.audio.reviewDisposition==='needs_later_review'),true);
assert.match(registry,/id: 'n4-2014-07-exam-05'/);
assert.match(registry,/N4_2014_07_TRIAL/);
assert.doesNotMatch(catalog,/'n4-2014-07'/);
assert.equal(hash('assets/jlpt/n4/2014-07/audio/n4-2014-07.mp3'),manifest.runtimeAudio.sha256);
console.log('N4 2014-07 STRUCTURED INTEGRATION PASS: 70 written and 28 listening responses are registered; 28 timings remain candidate_unverified and require later perceptual review.');
