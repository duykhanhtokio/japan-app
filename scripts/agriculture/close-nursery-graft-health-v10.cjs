// Source bands below were visually self-read against SHA-verified private PDFs.
// Run only once on the recorded baseline; no whole-page/whole-sector acceptance.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),zlib=require('node:zlib'),assert=require('node:assert/strict');
process.chdir(path.resolve(__dirname,'../..'));
const folder='docs/ssw-workspace/source-coverage-v2/',receipt=folder+'agriculture-nursery-graft-health-v10-review.json';
assert(!fs.existsSync(receipt),'Already applied; do not replay');
const read=p=>JSON.parse(fs.readFileSync(p)),write=(p,d)=>fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const sorted=x=>Array.isArray(x)?x.map(sorted):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sorted(x[k])])):x;
const ledgerPath=folder+'agriculture.json',ledger=read(ledgerPath),lessons=read('src/data/agriculture/lessons.ja.json').lessons;
const previousCovered=ledger.knowledgeUnits.filter(u=>u.status==='covered_ai').length;
assert.equal(previousCovered,112);
const mocksPath='src/data/agriculture/mock-exams.ja.json',mocks=read(mocksPath),weekly=read('src/data/agriculture/weekly-checks.ja.json');
const oldMockBytesSha256=hash(fs.readFileSync(mocksPath));
const correctedExam=mocks.exams.find(e=>e.id==='agr-1-m01'),correctedQuestion=correctedExam.questions.find(q=>q.id==='agr-1-m01-q25');
const oldQuestion=structuredClone(correctedQuestion),oldExamRevision=correctedExam.revision;
assert.equal(correctedQuestion.optionReasonsJa[1],'紙製のポットと箱育苗の道具を混同していません。');
correctedQuestion.optionReasonsJa[1]='紙製ポットを使う方法と、育苗箱を使う箱育苗を混同しています。';
correctedExam.revision='v1-'+hash(JSON.stringify(sorted(correctedExam.questions))).slice(0,16);
write(mocksPath,mocks);
const arts=Object.fromEntries(['AGR-S1','AGR-S2'].map(sid=>[sid,JSON.parse(zlib.gunzipSync(fs.readFileSync(folder+`agriculture-${sid}-regions.json.gz`)))]));
const bands=(sid,page,low,high)=>({sourceId:sid,pdfPage:page,elementIds:arts[sid].pages.find(p=>p.pdfPage===page).elements.filter(e=>e.kind==='text_span'&&e.bbox[1]>=low&&e.bbox[1]<high).map(e=>e.elementId)});
const spec=[
 ['FACILITY-ENV-NURSERY-METHODS-02','箱育苗では育苗箱を用いる。',89,1,'agr-1-m01-q25',[bands('AGR-S1',75,201,222),bands('AGR-S2',17,711,735)],[]],
 ['FACILITY-ENV-NURSERY-METHODS-03','ポット育苗のプラスチック製ポットには様々な大きさがある。',89,2,'agr-1-m01-q26',[bands('AGR-S1',75,252,299),bands('AGR-S2',17,762,790),bands('AGR-S2',18,50,70)],[]],
 ['FACILITY-ENV-NURSERY-METHODS-04','ペーパーポット育苗には土で分解される紙製の容器を用いる。',89,3,'agr-par06-facility-environment-q13',[bands('AGR-S1',75,329,350),bands('AGR-S2',18,99,120)],[]],
 ['FACILITY-ENV-NURSERY-METHODS-05','セル成型育苗用トレイの穴数には野菜や苗の大きさに応じたものがある。',89,4,'agr-par06-facility-environment-q14',[bands('AGR-S1',75,380,430),bands('AGR-S2',18,150,200)],['穴数だけから全作物共通の苗の大きさや育苗条件を決めない。']],
 ['FACILITY-ENV-GRAFTED-SEEDLINGS-01','接ぎ木苗の二つの構成部分は台木と穂木である。',90,0,'agr-2-m09-q27',[bands('AGR-S1',75,711,735),bands('AGR-S2',18,482,505)],['台木に穂木を接いだ苗についての構成の区別。']],
 ['FACILITY-ENV-GRAFTED-SEEDLINGS-02','台木には病気や害虫に強い品種や作物を用いる。',90,1,'agr-2-m09-q28',[bands('AGR-S1',75,762,790),bands('AGR-S2',18,533,555)],['抵抗性の性質を整理するものであり、全ての病害虫への無被害を保証しない。']],
 ['FACILITY-ENV-GRAFTED-SEEDLINGS-03','穂木には収穫量や品質に優れた品種を用いる。',90,2,'agr-par06-facility-environment-q15',[bands('AGR-S1',76,48,70),bands('AGR-S2',19,48,70)],['台木に求める抵抗性と穂木に求める収量・品質の役割を区別する。']],
 ['S38-PLANT-CLASSIFICATION-SIGNS-05','窒素肥料が不足した苗では、下葉の黄化と苗の勢いの低下が掲載例として示される。',189,4,'agr-2-m07-q12',[bands('AGR-S2',19,456,480)],['掲載された関係であり、一つの症状から原因診断や追肥量を決めない。']],
 ['S38-PLANT-CLASSIFICATION-SIGNS-06','良い苗木の確認項目には細根の伸びと病害虫に侵されていない状態がある。',189,5,'agr-week49-q01',[bands('AGR-S2',19,561,580)],['数値による根長基準や外観だけの無病診断を追加しない。']]
];
function ev(file,ptr,note){let v=read(file);for(const k of ptr.slice(1).split('/'))v=v[k];return{path:file,jsonPointer:ptr,sha256:hash(JSON.stringify(v)),sha256Mode:'json-value',relation:'direct',semanticReviewed:true,reviewNote:note};}
function assessment(id){for(const [file,doc]of [[mocksPath,mocks],['src/data/agriculture/weekly-checks.ja.json',weekly]])for(const [ei,e]of doc.exams.entries())for(const [qi,q]of e.questions.entries())if(q.id===id)return ev(file,`/exams/${ei}/questions/${qi}`,'Self-read complete current question, four options, correct answer and all rationales against this precise objective. It tests the named fact/relationship, not physical skill.');throw Error(id);}
const originalUnits=[];
for(const [suffix,statement,li,pi,qid,refs,conditions]of spec){
 const id='agriculture-v2-AGR-K-'+suffix,u=ledger.knowledgeUnits.find(u=>u.knowledgeId===id);assert(u&&u.status==='candidate',id);assert(refs.every(r=>r.elementIds.length));originalUnits.push(structuredClone(u));
 for(const p of ledger.pages)p.knowledgeIds=p.knowledgeIds.filter(k=>k!==id);
 for(const a of Object.values(arts))for(const p of a.pages)for(const e of p.elements)e.knowledgeIds=e.knowledgeIds.filter(k=>k!==id);
 u.statementJa=statement;u.conditionsJa=conditions;u.sourceRefs=refs;
 u.teachingEvidence=[ev('src/data/agriculture/lessons.ja.json',`/lessons/${li}/paragraphs/${pi}/textJa`,'Self-read independently written current app paragraph against the selected source body/ruby bands and condition limits. No source prose or page-image copied into runtime.')];u.assessmentEvidence=[assessment(qid)];u.imageEvidence=[];
 u.after={teaching:'present',assessment:'present'};u.expressionReview={status:'independent_ai_checked',note:'Current app presents original explanation/application/distractors rather than source paragraph layout. Technical factual terms retained. Reading the source picture here does not certify app visual recognition.'};u.sourceReview={status:'self_checked_ai',conditionsChecked:true,reviewRef:receipt};u.status='covered_ai';u.unresolved=[];
 for(const r of refs){const p=ledger.pages.find(p=>p.sourceId===r.sourceId&&p.pdfPage===r.pdfPage);p.knowledgeIds.push(id);p.disposition='mixed';p.regionCensus.status='visually_reviewed';p.regionCensus.visualReviewRef=receipt;if(p.semanticInventory.status==='pending')p.semanticInventory={status:'partial',reviewRef:receipt};for(const eid of r.elementIds){const e=arts[r.sourceId].pages.find(p=>p.pdfPage===r.pdfPage).elements.find(e=>e.elementId===eid);e.classification='knowledge';e.knowledgeIds.push(id);e.reason='Self-read source body/ruby band supports this bounded factual objective; remaining unassigned page elements stay pending.';}}
}
for(const [sid,a]of Object.entries(arts)){const bytes=zlib.gzipSync(JSON.stringify(a),{mtime:0});fs.writeFileSync(folder+`agriculture-${sid}-regions.json.gz`,bytes);const sha256=hash(bytes);for(const p of ledger.pages.filter(p=>p.sourceId===sid))p.regionCensus.sha256=sha256;}
write(ledgerPath,ledger);
write(receipt,{schemaVersion:1,sector:'agriculture',date:'2026-11-03',baseline:'2aa8c72ef0dc475250631f222b3e3c7d0da7e3e9',sourceBytesVerified:ledger.sources.map(s=>({sourceId:s.sourceId,sha256:s.sha256,pdfPages:s.pdfPages})),sourcePagesVisuallySelfRead:[['AGR-S1',75],['AGR-S1',76],['AGR-S2',17],['AGR-S2',18],['AGR-S2',19]],groups:['nursery container/material/size relationships, including box rationale repair','rootstock/scion composition and distinct roles','seedling vigour and fine-root/pest observations'],originalUnits,coveredAiBefore:previousCovered,coveredAiAfter:ledger.knowledgeUnits.filter(u=>u.status==='covered_ai').length,closedKnowledgeIds:spec.map(s=>'agriculture-v2-AGR-K-'+s[0]),japaneseRepair:{questionId:correctedQuestion.id,before:oldQuestion,afterQuestionSha256:hash(JSON.stringify(correctedQuestion)),oldExamRevision,newExamRevision:correctedExam.revision,oldMockBytesSha256,newMockBytesSha256:hash(fs.readFileSync(mocksPath)),dependencyImpact:'Existing exam displays optionReasonsJa directly as Japanese Text; no persisted translated/ruby/audio reason exists in the Agriculture runtime. Lesson text/hash and 12 lesson-locale payloads stay unchanged. Exam revision advances through existing incompatible-attempt rejection, preserving stored IDs/history.'},sourcePageClosure:false,sourceDenominator:'open',sourceCoveragePercent:null,wholeSourceKnowledgeCovered:false,domainReviewed:false,nativeReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false,allLocaleSemanticAcceptance:false,remaining:'Cold-bed/heating distinction, actual nursery-container photograph recognition, transplant diagram/practical skills and other elements on these five pages remain open. No page is marked semantically complete.'});
console.log(JSON.stringify({status:'APPLIED_AGRICULTURE_V10',closedKnowledgeUnits:spec.length,coveredAiBefore:previousCovered,coveredAiAfter:previousCovered+spec.length,questionRepair:correctedQuestion.id,newExamRevision:correctedExam.revision}));
