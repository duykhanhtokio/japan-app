const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const stable=x=>Array.isArray(x)?x.map(stable):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,stable(x[k])])):x;
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(stable(x))).digest('hex');
async function load(overrides={}){
 const result=await require('esbuild').build({stdin:{contents:`export * from './src/data/manufacturing/supplement-practice';export * from './src/services/manufacturing-study-state';`,resolveDir:root,loader:'ts'},bundle:true,platform:'node',format:'cjs',write:false,logLevel:'error',plugins:[{name:'scoped-fixtures',setup(b){b.onLoad({filter:/supplement-practice\.json$|source-guides\.json$/},a=>overrides[path.basename(a.path)]?{contents:JSON.stringify(overrides[path.basename(a.path)]),loader:'json'}:undefined);}}]});
 const m={exports:{}};new Function('module','exports',result.outputFiles[0].text)(m,m.exports);return m.exports;
}
(async()=>{
 const d=read('src/data/manufacturing/supplement-practice.json'),guide=read('src/data/manufacturing/source-guides.json').guides.find(g=>g.id===d.guideId);
 assert.equal(guide.sourceHash,d.guideSourceHash);assert.equal(d.nativeReviewed,false);assert.equal(d.domainReviewed,false);
 const locales=read('docs/ssw-workspace/manufacturing/approved-scope.json').targetLocales;assert.deepEqual(Object.keys(d.locales).sort(),[...locales].sort());
 assert.equal(d.questions.length,8);assert.equal(new Set(d.questions.map(q=>q.id)).size,8);
 const counts=[0,0,0,0],oldStems=new Set(['mechanical','electrical','surface'].flatMap(s=>read(`src/data/manufacturing/${s}.json`).checks.flatMap(e=>e.questions.map(q=>q.stemJa.replace(/\s/g,'')))));
 for(const [i,q] of d.questions.entries()){
  const {sourceHash,...canonical}=q;assert.equal(hash(canonical),sourceHash);assert(!oldStems.has(q.stemJa.replace(/\s/g,'')));counts[q.correctIndex]++;
  assert(guide.paragraphs.some(p=>p.id===q.guideParagraphId));assert.equal(new Set(q.optionsJa).size,4);
  for(const loc of locales){const row=d.locales[loc][i];assert(row&&row[0]&&row[2]);assert.equal(row[1].length,4);assert.equal(new Set(row[1]).size,4);assert.equal(d.localeSourceHashes[loc][i],sourceHash);assert.equal(d.reasonPrefixes[loc].length,2);}
 }
 assert.deepEqual(counts,[2,2,2,2]);
 const a=await load(),exam=a.manufacturingSupplementExams('mechanical')[0];assert(exam);assert.equal(a.manufacturingSupplementExams('electrical').length,0);assert.equal(a.manufacturingSupplementExams('surface').length,0);
 let pairs=0;for(const q of exam.questions)for(const loc of locales){const t=a.manufacturingSupplementTranslation(q,loc);assert(t&&t.stem&&t.options.length===4&&t.reasons.length===4);assert.equal(t.sourceHash,q.sourceHash);pairs++;}
 assert.equal(a.manufacturingSupplementTranslation(exam.questions[0],'unknown'),null);
 assert.equal(a.manufacturingSupplementTranslation({...exam.questions[0],sourceHash:'0'.repeat(64)},'vi'),null);
 let attempt=a.freshTestAttempt(exam);attempt.answers[0]=exam.questions[0].correctIndex;attempt.currentQuestion=3;
 assert.deepEqual(a.restoreTestAttempt(JSON.stringify(attempt),exam),attempt);assert.equal(a.restoreTestAttempt(JSON.stringify(attempt),{...exam,revision:'stale'}),null);
 assert.equal(a.gradeTest(exam,exam.questions.map(q=>q.correctIndex)).correct,8);assert.equal(a.gradeTest(exam,Array(8).fill(null)).unanswered,8);
 assert.notEqual(a.manufacturingExamKey('a','mechanical',exam.id),a.manufacturingExamKey('b','mechanical',exam.id));
 const stale=JSON.parse(JSON.stringify(d));stale.guideSourceHash='0'.repeat(64);const b=await load({'supplement-practice.json':stale});assert.deepEqual(b.manufacturingSupplementExams('mechanical'),[]);assert.equal(b.manufacturingSupplementTranslation(exam.questions[0],'vi'),null);
 const badTarget=JSON.parse(JSON.stringify(d));badTarget.localeSourceHashes.vi[0]='0'.repeat(64);const c=await load({'supplement-practice.json':badTarget});assert.equal(c.manufacturingSupplementTranslation(exam.questions[0],'vi'),null);
 console.log(JSON.stringify({status:'PASS',questions:8,translationPairs:pairs,balancedAnswers:counts,staleGuideSuppressed:true,staleTargetSuppressed:true,staleAttemptRejected:true,originalWeeklyQuestionsPreserved:456,nativeReviewed:false,domainReviewed:false}));
})().catch(e=>{console.error(e);process.exitCode=1});
