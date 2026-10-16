// Checks revision provenance and preservation; does not certify clinical or native-language quality.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dir='docs/ssw-workspace/kaigo/reviews/';
const baseline='f269590c5a38c7efa13d8ccdbcc697c3402baa68';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const old=p=>JSON.parse(execFileSync('git',['show',`${baseline}:${p}`],{cwd:root,maxBuffer:12e6}));
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const mp=w=>`src/data/kaigo/japanese-master/week-${String(w).padStart(2,'0')}.json`;
const qp=w=>`docs/ssw-workspace/kaigo/japanese-master/week-${String(w).padStart(2,'0')}-questions.draft.json`;
const reports=Array.from({length:6},(_,i)=>read(dir+`JAPANESE_REMAINING_REVIEW_0${i+1}.json`));
const resolution=read(dir+'JAPANESE_REMAINING_RESOLUTION.json');
// A later assessment review can also clarify a reader paragraph. Check that successor first,
// then validate this complete historical unit against its committed successor baseline.
const successorPath=dir+'JAPANESE_ASSESSMENT_RESOLUTION.json';
const successor=fs.existsSync(path.join(root,successorPath))?read(successorPath):null;
let successorResult=null;
if(successor){assert.equal(successor.baselineCommit,'6288f2182fdd5a5217d52535602db4f71ee39f7d');successorResult=JSON.parse(execFileSync(process.execPath,[path.join(__dirname,'check-kaigo-japanese-assessment-review.cjs')],{cwd:root,encoding:'utf8',maxBuffer:2e6}).trim());}
const snapshotBytes=p=>successor?execFileSync('git',['show',`${successor.baselineCommit}:${p}`],{cwd:root,maxBuffer:12e6}):fs.readFileSync(path.join(root,p));
const masters={},originals={};for(let w=1;w<=26;w++){masters[w]=JSON.parse(snapshotBytes(mp(w)));originals[w]=old(mp(w));}
const key=p=>`${p.week}:${p.sectionId}:${p.paragraphIndex}`;
function approvals(x){for(const k of ['humanReviewed','domainReviewed','nativeReviewed'])assert.equal(x[k],false,k);for(const k of ['releaseReady','rightsReviewed','rightsApproved','nativeDeviceTested'])if(k in x)assert.equal(x[k],false,k);}
function at(corpus,p){const ps=corpus[p.week]?.sections[p.sectionId]?.paragraphsJa;assert(Array.isArray(ps),'Unknown paragraph section');assert(Number.isInteger(p.paragraphIndex)&&p.paragraphIndex>=0&&p.paragraphIndex<ps.length,'Invalid paragraph index');return ps[p.paragraphIndex];}
function validate(input=reports,current=masters,res=resolution){
 approvals(res);assert.equal(res.baselineCommit,baseline);const proposals=new Map(),applied=new Map();
 for(const report of input){approvals(report);assert.equal(report.baselineCommit,baseline);assert(Array.isArray(report.proposedPatches));for(const p of report.proposedPatches){assert(!proposals.has(p.patchId),'Duplicate proposal');assert.equal(at(originals,p),p.beforeJa,'Wrong exact-before text');assert(p.afterJa.trim()&&p.afterJa!==p.beforeJa);proposals.set(p.patchId,p);}}
 for(const p of res.patches){approvals(p);const proposed=proposals.get(p.patchId);assert(proposed,'Unknown applied proposal');assert.equal(key(p),key(proposed));assert(!applied.has(key(p)),'Overlapping paragraph edit');assert.equal(at(current,p),proposed.afterJa);assert.equal(hash(proposed.beforeJa),p.beforeParagraphSha256);assert.equal(hash(proposed.afterJa),p.afterParagraphSha256);applied.set(key(p),p);}
 for(const p of proposals.values())assert(res.patches.some(x=>x.patchId===p.patchId)||res.rejectedProposals.some(x=>x.patchId===p.patchId&&x.reasonJa),'Proposal missing disposition');
 let paragraphs=0,revised=0,questions=0;const perWeek=[];
 for(let w=1;w<=26;w++){
  assert.deepEqual(Object.keys(current[w].sections),Object.keys(originals[w].sections));assert.deepEqual({...current[w],sections:{}},{...originals[w],sections:{}},'Unreviewed metadata change');let changes=0;
  for(const [sid,s] of Object.entries(current[w].sections)){
   const prior=originals[w].sections[sid];assert.deepEqual({...s,paragraphsJa:[]},{...prior,paragraphsJa:[]});assert.equal(s.paragraphsJa.length,prior.paragraphsJa.length,'Paragraph ID/index shape changed');
   s.paragraphsJa.forEach((text,i)=>{paragraphs++;if(text!==prior.paragraphsJa[i]){assert(applied.has(key({week:w,sectionId:sid,paragraphIndex:i})),'Unrecorded Japanese edit');changes++;revised++;}});
  }
  const q=JSON.parse(snapshotBytes(qp(w))),priorQ=old(qp(w));assert.deepEqual(q.questions,priorQ.questions,'Weekly question content changed');questions+=Object.keys(q.questions).length;
  assert.equal(q.sourceJapaneseSha256,hash(snapshotBytes(mp(w))),'Stale question source binding');
  perWeek.push({week:w,revisedParagraphs:changes});
 }
 assert.equal(revised,res.patches.length);assert.equal(res.counts.currentParagraphRecords,paragraphs);assert.equal(res.counts.revisedParagraphRecords,revised);assert.equal(res.sourceKnowledgeCoveragePercent,null);assert.equal(res.translationsPaused,true);
 const priorResolution=read(dir+'JAPANESE_SOURCE_PAGE_RESOLUTION.json');
 const oldPending=new Set(priorResolution.deferredConcepts.map(c=>c.id));
 const accounted=[...res.pendingItems.map(p=>p.sourceConceptId),...res.sourceCandidateDispositions.changed.map(p=>p.sourceConceptId)];
 assert.equal(new Set(accounted).size,accounted.length,'Duplicate pending disposition');assert.deepEqual([...accounted].sort(),[...oldPending].sort(),'Pending source candidate silently omitted');
 const effective={...priorResolution.inventory.effectiveStatusCounts};
 for(const item of res.sourceCandidateDispositions.changed){assert(oldPending.has(item.sourceConceptId));assert.equal(item.status,'corrected_source_error');effective.pending--;effective.corrected_source_error++;}
 assert.deepEqual(res.sourceCandidateDispositions.afterThisAiEvidenceReview,effective);assert.equal(effective.pending,res.pendingItems.length);
 return {status:'PASS_JAPANESE_REMAINING_REVISION_AND_PRESERVATION',baselineCommit:baseline,reports:input.length,paragraphs,revisedParagraphs:revised,addedParagraphs:0,weeklyQuestionObjectsUnchanged:questions,perWeek,sourceKnowledgeCoveragePercent:null,translationsPaused:true,humanReviewed:false,domainReviewed:false,nativeReviewed:false,nativeDeviceTested:false,releaseReady:false};
}
const result=validate();
result.comparisonCommit=successor?.baselineCommit??'working_tree';
result.questionComparisonCommit=successor?.baselineCommit??null;
result.historicalSnapshotValidation=Boolean(successor);
result.currentSuccessorValidation=successorResult;
const controls=[['unearned_approval',(rs,ms,rr)=>rs[0].humanReviewed=true],['missing_report',(rs)=>rs.pop()],['misstated_disposition_count',(rs,ms,rr)=>rr.sourceCandidateDispositions.afterThisAiEvidenceReview.pending++],['unrecorded_japanese_edit',(rs,ms)=>{const s=Object.keys(ms[1].sections)[0];ms[1].sections[s].paragraphsJa[0]+='未確認の追記';}]];
// Report count is required separately so an empty sixth report cannot be silently omitted.
const checked=(rs,ms,rr)=>{assert.equal(rs.length,6);return validate(rs,ms,rr);};
if(resolution.patches.length){controls.push(['wrong_before_text',rs=>{rs.find(r=>r.proposedPatches.length).proposedPatches[0].beforeJa+='誤記';}],['unknown_applied_proposal',(rs,ms,rr)=>rr.patches[0].patchId='unrecorded-proposal']);}
for(const [name,mutate]of controls){const rs=structuredClone(reports),ms=structuredClone(masters),rr=structuredClone(resolution);mutate(rs,ms,rr);assert.throws(()=>checked(rs,ms,rr),undefined,name);}
result.negativeControls=controls.map(([name])=>name);
if(process.env.KAIGO_REMAINING_REPORT)fs.writeFileSync(path.resolve(root,process.env.KAIGO_REMAINING_REPORT),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
