const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
(async()=>{
 const out=await require('esbuild').build({entryPoints:[path.join(root,'src/data/manufacturing/translations.ts')],bundle:true,platform:'node',format:'cjs',write:false});
 const m={exports:{}};new Function('module','exports',out.outputFiles[0].text)(m,m.exports);
 const {manufacturingTranslation:lessonLookup,manufacturingQuestionTranslation:questionLookup}=m.exports;
 const th=read('src/data/manufacturing/translations/th.json').lessons,tq=read('src/data/manufacturing/translations/questions.th.json').questions;
 assert.equal(Object.keys(th).length,105);assert.equal(Object.keys(tq).length,180);
 let lessons=0,questions=0,unavailable=0,stale=0;
 for(const specialty of ['mechanical','electrical','surface']){
  const course=read('src/data/manufacturing/'+specialty+'.json');
  for(const l of course.lessons){
   assert.deepEqual(lessonLookup(l,'th'),th[l.id]??null);lessons++;
   assert.equal(lessonLookup({...l,sourceHash:'stale'},'th'),null);stale++;
   assert.equal(lessonLookup(l,'unknown-locale'),null);unavailable++;
  }
  for(const q of course.checks.flatMap(c=>c.questions)){
   assert.deepEqual(questionLookup(q,'th'),tq[q.id]??null);questions++;
   assert.equal(questionLookup({...q,sourceHash:'stale'},'th'),null);stale++;
   assert.equal(questionLookup(q,'unknown-locale'),null);unavailable++;
  }
 }
 console.log(JSON.stringify({status:'PASS',lessonLookups:lessons,questionLookups:questions,staleRejected:stale,unsupportedLocaleNull:unavailable,thaiLessons:105,thaiQuestions:180}));
})().catch(e=>{console.error(e);process.exitCode=1});
