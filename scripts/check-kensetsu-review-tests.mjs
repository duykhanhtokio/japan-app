import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const dir='docs/ssw-workspace/kensetsu/exams/';
const bank=JSON.parse(fs.readFileSync(dir+'review-tests-10x20.ja.json','utf8'));
const normalize=s=>s.normalize('NFKC').replace(/\s+/gu,'');
const questionIds=new Set(),examIds=new Set(),stems=new Set(),weeks=new Set(),lessons=new Set();
const distributions=[];
let questions=0,refs=0,priorAnswers=[];
assert.equal(bank.examCount,10);assert.equal(bank.questionCount,200);assert.equal(bank.exams.length,10);
assert.equal(bank.appIntegrationReady,false);assert.equal(bank.releaseReady,false);
assert.equal(bank.advanced2CompetencyAssessed,false);assert.equal(bank.runtimeIntegrated,false);
for(const exam of bank.exams){
 assert(!examIds.has(exam.id));examIds.add(exam.id);
 assert.equal(exam.questions.length,20);assert.equal(exam.questionCount,20);assert.equal(exam.maxPoints,20);
 assert.equal(exam.language,'ja');assert.equal(exam.isOfficialExam,false);assert.equal(exam.isFullOfficialSimulation,false);
 assert.equal(exam.timeLimitSeconds,null);assert.equal(exam.passThreshold,null);
 for(const value of Object.values(exam.reviewVisibility))assert.equal(value,false);
 const counts=[0,0,0,0];
 for(const [index,q] of exam.questions.entries()){
  questions++;assert.equal(q.number,index+1);assert.equal(q.points,1);
  assert(!questionIds.has(q.id));questionIds.add(q.id);
  const stem=normalize(q.promptJa);assert(stem.length>=10);assert(!stems.has(stem));stems.add(stem);
  assert.equal(q.options.length,4);assert.deepEqual(q.options.map(o=>o.id),['1','2','3','4']);
  assert.equal(new Set(q.options.map(o=>normalize(o.textJa))).size,4);
  assert(/^[1-4]$/.test(q.correctOptionId));counts[Number(q.correctOptionId)-1]++;
  priorAnswers.push(q.correctOptionId);
  if(priorAnswers.length>=3){const a=priorAnswers.slice(-3);assert(!(a[0]===a[1]&&a[1]===a[2]));}
  assert(q.explanationJa.length>=10);
  for(const text of [q.promptJa,q.explanationJa,...q.options.map(o=>o.textJa)]){
   assert(/[\u3040-\u30ff\u3400-\u9fff]/u.test(text)||/^\d+(?:\.\d+)?mm$/u.test(text));assert(!/https?:\/\/|TODO|TBD|placeholder|đáp án|câu hỏi/iu.test(text));
  }
  const r=q.learningReference;const bytes=fs.readFileSync(r.lessonFile);const s=JSON.parse(bytes);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),r.lessonSha256);
  assert.equal(s.id,r.sessionId);assert.equal(s.weekId,r.weekId);assert.equal(s.revision,r.sessionRevision);
  assert.equal(s.contentRevision??s.revision,r.contentRevision);
  const cluster=s.clusters.find(c=>c.id===r.clusterId);assert(cluster);
  assert.equal(r.paragraphIds.length,2);for(const id of r.paragraphIds){assert(cluster.paragraphs.some(p=>p.id===id));refs++;}
  const week=Number(r.weekId.slice(-3));assert(week>=exam.weekRange.from&&week<=exam.weekRange.to);
  weeks.add(week);lessons.add(s.id);
  assert.equal(q.review.humanDomainReviewed,false);assert.equal(q.review.nativeJapaneseReviewed,false);
  assert.equal(q.review.sourceSemanticSimilarityReviewed,false);assert.equal(q.review.releaseReady,false);assert.equal(q.review.appIntegrationReady,false);
 }
 assert.deepEqual(counts,[5,5,5,5]);distributions.push({examId:exam.id,correctPositionCounts:counts});
}
assert.equal(questions,200);assert.equal(weeks.size,55);assert.equal(lessons.size,200);
assert.equal(new Set(distributions.map((_,i)=>bank.exams[i].questions.map(q=>q.correctOptionId).join(''))).size,10);
const report={status:'PASS_MACHINE_STRUCTURE_AND_TRACEABILITY',examCount:10,questions,uniqueQuestionIds:questionIds.size,
 uniqueStems:stems.size,coveredStudyWeeks:[...weeks].sort((a,b)=>a-b),referencedLessons:lessons.size,paragraphReferences:refs,
 fourDistinctOptionsEach:true,exactlyOneAnswerKeyEach:true,answerDistributions:distributions,noTripleSameAnswerAcrossBank:true,
 lessonHashesAndIdsVerified:true,japaneseContentChecks:true,
 limits:['Machine checks do not certify semantic correctness, human expertise, native Japanese, rights, original-source similarity or real-device runtime'],
 domainReviewed:false,nativeJapaneseReviewed:false,appIntegrationReady:false,runtimeIntegrated:false,releaseReady:false};
fs.writeFileSync(dir+'structural-qa.json',JSON.stringify(report,null,2)+'\n');
console.log('KENSETSU REVIEW TESTS PASS: 10 tests / 200 unique questions / 55 weeks / 200 lesson references; 5 correct answers at each position per test; no triple answer runs. Human/domain/runtime review pending.');
