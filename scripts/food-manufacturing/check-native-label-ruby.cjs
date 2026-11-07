/* Actual native guide and JapaneseRuby renderer; exact canonical excerpt readings only. */
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
const data=load(path.join(root,'src/data/food-manufacturing/royal-week2-native.json'));
const ruby=load(path.join(root,'src/data/food-manufacturing/lesson-ruby.ts'));
const {FoodRoyalWeek2Native}=load(path.join(root,'src/components/food-manufacturing/FoodRoyalWeek2Native.tsx'));
const locales=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let labels=0,renderedLabels=0;
const escaped=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
for(const binding of data.bindings.filter(b=>b.labels)){
 const lesson=index.foodManufacturingLessons.find(l=>l.id===binding.lessonId),field=`paragraphs.${binding.captionParagraphId}.textJa`;
 const paragraph=lesson.paragraphs.find(p=>p.id===binding.captionParagraphId),full=ruby.foodManufacturingLessonRuby(lesson,field,paragraph.textJa);assert(full);
 for(const label of binding.labels.ja){
  const parts=ruby.foodManufacturingLabelRuby(lesson,field,label);assert(parts,binding.lessonId+' '+label+' exact complete reading');
  assert.equal(parts.map(p=>p.text).join(''),label);
  for(const p of parts.filter(p=>p.reading))assert(full.some(source=>source.text===p.text&&source.reading===p.reading),'Reading must be reused verbatim from a complete canonical token');
  assert(parts.some(p=>p.reading),'Han label must display at least one reading');labels++;
  assert(!ruby.foodManufacturingLabelRuby({...lesson,sourceHash:'old-revision'},field,label),'stale source must not supply readings');
 }
 const cut=full.find(p=>p.reading&&p.text.length>1);assert(cut);assert(!ruby.foodManufacturingLabelRuby(lesson,field,cut.text.slice(0,1)),'Never infer pronunciation of a cut reading token');
 assert(!ruby.foodManufacturingLabelRuby(lesson,field,'not present in this source'));
 assert(!ruby.foodManufacturingLabelRuby(lesson,'unsupported-field',binding.labels.ja[0]));
 for(const language of locales){
  const html=renderToStaticMarkup(React.createElement(FoodRoyalWeek2Native,{lesson,language,showTranslation:true,textColor:'#183044'}));
  for(let i=0;i<binding.labels.ja.length;i++){
   const label=binding.labels.ja[i],parts=ruby.foodManufacturingLabelRuby(lesson,field,label);
   assert(html.includes('data-testid="food-native-label-ruby-'+lesson.id+'-'+(i+1)+'"'),'Actual JapaneseRuby renderer required');
   for(const part of parts.filter(p=>p.reading))assert(html.includes(escaped(part.reading)),label+' canonical reading rendered');
   if(language!=='ja')assert(html.includes(escaped(binding.labels[language][i])),'Existing explicit localized label retained');renderedLabels++;
  }
 }
}
console.log('PASS '+labels+' exact canonical Japanese label excerpts and '+renderedLabels+' actual native-guide/JapaneseRuby label contexts across JA+12locales; complete token readings preserved, stale/missing/unsupported/cut-token excerpts rejected. Structural RN/font adapters; no new reading authoring or device/native acceptance.');
