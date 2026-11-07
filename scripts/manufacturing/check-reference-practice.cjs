// Tests the actual catalog/state adapters, not a duplicate implementation.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const esbuild=require('esbuild');
 const bundle=await esbuild.build({stdin:{contents:`export * from './src/data/manufacturing/mocks';export * from './src/data/manufacturing/reference-practice';export * from './src/services/manufacturing-mock-state';export const selection=require('./src/data/manufacturing/reference-practice.json');`,resolveDir:root,loader:'ts'},bundle:true,write:false,platform:'node',format:'cjs',tsconfigRaw:{compilerOptions:{baseUrl:root,paths:{'@/*':['src/*']}}}});
 const m={exports:{}};new Function('module','exports',bundle.outputFiles[0].text)(m,m.exports);const api=m.exports,selection=api.selection;
 assert.equal(selection.forms.length,3);assert.equal(selection.countedAsNewOriginalQuestions,false);
 assert.equal(selection.referenceInventorySha256,sha(fs.readFileSync(path.join(root,'docs/ssw-workspace/manufacturing/batch28-reference-exams/reference-inventory.json'))));
 for(const [p,h] of Object.entries(selection.sourceBankSha256))assert.equal(sha(fs.readFileSync(path.join(root,p))),h);
 let questions=0,translationPairs=0,rubyFields=0;
 const uniqueForms=new Set(),keys=new Set(),locales=Object.keys(read('src/data/manufacturing/mock-translations.json').locales);
 assert.equal(locales.length,12);
 for(const specialty of ['mechanical','electrical','surface']){
  const original=read('src/data/manufacturing/mocks/'+specialty+'.json').exams,all=api.loadManufacturingMocks(specialty),extra=all[10];
  assert.equal(original.length,10);assert.equal(all.length,11);assert.deepEqual(all.slice(0,10),original);
  assert.equal(extra.id,'mfg1-'+specialty+'-reference-practice-2025-01');
  for(const e of all){assert(!uniqueForms.has(e.id));uniqueForms.add(e.id);const k=api.manufacturingMockKey('qa',specialty,e.id);assert(!keys.has(k));keys.add(k);}
  const originalQuestions=new Map(original.flatMap(e=>[...e.sections.theory.questions,...e.sections.practical.questions]).map(q=>[q.id,q]));
  for(const section of api.MOCK_SECTION_IDS){
   const def=extra.sections[section],count=section==='theory'?30:10;
   assert.equal(def.questions.length,count);assert.equal(new Set(def.questions.map(q=>q.lessonId)).size,count);
   assert.equal(def.durationMs,40*60*1000);assert.equal(def.passMinimumCorrect,section==='theory'?20:6);
   const ids=new Set(),answers=def.questions.map(q=>q.correctIndex),positions=[0,0,0,0];
   for(const q of def.questions){
    assert(!ids.has(q.id));ids.add(q.id);assert.deepEqual(q,originalQuestions.get(q.id),'Question bytes/identity preserved');
    positions[q.correctIndex]++;questions++;
    for(const locale of locales){const t=api.manufacturingMockTranslation(q,locale);assert(t&&t.stem&&t.options.length===q.optionsJa.length&&t.reasons.length===q.optionsJa.length);assert.equal(t.nativeReviewed,false);translationPairs++;}
    for(const field of ['stem',...q.optionsJa.map((_,i)=>i)]){
     const ruby=api.manufacturingMockRuby(q,field);assert(ruby,'Missing original ruby '+q.id);assert.equal(ruby.map(p=>p.text).join(''),field==='stem'?q.stemJa:q.optionsJa[field]);rubyFields++;
    }
   }
   assert(!answers.some((n,i)=>i>1&&n===answers[i-1]&&n===answers[i-2]));
   assert.deepEqual(section==='theory'?positions.slice(0,2):positions.slice().sort(),section==='theory'?[15,15]:[2,2,3,3]);
  }
  let a=api.freshManufacturingMock(extra),now=100000;
  a=api.startManufacturingMockSection(a,extra,'theory',now);
  a=api.answerManufacturingMock(a,extra,'theory',0,extra.sections.theory.questions[0].correctIndex,now+1);
  assert.deepEqual(api.restoreManufacturingMock(JSON.stringify(a),extra),a);
  assert.equal(api.restoreManufacturingMock(JSON.stringify(a),{...extra,revision:'stale'}),null);
  for(const id of api.MOCK_SECTION_IDS){
   if(id==='practical')a=api.startManufacturingMockSection(a,extra,id,now);
   extra.sections[id].questions.forEach((q,i)=>{a=api.answerManufacturingMock(a,extra,id,i,q.correctIndex,now+i+1);});
   now+=100;a=api.submitManufacturingMockSection(a,extra,id,now);now+=1;
  }
  const result=api.gradeManufacturingMock(a,extra);assert(result.passed&&result.theory.correct===30&&result.practical.correct===10);
  for(const id of api.MOCK_SECTION_IDS){
   const fail=JSON.parse(JSON.stringify(a));fail.sections[id].answers=extra.sections[id].questions.map((q,i)=>i<extra.sections[id].passMinimumCorrect-1?q.correctIndex:(q.correctIndex+1)%q.optionsJa.length);
   assert.equal(api.gradeManufacturingMock(fail,extra).passed,false,'Both sections must pass');
  }
  let expired=api.startManufacturingMockSection(api.freshManufacturingMock(extra),extra,'theory',1000);
  expired=api.normalizeManufacturingMock(expired,extra,1000+2400000);assert.equal(expired.sections.theory.submission,'expired');
  const changed=JSON.parse(JSON.stringify(original));changed.forEach(e=>['theory','practical'].forEach(id=>e.sections[id].questions.forEach(q=>q.sourceHash='stale')));
  assert.equal(api.referenceManufacturingMocks(specialty,changed).length,0,'Stale optional forms fail closed');
  assert.equal(api.referenceManufacturingMocks(specialty,[]).length,0,'Missing optional source does not fabricate questions');
 }
 const result={status:'PASS',originalForms:30,additionalCuratedForms:3,catalogForms:uniqueForms.size,reusedQuestionAppearances:questions,newOriginalQuestions:0,translationPairs,rubyFields,sourceIdentityPreserved:true,independentSessionKeys:true,restoreRevisionExpiryAndThresholds:true,nativeReviewed:false,domainReviewed:false,releaseReady:false};
 console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exitCode=1});
