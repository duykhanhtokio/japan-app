const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const {transformSync}=require('esbuild'),file=path.join(root,'src/data/manufacturing/lesson-editorial.ts');
const compiled=new Module(file,module);compiled.filename=file;compiled.paths=Module._nodeModulePaths(path.dirname(file));
compiled._compile(transformSync(fs.readFileSync(file,'utf8'),{loader:'ts',format:'cjs'}).code,file);
const apply=compiled.exports.manufacturingLessonParagraph,patch=require(path.join(root,'src/data/manufacturing/lesson-editorial.json'));
const lesson=read('src/data/manufacturing/mechanical.json').lessons.find(l=>l.id===patch.lessonId),before=JSON.stringify(lesson);
assert(lesson);assert.equal(patch.sourceHash,lesson.sourceHash);assert.equal(patch.paragraphId,'section-3');
assert.equal(patch.wording.ja.before,lesson.paragraphs.find(p=>p.id===patch.paragraphId).textJa);
const locales=read('docs/ssw-workspace/manufacturing/approved-scope.json').targetLocales;
assert.deepEqual(Object.keys(patch.wording).sort(),['ja',...locales].sort());
const baselineTranslation=Object.fromEntries(locales.map(locale=>[locale,read(`src/data/manufacturing/translations/${locale}.json`).lessons[lesson.id]]));
for(const locale of ['ja',...locales]){
 const wording=patch.wording[locale];assert(wording.after.length>60&&wording.before!==wording.after);
 if(locale!=='ja')assert.equal(wording.before,baselineTranslation[locale].paragraphs.find(p=>p.id===patch.paragraphId).text);
 assert.equal(apply(lesson,patch.paragraphId,locale,wording.before),wording.after);
 assert.equal(apply(lesson,patch.paragraphId,locale,'changed prior text'),'changed prior text');
 assert.equal(apply({...lesson,sourceHash:'stale'},patch.paragraphId,locale,wording.before),wording.before);
}
const ja=patch.wording.ja.before,rejected=[];
for(const [name,l,id,locale,text] of [
 ['different lesson',{...lesson,id:'mfg1-mechanical-lesson-075'},'section-3','ja',ja],
 ['different paragraph',lesson,'section-2','ja',ja],
 ['unknown locale',lesson,'section-3','xx',ja],
 ['prototype locale',lesson,'section-3','toString',ja],
 ['missing target',lesson,'section-3','vi',undefined],
 ['changed Japanese',{...lesson,paragraphs:lesson.paragraphs.map(p=>p.id==='section-3'?{...p,textJa:'drift'}:p)},'section-3','ja',ja],
 ]){assert.equal(apply(l,id,locale,text),text);rejected.push(name);}
const originalAfter=patch.wording.ja.after;patch.wording.ja.after='';assert.equal(apply(lesson,'section-3','ja',ja),ja);patch.wording.ja.after=originalAfter;rejected.push('empty replacement');
assert.equal(JSON.stringify(lesson),before);
for(const flag of ['nativeReviewed','domainReviewed','humanReviewed'])assert.equal(patch[flag],false);
// Historic component receipts must still reconstruct their exact prior bytes and reject arbitrary edits.
const {execFileSync}=require('node:child_process');
execFileSync('python',['-c',`import pathlib,runpy\nr=pathlib.Path('.')\nf=runpy.run_path('scripts/manufacturing/supplement-practice-projection.py')['historical_course']\nb=(r/'src/components/manufacturing/ManufacturingCourse.tsx').read_bytes()\nassert f(b)==f((r/'docs/ssw-workspace/manufacturing/batch34-continuation/base-ManufacturingCourse.tsx').read_bytes())\ntry:f(b+b'\\n')\nexcept AssertionError:pass\nelse:raise AssertionError('Unapproved reader bytes accepted')`],{cwd:root,stdio:'pipe'});
console.log(JSON.stringify({status:'PASS',sourceBoundParagraphs:13,staleSourceCases:13,stalePriorTextCases:13,rejectedCases:rejected,sourceAndTranslationsUnmodified:true,historicalComponentProjection:'exact',nativeReviewed:false,domainReviewed:false}));
