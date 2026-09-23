import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const root='docs/jlpt-workspace/conversion/n4-2021-07';
const manifest=JSON.parse(fs.readFileSync(`${root}/WORK_MANIFEST.json`));
const written=JSON.parse(fs.readFileSync(`${root}/written.audit.json`));
const listening=JSON.parse(fs.readFileSync(`${root}/listening.audit.json`));
const catalog=fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts','utf8');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');

assert.equal(manifest.examId,'n4-2021-07-exam-08');
assert.equal(manifest.status,'incomplete');
assert.equal(manifest.identity.confidence,'high');
assert.equal(manifest.identity.writtenCoverPrintsPeriod,true);
assert.equal(manifest.identity.listeningCoverPrintsPeriod,true);
assert.equal(manifest.identity.answerKeyPrintsPeriod,true);
assert.equal(manifest.identity.audioPrintsPeriod,false);
assert.deepEqual(manifest.counts,{writtenResponsesObserved:57,listeningResponsesObserved:28});
assert.equal(manifest.source.pdfSha256,'013be0c7c32574334a7da76236747466827e2e820e05956fccb429053009632b');
assert.equal(manifest.source.audioSha256,'8f9c61b59b6e6dde9ad4bba9cb47acfb74400288159f76a3ccbd95128e9c4309');
assert.equal(manifest.source.audioDurationSeconds,2376.0195);
assert.equal(manifest.source.answerKeyPresent,true);
assert.equal(manifest.source.writtenExplanationsPresent,false);
assert.equal(manifest.source.translationsPresent,false);
assert.equal(manifest.source.japaneseListeningTranscriptPresent,false);
assert.equal(manifest.source.sourceTimingPresent,false);
assert.deepEqual(manifest.runtimeAudio,{sha256:'dda7130941a41e0a64456763d3e21cd035c49841b65b42499f3271f8942188eb',durationSeconds:2376.019592,durationMsCeiling:2376020});
assert.equal(manifest.blockers.length,4);
assert.deepEqual(written.counts,{vocabulary:28,grammarReading:29,total:57});
assert.deepEqual(listening.counts,{responses:28,problems:[8,7,5,8]});
assert.equal(written.records.length,57);
assert.equal(listening.records.length,28);
assert.equal(new Set([...written.records,...listening.records].map(record=>record.auditId)).size,85);
const buildIds=(section,counts)=>counts.flatMap((count,problemIndex)=>Array.from({length:count},(_,questionIndex)=>`${section}-p${problemIndex+1}-q${questionIndex+1}`));
assert.deepEqual(written.records.map(record=>record.auditId),[
  ...buildIds('vocabulary',[7,5,8,4,4]),
  ...buildIds('grammar-reading',[13,4,4,3,3,2]),
]);
assert.deepEqual(listening.records.map(record=>record.auditId),buildIds('listening',[8,7,5,8]));
assert.ok(written.records.every(record=>record.answerKeyPage===31&&record.answerAudit==='checked_against_page_31_key'&&record.explanationTranslationAudit==='source_absent'));
assert.ok(listening.records.every(record=>record.answerKeyPage===31&&record.answerAudit==='checked_against_page_31_key'&&record.transcriptSourcePages.length===0&&record.transcriptAudit.startsWith('source_absent')));
assert.deepEqual(written.records.map(record=>Number(record.correctOptionId)),[2,1,3,2,3,4,1,2,4,3,2,1,3,3,2,1,4,2,4,1,4,1,3,4,4,1,2,3,2,3,3,4,3,1,4,4,2,1,2,4,1,2,4,1,4,2,1,4,3,3,2,4,3,1,4,2,2]);
assert.deepEqual(listening.records.map(record=>Number(record.correctOptionId)),[3,3,2,3,2,1,2,3,1,2,3,1,3,2,4,1,3,2,1,2,3,3,1,1,1,2,2,1]);
assert.deepEqual(listening.records.map(record=>[record.timingMs.start,record.timingMs.end]),[
  [205080,284620],[284620,370580],[370580,461180],[461180,534780],[534780,611280],[611280,682840],[682840,771980],[771980,850560],
  [989160,1088620],[1088620,1184280],[1184280,1294660],[1294660,1417700],[1417700,1518280],[1518280,1611780],[1611780,1753220],
  [1839120,1876900],[1876900,1909080],[1909080,1950680],[1950680,1988140],[1988140,2025660],
  [2112340,2138460],[2138460,2164820],[2164820,2199600],[2199600,2230460],[2230460,2265540],[2265540,2299840],[2299840,2336760],[2336760,2376020],
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
assert.match(catalog,/'n4-2021-07'/);
assert.doesNotMatch(catalog,/n4-2021-07-exam-08/);
assert.equal(hash('assets/jlpt/n4/2021-07/audio/n4-2021-07.mp3'),manifest.runtimeAudio.sha256);
console.log('N4 2021-07 INTEGRATION AUDIT PASS: 57 written and 28 listening responses audited; explanations, translations, and transcript absent; 28 timings remain candidate_unverified; exam is incomplete and not structured_ready.');
