// Explicit source-page self-review, not automatic acceptance of unseen pages.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),zlib=require('node:zlib'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),base='docs/ssw-workspace/food-manufacturing/source-v2-round2-20261103',lp='docs/ssw-workspace/source-coverage-v2/food.json',ap='docs/ssw-workspace/source-coverage-v2/food-ssw2-regions.json.gz';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p))),write=(p,v)=>fs.writeFileSync(path.join(root,p),JSON.stringify(v,null,2)+'\n'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const ledger=read(lp),regions=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,ap)))),report={schemaVersion:1,date:'2026-11-03',sourcePagesTextAndImageSelfRead:[87,88,96,98],records:[],sourceDenominator:'open',wholeSourceKnowledgeCovered:false,domainReviewed:false,nativeReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false};
function ev(p,pointer,note){let v=read(p);for(const k of pointer.slice(1).split('/'))v=v[k];return {path:p,jsonPointer:pointer,sha256:sha(JSON.stringify(v)),sha256Mode:'json-value',relation:'direct',semanticReviewed:true,reviewNote:note};}
function find(id){return ledger.knowledgeUnits.find(u=>u.knowledgeId==='food-v2-'+id);}
const receipt=base+'/self-review.json';
// Retain the old author62 unit IDs and before states; bind the completed,
// corrected revisions only after independently reviewing their changed meaning.
for(const[slug,index]of [['production-plan-business-objective',0],['output-dekidaka-name',1],['labor-productivity-alias',1]]){
 const u=find(slug);assert(u);const before=structuredClone(u);u.teachingEvidence=[ev('src/data/food-manufacturing/source-closure62.json',`/sections/${index}/textJa`,'Source96/98 and independent expression self-checked, including exact purpose/alias scope; current revision teaches this claim.')];u.assessmentEvidence=[ev('src/data/food-manufacturing/source-closure62.json',`/checks/${index}`,'Current independent scenario explicitly asks business purpose or output meaning and worker-hour terminology; both answer points self-reviewed.')];u.sourceReview={status:'self_checked_ai',conditionsChecked:true,reviewRef:receipt};report.records.push({knowledgeId:u.knowledgeId,before,statusAfter:u.status});
}
function newUnit(slug,statement,n,index,sourcePage,predicate){
 const id='food-v2-'+slug;assert(!find(slug),'Do not duplicate a reviewed unit');
 const page=regions.pages.find(p=>p.pdfPage===sourcePage),selected=page.elements.filter(predicate);assert(selected.length);
 for(const e of selected){e.classification='knowledge';e.knowledgeIds=[...new Set([...e.knowledgeIds,id])];e.reason=(e.reason||'')+' Explicit source subclaim self-checked: '+statement;e.semanticReviewRef=receipt;}
 const p=ledger.pages.find(p=>p.sourceId==='food-2'&&p.pdfPage===sourcePage);p.knowledgeIds=[...new Set([...p.knowledgeIds,id])];
 const u={knowledgeId:id,sourceRefs:[{sourceId:'food-2',pdfPage:sourcePage,elementIds:selected.map(e=>e.elementId)}],statementJa:statement,conditionsJa:[],exceptionsJa:[],importance:'core',classification:'knowledge',before:{teaching:'unknown',assessment:'unknown'},after:{teaching:'present',assessment:'present'},teachingEvidence:[ev(`src/data/food-manufacturing/source-closure${n}.json`,`/sections/${index}/textJa`,'Explicit, independently authored current teaching matches this source subclaim.')],assessmentEvidence:[ev(`src/data/food-manufacturing/source-closure${n}.json`,`/checks/${index}`,'The independent question asks this competency, and revealed points explicitly explain it.')],imageEvidence:[],assessmentRequirement:'required',assessmentExemptionReason:null,expressionReview:{status:'independent_ai_checked',note:'Independent workplace/data example and explanation; no source wording, numbers, page image or original diagram reproduced.'},status:'covered_ai',unresolved:[],review:{domainReviewed:false,nativeReviewed:false,physicalDeviceTested:false},sourceReview:{status:'self_checked_ai',conditionsChecked:true,reviewRef:receipt}};
 ledger.knowledgeUnits.push(u);report.records.push({knowledgeId:id,newUnit:true,sourceElements:selected.map(e=>e.elementId)});return u;
}
newUnit('production-plan-start','生産管理を始める際は、最初に生産計画を定める。',62,0,96,e=>e.kind==='text'&&e.extractionBlockNumber>=18&&e.extractionBlockNumber<=32);
newUnit('histogram-centre-spread','ヒストグラムから平均に関わる中心とばらつきの広がりを区別して読む。',64,0,88,e=>e.kind==='text'&&e.bbox[1]>=106&&e.bbox[3]<200);
// The profit indicator is explicitly present in source96, but former direct
// evidence only compared product quantities with monetary sales. Bind the new
// source-matched three-indicator response, preserving former evidence below.
{
 const u=find('output-alternative-measures');report.records.push({knowledgeId:u.knowledgeId,before:structuredClone(u),repair:'Add explicit profit as an output measure and ask all three choices.'});u.priorEvidenceBeforeRound2={teachingEvidence:u.teachingEvidence,assessmentEvidence:u.assessmentEvidence};u.teachingEvidence=[ev('src/data/food-manufacturing/source-closure62.json','/sections/1/textJa','Explicit physical output, monetary value and profit; preserve scope rather than equating all outputs.')];u.assessmentEvidence=[ev('src/data/food-manufacturing/source-closure62.json','/checks/1','Prompt explicitly asks the three output measures; answer point1 distinguishes all three and keeps worker-hour units.')];u.sourceReview={status:'self_checked_ai',conditionsChecked:true,reviewRef:receipt};
 const page=regions.pages.find(p=>p.pdfPage===96);for(const e of page.elements.filter(e=>e.kind==='text'&&e.bbox[1]>=447&&e.bbox[3]<=515)){e.knowledgeIds=[...new Set([...e.knowledgeIds,u.knowledgeId])];e.semanticReviewRef=receipt;}
}
// The inherited compound includes a source-extension causal caution. Repair
// its app gap without pretending the source explicitly states the whole rule.
{
 const u=find('legacy-qc1-027');report.records.push({knowledgeId:u.knowledgeId,before:structuredClone(u),repair:'Centre/spread teaching and task supplied; causal source-extension remains open.'});u.teachingEvidence.push(ev('src/data/food-manufacturing/source-closure64.json','/sections/0/textJa','Now explicitly teaches centre and spread plus separates observation from causal hypotheses.'));u.assessmentEvidence.push(ev('src/data/food-manufacturing/source-closure64.json','/checks/0','New independent A/B task computes both means and ranges and asks whether the cause is established.'));u.after={teaching:'present',assessment:'present'};u.status='partial';u.unresolved=['Current app centre/spread gap is repaired, but the inherited compound causal-caution claim needs separate exact source support before whole-unit source acceptance. The directly sourced centre/spread competency has its own canonical unit.'];u.sourceReview={status:'self_checked_ai',conditionsChecked:false,reviewRef:receipt};
}
// Restore exact reciprocal element lists after deliberately adding source
// subclaims; existing unrelated source/page references remain byte-equivalent.
for(const n of [88,96]){
 const p=regions.pages.find(p=>p.pdfPage===n),row=ledger.pages.find(p=>p.sourceId==='food-2'&&p.pdfPage===n);row.knowledgeIds=[...new Set(p.elements.flatMap(e=>e.knowledgeIds))].sort();
 for(const u of ledger.knowledgeUnits){const ids=p.elements.filter(e=>e.knowledgeIds.includes(u.knowledgeId)).map(e=>e.elementId);if(!ids.length)continue;const ref=u.sourceRefs.find(r=>r.sourceId==='food-2'&&r.pdfPage===n);if(ref)ref.elementIds=ids;else u.sourceRefs.push({sourceId:'food-2',pdfPage:n,elementIds:ids});}
}
const packed=zlib.gzipSync(JSON.stringify(regions,null,2)+'\n',{level:9});fs.writeFileSync(path.join(root,ap),packed);for(const p of ledger.pages.filter(p=>p.sourceId==='food-2'))p.regionCensus.sha256=sha(packed);
report.newTeachingSections=3;report.newSelfChecks=3;report.translationPairs=72;report.knownUnits=ledger.knowledgeUnits.length;report.coveredAi=ledger.knowledgeUnits.filter(u=>u.status==='covered_ai').length;report.partial=ledger.knowledgeUnits.filter(u=>u.status==='partial').length;
write(lp,ledger);write(receipt,report);console.log(JSON.stringify({status:'BOUND_SOURCE_SELF_REVIEW',knownUnits:report.knownUnits,coveredAi:report.coveredAi,partial:report.partial}));
