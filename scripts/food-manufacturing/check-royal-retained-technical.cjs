/* Actual scheduled Reader checks; structural SSR adapters do not certify device pixels. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const babel=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),cache=new Map();
const wrap=tag=>({children,testID,accessibilityLabel})=>React.createElement(tag,{'data-testid':testID,'aria-label':accessibilityLabel},children);
const nil=()=>null;
const rn={View:wrap('div'),Text:wrap('span'),ScrollView:wrap('div'),Pressable:wrap('button'),Image:({source,accessibilityLabel})=>React.createElement('img',{src:source?.uri,alt:accessibilityLabel}),Modal:({visible,children})=>visible?React.createElement('div',null,children):null,StyleSheet:{create:s=>s,absoluteFill:{position:'absolute'}}};
const colors={text:'#183044',muted:'#687078',border:'#bda36a',background:'#fffaf0',translation:'#fffdf7'};
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
 if(file.endsWith('.json')){const m={exports:JSON.parse(fs.readFileSync(file,'utf8'))};cache.set(file,m);return m.exports;}
 const m={exports:{}};cache.set(file,m);
 const code=babel.transformSync(fs.readFileSync(file,'utf8'),{filename:file,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:file.endsWith('.tsx')}],['@babel/plugin-transform-react-jsx',{runtime:'classic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 function req(name){
  if(name==='react')return file.endsWith('/FoodManufacturingCourse.tsx')?{...React,useState:initial=>React.useState(initial===false?true:initial)}:React;
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
  if(name==='./FoodClosureSupplements')return {FoodClosureSupplements:nil};
  if(name==='./FoodSourcePracticeVisuals')return {FoodSourcePracticeVisuals:nil};
  if(name==='./FoodSafetySigns')return {FoodSafetySigns:nil};
  if(name==='./FoodIllustrations')return {FoodIllustrations:nil};
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
const retained=load(path.join(root,'src/data/food-manufacturing/royal-retained-technical.ts'));
const management=load(path.join(root,'src/data/food-manufacturing/management-visuals.ts'));
const diagrams=load(path.join(root,'src/data/food-manufacturing/diagrams.json'));
const {Reader}=load(path.join(root,'src/components/food-manufacturing/FoodManufacturingCourse.tsx'));
const locales=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let contexts=0,managementCount=0,conceptCount=0;
const escaped=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
for(const binding of retained.foodRoyalRetainedTechnical){
 const lesson=index.foodManufacturingLessons.find(l=>l.id===binding.lessonId);assert(lesson);
 assert(retained.foodRoyalRetainedTechnicalFor(lesson));
 assert(!retained.foodRoyalRetainedTechnicalFor({...lesson,sourceHash:'old-revision'}));
 assert(!retained.foodRoyalRetainedTechnicalFor({...lesson,paragraphs:lesson.paragraphs.filter(p=>p.id!==binding.captionParagraphId)}));
 for(const language of locales){
  const html=renderToStaticMarkup(React.createElement(Reader,{lesson,language,onBack:nil,onComplete:nil,saving:false,saveError:false}));
  assert(html.includes('data-testid="food-daily-diagram-'+lesson.id+'"'),lesson.id+' daily caption kept');
  assert(!html.includes('/daily-diagrams/'),lesson.id+' obsolete primitive raster suppressed');
  for(const id of [...binding.managementIds,...binding.conceptIds])assert(html.includes('data-testid="'+id+'"'),id+' actual scheduled Reader retains native visual');
  if(language!=='ja'){
   const t=index.foodManufacturingTranslation(lesson,language);assert(t,lesson.id+' revision-matched '+language+' translation');assert(html.includes(escaped(t.paragraphs[binding.captionParagraphId])),lesson.id+' native caption translation retained');
   for(const id of binding.managementIds){const f=management.foodManagementVisuals.find(f=>f.id===id);assert(html.includes('data-testid="food-chart-translation-'+f.kind+'-'+language+'"'),id+' localized key retained');}
   for(const id of binding.conceptIds){const f=diagrams.diagrams.find(f=>f.id===id);assert(html.includes(escaped(f.translations[language].title)),id+' localized concept retained');}
  }
  contexts++;
 }
 if(binding.managementIds.length){const figure=management.foodManagementVisuals.find(f=>f.id===binding.managementIds[0]),hash=figure.sourceHash;figure.sourceHash='missing-native-revision';assert(!retained.foodRoyalRetainedTechnicalFor(lesson));figure.sourceHash=hash;}
 if(binding.conceptIds.length){const figure=diagrams.diagrams.find(f=>f.id===binding.conceptIds[0]),id=figure.id;figure.id='missing-native-figure';assert(!retained.foodRoyalRetainedTechnicalFor(lesson));figure.id=id;}
 managementCount+=binding.managementIds.length;conceptCount+=binding.conceptIds.length;
}
const pending=index.foodManufacturingLessons.find(l=>l.id==='food-2-022');
assert(!retained.foodRoyalRetainedTechnicalFor(pending));
const pendingHtml=renderToStaticMarkup(React.createElement(Reader,{lesson:pending,language:'ja',onBack:nil,onComplete:nil,saving:false,saveError:false}));
assert(pendingHtml.includes('/daily-diagrams/downtime.webp'),'Unaddressed day022 must keep its visible pending raster, never silently disappear');
console.log('PASS '+retained.foodRoyalRetainedTechnical.length+' exact native-retained days, '+contexts+' actual scheduled Reader locale contexts, '+managementCount+' unchanged native management plots + '+conceptCount+' concepts. Primitive daily rasters absent; source/caption/native-availability negative guards pass. Structural RN/ruby/presentation adapters; unrelated supplementary components isolated; no device-pixel acceptance.');
