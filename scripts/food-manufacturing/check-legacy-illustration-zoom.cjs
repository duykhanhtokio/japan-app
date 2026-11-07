/* Actual reader regression with deterministic RN/asset/ruby adapters; no device-pixel claim. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const esbuild=require('esbuild'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
let expanded=null;
const root=path.resolve(__dirname,'../..'),cache=new Map();
const wrap=tag=>({children,testID,accessibilityLabel,...props})=>React.createElement(tag,{'data-testid':testID,'aria-label':accessibilityLabel},children);
const rn={View:wrap('div'),Text:wrap('span'),ScrollView:wrap('div'),Pressable:wrap('button'),Image:({source,accessibilityLabel})=>React.createElement('img',{src:source.uri,alt:accessibilityLabel}),Modal:({visible,children})=>visible?React.createElement('div',null,children):null,StyleSheet:{create:s=>s}};
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
 if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));
 const m={exports:{}};cache.set(file,m);
 const code=esbuild.transformSync(fs.readFileSync(file,'utf8'),{loader:file.endsWith('.tsx')?'tsx':'ts',format:'cjs',jsxFactory:'React.createElement'}).code;
 function req(name){
  if(name==='react')return {...React,useState:()=>[expanded,value=>{expanded=value} ]};if(name==='react-native')return rn;
  if(name==='@/components/tokutei/StudyAppearance')return {TranslationText:wrap('span')};
  if(name==='./FoodLessonRuby')return {FoodLessonRuby:({text})=>React.createElement('span',null,text)};
  if(name==='./FoodRoyalOjtCycle')return {FoodRoyalOjtCycle:()=>null};
  if(name==='./FoodRoyalChemicalSafety')return {FoodRoyalChemicalSafety:()=>null};
  // Supplement-caption exercises are outside these six legacy direct-paragraph bindings.
  if(/source-closure\d+\.json$/.test(name))return {sections:[]};
  if(name==='@/data/food-manufacturing/royal-technical-axis-labels.json')return {locales:{}};
  if(name==='./translations/glossary.json')return {terms:[]};
  if(name==='./supplemental')return {supplementalLessons:load(path.join(root,'src/data/food-manufacturing/runtime-supplemental/lessons.json')),supplementalExams:[],supplementalTranslations:{},supplementalTestTranslations:{}};
  let target=name.startsWith('@/')?path.join(root,'src',name.slice(2)):name.startsWith('.')?path.resolve(path.dirname(file),name):null;
  if(!target)return require(name);if(/\.(webp|png)$/.test(target))return {uri:target};
  for(const candidate of [target,target+'.ts',target+'.tsx',target+'.json',path.join(target,'index.ts')])if(fs.existsSync(candidate)&&fs.statSync(candidate).isFile())return load(candidate);
  throw Error('Missing scoped dependency '+target);
 }
 vm.runInNewContext('(function(require,module,exports,React){'+code+'\n})',{console})(req,m,m.exports,React);return m.exports;
}
const index=load(path.join(root,'src/data/food-manufacturing/index.ts'));
const {FoodIllustrations}=load(path.join(root,'src/components/food-manufacturing/FoodIllustrations.tsx'));
const {foodIllustrationsFor}=load(path.join(root,'src/data/food-manufacturing/illustrations.ts'));
const warnings=load(path.join(root,'src/data/food-manufacturing/illustration-label-translations.json')).labels;
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
let contexts=0;
for(const lessonId of ['food-1-012','food-1-015']){
 const lesson=index.foodManufacturingLessons.find(l=>l.id===lessonId);
 const [figure]=foodIllustrationsFor(lesson);assert(figure,lessonId+' current binding');
 for(const language of ['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']){
  const render=(value=lesson,showTranslation=true)=>renderToStaticMarkup(React.createElement(FoodIllustrations,{lesson:value,language,showTranslation,textColor:'#eee',readingColor:'#ccc'}));
  expanded=null;const inline=render();
  assert(inline.includes('data-testid="'+figure.id+'"'));assert(!inline.includes(figure.id+'-zoom'));
  expanded=lesson.id+':'+lesson.sourceHash+':'+figure.id;const zoom=render();
  assert(zoom.includes('data-testid="'+figure.id+'-zoom"'));
  const p=lesson.paragraphs.find(p=>p.id===figure.captionParagraphId);
  assert(zoom.includes(escape(p.textJa)));
  if(language!=='ja'){
   const t=index.foodManufacturingTranslation(lesson,language);assert(t);
   assert(inline.includes(escape(t.paragraphs[p.id])));assert(zoom.includes(escape(t.paragraphs[p.id])));
   // Translation inside the image alt, not merely in a sibling text block.
   assert(zoom.match(/<img[^>]+alt="[^"]*"/g).every(tag=>tag.includes(escape(t.paragraphs[p.id]))));
   if(figure.incorrectExample)assert(zoom.match(/<img[^>]+alt="[^"]*"/g).every(tag=>tag.includes(escape(warnings[language]))));
   const hidden=render(lesson,false);assert(!hidden.includes(escape(t.paragraphs[p.id])));
  }
  assert(!render({...lesson,sourceHash:'changed'}).includes(figure.id+'-zoom'));
  assert(!render({...lesson,paragraphs:lesson.paragraphs.filter(p=>p.id!==figure.captionParagraphId)}).includes('data-testid="'+figure.id+'"'));
  const other=index.foodManufacturingLessons.find(l=>l.id==='food-1-001');assert(!render(other).includes(figure.id+'-zoom'));
  contexts+=6;
 }
}
console.log('PASS FoodIllustrations: '+contexts+' inline/zoom/translation-toggle/stale-revision/missing-caption/lesson-change contexts across 2 active illustrations and Japanese+12 locales. SSR adapters only; no device/domain acceptance.');
