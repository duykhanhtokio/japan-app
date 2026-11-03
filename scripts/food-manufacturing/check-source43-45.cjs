const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),os=require('node:os');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const stable=v=>v&&typeof v==='object'?Array.isArray(v)?v.map(stable):Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const digest=v=>crypto.createHash('sha256').update(JSON.stringify(stable(v))).digest('hex');
const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const lessons=[...read('src/data/food-manufacturing/lessons.2.ja.json').lessons,...read('src/data/food-manufacturing/runtime-supplemental/lessons.json')];
const packs=[43,44,45].map(n=>({n,pack:read(`src/data/food-manufacturing/source-closure${n}.json`)}));
let rubyFields=0,pairs=0,answerPoints=0;
function ruby(s,t){assert.equal(t.map(x=>x.text).join(''),s);for(const x of t)if(/\p{Script=Han}/u.test(x.text))assert(/^[ぁ-ゖー]+$/.test(x.reading));rubyFields++;}
for(const {n,pack} of packs){
 assert.equal(pack.sections.length,1);assert.equal(pack.checks.length,n===43?4:n===44?2:1);
 const lesson=lessons.find(l=>l.id===pack.sections[0].lessonId);
 for(const x of [...pack.sections,...pack.checks]){
  assert.equal(x.lessonSourceHash,lesson.sourceHash);for(const k of ['humanReviewed','nativeReviewed','domainReviewed'])assert.equal(x[k],false);
  assert.equal(x.sourceHash,digest(x.textJa?{titleJa:x.titleJa,textJa:x.textJa}:{titleJa:x.titleJa,promptJa:x.promptJa,expectedPointsJa:x.expectedPointsJa}));
  ruby(x.titleJa,x.titleRuby);
  if(x.textJa)ruby(x.textJa,x.ruby);else{ruby(x.promptJa,x.promptRuby);x.expectedPointsJa.forEach((p,i)=>ruby(p,x.expectedPointsRuby[i]));answerPoints+=x.expectedPointsJa.length;assert.equal(x.graded,false);assert.equal(x.mutatesLearnerProgress,false);}
  assert.deepEqual(Object.keys(x.translations).sort(),[...locales].sort());
  for(const t of Object.values(x.translations)){
   assert.equal(t.sourceHash,x.sourceHash);assert(t.title.trim());
   if(x.textJa)assert(t.text.trim());else{assert(t.prompt.trim());assert.equal(t.expectedPoints.length,2);t.expectedPoints.forEach(s=>assert(s.trim()));if(x.id==='food43-check')for(const v of ['X','Y','Z','4','9','2'])assert(t.prompt.includes(v));if(x.id==='food43-time-check'){for(const v of ['2','3'])assert(t.prompt.includes(v));for(const v of ['9','4','5'])assert(t.expectedPoints[0].includes(v));}}
   pairs++;
  }
 }
}
const matrix=read('docs/ssw-workspace/food-manufacturing/atomic-qc-20261102/matrix.json'),remediation=read('docs/ssw-workspace/food-manufacturing/atomic-qc-20261102/remediation43-45.json');
assert.equal(remediation.records.length,7);assert.equal(remediation.full251PageAtomicDecompositionComplete,false);assert.equal(remediation.fullSourceCoverageCertified,false);
const sections=[...read('src/data/food-manufacturing/source-closure34.json').sections,...packs.flatMap(p=>p.pack.sections)],checks=packs.flatMap(p=>p.pack.checks);
for(const row of remediation.records){const before=matrix.records.find(r=>r.id===row.atomicId);assert(before);assert.equal(before.status,row.before.status);const t=sections.find(s=>s.id===row.after.teachingId),c=checks.find(c=>c.id===row.after.checkId);assert(t&&c);assert.equal(t.sourceHash,row.after.teachingSourceHash);assert.equal(c.sourceHash,row.after.checkSourceHash);assert.equal(c.lessonSourceHash,row.after.lessonSourceHash);assert.equal(c.lessonId,row.after.lessonId);}
for(const {pack} of packs)for(const item of [...pack.sections,...pack.checks])for(const tokens of [item.titleRuby,item.ruby,item.promptRuby,...(item.expectedPointsRuby||[])].filter(Boolean))for(const token of tokens)if(token.text==='台型')assert.equal(token.reading,'だいけい');
assert.equal(9-4,5,'Read existing line-graph weeks2=9 and3=4: decrease5');
assert.equal(9-2,7,'Focused bar comparison: Y9 minus Z2 =7');
assert.equal(12+6+2,20);assert.deepEqual([12/20*100,18/20*100,20/20*100],[60,90,100]);
const pareto=packs[0].pack.checks.find(c=>c.id==='food60-pareto-twoaxes');assert(pareto);for(const t of Object.values(pareto.translations)){for(const v of ['A','B','C','12','6','2'])assert(t.prompt.includes(v));for(const v of ['20','60','90','100'])assert(t.expectedPoints[1].includes(v));}
assert(packs[1].pack.checks.some(c=>c.id==='food61-broad-bins'));
const added=packs[0].pack.checks.find(c=>c.id==='food59-bar-comparison');assert(added);for(const t of Object.values(added.translations)){for(const v of ['X','Y','Z','4','9','2'])assert(t.prompt.includes(v));for(const v of ['9','2','7'])assert(t.expectedPoints[0].includes(v));}
const figures=read('docs/ssw-workspace/food-manufacturing/atomic-qc-20261102/figures43-45.json');
assert.deepEqual(figures.syntheticHistogram44Total,figures.syntheticHistogram44Groups[0].map((_,i)=>figures.syntheticHistogram44Groups.reduce((n,a)=>n+a[i],0)));
for(const f of figures.records){const b=fs.readFileSync(path.join(root,f.path));assert.equal(b.slice(0,4).toString(),'RIFF');assert.equal(b.slice(8,12).toString(),'WEBP');assert.equal(crypto.createHash('sha256').update(b).digest('hex'),f.sha256);assert.equal(b.length,f.bytes);assert.equal(f.translatedCaptionLocales,12);}
(async()=>{
 const esbuild=require('esbuild'),out=fs.mkdtempSync(path.join(os.tmpdir(),'food43-'));
 await esbuild.build({stdin:{contents:"export {FoodClosureSupplements} from './src/components/food-manufacturing/FoodClosureSupplements';",resolveDir:root},bundle:true,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime'],outfile:path.join(out,'entry.cjs'),plugins:[{name:'scoped-food-ssr',setup(b){
 b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));
 b.onResolve({filter:/^@\/components\/tokutei\/StudyAppearance$/},()=>({path:'translation',namespace:'adapter'}));
 b.onLoad({filter:/.*/,namespace:'adapter'},()=>({contents:"import React from 'react';export const TranslationText=({children})=><div>{children}</div>;",loader:'tsx',resolveDir:root}));
 b.onResolve({filter:/^@\//},a=>({path:path.join(root,'src',a.path.slice(2))}));
 b.onLoad({filter:/FoodSourceAssessmentChecks\.tsx$/},a=>({contents:fs.readFileSync(a.path,'utf8').replace('useState(false)','useState(Boolean(globalThis.__food43Reveal))'),loader:'tsx',resolveDir:path.dirname(a.path)}));
 }}]});
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{FoodClosureSupplements}=require(path.join(out,'entry.cjs'));let views=0,negative=0;
 for(const {pack} of packs){const s=pack.sections[0],lesson=lessons.find(l=>l.id===s.lessonId);for(const c of pack.checks){
  for(const language of ['ja',...locales])for(const show of [false,true]){
   global.__food43Reveal=show;
   const html=renderToStaticMarkup(React.createElement(FoodClosureSupplements,{lesson,language,showTranslation:true,textColor:'#222',readingColor:'#555'}));
   assert(html.includes(`data-testid="${s.id}"`));assert(html.includes(`data-testid="${c.id}"`));assert.equal(html.includes(`data-testid="${c.id}-points"`),show);
   if(language!=='ja'){assert(html.includes(s.translations[language].title));assert(html.includes(s.translations[language].text));assert(html.includes(c.translations[language].prompt));if(show)c.translations[language].expectedPoints.forEach(p=>assert(html.includes(p)));}
   views++;
  }
  for(const altered of [{...lesson,sourceHash:'stale'},{...lesson,id:'wrong'}]){const html=renderToStaticMarkup(React.createElement(FoodClosureSupplements,{lesson:altered,language:'vi',showTranslation:true,textColor:'#222',readingColor:'#555'}));assert(!html.includes(`data-testid="${s.id}"`));assert(!html.includes(`data-testid="${c.id}"`));negative++;}
 }
 }
 delete global.__food43Reveal;
 const result={status:'PASS',teachingSections:3,openResponseChecks:7,answerPoints,translationPairs:pairs,translatedAnswerPoints:answerPoints*12,alignedRubyFields:rubyFields,actualComponentSsrViews:views,staleOrWrongLessonRejections:negative,originalControlledFigures:3,sourceHashBinding:true,answersHiddenUntilReveal:true,testOnlyRevealInjection:true,browserTested:false,physicalDeviceTested:false,measuredLearnerTime:false,domainReviewed:false,nativeReviewed:false};
 const oi=process.argv.indexOf('--out'),report=oi>=0?process.argv[oi+1]:'docs/ssw-workspace/food-manufacturing/atomic-qc-20261102/validation43-45.json';assert(report);fs.writeFileSync(path.join(root,report),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exitCode=1;});
