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
  if(name==='./supplemental')return {supplementalLessons:load(path.join(root,'src/data/food-manufacturing/runtime-supplemental/lessons.json')),supplementalExams:[],supplementalTranslations:Object.fromEntries(['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'].map(locale=>[locale,load(path.join(root,'src/data/food-manufacturing/runtime-supplemental/lessons.'+locale+'.json'))])),supplementalTestTranslations:{}};
  let target=name.startsWith('@/')?path.join(root,'src',name.slice(2)):name.startsWith('.')?path.resolve(path.dirname(file),name):null;
  if(!target)return require(name);if(/\.(webp|png)$/.test(target))return {uri:target};
  for(const candidate of [target,target+'.ts',target+'.tsx',target+'.json',path.join(target,'index.ts')])if(fs.existsSync(candidate)&&fs.statSync(candidate).isFile())return load(candidate);
  throw Error('Missing scoped dependency '+target);
 }
 vm.runInNewContext('(function(require,module,exports,React){'+code+'\n})',{console})(req,m,m.exports,React);return m.exports;
}
const crypto=require('crypto');
const index=load(path.join(root,'src/data/food-manufacturing/index.ts'));
const data=load(path.join(root,'src/data/food-manufacturing/royal-chemical-safety-translations.json'));
const readings=load(path.join(root,'src/data/food-manufacturing/royal-chemical-safety-readings.json'));
const chemical=load(path.join(root,'src/components/food-manufacturing/FoodRoyalChemicalSafety.tsx'));
const source=load(path.join(root,'src/components/food-manufacturing/FoodSourcePracticeVisuals.tsx'));
const figure=load(path.join(root,'src/data/food-manufacturing/source-practice33.ts')).foodSourcePractice33.find(f=>f.id==='food-source33-chemical-ppe');
const lesson=index.foodManufacturingLessons.find(l=>l.id===data.lessonId),locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];assert(lesson);
assert.equal(data.lines.length,16);assert.equal(crypto.createHash('sha256').update(JSON.stringify(data.lines.map(l=>l.ja))).digest('hex'),data.sourceJapaneseSha256);assert.equal(readings.sourceJapaneseSha256,data.sourceJapaneseSha256);
for(const line of data.lines){const parts=chemical.foodRoyalChemicalSafetyRuby(line.id);assert(parts,line.id+' complete current reading');assert.equal(parts.map(p=>p.text).join(''),line.ja);assert(parts.every(p=>!/\p{Script=Han}/u.test(p.text)||p.reading));}
const allReadings={};for(let i=1;i<=6;i++)Object.assign(allReadings,JSON.parse(fs.readFileSync(path.join(root,`src/data/food-manufacturing/ruby/lessons-0${i}.json`),'utf8')).lessons);
for(const [word,ref] of Object.entries(readings.rubyProvenance)){
 assert(!ref.status,'All chemical chart readings must reuse explicit existing tokens');
 if(ref.file){const j=JSON.parse(fs.readFileSync(path.join(root,'src/data/food-manufacturing',ref.file),'utf8'));const p=ref.jsonPointer.split('/').slice(1).reduce((x,key)=>x[key.replace(/~1/g,'/').replace(/~0/g,'~')],j);assert.equal(p.text,word);assert.equal(p.reading,ref.reading);}
 else{const current=index.foodManufacturingLessons.find(l=>l.id===ref.lessonId);assert.equal(current.sourceHash,ref.sourceHash);assert(allReadings[ref.lessonId].fields[ref.field].some(p=>p.text===word&&p.reading===ref.reading));}
}
const escape=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
const render=(actual,language)=>renderToStaticMarkup(React.createElement(chemical.FoodRoyalChemicalSafety,{lesson:actual,language,showTranslation:true}));let contexts=0,callerContexts=0;
for(const language of ['ja',...locales]){
 const html=render(lesson,language);for(let i=0;i<data.lines.length;i++){const line=data.lines[i];assert(html.includes(escape(line.ja)));assert(html.includes('data-testid="food-royal-chemical-ruby-'+line.id+'"'));if(language!=='ja')assert(html.includes(escape(data.locales[language][i])));}
 contexts++;
 for(const scenario of ['wrong-lesson','stale','missing','blank-title','blank-body']){
  const bad=scenario==='wrong-lesson'?{...lesson,id:'wrong'}:scenario==='stale'?{...lesson,sourceHash:'old'}:{...lesson,paragraphs:scenario==='missing'?lesson.paragraphs.filter(p=>p.id!==data.paragraphId):lesson.paragraphs.map(p=>p.id===data.paragraphId?{...p,[scenario==='blank-title'?'titleJa':'textJa']:'   '}:p)};
  assert(!chemical.foodRoyalChemicalSafetyFor(bad,language,true));assert.equal(render(bad,language),'');contexts++;
 }
 forcedExpanded=figure;const full=renderToStaticMarkup(React.createElement(source.FoodSourcePracticeVisuals,{lesson,language,showTranslation:true,textColor:'#183044',readingColor:'#687078'}));
 assert.equal(full.split('data-testid="food-royal-chemical-safety-text"').length-1,2,'Current companion renders inline and selected zoom');callerContexts++;
}
forcedExpanded=undefined;
const original=readings.sourceJapaneseSha256;try{readings.sourceJapaneseSha256='stale-reading-chart';assert(!chemical.foodRoyalChemicalSafetyRuby('title'));const html=render(lesson,'vi');assert(html.includes(escape(data.lines[0].ja)));assert(!html.includes('data-testid="food-royal-chemical-ruby-title"'),'Stale readings must fall back to unchanged plain Japanese');}finally{readings.sourceJapaneseSha256=original;}
console.log('PASS16 unchanged Japanese lines with '+Object.keys(readings.rubyProvenance).length+' existing full-token reading references, '+contexts+' native current/caption/source contexts and '+callerContexts+' actual inline+zoom caller contexts acrossJA+12locales; existing192locale lines retained, stale readings rejected. Structural RN/Image/state/font adapters; no new reading authorship or device/native/domain acceptance.');
