import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const root='docs/jlpt-workspace/conversion/n4-2021-12';
const manifest=JSON.parse(fs.readFileSync(`${root}/WORK_MANIFEST.json`));
const written=JSON.parse(fs.readFileSync(`${root}/written.audit.json`));
const listening=JSON.parse(fs.readFileSync(`${root}/listening.audit.json`));
const catalog=fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts','utf8');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');

assert.equal(manifest.examId,'n4-2021-12-exam-09');
assert.equal(manifest.status,'incomplete');
assert.equal(manifest.identity.confidence,'high');
assert.equal(manifest.identity.writtenHeaderPrintsPeriod,true);
assert.equal(manifest.identity.audioPrintsPeriod,false);
assert.deepEqual(manifest.counts,{writtenResponsesExpected:57,writtenResponsesObserved:56,missingWrittenResponses:1,listeningResponsesExpected:28,listeningResponsesObserved:28});
assert.equal(manifest.source.pdfSha256,'2224d3381bfdd399721ae646cb862f8f1ddf56212304772de53afcdf923a24e5');
assert.equal(manifest.source.audioSha256,'ee1d6e27c114736c2d2d66c87f3d4889b281d10c3d9978b2fc78366edc4365a6');
assert.equal(manifest.source.audioDurationSeconds,2327.196625);
assert.equal(manifest.source.answerKeyPresent,false);
assert.equal(manifest.source.writtenExplanationsPresent,false);
assert.equal(manifest.source.translationsPresent,false);
assert.equal(manifest.source.japaneseListeningTranscriptPresent,false);
assert.equal(manifest.source.sourceTimingPresent,false);
assert.deepEqual(manifest.runtimeAudio,{sha256:'4f51258f5a87596d53847e5a983f9c7a016860eb8acbf603d7aa10144f4d6009',durationSeconds:2327.196735,durationMsCeiling:2327197});
assert.equal(manifest.blockers.length,5);
assert.deepEqual(written.counts,{vocabularyExpected:28,vocabularyObserved:27,grammarReadingExpected:29,grammarReadingObserved:29,totalExpected:57,totalObserved:56});
assert.deepEqual(listening.counts,{responsesExpected:28,responsesObserved:28,problems:[8,7,5,8]});
assert.equal(written.records.length,57);
assert.equal(listening.records.length,28);
assert.equal(new Set([...written.records,...listening.records].map(record=>record.auditId)).size,85);
const buildIds=(section,counts)=>counts.flatMap((count,problemIndex)=>Array.from({length:count},(_,questionIndex)=>`${section}-p${problemIndex+1}-q${questionIndex+1}`));
assert.deepEqual(written.records.map(record=>record.auditId),[
  ...buildIds('vocabulary',[7,5,8,4,4]),
  ...buildIds('grammar-reading',[13,4,4,3,3,2]),
]);
assert.deepEqual(listening.records.map(record=>record.auditId),buildIds('listening',[8,7,5,8]));
const missingWritten=written.records.filter(record=>record.questionSourcePages.length===0);
assert.equal(missingWritten.length,1);
assert.equal(missingWritten[0].auditId,'vocabulary-p2-q5');
assert.equal(missingWritten[0].questionVisualAudit,'source_missing_between_overall_questions_11_and_13');
assert.ok(written.records.every(record=>record.correctOptionId===null&&record.answerKeyPage===null&&record.answerAudit==='source_absent'&&record.explanationTranslationAudit==='source_absent'));
assert.ok(listening.records.every(record=>record.correctOptionId===null&&record.answerKeyPage===null&&record.answerAudit==='source_absent'&&record.transcriptSourcePages.length===0&&record.transcriptAudit.startsWith('source_absent')));
assert.deepEqual(listening.records.map(record=>[record.timingMs.start,record.timingMs.end]),[
  [205900,264500],[264500,338100],[338100,400820],[400820,488060],[488060,575600],[575600,643440],[643440,726460],[726460,815120],
  [954780,1053440],[1053440,1143020],[1143020,1232880],[1232880,1336540],[1336540,1452320],[1452320,1546380],[1546380,1694360],
  [1778120,1814820],[1814820,1853960],[1853960,1897860],[1897860,1936420],[1936420,1977740],
  [2063840,2095980],[2095980,2128720],[2128720,2159060],[2159060,2191440],[2191440,2227040],[2227040,2256160],[2256160,2289020],[2289020,2327197],
]);
let previousEnd=0;
for(const record of listening.records){
  assert.equal(record.timingVerificationStatus,'candidate_unverified');
  assert.equal(record.humanReviewed,false);
  assert.equal(record.perceptualApproval,false);
  assert.equal(record.reviewDisposition,'needs_later_review');
  assert.equal(record.timingEvidence.authoritativeSourceTiming,false);
  assert.equal(record.timingEvidence.sourceTranscript,null);
  assert.ok(record.timingMs.start>=previousEnd);
  assert.ok(record.timingMs.start<record.timingMs.end);
  assert.ok(record.timingMs.end<=manifest.runtimeAudio.durationMsCeiling);
  previousEnd=record.timingMs.end;
}
assert.equal(manifest.timing.candidateCount,28);
assert.equal(manifest.timing.status,'candidate_unverified');
assert.equal(manifest.review.humanReviewed,false);
assert.equal(manifest.review.perceptualApproval,false);
assert.equal(manifest.review.reviewDisposition,'needs_later_review');
assert.match(catalog,/'n4-2021-12'/);
assert.doesNotMatch(catalog,/n4-2021-12-exam-09/);
assert.equal(hash('assets/jlpt/n4/2021-12/audio/n4-2021-12.mp3'),manifest.runtimeAudio.sha256);
console.log('N4 2021-12 INTEGRATION AUDIT PASS: 85 expected IDs; 84 source positions observed; written question 12 and all answers/explanations/translations/transcript absent; 28 timings remain candidate_unverified; exam is incomplete and not structured_ready.');
