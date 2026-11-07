/* Production selector/reader regression; deterministic RN/ruby adapters, no device claim. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const babel=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),cache=new Map();
const wrap=tag=>({children,testID,accessibilityLabel})=>React.createElement(tag,{'data-testid':testID,'aria-label':accessibilityLabel},children);
const rn={View:wrap('div'),Text:wrap('span'),StyleSheet:{create:s=>s,absoluteFill:{position:'absolute'}}};
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
 if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));
 const m={exports:{}};cache.set(file,m);
 const code=babel.transformSync(fs.readFileSync(file,'utf8'),{filename:file,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:file.endsWith('.tsx')}],['@babel/plugin-transform-react-jsx',{runtime:'classic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 function req(name){
  if(name==='react')return React;if(name==='react-native')return rn;
  if(name==='@/components/tokutei/StudyAppearance')return {TranslationText:wrap('span')};
  if(name==='./FoodLessonRuby')return {FoodLessonRuby:({text})=>React.createElement('span',null,text)};
  if(name==='@/components/world/japanese-ruby-data')return {hasAlignedRuby:(text,parts)=>parts.map(p=>p.text).join('')===text};
  if(name==='./translations/glossary.json')return {terms:[]};
  if(name==='./supplemental')return {supplementalLessons:[],supplementalExams:[],supplementalTranslations:{},supplementalTestTranslations:{}};
  let target=name.startsWith('@/')?path.join(root,'src',name.slice(2)):name.startsWith('.')?path.resolve(path.dirname(file),name):null;
  if(!target)return require(name);
  for(const candidate of [target,target+'.ts',target+'.tsx',target+'.json',path.join(target,'index.ts')])if(fs.existsSync(candidate)&&fs.statSync(candidate).isFile())return load(candidate);
  throw Error('Missing scoped dependency '+target);
 }
 vm.runInNewContext('(function(require,module,exports,React){'+code+'\n})',{console})(req,m,m.exports,React);return m.exports;
}
const data=load(path.join(root,'src/data/food-manufacturing/management-visuals.ts'));
const index=load(path.join(root,'src/data/food-manufacturing/index.ts'));
const {FoodManagementVisuals}=load(path.join(root,'src/components/food-manufacturing/FoodManagementVisuals.tsx'));
const locales=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let contexts=0;
const escaped=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
const render=(lesson,language)=>renderToStaticMarkup(React.createElement(FoodManagementVisuals,{lesson,language,showTranslation:true,textColor:'#183044',readingColor:'#687078',dailyPlacement:true}));
const contains=(html,figure)=>html.includes('data-testid="'+figure.id+'"');
for(const figure of data.foodManagementVisuals){
 const lesson=index.foodManufacturingLessons.find(l=>l.id===figure.lessonId);assert(lesson,figure.lessonId);
 const paragraphId=figure.captionField.split('.')[1],paragraph=lesson.paragraphs.find(p=>p.id===paragraphId);
 const currentCaption=figure.captionField==='activityJa'?lesson.activityJa:paragraph?.textJa;assert(currentCaption,figure.id+' current caption');
 const missing=figure.captionField==='activityJa'?{...lesson,activityJa:undefined}:{...lesson,paragraphs:lesson.paragraphs.filter(p=>p.id!==paragraphId)};
 const blank=figure.captionField==='activityJa'?{...lesson,activityJa:'   '}:{...lesson,paragraphs:lesson.paragraphs.map(p=>p.id===paragraphId?{...p,textJa:'   '}:p)};
 for(const language of locales){
  const current=render(lesson,language);assert(contains(current,figure),figure.id+' current figure retained');assert(current.includes(escaped(currentCaption)),figure.id+' exact source caption');
  if(language!=='ja'){
   const t=index.foodManufacturingTranslation(lesson,language);assert(t,figure.id+' '+language+' current translation');
   const text=figure.captionField==='activityJa'?t.activity:t.paragraphs[paragraphId];assert(current.includes(escaped(text)),figure.id+' '+language+' exact caption translation');
   assert(current.includes('data-testid="food-chart-translation-'+figure.kind+'-'+language+'"'),figure.id+' native localized chart labels preserved');
  }
  for(const [scenario,changed] of [['missing',missing],['blank',blank],['stale',{...lesson,sourceHash:'old-revision'}]]){
   const html=render(changed,language);assert(!contains(html,figure),figure.id+' '+scenario+' caption/revision must fail closed');
   if(scenario!=='stale')for(const unrelated of data.foodManagementVisualsFor(lesson).filter(f=>f.captionField!==figure.captionField))assert(contains(html,unrelated),unrelated.id+' unrelated caption must remain available');
   contexts++;
  }
  contexts++;
 }
 // An unsupported locator must not silently render the activity as a replacement caption.
 const original=figure.captionField;figure.captionField='paragraphs.p2.textJa';assert(!data.foodManagementVisualsFor(lesson).some(f=>f.id===figure.id));figure.captionField=original;
}
console.log('PASS seven native management figures: '+contexts+' actual reader contexts across Japanese+12 locales; exact source/translated captions and localized chart keys preserved; missing/blank caption, stale revision and unsupported locator rejected while unrelated figures remain.');
