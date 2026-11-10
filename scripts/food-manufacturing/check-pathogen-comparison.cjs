/* Actual reader regression with deterministic RN/asset/ruby adapters; no device-pixel claim. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const esbuild=require('esbuild'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
let expanded=null;
const root=path.resolve(__dirname,'../..'),cache=new Map();
const flatten=style=>Object.assign({},...(Array.isArray(style)?style.flat(Infinity):[style]).filter(Boolean));
const wrap=tag=>({children,testID,accessibilityLabel,style})=>React.createElement(tag,{'data-testid':testID,'aria-label':accessibilityLabel,style:{...(tag==='div'?{display:'flex',flexDirection:'column'}:{}),...flatten(style)}},children);
const rn={View:wrap('div'),Text:wrap('span'),ScrollView:wrap('div'),Pressable:wrap('button'),Image:({source,accessibilityLabel})=>React.createElement('img',{src:source.uri,alt:accessibilityLabel}),Modal:({visible,children})=>visible?React.createElement('div',null,children):null,StyleSheet:{create:s=>s}};
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
 if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));
 const m={exports:{}};cache.set(file,m);
 const code=esbuild.transformSync(fs.readFileSync(file,'utf8'),{loader:file.endsWith('.tsx')?'tsx':'ts',format:'cjs',jsxFactory:'React.createElement'}).code;
 function req(name){
  if(name==='react')return {...React,useState:()=>[expanded,value=>{expanded=value} ]};if(name==='react-native')return rn;
  if(name==='@/components/tokutei/StudyAppearance')return {TranslationText:wrap('span')};
  if(name==='./FoodSourcePracticeVisuals')return {FoodSourcePracticeVisuals:()=>null};
  if(name==='./FoodRoyalOjtCycle')return {FoodRoyalOjtCycle:()=>null};
  if(name==='./FoodRoyalChemicalSafety')return {FoodRoyalChemicalSafety:()=>null};
  // Supplement-caption exercises are outside these six legacy direct-paragraph bindings.
  if(/source-closure\d+\.json$/.test(name))return {sections:[]};
  if(name==='@/data/food-manufacturing/royal-technical-axis-labels.json')return {locales:{}};
  if(name==='./translations/glossary.json')return {terms:[]};
  if(name==='./supplemental')return {supplementalLessons:load(path.join(root,'src/data/food-manufacturing/runtime-supplemental/lessons.json')),supplementalExams:[],supplementalTranslations:{},supplementalTestTranslations:{}};
  let target=name.startsWith('@/')?path.join(root,'src',name.slice(2)):name.startsWith('.')?path.resolve(path.dirname(file),name):null;
  if(!target)return require(name);if(/\.(webp|png)$/.test(target))return {uri:target};
  for(const candidate of [target,target+'.ts',target+'.tsx',target+'.json',path.join(target,'index.ts')])if(fs.existsSync(candidate)&&fs.statSync(candidate).isFile())return load(candidate);
  throw Error('Missing scoped dependency '+target);
 }
 vm.runInNewContext('(function(require,module,exports,React){'+code+'\n})',{console})(req,m,m.exports,React);return m.exports;
}
const index=load(path.join(root,'src/data/food-manufacturing/index.ts'));
const {FoodPathogenComparison}=load(path.join(root,'src/components/food-manufacturing/FoodPathogenComparison.tsx'));
const lesson=index.foodManufacturingLessons.find(l=>l.id==='food-1-039');assert(lesson);
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
let contexts=0;
const locales=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
for(const language of locales){
 const render=(value=lesson,showTranslation=true)=>renderToStaticMarkup(React.createElement(FoodPathogenComparison,{lesson:value,language,showTranslation}));
 const html=render();assert.equal((html.match(/data-testid="food-pathogen-p/g)||[]).length,8);assert(html.includes('カンピロバクター属菌'));assert(html.includes('ボツリヌス菌'));
 // Full canonical warnings remain legible native text, rather than becoming diagnostic shortcuts.
 for(const p of lesson.paragraphs)assert(html.includes(escape(p.textJa))||html.includes('aria-label="'+escape(p.textJa)+'"'));
 if(language!=='ja'){
  const tr=index.foodManufacturingTranslation(lesson,language);assert(tr);
  for(const p of lesson.paragraphs)assert(html.includes(escape(tr.paragraphs[p.id])));
  assert(!render(lesson,false).includes(escape(tr.paragraphs.p1)));
 }
 assert.equal(render({...lesson,id:'food-1-006'}),'');
 assert.equal(render({...lesson,sourceHash:'advanced'}),'');
 assert.equal(render({...lesson,paragraphs:lesson.paragraphs.filter(p=>p.id!=='p3')}),'');
 assert.equal(render({...lesson,paragraphs:lesson.paragraphs.map(p=>p.id==='p1'?{...p,textJa:p.textJa.replace('魚介類','')}:p)}),'');
 contexts+=6;
 if(language==='ja'||language==='vi')fs.writeFileSync('/tmp/food-pathogen-'+language+'.html','<!doctype html><html lang="'+language+'"><meta charset="utf-8"><style>body{margin:0;background:#e8e2d6;font-family:"Noto Sans CJK JP",sans-serif}main{padding:16px;max-width:1000px;margin:auto}*{box-sizing:border-box}</style><main>'+html+'</main></html>');
}
const {FoodDailyLearning}=load(path.join(root,'src/components/food-manufacturing/FoodDailyLearning.tsx'));
for(const language of locales){
 const html=renderToStaticMarkup(React.createElement(FoodDailyLearning,{lesson,language,showTranslation:true,textColor:'#eee',readingColor:'#ccc'}));
 assert(html.includes('data-testid="food-pathogen-food-comparison"'));
 assert.equal((html.match(/data-testid="food-pathogen-p/g)||[]).length,8);
 assert(html.includes('invisible-microbiological-risk.webp'));
}
console.log('PASS FoodPathogenComparison: '+contexts+' actual component contexts, plus13 actual daily-reader integrations; eight exact associations and full source conditions/cautions across Japanese+12 locales; stale lesson, revision, missing paragraph and removed association rejected.');
