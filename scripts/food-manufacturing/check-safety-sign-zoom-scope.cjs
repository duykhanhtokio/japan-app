/* Actual reader regression with deterministic RN/asset/ruby adapters; no device-pixel claim. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const esbuild=require('esbuild'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
let expanded=null;
const root=path.resolve(__dirname,'../..'),cache=new Map();
const wrap=tag=>({children,testID,accessibilityLabel,...props})=>React.createElement(tag,{'data-testid':testID,'aria-label':accessibilityLabel},children);
const rn={View:wrap('div'),Text:wrap('span'),ScrollView:wrap('div'),Pressable:wrap('button'),Image:({source,accessibilityLabel})=>React.createElement('img',{src:source.uri,alt:accessibilityLabel}),Modal:({visible,children})=>visible?React.createElement('div',null,children):null,StyleSheet:{create:s=>s}};
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
 if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));
 const m={exports:{}};cache.set(file,m);
 const code=esbuild.transformSync(fs.readFileSync(file,'utf8'),{loader:file.endsWith('.tsx')?'tsx':'ts',format:'cjs',jsxFactory:'React.createElement'}).code;
 function req(name){
  if(name==='react')return {...React,useState:()=>[expanded,value=>{expanded=value} ]};if(name==='react-native')return rn;
  if(name==='@/components/tokutei/StudyAppearance')return {TranslationText:wrap('span')};
  if(name==='./FoodLessonRuby')return {FoodLessonRuby:({text})=>React.createElement('span',null,text)};
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
const {FoodSafetySigns}=load(path.join(root,'src/components/food-manufacturing/FoodSafetySigns.tsx'));
const {foodSafetySignData:data}=load(path.join(root,'src/data/food-manufacturing/safety-signs.ts'));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
let contexts=0;
for(const language of ['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']){
 for(const lessonId of ['food-1-037','food-1-042']){
  const lesson=index.foodManufacturingLessons.find(l=>l.id===lessonId);
  const render=(value=lesson,dailyPlacement=true)=>renderToStaticMarkup(React.createElement(FoodSafetySigns,{lesson:value,language,showTranslation:true,dailyPlacement,textColor:'#eee',readingColor:'#ccc'}));
  const other=index.foodManufacturingLessons.find(l=>l.id===(lessonId==='food-1-042'?'food-1-037':'food-1-042'));
  expanded=null;assert(!render().includes('-zoom'));contexts++;
  for(const sign of data.signs){
   const allowed=lessonId==='food-1-042'||!['head-impact','keep-door-closed'].includes(sign.id);
   expanded=lesson.id+':'+lesson.sourceHash+':'+sign.id;
   const html=render();assert.equal(html.includes('data-testid="food-sign-'+sign.id+'-zoom"'),allowed);
   if(allowed&&language!=='ja'){
    const labels=data.translations[language];const label=labels.labels[data.signs.indexOf(sign)];
    assert(html.includes(escape(label)));assert(html.includes(escape(labels.notice)));
   }
   // Keep the same expanded state while the reused reader receives another lesson.
   assert(!render(other).includes('-zoom'));
   assert(!render({...lesson,sourceHash:'new-revision'}).includes('food-safety-signs'));
   assert(!render(lesson,false).includes('food-safety-signs'));
   expanded=lesson.id+':'+lesson.sourceHash+':missing-sign';assert(!render().includes('-zoom'));
   expanded=data.signs.indexOf(sign);assert(!render().includes('-zoom'));
   contexts+=6;
  }
 }
}
console.log('PASS FoodSafetySigns: '+contexts+' actual component SSR contexts, JA+12 locales, 15 signs, 2 lesson scopes; allowed zoom/current locale, cross-lesson state, changed revision, disabled daily placement, missing ID and legacy numeric selection checked. No device/domain acceptance.');
