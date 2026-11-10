// Explicit cost-competency self-review: source PDF p12 read in text and image.
// Uses pre-existing exact source regions. It does not rebuild the source census.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const R=path.resolve(__dirname,'../..'),D='docs/ssw-workspace/restaurant/source-closure31/',V='docs/ssw-workspace/source-coverage-v2/';
const read=p=>JSON.parse(fs.readFileSync(path.join(R,p),'utf8')),save=(p,v)=>fs.writeFileSync(path.join(R,p),JSON.stringify(v,null,2)+'\n');
const hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const packet=read(D+'integration/source-v2-r5-operations-authoring-20261103.json'),ledger=read(V+'restaurant.json'),runtime=read('src/data/restaurant/source31/2.json');
const receiptPath=V+'restaurant-r5-cost-assessment-review-20261103.json';
const source=ledger.sources.find(s=>s.sourceId==='rst-2-operations');assert.equal(source.sha256,'6c9d1d11108cb4bc114cdf653f2c1061a7f6606dfd4933119a15bc599a98225f');
const notes=[
 'Same-period common-sales denominator: new q001 requires taking 100 minus cost ratio to obtain gross margin, and distinguishes decimal proportion from percentage. Existing core lesson explicitly teaches the shared denominator.',
 'Per-menu standard cost divided by the same menu selling price and multiplied by100: new q002 requires the exact numerator/denominator; distractors reverse them, use gross margin or omit percentage conversion.',
 'Weighted monthly standard cost sum divided by same-month corresponding sales: new q003 requires both200×30+300×20 and12000/40000×100. The earlier sum-only question could not close this objective.'
];
let receipt=fs.existsSync(path.join(R,receiptPath))?read(receiptPath):{schemaVersion:1,baselineCommit:packet.baselineCommit,status:'self_checked_ai',sourceId:source.sourceId,sourceSha256:source.sha256,pdfPages:[12],sourceTextRead:true,sourceVisualRead:true,scope:'Three formula competencies only; no full-page/whole-source closure.',reviews:[],review:{nativeReviewed:false,domainReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false}};
for(let i=0;i<packet.questions.length;i++){
 const q=packet.questions[i],uid=q.factIds[0],u=ledger.knowledgeUnits.find(v=>v.knowledgeId===uid);assert(u);assert(u.sourceRefs.every(s=>s.sourceId===source.sourceId&&s.pdfPage===12&&s.elementIds.length));
 const row=runtime.lessons[q.lessonId],j=row.exam.questions.findIndex(v=>v.id===q.id),actual=row.exam.questions[j];assert(j>=0);assert.equal(actual.optionsJa[actual.correctIndex],q.optionsJa[q.correctIndex]);
 const teaching=u.teachingEvidence.filter(e=>e.relation==='direct'&&e.semanticReviewed);assert(teaching.length);
 const ptr=`/lessons/${q.lessonId}/exam/questions/${j}`;
 const evidence={path:'src/data/restaurant/source31/2.json',jsonPointer:ptr,sha256:hash(actual),sha256Mode:'json-value',relation:'direct',semanticReviewed:true,reviewNote:notes[i]};
 if(!receipt.reviews.some(r=>r.knowledgeId===uid))receipt.reviews.push({knowledgeId:uid,previous:{status:u.status,after:structuredClone(u.after),unresolved:structuredClone(u.unresolved)},questionId:q.id,sourceSelections:structuredClone(u.sourceRefs),sourceReviewNote:notes[i],afterStatus:'covered_ai'});
 u.assessmentEvidence=[evidence];u.teachingEvidence=teaching;u.after={teaching:'present',assessment:'present'};u.status='covered_ai';u.unresolved=[];u.assessmentRequirement='required';u.assessmentExemptionReason=null;
 u.conditionsJa=i===0?['原価率と粗利益率は同じ期間・同じ売上高を分母にする。']:i===1?['標準原価と売価は同一商品の値を使い、比率に100を掛けて百分率にする。']:['各商品の販売数と個別標準原価の積を合計し、同じ月・同じ対象範囲の売上高で割って100を掛ける。'];
 u.sourceReview={status:'self_checked_ai',conditionsChecked:true,reviewRef:receiptPath};u.expressionReview={status:'independent_ai_checked',note:'Independently authored workplace calculation with new data and diagnostic distractors; mathematical facts retained, source menu tables/examples not reproduced.'};
}
assert.equal(ledger.denominator.status,'open');assert.equal(ledger.wholeSourceKnowledgeCovered,false);save(receiptPath,receipt);save(V+'restaurant.json',ledger);console.log('Applied3exactcostassessments; source denominator remains open.');
