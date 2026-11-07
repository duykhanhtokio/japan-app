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
const render=(lesson,language)=>renderToStaticMarkup(React.createElement(reader.FoodSourcePracticeVisuals,{lesson,language,showTranslation:true,textColor:'#183044',readingColor:'#687078'}));
for(const [lessonId,figures] of Object.entries(groups)){
 const canonical=index.foodManufacturingLessons.find(l=>l.id===lessonId);assert(canonical,lessonId);const originalHash=canonical.sourceHash;
 for(const language of locales){
  const html=render(canonical,language);for(const id of figures)assert(html.includes('data-testid="'+id+'"'),id+' current positive');
  const wrongCaller=render({...canonical,sourceHash:'wrong-caller-revision'},language);for(const id of figures)assert(!wrongCaller.includes('data-testid="'+id+'"'),id+' wrong caller rejected');
  canonical.sourceHash='new-canonical-revision-for-regression';
  const advanced=render({...canonical},language);for(const id of figures)assert(!advanced.includes('data-testid="'+id+'"'),id+' old figure must reject an advanced canonical lesson revision');
  canonical.sourceHash=originalHash;contexts+=3;
 }
}
if(reader.foodSourcePracticeFigureMatches){
 const lesson=index.foodManufacturingLessons.find(l=>l.id==='food-2-043');
 const fixture={id:'guard-regression',lessonId:lesson.id,paragraphId:'p1',lessonSourceHash:lesson.sourceHash,source:{},aspectRatio:1};
 assert(reader.foodSourcePracticeFigureMatches(lesson,fixture));
 for(const bad of [{...fixture,lessonSourceHash:undefined},{...fixture,lessonSourceHash:''},{...fixture,lessonSourceHash:'old'},{...fixture,lessonId:'another-lesson'},{...fixture,paragraphId:'missing'}])assert(!reader.foodSourcePracticeFigureMatches(lesson,bad));
}
console.log('PASS six retained direct-paragraph source figures: '+contexts+' actual reader contexts (current/wrong caller/advanced canonical, Japanese+12 selected locales); missing/empty/stale hash, wrong lesson and missing paragraph rejected. Source pixels/locale semantics unchanged; no device or domain acceptance.');
