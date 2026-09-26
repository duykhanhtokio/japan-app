import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const root='docs/jlpt-workspace/conversion/n4-2017-07';
const manifest=JSON.parse(fs.readFileSync(`${root}/WORK_MANIFEST.json`));
const written=JSON.parse(fs.readFileSync(`${root}/written.audit.json`));
const listening=JSON.parse(fs.readFileSync(`${root}/listening.audit.json`));
const catalog=fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts','utf8');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');

assert.equal(manifest.examId,'n4-2017-07-exam-06');
assert.equal(manifest.status,'blocked_source_identity_conflict');
assert.equal(manifest.identity.confidence,'conflicted');
assert.equal(manifest.identity.coverPrintsPeriod,true);
assert.equal(manifest.identity.audioPrintsPeriod,false);
assert.deepEqual(manifest.counts,{writtenResponsesObserved:69,listeningResponsesObserved:28});
assert.equal(manifest.source.writtenExplanationsPresent,false);
assert.equal(manifest.source.translationsPresent,false);
assert.deepEqual(written.counts,{vocabulary:34,grammarReading:35,total:69});
assert.deepEqual(listening.counts,{responses:28,problems:[8,7,5,8]});
assert.equal(written.records.length,69);
assert.equal(listening.records.length,28);
assert.equal(new Set([...written.records,...listening.records].map(record=>record.auditId)).size,97);
const buildIds=(section,counts)=>counts.flatMap((count,problemIndex)=>Array.from({length:count},(_,questionIndex)=>`${section}-p${problemIndex+1}-q${questionIndex+1}`));
assert.deepEqual(written.records.map(record=>record.auditId),[
  ...buildIds('vocabulary',[9,6,9,5,5]),
  ...buildIds('grammar-reading',[15,5,5,4,4,2]),
]);
assert.deepEqual(listening.records.map(record=>record.auditId),buildIds('listening',[8,7,5,8]));
assert.ok(written.records.every(record=>record.explanationTranslationAudit==='source_absent'&&record.explanationOrTranslationPages.length===0));
assert.deepEqual(written.records.map(record=>Number(record.correctOptionId)),[1,1,4,2,2,3,1,2,4,1,4,3,4,4,1,4,3,2,2,4,3,1,2,3,3,2,1,3,2,4,3,4,1,2,3,4,1,2,4,2,3,1,2,4,1,1,3,4,2,3,2,4,3,3,2,3,2,1,4,4,3,2,3,2,4,4,1,3,2]);
assert.deepEqual(listening.records.map(record=>Number(record.correctOptionId)),[1,4,3,4,3,2,2,1,4,2,3,3,1,2,3,1,2,1,2,1,2,3,2,1,2,3,3,1]);
assert.deepEqual(listening.records.map(record=>[record.timingMs.start,record.timingMs.end]),[
  [162600,228180],[228180,282640],[282640,366520],[366520,443380],[443380,528940],[528940,585900],[585900,666100],[666100,735420],
  [874300,971300],[971300,1063100],[1063100,1151920],[1151920,1243860],[1243860,1340660],[1340660,1441420],[1441420,1538780],
  [1624200,1661540],[1661540,1700300],[1700300,1740720],[1740720,1777840],[1777840,1814300],
  [1902980,1931540],[1931540,1963220],[1963220,1994580],[1994580,2026180],[2026180,2057420],[2057420,2087800],[2087800,2117520],[2117520,2192497],
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
const dataset=JSON.parse(fs.readFileSync('src/data/jlpt-official/n4-2017-07/exam.candidate.json'));
const registry=fs.readFileSync('src/data/jlpt-official/approved-n1-exams.ts','utf8');
assert.equal(dataset.examId,'n4-2017-07-exam-06');
assert.equal(dataset.status,'structured_ready_content_with_candidate_audio_timing');
assert.deepEqual(dataset.counts,{writtenResponses:69,listeningResponses:28,totalResponses:97,uniqueAudioSegments:28});
assert.equal(dataset.questions.length,97);
assert.equal(new Set(dataset.questions.map(question=>question.questionId)).size,97);
assert.ok(dataset.questions.every(question=>question.promptJa&&question.options.length>=3&&question.options.every(option=>option.textJa)));
assert.deepEqual(dataset.questions.map(question=>Number(question.correctOptionId)),[...written.records,...listening.records].map(record=>Number(record.correctOptionId)));
const audioQuestions=dataset.questions.filter(question=>question.audio);
assert.equal(audioQuestions.length,28);
assert.ok(audioQuestions.every(question=>question.audio.timingStatus==='candidate_unverified'&&question.audio.humanReviewed===false&&question.audio.perceptualApproval===false&&question.audio.reviewDisposition==='needs_later_review'));
assert.doesNotMatch(catalog,/'n4-2017-07'/);
assert.doesNotMatch(registry,/n4-2017-07-exam-06/);
const runtimeAudio=fs.readFileSync('assets/jlpt/n4/2017-07/audio/n4-2017-07.mp3');
const lfsOid=runtimeAudio.toString('utf8').match(/^oid sha256:([a-f0-9]{64})$/m)?.[1];
assert.equal(lfsOid??createHash('sha256').update(runtimeAudio).digest('hex'),manifest.runtimeAudio.sha256);
console.log('N4 2017-07 SOURCE IDENTITY BLOCK PASS: duplicated December 2012 content is retained for audit but is not published as a July 2017 structured exam.');
