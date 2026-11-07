/* Scoped actual production data/reader checks. SSR adapters do not certify device pixels. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const babel=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),cache=new Map();
const span=({children})=>React.createElement('span',null,children);
const native=require('react-native-web');
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
 if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));
 const m={exports:{}};cache.set(file,m);
 const code=babel.transformSync(fs.readFileSync(file,'utf8'),{filename:file,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:file.endsWith('.tsx')}],['@babel/plugin-transform-react-jsx',{runtime:'classic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 function req(name){
  if(name==='react')return React;
  if(name==='react-native')return {...native,Image:({source,accessibilityLabel,testID})=>React.createElement('img',{src:source?.uri,alt:accessibilityLabel,'data-testid':testID}),Modal:({children})=>React.createElement('div',{'data-qa-expanded-modal':true},children)};
  if(name==='@/components/tokutei/StudyAppearance')return {TranslationText:span};
  if(name==='@/components/world/japanese-ruby-data')return {hasAlignedRuby:(text,parts)=>parts.map(p=>p.text).join('')===text};
  if(name==='./FoodLessonRuby')return {FoodLessonRuby:({text})=>React.createElement('span',null,text)};
  if(name==='./FoodRoyalWeek2Native')return {FoodRoyalWeek2Native:()=>{throw Error('Unexpected week2 native renderer in week04 raster unit');}};
  if(name==='./supplemental')return {supplementalLessons:[],supplementalExams:[],supplementalTranslations:{},supplementalTestTranslations:{}};
  if(name==='./translations/glossary.json')return {terms:[]};
  let target=name.startsWith('@/')?path.join(root,'src',name.slice(2)):name.startsWith('.')?path.resolve(path.dirname(file),name):null;
  if(!target)return require(name);
  if(/\.(webp|png)$/.test(target))return {uri:target};
  for(const candidate of [target,target+'.ts',target+'.tsx',target+'.json',path.join(target,'index.ts')])if(fs.existsSync(candidate)&&fs.statSync(candidate).isFile())return load(candidate);
  throw Error('Missing scoped dependency: '+target);
 }
 vm.runInNewContext('(function(require,module,exports,React){'+code+'\n})',{console})(req,m,m.exports,React);return m.exports;
}
const registry=load(path.join(root,'src/data/food-manufacturing/royal-weekly-images.ts'));
const index=load(path.join(root,'src/data/food-manufacturing/index.ts'));
const {foodDailyBinding}=load(path.join(root,'src/data/food-manufacturing/daily-learning.ts'));
const {FoodDailyLearning}=load(path.join(root,'src/components/food-manufacturing/FoodDailyLearning.tsx'));
const ids=process.argv.slice(2);assert(ids.length,'Pass exact completed raster lesson IDs');
const locales=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let contexts=0;
for(const id of ids){
 const lesson=index.foodManufacturingLessons.find(l=>l.id===id);assert(lesson,id);
 assert.equal(registry.foodRoyalWeeklyImages.filter(image=>image.lessonId===id).length,1,id+' unique binding');
 const selected=registry.foodRoyalWeeklyImageFor(lesson);assert(selected,id+' missing current Royal binding');
 assert(fs.existsSync(selected.source.uri),id+' missing actual image bytes');
 const bytes=fs.readFileSync(selected.source.uri);assert(bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP');
 const binding=foodDailyBinding(lesson);assert.equal(selected.captionParagraphId,binding.captionParagraphId);
 const caption=lesson.paragraphs.find(p=>p.id===binding.captionParagraphId);
 assert(!registry.foodRoyalWeeklyImageFor({...lesson,sourceHash:'stale-revision'}));
 assert(!registry.foodRoyalWeeklyImageFor({...lesson,paragraphs:lesson.paragraphs.filter(p=>p.id!==binding.captionParagraphId)}));
 for(const language of locales){
  const t=language==='ja'?null:index.foodManufacturingTranslation(lesson,language);if(language!=='ja')assert(t,id+' '+language+' revision-matched translation');
  const html=renderToStaticMarkup(React.createElement(FoodDailyLearning,{lesson,language,showTranslation:true,textColor:'#183044',readingColor:'#687078'}));
  const escaped=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
  assert(html.includes(escaped(caption.textJa)),id+' '+language+' exact JA caption');
  if(t)assert(html.includes(escaped(t.paragraphs[caption.id])),id+' '+language+' exact locale caption');
  assert(html.split(escaped(selected.source.uri)).length>=3,id+' '+language+' both inline/expanded source');
  assert(html.includes('data-qa-expanded-modal'),id+' expanded reader adapter');contexts++;
 }
}
console.log('PASS actual production Royal registry + daily reader: '+ids.length+' units, '+contexts+' Japanese/localized inline and expanded structural SSR contexts; stale-source/missing-caption rejected. Ruby text, asset URI and forced-modal adapters; no browser/device acceptance.');
