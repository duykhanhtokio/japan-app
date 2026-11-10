// Real Reader/check components with explicit RN-web/translation/test-state adapters.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),os=require('node:os');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const stable=v=>v&&typeof v==='object'?Array.isArray(v)?v.map(stable):Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const digest=v=>crypto.createHash('sha256').update(JSON.stringify(stable(v))).digest('hex');
const numeric=s=>(s.match(/\d+(?:\.\d+)?/g)||[]).sort();
const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const lessons=[...read('src/data/food-manufacturing/lessons.2.ja.json').lessons,...read('src/data/food-manufacturing/runtime-supplemental/lessons.json')];
const numbers=process.argv.slice(2).map(Number);if(!numbers.length)numbers.push(48,65);
assert(numbers.every(n=>[48,65].includes(n)));
assert.deepEqual([1,2,3,4,5].sort(),[1,4,2,5,3].sort());assert([1,2,3,4,5].slice(1).every((x,i)=>x>[1,2,3,4,5][i]));assert(![1,4,2,5,3].slice(1).every((x,i)=>x>[1,4,2,5,3][i]));
assert.equal((9+10+11)/3,10);assert.equal((7+10+13)/3,10);assert.equal(11-9,2);assert.equal(13-7,6);assert.equal(240/12,20);
const packs=numbers.map(n=>({n,pack:read(`src/data/food-manufacturing/source-closure${n}.json`)}));let rubyFields=0,pairs=0;
function ruby(s,t){assert.equal(t.map(x=>x.text).join(''),s);for(const x of t)if(/\p{Script=Han}/u.test(x.text))assert(/^[ぁ-ゖー]+$/.test(x.reading),x.text);rubyFields++;}
for(const {n,pack}of packs){
 assert(pack.sections.length>=1);assert(pack.checks.length>=1);
 for(const x of [...pack.sections,...pack.checks]){
  const l=lessons.find(l=>l.id===x.lessonId);assert.equal(x.lessonSourceHash,l.sourceHash);
  for(const k of ['humanReviewed','nativeReviewed','domainReviewed'])assert.equal(x[k],false);
  assert.equal(x.sourceHash,digest(x.textJa?{titleJa:x.titleJa,textJa:x.textJa}:{titleJa:x.titleJa,promptJa:x.promptJa,expectedPointsJa:x.expectedPointsJa}));
  ruby(x.titleJa,x.titleRuby);if(x.textJa)ruby(x.textJa,x.ruby);else{ruby(x.promptJa,x.promptRuby);x.expectedPointsJa.forEach((s,i)=>ruby(s,x.expectedPointsRuby[i]));assert.equal(x.graded,false);assert.equal(x.mutatesLearnerProgress,false);}
  assert.deepEqual(Object.keys(x.translations).sort(),[...locales].sort());
  for(const [loc,t]of Object.entries(x.translations)){
   assert.equal(t.sourceHash,x.sourceHash);assert(t.title.trim());
   if(x.textJa){assert(t.text.trim());assert.deepEqual(numeric(t.text),numeric(x.textJa));}else{assert.deepEqual(numeric(t.prompt),numeric(x.promptJa));t.expectedPoints.forEach((s,i)=>assert.deepEqual(numeric(s),numeric(x.expectedPointsJa[i])));assert(t.prompt.trim());assert.equal(t.expectedPoints.length,x.expectedPointsJa.length);t.expectedPoints.forEach(s=>assert(s.trim()));}
   if(!loc.startsWith('zh'))assert(!/[ぁ-ゖァ-ヺ\p{Script=Han}]/u.test(JSON.stringify(t).replace(/出来高|人時生産性|労働生産性/g,'')),loc+' leaked Japanese beyond the explicit term-learning targets');
   if(n===49&&x.textJa)for(const number of ['9','6','14','2','3','4','5','15','8'])assert(t.text.includes(number),loc+'/'+number);
   if(n===50&&!x.textJa){for(const number of ['100','10','132','12','90','8'])assert(t.prompt.includes(number));assert(t.expectedPoints[0].includes('11'));assert(t.expectedPoints[1].includes('11.25'));}
   pairs++;
  }
 }
}
(async()=>{
 const esbuild=require('esbuild'),out=fs.mkdtempSync(path.join(os.tmpdir(),'food49-'));
 await esbuild.build({stdin:{contents:"export {FoodClosureSupplements} from './src/components/food-manufacturing/FoodClosureSupplements';",resolveDir:root},bundle:true,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime'],outfile:path.join(out,'entry.cjs'),loader:{'.webp':'dataurl'},plugins:[{name:'scoped-food-ssr',setup(b){
 b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));
 b.onResolve({filter:/^@\/components\/tokutei\/StudyAppearance$/},()=>({path:'translation',namespace:'adapter'}));
 b.onLoad({filter:/.*/,namespace:'adapter'},()=>({contents:"import React from 'react';export const TranslationText=({children})=><div>{children}</div>;",loader:'tsx',resolveDir:root}));
 b.onResolve({filter:/^@\//},a=>({path:path.join(root,'src',a.path.slice(2))}));
 b.onLoad({filter:/FoodSourceAssessmentChecks\.tsx$/},a=>({contents:fs.readFileSync(a.path,'utf8').replace('useState(false)','useState(Boolean(globalThis.__food49Reveal))'),loader:'tsx',resolveDir:path.dirname(a.path)}));
 }}]});
 const plain=s=>s.replace(/&#x27;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{FoodClosureSupplements}=require(path.join(out,'entry.cjs'));let views=0,negative=0;
 for(const {pack}of packs)for(const s of pack.sections){const checks=pack.checks.filter(c=>c.lessonId===s.lessonId),lesson=lessons.find(l=>l.id===s.lessonId);
  for(const language of ['ja',...locales])for(const reveal of [false,true]){
   global.__food49Reveal=reveal;const html=plain(renderToStaticMarkup(React.createElement(FoodClosureSupplements,{lesson,language,showTranslation:true,textColor:'#222',readingColor:'#555'})));
   assert(html.includes(`data-testid="${s.id}"`));for(const c of checks){assert(html.includes(`data-testid="${c.id}"`));assert.equal(html.includes(`data-testid="${c.id}-points"`),reveal);}
   if(s.id==='food64-teaching')assert(html.includes('data-testid="food64-original-histogram"'));
   if(language!=='ja'){assert(html.includes(s.translations[language].text));for(const c of checks){assert(html.includes(c.translations[language].prompt));if(reveal)c.translations[language].expectedPoints.forEach(p=>assert(html.includes(p)));}}views++;
  }
  for(const altered of [{...lesson,id:'wrong'},{...lesson,sourceHash:'stale'}]){const html=plain(renderToStaticMarkup(React.createElement(FoodClosureSupplements,{lesson:altered,language:'vi',showTranslation:true,textColor:'#222',readingColor:'#555'})));assert(!html.includes(`data-testid="${s.id}"`));for(const c of checks)assert(!html.includes(`data-testid="${c.id}"`));negative++;}
 }
 delete global.__food49Reveal;
 const result={status:'PASS',numbers,teachingSections:packs.reduce((a,{pack})=>a+pack.sections.length,0),openResponseChecks:packs.reduce((a,{pack})=>a+pack.checks.length,0),answerPoints:packs.reduce((a,{pack})=>a+pack.checks.reduce((b,c)=>b+c.expectedPointsJa.length,0),0),translationPairs:pairs,alignedRubyFields:rubyFields,actualComponentSsrViews:views,staleOrWrongLessonRejections:negative,answersHiddenUntilReveal:true,browserTested:false,physicalDeviceTested:false,measuredLearnerTime:false,domainReviewed:false,nativeReviewed:false};
 const report=path.join(root,'docs/ssw-workspace/food-manufacturing/source-audit65-20261103');fs.mkdirSync(report,{recursive:true});fs.writeFileSync(path.join(report,'runtime-'+numbers.join('-')+'.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exitCode=1;});
