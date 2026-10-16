// Exact evidence/preservation checks support AI editorial review; they do not certify meaning.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dir='docs/ssw-workspace/kaigo/reviews/';
const baseline='6288f2182fdd5a5217d52535602db4f71ee39f7d',cache=new Map();
const successor=fs.existsSync(path.join(root,dir+'JAPANESE_FINAL_SCOPE_RESOLUTION.json'))?JSON.parse(fs.readFileSync(path.join(root,dir+'JAPANESE_FINAL_SCOPE_RESOLUTION.json'))):null;
if(successor)execFileSync(process.execPath,[path.join(root,'scripts/check-kaigo-japanese-final-scope.cjs')],{cwd:root,stdio:'pipe'});
const bytes=p=>successor&&(/japanese-master\/week-\d{2}(?:-questions\.draft)?\.json$/.test(p)||p.includes('mock-reviews/pair-')||p.endsWith('mock-core-corrections.json'))?execFileSync('git',['show',`${successor.baselineCommit}:${p}`],{cwd:root,maxBuffer:16e6}):fs.readFileSync(path.join(root,p));
const gitBytes=p=>{if(!cache.has(p))cache.set(p,execFileSync('git',['show',`${baseline}:${p}`],{cwd:root,maxBuffer:16e6}));return cache.get(p);};
const read=p=>JSON.parse(bytes(p)),old=p=>JSON.parse(gitBytes(p));
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const hash=v=>sha(JSON.stringify(canonical(v)));
const qp=w=>`docs/ssw-workspace/kaigo/japanese-master/week-${String(w).padStart(2,'0')}-questions.draft.json`;
const mp=w=>`src/data/kaigo/japanese-master/week-${String(w).padStart(2,'0')}.json`;
const pair=n=>`src/data/kaigo/japanese-master/mock-reviews/pair-${String(n).padStart(2,'0')}.json`;
const corePath='src/data/kaigo/japanese-master/mock-core-corrections.json';
const groups=[[1,2],[3,4],[5,6],[7,8,9,10,11,12],[13,14,15,16,17,18,19,20,21,22,23,24,25,26]];
const reports=Array.from({length:6},(_,i)=>read(dir+`JAPANESE_ASSESSMENT_REVIEW_0${i+1}.json`));
const resolution=read(dir+'JAPANESE_ASSESSMENT_RESOLUTION.json');
const current={weekly:{},masters:{},pairs:{},core:read(corePath)};
const originals={weekly:{},masters:{},pairs:{},core:old(corePath)};
for(let w=1;w<=26;w++){current.weekly[w]=read(qp(w));originals.weekly[w]=old(qp(w));current.masters[w]=read(mp(w));originals.masters[w]=old(mp(w));}
for(let n=1;n<=6;n++){current.pairs[n]=read(pair(n));originals.pairs[n]=old(pair(n));}
const source=read('src/data/kaigo/content.json');assert.equal(sha(bytes('src/data/kaigo/content.json')),sha(gitBytes('src/data/kaigo/content.json')),'Legacy source must remain byte-exact');
const formMap=new Map(source.mocks.map(f=>[f.id,f]));
const pairFor=id=>Number(id.slice(-2));
const target=p=>p.targetType==='weekly'?`weekly:${p.week}:${p.questionId}`:`mock:${p.formId}:${p.questionId}`;
const reviewAt=(state,p)=>p.targetType==='weekly'?state.weekly[p.week]?.questions[p.questionId]:state.pairs[pairFor(p.formId)]?.forms[p.formId]?.questions[p.questionId];
const effective=(state,p)=>{const q=formMap.get(p.formId)?.questions.find(q=>q.id===p.questionId);assert(q,'Unknown mock source question');return {...q,rationalesJa:reviewAt(state,p).rationalesJa,...state.core.forms[p.formId]?.questions[p.questionId]?.replacement};};
const pick=(obj,keys)=>Object.fromEntries(keys.map(k=>[k,obj[k]]));
function approvals(x){for(const k of ['humanReviewed','domainReviewed','nativeReviewed','nativeDeviceTested','releaseReady'])if(k in x)assert.equal(x[k],false,k);for(const k of ['rightsApproved','rightsReviewed'])if(k in x)assert.equal(x[k],false,k);}
function validate(input=reports,state=current,res=resolution){
 assert.equal(input.length,6);approvals(res);assert.equal(res.baselineCommit,baseline);assert.equal(res.translationsPaused,true);assert.equal(res.sourceKnowledgeCoveragePercent,null);
 const proposals=new Map(),coreProposals=new Map(),covered=new Set();let weeklyCovered=0,mockCovered=0;
 for(let i=0;i<6;i++){
  const report=input[i];approvals(report);assert.equal(report.baselineCommit,baseline);const expectedPaths=i<5?groups[i].map(qp):[...Array.from({length:6},(_,j)=>pair(j+1)),corePath];
  assert.deepEqual(report.inspected.map(r=>r.path).sort(),expectedPaths.sort(),'Review scope paths differ');
  for(const item of report.inspected){assert.equal(item.sha256,sha(gitBytes(item.path)),'Review hash is not baseline');const data=old(item.path);const ids=i<5?Object.keys(data.questions):Object.values(data.forms).flatMap(f=>Object.keys(f.questions));assert.deepEqual([...item.questionIds].sort(),ids.sort(),'Question omitted or added to claimed review');assert.equal(item.count,ids.length);
   if(item.path!==corePath){for(const id of ids){assert(!covered.has(id),'Duplicate question ownership');covered.add(id);}if(i<5)weeklyCovered+=ids.length;else mockCovered+=ids.length;}
  }
  for(const p of report.proposedPatches){assert(!proposals.has(p.patchId));proposals.set(p.patchId,p);assert.deepEqual(reviewAt(originals,p),p.before,'Stale exact-before question');assert.equal(p.after.correctIndex,p.before.correctIndex,'This batch preserves answer indices');assert.notDeepEqual(p.after,p.before);}
  for(const p of report.proposedCoreCorrections??[]){assert(!coreProposals.has(p.patchId));coreProposals.set(p.patchId,p);assert.deepEqual(pick(effective(originals,p),p.effectiveFieldScope),p.beforeEffective,'Wrong effective mock baseline');assert.equal(p.beforeEffective.correctIndex,p.afterEffective.correctIndex);}
 }
 assert.equal(weeklyCovered,687);assert.equal(mockCovered,360);
 const applied=new Map();for(const p of res.patches){approvals(p);const q=proposals.get(p.patchId);assert(q,'Unknown approved question proposal');assert.equal(target(p),target(q));assert(!applied.has(target(p)));assert.equal(p.beforeQuestionSha256,hash(q.before));assert.equal(p.afterQuestionSha256,hash(q.after));assert.deepEqual(reviewAt(state,p),q.after);applied.set(target(p),p);}
 for(const p of proposals.values())assert(res.patches.some(x=>x.patchId===p.patchId)||res.rejectedProposals.some(x=>x.patchId===p.patchId&&x.reasonJa),'Missing proposal disposition');
 let revisedWeekly=0,revisedMock=0;
 for(let w=1;w<=26;w++){
  const a=state.weekly[w],b=originals.weekly[w];assert.deepEqual(Object.keys(a.questions),Object.keys(b.questions),'Question IDs/order changed');approvals(a);
  for(const [id,q]of Object.entries(a.questions)){const prior=b.questions[id];if(hash(q)!==hash(prior)){assert(applied.has(`weekly:${w}:${id}`),'Unrecorded weekly edit');revisedWeekly++;}assert.equal(q.correctIndex,prior.correctIndex);assert.equal(q.optionsJa.length,4);assert.equal(new Set(q.optionsJa).size,4);assert.equal(q.rationalesJa.length,4);assert.equal(new Set(q.rationalesJa).size,4);approvals(q);}
  const strip=q=>({...q,questions:{},sourceJapaneseSha256:undefined,optionRationaleReview:undefined});assert.deepEqual(strip(a),strip(b),'Unreviewed question metadata change');assert.equal(a.sourceJapaneseSha256,sha(bytes(mp(w))),'Stale master binding');
 }
 for(let n=1;n<=6;n++){
  const a=state.pairs[n],b=originals.pairs[n];assert.deepEqual({...a,forms:{}},{...b,forms:{}});assert.deepEqual(Object.keys(a.forms),Object.keys(b.forms));
  for(const [fid,f]of Object.entries(a.forms)){const prev=b.forms[fid];assert.deepEqual({...f,questions:{}},{...prev,questions:{}});assert.deepEqual(Object.keys(f.questions),Object.keys(prev.questions));
   for(const[id,q]of Object.entries(f.questions)){const before=prev.questions[id];assert.deepEqual({...q,rationalesJa:[]},{...before,rationalesJa:[]},'Review core bindings changed');if(hash(q)!==hash(before)){assert(applied.has(`mock:${fid}:${id}`),'Unrecorded mock rationale edit');revisedMock++;}}
  }
 }
 const expectedCore=structuredClone(originals.core);for(const p of res.corePatches){const q=coreProposals.get(p.patchId);assert(q,'Unknown core correction');assert.equal(p.formId,q.formId);assert.equal(p.questionId,q.questionId);const raw=formMap.get(p.formId).questions.find(x=>x.id===p.questionId);const expected=pick(raw,Object.keys(p.expected));assert.deepEqual(p.expected,expected,'Correction must guard actual source');
  expectedCore.forms[p.formId]??={questions:{}};assert(!expectedCore.forms[p.formId].questions[p.questionId],'Existing core correction overwritten');expectedCore.forms[p.formId].questions[p.questionId]={expected:p.expected,replacement:p.replacement};
  assert.deepEqual(pick(effective(state,p),q.effectiveFieldScope),q.afterEffective);const corrected=effective(state,p);assert.equal(corrected.furigana.prompt.map(t=>t.text).join(''),corrected.promptJa);corrected.furigana.options.forEach((ts,i)=>assert.equal(ts.map(t=>t.text).join(''),corrected.optionsJa[i]));
 }
 assert.deepEqual(state.core,expectedCore,'Unrecorded core overlay change');assert.equal(res.corePatches.length,coreProposals.size);
 const masterPatches=new Map(res.masterPatches.map(p=>[`${p.week}:${p.sectionId}:${p.paragraphIndex}`,p]));let revisedMaster=0,paragraphs=0;
 for(let w=1;w<=26;w++){const a=state.masters[w],b=originals.masters[w];assert.deepEqual({...a,sections:{}},{...b,sections:{}});assert.deepEqual(Object.keys(a.sections),Object.keys(b.sections));for(const[sid,s]of Object.entries(a.sections)){const before=b.sections[sid];assert.deepEqual({...s,paragraphsJa:[]},{...before,paragraphsJa:[]});assert.equal(s.paragraphsJa.length,before.paragraphsJa.length);s.paragraphsJa.forEach((text,i)=>{paragraphs++;if(text!==before.paragraphsJa[i]){const p=masterPatches.get(`${w}:${sid}:${i}`);assert(p,'Unrecorded master edit');assert.equal(p.beforeJa,before.paragraphsJa[i]);assert.equal(p.afterJa,text);revisedMaster++;}});}}
 assert.equal(revisedMaster,res.masterPatches.length);assert.equal(revisedWeekly,res.counts.weeklyQuestionsRevised);assert.equal(revisedMock,res.counts.mockRationaleQuestionsRevised);
 return {status:'PASS_JAPANESE_ASSESSMENT_REVIEW_AND_EXACT_REVISIONS',baselineCommit:baseline,reviewReports:6,weeklyQuestionsReviewed:weeklyCovered,mockQuestionsReviewed:mockCovered,optionRationalesReviewed:(weeklyCovered+mockCovered)*4,weeklyQuestionsRevised:revisedWeekly,mockRationaleQuestionsRevised:revisedMock,mockCoreQuestionsRevised:res.corePatches.length,masterParagraphsRevised:revisedMaster,japaneseParagraphRecords:paragraphs,allAnswerIndicesPreserved:true,legacySourceBytePreserved:true,translationsPaused:true,sourceKnowledgeCoveragePercent:null,humanReviewed:false,domainReviewed:false,nativeReviewed:false,nativeDeviceTested:false,releaseReady:false};
}
const result=validate();
if(successor){result.comparisonCommit=successor.baselineCommit;result.historicalSnapshotValidation=true;result.currentSuccessorValidation=JSON.parse(execFileSync(process.execPath,[path.join(root,'scripts/check-kaigo-japanese-final-scope.cjs')],{cwd:root,encoding:'utf8'}));}
for(const[name,mutate]of [
 ['omitted_reviewed_question',(rs)=>rs[0].inspected[0].questionIds.pop()],
 ['unearned_approval',(rs)=>rs[0].humanReviewed=true],
 ['unrecorded_question_edit',(rs,st)=>{const q=Object.values(st.weekly[2].questions)[0];q.promptJa+='未確認の変更';}],
 ['unrecorded_master_edit',(rs,st)=>{const s=Object.values(st.masters[26].sections)[0];s.paragraphsJa[0]+='未確認の変更';}],
 ['wrong_before_object',(rs)=>rs[0].proposedPatches[0].before.promptJa+='変更'],
 ['broken_core_furigana',(rs,st)=>{const p=resolution.corePatches[0];st.core.forms[p.formId].questions[p.questionId].replacement.furigana.prompt[0].text+='変更';}],
]){const rs=structuredClone(reports),st=structuredClone(current),rr=structuredClone(resolution);mutate(rs,st,rr);assert.throws(()=>validate(rs,st,rr),undefined,name);}
result.negativeControls=['omitted_reviewed_question','unearned_approval','unrecorded_question_edit','unrecorded_master_edit','wrong_before_object','broken_core_furigana'];
if(process.env.KAIGO_ASSESSMENT_REVIEW_REPORT)fs.writeFileSync(path.resolve(root,process.env.KAIGO_ASSESSMENT_REVIEW_REPORT),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
