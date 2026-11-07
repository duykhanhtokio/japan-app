/* Actual source-practice expansion guards across lesson/caption transitions. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const babel=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),cache=new Map();let forcedExpanded;
const wrap=tag=>({children,testID,accessibilityLabel})=>React.createElement(tag,{'data-testid':testID,'aria-label':accessibilityLabel},children);
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
 if(file.endsWith('.json')){const m={exports:JSON.parse(fs.readFileSync(file,'utf8'))};cache.set(file,m);return m.exports;}
 const m={exports:{}};cache.set(file,m);
 const code=babel.transformSync(fs.readFileSync(file,'utf8'),{filename:file,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:file.endsWith('.tsx')}],['@babel/plugin-transform-react-jsx',{runtime:'classic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 function req(name){
  if(name==='react')return file.endsWith('/FoodSourcePracticeVisuals.tsx')?{...React,useState:initial=>React.useState(forcedExpanded===undefined?initial:forcedExpanded)}:React;
  if(name==='react-native')return {View:wrap('div'),Text:wrap('span'),ScrollView:wrap('div'),Pressable:wrap('button'),Modal:({visible,children})=>visible?React.createElement('div',null,children):null,Image:({source,accessibilityLabel,testID})=>React.createElement('img',{src:source?.uri,alt:accessibilityLabel,'data-testid':testID}),StyleSheet:{create:s=>s,absoluteFill:{position:'absolute'}}};
  if(name==='@/components/tokutei/StudyAppearance')return {TranslationText:wrap('span'),StudyAppearanceProvider:wrap('div'),ReadingAppearanceControl:()=>null,useStudyAppearance:()=>({colors:{text:'#183044',muted:'#687078',border:'#bda36a',background:'#fffaf0'}})};
  if(name==='./FoodLessonRuby')return {FoodLessonRuby:({text})=>React.createElement('span',null,text)};
  if(name==='@/components/ui/RoyalSurface')return {ROYAL_FONT:{body:'serif',heading:'serif'}};
  if(name==='@react-native-async-storage/async-storage')return {__esModule:true,default:{}};
  if(name==='react-native-safe-area-context')return {useSafeAreaInsets:()=>({top:0,bottom:0,left:0,right:0})};
  if(name==='@/components/ui/AppBackdrop')return {useBackdropOcclusion:()=>{}};
  if(name==='@/components/ui/RoyalPageBackground')return {__esModule:true,default:wrap('div')};
  if(name==='@/components/ui/RoyalPanels')return {RoyalContentPanel:wrap('div'),RoyalExplanationPanel:wrap('div')};
  if(name==='@/components/tokutei/TokuteiChrome')return {TokuteiHeader:({title})=>React.createElement('span',null,title),TokuteiDayCard:()=>null};
  if(name==='@/services/food-manufacturing-study-state')return {};
  if(['./FoodClosureSupplements','./FoodSourcePracticeVisuals','./FoodSafetySigns','./FoodIllustrations','./FoodQuestionRuby'].includes(name))return {[name.slice(2)]:()=>null};
  if(name==='./translations/glossary.json')return {terms:[]};
  if(name==='./supplemental')return {supplementalLessons:load(path.join(root,'src/data/food-manufacturing/runtime-supplemental/lessons.json')),supplementalExams:[],supplementalTranslations:Object.fromEntries(['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'].map(locale=>[locale,load(path.join(root,'src/data/food-manufacturing/runtime-supplemental/lessons.'+locale+'.json'))])),supplementalTestTranslations:{}};
  let target=name.startsWith('@/')?path.join(root,'src',name.slice(2)):name.startsWith('.')?path.resolve(path.dirname(file),name):null;
  if(!target)return require(name);if(/\.(webp|png)$/.test(target))return {uri:target};
  for(const candidate of [target,target+'.ts',target+'.tsx',target+'.json',path.join(target,'index.ts')])if(fs.existsSync(candidate)&&fs.statSync(candidate).isFile())return load(candidate);
  throw Error('Missing scoped dependency '+target);
 }
 vm.runInNewContext('(function(require,module,exports,React){'+code+'\n})',{console})(req,m,m.exports,React);return m.exports;
}
const index=load(path.join(root,'src/data/food-manufacturing/index.ts'));
const reader=load(path.join(root,'src/components/food-manufacturing/FoodSourcePracticeVisuals.tsx'));
const cases=[
 ['food-source-histogram-patterns','food-2-043','p1'],['food-source-scatter-patterns','food-2-043','p2'],
 ['food-source-risk-matrix','food-2-047','p2'],['food-source-flow','food-2-041','p5'],
 ['food-source-normal-bands','food-2-042','p1'],['food-source-cause-bars','food-2-042','p4'],
];
const locales=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let contexts=0;
const render=(lesson,language)=>renderToStaticMarkup(React.createElement(reader.FoodSourcePracticeVisuals,{lesson,language,showTranslation:true,textColor:'#183044',readingColor:'#687078'}));
for(const [id,lessonId,paragraphId] of cases){
 const lesson=index.foodManufacturingLessons.find(l=>l.id===lessonId);assert(lesson);
 const fixture={id,lessonId,paragraphId,lessonSourceHash:lesson.sourceHash,source:{uri:'old-object-must-not-be-trusted.webp'},aspectRatio:1};
 for(const language of locales){
  forcedExpanded=fixture;let html=render(lesson,language);
  assert(html.includes('data-testid="'+id+'"'));assert(html.includes('data-testid="food-source-practice-zoom"'),'Current registered source figure remains expandable');assert(!html.includes('old-object-must-not-be-trusted.webp'),'Zoom must resolve current registry bytes instead of retaining old object source');contexts++;
  const other=index.foodManufacturingLessons.find(l=>l.id!==lessonId&&l.level===lesson.level);
  html=render(other,language);assert(!html.includes('data-testid="food-source-practice-zoom"'),id+' stale selection from another lesson must close');contexts++;
  for(const scenario of ['missing','blank-title','blank-body','stale']){
   const changed=scenario==='stale'?{...lesson,sourceHash:'old-revision'}:{...lesson,paragraphs:scenario==='missing'?lesson.paragraphs.filter(p=>p.id!==paragraphId):lesson.paragraphs.map(p=>p.id===paragraphId?{...p,[scenario==='blank-title'?'titleJa':'textJa']:'   '}:p)};
   html=render(changed,language);assert(!html.includes('data-testid="'+id+'"'),id+' '+scenario+' inline must reject');assert(!html.includes('data-testid="food-source-practice-zoom"'),id+' '+scenario+' selected zoom must reject');contexts++;
  }
 }
}
const figure=load(path.join(root,'src/data/food-manufacturing/source-practice51.ts')).foodSourcePractice51[0];
const lesson=index.foodManufacturingLessons.find(l=>l.id===figure.lessonId),section=load(path.join(root,'src/data/food-manufacturing/source-closure51.json')).sections.find(s=>s.id===figure.captionSupplementId);
assert(section);const savedHash=section.sourceHash;
for(const language of locales){
 forcedExpanded=figure;let html=render(lesson,language);assert(html.includes('data-testid="food-source-practice-zoom"'));contexts++;
 try{section.sourceHash='new-independent-caption-revision';html=render(lesson,language);assert(!html.includes('data-testid="'+figure.id+'"'));assert(!html.includes('data-testid="food-source-practice-zoom"'),'Stale independent-caption selection must close');assert.equal(reader.foodSourcePracticeDescription(lesson,figure,language,true),'','Invalid independent caption must not leak an old description');contexts++;}
 finally{section.sourceHash=savedHash;}
}
forcedExpanded=undefined;
console.log('PASS '+contexts+' actual source-practice inline/expanded contexts across JA+12locales; current figures expandable, stale cross-lesson/caption/missing/blank/revision selections rejected and actual current registry source selected. Structural RN/Image/state/ruby adapters; source pixels/data unchanged; no device/native/domain acceptance.');
