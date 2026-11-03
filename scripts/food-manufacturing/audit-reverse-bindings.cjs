/* A reverse inventory, not semantic acceptance. No source prose is emitted. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const pointer=(v,p)=>p.slice(1).split('/').reduce((a,k)=>a[k.replace(/~1/g,'/').replace(/~0/g,'~')],v);
function bindings(ledger,file,p,value,pack){return ledger.knowledgeUnits.flatMap(u=>['teachingEvidence','assessmentEvidence','imageEvidence'].flatMap(kind=>(u[kind]||[]).filter(e=>e.path===file&&e.sha256Mode==='json-value'&&(e.jsonPointer===p||p.startsWith(e.jsonPointer+'/'))).map(e=>{
 let current=false;try{current=hash(pointer(pack,e.jsonPointer))===e.sha256;}catch{}
 return {knowledgeId:u.knowledgeId,unitStatus:u.status,evidenceKind:kind,evidencePointer:e.jsonPointer,exactField:e.jsonPointer===p,current,relation:e.relation,sourceRefs:u.sourceRefs,unresolved:u.unresolved};
})));}
function build(){
 const ledgerPath='docs/ssw-workspace/source-coverage-v2/food.json',ledger=read(ledgerPath);
 const components=['src/components/food-manufacturing/FoodClosureSupplements.tsx','src/components/food-manufacturing/FoodSourceAssessmentChecks.tsx'];
 const imported=[...new Set(components.flatMap(f=>[...fs.readFileSync(path.join(root,f),'utf8').matchAll(/@\/data\/(food-manufacturing\/source-closure\d+\.json)/g)].map(m=>'src/data/'+m[1])))].sort();
 const lessons=[...read('src/data/food-manufacturing/lessons.1.ja.json').lessons,...read('src/data/food-manufacturing/lessons.2.ja.json').lessons,...read('src/data/food-manufacturing/runtime-supplemental/lessons.json')];
 const fields=[],items=[],defects=[];
 for(const file of imported){const pack=read(file);for(const group of ['sections','checks'])for(const [i,x]of (pack[group]||[]).entries()){
  const base=`/${group}/${i}`,lesson=lessons.find(l=>l.id===x.lessonId);
  const item={path:file,jsonPointer:base,id:x.id,kind:group,lessonId:x.lessonId,lessonRevisionCurrent:!!lesson&&lesson.sourceHash===x.lessonSourceHash,sourceRefs:x.sourceRefs,sourceHash:x.sourceHash,translationLocales:[],rubyAligned:true};
  if(!item.lessonRevisionCurrent)defects.push({path:file,id:x.id,code:'STALE_OR_MISSING_LESSON'});
  const rows=[['titleJa','titleRuby'],...(group==='sections'?[['textJa','ruby']]:[['promptJa','promptRuby']])];
  for(const [field,ruby]of rows){if(!Array.isArray(x[ruby])||x[ruby].map(t=>t.text).join('')!==x[field])item.rubyAligned=false;
   const p=base+'/'+field,refs=bindings(ledger,file,p,x[field],pack);fields.push({path:file,jsonPointer:p,itemId:x.id,fieldSha256:hash(x[field]),bindings:refs,semanticAcceptance:'pending_field_claim_review'});}
  if(group==='checks')for(const [j,s]of x.expectedPointsJa.entries()){
   if(!Array.isArray(x.expectedPointsRuby?.[j])||x.expectedPointsRuby[j].map(t=>t.text).join('')!==s)item.rubyAligned=false;
   const p=base+'/expectedPointsJa/'+j;fields.push({path:file,jsonPointer:p,itemId:x.id,fieldSha256:hash(s),bindings:bindings(ledger,file,p,s,pack),semanticAcceptance:'pending_field_claim_review'});
  }
  if(!item.rubyAligned)defects.push({path:file,id:x.id,code:'RUBY_TEXT_MISMATCH'});
  for(const locale of locales){const t=x.translations?.[locale],current=!!t&&t.sourceHash===x.sourceHash,complete=!!t&&typeof t.title==='string'&&!!t.title.trim()&&(group==='sections'?typeof t.text==='string'&&!!t.text.trim():typeof t.prompt==='string'&&!!t.prompt.trim()&&Array.isArray(t.expectedPoints)&&t.expectedPoints.length===x.expectedPointsJa.length&&t.expectedPoints.every(p=>typeof p==='string'&&p.trim()));item.translationLocales.push({locale,current,complete,semanticReviewed:false});if(!current||!complete)defects.push({path:file,id:x.id,locale,code:!current?'TRANSLATION_REVISION':'INCOMPLETE_TRANSLATION'});}
  items.push(item);
 }}
 const unbound=fields.filter(f=>!f.bindings.some(b=>b.current&&b.relation==='direct'));
 const fieldGroups=Object.fromEntries(['titleJa','textJa','promptJa','expectedPointsJa'].map(key=>{const a=fields.filter(f=>f.jsonPointer.includes('/'+key));return [key,{fields:a.length,withoutCurrentDirectBinding:a.filter(f=>!f.bindings.some(b=>b.current&&b.relation==='direct')).length}];}));
 return {schemaVersion:1,scope:'Runtime-imported source-closure supplements only; base lessons/exams, other supplements, figures and audio remain outside this inventory.',ledger:ledgerPath,ledgerSha256:hash(ledger),meaning:'Current hash/ancestor bindings locate candidates for app-to-source review. A parent-object or paragraph binding never certifies every assertion in it. Unbound titles may be labels rather than factual claims; neither fields nor bindings are a source-idea denominator. Translation revision/shape and ruby alignment are mechanical checks only; no numeric-parity or language-semantic review is inferred.',summary:{packs:imported.length,sections:items.filter(x=>x.kind==='sections').length,checks:items.filter(x=>x.kind==='checks').length,japaneseFields:fields.length,fieldsWithoutCurrentDirectBinding:unbound.length,fieldGroups,revisionOrShapeDefects:defects.length,translationPairs:items.length*locales.length},sourceDenominator:ledger.denominator.status,wholeSourceKnowledgeCovered:false,review:{domainReviewed:false,nativeReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false,audioReviewed:false},partialUnits:ledger.knowledgeUnits.filter(u=>u.status==='partial').map(u=>({knowledgeId:u.knowledgeId,unresolved:u.unresolved})),defects,items,fields};
}
if(process.argv.includes('--self-test')){
 const pack={checks:[{promptJa:'sample',expectedPointsJa:['answer']}]},e={path:'pack.json',jsonPointer:'/checks/0',sha256:hash(pack.checks[0]),sha256Mode:'json-value',relation:'direct'};
 const ledger={knowledgeUnits:[{knowledgeId:'fixture',status:'partial',sourceRefs:[],unresolved:['needs source'],assessmentEvidence:[e]}]};
 const a=bindings(ledger,'pack.json','/checks/0/expectedPointsJa/0','answer',pack)[0];assert.equal(a.current,true);assert.equal(a.exactField,false);assert.equal(a.unitStatus,'partial');pack.checks[0].promptJa='changed';assert.equal(bindings(ledger,'pack.json','/checks/0/expectedPointsJa/0','answer',pack)[0].current,false);assert.equal(bindings(ledger,'other.json','/checks/0','',pack).length,0);assert.equal(bindings(ledger,'pack.json','/checks/01','',pack).length,0);console.log('PASS reverse-binding stale, parent-scope and unrelated-path rejection');
}else{const r=build(),arg=process.argv.indexOf('--out');if(arg>=0)fs.writeFileSync(path.resolve(process.argv[arg+1]),JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify({summary:r.summary,review:r.review,partialUnits:r.partialUnits.map(u=>u.knowledgeId),defects:r.defects}));if(r.defects.length)process.exitCode=1;}
