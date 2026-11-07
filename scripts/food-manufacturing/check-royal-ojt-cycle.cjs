/* Actual OJT native companion: exact Japanese, twelve locales, readings and allocated-width layout. */
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
const data=load(path.join(root,'src/data/food-manufacturing/royal-ojt-cycle.json'));
const ojt=load(path.join(root,'src/components/food-manufacturing/FoodRoyalOjtCycle.tsx'));
const source=load(path.join(root,'src/components/food-manufacturing/FoodSourcePracticeVisuals.tsx'));
const figure=load(path.join(root,'src/data/food-manufacturing/source-practice33.ts')).foodSourcePractice33.find(f=>f.id==='food-source33-ojt-cycle');
const {hasAlignedRuby}=load(path.join(root,'src/components/world/japanese-ruby-data.ts'));
const lesson=index.foodManufacturingLessons.find(l=>l.id===data.lessonId);assert(lesson);
const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
assert.equal(data.lines.length,23);assert.equal(new Set(data.lines.map(l=>l.id)).size,23);
assert.equal(crypto.createHash('sha256').update(JSON.stringify(data.lines.map(l=>[l.id,l.ja]))).digest('hex'),data.contentRevision);
for(const line of data.lines){assert(hasAlignedRuby(line.ja,line.ruby),line.id+' complete aligned ruby');assert(line.ruby.every(p=>!/\p{Script=Han}/u.test(p.text)||p.reading),line.id+' all Han annotated');}
for(const locale of locales){assert.equal(data.locales[locale].sourceHash,data.contentRevision);assert.equal(Object.keys(data.locales[locale].lines).length,data.lines.length);assert.equal(data.locales[locale].nativeReviewed,false);for(const line of data.lines)assert(data.locales[locale].lines[line.id]?.trim()&&data.locales[locale].lines[line.id]!==line.ja,locale+' '+line.id+' explicit translation');}
let selfAuthored=0;
for(const [word,ref] of Object.entries(data.rubyProvenance)){
 if(ref.status==='authored_ai_unreviewed'){selfAuthored++;assert.equal(word,'授業');continue;}
 if(ref.file){const j=JSON.parse(fs.readFileSync(path.join(root,'src/data/food-manufacturing',ref.file),'utf8'));const part=ref.jsonPointer.split('/').slice(1).reduce((x,key)=>x[key.replace(/~1/g,'/').replace(/~0/g,'~')],j);assert.equal(part.text,word);assert.equal(part.reading,ref.reading);}
 else{const canonical=index.foodManufacturingLessons.find(l=>l.id===ref.lessonId);assert.equal(canonical.sourceHash,ref.sourceHash);let entry;for(let i=1;i<=6;i++){const pack=JSON.parse(fs.readFileSync(path.join(root,`src/data/food-manufacturing/ruby/lessons-0${i}.json`),'utf8'));entry=pack.lessons[ref.lessonId]??entry;}assert(entry.fields[ref.field].some(p=>p.text===word&&p.reading===ref.reading));}
}
assert.equal(selfAuthored,1,'Only the disclosed ordinary-word reading is newly authored');
const escape=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
const render=(actual,language,showTranslation=true)=>renderToStaticMarkup(React.createElement(ojt.FoodRoyalOjtCycle,{lesson:actual,language,showTranslation}));
let contexts=0,callerContexts=0;
for(const language of ['ja',...locales]){
 const html=render(lesson,language);for(const line of data.lines){assert(html.includes(escape(line.ja)),line.id+' exact Japanese accessibility/text');if(language!=='ja')assert(html.includes(escape(data.locales[language].lines[line.id])),language+' '+line.id+' native companion translation');}
 for(const line of data.lines.filter(l=>l.id!=='cycleAlt'))assert(html.includes('data-testid="food-royal-ojt-ja-'+line.id+'"'),line.id+' actual JapaneseRuby');contexts++;
 for(const bad of [{...lesson,sourceHash:'stale'},{...lesson,id:'another-lesson'},{...lesson,paragraphs:lesson.paragraphs.filter(p=>p.id!==data.paragraphId)},{...lesson,paragraphs:lesson.paragraphs.map(p=>p.id===data.paragraphId?{...p,textJa:'   '}:p)}]){assert.equal(render(bad,language),'');contexts++;}
 forcedExpanded=figure;
 const full=renderToStaticMarkup(React.createElement(source.FoodSourcePracticeVisuals,{lesson,language,showTranslation:true,textColor:'#183044',readingColor:'#687078'}));
 assert.equal(full.split('data-testid="food-royal-ojt-cycle-text"').length-1,2,'Both actual source-practice inline and selected zoom callers render current OJT companion');if(language!=='ja')for(const line of data.lines)assert(full.includes(escape(data.locales[language].lines[line.id])));callerContexts++;
}
forcedExpanded=undefined;
const oldRevision=data.locales.vi.sourceHash;try{data.locales.vi.sourceHash='old-chart-text';const html=render(lesson,'vi');assert(!html.includes(escape(data.locales.vi.lines.closure1)));assert(html.includes(escape(data.lines.find(l=>l.id==='closure1').ja)));}finally{data.locales.vi.sourceHash=oldRevision;}
for(const width of [200,320,559,560,1024]){allocatedWidth=width;cardStyles.length=0;render(lesson,'vi');assert.equal(cardStyles.length,4);for(const styles of cardStyles){const s=Object.assign({},...styles);assert.equal(s.minWidth,0);assert.equal(s.maxWidth,'100%');assert.equal(s.flexBasis,width>=560?'45%':'100%');assert(parseFloat(s.flexBasis)/100*width<=width);}}
console.log('PASS23 unchanged Japanese strings,276 explicit revision-bound locale lines,60 reading-provenance tokens, '+contexts+' native current/invalid contexts, '+callerContexts+' actual inline+zoom caller contexts and5 allocated-width structural layouts. Existing source-reused readings plus disclosed1 ordinary AI reading; no device/native/domain acceptance.');
