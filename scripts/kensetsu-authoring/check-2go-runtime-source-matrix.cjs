// Inspect the real adapters; asset imports are stubbed, not visually tested.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),modules=process.env.TOKUTEI_QA_MODULES||root;
const dep=name=>require(require.resolve(name,{paths:[modules]}));
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
(async()=>{
 const result=await dep('esbuild').build({stdin:{contents:['src/data/kensetsu/index.ts','src/data/kensetsu/scope.ts','src/data/kensetsu/review-tests.ts'].map(p=>`export * from ${JSON.stringify(path.join(root,p))};`).join('\n'),resolveDir:root},bundle:true,write:false,platform:'node',format:'cjs',logLevel:'error',plugins:[{name:'art-import-only',setup(b){b.onResolve({filter:/\.(png|jpe?g|webp)$/},a=>({path:a.path,namespace:'art'}));b.onLoad({filter:/.*/,namespace:'art'},()=>({contents:'export default 1;',loader:'js'}));}}]});
 const box={exports:{}};new Function('module','exports','require',result.outputFiles[0].text)(box,box.exports,dep);const m=box.exports;
 const scopes=[];
 for(const field of ['utilities','building','civil'])for(const subject of ['theory','practical','foreman']){
  const one=m.sessionsForScope('1',field,subject),two=m.sessionsForScope('2',field,subject);
  const exams=m.reviewTestsForScope('2',field,subject),questions=exams.flatMap(e=>e.questions);
  if(subject==='foreman'){assert.equal(one.length,0);assert.equal(two.length,28);assert.equal(exams.length,0);}
  else{
   assert.deepEqual(two.map(s=>s.id),one.map(s=>s.id));two.forEach((s,i)=>assert.strictEqual(s,one[i]));
   const original=m.reviewTestsForScope('1',field,subject);assert.deepEqual(exams.map(e=>e.questions),original.map(e=>e.questions));
   exams.forEach((e,i)=>assert.notEqual(e.id,original[i].id));assert.equal(questions.length,400);
  }
  assert.notEqual(m.completionKey('learner','1',field),m.completionKey('learner','2',field));
  const refs=new Map();for(const q of questions)for(const r of q.sourceReferences){
   const ids=refs.get(r.sessionId)||new Map();for(const id of r.paragraphIds){const qs=ids.get(id)||new Set();qs.add(q.id);ids.set(id,qs);}refs.set(r.sessionId,ids);
  }
  scopes.push({level:'2',field,subject,lessons:two.length,tests:exams.length,questions:questions.length,
   reusedByReferenceFrom1go:subject!=='foreman',independentSpecialist2goTestClaimed:false,
   lessonEvidence:two.map(s=>({lessonId:s.id,revision:s.revision,scopeRevision:s.scopeRevision??null,
    sourceReferences:s.sourceReferences,paragraphs:s.clusters.flatMap(c=>c.paragraphs.map(p=>({id:p.id,clusterId:c.id,japaneseSha256:sha(p.ja),
     questionIds:[...(refs.get(s.id)?.get(p.id)||[])],hasIndividualQuestion:(refs.get(s.id)?.get(p.id)?.size||0)>0}))),
    ungradedActivityCount:s.clusters.filter(c=>c.learningActivity).length}))});
 }
 const lessonEvidence={};for(const scope of scopes){scope.lessonEvidenceKeys=scope.lessonEvidence.map(e=>{const key=sha(JSON.stringify(e));lessonEvidence[key]=e;return key;});delete scope.lessonEvidence;}
 const report={date:'2026-11-02',status:'PASS_REAL_RUNTIME_REUSE_SOURCE_AND_ASSESSMENT_INDEX_NOT_SEMANTIC_COVERAGE',
  sameCanonicalObjectsAndQuestionPayloadsVerified:true,levelCompletionKeysAndExamIdsSeparate:true,
  assetImportAdapter:true,assetPixelsInspected:false,sourceAtomicCoverageVerified:false,
  questionReferencesProveAssessmentPresenceNotAccuracy:true,physicalDeviceTested:false,releaseReady:false,scopes,lessonEvidence};
 const out=path.join(root,'docs/ssw-workspace/kensetsu/TWO_GO_RUNTIME_SOURCE_MATRIX_20261102.json');
 fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({status:report.status,scopes:scopes.map(({field,subject,lessons,tests,questions})=>({field,subject,lessons,tests,questions}))}));
})().catch(e=>{console.error(e);process.exit(1)});
