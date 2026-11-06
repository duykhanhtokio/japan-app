// Dependency-free Node24 execution of current TS data/state helpers; not UI render QA.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict'),cp=require('node:child_process'),zlib=require('node:zlib'),{stripTypeScriptTypes}=require('node:module');
const root=path.resolve(__dirname,'../..'),dir='docs/ssw-workspace/source-coverage-v2/',read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')),hash=x=>crypto.createHash('sha256').update(x).digest('hex'),cache=new Map();
function load(file){
 file=path.resolve(root,file);if(!path.extname(file))file=fs.existsSync(file+'.ts')?file+'.ts':path.join(file,'index.ts');if(cache.has(file))return cache.get(file).exports;if(file.endsWith('.json')){const m={exports:JSON.parse(fs.readFileSync(file,'utf8'))};cache.set(file,m);return m.exports;}
 const m={exports:{}};cache.set(file,m);let text=stripTypeScriptTypes(fs.readFileSync(file,'utf8')),names=[];
 text=text.replace(/import\s+(\w+)\s+from\s*(['"])([^'"]+)\2\s*;/g,(_,name,q,target)=>`const ${name}=require(${JSON.stringify(target)});`);
 text=text.replace(/import\s*\{([^}]+)\}\s*from\s*(['"])([^'"]+)\2\s*;/g,(_,items,q,target)=>`const {${items}}=require(${JSON.stringify(target)});`);
 text=text.replace(/export\s*\{([^}]+)\}\s*from\s*(['"])([^'"]+)\2\s*;/g,(_,items,q,target)=>{const parts=items.split(',').map(s=>s.trim()).filter(Boolean);assert(parts.every(p=>/^\w+$/.test(p)),'Only direct named reexports supported');names.push(...parts);return `const {${parts.join(',')}}=require(${JSON.stringify(target)});`;});
 text=text.replace(/export\s+(function|const|let|class)\s+(\w+)/g,(_,kind,name)=>{names.push(name);return `${kind} ${name}`;});assert(!/^\s*(import|export)\s/m.test(text),'Unsupported runtime module syntax '+file);
 const req=id=>{assert(id.startsWith('.'),'Unexpected runtime dependency '+id);return load(path.resolve(path.dirname(file),id));};new vm.Script('(function(require,module,exports){'+text+'\nObject.assign(module.exports,{'+names.join(',')+'});})',{filename:file}).runInThisContext()(req,m,m.exports);return m.exports;
}




const payload=load('src/data/manufacturing/source64-line-roles.json'),api=load('src/data/manufacturing/supplement-practice.ts'),helper=load('src/data/manufacturing/source64-line-roles.ts'),editorial=load('src/data/manufacturing/lesson-editorial.ts'),state=load('src/services/manufacturing-study-state.ts'),course=load('src/data/manufacturing/mechanical.json');
const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let pairs=0,guards=0,fields=0,questions=0;
assert.equal(payload.rows.length,3);assert.equal(payload.recoveryMode,'reimplemented_from_verified_GitHub_not_recovered_d72833f84');
for(const row of payload.rows){
 assert.equal(row.revision,hash(JSON.stringify(row.questions)));const b=row.teachingBinding,l=course.lessons.find(l=>l.id===b.lessonId);assert.equal(l.sourceHash,b.lessonSourceHash);assert.equal(l.paragraphs.find(p=>p.id===b.paragraphId).textJa,b.rawJapanese);assert.equal(editorial.manufacturingLessonParagraph(l,b.paragraphId,'ja',b.rawJapanese),b.effectiveJapanese);
 const exam=api.manufacturingSupplementExams('mechanical').find(e=>e.id===row.id);assert(exam);assert.deepEqual(exam.questions,row.questions);assert.equal(api.manufacturingSupplementExams('mechanical').filter(e=>e.id===row.id).length,1);
 const a=state.freshTestAttempt(exam);a.answers=exam.questions.map(q=>q.correctIndex);assert.equal(state.gradeTest(exam,a.answers).correct,row.questions.length);assert.deepEqual(state.restoreTestAttempt(JSON.stringify(a),exam),a);assert.equal(state.restoreTestAttempt(JSON.stringify(a),{...exam,revision:exam.revision+'stale'}),null);guards++;
 for(const q of row.questions){questions++;const {sourceHash,...plain}=q;assert.equal(sourceHash,hash(JSON.stringify(plain)));assert.equal(q.optionsJa.length,4);assert.equal(new Set(q.optionsJa).size,4);assert.equal(new Set(q.optionReasonsJa).size,4);assert.deepEqual(q.sources,[{documentId:'mfg1-mechanical-source',pdfPage:89,printedPage:81}]);
 for(const text of [q.stemJa,...q.optionsJa,...q.optionReasonsJa]){assert(!/[一-龯々]/.test(text.replace(/[一-龯々]+（[ぁ-ゖー]+）/g,'')),'Unannotated Japanese '+q.id);fields++;}
 assert.deepEqual(Object.keys(row.locales).sort(),locales.slice().sort());
 for(const locale of locales){const t=api.manufacturingSupplementTranslation(q,locale);assert(t);assert.equal(t.sourceHash,q.sourceHash);assert.equal(t.options.length,4);assert.equal(t.reasons.length,4);assert.equal(new Set(t.options).size,4);assert.equal(new Set(t.reasons).size,4);assert([t.stem,...t.options,...t.reasons].every(s=>typeof s==='string'&&s.trim()));pairs++;
  for(const field of ['stemJa','optionsJa','optionReasonsJa','correctIndex','sourceHash','lessonId','sources']){const changed=structuredClone(q);changed[field]=typeof changed[field]==='string'?changed[field]+'stale':typeof changed[field]==='number'?(changed[field]+1)%4:[];assert.equal(api.manufacturingSupplementTranslation(changed,locale),null);guards++;}
 }
 for(const locale of ['ja','xx','__proto__','toString']){assert.equal(api.manufacturingSupplementTranslation(q,locale),null);guards++;}
 }
 for(const key of ['lessonSourceHash','effectiveJapanese','rawJapanese']){const original=b[key];b[key]+='stale';assert(!helper.manufacturingSource64Exams('mechanical').some(e=>e.id===row.id));for(const q of row.questions)assert.equal(api.manufacturingSupplementTranslation(q,'vi'),null);b[key]=original;guards++;}
 console.log(JSON.stringify({group:row.id,questions:row.questions.length,status:'PASS_SOURCE_TEACHING_ASSESSMENT_AND_12_TARGETS'}));
}
assert.equal(questions,6);assert.equal(helper.manufacturingSource64Exams('electrical').length,0);assert.equal(helper.manufacturingSource64Exams('surface').length,0);
const receipt=read('docs/ssw-workspace/manufacturing/source64-reimplementation-20261106.json'),lpath='docs/ssw-workspace/source-coverage-v2/manufacturing.json',ledger=read(lpath),before=JSON.parse(cp.execFileSync('git',['show','689001b50:'+lpath],{cwd:root,encoding:'utf8',maxBuffer:10*1024*1024})),changed=new Set(receipt.changes.map(c=>c.knowledgeId));
assert.equal(changed.size,7);assert.equal(ledger.knowledgeUnits.length,before.knowledgeUnits.length);let preserved=0;
for(const old of before.knowledgeUnits){const now=ledger.knowledgeUnits.find(u=>u.knowledgeId===old.knowledgeId);if(!changed.has(old.knowledgeId)){assert.deepEqual(now,old);preserved++;}else{const change=receipt.changes.find(c=>c.knowledgeId===old.knowledgeId);assert.deepEqual(change.before,old);assert.equal(hash(JSON.stringify(now)),change.afterSha256);assert.equal(now.status,'covered_ai');assert.equal(now.after.assessment,'present');assert.deepEqual(now.sourceRefs,old.sourceRefs);assert.deepEqual(now.teachingEvidence,old.teachingEvidence);assert.deepEqual(now.before,old.before);}}
for(const field of ['sources','pages','denominator','wholeSourceKnowledgeCovered','review'])assert.deepEqual(ledger[field],before[field]);
for(const id of changed){const invalid=structuredClone(ledger);invalid.knowledgeUnits.find(u=>u.knowledgeId===id).statementJa+='changed';assert.throws(()=>require('./source64-ledger-projection.cjs').predecessor(invalid));guards++;}
for(const p of ['mechanical.json','electrical.json','surface.json','mocks/mechanical.json','mocks/electrical.json','mocks/surface.json','source47-clarification.json','source61-assessments.json','source62-bounded.json','source63-drawing.json','source63-drawing.ts'])assert.equal(fs.readFileSync(path.join(root,'src/data/manufacturing',p),'utf8'),cp.execFileSync('git',['show','689001b50:src/data/manufacturing/'+p],{cwd:root,encoding:'utf8',maxBuffer:20*1024*1024}));
const result={status:'PASS_SOURCE64_REIMPLEMENTATION',groups:3,questions,questionLocalePairs:pairs,japaneseRubyFields:fields,negativeGuards:guards,assessmentGapsFixed:7,existingCanonicalUnitsPreserved:preserved,reviewPageOccurrences:1,newDistinctSourcePages:0,sourcePagesNewlyClosed:0,whole574Covered:false,nativeReviewed:false,domainReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false};console.log(JSON.stringify(result));
if(process.argv.includes('--receipt'))fs.writeFileSync(path.join(root,'docs/ssw-workspace/manufacturing/source64-validation-20261106.json'),JSON.stringify(result,null,2)+'\n');
