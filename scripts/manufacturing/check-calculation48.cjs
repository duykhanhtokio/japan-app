const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),{transformSync}=require('esbuild'),resolve=Module._resolveFilename;
Module._resolveFilename=function(id,parent,...rest){let p=id.startsWith('@/')?path.join(root,'src',id.slice(2)):id;if((p.startsWith('.')||path.isAbsolute(p))&&!path.extname(p)){const candidate=path.resolve(parent?path.dirname(parent.filename):root,p)+'.ts';if(fs.existsSync(candidate))p=candidate;}return resolve.call(this,p,parent,...rest);};
require.extensions['.ts']=(m,file)=>m._compile(transformSync(fs.readFileSync(file,'utf8'),{loader:'ts',format:'cjs'}).code,file);
const req=p=>require(path.join(root,p)),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const specs={density:['mechanical','mfg1-mechanical-lesson-023','example'],resistivity:['electrical','mfg1-electrical-l068','section-1'],faraday:['surface','mfg1-surface-lesson-028','example']};
const key=process.argv[2]||'density';assert(Object.hasOwn(specs,key));const [specialty,lid,pid]=specs[key];
const dataPath='src/data/manufacturing/calculation48/'+key+'.json',snapshot=read(dataPath);
const api=req('src/data/manufacturing/calculation48.ts'),dispatch=req('src/data/manufacturing/lesson-editorial.ts').manufacturingLessonParagraph;
const courses=Object.fromEntries(['mechanical','electrical','surface'].map(s=>[s,req('src/data/manufacturing/'+s+'.json')]));
const coreSnapshots=Object.fromEntries(Object.entries(courses).map(([s,c])=>[s,JSON.stringify(c)]));
const lesson=courses[specialty].lessons.find(l=>l.id===lid),paragraph=lesson.paragraphs.find(p=>p.id===pid),locales=read('docs/ssw-workspace/manufacturing/approved-scope.json').targetLocales;
const files=Object.keys(specs).map(k=>path.join(root,'src/data/manufacturing/calculation48/'+k+'.json'));
assert(files.every(f=>!require.cache[f]));
assert.equal(dispatch(courses.mechanical.lessons[0],'explanation','ja','unrelated'),'unrelated');
assert(files.every(f=>!require.cache[f]),'unrelated lesson must not load any new cluster');
assert.equal(dispatch(lesson,pid,'ja',paragraph.textJa),snapshot.lessonPatch.wording.ja.after);
assert(require.cache[path.join(root,dataPath)]);
for(const f of files.filter(f=>f!==path.join(root,dataPath)))assert(!require.cache[f],'only matching reader cluster may load');
const data=req(dataPath),patch=data.lessonPatch;
assert.deepEqual(Object.keys(patch.wording).sort(),['ja',...locales].sort());assert.deepEqual(Object.keys(data.locales).sort(),locales.slice().sort());
const get=()=>api.manufacturingCalculation48Exams(specialty).find(e=>e.id===data.id);
const exam=get();assert(exam);assert.equal(exam.questions.length,4);assert.equal(exam.officialSimulation,false);
assert.deepEqual([0,1,2,3].map(i=>exam.questions.filter(q=>q.correctIndex===i).length),[1,1,1,1]);
const supplement=req('src/data/manufacturing/supplement-practice.ts');
assert.equal(supplement.manufacturingSupplementExams(specialty).filter(e=>e.id===exam.id).length,1,'actual catalog contains exactly one new exam');
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const escaped=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{Text}=require('react-native-web');
const render=s=>{const html=renderToStaticMarkup(React.createElement(Text,{selectable:true},s));assert(html.includes(escaped(s)));};
const translations=req('src/data/manufacturing/translations.ts');let negativeLessons=0,negativeQuestions=0,negativeTargets=0,renderedLessons=0,renderedQuestions=0;
for(const loc of ['ja',...locales]){
 const before=loc==='ja'?paragraph.textJa:translations.manufacturingTranslation(lesson,loc).paragraphs.find(p=>p.id===pid).text;
 assert.equal(before,patch.wording[loc].before,'effective target, not a stale raw record');
 assert.equal(dispatch(lesson,pid,loc,before),patch.wording[loc].after);render(dispatch(lesson,pid,loc,before));renderedLessons++;
 for(const [l,p,t] of [[{...lesson,sourceHash:'stale'},pid,before],[{...lesson,paragraphs:[]},pid,before],[lesson,pid+'-wrong',before],[lesson,pid,before+'-changed']]){assert.equal(dispatch(l,p,loc,t),t);negativeLessons++;}
}
const baselineStems=new Set(['mechanical','electrical','surface'].flatMap(s=>[...courses[s].checks.flatMap(e=>e.questions),...read('src/data/manufacturing/completion37/'+s+'.json').checks.flatMap(e=>e.questions),...read('src/data/manufacturing/mocks/'+s+'.json').exams.flatMap(e=>[...e.sections.theory.questions,...e.sections.practical.questions])].map(q=>q.stemJa)));
for(const q of exam.questions){
 const {sourceHash,...payload}=q;assert.equal(crypto.createHash('sha256').update(JSON.stringify(stable(payload))).digest('hex'),sourceHash);
 assert(!baselineStems.has(q.stemJa),'do not duplicate an existing stem');assert.equal(new Set(q.optionReasonsJa).size,4);
 render(q.stemJa);renderedQuestions++;
 for(const loc of locales){
  const t=api.manufacturingCalculation48Translation(q,loc);assert(t);assert.deepEqual(t,supplement.manufacturingSupplementTranslation(q,loc));
  assert.equal(t.options.length,4);assert.equal(new Set(t.reasons).size,4);render(t.stem);t.options.forEach(render);t.reasons.forEach(render);renderedQuestions++;
  for(const bad of [{...q,sourceHash:'stale'},{...q,stemJa:q.stemJa+'-changed'},{...q,correctIndex:(q.correctIndex+1)%4},{...q,lessonId:'other'},{...q,optionsJa:q.optionsJa.slice().reverse()},{...q,optionReasonsJa:['changed',...q.optionReasonsJa.slice(1)]},{...q,sources:[]}]){assert.equal(api.manufacturingCalculation48Translation(bad,loc),null);negativeQuestions++;}
  const target=data.locales[loc][q.id],saved=target.sourceHash;target.sourceHash='stale';assert.equal(api.manufacturingCalculation48Translation(q,loc),null);target.sourceHash=saved;negativeTargets++;
 }
 for(const loc of ['ja','xx','toString','__proto__'])assert.equal(api.manufacturingCalculation48Translation(q,loc),null);
}
const originalHash=lesson.sourceHash;lesson.sourceHash='stale';assert.equal(get(),undefined);assert.equal(api.manufacturingCalculation48Translation(exam.questions[0],'vi'),null);lesson.sourceHash=originalHash;
const canonical=patch.wording.ja.after;patch.wording.ja.after='changed';assert.equal(get(),undefined);assert.equal(dispatch(lesson,pid,'ja',paragraph.textJa),paragraph.textJa);patch.wording.ja.after=canonical;
const state=req('src/services/manufacturing-study-state.ts'),attempt=state.freshTestAttempt(exam);
assert.equal(state.restoreTestAttempt(JSON.stringify(attempt),exam)?.examId,exam.id);
assert.equal(state.restoreTestAttempt(JSON.stringify(attempt),{...exam,revision:exam.revision+'-changed'}),null);
assert.equal(state.gradeTest(exam,exam.questions.map(q=>q.correctIndex)).correct,4);
const originalOption=exam.questions[0].optionsJa[0];exam.questions[0].optionsJa[0]='changed';assert.equal(get().questions[0].optionsJa[0],originalOption);
for(const [s,c] of Object.entries(courses))assert.equal(JSON.stringify(c),coreSnapshots[s]);
for(const field of ['nativeReviewed','domainReviewed','physicalDeviceVerified','wholeSourceClosed'])assert.equal(data[field],false);
console.log(JSON.stringify({status:'PASS',cluster:key,questions:4,questionLocalePairs:48,lessonLocales:13,negativeLessons,negativeQuestions,negativeTargets,renderedLessons,renderedQuestionLocales:renderedQuestions,renderer:'ReactNativeWebTextSSR_not_browser_or_physical_device',grading:'4/4',resumeAndStaleRevision:'PASS',oneReaderClusterOnDemand:true,existingCoreUnchanged:true,whole574KnowledgeClosed:false}));
