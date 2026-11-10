const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {Module,stripTypeScriptTypes}=require('node:module');
const root=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
function compile(relative,dependencies={}){
 const file=path.join(root,relative),m=new Module(file,module);
 m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));
 m.require=id=>dependencies[id]??Module.prototype.require.call(m,id);
 const stripped=stripTypeScriptTypes(fs.readFileSync(file,'utf8'));
 const source=stripped.replace("import {manufacturingBooleanParagraph} from './boolean-editorial';","const {manufacturingBooleanParagraph}=require('./boolean-editorial');")
  .replace(/export function (\w+)/g, 'exports.$1 = function $1');
 m._compile(source,file);return m.exports;
}
const boolean=compile('src/data/manufacturing/boolean-editorial.ts');
const apply=compile('src/data/manufacturing/lesson-editorial.ts',{'./boolean-editorial':boolean}).manufacturingLessonParagraph;
const patch=read('src/data/manufacturing/dimension-editorial.json');
const lesson=read('src/data/manufacturing/mechanical.json').lessons.find(l=>l.id===patch.lessonId);
const snapshot=JSON.stringify(lesson),locales=['ja',...read('docs/ssw-workspace/manufacturing/approved-scope.json').targetLocales];
assert.equal(patch.sourceHash,lesson.sourceHash);
assert.equal(patch.wording.ja.before,lesson.paragraphs.find(p=>p.id===patch.paragraphId).textJa);
assert.deepEqual(Object.keys(patch.wording).sort(),locales.sort());
let accepted=0,rejected=0;
for(const locale of locales){
 const w=patch.wording[locale];
 if(locale!=='ja'){
  const t=read('src/data/manufacturing/translations/'+locale+'.json').lessons[lesson.id];
  assert.equal(t.sourceHash,lesson.sourceHash);
  assert.equal(w.before,t.paragraphs.find(p=>p.id===patch.paragraphId).text);
 }
 assert(w.after.startsWith(w.before+'\n\n'));assert(w.after.length>w.before.length+80);
 assert.equal(apply(lesson,patch.paragraphId,locale,w.before),w.after);accepted++;
 for(const [l,id,lang,text] of [
  [{...lesson,sourceHash:'stale'},patch.paragraphId,locale,w.before],
  [lesson,patch.paragraphId,locale,w.before+' changed'],
  [lesson,'other',locale,w.before],
  [{...lesson,id:'other'},patch.paragraphId,locale,w.before],
  [{...lesson,paragraphs:lesson.paragraphs.map(p=>p.id===patch.paragraphId?{...p,textJa:'drift'}:p)},patch.paragraphId,locale,w.before],
  [lesson,patch.paragraphId,'toString',w.before],
  [lesson,patch.paragraphId,locale,undefined]
 ]){assert.equal(apply(l,id,lang,text),text);rejected++;}
}
assert.equal(JSON.stringify(lesson),snapshot);
// The existing inspection correction must continue to apply.
const old=read('src/data/manufacturing/lesson-editorial.json');
const prior=read('src/data/manufacturing/mechanical.json').lessons.find(l=>l.id===old.lessonId);
for(const locale of locales)assert.equal(apply(prior,old.paragraphId,locale,old.wording[locale].before),old.wording[locale].after);
for(const flag of ['nativeReviewed','domainReviewed','humanReviewed'])assert.equal(patch[flag],false);
console.log(JSON.stringify({status:'PASS',acceptedLocales:accepted,rejectedDriftCases:rejected,existingCorrectionLocales:locales.length,coreLessonUnmodified:true,domainReviewed:false,nativeReviewed:false,physicalDeviceVerified:false}));
