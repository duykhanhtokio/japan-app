/* Actual reader regression with deterministic RN/asset/ruby adapters; no device-pixel claim. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const babel=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),cache=new Map();
const wrap=tag=>({children,testID,accessibilityLabel,...props})=>React.createElement(tag,{'data-testid':testID,'aria-label':accessibilityLabel},children);
const rn={View:wrap('div'),Text:wrap('span'),ScrollView:wrap('div'),Pressable:wrap('button'),Image:({source,accessibilityLabel})=>React.createElement('img',{src:source.uri,alt:accessibilityLabel}),Modal:({visible,children})=>visible?React.createElement('div',null,children):null,StyleSheet:{create:s=>s}};
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
 if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));
 const m={exports:{}};cache.set(file,m);
 const code=babel.transformSync(fs.readFileSync(file,'utf8'),{filename:file,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:file.endsWith('.tsx')}],['@babel/plugin-transform-react-jsx',{runtime:'classic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 function req(name){
  if(name==='react')return React;if(name==='react-native')return rn;
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
const reader=load(path.join(root,'src/components/food-manufacturing/FoodSourcePracticeVisuals.tsx'));
const groups={
 'food-2-043':['food-source-histogram-patterns','food-source-scatter-patterns'],
 'food-2-047':['food-source-risk-matrix'],
 'food-2-041':['food-source-flow'],
 'food-2-042':['food-source-normal-bands','food-source-cause-bars'],
};
const locales=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let contexts=0;
// Accepted daily promotion is part of the reader contract, rather than a reason to skip figures.
const promotedIds=new Set(['food-source-histogram-patterns','food-source-normal-bands']);
const render=(lesson,language,dailyPlacement)=>renderToStaticMarkup(React.createElement(reader.FoodSourcePracticeVisuals,{lesson,language,showTranslation:true,textColor:'#183044',readingColor:'#687078',dailyPlacement}));
for(const [lessonId,figures] of Object.entries(groups)){
 const canonical=index.foodManufacturingLessons.find(l=>l.id===lessonId);assert(canonical,lessonId);const originalHash=canonical.sourceHash;
 for(const language of locales)for(const id of figures){
  const daily=promotedIds.has(id),marker='data-testid="'+id+'"';
  assert(render(canonical,language,daily).includes(marker),id+' current positive at accepted placement');
  assert(!render(canonical,language,!daily).includes(marker),id+' opposite placement must not duplicate current figure');
  assert(!render({...canonical,sourceHash:'wrong-caller-revision'},language,daily).includes(marker),id+' wrong caller rejected');
  try{canonical.sourceHash='new-canonical-revision-for-regression';assert(!render({...canonical},language,daily).includes(marker),id+' old figure must reject advanced canonical revision');}
  finally{canonical.sourceHash=originalHash;}
  assert(render(canonical,language,daily).includes(marker),id+' restored revision positive control');contexts+=5;
 }
}
if(reader.foodSourcePracticeFigureMatches){
 const lesson=index.foodManufacturingLessons.find(l=>l.id==='food-2-043');
 const fixture={id:'guard-regression',lessonId:lesson.id,paragraphId:'p1',lessonSourceHash:lesson.sourceHash,source:{},aspectRatio:1};
 assert(reader.foodSourcePracticeFigureMatches(lesson,fixture));
 for(const bad of [{...fixture,lessonSourceHash:undefined},{...fixture,lessonSourceHash:''},{...fixture,lessonSourceHash:'old'},{...fixture,lessonId:'another-lesson'},{...fixture,paragraphId:'missing'}])assert(!reader.foodSourcePracticeFigureMatches(lesson,bad));
}
console.log('PASS six retained direct-paragraph source figures: '+contexts+' actual reader contexts (current/opposite placement/wrong caller/advanced canonical/restored current, Japanese+12 selected locales); missing/empty/stale hash, wrong lesson and missing paragraph rejected. This checker tests metadata/placement only; incoming pixel replacement semantics use the explicit six-pixel primary-review reconciliation; no device or domain acceptance.');
