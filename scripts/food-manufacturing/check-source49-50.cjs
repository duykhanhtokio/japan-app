// Real Reader/check components with explicit RN-web/translation/test-state adapters.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),os=require('node:os');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const stable=v=>v&&typeof v==='object'?Array.isArray(v)?v.map(stable):Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const digest=v=>crypto.createHash('sha256').update(JSON.stringify(stable(v))).digest('hex');
const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const lessons=read('src/data/food-manufacturing/lessons.2.ja.json').lessons;
const packs=[49,50].map(n=>({n,pack:read(`src/data/food-manufacturing/source-closure${n}.json`)}));let rubyFields=0,pairs=0;
function ruby(s,t){assert.equal(t.map(x=>x.text).join(''),s);for(const x of t)if(/\p{Script=Han}/u.test(x.text))assert(/^[ぁ-ゖー]+$/.test(x.reading),x.text);rubyFields++;}
for(const {n,pack}of packs){
 assert.equal(pack.sections.length,1);assert.equal(pack.checks.length,1);
 for(const x of [...pack.sections,...pack.checks]){
  const l=lessons.find(l=>l.id===x.lessonId);assert.equal(x.lessonSourceHash,l.sourceHash);
  for(const k of ['humanReviewed','nativeReviewed','domainReviewed'])assert.equal(x[k],false);
  assert.equal(x.sourceHash,digest(x.textJa?{titleJa:x.titleJa,textJa:x.textJa}:{titleJa:x.titleJa,promptJa:x.promptJa,expectedPointsJa:x.expectedPointsJa}));
  ruby(x.titleJa,x.titleRuby);if(x.textJa)ruby(x.textJa,x.ruby);else{ruby(x.promptJa,x.promptRuby);x.expectedPointsJa.forEach((s,i)=>ruby(s,x.expectedPointsRuby[i]));assert.equal(x.graded,false);assert.equal(x.mutatesLearnerProgress,false);}
  assert.deepEqual(Object.keys(x.translations).sort(),[...locales].sort());
  for(const [loc,t]of Object.entries(x.translations)){
   assert.equal(t.sourceHash,x.sourceHash);assert(t.title.trim());
   if(x.textJa)assert(t.text.trim());else{assert(t.prompt.trim());assert.equal(t.expectedPoints.length,2);t.expectedPoints.forEach(s=>assert(s.trim()));}
   if(!loc.startsWith('zh'))assert(!/[ぁ-ゖァ-ヺ\p{Script=Han}]/u.test(JSON.stringify(t)),loc+' leaked Japanese');
   if(n===49&&x.textJa)for(const number of ['9','6','14','2','3','4','5','15','8'])assert(t.text.includes(number),loc+'/'+number);
   if(n===50&&!x.textJa){for(const number of ['100','10','132','12','90','8'])assert(t.prompt.includes(number));assert(t.expectedPoints[0].includes('11'));assert(t.expectedPoints[1].includes('11.25'));}
   pairs++;
  }
 }
}
const A=[2,3,1,4,2,5,3,4,1],B=[-3,-2,-1,0,1,2];assert.equal(A.length,9);assert(A.every(v=>v>0&&v<10));assert.equal(B.length,6);assert(B.every((v,i)=>i===0||v>B[i-1]));assert([...A,...B].every(v=>v>-10&&v<10));
assert.equal(100/10,10);assert.equal(132/12,11);assert.equal(90/8,11.25);assert(132*10>100*12);assert(90*10>100*8);
const figure='assets/food-manufacturing/source-practice49/inside-limit-sequences.webp',bytes=fs.readFileSync(path.join(root,figure));assert.equal(bytes.slice(8,12).toString(),'WEBP');assert(bytes.length>1000);
const visual=fs.readFileSync(path.join(root,'src/components/food-manufacturing/FoodSourcePracticeVisuals.tsx'),'utf8');assert(visual.includes('...foodSourcePractice49'));assert(visual.includes('...caption49.sections'));
const binding=fs.readFileSync(path.join(root,'src/data/food-manufacturing/source-practice49.ts'),'utf8');assert(binding.includes(packs[0].pack.sections[0].sourceHash));assert(binding.includes('inside-limit-sequences.webp'));
(async()=>{
 const esbuild=require('esbuild'),out=fs.mkdtempSync(path.join(os.tmpdir(),'food49-'));
 await esbuild.build({stdin:{contents:"export {FoodClosureSupplements} from './src/components/food-manufacturing/FoodClosureSupplements';",resolveDir:root},bundle:true,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime'],outfile:path.join(out,'entry.cjs'),plugins:[{name:'scoped-food-ssr',setup(b){
 b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));
 b.onResolve({filter:/^@\/components\/tokutei\/StudyAppearance$/},()=>({path:'translation',namespace:'adapter'}));
 b.onLoad({filter:/.*/,namespace:'adapter'},()=>({contents:"import React from 'react';export const TranslationText=({children})=><div>{children}</div>;",loader:'tsx',resolveDir:root}));
 b.onResolve({filter:/^@\//},a=>({path:path.join(root,'src',a.path.slice(2))}));
 b.onLoad({filter:/FoodSourceAssessmentChecks\.tsx$/},a=>({contents:fs.readFileSync(a.path,'utf8').replace('useState(false)','useState(Boolean(globalThis.__food49Reveal))'),loader:'tsx',resolveDir:path.dirname(a.path)}));
 }}]});
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{FoodClosureSupplements}=require(path.join(out,'entry.cjs'));let views=0,negative=0;
 for(const {pack}of packs){const s=pack.sections[0],c=pack.checks[0],lesson=lessons.find(l=>l.id===s.lessonId);
  for(const language of ['ja',...locales])for(const reveal of [false,true]){
   global.__food49Reveal=reveal;const html=renderToStaticMarkup(React.createElement(FoodClosureSupplements,{lesson,language,showTranslation:true,textColor:'#222',readingColor:'#555'}));
   assert(html.includes(`data-testid="${s.id}"`));assert(html.includes(`data-testid="${c.id}"`));assert.equal(html.includes(`data-testid="${c.id}-points"`),reveal);
   if(language!=='ja'){assert(html.includes(s.translations[language].text));assert(html.includes(c.translations[language].prompt));if(reveal)c.translations[language].expectedPoints.forEach(p=>assert(html.includes(p)));}views++;
  }
  for(const altered of [{...lesson,id:'wrong'},{...lesson,sourceHash:'stale'}]){const html=renderToStaticMarkup(React.createElement(FoodClosureSupplements,{lesson:altered,language:'vi',showTranslation:true,textColor:'#222',readingColor:'#555'}));assert(!html.includes(`data-testid="${s.id}"`));assert(!html.includes(`data-testid="${c.id}"`));negative++;}
 }
 delete global.__food49Reveal;
 const result={status:'PASS',teachingSections:2,openResponseChecks:2,answerPoints:4,translationPairs:pairs,translatedAnswerPoints:48,alignedRubyFields:rubyFields,actualComponentSsrViews:views,staleOrWrongLessonRejections:negative,originalControlledFigures:1,source49SequenceArithmetic:true,source50RatioArithmetic:true,answersHiddenUntilReveal:true,testOnlyRevealInjection:true,browserTested:false,physicalDeviceTested:false,measuredLearnerTime:false,domainReviewed:false,nativeReviewed:false,figure:{path:figure,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')}};
 fs.writeFileSync(path.join(root,'docs/ssw-workspace/food-manufacturing/source-v2-20261102/runtime-validation.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exitCode=1;});
