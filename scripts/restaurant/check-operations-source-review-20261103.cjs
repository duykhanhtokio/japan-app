// Source-review batch preservation: do not infer completeness from passing this guard.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const receipt=read('docs/ssw-workspace/source-coverage-v2/restaurant-operations-review-20261103.json');
const old=p=>JSON.parse(cp.execFileSync('git',['show',`${receipt.baselineCommit}:${p}`],{cwd:root,encoding:'utf8',maxBuffer:24*1024*1024}));
const qpath='src/data/restaurant/exams.2.ja.json',before=old(qpath),expected=structuredClone(before),after=read(qpath);
const question=expected.exams.flatMap(e=>e.questions).find(q=>q.id==='rst-2-q110');
const token=question.furigana.explanation.find(t=>t.text==='積');assert.equal(token.reading,'つ');token.reading='せき';assert.deepEqual(after,expected,'Only exact-context math reading may change; IDs/text/sourceHash/answers/other ruby are preserved');
const contextPath='src/data/restaurant/context-readings.json',oldContext=old(contextPath),newContext=read(contextPath),fieldHash=crypto.createHash('sha256').update(question.explanationJa).digest('hex');for(const [k,v]of Object.entries(oldContext.fields))assert.deepEqual(newContext.fields[k],v);assert.equal(Object.keys(newContext.fields).length,Object.keys(oldContext.fields).length+1);assert.equal(newContext.fields[fieldHash].spans[0].reading,'せき');
const ledgerPath='docs/ssw-workspace/source-coverage-v2/restaurant.json',ledger=read(ledgerPath),prior=old(ledgerPath),changedIds=new Set(receipt.reviews.map(x=>x.knowledgeId));assert.equal(changedIds.size,18);
assert.equal(ledger.knowledgeUnits.length,prior.knowledgeUnits.length);assert.equal(ledger.denominator.status,'open');assert.equal(ledger.wholeSourceKnowledgeCovered,false);
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
let preserved=0;
for(const previous of prior.knowledgeUnits){
 const current=ledger.knowledgeUnits.find(u=>u.knowledgeId===previous.knowledgeId);assert(current);assert.deepEqual(current.before,previous.before,'Preserve historical before state');
 if(changedIds.has(previous.knowledgeId))continue;
 const allowed=structuredClone(previous);
 for(const k of ['teachingEvidence','assessmentEvidence','imageEvidence'])for(const e of allowed[k])if(e.path===qpath){
  let checksum;
  if(e.sha256Mode==='file')checksum=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,qpath))).digest('hex');
  else{let v=after;for(const key of e.jsonPointer.split('/').slice(1))v=v[key.replace(/~1/g,'/').replace(/~0/g,'~')];checksum=hash(v);}
  if(checksum!==e.sha256){e.sha256=checksum;e.reviewNote+=' q110 furigana-only repair: mathematical 積=せき; all semantic content/sourceHash/answers preserved.';}
 }
 assert.deepEqual(current,allowed,'Unreviewed knowledge unit may only refresh actual changed file-byte evidence, without semantic acceptance');preserved++;
}
assert.equal(ledger.knowledgeUnits.filter(u=>u.status==='covered_ai').length,50);assert.equal(receipt.reviews.filter(u=>u.afterStatus==='covered_ai').length,8);assert.equal(receipt.reviews.filter(u=>u.afterStatus==='partial').length,10);
console.log(JSON.stringify({status:'PASS_RESTAURANT_OPERATIONS_REVIEW_PRESERVATION',baseline:receipt.baselineCommit,groups:3,sourceUnitsReviewed:18,newCoveredAi:8,explicitPartial:10,knownUnits:1478,unreviewedUnitsPreserved:preserved,oldQuestionSemanticContentPreserved:true,oneContextReadingCorrected:true,allOldContextOverridesPreserved:true,sourceDenominator:'open',wholeSectorCovered:false,nativeReviewed:false,domainReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false}));
