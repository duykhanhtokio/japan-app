// Derived work queue only. Exact bytes/links never establish semantic acceptance.
// Node 24 is sufficient; no Expo, browser, native device or source PDF is loaded.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {stripTypeScriptTypes}=require('node:module');
const {readJSON,pointer,hash}=require('../source-coverage-v2/check.cjs');
const root=path.resolve(__dirname,'../..'),cache=new Map();
function load(file){
 file=path.resolve(root,file);if(!path.extname(file))file=fs.existsSync(file+'.ts')?file+'.ts':path.join(file,'index.ts');
 if(cache.has(file))return cache.get(file).exports;
 const m={exports:{}};cache.set(file,m);
 if(file.endsWith('.json')){m.exports=readJSON(file);return m.exports;}
 let source=stripTypeScriptTypes(fs.readFileSync(file,'utf8')),names=[];
 source=source.replace(/import\s+(\w+)\s+from\s*(['"])([^'"]+)\2\s*;/g,(_,name,q,target)=>`const ${name}=require(${JSON.stringify(target)});`);
 source=source.replace(/import\s*\{([^}]+)\}\s*from\s*(['"])([^'"]+)\2\s*;/g,(_,items,q,target)=>`const {${items}}=require(${JSON.stringify(target)});`);
 source=source.replace(/export\s*\{([^}]+)\}\s*from\s*(['"])([^'"]+)\2\s*;/g,(_,items,q,target)=>{const n=items.split(',').map(x=>x.trim()).filter(Boolean);assert(n.every(x=>/^\w+$/.test(x)));names.push(...n);return `const {${n.join(',')}}=require(${JSON.stringify(target)});`;});
 source=source.replace(/export\s+(function|const|let|class)\s+(\w+)/g,(_,kind,name)=>{names.push(name);return `${kind} ${name}`;});
 assert(!/^\s*(import|export)\s/m.test(source),'Unsupported module syntax: '+file);
 const req=id=>{assert(id.startsWith('.'),'Unexpected non-local dependency: '+id);return load(path.resolve(path.dirname(file),id));};
 new vm.Script('(function(require,module,exports){'+source+'\nObject.assign(module.exports,{'+names.join(',')+'});})',{filename:file}).runInThisContext()(req,m,m.exports);
 return m.exports;
}
const dir='docs/ssw-workspace/source-coverage-v2/',ledger=readJSON(path.join(root,dir+'manufacturing.json'));
const manifest=load('src/data/manufacturing/course-manifest.json'),locales=manifest.targetLocales;
const {manufacturingLessonParagraph:paragraph}=load('src/data/manufacturing/lesson-editorial.ts');
const {manufacturingTranslation:translation}=load('src/data/manufacturing/translations.ts');
const daily=load('src/data/manufacturing/daily-support.ts');
const evidence=[];
for(const u of ledger.knowledgeUnits)for(const e of u.teachingEvidence){
 const file=path.join(root,e.path);let value,current=false,error=null;
 try{if(e.sha256Mode==='json-value'){value=pointer(readJSON(file),e.jsonPointer);current=hash(JSON.stringify(value))===e.sha256;}else{const bytes=fs.readFileSync(file);current=hash(bytes)===e.sha256;value=e.quote;}}catch(err){error=err.code||err.message;}
 evidence.push({knowledgeId:u.knowledgeId,unitStatus:u.status,path:e.path,locator:e.jsonPointer||e.locator,current,error,value,relation:e.relation,semanticReviewed:e.semanticReviewed});
}
const rows=[],days=[],translationProblems=[];
for(const specialty of ['mechanical','electrical','surface']){
 const course=load('src/data/manufacturing/'+specialty+'.json');
 const scheduled=new Set(manifest.specialties.find(s=>s.id===specialty).weeks.flatMap(w=>w.lessonIds));
 for(const lesson of course.lessons){
  const translations=new Map(locales.map(locale=>[locale,translation(lesson,locale)]));
  for(const [locale,t]of translations){
   const errors=[];
   if(!t)errors.push('missing_or_stale_lesson');
   else{for(const field of ['title','objective','activity','summary'])if(typeof t[field]!=='string'||!t[field].trim())errors.push('empty_'+field);
    if(t.paragraphs.length!==lesson.paragraphs.length||new Set(t.paragraphs.map(p=>p.id)).size!==t.paragraphs.length)errors.push('paragraph_shape');
    if(t.terms.length!==lesson.terms.length||t.safety.length!==lesson.safetyJa.length)errors.push('term_or_safety_shape');}
   if(errors.length)translationProblems.push({lessonId:lesson.id,locale,errors});
  }
  let characters=0,paragraphCount=0;
  for(const p of lesson.paragraphs){
   const text=paragraph(lesson,p.id,'ja',p.textJa);assert(typeof text==='string'&&text.trim());characters+=Array.from(text).length;paragraphCount++;
   const candidates=evidence.filter(e=>e.current&&typeof e.value==='string'&&e.value.length>=12&&(text.includes(e.value)||e.value===text));
   const targetProblems=[];
   for(const [locale,t]of translations){const matches=t?.paragraphs.filter(x=>x.id===p.id)||[],raw=matches[0]?.text,effective=paragraph(lesson,p.id,locale,raw);if(matches.length!==1||typeof effective!=='string'||!effective.trim())targetProblems.push(locale);}
   rows.push({lessonId:lesson.id,paragraphId:p.id,specialty,scheduled:scheduled.has(lesson.id),lessonSourceHash:lesson.sourceHash,effectiveJapaneseSha256:hash(text),characters:Array.from(text).length,declaredSourceRefs:lesson.sources,
    exactTextEvidenceCandidates:candidates.map(({value,...e})=>({...e,match:value===text?'whole_paragraph':'contained_fragment'})),semanticDisposition:'pending_self_review',targetProblems});
  }
  if(scheduled.has(lesson.id)){
   const support=daily.manufacturingDailySupport(lesson),figure=daily.manufacturingDailyFigure(lesson);let supportCharacters=0;
   if(support)for(const p of support.companion.paragraphs.filter(p=>support.binding.paragraphIds.includes(p.id)))supportCharacters+=Array.from(paragraph(support.companion,p.id,'ja',p.textJa)).length;
   const asset=figure?.asset,assetFile=asset&&path.join(root,asset.assetPath),assetPresent=!!assetFile&&fs.existsSync(assetFile);
   days.push({lessonId:lesson.id,specialty,paragraphCount,effectiveParagraphCharacters:characters,attachedSupportCharacters:supportCharacters,figureBindingCurrent:!!figure,figurePath:asset?.assetPath||null,figureBytes:!asset?'no_current_binding':!assetPresent?'not_materialized':hash(fs.readFileSync(assetFile))===asset.sha256?'hash_matches':'hash_mismatch',estimatedMinutes:lesson.estimatedMinutes,learnerDurationMeasured:false,workloadEquivalent:false});
  }
 }
}
const open=ledger.knowledgeUnits.filter(u=>!['covered_ai','excluded','duplicate'].includes(u.status));
const summary={status:'DERIVED_CURRENT_READER_WORK_QUEUE',scope:'core scheduled and unscheduled lesson paragraphs through current translation/editorial APIs; not all app claims, supplemental cards, question banks or audio',canonicalLedgerSha256:hash(fs.readFileSync(path.join(root,dir+'manufacturing.json'))),sourceCoveragePercent:null,sourceDenominatorStatus:ledger.denominator.status,
 coreLessons:new Set(rows.map(r=>r.lessonId)).size,effectiveParagraphs:rows.length,paragraphsWithTextEvidenceCandidates:rows.filter(r=>r.exactTextEvidenceCandidates.length).length,paragraphsWithoutTextEvidenceCandidates:rows.filter(r=>!r.exactTextEvidenceCandidates.length).length,
 lessonLocalePairsChecked:new Set(rows.map(r=>r.lessonId)).size*locales.length,lessonLocaleProblems:translationProblems.length,paragraphLocaleProblems:rows.reduce((n,r)=>n+r.targetProblems.length,0),scheduledDays:days.length,currentFigureBindings:days.filter(d=>d.figureBindingCurrent).length,figureFilesNotMaterialized:days.filter(d=>d.figureBytes==='not_materialized').length,staleOrUnreadableTeachingEvidence:evidence.filter(e=>!e.current).length,openCanonicalUnits:open.length,
 nativeReviewed:false,domainReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false,semanticCoverageAccepted:false};
const result={schemaVersion:1,summary,limitations:['A contained fragment is a lookup candidate only; it never certifies the rest of a paragraph.','No text match is not proof that the app claim is unsupported: exact fact-by-fact source review remains required.','Character counts describe workload inventory, not measured learning time or equivalence.','The three core banks do not include all separately attached supplements/questions/figures/audio.'],openCanonicalUnits:open.map(u=>({knowledgeId:u.knowledgeId,status:u.status,sourceRefs:u.sourceRefs,unresolved:u.unresolved})),translationProblems,paragraphs:rows,days};
const out=process.argv.indexOf('--out');if(out>=0){assert(process.argv[out+1],'--out requires a path');fs.writeFileSync(path.resolve(root,process.argv[out+1]),JSON.stringify(result,null,2)+'\n');}
console.log(JSON.stringify(summary));
if(translationProblems.length||rows.some(r=>r.targetProblems.length)||evidence.some(e=>!e.current)||days.some(d=>!d.figureBindingCurrent||d.figureBytes==='hash_mismatch'))process.exitCode=1;
