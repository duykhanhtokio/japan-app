const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),os=require('node:os');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const stable=v=>v&&typeof v==='object'?Array.isArray(v)?v.map(stable):Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const digest=v=>crypto.createHash('sha256').update(JSON.stringify(stable(v))).digest('hex');
const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const lessons=[...read('src/data/food-manufacturing/lessons.2.ja.json').lessons,...read('src/data/food-manufacturing/runtime-supplemental/lessons.json')];
const packs=[46,47,48].map(n=>({n,pack:read(`src/data/food-manufacturing/source-closure${n}.json`)}));
let rubyFields=0,pairs=0,answerPoints=0;
function ruby(s,t){assert.equal(t.map(x=>x.text).join(''),s);for(const x of t)if(/\p{Script=Han}/u.test(x.text))assert(/^[ぁ-ゖー]+$/.test(x.reading));rubyFields++;}
for(const {n,pack} of packs){
 assert.equal(pack.sections.length,1);assert.equal(pack.checks.length,1);
 const lesson=lessons.find(l=>l.id===pack.sections[0].lessonId);
 for(const x of [...pack.sections,...pack.checks]){
  assert.equal(x.lessonSourceHash,lesson.sourceHash);for(const k of ['humanReviewed','nativeReviewed','domainReviewed'])assert.equal(x[k],false);
  assert.equal(x.sourceHash,digest(x.textJa?{titleJa:x.titleJa,textJa:x.textJa}:{titleJa:x.titleJa,promptJa:x.promptJa,expectedPointsJa:x.expectedPointsJa}));
  ruby(x.titleJa,x.titleRuby);
  if(x.textJa)ruby(x.textJa,x.ruby);else{ruby(x.promptJa,x.promptRuby);x.expectedPointsJa.forEach((p,i)=>ruby(p,x.expectedPointsRuby[i]));answerPoints+=x.expectedPointsJa.length;assert.equal(x.graded,false);assert.equal(x.mutatesLearnerProgress,false);}
  assert.deepEqual(Object.keys(x.translations).sort(),[...locales].sort());
  for(const t of Object.values(x.translations)){
   assert.equal(t.sourceHash,x.sourceHash);assert(t.title.trim());
   if(x.textJa)assert(t.text.trim());else{assert(t.prompt.trim());assert.equal(t.expectedPoints.length,2);t.expectedPoints.forEach(s=>assert(s.trim()));}
   pairs++;
  }
 }
}
const atomic=read('docs/ssw-workspace/food-manufacturing/atomic-qc-next-20261102/matrix46-48.json');assert.equal(atomic.records.length,9);assert.equal(atomic.full251PageAtomicDecompositionComplete,false);
for(const r of atomic.records){const p=packs.find(p=>p.pack.sections[0].id===r.after.teachingId).pack;assert.equal(p.sections[0].sourceHash,r.after.teachingSourceHash);assert.equal(p.checks[0].sourceHash,r.after.checkSourceHash);assert.equal(p.sections[0].lessonSourceHash,r.after.lessonSourceHash);}
// Exact hundredths: 1.35−1.25 = 0.10; 1.25 < 1.3 < 1.35.
assert.equal(135-125,10);assert(125<130&&130<135);
for(const {n,pack} of packs)for(const x of [...pack.sections,...pack.checks])for(const t of Object.values(x.translations)){
 if(n===47){assert(t.text||t.prompt);if(t.text)for(const v of ['CL','UCL','LCL','Critical Limit'])assert(t.text.includes(v));}
 if(n===46){if(t.text)for(const v of ['0.1g','1.25g','1.35g','1.3g'])assert(t.text.includes(v));if(t.expectedPoints)for(const v of ['0.1g','1','2'])assert(t.expectedPoints[0].includes(v));}
}
const figures=read('docs/ssw-workspace/food-manufacturing/atomic-qc-next-20261102/figures46-48.json');assert.equal(figures.newFigures.length,2);
for(const f of figures.newFigures){const b=fs.readFileSync(path.join(root,f.path));assert.equal(b.slice(0,4).toString(),'RIFF');assert.equal(b.slice(8,12).toString(),'WEBP');assert.equal(crypto.createHash('sha256').update(b).digest('hex'),f.sha256);assert.equal(b.length,f.bytes);}
const oldFigure=fs.readFileSync(path.join(root,'assets/food-manufacturing/source-practice36/histogram-bin-comparison.webp'));assert.equal(oldFigure.slice(8,12).toString(),'WEBP');
(async()=>{
 const esbuild=require('esbuild'),out=fs.mkdtempSync(path.join(os.tmpdir(),'food46-'));
 await esbuild.build({stdin:{contents:"export {FoodClosureSupplements} from './src/components/food-manufacturing/FoodClosureSupplements';",resolveDir:root},bundle:true,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime'],outfile:path.join(out,'entry.cjs'),plugins:[{name:'scoped-food-ssr',setup(b){
 b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));
 b.onResolve({filter:/^@\/components\/tokutei\/StudyAppearance$/},()=>({path:'translation',namespace:'adapter'}));
 b.onLoad({filter:/.*/,namespace:'adapter'},()=>({contents:"import React from 'react';export const TranslationText=({children})=><div>{children}</div>;",loader:'tsx',resolveDir:root}));
 b.onResolve({filter:/^@\//},a=>({path:path.join(root,'src',a.path.slice(2))}));
 b.onLoad({filter:/FoodSourceAssessmentChecks\.tsx$/},a=>({contents:fs.readFileSync(a.path,'utf8').replace('useState(false)','useState(Boolean(globalThis.__food46Reveal))'),loader:'tsx',resolveDir:path.dirname(a.path)}));
 }}]});
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{FoodClosureSupplements}=require(path.join(out,'entry.cjs'));let views=0,negative=0;
 for(const {pack} of packs){const s=pack.sections[0],lesson=lessons.find(l=>l.id===s.lessonId);for(const c of pack.checks){
  for(const language of ['ja',...locales])for(const show of [false,true]){
   global.__food46Reveal=show;
   const html=renderToStaticMarkup(React.createElement(FoodClosureSupplements,{lesson,language,showTranslation:true,textColor:'#222',readingColor:'#555'}));
   assert(html.includes(`data-testid="${s.id}"`));assert(html.includes(`data-testid="${c.id}"`));assert.equal(html.includes(`data-testid="${c.id}-points"`),show);
   if(language!=='ja'){assert(html.includes(s.translations[language].title));assert(html.includes(s.translations[language].text));assert(html.includes(c.translations[language].prompt));if(show)c.translations[language].expectedPoints.forEach(p=>assert(html.includes(p)));}
   views++;
  }
  for(const altered of [{...lesson,sourceHash:'stale'},{...lesson,id:'wrong'}]){const html=renderToStaticMarkup(React.createElement(FoodClosureSupplements,{lesson:altered,language:'vi',showTranslation:true,textColor:'#222',readingColor:'#555'}));assert(!html.includes(`data-testid="${s.id}"`));assert(!html.includes(`data-testid="${c.id}"`));negative++;}
 }
 }
 delete global.__food46Reveal;
 const result={status:'PASS',teachingSections:3,openResponseChecks:3,answerPoints,translationPairs:pairs,translatedAnswerPoints:answerPoints*12,alignedRubyFields:rubyFields,actualComponentSsrViews:views,staleOrWrongLessonRejections:negative,originalControlledFigures:2,reusedControlledFigures:1,sourceHashBinding:true,answersHiddenUntilReveal:true,testOnlyRevealInjection:true,browserTested:false,physicalDeviceTested:false,measuredLearnerTime:false,domainReviewed:false,nativeReviewed:false};
 fs.writeFileSync(path.join(root,'docs/ssw-workspace/food-manufacturing/atomic-qc-next-20261102/validation46-48.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exitCode=1;});
