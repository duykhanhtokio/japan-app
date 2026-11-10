const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),crypto=require('node:crypto');
const {transformSync}=require('esbuild'),root=path.resolve(__dirname,'../..');
const resolve=Module._resolveFilename;
Module._resolveFilename=function(id,parent,...rest){
 let requested=id.startsWith('@/')?path.join(root,'src',id.slice(2)):id;
 if((requested.startsWith('.')||path.isAbsolute(requested))&&!path.extname(requested)){
  const candidate=path.resolve(parent?path.dirname(parent.filename):root,requested)+'.ts';
  if(fs.existsSync(candidate))requested=candidate;
 }
 return resolve.call(this,requested,parent,...rest);
};
require.extensions['.ts']=(m,file)=>m._compile(transformSync(fs.readFileSync(file,'utf8'),{loader:'ts',format:'cjs'}).code,file);
const req=p=>require(path.join(root,p)),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const data=req('src/data/manufacturing/qc-plan-practice.json'),api=req('src/data/manufacturing/qc-plan-practice.ts');
const dispatch=req('src/data/manufacturing/lesson-editorial.ts').manufacturingLessonParagraph;
const supplement=req('src/data/manufacturing/supplement-practice.ts');
const lesson=req('src/data/manufacturing/mechanical.json').lessons.find(x=>x.id===data.lessonPatch.lessonId);
const snapshot=JSON.stringify(lesson),p=data.lessonPatch,locales=read('docs/ssw-workspace/manufacturing/approved-scope.json').targetLocales;
assert.deepEqual(Object.keys(data.locales).sort(),locales.slice().sort());
assert.deepEqual(Object.keys(p.wording).sort(),['ja',...locales].sort());
assert.equal(p.sourceHash,lesson.sourceHash);
let lessonRejections=0,questionRejections=0,translationPairs=0;
for(const loc of ['ja',...locales]){
 const w=p.wording[loc],before=loc==='ja'?lesson.paragraphs.find(x=>x.id===p.paragraphId).textJa:read('src/data/manufacturing/translations/'+loc+'.json').lessons[lesson.id].paragraphs.find(x=>x.id===p.paragraphId).text;
 assert.equal(w.before,before);assert(w.after.startsWith(before+'\n\n'));
 assert(w.after.includes('3+1+1=5')||w.after.includes('3＋1＋1＝5'));
 assert.equal(dispatch(lesson,p.paragraphId,loc,before),w.after);
 for(const [l,id,text] of [[{...lesson,sourceHash:'stale'},p.paragraphId,before],[lesson,'other',before],[lesson,p.paragraphId,before+'drift'],[{...lesson,paragraphs:[]},p.paragraphId,before]]){
  assert.equal(dispatch(l,id,loc,text),text);lessonRejections++;
 }
}
const exam=api.manufacturingQcPlanExams('mechanical')[0];assert(exam);
assert.equal(exam.questions.length,8);assert.equal(exam.officialSimulation,false);
assert.deepEqual(exam.questions.map(q=>q.optionsJa.length),[4,4,4,4,2,2,2,2]);
assert.deepEqual(exam.questions.map(q=>q.correctIndex),[0,2,1,3,1,0,1,0]);
assert.equal(api.manufacturingQcPlanExams('electrical').length,0);
const existing=supplement.manufacturingSupplementExams('mechanical');
const previousIds=[read('src/data/manufacturing/supplement-practice.json').id,'mfg1-tolerance-class-supplement',exam.id];
assert.deepEqual(existing.filter(e=>previousIds.includes(e.id)).map(e=>e.id),previousIds);
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const baselineStems=new Set(['mechanical','electrical','surface'].flatMap(s=>read('src/data/manufacturing/'+s+'.json').checks.flatMap(e=>e.questions.map(q=>q.stemJa))));
for(const q of exam.questions){
 const {sourceHash,...payload}=q;
 assert.equal(crypto.createHash('sha256').update(JSON.stringify(stable(payload))).digest('hex'),sourceHash);
 assert(!baselineStems.has(q.stemJa));assert.equal(q.optionReasonsJa.length,q.optionsJa.length);assert.equal(new Set(q.optionReasonsJa).size,q.optionsJa.length);
 for(const loc of locales){
  const t=api.manufacturingQcPlanTranslation(q,loc);assert(t);assert.equal(t.options.length,q.optionsJa.length);assert.equal(new Set(t.reasons).size,q.optionsJa.length);translationPairs++;
  assert.deepEqual(supplement.manufacturingSupplementTranslation(q,loc),t);
  for(const bad of [{...q,sourceHash:'stale'},{...q,stemJa:q.stemJa+'drift'},{...q,correctIndex:(q.correctIndex+1)%q.optionsJa.length},{...q,optionsJa:q.optionsJa.slice().reverse()},{...q,optionReasonsJa:['drift',...q.optionReasonsJa.slice(1)]},{...q,sources:[]}]){assert.equal(api.manufacturingQcPlanTranslation(bad,loc),null);questionRejections++;}
  const target=data.locales[loc][q.id],save=target.sourceHash;target.sourceHash='stale';
  assert.equal(api.manufacturingQcPlanTranslation(q,loc),null);target.sourceHash=save;
 }
 for(const loc of ['ja','xx','toString','__proto__'])assert.equal(api.manufacturingQcPlanTranslation(q,loc),null);
}
const beforeHash=lesson.sourceHash;lesson.sourceHash='stale';assert.equal(api.manufacturingQcPlanExams('mechanical').length,0);assert.equal(api.manufacturingQcPlanTranslation(exam.questions[0],'vi'),null);lesson.sourceHash=beforeHash;
const after=p.wording.ja.after;p.wording.ja.after='';assert.equal(api.manufacturingQcPlanExams('mechanical').length,0);p.wording.ja.after=after;
const times=[8,10,12],counts=times.map((_,i)=>i===0?3:1);assert.deepEqual(counts,[3,1,1]);assert.equal(counts.reduce((a,b)=>a+b),5);assert.equal(times[1]-times[0],2);assert.equal(times[2]-times[1],2);
const state=req('src/services/manufacturing-study-state.ts'),fresh=state.freshTestAttempt(exam);
assert.equal(state.restoreTestAttempt(JSON.stringify(fresh),exam)?.examId,exam.id);
assert.equal(state.restoreTestAttempt(JSON.stringify(fresh),{...exam,revision:exam.revision+'-changed'}),null);
assert.equal(state.gradeTest(exam,exam.questions.map(q=>q.correctIndex)).correct,8);
assert.equal(JSON.stringify(lesson),snapshot);
const original=exam.questions[0].optionsJa[0];exam.questions[0].optionsJa[0]='mutated';
assert.equal(api.manufacturingQcPlanExams('mechanical')[0].questions[0].optionsJa[0],original);
for(const f of ['nativeReviewed','domainReviewed','humanReviewed','physicalDeviceVerified'])assert.equal(data[f],false);
console.log(JSON.stringify({status:'PASS',questions:8,optionSpecificReasons:24,lessonLocales:13,translationPairs,questionDriftRejections:questionRejections,lessonDriftRejections:lessonRejections,staleTargetRejections:96,timelineCount:5,grading:'8/8',newAttemptRestore:true,staleRevisionRejected:true,existingExamsPreserved:true,physicalDeviceVerified:false}));
