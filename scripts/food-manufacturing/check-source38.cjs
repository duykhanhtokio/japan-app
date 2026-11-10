const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),os=require('node:os');
const esbuild=require('esbuild'),root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const pack=read('src/data/food-manufacturing/source-closure38.json'),section=pack.sections[0],check=pack.checks[0];
const digest=v=>crypto.createHash('sha256').update(JSON.stringify(v,Object.keys(v).sort())).digest('hex');
const lesson=read('src/data/food-manufacturing/lessons.2.ja.json').lessons.find(l=>l.id===section.lessonId);
assert.equal(section.lessonSourceHash,lesson.sourceHash);assert.equal(check.lessonSourceHash,lesson.sourceHash);
assert.equal(section.sourceHash,digest({titleJa:section.titleJa,textJa:section.textJa}));assert.equal(check.sourceHash,digest({titleJa:check.titleJa,promptJa:check.promptJa,expectedPointsJa:check.expectedPointsJa}));
const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let rubyFields=0;
function ruby(text,tokens){assert.equal(tokens.map(t=>t.text).join(''),text);for(const t of tokens)if(/\p{Script=Han}/u.test(t.text))assert(/^[ぁ-ゖー]+$/.test(t.reading));rubyFields++;}
ruby(section.titleJa,section.titleRuby);ruby(section.textJa,section.ruby);ruby(check.titleJa,check.titleRuby);ruby(check.promptJa,check.promptRuby);check.expectedPointsJa.forEach((p,i)=>ruby(p,check.expectedPointsRuby[i]));
for(const item of [section,check]){assert.deepEqual(Object.keys(item.translations).sort(),[...locales].sort());for(const t of Object.values(item.translations)){assert.equal(t.sourceHash,item.sourceHash);assert(t.title.trim());if(t.text)assert(t.text.trim());else{assert(t.prompt.trim());assert.equal(t.expectedPoints.length,3);assert(t.expectedPoints.every(x=>x.trim()));}}}
const output=fs.mkdtempSync(path.join(os.tmpdir(),'food38-'));
(async()=>{
 await esbuild.build({stdin:{contents:"export {FoodClosureSupplements} from './src/components/food-manufacturing/FoodClosureSupplements';",resolveDir:root},bundle:true,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime'],outfile:path.join(output,'entry.cjs'),nodePaths:(process.env.NODE_PATH||'').split(path.delimiter),plugins:[{name:'food38-ssr',setup(b){
 b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));
 b.onResolve({filter:/^@\/components\/tokutei\/StudyAppearance$/},()=>({path:'translation',namespace:'adapter'}));
 b.onLoad({filter:/.*/,namespace:'adapter'},()=>({contents:"import React from 'react';export const TranslationText=({children})=><div data-testid='translation'>{children}</div>;",loader:'tsx',resolveDir:root}));
 b.onResolve({filter:/^@\//},a=>({path:path.join(root,'src',a.path.slice(2))}));
 b.onLoad({filter:/FoodSourceAssessmentChecks\.tsx$/},a=>({contents:fs.readFileSync(a.path,'utf8').replace('useState(false)','useState(Boolean(globalThis.__food38Reveal))'),loader:'tsx',resolveDir:path.dirname(a.path)}));
 }}]});
 const {FoodClosureSupplements}=require(path.join(output,'entry.cjs')),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');let cases=0;
 for(const language of ['ja',...locales])for(const revealed of [false,true]){global.__food38Reveal=revealed;const html=renderToStaticMarkup(React.createElement(FoodClosureSupplements,{lesson,language,showTranslation:true,textColor:'#222',readingColor:'#666'}));assert(html.includes(`data-testid="${section.id}"`));assert(html.includes(`data-testid="${check.id}"`));assert.equal(html.includes(`data-testid="${check.id}-points"`),revealed);if(language!=='ja'){assert(html.includes(section.translations[language].title));assert(html.includes(check.translations[language].prompt));if(revealed)for(const p of check.translations[language].expectedPoints)assert(html.includes(p));}cases++;}
 for(const altered of [{...lesson,sourceHash:'stale'},{...lesson,id:'missing'}]){const html=renderToStaticMarkup(React.createElement(FoodClosureSupplements,{lesson:altered,language:'vi',showTranslation:true,textColor:'#222',readingColor:'#666'}));assert(!html.includes(section.id));assert(!html.includes(check.id));}
 delete global.__food38Reveal;
 const result={status:'PASS',sourceTeachingSections:1,openResponseChecks:1,expectedPoints:3,translationPairs:24,alignedRubyFields:rubyFields,actualComponentSsrCases:cases,staleOrWrongLessonCasesRejected:2,answerPointsHiddenUntilReveal:true,testOnlyRevealInjection:true,browserTested:false,physicalDeviceTested:false,nativeReviewed:false,domainReviewed:false};
 fs.writeFileSync(path.join(root,'docs/ssw-workspace/food-manufacturing/source-closure-20261102/validation38.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exitCode=1});
