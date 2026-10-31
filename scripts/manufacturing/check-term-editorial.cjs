const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const {transformSync}=require('esbuild'),file=path.join(root,'src/data/manufacturing/term-editorial.ts');
const compiled=new Module(file,module);compiled.filename=file;compiled.paths=Module._nodeModulePaths(path.dirname(file));
// This frozen receipt tests the historical editorial layer, projected only from exact40 bytes.
const historical=require('node:child_process').execFileSync('python',['-c',
 "import runpy,pathlib; r=pathlib.Path('.'); m=runpy.run_path('scripts/manufacturing/apply-implementation40.py'); p='src/data/manufacturing/term-editorial.ts'; import sys; sys.stdout.buffer.write(m['predecessor'](p,(r/p).read_bytes()))"],{cwd:root});
compiled._compile(transformSync(historical.toString('utf8'),{loader:'ts',format:'cjs'}).code,file);
const apply=compiled.exports.manufacturingTermMeaning,patch=require(path.join(root,'src/data/manufacturing/term-editorial.json'));
const lesson=read('src/data/manufacturing/surface.json').lessons.find(l=>l.id===patch.lessonId),before=JSON.stringify(lesson);
const locales=read('docs/ssw-workspace/manufacturing/approved-scope.json').targetLocales;
assert.deepEqual(Object.keys(patch.wording).sort(),['ja',...locales].sort());
assert.equal(patch.sourceHash,lesson.sourceHash);assert.equal(patch.termIndex,3);assert.equal(patch.termJa,'端面ハゲ');
assert.equal(patch.wording.ja.before,lesson.terms[3].meaningJa);
for(const locale of ['ja',...locales]){
 const wording=patch.wording[locale];assert(wording.after.trim());assert.notEqual(wording.before,wording.after);
 if(locale!=='ja')assert.equal(wording.before,read(`src/data/manufacturing/translations/${locale}.json`).lessons[lesson.id].terms[3].meaning);
 assert.equal(apply(lesson,3,locale,wording.before),wording.after);
 assert.equal(apply(lesson,3,locale,'changed prior wording'),'changed prior wording');
 assert.equal(apply({...lesson,sourceHash:'stale'},3,locale,wording.before),wording.before);
}
const ja=patch.wording.ja.before,rejected=[];
for(const [name,l,index,locale,text] of [
 ['different lesson',{...lesson,id:'mfg1-surface-lesson-061'},3,'ja',ja],
 ['different index',lesson,2,'ja',ja],
 ['missing term',{...lesson,terms:[]},3,'ja',ja],
 ['different term',{...lesson,terms:lesson.terms.map((t,i)=>i===3?{...t,ja:'other'}:t)},3,'ja',ja],
 ['changed Japanese',{...lesson,terms:lesson.terms.map((t,i)=>i===3?{...t,meaningJa:'drift'}:t)},3,'ja',ja],
 ['unknown locale',lesson,3,'xx',ja],
 ['prototype locale',lesson,3,'toString',ja],
 ['missing target',lesson,3,'vi',undefined],
 ]){assert.equal(apply(l,index,locale,text),text);rejected.push(name);}
const saved=patch.wording.ja.after;patch.wording.ja.after='';assert.equal(apply(lesson,3,'ja',ja),ja);patch.wording.ja.after=saved;rejected.push('empty replacement');
assert.equal(JSON.stringify(lesson),before);
for(const flag of ['nativeReviewed','domainReviewed','humanReviewed'])assert.equal(patch[flag],false);
console.log(JSON.stringify({status:'PASS',sourceBoundTerms:13,staleSourceCases:13,stalePriorWordingCases:13,rejectedCases:rejected,sourceUnmodified:true,nativeReviewed:false,domainReviewed:false}));
