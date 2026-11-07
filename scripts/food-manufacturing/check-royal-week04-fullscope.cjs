/* Actual scheduled Reader checks; structural SSR adapters do not certify device pixels. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const babel=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=process.env.FOOD_QA_REPO_ROOT||path.resolve(__dirname,'../..'),cache=new Map();
let forcedExpandedFigure=null,forceClosureZoom=false;
const wrap=tag=>({children,testID,accessibilityLabel})=>React.createElement(tag,{'data-testid':testID,'aria-label':accessibilityLabel},children);
const nil=()=>null;
const rn={View:wrap('div'),Text:wrap('span'),ScrollView:wrap('div'),Pressable:wrap('button'),Image:({source,accessibilityLabel,testID})=>React.createElement('img',{src:source?.uri,alt:accessibilityLabel,'data-testid':testID}),Modal:({visible,children})=>visible?React.createElement('div',null,children):null,StyleSheet:{create:s=>s,absoluteFill:{position:'absolute'}}};
const colors={text:'#183044',muted:'#687078',border:'#bda36a',background:'#fffaf0',translation:'#fffdf7'};
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
 if(file.endsWith('.json')){const m={exports:JSON.parse(fs.readFileSync(file,'utf8'))};cache.set(file,m);return m.exports;}
 const m={exports:{}};cache.set(file,m);
 const code=babel.transformSync(fs.readFileSync(file,'utf8'),{filename:file,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:file.endsWith('.tsx')}],['@babel/plugin-transform-react-jsx',{runtime:'classic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 function req(name){
  if(name==='react')return file.endsWith('/FoodManufacturingCourse.tsx')?{...React,useState:initial=>React.useState(initial===false?true:initial)}:file.endsWith('/FoodSourcePracticeVisuals.tsx')?{...React,useState:initial=>React.useState(initial===null&&forcedExpandedFigure?forcedExpandedFigure:initial)}:file.endsWith('/FoodClosureSupplements.tsx')?{...React,useState:initial=>React.useState(initial===false&&forceClosureZoom?true:initial)}:React;
  if(name==='react-native')return rn;
  if(name==='@/components/tokutei/StudyAppearance')return {TranslationText:wrap('span'),StudyAppearanceProvider:wrap('div'),ReadingAppearanceControl:nil,useStudyAppearance:()=>({colors})};
  if(name==='./FoodLessonRuby')return {FoodLessonRuby:({text})=>React.createElement('span',null,text)};
  if(name==='@/components/world/JapaneseRuby')return {__esModule:true,default:({text})=>React.createElement('span',null,text)};
  if(name==='@/components/world/japanese-ruby-data')return {hasAlignedRuby:(text,parts)=>parts.map(p=>p.text).join('')===text};
  if(name==='@react-native-async-storage/async-storage')return {__esModule:true,default:{}};
  if(name==='react-native-safe-area-context')return {useSafeAreaInsets:()=>({top:0,bottom:0,left:0,right:0})};
  if(name==='@/components/ui/AppBackdrop')return {useBackdropOcclusion:()=>{}};
  if(name==='@/components/ui/RoyalPageBackground')return {__esModule:true,default:wrap('div')};
  if(name==='@/components/ui/RoyalPanels')return {RoyalContentPanel:wrap('div'),RoyalExplanationPanel:wrap('div')};
  if(name==='@/components/tokutei/TokuteiChrome')return {TokuteiHeader:({title})=>React.createElement('span',null,title),TokuteiDayCard:nil};
  if(name==='@/services/food-manufacturing-study-state')return {};
  if(name==='./FoodSourceAssessmentChecks')return {FoodSourceAssessmentChecks:nil};
  if(/source-closure\d+\.json$/.test(name)&&!fs.existsSync(path.join(root,'src',name.slice(2))))return {sections:[]};
  if(name==='./FoodRoyalOjtCycle')return {FoodRoyalOjtCycle:nil};
  if(name==='./FoodRoyalChemicalSafety')return {FoodRoyalChemicalSafety:nil};
  if(name==='./FoodSafetySigns')return {FoodSafetySigns:nil};
  
  if(name==='./FoodQuestionRuby')return {FoodQuestionRuby:nil};
  if(name==='./translations/glossary.json')return {terms:[]};
  if(name==='./supplemental')return {supplementalLessons:[],supplementalExams:[],supplementalTranslations:{},supplementalTestTranslations:{}};
  let target=name.startsWith('@/')?path.join(root,'src',name.slice(2)):name.startsWith('.')?path.resolve(path.dirname(file),name):null;
  if(!target)return require(name);if(/\.(webp|png)$/.test(target))return {uri:target};
  for(const candidate of [target,target+'.ts',target+'.tsx',target+'.json',path.join(target,'index.ts')])if(fs.existsSync(candidate)&&fs.statSync(candidate).isFile())return load(candidate);
  throw Error('Missing scoped dependency '+target);
 }
 vm.runInNewContext('(function(require,module,exports,React){'+code+'\n})',{console})(req,m,m.exports,React);return m.exports;
}
const index=load(path.join(root,'src/data/food-manufacturing/index.ts'));
const royal=load(path.join(root,'src/data/food-manufacturing/royal-weekly-images.ts'));
const daily=load(path.join(root,'src/data/food-manufacturing/daily-learning.ts'));
const native4=load(path.join(root,'src/data/food-manufacturing/royal-week4-native.ts'));
const {Reader}=load(path.join(root,'src/components/food-manufacturing/FoodManufacturingCourse.tsx'));
const sourceReader=load(path.join(root,'src/components/food-manufacturing/FoodSourcePracticeVisuals.tsx'));
const rawClosure=load(path.join(root,'src/data/food-manufacturing/source-closure64.json')).sections[0];
const practice=[...load(path.join(root,'src/data/food-manufacturing/source-practice35.ts')).foodSourcePractice35,...load(path.join(root,'src/data/food-manufacturing/source-practice43.ts')).foodSourcePractice43,...load(path.join(root,'src/data/food-manufacturing/source-practice46.ts')).foodSourcePractice46,...load(path.join(root,'src/data/food-manufacturing/source-practice49.ts')).foodSourcePractice49,...load(path.join(root,'src/data/food-manufacturing/source-practice51.ts')).foodSourcePractice51,...load(path.join(root,'src/data/food-manufacturing/source-practice53.ts')).foodSourcePractice53];
const lessons=index.foodManufacturingLessons.filter(l=>l.week===4);assert.equal(lessons.length,12);
const figures=practice.filter(f=>lessons.some(l=>l.id===f.lessonId));assert.equal(figures.length,7);
const locales=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let contexts=0,zooms=0,photoBindings=0,nativeBindings=0,closureAltDebt=0,closureZoomContexts=0;
const escaped=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
const assets=new Set(),expectedAssets=new Set([...lessons.map(l=>royal.foodRoyalWeeklyImageFor(l)?.source.uri).filter(Boolean),...figures.map(f=>f.source.uri),path.join(root,'assets/food-manufacturing/source-practice64/same-centre-different-spread.webp')]);

for(const lesson of lessons){
 const binding=daily.foodDailyBinding(lesson),image=royal.foodRoyalWeeklyImageFor(lesson),native=native4.foodRoyalWeek4NativeFor(lesson);assert(binding&&image||binding&&native,lesson.id+' actual day requires current illustration/native binding');
 if(image)photoBindings++;if(native)nativeBindings++;
 for(const language of locales){
  const t=language==='ja'?null:index.foodManufacturingTranslation(lesson,language);if(language!=='ja')assert(t);
  const html=renderToStaticMarkup(React.createElement(Reader,{lesson,language,onBack:nil,onComplete:nil,saving:false,saveError:false}));assert(!html.includes('/daily-diagrams/'),lesson.id+' obsolete primitive remains');assert(html.includes('data-testid="food-daily-learning-'+lesson.id+'"'));
  if(image){const tag=[...html.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]).filter(tag=>tag.includes(escaped(image.source.uri)));assert.equal(tag.length,1,lesson.id+' exactly one primary inline image placement');const p=lesson.paragraphs.find(p=>p.id===binding.captionParagraphId);assert(tag[0].includes(escaped(p.textJa)));if(t)assert(tag[0].includes(escaped(t.paragraphs[p.id])));}
  if(lesson.id==='food-1-021'){
   assert(image.replacesIllustrationId==='food-illustration-center-temperature','Exact stable supplemental ID must move to current Royal daily placement');
   assert(!html.includes('/illustrations/center-temperature.webp'),'Obsolete unsafe supplement must be absent from actual Reader');
   assert.equal([...html.matchAll(/data-testid="food-illustration-center-temperature"/g)].length,1,'Stable illustration ID appears once on current replacement');
  }
  for(const figure of figures.filter(f=>f.lessonId===lesson.id)){assert(html.includes('data-testid="'+figure.id+'"'));assert(html.includes('data-testid="food-technical-source-key-'+figure.id+'"'));}
  if(lesson.id===rawClosure.lessonId){const chart=[...html.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]).find(tag=>tag.includes('food64-original-histogram'));assert(chart,'closure64 actual chart must be inventoried');if(t){const tr=rawClosure.translations[language];assert.equal(tr.sourceHash,rawClosure.sourceHash);if(!chart.includes(escaped(tr.text)))closureAltDebt++;}}
  for(const m of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)){const uri=m[1];assert(fs.existsSync(uri),uri+' missing actual bytes');const b=fs.readFileSync(uri);assert(b.subarray(0,4).toString()==='RIFF'&&b.subarray(8,12).toString()==='WEBP',uri+' is not real WebP');assets.add(uri);}
  contexts++;
 }
}
for(const figure of figures){const lesson=lessons.find(l=>l.id===figure.lessonId);for(const language of locales){forcedExpandedFigure=figure;const html=renderToStaticMarkup(React.createElement(sourceReader.FoodSourcePracticeVisuals,{lesson,language,showTranslation:true,textColor:colors.text,readingColor:colors.muted}));assert(html.includes('data-testid="food-source-practice-zoom"'));assert(html.slice(html.indexOf('data-testid="food-source-practice-zoom"')).includes('data-testid="food-technical-source-key-'+figure.id+'"'));zooms++;}}forcedExpandedFigure=null;
const closure=load(path.join(root,'src/components/food-manufacturing/FoodClosureSupplements.tsx'));
const closureLesson=lessons.find(l=>l.id===rawClosure.lessonId);assert(closure.foodRoyalClosure64FigureMatches(closureLesson,rawClosure));assert(!closure.foodRoyalClosure64FigureMatches({...closureLesson,sourceHash:'old'},rawClosure));assert(!closure.foodRoyalClosure64FigureMatches(closureLesson,{...rawClosure,sourceHash:'old'}));
assert.equal(closureAltDebt,0,'Current closure64 inline alt must contain exact source-matched localized text');
const closeUi=load(path.join(root,'src/data/food-manufacturing/daily-ui-translations.json'));
forceClosureZoom=true;
for(const language of locales){const html=renderToStaticMarkup(React.createElement(closure.FoodClosureSupplements,{lesson:closureLesson,language,showTranslation:true,textColor:colors.text,readingColor:colors.muted}));const zoom=[...html.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]).find(tag=>tag.includes('food64-original-histogram-zoom'));assert(zoom&&zoom.includes('same-centre-different-spread.webp'));assert(zoom.includes(escaped(rawClosure.textJa)));if(language!=='ja'){assert(zoom.includes(escaped(rawClosure.translations[language].text)));assert(html.includes(escaped(closeUi.locales[language].close)));}closureZoomContexts++;}
forceClosureZoom=false;
assert.equal(assets.size,expectedAssets.size,'All rendered images must belong to current source-bound inventory; no forgotten legacy supplement');for(const p of assets)assert(expectedAssets.has(p),p+' unexpected visual asset');
console.log(JSON.stringify({mainReaderContexts:contexts,sourcePracticeZoomContexts:zooms,dailyPhotoBindings:photoBindings,dailyNativeBindings:nativeBindings,sourcePracticeFigures:figures.length,uniqueActualWebpAssets:assets.size,closure64LocalizedAltDebtContexts:closureAltDebt,closure64ZoomContexts:closureZoomContexts,wholeWeekVisualClosure:'OPEN_known_shared_PPE_debt'},null,2));
