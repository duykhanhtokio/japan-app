/* Actual supplementary illustration and expanded view source-caption guards. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const babel=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),cache=new Map();let forcedExpanded;
const wrap=tag=>({children,testID,accessibilityLabel})=>React.createElement(tag,{'data-testid':testID,'aria-label':accessibilityLabel},children);
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
 if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));
 const m={exports:{}};cache.set(file,m);
 const code=babel.transformSync(fs.readFileSync(file,'utf8'),{filename:file,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:file.endsWith('.tsx')}],['@babel/plugin-transform-react-jsx',{runtime:'classic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 function req(name){
  if(name==='react')return file.endsWith('/FoodIllustrations.tsx')?{...React,useState:initial=>React.useState(forcedExpanded===undefined?initial:forcedExpanded)}:React;
  if(name==='react-native')return {View:wrap('div'),Text:wrap('span'),ScrollView:wrap('div'),Pressable:wrap('button'),Modal:({visible,children})=>visible?React.createElement('div',null,children):null,Image:({source,accessibilityLabel})=>React.createElement('img',{src:source?.uri,alt:accessibilityLabel}),StyleSheet:{create:s=>s,absoluteFill:{position:'absolute'}}};
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
  if(name==='./supplemental')return {supplementalLessons:[],supplementalExams:[],supplementalTranslations:{},supplementalTestTranslations:{}};
  let target=name.startsWith('@/')?path.join(root,'src',name.slice(2)):name.startsWith('.')?path.resolve(path.dirname(file),name):null;
  if(!target)return require(name);if(/\.(webp|png)$/.test(target))return {uri:target};
  for(const candidate of [target,target+'.ts',target+'.tsx',target+'.json',path.join(target,'index.ts')])if(fs.existsSync(candidate)&&fs.statSync(candidate).isFile())return load(candidate);
  throw Error('Missing scoped dependency '+target);
 }
 vm.runInNewContext('(function(require,module,exports,React){'+code+'\n})',{console})(req,m,m.exports,React);return m.exports;
}
const index=load(path.join(root,'src/data/food-manufacturing/index.ts'));
const data=load(path.join(root,'src/data/food-manufacturing/illustrations.ts'));
const royal=load(path.join(root,'src/data/food-manufacturing/royal-weekly-images.ts'));
const {FoodIllustrations}=load(path.join(root,'src/components/food-manufacturing/FoodIllustrations.tsx'));
const locales=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let contexts=0,currentVisible=0;
const escaped=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
for(const figure of data.foodIllustrations){
 const lesson=index.foodManufacturingLessons.find(l=>l.id===figure.lessonId),moved=royal.foodRoyalWeeklyImageFor(lesson)?.replacesIllustrationId===figure.id;
 const paragraph=lesson.paragraphs.find(p=>p.id===figure.captionParagraphId);assert(paragraph);if(!moved)currentVisible++;
 for(const language of locales)for(const scenario of ['current','missing','blank-title','blank-body','stale']){
  const changed=scenario==='current'?lesson:scenario==='stale'?{...lesson,sourceHash:'old-revision'}:{...lesson,paragraphs:scenario==='missing'?lesson.paragraphs.filter(p=>p.id!==figure.captionParagraphId):lesson.paragraphs.map(p=>p.id===figure.captionParagraphId?{...p,[scenario==='blank-title'?'titleJa':'textJa']:'   '}:p)};
  const expected=scenario==='current'&&!moved;
  assert.equal(data.foodIllustrationsFor(changed).some(f=>f.id===figure.id),expected,figure.id+' '+scenario+' selector');
  forcedExpanded=`${changed.id}:${changed.sourceHash}:${figure.id}`;
  const html=renderToStaticMarkup(React.createElement(FoodIllustrations,{lesson:changed,language,showTranslation:true,textColor:'#183044',readingColor:'#687078'}));
  assert.equal(html.includes('data-testid="'+figure.id+'"'),expected,figure.id+' '+scenario+' actual inline presence');
  assert.equal(html.includes('data-testid="'+figure.id+'-zoom"'),expected,figure.id+' '+scenario+' actual expanded presence');
  if(expected){
   assert(html.includes(escaped(paragraph.titleJa))&&html.includes(escaped(paragraph.textJa)),figure.id+' exact Japanese caption');
   const t=language==='ja'?null:index.foodManufacturingTranslation(lesson,language);
   if(language!=='ja'){assert(t);assert(html.includes(escaped(t.paragraphs[paragraph.id])),figure.id+' '+language+' exact current locale caption');}
   if(figure.incorrectExample)assert(html.includes('誤った保管例'),'Unsafe example must remain explicitly labelled');
  }
  contexts++;
 }
}
forcedExpanded=undefined;
console.log('PASS '+data.foodIllustrations.length+' source-bound supplementary illustration entries ('+currentVisible+' currently visible), '+contexts+' JA+12locale current/missing/blank-title/blank-body/stale actual inline+expanded contexts; moved-to-daily dedup and warning labels retained. Structural RN/Image/state/ruby adapters; no device/domain/native acceptance.');
