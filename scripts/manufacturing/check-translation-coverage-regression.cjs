// Exercise the real synchronous validator with in-memory corruptions; never modify course data.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),checker=path.join(__dirname,'check.cjs');
const source=fs.readFileSync(checker,'utf8').split('\n(async()=>{')[0];
assert(source.includes('Complete source-guide locales'),'Translation coverage gates must be present');
function validate(mutate){
 const reads={...fs,readFileSync(file,options){
  const value=fs.readFileSync(file,options),relative=path.relative(root,file).split(path.sep).join('/');
  if(typeof value!=='string'||!relative.endsWith('.json'))return value;
  const data=JSON.parse(value);mutate?.(relative,data);return JSON.stringify(data);
 }};
 vm.runInNewContext(source,{require(name){return name==='node:fs'?reads:require(name);},__dirname,console},{filename:checker});
}
validate();
const cases=[
 ['wrong locale file identity',(p,d)=>{if(p==='src/data/manufacturing/translations/vi.json')d.locale='en';}],
 ['missing target locale',(p,d)=>{if(p==='src/data/manufacturing/translations/manifest.json')delete d.locales.vi;}],
 ['missing lesson with adjusted manifest count',(p,d)=>{if(p==='src/data/manufacturing/translations/manifest.json')d.locales.vi.lessonCount--;if(p==='src/data/manufacturing/translations/vi.json')delete d.lessons[Object.keys(d.lessons)[0]];}],
 ['missing weekly question with adjusted manifest count',(p,d)=>{if(p==='src/data/manufacturing/translations/manifest.json')d.locales.vi.questionCount--;if(p==='src/data/manufacturing/translations/questions.vi.json')delete d.questions[Object.keys(d.questions)[0]];}],
 ['missing diagram caption',(p,d)=>{if(p==='src/data/manufacturing/diagram-translations.json')delete d.locales.vi[Object.keys(d.locales.vi)[0]];}],
 ['missing diagram locale',(p,d)=>{if(p==='src/data/manufacturing/diagram-translations.json')delete d.locales.vi;}],
 ['missing source-guide locale',(p,d)=>{if(p==='src/data/manufacturing/source-guide-translations.json')delete d.locales.vi;}],
 ['stale source-guide hash',(p,d)=>{if(p==='src/data/manufacturing/source-guide-translations.json')d.locales.vi[Object.keys(d.locales.vi)[0]].sourceHash='stale';}],
 ['source-guide glossary drift',(p,d)=>{if(p==='src/data/manufacturing/source-guide-translations.json')d.locales.vi[Object.keys(d.locales.vi)[0]].terms[0].ja='wrong';}],
 ['blank source-guide paragraph',(p,d)=>{if(p==='src/data/manufacturing/source-guide-translations.json')d.locales.vi[Object.keys(d.locales.vi)[0]].paragraphs[0].text=' ';}],
];
for(const [label,mutation]of cases)assert.throws(()=>validate(mutation),undefined,label+' must be rejected');
console.log(JSON.stringify({status:'PASS',currentSnapshotAccepted:true,invalidSnapshotsRejected:cases.length,canonicalFilesModified:false}));
