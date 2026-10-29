const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),cache=new Map(),read=p=>{if(!cache.has(p))cache.set(p,JSON.parse(fs.readFileSync(path.join(root,p),'utf8')));return cache.get(p);};
async function bundle(patchData){
 const out=await require('esbuild').build({stdin:{contents:`export * from './src/data/manufacturing/editorial-translations';export * from './src/data/manufacturing/translations';export * from './src/data/manufacturing/source-guides';export * from './src/data/manufacturing/mocks';`,resolveDir:root,loader:'ts'},bundle:true,platform:'node',format:'cjs',write:false,logLevel:'error',plugins:[{name:'editorial-fixtures',setup(b){if(patchData)b.onLoad({filter:/editorial-translations\.json$/},()=>({contents:JSON.stringify(patchData),loader:'json'}));}}]});
 const m={exports:{}};new Function('module','exports',out.outputFiles[0].text)(m,m.exports);return m.exports;
}
const at=(object,keys)=>keys.reduce((value,key)=>value[key],object);
const set=(object,keys,value)=>{const parent=at(object,keys.slice(0,-1));parent[keys.at(-1)]=value;};
(async()=>{
 const data=read('src/data/manufacturing/editorial-translations.json'),api=await bundle();assert.equal(data.nativeReviewed,false);assert.equal(data.domainReviewed,false);
 const sources={lesson:{},guide:{},weekly:{},mock:{}};
 for(const s of ['mechanical','electrical','surface']){
  const c=read(`src/data/manufacturing/${s}.json`);c.lessons.forEach(l=>sources.lesson[l.id]=l);c.checks.forEach(e=>e.questions.forEach(q=>sources.weekly[q.id]=q));
  read(`src/data/manufacturing/mocks/${s}.json`).exams.forEach(e=>Object.values(e.sections).forEach(section=>section.questions.forEach(q=>sources.mock[q.id]=q)));
 }
 read('src/data/manufacturing/source-guides.json').guides.forEach(g=>sources.guide[g.id]=g);
 const rawEntry=p=>p.kind==='mock'?read('src/data/manufacturing/mock-translations.json').locales[p.locale][p.entryId]:p.kind==='guide'?read('src/data/manufacturing/source-guide-translations.json').locales[p.locale][p.entryId]:p.kind==='weekly'?read(`src/data/manufacturing/translations/questions.${p.locale}.json`).questions[p.entryId]:read(`src/data/manufacturing/translations/${p.locale}.json`).lessons[p.entryId];
 const get=(a,p,source)=>p.kind==='mock'?a.manufacturingMockTranslation(source,p.locale):p.kind==='weekly'?a.manufacturingQuestionTranslation(source,p.locale):p.kind==='guide'?a.manufacturingSourceGuideTranslation(source,p.locale):a.manufacturingTranslation(source,p.locale);
 const groups=new Map();for(const p of data.patches){const key=JSON.stringify([p.kind,p.locale,p.entryId]);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(p);}
 let checked=0;
 for(const group of groups.values()){
  const p=group[0],source=sources[p.kind][p.entryId],raw=rawEntry(p),before=JSON.stringify(raw),expected=JSON.parse(before);
  for(const patch of group){assert.equal(at(raw,patch.fieldPath),patch.before);set(expected,patch.fieldPath,patch.after);checked++;}
  const actual=get(api,p,source);assert.deepEqual(actual,expected,'Visible getter must return every revised field');assert.equal(actual.sourceHash,raw.sourceHash);assert.equal(actual.nativeReviewed,false);assert.equal(JSON.stringify(raw),before);
  assert.equal(get(api,p,{...source,sourceHash:'0'.repeat(64)}),null,'Stale Japanese source must not expose a translation');
  const changed=JSON.parse(before);set(changed,p.fieldPath,p.before+' newer wording');
  const revised=p.kind==='mock'||p.kind==='weekly'?api.revisedManufacturingQuestionTranslation(p.kind,source,p.locale,changed):api.revisedManufacturingLessonTranslation(source,p.locale,changed,p.kind);
  assert.strictEqual(revised,changed,'Any prior-wording mismatch suppresses the entire entry overlay');
 }
 const first=data.patches[0],source=sources[first.kind][first.entryId],raw=rawEntry(first);
 const invalid={...data,patches:[{...first,fieldPath:['sourceHash'],before:raw.sourceHash,after:'0'.repeat(64)}]};const bad=await bundle(invalid);
 const protectedResult=first.kind==='mock'||first.kind==='weekly'?bad.revisedManufacturingQuestionTranslation(first.kind,source,first.locale,raw):bad.revisedManufacturingLessonTranslation(source,first.locale,raw,first.kind);
 assert.strictEqual(protectedResult,raw,'Protected metadata path rejected');
 assert.equal(checked,data.patches.length);
 console.log(JSON.stringify({status:'PASS',correctedFields:checked,correctedEntries:groups.size,allVisibleGettersChecked:true,staleSourceSuppressed:true,priorWordingMismatchSuppressesWholeEntry:true,protectedMetadataRejected:true,originalBanksAndQuestionIdentitiesPreserved:true,nativeReviewed:false,domainReviewed:false}));
})().catch(e=>{console.error(e);process.exitCode=1});
