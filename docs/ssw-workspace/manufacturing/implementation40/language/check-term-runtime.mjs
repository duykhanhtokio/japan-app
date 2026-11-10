import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import vm from 'node:vm';
const out=fileURLToPath(new URL('./',import.meta.url)),root=resolve(out,'../../../../..'),data=resolve(root,'src/data/manufacturing');
const cache=new Map(),read=p=>{if(!cache.has(p))cache.set(p,JSON.parse(readFileSync(p,'utf8')));return cache.get(p);};
function loader(file,tail,extra={}){const src=stripTypeScriptTypes(readFileSync(resolve(data,file),'utf8')).replace(/^import[^\n]*\n/gm,'').replaceAll('export ','');const ctx={require:n=>read(resolve(data,n)),...extra};vm.runInNewContext(src+'\nresult='+tail,ctx);return ctx.result;}
const editorial=loader('editorial-translations.ts','revisedManufacturingLessonTranslation');
const legacy=loader('term-editorial.ts','legacyManufacturingTermMeaning');
const newGetter=loader('term-editorial40.ts','clarifiedTerm40');
const inputs=read(resolve(out,'canonical-current-term-review-input.json')).records;
let values=0,patches=0;const allPatches=read(resolve(data,'implementation40/term-corrections.json')).patches;
for(const r of inputs){
 const [canonicalFile,pointer]=r.canonicalPath.split('#'),tokens=pointer.split('/');
 const lesson=read(resolve(root,canonicalFile))[tokens[1]][Number(tokens[2])];
 assert.equal(lesson.id,r.lessonId);assert.equal(lesson.sourceHash,r.sourceHash);assert.equal(legacy(lesson,r.termIndex,'ja',lesson.terms[r.termIndex].meaningJa),r.meaningJa);
 for(const locale of ['ja',...Object.keys(r.targets)]){
  let text;
  if(locale==='ja')text=lesson.terms[r.termIndex].meaningJa;
  else{const target=r.targets[locale],file=target.fieldPath.split('#')[0];const bank=read(resolve(root,file));const raw=(bank.lessons??bank.guides??bank.locales?.[locale])[r.lessonId];assert.equal(raw.sourceHash,lesson.sourceHash);text=editorial(lesson,locale,raw,tokens[1]==='guides'?'guide':'lesson').terms[r.termIndex].meaning;}
  const before=legacy(lesson,r.termIndex,locale,text);
  if(locale!=='ja'){assert.equal(before,r.targets[locale].meaning,`${r.key}/${locale} effective before`);values++;}
  const patch=allPatches.find(p=>p.lessonId===r.lessonId&&p.termIndex===r.termIndex&&p.locale===locale);
  const actual=newGetter(lesson,r.termIndex,locale,before);
  if(patch){assert.equal(before,patch.before);assert.equal(actual,patch.after);patches++;assert.equal(newGetter({...lesson,sourceHash:'stale'},r.termIndex,locale,before),before);assert.equal(newGetter(lesson,r.termIndex,locale,before+' stale'),before+' stale');}
  else assert.equal(actual,before);
 }
}
assert.equal(patches,allPatches.length);
writeFileSync(resolve(out,'term-runtime-validation.json'),JSON.stringify({status:'PASS',effectiveBeforeValuesChecked:values,guardedPatchesActivated:patches,staleSourceAndBeforeRejected:patches*2,unchangedOtherFields:true,nativeReviewed:false,domainReviewed:false},null,2)+'\n');
console.log(`PASS ${values} actual effective before values; ${patches} patches activate and reject stale source/text.`);
