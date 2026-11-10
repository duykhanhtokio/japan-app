/* Full current food provider/asset census; structural SSR does not certify device pixels or domain coverage. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const babel=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=process.env.FOOD_QA_REPO_ROOT||path.resolve(__dirname,'../..'),cache=new Map();
let forcedExpandedFigure=null,forceClosureZoom=false;
const wrap=tag=>({children,testID,accessibilityLabel})=>React.createElement(tag,{'data-testid':testID,'aria-label':accessibilityLabel},children);
const nil=()=>null;
const rn={View:wrap('div'),Text:wrap('span'),ScrollView:wrap('div'),Pressable:wrap('button'),Image:({source,accessibilityLabel,testID,style})=>{const st=Object.assign({},...(Array.isArray(style)?style:[style]).filter(x=>x&&typeof x==='object'));assert(source?.uri,'Rendered Image must have an actual source');return React.createElement('img',{src:source.uri,alt:accessibilityLabel,'data-testid':testID,'data-width':st.width,'data-height':st.height,'data-aspect':st.aspectRatio});},Modal:({visible,children})=>visible?React.createElement('div',null,children):null,StyleSheet:{create:s=>s,absoluteFill:{position:'absolute'}}};
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

  if(name==='./FoodQuestionRuby')return {FoodQuestionRuby:nil};
  let target=name.startsWith('@/')?path.join(root,'src',name.slice(2)):name.startsWith('.')?path.resolve(path.dirname(file),name):null;
  if(!target)return require(name);if(/\.(webp|png)$/.test(target))return {uri:target};
  for(const candidate of [target,target+'.ts',target+'.tsx',target+'.json',path.join(target,'index.ts')])if(fs.existsSync(candidate)&&fs.statSync(candidate).isFile())return load(candidate);
  throw Error('Missing scoped dependency '+target);
 }
 const instrument=file.endsWith('/FoodSourcePracticeVisuals.tsx')?code+'\nmodule.exports.__censusFigures=figures;':code;
 vm.runInNewContext('(function(require,module,exports,React){'+instrument+'\n})',{console})(req,m,m.exports,React);return m.exports;
}



const index=load(path.join(root,'src/data/food-manufacturing/index.ts')),data=load(path.join(root,'src/data/food-manufacturing/royal-native-context-readings.json')),source=load(path.join(root,'src/components/food-manufacturing/FoodSourcePracticeVisuals.tsx')),helper=load(path.join(root,'src/data/food-manufacturing/royal-native-context-readings.ts'));
const canonical=load(path.join(root,'src/data/food-manufacturing/source-closure47.json')),section=canonical.sections.find(s=>s.id==='food47-teaching'),whole=section.ruby[14],lesson=index.foodManufacturingLesson('food-2-021','2');assert.equal(section.lessonId,lesson.id);assert.equal(section.lessonSourceHash,lesson.sourceHash);assert.equal(whole.text,'下限規格値');assert.equal(whole.reading,'かげんきかくち');assert(section.textJa.includes(whole.text));
const actual=helper.foodRoyalNativeLabelRuby(lesson,whole.text);assert(actual&&actual.map(t=>t.text).join('')===whole.text,'Structural alignment can succeed independently of semantics');assert.equal(actual.map(t=>t.reading||t.text).join(''),whole.reading,'Compound specification 値 is ち, not standalone numeric あたい');
const figures=source.__censusFigures.filter(f=>['food-source46-control-line-names'].includes(f.id));assert.equal(figures.length,1);
const render=language=>renderToStaticMarkup(React.createElement(source.FoodSourcePracticeVisuals,{lesson,language,showTranslation:true,textColor:'#183044',readingColor:'#687078'}));let contexts=0;
for(const language of ['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']){forcedExpandedFigure=null;let html=render(language);assert(html.includes('かげんきかくち'));assert(!html.includes('かげんきかくあたい'));contexts++;for(const f of figures){forcedExpandedFigure=f;html=render(language);const zoom=html.slice(html.indexOf('data-testid="food-source-practice-zoom"'));assert(zoom.includes('かげんきかくち'));assert(!zoom.includes('かげんきかくあたい'));contexts++;}}forcedExpandedFigure=null;
assert(!helper.foodRoyalNativeLabelRuby({...lesson,sourceHash:'old'},whole.text));const entry=data.labels.find(e=>e.lessonId===lesson.id&&e.labelJa===whole.text),oldSource=entry.tokens[0].sourceId;entry.tokens[0].sourceId='missing-whole-term-proof';assert(!helper.foodRoyalNativeLabelRuby(lesson,whole.text));const {FoodRoyalNativeLabel}=load(path.join(root,'src/components/food-manufacturing/FoodRoyalNativeLabel.tsx'));const plain=renderToStaticMarkup(React.createElement(FoodRoyalNativeLabel,{lesson,text:whole.text,color:'#183044'}));assert(plain.includes(whole.text)&&!plain.includes(whole.reading),'Unknown provenance remains plain, not guessed');entry.tokens[0].sourceId=oldSource;
assert(Object.values(data.sources).some(s=>s.wordJa==='値'&&s.reading==='あたい'),'Keep valid standalone numeric value reading');
console.log(JSON.stringify({result:'PASS',wholeTechnicalTerm:whole.text,canonicalContextReading:whole.reading,actualLabelAndExactControlKeyZoomLocaleContexts:contexts,structuralAlignmentIsNotSemanticEvidence:true,nativeAcceptance:false},null,2));
