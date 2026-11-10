const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),cp=require('node:child_process'),crypto=require('node:crypto');
process.chdir(path.resolve(__dirname,'../..'));
const dir='docs/ssw-workspace/source-coverage-v2/',receipt=JSON.parse(fs.readFileSync(dir+'agriculture-nursery-graft-health-v10-review.json'));
const read=p=>JSON.parse(fs.readFileSync(p)),old=p=>JSON.parse(cp.execFileSync('git',['show',receipt.baseline+':'+p],{maxBuffer:64e6}));
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
const sorted=v=>Array.isArray(v)?v.map(sorted):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,sorted(v[k])])):v;
const bank=read('src/data/agriculture/mock-exams.ja.json'),prior=old('src/data/agriculture/mock-exams.ja.json');
let repaired=0;
for(const [i,e]of bank.exams.entries()){
 const before=prior.exams[i];assert.equal(e.id,before.id);
 for(const [qi,q]of e.questions.entries()){
  const priorQuestion=before.questions[qi];
  if(q.id==='agr-1-m01-q25'){
   assert.equal(q.optionReasonsJa[1],'紙製ポットを使う方法と、育苗箱を使う箱育苗を混同しています。');
   const comparable=structuredClone(q);comparable.optionReasonsJa[1]=priorQuestion.optionReasonsJa[1];assert.deepEqual(comparable,priorQuestion,'Only the incorrect rationale changes');
   assert.equal(q.correctIndex,2);assert.equal(hash(JSON.stringify(q)),receipt.japaneseRepair.afterQuestionSha256);repaired++;
  }else assert.deepEqual(q,priorQuestion,'Unrelated question changed');
 }
 const compare=structuredClone(e);compare.questions=before.questions;compare.revision=before.revision;assert.deepEqual(compare,before,'Only question content and affected exam revision change');
 if(e.id==='agr-1-m01'){assert.notEqual(e.revision,before.revision);assert.equal(e.revision,receipt.japaneseRepair.newExamRevision);}else assert.equal(e.revision,before.revision);
}
assert.equal(repaired,1);
const unchanged=['lessons.ja.json','weekly-checks.ja.json','course-manifest.json','source-hash-compatibility.json','reader-moisture-checks.json','daily-learning-support.json','recognition-images.json',...['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'].map(l=>'translations/'+l+'.json')];
for(const name of unchanged){const file='src/data/agriculture/'+name;assert(fs.readFileSync(file).equals(cp.execFileSync('git',['show',receipt.baseline+':'+file],{maxBuffer:64e6})),file+' changed');}
const ledger=read(dir+'agriculture.json'),baseLedger=old(dir+'agriculture.json'),changed=new Set(receipt.closedKnowledgeIds);
assert.equal(changed.size,9);assert.equal(ledger.knowledgeUnits.length,baseLedger.knowledgeUnits.length);
for(const unit of ledger.knowledgeUnits){const before=baseLedger.knowledgeUnits.find(u=>u.knowledgeId===unit.knowledgeId);assert(before);if(changed.has(unit.knowledgeId)){assert.equal(unit.status,'covered_ai');assert.deepEqual(unit.before,before.before);assert.deepEqual(receipt.originalUnits.find(u=>u.knowledgeId===unit.knowledgeId),before);assert(unit.sourceRefs.every(r=>r.elementIds.length));}else assert.deepEqual(unit,before,'Unreviewed canonical unit changed');}
assert.equal(ledger.knowledgeUnits.filter(u=>u.status==='covered_ai').length,121);assert.equal(ledger.denominator.status,'open');assert.equal(ledger.wholeSourceKnowledgeCovered,false);assert.equal(ledger.pages.filter(p=>p.semanticInventory.status==='complete_ai').length,4);
const inventory=read('docs/ssw-workspace/agriculture/assessment-inventory.json');
const indexStillHasOldQuestionHash=inventory.existingAssessments.find(q=>q.questionId==='agr-1-m01-q25').questionHash!==hash(JSON.stringify(sorted(bank.exams.find(e=>e.id==='agr-1-m01').questions.find(q=>q.id==='agr-1-m01-q25'))));
const out={status:'PASS_AGRICULTURE_V10_THREE_GROUPS',closedKnowledgeUnits:9,coveredAi:121,sourcePagesVisuallyRead:5,completeSemanticPagesUnchanged:4,questionsRepaired:1,otherQuestionsPreserved:1226,lessonLocalePairsPreserved:2892,readerChecksPreserved:23,learnerIdsPreserved:true,sourceDenominator:'open',sourceCoveragePercent:null,wholeSourceKnowledgeCovered:false,historicalAssessmentInventoryCurrent:false,historicalAssessmentInventoryBlocker:'Existing assessment editorial input hashes already mismatch current lessons and weekly banks; regeneration requires broader review, not hash-only approval. New canonical assessment evidence binds the repaired current question.',indexStillHasOldQuestionHash,domainReviewed:false,nativeReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false,allLocaleSemanticsReviewed:false};
fs.writeFileSync(dir+'agriculture-nursery-graft-health-v10-validation.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out));
