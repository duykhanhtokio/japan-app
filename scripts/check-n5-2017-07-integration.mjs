import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
const readJson=(file)=>JSON.parse(fs.readFileSync(file,'utf8')); const sha256=(file)=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const written=readJson('docs/jlpt-workspace/conversion/n5-2017-07/written.audit.json');
const listening=readJson('docs/jlpt-workspace/conversion/n5-2017-07/listening.audit.json');
const manifest=readJson('docs/jlpt-workspace/conversion/n5-2017-07/WORK_MANIFEST.json');
const catalog=fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts','utf8');
assert.deepEqual(written.counts,{vocabulary:33,grammarReading:32,total:65}); assert.equal(written.records.length,65); assert.equal(new Set(written.records.map(r=>r.auditId)).size,65);
assert.ok(written.records.every(r=>/^[1-4]$/.test(r.correctOptionId)&&r.questionSourcePages.length>0&&r.explanationOrTranslationPages.length===0));
assert.deepEqual(listening.counts,{responses:24,problems:[7,6,5,6],candidateTimings:24}); assert.equal(listening.records.length,24); assert.equal(new Set(listening.records.map(r=>r.auditId)).size,24);
assert.ok(listening.records.every(r=>/^[1-4]$/.test(r.correctOptionId)&&r.transcriptSourcePages.length>0&&r.timingVerificationStatus==='candidate_unverified'));
assert.ok(listening.records.every(r=>r.humanReviewed===false&&r.perceptualApproval===false&&r.reviewDisposition==='needs_later_review'));
let previousEnd=0; for(const r of listening.records){assert.ok(Number.isInteger(r.timingMs.start)&&Number.isInteger(r.timingMs.end));assert.ok(r.timingMs.start>=previousEnd&&r.timingMs.end>r.timingMs.start&&r.timingMs.end<=1709950);previousEnd=r.timingMs.end;}
assert.equal(manifest.examId,'n5-2017-07-exam-04'); assert.equal(manifest.status,'incomplete'); assert.deepEqual(manifest.counts,{writtenResponses:65,listeningResponses:24,totalAuditIds:89});
assert.equal(manifest.source.simplifiedChineseExplanationRecords,0); assert.equal(manifest.source.missingExplanationRecords,65); assert.notEqual(manifest.timing.supportArtifactSha256,'PENDING_WHISPER_OUTPUT');
assert.equal(manifest.review.humanReviewed,false); assert.equal(manifest.review.perceptualApproval,false); assert.equal(sha256('assets/jlpt/n5/2017-07/audio/n5-2017-07.mp3'),manifest.runtimeAudio.sha256);
assert.match(catalog,/'n5-2017-07'/); assert.doesNotMatch(catalog,/n5-2017-07-exam-04/);
console.log('N5 2017-07 SOURCE AUDIT PASS: 65 written and 24 listening IDs; complete answers and transcript, runtime audio, and 24 unverified candidate timings recorded; written explanations are absent and status remains incomplete.');
