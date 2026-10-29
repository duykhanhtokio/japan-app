// Preserve completion and quiz revisions for the one metadata-only shared-source correction.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../..');const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
(async()=>{
 const proof=read('docs/ssw-workspace/agriculture/completion-40/shared-scope-adoption.json');
 const current=read('src/data/agriculture/lessons.ja.json').lessons.find(l=>l.id===proof.afterLesson.id);
 assert.deepEqual(current,proof.afterLesson);
 const omitted=new Set(['sourceHash','levels','sources']);
 const strip=l=>Object.fromEntries(Object.entries(l).filter(([k])=>!omitted.has(k)));
 assert.deepEqual(strip(proof.beforeLesson),strip(current));
 const built=await require('esbuild').build({entryPoints:[path.join(root,'src/services/agriculture-study-state.ts')],bundle:true,write:false,platform:'node',format:'cjs'});
 const m={exports:{}};new Function('module','exports',built.outputFiles[0].text)(m,m.exports);const api=m.exports;
 const oldProgress={version:1,entries:{[current.id]:proof.beforeLesson.sourceHash}};
 assert(api.agricultureLessonDone(oldProgress,current));
 assert(api.agricultureLessonDone({version:1,entries:{[current.id]:current.sourceHash}},current));
 assert(!api.agricultureLessonDone(oldProgress,{...current,sourceHash:'0'.repeat(64)}));
 assert(!api.agricultureLessonDone({version:1,entries:{[current.id]:'f'.repeat(64)}},current));
 const base=read('docs/ssw-workspace/agriculture/completion-40/baseline.json').baseCommit;
 const prior=JSON.parse(cp.execFileSync('git',['show',base+':src/data/agriculture/weekly-checks.ja.json'],{cwd:root,encoding:'utf8'}));
 const banks=read('src/data/agriculture/weekly-checks.ja.json');let restored=0;
 for(const old of prior.exams){
  const live=banks.exams.find(e=>e.id===old.id);assert.deepEqual(live,old);
  if(old.questions.some(q=>q.lessonId===current.id)){
   const attempt=api.freshTestAttempt(old);attempt.answers[0]=old.questions[0].correctIndex;
   assert.deepEqual(api.restoreTestAttempt(JSON.stringify(attempt),live),attempt);restored++;
  }
 }
 assert(restored>0);
 console.log(JSON.stringify({status:'PASS',priorCompletionPreserved:true,futureOrUnknownHashesRejected:true,oldQuizRevisionsAndAnswersPreserved:true,affectedBanks:restored}));
})().catch(e=>{console.error(e);process.exitCode=1});
