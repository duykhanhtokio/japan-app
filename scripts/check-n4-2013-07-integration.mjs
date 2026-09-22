import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const root='docs/jlpt-workspace/conversion/n4-2013-07';
const manifest=JSON.parse(fs.readFileSync(`${root}/WORK_MANIFEST.json`));
const written=JSON.parse(fs.readFileSync(`${root}/written.audit.json`));
const listening=JSON.parse(fs.readFileSync(`${root}/listening.audit.json`));
const catalog=fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts','utf8');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');

assert.equal(manifest.examId,'n4-2013-07-exam-03');
assert.equal(manifest.status,'incomplete');
assert.equal(manifest.identity.confidence,'high');
assert.equal(manifest.identity.coverPrintsPeriod,false);
assert.deepEqual(manifest.counts,{writtenResponsesObserved:70,listeningResponsesObserved:28});
assert.deepEqual(written.counts,{vocabulary:35,grammarReading:35,total:70});
assert.deepEqual(listening.counts,{responses:28,problems:[8,7,5,8]});
assert.equal(written.records.length,70);
assert.equal(listening.records.length,28);
assert.equal(new Set([...written.records,...listening.records].map(record=>record.auditId)).size,98);
assert.deepEqual(written.records.map(record=>Number(record.correctOptionId)),[2,4,3,1,4,2,3,1,1,4,3,3,3,4,1,1,2,3,1,4,2,2,2,1,2,4,1,3,1,4,3,2,4,3,2,1,3,2,3,4,4,2,2,3,3,1,2,4,1,4,1,4,1,2,1,3,1,2,3,4,1,3,2,4,1,4,3,3,2,4]);
assert.deepEqual(listening.records.map(record=>Number(record.correctOptionId)),[2,3,3,1,2,2,4,3,1,2,1,3,3,2,4,2,1,1,3,1,3,3,3,2,2,2,2,1]);
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
assert.match(catalog,/'n4-2013-07'/);
assert.doesNotMatch(catalog,/n4-2013-07-exam-03/);
assert.equal(hash('assets/jlpt/n4/2013-07/audio/n4-2013-07.mp3'),manifest.runtimeAudio.sha256);
console.log('N4 2013-07 INTEGRATION AUDIT PASS: 70 written and 28 listening responses audited; 28 timings remain candidate_unverified; exam is incomplete and not structured_ready.');
