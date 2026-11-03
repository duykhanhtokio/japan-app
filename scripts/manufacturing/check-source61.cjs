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


const payload=load('src/data/manufacturing/source61-assessments.json'),api=load('src/data/manufacturing/supplement-practice.ts'),state=load('src/services/manufacturing-study-state.ts'),paragraph=load('src/data/manufacturing/lesson-editorial.ts'),core=load('src/data/manufacturing/index.ts');
let pairs=0,guards=0;
for(const row of payload.rows){
 const course=core.loadManufacturingCourse(row.specialty),lesson=course.lessons.find(l=>l.id===row.teachingBinding.lessonId),binding=row.teachingBinding;
 const exam=api.manufacturingSupplementExams(row.specialty).find(e=>e.id===row.id);assert(exam);assert.equal(exam.questions.length,1);const q=exam.questions[0],{sourceHash,...rest}=q;assert.equal(hash(JSON.stringify(rest)),sourceHash);assert.equal(hash(JSON.stringify(binding.effectiveJapanese)),binding.effectiveJapaneseSha256);
 assert.equal(paragraph.manufacturingLessonParagraph(lesson,binding.paragraphId,'ja',binding.rawJapanese),binding.effectiveJapanese);
 for(const text of [q.stemJa,...q.optionsJa,...q.optionReasonsJa])assert(!/[一-龯々]/.test(text.replace(/[一-龯々]+（[ぁ-ゖー]+）/g,'')),'unannotated new Japanese');
 assert.equal(new Set(q.optionReasonsJa).size,4);assert.deepEqual(Object.keys(row.locales).sort(),core.manufacturingManifest.targetLocales.slice().sort());
 for(const locale of core.manufacturingManifest.targetLocales){const t=api.manufacturingSupplementTranslation(q,locale);assert.deepEqual(t,row.locales[locale]);assert.equal(t.sourceHash,q.sourceHash);assert.equal(t.options.length,4);assert.equal(t.reasons.length,4);assert.equal(new Set(t.reasons).size,4);pairs++;
  for(const key of ['stemJa','optionsJa','correctIndex','optionReasonsJa','lessonId','sourceHash','sources']){const bad=structuredClone(q);bad[key]=typeof bad[key]==='string'?bad[key]+'x':typeof bad[key]==='number'?(bad[key]+1)%4:[];assert.equal(api.manufacturingSupplementTranslation(bad,locale),null);guards++;}
  const target=row.locales[locale],old=target.sourceHash;target.sourceHash='stale';assert.equal(api.manufacturingSupplementTranslation(q,locale),null);target.sourceHash=old;guards++;
 }
 for(const locale of ['ja','xx','__proto__','toString']){assert.equal(api.manufacturingSupplementTranslation(q,locale),null);guards++;}
 const old=binding.rawJapanese;binding.rawJapanese+='stale';assert(!api.manufacturingSupplementExams(row.specialty).some(e=>e.id===row.id));assert.equal(api.manufacturingSupplementTranslation(q,'vi'),null);binding.rawJapanese=old;guards+=2;
 const after=binding.effectiveJapanese;binding.effectiveJapanese+='stale';assert(!api.manufacturingSupplementExams(row.specialty).some(e=>e.id===row.id));binding.effectiveJapanese=after;guards++;
 const oldHash=lesson.sourceHash;lesson.sourceHash='stale';assert(!api.manufacturingSupplementExams(row.specialty).some(e=>e.id===row.id));lesson.sourceHash=oldHash;guards++;
 const a=state.freshTestAttempt(exam);a.answers=[q.correctIndex];assert.equal(state.gradeTest(exam,a.answers).correct,1);assert.deepEqual(state.restoreTestAttempt(JSON.stringify(a),exam),a);assert.equal(state.restoreTestAttempt(JSON.stringify(a),{...exam,revision:'stale'}),null);guards++;
 console.log(JSON.stringify({group:row.specialty,status:'PASS',question:q.id,localePairs:12}));
}
assert.equal(payload.rows.length,3);assert.equal(pairs,36);
const result={status:'PASS_SOURCE61_ASSESSMENTS',groups:3,newQuestions:3,questionLocalePairs:pairs,negativeGuards:guards,existingCoreEdited:false,newJapaneseReadingsChecked:true,gradingAndRevisionResume:true,sourceParagraphBindingsCurrent:true,nativeReviewed:false,domainReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false,wholeSourceCovered:false};fs.writeFileSync(path.join(root,dir+'manufacturing-source61-validation.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
