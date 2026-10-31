// Publisher-scoped data and version-transition checks; no external certification.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..'),base='e45d14a8858ca17cf8b6881ff358d0263b2e7bc6';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const before=p=>JSON.parse(execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:30*1024*1024}));
const session='docs/ssw-workspace/agriculture/session-20261031-hold-resolution';
const adoption=read(session+'/integration.json'),changed=new Set(adoption.changedLessonIds);
const oldLessons=before('src/data/agriculture/lessons.ja.json').lessons,lessons=read('src/data/agriculture/lessons.ja.json').lessons;
const byId=new Map(lessons.map(l=>[l.id,l])),byParagraph=new Map(lessons.flatMap(l=>l.paragraphs.map(p=>[p.id,l])));
assert.equal(lessons.length,241);assert.equal(changed.size,20);
for(const l of oldLessons)if(!changed.has(l.id))assert.deepEqual(byId.get(l.id),l,'Unrelated lesson changed '+l.id);
const oldRows=before('docs/ssw-workspace/agriculture/completion-40/source-reconciliation.json').rows;
const recon=read('docs/ssw-workspace/agriculture/completion-40/source-reconciliation.json'),rows=new Map(recon.rows.map(r=>[r.id,r]));
const targets=new Set(oldRows.filter(r=>r.disposition==='hold'&&['GENERAL','SOIL','SAFETY'].includes(r.id.split('-')[2])).map(r=>r.id));
assert.equal(targets.size,45);assert.deepEqual(new Set(adoption.processedSourceRows),targets);
let holds=0;
for(const old of oldRows){
 const row=rows.get(old.id);assert(row);
 if(!targets.has(old.id))assert.deepEqual(row,old,'Outside publisher scope '+old.id);
 else assert(row.disposition.startsWith('covered')||row.disposition.startsWith('excluded'));
 if(row.disposition==='hold')holds++;
 if(row.disposition.startsWith('covered'))for(const level of row.scopeLevels){
  const text=(row.paragraphIds||[]).some(id=>byParagraph.get(id)?.levels.includes(level));
  if(targets.has(row.id))assert(text,'Resolved statement inaccessible '+row.id+'/'+level);
 }
 assert(!row.humanReviewed&&!row.nativeReviewed&&!row.domainReviewed);
}
assert.equal(holds,10);
const languageSource=fs.readFileSync(path.join(root,'src/i18n/languages.ts'),'utf8');
const locales=[...languageSource.split('export type AppLanguage =')[0].matchAll(/'([^']+)'/g)].map(m=>m[1]).filter(l=>l!=='ja');
let touchedPairs=0;
for(const locale of locales){
 const p='src/data/agriculture/translations/'+locale+'.json',old=before(p),current=read(p);
 for(const l of lessons){
  if(!changed.has(l.id))assert.deepEqual(current[l.id],old[l.id],locale+'/'+l.id);
  else {assert.equal(current[l.id].sourceHash,l.sourceHash);assert.equal(current[l.id].translatedDirectlyFrom,'ja');assert.equal(current[l.id].nativeReviewed,false);touchedPairs++;}
 }
}
const policy=read('src/data/agriculture/authoring-exclusions.json');assert.equal(policy.rules.length,2);
const blockedPatterns=policy.rules.flatMap(r=>r.blockedJapanesePatterns||[]).map(p=>new RegExp(p,'u'));
const blockedNumbers=policy.rules.flatMap(r=>(r.printedAnnotations||[]).map(x=>x.value));
let questionCases=0,unchangedQuestionContents=0;
const banks=[];
for(const name of ['weekly-checks.ja.json','mock-exams.ja.json']){
 const old=before('src/data/agriculture/'+name),current=read('src/data/agriculture/'+name);banks.push({old,current});
 assert.deepEqual(current.exams.map(e=>e.id),old.exams.map(e=>e.id));
 const oldQuestions=new Map(old.exams.flatMap(e=>e.questions.map(q=>[q.id,q])));
 for(const e of current.exams)for(const q of e.questions){
  const a={...q},b={...oldQuestions.get(q.id)};delete a.lessonSourceHash;delete b.lessonSourceHash;
  assert.deepEqual(a,b,'Question meaning changed '+q.id);unchangedQuestionContents++;questionCases++;
  const text=[q.stemJa,...q.optionsJa,...q.optionReasonsJa].join(' ').normalize('NFKC');
  for(const pattern of blockedPatterns)assert(!pattern.test(text),'Excluded nursery-shift benefit '+q.id);
  const normalized=text.replace(/[\s,，]/g,'');
  for(const n of blockedNumbers)assert(!new RegExp('(?<![0-9])'+n+'(?![0-9])').test(normalized),'Excluded chart operand '+q.id);
 }
}
assert.equal(questionCases,1227);
for(const l of lessons)for(const p of l.paragraphs)if(/糸状菌|病害/.test(p.textJa))assert(!/(70.{0,5}80|七.{0,4}八|7.{0,4}8割)/.test(p.textJa),'Unverified fungal ratio '+p.id);
const oldFigures=before('src/data/agriculture/recognition-images.json').images,figures=read('src/data/agriculture/recognition-images.json').images;
assert.equal(figures.length,186);
for(const f of figures){const old=oldFigures.find(o=>o.id===f.id);assert(old);assert.equal(f.assetSha256,old.assetSha256);assert.equal(f.assetPath,old.assetPath);for(const [lid,hash]of Object.entries(f.lessonSourceHashes))if(changed.has(lid))assert.equal(hash,byId.get(lid).sourceHash);}
(async()=>{
 const built=await require('esbuild').build({entryPoints:[path.join(root,'src/services/agriculture-study-state.ts')],bundle:true,write:false,platform:'node',format:'cjs'});
 const module={exports:{}};new Function('module','exports',built.outputFiles[0].text)(module,module.exports);const api=module.exports;
 let versionTransitions=0;
 for(const {old,current}of banks)for(const e of current.exams){const a=api.freshTestAttempt(e);assert(api.restoreTestAttempt(JSON.stringify(a),e));const oldExam=old.exams.find(x=>x.id===e.id);if(oldExam.revision!==e.revision){assert.equal(api.restoreTestAttempt(JSON.stringify(api.freshTestAttempt(oldExam)),e),null);versionTransitions++;}}
 const report={status:'PASS',processedSourceItems:45,remainingOutsideScopeHolds:10,changedLessons:changed.size,updatedLessonLocalePairs:touchedPairs,translationFieldPatches:adoption.translationFieldPatches,newParagraphs:adoption.newParagraphIds.length,unchangedQuestionContents,sourceExclusionAuditCases:questionCases,validatedVersionTransitions:versionTransitions,rasterFilesPreserved:figures.length,questionTextChanges:0,crossWorkerContentReview:false,humanReviewed:false,nativeReviewed:false,domainReviewed:false,physicalDeviceTested:false};
 fs.writeFileSync(path.join(root,session,'validation.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exitCode=1;});
