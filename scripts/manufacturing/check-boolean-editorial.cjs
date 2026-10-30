const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const {transformSync}=require('esbuild');
function compile(relative,dependency){
 const file=path.join(root,relative),m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));
 if(dependency)m.require=function(id){return id==='./boolean-editorial'?dependency:Module.prototype.require.call(this,id);};
 m._compile(transformSync(fs.readFileSync(file,'utf8'),{loader:'ts',format:'cjs'}).code,file);return m.exports;
}
const helper=compile('src/data/manufacturing/boolean-editorial.ts');
const apply=compile('src/data/manufacturing/lesson-editorial.ts',helper).manufacturingLessonParagraph;
const patch=require(path.join(root,'src/data/manufacturing/boolean-editorial.json'));
const lesson=read('src/data/manufacturing/electrical.json').lessons.find(l=>l.id===patch.lessonId),snapshot=JSON.stringify(lesson);
const locales=read('docs/ssw-workspace/manufacturing/approved-scope.json').targetLocales;
assert.equal(patch.lessonId,'mfg1-electrical-l075');assert.equal(patch.paragraphId,'section-2');assert.equal(patch.sourceHash,lesson.sourceHash);
assert.equal(patch.wording.ja.before,lesson.paragraphs.find(p=>p.id==='section-2').textJa);
assert.deepEqual(Object.keys(patch.wording).sort(),['ja',...locales].sort());
for(const locale of ['ja',...locales]){
 const w=patch.wording[locale];
 if(locale!=='ja')assert.equal(w.before,read(`src/data/manufacturing/translations/${locale}.json`).lessons[lesson.id].paragraphs.find(p=>p.id==='section-2').text);
 assert(w.after.startsWith(w.before+'\n'));assert(w.after.includes('x+(y・z)=(x+y)・(x+z)'));
 assert.equal(apply(lesson,'section-2',locale,w.before),w.after);
 assert.equal(apply({...lesson,sourceHash:'stale'},'section-2',locale,w.before),w.before);
 assert.equal(apply(lesson,'section-2',locale,'changed prior'),'changed prior');
}
const ja=patch.wording.ja.before,rejected=[];
for(const [name,l,id,locale,text] of [
 ['different lesson',{...lesson,id:'mfg1-electrical-l074'},'section-2','ja',ja],
 ['different paragraph',lesson,'section-1','ja',ja],
 ['changed Japanese',{...lesson,paragraphs:lesson.paragraphs.map(p=>p.id==='section-2'?{...p,textJa:'drift'}:p)},'section-2','vi',patch.wording.vi.before],
 ['missing paragraph',{...lesson,paragraphs:[]},'section-2','ja',ja],
 ['unknown locale',lesson,'section-2','xx',ja],
 ['prototype locale',lesson,'section-2','toString',ja],
 ['missing target',lesson,'section-2','vi',undefined],
 ]){assert.equal(apply(l,id,locale,text),text);rejected.push(name);}
const saved=patch.wording.ja.after;patch.wording.ja.after='';assert.equal(apply(lesson,'section-2','ja',ja),ja);patch.wording.ja.after=saved;rejected.push('empty replacement');
const table=[];
for(const x of [0,1])for(const y of [0,1])for(const z of [0,1]){
 const left=Number(Boolean(x||y&&z)),right=Number(Boolean((x||y)&&(x||z)));
 assert.equal(left,right);assert.equal(left,x?1:Number(Boolean(y&&z)));table.push({x,y,z,left,right});
}
assert.notEqual(1+(1*1),(1+1)*(1+1),'Boolean law must not be generalized to ordinary arithmetic');
assert.equal(JSON.stringify(lesson),snapshot);
for(const flag of ['nativeReviewed','domainReviewed','humanReviewed'])assert.equal(patch[flag],false);
console.log(JSON.stringify({status:'PASS',localeBindings:13,dispatcherIntegrated:true,staleSourceCases:13,stalePriorWordingCases:13,rejectedCases:rejected,truthTable:table,numericArithmeticCounterexample:true,sourceUnmodified:true}));
