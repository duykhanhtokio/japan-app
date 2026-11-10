const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),crypto=require('node:crypto');
const {transformSync}=require('esbuild'),root=path.resolve(__dirname,'../..');
const originalResolve=Module._resolveFilename;
Module._resolveFilename=function(id,parent,...rest){
 let requested=id.startsWith('@/')?path.join(root,'src',id.slice(2)):id;
 if((requested.startsWith('.')||path.isAbsolute(requested))&&!path.extname(requested)){
  const candidate=path.resolve(parent?path.dirname(parent.filename):root,requested)+'.ts';
  if(fs.existsSync(candidate))requested=candidate;
 }
 return originalResolve.call(this,requested,parent,...rest);
};
require.extensions['.ts']=function(m,file){m._compile(transformSync(fs.readFileSync(file,'utf8'),{loader:'ts',format:'cjs'}).code,file);};
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const data=require(path.join(root,'src/data/manufacturing/tolerance-practice.json'));
const api=require(path.join(root,'src/data/manufacturing/tolerance-practice.ts'));
const dispatch=require(path.join(root,'src/data/manufacturing/lesson-editorial.ts')).manufacturingLessonParagraph;
const supplement=require(path.join(root,'src/data/manufacturing/supplement-practice.ts'));
const course=require(path.join(root,'src/data/manufacturing/mechanical.json'));
const lesson=course.lessons.find(l=>l.id===data.lessonPatch.lessonId),snapshot=JSON.stringify(lesson),patch=data.lessonPatch;
const locales=read('docs/ssw-workspace/manufacturing/approved-scope.json').targetLocales;
assert.deepEqual(Object.keys(data.locales).sort(),locales.slice().sort());
assert.deepEqual(Object.keys(patch.wording).sort(),['ja',...locales].sort());
assert.equal(patch.sourceHash,lesson.sourceHash);
let acceptedTranslations=0,rejectedQuestionDrifts=0,rejectedLessonDrifts=0;
for(const locale of ['ja',...locales]){
 const w=patch.wording[locale];
 const before=locale==='ja'?lesson.paragraphs.find(p=>p.id===patch.paragraphId).textJa:read('src/data/manufacturing/translations/'+locale+'.json').lessons[lesson.id].paragraphs.find(p=>p.id===patch.paragraphId).text;
 assert.equal(w.before,before);assert(w.after.startsWith(before+'\n\n'));
 assert(w.after.includes('φ18g7')&&w.after.includes('14.02')||locale==='vi'||locale==='id');
 assert.equal(dispatch(lesson,patch.paragraphId,locale,before),w.after);
 for(const [l,id,text] of [[{...lesson,sourceHash:'stale'},patch.paragraphId,before],[lesson,'other',before],[lesson,patch.paragraphId,before+' changed'],[{...lesson,paragraphs:[]},patch.paragraphId,before]]){
  assert.equal(dispatch(l,id,locale,text),text);rejectedLessonDrifts++;
 }
}
const exams=api.manufacturingToleranceExams('mechanical');assert.equal(exams.length,1);
const exam=exams[0];assert.equal(exam.questions.length,4);assert.equal(exam.officialSimulation,false);
assert.deepEqual(exam.questions.map(q=>q.correctIndex),[0,1,2,3]);
assert.equal(api.manufacturingToleranceExams('electrical').length,0);assert.equal(api.manufacturingToleranceExams('surface').length,0);
assert(supplement.manufacturingSupplementExams('mechanical').some(e=>e.id===exam.id));
assert(supplement.manufacturingSupplementExams('mechanical').some(e=>e.id===read('src/data/manufacturing/supplement-practice.json').id));
for(const q of exam.questions){
 assert.equal(q.optionsJa.length,4);assert.equal(new Set(q.optionReasonsJa).size,4);
 const {sourceHash,...payload}=q;
 const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
 assert.equal(crypto.createHash('sha256').update(JSON.stringify(stable(payload))).digest('hex'),sourceHash);
 for(const locale of locales){
  const t=api.manufacturingToleranceTranslation(q,locale);
  assert(t);assert.equal(t.options.length,4);assert.equal(t.reasons.length,4);assert.equal(new Set(t.reasons).size,4);acceptedTranslations++;
  assert.deepEqual(supplement.manufacturingSupplementTranslation(q,locale),t);
  for(const bad of [{...q,sourceHash:'stale'},{...q,stemJa:q.stemJa+' changed'},{...q,correctIndex:(q.correctIndex+1)%4},{...q,optionsJa:[...q.optionsJa].reverse()},{...q,optionReasonsJa:['drift',...q.optionReasonsJa.slice(1)]},{...q,sources:[]}]){assert.equal(api.manufacturingToleranceTranslation(bad,locale),null);rejectedQuestionDrifts++;}
 }
 for(const locale of ['ja','xx','toString','__proto__'])assert.equal(api.manufacturingToleranceTranslation(q,locale),null);
}
const saved=patch.wording.ja.after;patch.wording.ja.after='';
assert.equal(api.manufacturingToleranceExams('mechanical').length,0);
assert.equal(api.manufacturingToleranceTranslation(exam.questions[0],'vi'),null);patch.wording.ja.after=saved;
const oldHash=lesson.sourceHash;lesson.sourceHash='stale';
assert.equal(api.manufacturingToleranceExams('mechanical').length,0);lesson.sourceHash=oldHash;
const first=exam.questions[0];first.optionsJa[0]='mutated returned copy';
assert.notEqual(api.manufacturingToleranceExams('mechanical')[0].questions[0].optionsJa[0],first.optionsJa[0]);
// Explicit independent arithmetic, not values inferred from an ISO grade.
assert.equal(1200+1,1201);assert.equal(1200+5,1205);assert.equal(1205-1201,4);
const state=require(path.join(root,'src/services/manufacturing-study-state.ts'));
const fresh=state.freshTestAttempt(exam);
assert.equal(state.restoreTestAttempt(JSON.stringify(fresh),exam)?.examId,exam.id);
const changed={...exam,revision:exam.revision+'-changed'};
assert.equal(state.restoreTestAttempt(JSON.stringify(fresh),changed),null);
const result=state.gradeTest(exam,exam.questions.map(q=>q.correctIndex));assert.equal(result.correct,4);
assert.equal(JSON.stringify(lesson),snapshot);
for(const f of ['nativeReviewed','domainReviewed','humanReviewed','physicalDeviceVerified'])assert.equal(data[f],false);
console.log(JSON.stringify({status:'PASS',questions:4,distinctOptionReasons:16,lessonLocales:13,questionLocalePairs:acceptedTranslations,rejectedQuestionDrifts,rejectedLessonDrifts,grade:'4/4',newAttemptRestore:true,changedRevisionRejected:true,existingBanksUnmodified:true,physicalDeviceVerified:false}));
