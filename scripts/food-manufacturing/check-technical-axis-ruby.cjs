/* Actual scheduled Reader checks; structural SSR adapters do not certify device pixels. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const babel=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=process.env.FOOD_QA_REPO_ROOT||path.resolve(__dirname,'../..'),cache=new Map();
let forcedExpandedFigure=null;
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
  if(name==='react')return file.endsWith('/FoodManufacturingCourse.tsx')?{...React,useState:initial=>React.useState(initial===false?true:initial)}:file.endsWith('/FoodSourcePracticeVisuals.tsx')?{...React,useState:initial=>React.useState(initial===null&&forcedExpandedFigure?forcedExpandedFigure:initial)}:React;
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
const readings=load(path.join(root,'src/data/food-manufacturing/royal-technical-axis-readings.json'));
const canonical=load(path.join(root,'src/data/food-manufacturing/ruby/lessons-02.json'));
const sourceLesson=index.foodManufacturingLessons.find(l=>l.id==='food-1-019'),entry=canonical.lessons[sourceLesson.id];
assert.equal(entry.sourceHash,sourceLesson.sourceHash,'Reading source must match current canonical lesson revision');
const sourceToken=entry.fields.summaryJa[11];assert.equal(sourceToken.text,'順番');assert.equal(sourceToken.reading,'じゅんばん');
assert.equal(readings.tokens['順番'].reading,sourceToken.reading);assert(!Object.hasOwn(readings.tokens,'番'),'Do not infer an isolated 番 pronunciation');
const {FoodSourcePracticeVisuals}=load(path.join(root,'src/components/food-manufacturing/FoodSourcePracticeVisuals.tsx'));
const lesson=index.foodManufacturingLessons.find(l=>l.id==='food-2-021');
const groups=[load(path.join(root,'src/data/food-manufacturing/source-practice49.ts')).foodSourcePractice49[0],load(path.join(root,'src/data/food-manufacturing/source-practice51.ts')).foodSourcePractice51[0]];
const render=language=>renderToStaticMarkup(React.createElement(FoodSourcePracticeVisuals,{lesson,language,showTranslation:true,textColor:'#183044',readingColor:'#687078'}));
const token=readings.tokens['順番'];delete readings.tokens['順番'];assert(!render('ja').includes('<span>じゅんばん</span><span>順番</span>'),'Before this exact token, the actual chart key has an unannotated 番');readings.tokens['順番']=token;
const locales=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let contexts=0;
for(const language of locales){
 forcedExpandedFigure=null;let html=render(language);assert(html.includes('<span>じゅんばん</span><span>順番</span>'),'Actual inline key uses exact canonical whole-word reading: '+language);contexts++;
 for(const figure of groups){forcedExpandedFigure=figure;html=render(language);const zoom=html.indexOf('data-testid="food-source-practice-zoom"');assert(zoom>=0);assert(html.slice(zoom).includes('<span>じゅんばん</span><span>順番</span>'),'Actual expanded key retains exact reading '+figure.id+' '+language);contexts++;}
}
forcedExpandedFigure=null;
console.log('PASS exact canonical 順番→じゅんばん at current food1-019 summary sourceHash; '+contexts+' actual source-practice inline/two expanded-key contexts across Japanese+12locale settings. Isolated 番 remains uninvented; no chart/text/translation changes.');
