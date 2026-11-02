const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const root=path.resolve(__dirname,'../..'),{transformSync}=require('esbuild'),resolve=Module._resolveFilename;
Module._resolveFilename=function(id,parent,...rest){let p=id.startsWith('@/')?path.join(root,'src',id.slice(2)):id;if((p.startsWith('.')||path.isAbsolute(p))&&!path.extname(p)){const candidate=path.resolve(parent?path.dirname(parent.filename):root,p)+'.ts';if(fs.existsSync(candidate))p=candidate;}return resolve.call(this,p,parent,...rest);};
require.extensions['.ts']=(m,file)=>m._compile(transformSync(fs.readFileSync(file,'utf8'),{loader:'ts',format:'cjs'}).code,file);
const req=p=>require(path.join(root,p)),patchPath=path.join(root,'src/data/manufacturing/source47-clarification.json');
const dispatch=req('src/data/manufacturing/lesson-editorial.ts').manufacturingLessonParagraph;
const course=req('src/data/manufacturing/mechanical.json'),lesson=course.lessons.find(l=>l.id==='mfg1-mechanical-lesson-080');
const original=JSON.stringify(course),before=lesson.paragraphs.find(p=>p.id==='section-2').textJa;
assert(!require.cache[patchPath]);
assert.equal(dispatch(lesson,'section-1','ja','unrelated'), 'unrelated');
assert(!require.cache[patchPath], 'unrelated paragraph must not load this payload');
const actualJapanese=dispatch(lesson,'section-2','ja',before),patch=require(patchPath),locales=req('docs/ssw-workspace/manufacturing/approved-scope.json').targetLocales;
assert.deepEqual(Object.keys(patch.wording).sort(),['ja',...locales].sort());
assert.equal(patch.sourceHash,lesson.sourceHash);
assert(actualJapanese.endsWith('細い実線で切り口を示します。'));
assert(actualJapanese.includes('繰返しや図示した断面の手前'));
assert(actualJapanese.includes('端部と方向が変わる部分を太く'));
const translations=req('src/data/manufacturing/translations.ts');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{Text}=require('react-native-web');
let negatives=0,rendered=0;
for(const loc of ['ja',...locales]){
 const w=patch.wording[loc],current=loc==='ja'?before:translations.manufacturingTranslation(lesson,loc).paragraphs.find(p=>p.id==='section-2').text;
 assert.equal(current,w.before,'guard must match effective reader target, not stale raw content');
 assert(w.after.startsWith(w.before+'\n'));assert(w.after.length>w.before.length+120);
 assert.equal(dispatch(lesson,'section-2',loc,current),w.after);
 const html=renderToStaticMarkup(React.createElement(Text,{selectable:true},dispatch(lesson,'section-2',loc,current)));
 assert(html.includes(w.after.slice(-30)),loc+' visible rendered suffix');rendered++;
 for(const [l,p,t] of [[{...lesson,sourceHash:'stale'},'section-2',current],[{...lesson,paragraphs:[]},'section-2',current],[lesson,'section-1',current],[lesson,'section-2',current+'-changed']]){assert.equal(dispatch(l,p,loc,t),t);negatives++;}
}
for(const loc of ['xx','toString','__proto__']){assert.equal(dispatch(lesson,'section-2',loc,before),before);negatives++;}
assert.equal(JSON.stringify(course),original,'frozen bank and learner identities must be unchanged');
for(const f of ['nativeReviewed','domainReviewed','wholeSourceClosed'])assert.equal(patch[f],false);
console.log(JSON.stringify({status:'PASS',lessonLocales:13,effectiveTargetGuards:13,negativeGuards:negatives,renderedParagraphs:rendered,renderer:'ReactNativeWebTextSSR_not_browser_or_native',frozenCourseUnchanged:true,newQuestions:0,whole574KnowledgeClosed:false}));
