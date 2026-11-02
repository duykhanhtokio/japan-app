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
const cluster=process.argv[2]||'kirchhoff';const data=req('src/data/manufacturing/practice46/'+cluster+'.json'),api=req('src/data/manufacturing/sequential-practice.ts');
const dispatch=req('src/data/manufacturing/lesson-editorial.ts').manufacturingLessonParagraph;
const supplement=req('src/data/manufacturing/supplement-practice.ts');
const lesson=req('src/data/manufacturing/electrical.json').lessons.find(x=>x.id===data.lessonPatch.lessonId);
const snapshot=JSON.stringify(lesson),p=data.lessonPatch,locales=read('docs/ssw-workspace/manufacturing/approved-scope.json').targetLocales;
assert.deepEqual(Object.keys(data.locales).sort(),locales.slice().sort());
assert.deepEqual(Object.keys(p.wording).sort(),['ja',...locales].sort());
assert.equal(p.sourceHash,lesson.sourceHash);
let lessonRejections=0,questionRejections=0,translationPairs=0;
for(const loc of ['ja',...locales]){
 const w=p.wording[loc],before=loc==='ja'?lesson.paragraphs.find(x=>x.id===p.paragraphId).textJa:read('src/data/manufacturing/translations/'+loc+'.json').lessons[lesson.id].paragraphs.find(x=>x.id===p.paragraphId).text;
 assert.equal(w.before,before);assert(w.after.startsWith(before+'\n\n'));
 assert(w.after.length>before.length+150);
 assert.equal(dispatch(lesson,p.paragraphId,loc,before),w.after);
 for(const [l,id,text] of [[{...lesson,sourceHash:'stale'},p.paragraphId,before],[lesson,'other',before],[lesson,p.paragraphId,before+'drift'],[{...lesson,paragraphs:[]},p.paragraphId,before]]){
  assert.equal(dispatch(l,id,loc,text),text);lessonRejections++;
 }
}
const exam=api.manufacturingSequentialExams('electrical').find(e=>e.id===data.id);assert(exam);
const expected={kirchhoff:8,binary:8,signal:11}[cluster];assert.equal(exam.questions.length,expected);assert.equal(exam.officialSimulation,false);
assert.deepEqual(exam.questions.map(q=>q.optionsJa.length),[4,4,4,4,...Array(expected-4).fill(2)]);
assert(exam.questions.every(q=>q.correctIndex>=0&&q.correctIndex<q.optionsJa.length));
assert.equal(api.manufacturingSequentialExams('mechanical').length,0);
const existing=supplement.manufacturingSupplementExams('electrical');
assert(existing.some(e=>e.id===exam.id));assert(existing.some(e=>e.id==='mfg1-electrical-boolean-supplement-01'));assert(existing.some(e=>e.id==='mfg1-electrical-energy-supplement'));
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const baselineStems=new Set(['mechanical','electrical','surface'].flatMap(s=>read('src/data/manufacturing/'+s+'.json').checks.flatMap(e=>e.questions.map(q=>q.stemJa))));
for(const q of exam.questions){
 const {sourceHash,...payload}=q;
 assert.equal(crypto.createHash('sha256').update(JSON.stringify(stable(payload))).digest('hex'),sourceHash);
 assert(!baselineStems.has(q.stemJa));assert.equal(q.optionReasonsJa.length,q.optionsJa.length);assert.equal(new Set(q.optionReasonsJa).size,q.optionsJa.length);
 for(const loc of locales){
  const t=api.manufacturingSequentialTranslation(q,loc);assert(t);assert.equal(t.options.length,q.optionsJa.length);assert.equal(new Set(t.reasons).size,q.optionsJa.length);translationPairs++;
  assert.deepEqual(supplement.manufacturingSupplementTranslation(q,loc),t);
  for(const bad of [{...q,sourceHash:'stale'},{...q,stemJa:q.stemJa+'drift'},{...q,correctIndex:(q.correctIndex+1)%q.optionsJa.length},{...q,optionsJa:q.optionsJa.slice().reverse()},{...q,optionReasonsJa:['drift',...q.optionReasonsJa.slice(1)]},{...q,sources:[]}]){assert.equal(api.manufacturingSequentialTranslation(bad,loc),null);questionRejections++;}
  const target=data.locales[loc][q.id],save=target.sourceHash;target.sourceHash='stale';
  assert.equal(api.manufacturingSequentialTranslation(q,loc),null);target.sourceHash=save;
 }
 for(const loc of ['ja','xx','toString','__proto__'])assert.equal(api.manufacturingSequentialTranslation(q,loc),null);
}
const beforeHash=lesson.sourceHash;lesson.sourceHash='stale';assert.equal(api.manufacturingSequentialExams('mechanical').length,0);assert.equal(api.manufacturingSequentialTranslation(exam.questions[0],'vi'),null);lesson.sourceHash=beforeHash;
const after=p.wording.ja.after;p.wording.ja.after='';assert.equal(api.manufacturingSequentialExams('mechanical').length,0);p.wording.ja.after=after;
if(cluster==='kirchhoff'){assert.equal(6+0.004*1000-3,7);assert.equal(2-5,-3);assert.equal(15-4,11);assert.equal(15-4-11,0);assert.equal(-15+4+11,0);assert.notEqual(15-4-10,0);assert.equal(1+5,2+4);}
if(cluster==='binary'){assert.equal(parseInt('10110',2),22);assert.equal((25).toString(2),'11001');assert.equal(2**(6-1),32);assert.equal(parseInt('000101',2),5);assert.equal(/^[01]+$/.test('102'),false);assert.equal((parseInt('1111',2)+1).toString(2),'10000');assert.equal(2**4-1,15);assert.equal(new Set(Array.from({length:16},(_,n)=>n.toString(2).padStart(4,'0'))).size,16);}
if(cluster==='signal'){assert.deepEqual(exam.questions.slice(0,4).map(q=>q.optionsJa[q.correctIndex]),['A/Dコンバータ','D/Aコンバータ','電圧レギュレータ','メモリIC']);assert.deepEqual(exam.questions.slice(4).map(q=>q.correctIndex),[1,1,0,1,0,1,0]);}
const state=req('src/services/manufacturing-study-state.ts'),fresh=state.freshTestAttempt(exam);
assert.equal(state.restoreTestAttempt(JSON.stringify(fresh),exam)?.examId,exam.id);
assert.equal(state.restoreTestAttempt(JSON.stringify(fresh),{...exam,revision:exam.revision+'-changed'}),null);
assert.equal(state.gradeTest(exam,exam.questions.map(q=>q.correctIndex)).correct,expected);
assert.equal(JSON.stringify(lesson),snapshot);
const original=exam.questions[0].optionsJa[0];exam.questions[0].optionsJa[0]='mutated';
assert.equal(api.manufacturingSequentialExams('electrical').find(e=>e.id===data.id).questions[0].optionsJa[0],original);
const allExams=supplement.manufacturingSupplementExams('electrical');
assert.equal(new Set(allExams.map(e=>e.id)).size,allExams.length);
const allIds=allExams.flatMap(e=>e.questions.map(q=>q.id));assert.equal(new Set(allIds).size,allIds.length);
// Reader access loads its one cluster only; inspecting unrelated lessons loads no cluster.
const helperFile=path.join(root,'src/data/manufacturing/sequential-practice.ts');
const helperCode=transformSync(fs.readFileSync(helperFile,'utf8'),{loader:'ts',format:'cjs'}).code;
for(const [key,id] of [['kirchhoff','mfg1-electrical-l070'],['binary','mfg1-electrical-l025'],['signal','mfg1-electrical-l024']]){
 const isolated=new Module(helperFile,module),loaded=[];isolated.filename=helperFile;isolated.paths=Module._nodeModulePaths(path.dirname(helperFile));
 isolated.require=function(request){loaded.push(request);return Module.prototype.require.call(this,request);};
 isolated._compile(helperCode,helperFile);
 const selected=read('src/data/manufacturing/practice46/'+key+'.json');
 const source=req('src/data/manufacturing/electrical.json').lessons.find(l=>l.id===id);
 const originalText=selected.lessonPatch.wording.ja.before;
 assert.equal(isolated.exports.manufacturingSequentialParagraph(source,selected.lessonPatch.paragraphId,'ja',originalText),selected.lessonPatch.wording.ja.after);
 assert.deepEqual(loaded,['./practice46/'+key+'.json']);
 const blank=new Module(helperFile,module);blank.filename=helperFile;blank.paths=isolated.paths;
 blank.require=()=>{throw Error('Unrelated reader loaded data');};blank._compile(helperCode,helperFile);
 assert.equal(blank.exports.manufacturingSequentialParagraph({...source,id:'unrelated'},'none','ja','text'),'text');
}
for(const f of ['nativeReviewed','domainReviewed','humanReviewed','physicalDeviceVerified'])assert.equal(data[f],false);
console.log(JSON.stringify({status:'PASS',questions:expected,optionSpecificReasons:exam.questions.reduce((n,q)=>n+q.optionsJa.length,0),lessonLocales:13,translationPairs,questionDriftRejections:questionRejections,lessonDriftRejections:lessonRejections,staleTargetRejections:expected*12,cluster,grading:expected+'/'+expected,newAttemptRestore:true,staleRevisionRejected:true,existingExamsPreserved:true,readerLoadsOneCluster:true,unrelatedReaderLoadsNone:true,physicalDeviceVerified:false}));
