/* Actual concept renderer regression; native presentation adapters, no device claim. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const babel=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),cache=new Map();
const wrap=tag=>({children,testID,accessibilityLabel})=>React.createElement(tag,{'data-testid':testID,'aria-label':accessibilityLabel},children);
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
 if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));
 const m={exports:{}};cache.set(file,m);
 const code=babel.transformSync(fs.readFileSync(file,'utf8'),{filename:file,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:file.endsWith('.tsx')}],['@babel/plugin-transform-react-jsx',{runtime:'classic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 function req(name){
  if(name==='react')return file.endsWith('/FoodManufacturingCourse.tsx')?{...React,useState:initial=>React.useState(initial===false?true:initial)}:React;
  if(name==='react-native')return {View:wrap('div'),Text:wrap('span'),ScrollView:wrap('div'),Pressable:wrap('button'),Modal:({visible,children})=>visible?React.createElement('div',null,children):null,Image:({source,accessibilityLabel})=>React.createElement('img',{src:source?.uri,alt:accessibilityLabel}),StyleSheet:{create:s=>s,absoluteFill:{position:'absolute'}}};
  if(name==='@/components/tokutei/StudyAppearance')return {TranslationText:wrap('span'),StudyAppearanceProvider:wrap('div'),ReadingAppearanceControl:()=>null,useStudyAppearance:()=>({colors:{text:'#183044',muted:'#687078',border:'#bda36a',background:'#fffaf0'}})};
  if(name==='./FoodLessonRuby')return {FoodLessonRuby:({text})=>React.createElement('span',null,text)};
  if(name==='@/components/world/JapaneseRuby')return {__esModule:true,default:({text})=>React.createElement('span',null,text)};
  if(name==='@/components/world/japanese-ruby-data')return {hasAlignedRuby:(text,parts)=>parts.map(p=>p.text).join('')===text};
  if(name==='@react-native-async-storage/async-storage')return {__esModule:true,default:{}};
  if(name==='react-native-safe-area-context')return {useSafeAreaInsets:()=>({top:0,bottom:0,left:0,right:0})};
  if(name==='@/components/ui/AppBackdrop')return {useBackdropOcclusion:()=>{}};
  if(name==='@/components/ui/RoyalPageBackground')return {__esModule:true,default:wrap('div')};
  if(name==='@/components/ui/RoyalPanels')return {RoyalContentPanel:wrap('div'),RoyalExplanationPanel:wrap('div')};
  if(name==='@/components/tokutei/TokuteiChrome')return {TokuteiHeader:({title})=>React.createElement('span',null,title),TokuteiDayCard:()=>null};
  if(name==='@/services/food-manufacturing-study-state')return {};
  if(['./FoodClosureSupplements','./FoodSourcePracticeVisuals','./FoodSafetySigns','./FoodIllustrations','./FoodQuestionRuby'].includes(name))return {[name.slice(2)]:()=>null};
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
const data=load(path.join(root,'src/data/food-manufacturing/diagrams.json'));
const {FoodConceptDiagrams}=load(path.join(root,'src/components/food-manufacturing/ConceptDiagrams.tsx'));
const locales=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let contexts=0,bindings=0;
const escaped=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
const render=(lesson,language)=>renderToStaticMarkup(React.createElement(FoodConceptDiagrams,{lesson,lessonId:lesson.id,language,showTranslation:true,textColor:'#183044',dailyPlacement:true}));
for(const diagram of data.diagrams)for(const lessonId of diagram.lessonIds){
 const lesson=index.foodManufacturingLessons.find(l=>l.id===lessonId);assert(lesson,lessonId);bindings++;
 const contains=html=>html.includes('data-testid="'+diagram.id+'"');
 const scenarios=[['stale',{...lesson,sourceHash:'old-revision'}],['missing',{...lesson,paragraphs:[]}],['blank',{...lesson,paragraphs:lesson.paragraphs.map(p=>({...p,textJa:'   '}))}]];
 for(const language of locales){
  const current=render(lesson,language);assert(contains(current),lessonId+' current diagram');
  for(const text of [diagram.titleJa,diagram.descriptionJa,diagram.noteJa,...diagram.nodes.map(n=>n.labelJa)])assert(current.includes(escaped(text)),lessonId+' unchanged Japanese technical text');
  if(language!=='ja'){
   const t=diagram.translations[language];assert(t,diagram.id+' '+language+' explicit translation');
   for(const text of [t.title,t.description,t.note,...Object.values(t.nodeLabels),...t.edgeLabels])assert(current.includes(escaped(text)),lessonId+' '+language+' explicit localized technical text');
  }
  contexts++;
  for(const [scenario,changed] of scenarios){assert(!contains(render(changed,language)),lessonId+' '+scenario+' lesson must not render a current diagram');contexts++;}
 }
}
const {Reader}=load(path.join(root,'src/components/food-manufacturing/FoodManufacturingCourse.tsx'));let readerContexts=0;
for(const diagram of data.diagrams)for(const lessonId of diagram.lessonIds){
 const lesson=index.foodManufacturingLessons.find(l=>l.id===lessonId);
 for(const language of locales)for(const scenario of ['current','stale']){
  const actual=scenario==='current'?lesson:{...lesson,sourceHash:'old-revision'};
  const html=renderToStaticMarkup(React.createElement(Reader,{lesson:actual,language,onBack:()=>{},onComplete:()=>{},saving:false,saveError:false}));
  const contains=html.includes('data-testid="'+diagram.id+'"');assert.equal(contains,scenario==='current',lessonId+' '+language+' actual Reader '+scenario+' concept placement');readerContexts++;
 }
}
console.log('PASS '+bindings+' current concept bindings, '+contexts+' actual renderer and '+readerContexts+' actual scheduled Reader contexts across Japanese+12 locales; unchanged technical labels/translations retained and stale/missing/blank lesson contexts rejected. Structural RN/Image/ruby/presentation adapters; unrelated supplements isolated; no device/domain/native acceptance.');
