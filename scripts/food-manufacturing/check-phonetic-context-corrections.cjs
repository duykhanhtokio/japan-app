/* Actual chemical-protection native companion: source-pinned existing readings and caption guards. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const babel=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),cache=new Map();let forcedExpanded;let allocatedWidth=0;const cardStyles=[];
const wrap=tag=>({children,testID,accessibilityLabel,style})=>{if(/^food-royal-ojt-(prepare|demonstrate|perform|improve)$/.test(testID??''))cardStyles.push(style);return React.createElement(tag,{'data-testid':testID,'aria-label':accessibilityLabel},children);};
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
 if(file.endsWith('.json')){const m={exports:JSON.parse(fs.readFileSync(file,'utf8'))};cache.set(file,m);return m.exports;}
 const m={exports:{}};cache.set(file,m);
 const code=babel.transformSync(fs.readFileSync(file,'utf8'),{filename:file,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:file.endsWith('.tsx')}],['@babel/plugin-transform-react-jsx',{runtime:'classic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 function req(name){
  if(name==='react')return file.endsWith('/FoodSourcePracticeVisuals.tsx')?{...React,useState:initial=>React.useState(forcedExpanded===undefined?initial:forcedExpanded)}:file.endsWith('/FoodRoyalOjtCycle.tsx')?{...React,useState:()=>React.useState(allocatedWidth)}:React;
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
  if(name==='./supplemental')return {supplementalLessonRuby:load(path.join(root,'src/data/food-manufacturing/runtime-supplemental/lesson-ruby.json')),supplementalLessons:load(path.join(root,'src/data/food-manufacturing/runtime-supplemental/lessons.json')),supplementalExams:[],supplementalTranslations:Object.fromEntries(['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'].map(locale=>[locale,load(path.join(root,'src/data/food-manufacturing/runtime-supplemental/lessons.'+locale+'.json'))])),supplementalTestTranslations:{}};
  let target=name.startsWith('@/')?path.join(root,'src',name.slice(2)):name.startsWith('.')?path.resolve(path.dirname(file),name):null;
  if(!target)return require(name);if(/\.(webp|png)$/.test(target))return {uri:target};
  for(const candidate of [target,target+'.ts',target+'.tsx',target+'.json',path.join(target,'index.ts')])if(fs.existsSync(candidate)&&fs.statSync(candidate).isFile())return load(candidate);
  throw Error('Missing scoped dependency '+target);
 }
 vm.runInNewContext('(function(require,module,exports,React){'+code+'\n})',{console})(req,m,m.exports,React);return m.exports;
}

const index=load(path.join(root,'src/data/food-manufacturing/index.ts'));
const contexts=load(path.join(root,'src/data/food-manufacturing/royal-native-context-readings.json'));
const helper=load(path.join(root,'src/data/food-manufacturing/royal-native-context-readings.ts'));
const source=load(path.join(root,'src/components/food-manufacturing/FoodSourcePracticeVisuals.tsx'));
const targets=[{lessonId:'food-2-021',text:'下限規格値',word:'下限規格値',reading:'かげんきかくち',old:'かげんきかくあたい'},{lessonId:'food-2-043',text:undefined,word:'組',reading:'くみ',old:'く'}];
let checks=0;
for(const target of targets){const lesson=index.foodManufacturingLessons.find(l=>l.id===target.lessonId);const text=target.text??lesson.paragraphs.find(p=>p.id==='p2').textJa;const entry=contexts.labels.find(e=>e.lessonId===lesson.id&&e.labelJa===text);assert(entry);const tokens=helper.foodRoyalNativeLabelRuby(lesson,text);assert.equal(tokens.map(t=>t.text).join(''),text);assert.equal(tokens.find(t=>t.text===target.word).reading,target.reading);
 const render=actual=>renderToStaticMarkup(React.createElement(source.FoodSourcePracticeVisuals,{lesson:actual,language:'ja',showTranslation:false,textColor:'#183044',readingColor:'#687078'}));
 assert(render(lesson).includes('>'+target.reading+'</span>'),'Actual source caption/key must render exact context reading');
 assert(!helper.foodRoyalNativeLabelRuby({...lesson,sourceHash:'stale'},text));assert.equal(render({...lesson,sourceHash:'stale'}),'');
 const token=entry.tokens.find(t=>t.text===target.word),saved=token.reading;try{token.reading=target.old;assert.equal(helper.foodRoyalNativeLabelRuby(lesson,text),null,'Old standalone reading must fail exact source proof');assert(!render(lesson).includes('>'+target.old+'</span>'),'Invalid context must not render former wrong reading');}finally{token.reading=saved;}
 assert.equal(helper.foodRoyalNativeLabelRuby(lesson,text).find(t=>t.text===target.word).reading,target.reading);assert(render(lesson).includes('>'+target.reading+'</span>'));checks+=5;
}
for(const [word,reading]of [['習得済み','しゅうとくずみ'],['承認済み','しょうにんずみ']])assert(contexts.labels.some(e=>e.tokens.some(t=>t.text===word&&t.reading===reading)));
console.log('PASS2 exact full-field contextual corrections, '+checks+' current/stale/old-reading/restored actual source-caption/key checks; previousずみ compounds preserved. No source prose/hash or human/native acceptance change.');

let ppeChecks=0;
for(const [n,id] of [[33,'food-source33-head-mask-gloves'],[34,'food-source34-ppe-head-foot'],[34,'food-source34-lifting-sequence']]){
 const figures=load(path.join(root,'src/data/food-manufacturing/source-practice'+n+'.ts'))['foodSourcePractice'+n];const figure=figures.find(f=>f.id===id),lesson=index.foodManufacturingLessons.find(l=>l.id===figure.lessonId);assert.equal(figure.width,1254);assert.equal(figure.height,1254);assert.equal(figure.aspectRatio,1);assert(source.foodSourcePracticeFigureMatches(lesson,figure));
 const render=actual=>renderToStaticMarkup(React.createElement(source.FoodSourcePracticeVisuals,{lesson:actual,language:'ja',showTranslation:false,textColor:'#183044',readingColor:'#687078'}));
 forcedExpanded=figure;const html=render(lesson);assert(html.includes('data-testid="'+id+'"'));assert(html.includes('food-source-practice-zoom'));
 for(const bad of [{...lesson,sourceHash:'stale'}, {...lesson,paragraphs:lesson.paragraphs.filter(p=>p.id!==figure.paragraphId)},{...lesson,paragraphs:lesson.paragraphs.map(p=>p.id===figure.paragraphId?{...p,textJa:'   '}:p)}]){assert(!source.foodSourcePracticeFigureMatches(bad,figure));assert(!render(bad).includes('food-source-practice-zoom'));}
 forcedExpanded=undefined;ppeChecks+=5;
}
console.log('PASS3 incoming1254-square PPE figures and '+ppeChecks+' current/selected/stale/missing/blank source-caption checks; pixel semantics use accepted primary hash-bound repair proof.');

const body=load(path.join(root,'src/components/food-manufacturing/FoodLessonRuby.tsx'));
const bodyLesson=index.foodManufacturingLessons.find(l=>l.id==='food-2-043'),bodyText=bodyLesson.paragraphs.find(p=>p.id==='p2').textJa;
const renderBody=actual=>renderToStaticMarkup(React.createElement(body.FoodLessonRuby,{lesson:actual,field:'paragraphs.p2.textJa',text:bodyText,color:'#183044',readingColor:'#687078'}));
assert(renderBody(bodyLesson).includes('>くみ</span>'),'Actual canonical body reader must pronounce noun組 correctly too');
assert(!renderBody({...bodyLesson,sourceHash:'stale'}).includes('>くみ</span>'),'Stale source falls back without obsolete readings');
const bodyPack=load(path.join(root,'src/data/food-manufacturing/runtime-supplemental/lesson-ruby.json'));
const bodyToken=bodyPack['food-2-043'].fields['paragraphs.p2.textJa'].find(t=>t.text==='組');assert.equal(bodyToken.reading,'くみ');
try{bodyToken.reading='く';assert(!renderBody(bodyLesson).includes('>くみ</span>'),'Old lexical token reproduces actual body-reading bug');}finally{bodyToken.reading='くみ';}
assert(renderBody(bodyLesson).includes('>くみ</span>'),'Restored exact noun reading returns');
console.log('PASS actual canonical food-2-043p2 FoodLessonRuby body current/stale/old-reading/restored checks; exact one noun token correction, source text unchanged.');
