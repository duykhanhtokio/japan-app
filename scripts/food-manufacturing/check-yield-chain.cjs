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
const {FoodRoyalWeek5Native}=load(path.join(root,'src/components/food-manufacturing/FoodRoyalWeek5Native.tsx'));
const {FoodDailyLearning}=load(path.join(root,'src/components/food-manufacturing/FoodDailyLearning.tsx'));
const lesson=index.foodManufacturingLessons.find(l=>l.id==='food-2-026'),p=lesson.paragraphs.find(p=>p.id==='p2');assert(p);
assert(p.textJa.includes('100kg')&&p.textJa.includes('95kg')&&p.textJa.includes('90kg'));
assert.equal(95/100*100,95);assert.equal(Number((90/95*100).toFixed(1)),94.7);assert.equal(90/100*100,90);assert(Math.abs((95/100)*(90/95)-0.90)<1e-12);
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
let contexts=0;
for(const language of ['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']){
 const render=(value=lesson,showTranslation=true,component=FoodRoyalWeek5Native)=>renderToStaticMarkup(React.createElement(component,{lesson:value,language,showTranslation,textColor:'#eee',readingColor:'#ccc'}));
 const html=render();assert(html.includes('data-testid="food-yield-chain"'));
 for(const exact of ['100 kg','95 kg','90 kg','95%','94.7%','90%','(95 ÷ 100) × (90 ÷ 95) = 0.90'])assert(html.includes(exact),exact);
 assert(html.includes('aria-label="'+escape(p.textJa)+'"')||html.includes(escape(p.textJa)));
 if(language!=='ja'){
  const tr=index.foodManufacturingTranslation(lesson,language);assert(tr);assert(html.includes(escape(tr.paragraphs.p2)));assert(!render(lesson,false).includes(escape(tr.paragraphs.p2)));
 }
 assert(!render({...lesson,sourceHash:'changed'}).includes('food-yield-chain'));
 assert(!render({...lesson,paragraphs:lesson.paragraphs.filter(q=>q.id!=='p2')}).includes('food-yield-chain'));
 assert(!render({...lesson,paragraphs:lesson.paragraphs.map(q=>q.id==='p2'?{...q,textJa:q.textJa.replace('95kg','')}:q)}).includes('food-yield-chain'));
 assert(!render(index.foodManufacturingLessons.find(l=>l.id==='food-2-025')).includes('food-yield-chain'));
 const daily=render(lesson,true,FoodDailyLearning);assert(daily.includes('data-testid="food-yield-chain"'));
 contexts+=7;
}
console.log('PASS food yield chain: '+contexts+' current/stale/missing/changed-association/other-lesson/translation-toggle/daily-reader contexts across13locales; stage percentages, exact-product90%, and rounding checked against canonical100→95→90 example.');
