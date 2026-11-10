/* Actual production ConceptDiagrams; controlled state/RN adapters do not certify device pixels. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const babel=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=process.env.FOOD_QA_REPO_ROOT||path.resolve(__dirname,'../..'),cache=new Map();
let expanded=null,failed=[],imageErrors=new Map(),currentHashOverride;const actualAssets=new Set();
const read=p=>JSON.parse(fs.readFileSync(path.join(root,'src/data/food-manufacturing',p),'utf8'));
const lessons=[...read('lessons.1.ja.json').lessons,...read('lessons.2.ja.json').lessons];
const translationSource=fs.readFileSync(path.join(root,'src/data/food-manufacturing/index.ts'),'utf8');
const translationStart=translationSource.indexOf('export function foodManufacturingTranslation('),translationEnd=translationSource.indexOf('export function foodManufacturingTermTranslation(',translationStart);
const translationCode=babel.transformSync(translationSource.slice(translationStart,translationEnd).replace('export function','function'),{filename:'actual-translation.ts',babelrc:false,configFile:false,plugins:['@babel/plugin-transform-typescript']}).code;
const translate=vm.runInNewContext('(function(lessonPack){'+translationCode+';return foodManufacturingTranslation;})')(language=>read('translations/'+language+'.json'));
const flat=s=>Array.isArray(s)?Object.assign({},...s.map(flat)):s||{};
const wrap=tag=>({children,testID,accessibilityLabel,style,accessible})=>{const s=flat(style);return React.createElement(tag,{'data-testid':testID,'aria-label':accessibilityLabel,'data-color':s.color,'data-bg':s.backgroundColor,'data-accessible':accessible},children)};
const rn={View:wrap('div'),Text:wrap('span'),ScrollView:wrap('div'),Pressable:wrap('button'),Modal:({visible,children})=>visible?React.createElement('section',{'data-modal':'true'},children):null,Image:({source,accessibilityLabel,testID,onError})=>{assert(source?.uri,'No undefined image source');if(!actualAssets.has(source.uri)){const bytes=fs.readFileSync(source.uri);assert(bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP','Actual existing asset bytes required');actualAssets.add(source.uri);}imageErrors.set(source.uri,onError);return React.createElement('img',{src:source.uri,alt:accessibilityLabel,'data-testid':testID})},StyleSheet:{create:s=>s}};
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;const m={exports:{}};cache.set(file,m);
 if(file.endsWith('.json')){m.exports=JSON.parse(fs.readFileSync(file,'utf8'));return m.exports;}
 const code=babel.transformSync(fs.readFileSync(file,'utf8'),{filename:file,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:file.endsWith('.tsx')}],['@babel/plugin-transform-react-jsx',{runtime:'classic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 function req(name){
  if(name==='react')return {...React,useState:initial=>initial===null?[expanded,next=>{expanded=next}]:[failed,next=>{failed=typeof next==='function'?next(failed):next}]};
  if(name==='react-native')return rn;
  if(name==='@/data/food-manufacturing')return {foodManufacturingTranslation:translate,foodManufacturingLesson:id=>{const l=lessons.find(l=>l.id===id);return l&&currentHashOverride?{...l,sourceHash:currentHashOverride}:l}};
  if(name==='@/components/tokutei/StudyAppearance')return {TranslationText:wrap('span')};
  const target=name.startsWith('@/')?path.join(root,'src',name.slice(2)):path.resolve(path.dirname(file),name);
  if(target.endsWith('.webp'))return {uri:target};
  for(const p of [target,target+'.ts',target+'.tsx',target+'.json'])if(fs.existsSync(p))return load(p);
  throw Error('Missing dependency '+target);
 }
 vm.runInNewContext('(function(require,module,exports,React){'+code+'})',{console})(req,m,m.exports,React);return m.exports;
}
const {FoodConceptDiagrams}=load(path.join(root,'src/components/food-manufacturing/ConceptDiagrams.tsx'));
const data=load(path.join(root,'src/data/food-manufacturing/diagrams.json')),d=data.diagrams.find(d=>d.id==='food-hazards'),ui=read('daily-ui-translations.json');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
const render=(lesson,language,showTranslation=true)=>renderToStaticMarkup(React.createElement(FoodConceptDiagrams,{lessonId:lesson.id,language,showTranslation,textColor:'#e4d9c5',dailyPlacement:lesson.id==='food-2-007'}));
const images=html=>[...html.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);
const context=lesson=>lesson.id+':'+lesson.sourceHash+':food-hazards:';
let inlineContexts=0,zoomContexts=0,translationOffContexts=0,negativeRevisionContexts=0;
for(const id of d.lessonIds){const lesson=lessons.find(l=>l.id===id);assert(lesson);
 for(const language of ['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']){
  expanded=null;failed=[];const html=render(lesson,language),tags=images(html);assert.equal(tags.length,3);assert(!html.includes('data-modal="true"'));assert(html.includes('data-testid="food-hazards"')&&html.includes('data-accessible="false"'),'Interactive node buttons remain individually accessible');
  for(const node of d.nodes){const tag=tags.find(tag=>tag.includes('data-testid="food-hazard-node-'+node.id+'"'));assert(tag&&tag.includes(esc(node.labelJa))&&tag.includes(esc(d.noteJa)));assert(tag.includes(esc(lesson.paragraphs[0].textJa)),'Preserve newer full canonical lesson-source description');if(language!=='ja'){assert(tag.includes(esc(d.translations[language].nodeLabels[node.id])));const tr=translate(lesson,language);assert(tr&&tag.includes(esc(tr.paragraphs[lesson.paragraphs[0].id])),'Preserve current sourceHash-matched lesson translation');}}
  inlineContexts++;
  for(const node of d.nodes){expanded=context(lesson)+node.id;const zoomed=render(lesson,language),start=zoomed.indexOf('<section data-modal="true">');assert(start>=0);const modal=zoomed.slice(start);assert(modal.includes('data-testid="food-hazard-node-'+node.id+'-zoom"'));assert.equal(images(modal).length,1);assert(modal.includes(esc(node.labelJa))&&modal.includes(esc(d.noteJa)));assert(modal.includes('data-bg="#fffaf0"'));assert(!modal.includes('data-color="#e4d9c5"'),'Zoom ink stays dark on ivory');if(language!=='ja'){assert(modal.includes(esc(d.translations[language].nodeLabels[node.id])));assert(modal.includes(esc(ui.locales[language].close)));}zoomContexts++;}
 }
 for(const node of d.nodes){expanded=context(lesson)+node.id;const html=render(lesson,'vi',false);const alt=images(html).find(tag=>tag.includes('data-testid="food-hazard-node-'+node.id+'"'));assert(alt.includes(esc(node.labelJa)));assert(!alt.includes(esc(d.translations.vi.nodeLabels[node.id])));translationOffContexts++;}
 currentHashOverride='old';expanded=context(lesson)+'1';let html=render(lesson,'vi');assert.equal(images(html).length,0);assert(!html.includes('data-modal="true"'));assert(html.includes(esc(d.nodes[0].labelJa)),'Native classification remains available when photos fail closed');currentHashOverride=undefined;negativeRevisionContexts++;
}
const missing=lessons.find(l=>l.id===d.lessonIds[0]),savedParagraphs=missing.paragraphs;missing.paragraphs=[];expanded=null;assert.equal(images(render(missing,'vi')).length,0,'Empty source cannot activate any Royal node');missing.paragraphs=savedParagraphs.slice(1);assert.equal(images(render(missing,'vi')).length,0,'Missing required caption cannot activate any Royal node');missing.paragraphs=savedParagraphs;
const first=lessons.find(l=>l.id===d.lessonIds[0]);
for(const node of d.nodes){expanded=context(first)+node.id;failed=[];imageErrors=new Map();const html=render(first,'vi'),tag=images(html).find(tag=>tag.includes('data-testid="food-hazard-node-'+node.id+'"')),uri=tag.match(/src="([^"]+)"/)[1],errorHandler=imageErrors.get(uri);assert.equal(typeof errorHandler,'function');errorHandler();const fallback=render(first,'vi');assert.equal(images(fallback).length,2);assert(!fallback.includes('data-modal="true"'));assert(fallback.includes(esc(node.labelJa)),'Failed picture keeps native source classification');const other=lessons.find(l=>l.id===d.lessonIds[1]);assert.equal(images(render(other,'vi')).length,3,'Failure remains scoped to its lesson/revision/node');}
failed=[];expanded='other-lesson:old:1';assert(!render(first,'vi').includes('data-modal="true"'),'Stale selected identity must not open a zoom');
const originalLabel=d.nodes[0].labelJa;d.nodes[0].labelJa='changed native label';assert.equal(images(render(first,'vi')).length,2,'Changed node meaning cannot reuse old photo');d.nodes[0].labelJa=originalLabel;
const originalId=d.nodes[0].id;d.nodes[0].id='unknown';assert.equal(images(render(first,'vi')).length,2,'Unknown node cannot use undefined art');d.nodes[0].id=originalId;
assert(!renderToStaticMarkup(React.createElement(FoodConceptDiagrams,{lessonId:'food-2-007',language:'vi',showTranslation:true,textColor:'#183044'})),'Existing native daily placement dedup preserved');
console.log(JSON.stringify({result:'PASS',inlineContexts,zoomContexts,translationOffContexts,negativeRevisionContexts,loadErrorNativeFallback:'PASS',nodeMeaningAndSelectedIdentityGuards:'PASS',deviceAcceptance:false},null,2));
