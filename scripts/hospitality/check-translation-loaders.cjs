// Exercise the actual runtime loader, including revision isolation, without platform adapters.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {createRequire,stripTypeScriptTypes}=require('node:module');
const root=path.resolve(__dirname,'../..');
const file=path.join(root,'src/data/hospitality/translation-loaders.ts');
const source=fs.readFileSync(file,'utf8');
const js=stripTypeScriptTypes(source).replace('export function loadHotelTranslation','function loadHotelTranslation');
const context={require:createRequire(file)};
vm.createContext(context);vm.runInContext(js+'\nglobalThis.load=loadHotelTranslation;',context);
const catalog=JSON.parse(fs.readFileSync(path.join(root,'src/data/hospitality/catalog.json')));
const required=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
let loaded=0,missing=0;
for(const language of required)for(const entry of catalog){
 const p=path.join(root,`src/data/hospitality/translations/${language}/${entry.group}.json`);
 const expected=fs.existsSync(p)?JSON.parse(fs.readFileSync(p)).lessons.find(l=>l.id===entry.id&&l.sourceRevision===entry.revision):null;
 const actual=context.load(entry.id,language,entry.revision);
 if(expected){assert.deepEqual(JSON.parse(JSON.stringify(actual)),expected,`${language}/${entry.id}: runtime translation differs`);loaded++;}
 else{assert.equal(actual,null,`${language}/${entry.id}: missing translation must not count a fallback`);missing++;}
 assert.equal(context.load(entry.id,language,'stale-revision'),null,`${language}/${entry.id}: stale translation exposed`);
}
assert.equal(context.load('hotel-unknown-01','vi','unknown'),null);
assert.equal(context.load(catalog[0].id,'unknown-locale',catalog[0].revision),null);
console.log(JSON.stringify({status:'PASS',loadedPairs:loaded,missingPairs:missing,staleRevisionRejected:true,unsupportedLocaleReturnsNull:true}));
