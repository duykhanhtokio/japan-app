import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const dir='docs/ssw-workspace/kensetsu/exams/ten-by-forty/';
const bank=JSON.parse(fs.readFileSync('src/data/kensetsu/review-tests.ja.json','utf8'));
const blueprint=JSON.parse(fs.readFileSync(dir+'blueprint.json','utf8'));
const preserved=JSON.parse(fs.readFileSync(dir+'preserved-file-hashes.json','utf8'));
const norm=s=>s.normalize('NFKC').replace(/[\p{P}\p{Z}\s]/gu,'');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const [path,hash] of Object.entries(preserved))assert.equal(sha(fs.readFileSync(path)),hash,path);
assert.equal(bank.examCount,10);assert.equal(bank.questionCount,400);assert.equal(bank.exams.length,10);
assert.equal(bank.language,'ja');assert.equal(bank.releaseReady,false);
const ids=new Set(),stems=new Set(),objectives=new Set(),lessons=new Set(),weeks=new Set(),paragraphs=new Set(),clusters=new Set();
const distributions=[];const all=[];let answerTail=[];let refs=0;
for(const [ei,exam] of bank.exams.entries()){
 assert.equal(exam.id,'kensetsu-review-v2-'+String(ei+1).padStart(2,'0'));assert(!ids.has(exam.id));ids.add(exam.id);
 assert.equal(exam.revision,bank.revision);assert.equal(exam.questions.length,40);assert.equal(exam.questionCount,40);assert.equal(exam.maxPoints,40);
 assert.equal(exam.timeLimitSeconds,null);assert.equal(exam.passThreshold,null);assert.equal(exam.isOfficialExam,false);
 const counts=[0,0,0,0];
 for(const [qi,q] of exam.questions.entries()){
  assert.equal(q.number,qi+1);assert.equal(q.points,1);assert(!ids.has(q.id));ids.add(q.id);
  const stem=norm(q.promptJa),objective=norm(q.objectiveKey);
  assert(stem.length>=10);assert(!stems.has(stem),q.id);stems.add(stem);
  assert(objective.length>=5);assert(!objectives.has(objective),q.id);objectives.add(objective);
  assert.equal(q.choicesJa.length,4);assert.equal(new Set(q.choicesJa.map(norm)).size,4);
  assert(Number.isInteger(q.correctIndex)&&q.correctIndex>=0&&q.correctIndex<4);
  counts[q.correctIndex]++;answerTail.push(q.correctIndex);
  assert(!answerTail.slice(-3).every((n,i,a)=>a.length===3&&n===a[0]),q.id);
  assert.equal(q.distractorRationalesJa.length,4);assert(q.explanationJa.length>=10);
  for(const t of [q.promptJa,q.explanationJa,q.claimJa,...q.choicesJa,...q.distractorRationalesJa]){
   assert(typeof t==='string'&&t.trim());assert(/[\u3040-\u30ff\u3400-\u9fff]/u.test(t)||/^[0-9]+(?::[0-9]+)+$/.test(t.normalize('NFKC')));
   assert(!/TODO|TBD|placeholder|https?:\/\/|câu hỏi|đáp án/iu.test(t),q.id);
  }
  assert.equal(q.review.aiAuthorSelfReviewed,true);assert.equal(q.review.humanDomainReviewed,false);assert.equal(q.review.releaseReady,false);
  assert(q.sourceReferences.length>0);
  for(const r of q.sourceReferences){
   const bytes=fs.readFileSync(r.lessonFile),s=JSON.parse(bytes);
   assert.equal(sha(bytes),r.lessonSha256);assert.equal(s.id,r.sessionId);assert.equal(s.weekId,r.weekId);
   assert.equal(s.revision,r.sessionRevision);assert.equal(s.contentRevision??s.revision,r.contentRevision);
   const c=s.clusters.find(c=>c.id===r.clusterId);assert(c);clusters.add(c.id);
   assert(r.paragraphIds.length>0);for(const id of r.paragraphIds){assert(c.paragraphs.some(p=>p.id===id),q.id+':'+id);paragraphs.add(id);refs++;}
   lessons.add(s.id);weeks.add(s.weekId);
  }
  const slot=blueprint.exams[ei].slots[qi];
  assert(q.sourceReferences.some(r=>r.sessionId==='kensetsu-common-session-'+String(slot.session).padStart(3,'0')));
  all.push(q);
 }
 assert.deepEqual(counts,[10,10,10,10]);distributions.push({examId:exam.id,correctPositionCounts:counts});
}
assert.equal(all.length,400);assert.equal(lessons.size,385);assert.equal(weeks.size,55);
const coverage=JSON.parse(fs.readFileSync(dir+'coverage-matrix.json','utf8'));
assert.equal(coverage.referencedParagraphs,paragraphs.size);assert.equal(coverage.referencedClusters,clusters.size);
assert.equal(coverage.exhaustiveAtomicKnowledgeAssessed,false);
for(const q of all)for(const r of q.sourceReferences)for(const id of r.paragraphIds)assert(coverage.paragraphs[id].questionIds.includes(q.id));
const ngrams=t=>{const s=norm(t);return new Set(Array.from({length:Math.max(0,s.length-2)},(_,i)=>s.slice(i,i+3)));};
const sims=[];const grams=all.map(q=>ngrams(q.promptJa));
for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++){
 const a=grams[i],b=grams[j];const intersection=[...a].filter(x=>b.has(x)).length;
 const score=intersection/(a.size+b.size-intersection||1);
 if(score>=.42)sims.push({left:all[i].id,right:all[j].id,score:Number(score.toFixed(3)),leftObjective:all[i].objectiveKey,rightObjective:all[j].objectiveKey,leftPrompt:all[i].promptJa,rightPrompt:all[j].promptJa});
}
sims.sort((a,b)=>b.score-a.score);
fs.writeFileSync(dir+'similarity-candidates.json',JSON.stringify({method:'Normalized Japanese character trigram Jaccard >=0.42; candidate generation only, not semantic proof',count:sims.length,pairs:sims},null,2)+'\n');
const report={status:'PASS_MACHINE_10x40_STRUCTURE_TRACEABILITY_AND_LESSON_COVERAGE',exams:10,questions:400,uniqueNormalizedStems:stems.size,uniqueObjectiveKeys:objectives.size,referencedLessons:lessons.size,referencedWeeks:weeks.size,referencedClusters:clusters.size,referencedParagraphs:paragraphs.size,paragraphReferenceCount:refs,totalClusters:coverage.totalClusters,totalParagraphs:coverage.totalParagraphs,unreferencedClusters:coverage.totalClusters-clusters.size,unreferencedParagraphs:coverage.totalParagraphs-paragraphs.size,answerDistributions:distributions,noTripleAnswerRunAcrossBank:true,preservedFileCount:Object.keys(preserved).length,lessonHashesVerified:true,similarityCandidateCount:sims.length,semanticUniquenessCertifiedByMachine:false,humanDomainReviewed:false,nativeJapaneseReviewed:false,releaseReady:false,limits:['Each author self-reviewed own content; structural validation is not a proof of single-answer semantics.','All385lessons represented does not mean every paragraph or knowledge atom assessed.','Semantic similarity candidates require reading; distinct strings/objective labels alone do not prove different meaning.']};
fs.writeFileSync(dir+'structural-qa.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,questions:400,lessons:385,referencedParagraphs:paragraphs.size,totalParagraphs:coverage.totalParagraphs,similarityCandidates:sims.length,preservedFiles:report.preservedFileCount}));
