const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const {transformSync}=require('esbuild'),file=path.join(root,'src/data/manufacturing/editorial-translations.ts');
const compiled=new Module(file,module);compiled.filename=file;compiled.paths=Module._nodeModulePaths(path.dirname(file));
compiled._compile(transformSync(fs.readFileSync(file,'utf8'),{loader:'ts',format:'cjs'}).code,file);
const apply=compiled.exports.revisedManufacturingLessonTranslation;
const data=read('src/data/manufacturing/safety-editorial-translations.json');
assert.equal(data.patches.length,28);
const lessons=['mechanical','electrical','surface'].flatMap(s=>read(`src/data/manufacturing/${s}.json`).lessons);
let negativeGuards=0;
for(const patch of data.patches){
 const lesson=lessons.find(l=>l.id===patch.entryId);
 const entry=read(`src/data/manufacturing/translations/${patch.locale}.json`).lessons[lesson.id];
 const snapshot=JSON.stringify({lesson,entry});
 assert.equal(patch.sourceHash,lesson.sourceHash);assert.equal(patch.fieldPath[0],'safety');
 const index=patch.fieldPath[1];assert.equal(entry.safety[index],patch.before);
 const result=apply(lesson,patch.locale,entry);
 // Other historical corrections may affect the same entry, but never unrelated safety fields.
 assert.equal(result.safety[index],patch.after);
 assert.deepEqual(result.safety,entry.safety.map((t,i)=>i===index?patch.after:t));
 assert.equal(JSON.stringify({lesson,entry}),snapshot);
 assert.deepEqual(apply(lesson,patch.locale,result),result);
 const changed=structuredClone(entry);changed.safety[index]='changed';
 for(const [name,l,locale,target] of [
  ['stale source',{...lesson,sourceHash:'stale'},patch.locale,entry],
  ['stale target source',lesson,patch.locale,{...entry,sourceHash:'stale'}],
  ['changed prior wording',lesson,patch.locale,changed],
  ['different lesson',{...lesson,id:'unrelated'},patch.locale,entry],
  ['unknown locale',lesson,'xx',entry],
  ['prototype locale',lesson,'toString',entry],
 ]){assert.strictEqual(apply(l,locale,target),target,name);negativeGuards++;}
}
const surface049=lessons.find(l=>l.id==='mfg1-surface-lesson-049');
assert.equal(surface049.safetyJa[1],'ガス発生や発熱を見て安全な反応と判断しない。');
for(const flag of ['nativeReviewed','domainReviewed','humanReviewed'])assert.equal(data[flag],false);
console.log(JSON.stringify({status:'PASS',correctedSafetyFields:data.patches.length,negativeGuards,sourceUnmodified:true,targetUnmodified:true,idempotent:true,nativeReviewed:false,domainReviewed:false}));
