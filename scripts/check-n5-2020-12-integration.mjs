import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
const readJson=file=>JSON.parse(fs.readFileSync(file,'utf8'));const sha256=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const written=readJson('docs/jlpt-workspace/conversion/n5-2020-12/written.audit.json');const listening=readJson('docs/jlpt-workspace/conversion/n5-2020-12/listening.audit.json');const manifest=readJson('docs/jlpt-workspace/conversion/n5-2020-12/WORK_MANIFEST.json');const catalog=fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts','utf8');
assert.deepEqual(written.counts,{vocabulary:35,grammarReading:32,total:67,answersPresent:0,explanationsPresent:0});assert.equal(written.records.length,67);assert.equal(new Set(written.records.map(r=>r.auditId)).size,67);
assert.ok(written.records.every(r=>r.correctOptionId===null&&r.questionSourcePages.length>0&&r.answerKeyPages.length===0&&r.explanationOrTranslationPages.length===0));
assert.deepEqual(listening.counts,{responses:24,problems:[7,6,5,6],answersPresent:0,transcriptsPresent:0,candidateTimings:24});assert.equal(listening.records.length,24);assert.equal(new Set(listening.records.map(r=>r.auditId)).size,24);
assert.ok(listening.records.every(r=>r.correctOptionId===null&&r.answerKeyPages.length===0&&r.transcriptSourcePages.length===0&&r.timingVerificationStatus==='candidate_unverified'&&/^BPT_N5_2_\d{2}\.mp3$/.test(r.audioSourceFile)));
assert.ok(listening.records.every(r=>r.humanReviewed===false&&r.perceptualApproval===false&&r.reviewDisposition==='needs_later_review'));
let previousEnd=0;for(const r of listening.records){assert.ok(Number.isInteger(r.timingMs.start)&&Number.isInteger(r.timingMs.end));assert.ok(r.timingMs.start>=previousEnd&&r.timingMs.end>r.timingMs.start&&r.timingMs.end<=1789999);previousEnd=r.timingMs.end;}
assert.equal(manifest.examId,'n5-2020-12-exam-06');assert.equal(manifest.status,'incomplete');assert.equal(manifest.identity.confidence,'source_mismatch_practice_test');assert.deepEqual(manifest.counts,{writtenResponses:67,listeningResponses:24,totalAuditIds:91});
assert.equal(manifest.source.answerKeyPresent,false);assert.equal(manifest.source.japaneseListeningTranscriptPresent,false);assert.equal(manifest.source.explanationRecords,0);assert.equal(manifest.timing.status,'candidate_unverified');assert.equal(manifest.audioCrossCheck.transcriptClaimed,false);
assert.equal(manifest.review.humanReviewed,false);assert.equal(manifest.review.perceptualApproval,false);assert.equal(sha256('assets/jlpt/n5/2020-12/audio/n5-2020-12.mp3'),manifest.runtimeAudio.sha256);
assert.match(catalog,/'n5-2020-12'/);assert.doesNotMatch(catalog,/n5-2020-12-exam-06/);
console.log('N5 2020 CATALOG-TARGET SOURCE AUDIT PASS: practice-test source mismatch recorded; 67 written and 24 listening IDs audited; answers, explanations, and transcript are absent; 24 track-derived timings remain unverified.');
