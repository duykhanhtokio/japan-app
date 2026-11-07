/* Current rendered vocational visual census. Metadata only; not source/domain/device acceptance. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const babel=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),cache=new Map();let forcedExpanded;let allocatedWidth=0;const cardStyles=[];let captured={images:[],views:[]};const inputs=new Map();
const wrap=tag=>({children,testID,accessibilityLabel})=>{if(testID)captured.views.push(testID);return React.createElement(tag,{'data-testid':testID,'aria-label':accessibilityLabel},children);};
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;const raw=fs.readFileSync(file,'utf8');inputs.set(path.relative(root,file),crypto.createHash('sha256').update(raw).digest('hex'));
 if(file.endsWith('.json')){const m={exports:JSON.parse(raw)};cache.set(file,m);return m.exports;}
 const m={exports:{}};cache.set(file,m);
 let code=babel.transformSync(raw,{filename:file,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:file.endsWith('.tsx')}],['@babel/plugin-transform-react-jsx',{runtime:'classic'}],'@babel/plugin-transform-modules-commonjs']}).code;if(file.endsWith('/FoodSourcePracticeVisuals.tsx'))code+='\nmodule.exports.__qaFigures=figures;';
 function req(name){
  if(name==='react')return file.endsWith('/FoodManufacturingCourse.tsx')?{...React,useState:initial=>React.useState(initial===false?true:initial)}:file.endsWith('/FoodSourcePracticeVisuals.tsx')?{...React,useState:initial=>React.useState(forcedExpanded===undefined?initial:forcedExpanded)}:file.endsWith('/FoodRoyalOjtCycle.tsx')?{...React,useState:()=>React.useState(allocatedWidth)}:React;
  if(name==='react-native')return {View:wrap('div'),Text:wrap('span'),ScrollView:wrap('div'),Pressable:wrap('button'),Modal:({visible,children})=>visible?React.createElement('div',null,children):null,Image:({source,accessibilityLabel,testID})=>{captured.images.push({path:source?.uri?path.relative(root,source.uri):null,testID:testID??null,hasAlt:typeof accessibilityLabel==='string'&&accessibilityLabel.trim().length>0});return React.createElement('img',{src:source?.uri,alt:accessibilityLabel,'data-testid':testID});},StyleSheet:{create:s=>s,absoluteFill:{position:'absolute'}}};
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
  if(name==='./translations/glossary.json')return {terms:[]};
  let target=name.startsWith('@/')?path.join(root,'src',name.slice(2)):name.startsWith('.')?path.resolve(path.dirname(file),name):null;
  if(!target)return require(name);if(/\.(webp|png)$/.test(target))return {uri:target};
  for(const candidate of [target,target+'.ts',target+'.tsx',target+'.json',path.join(target,'index.ts')])if(fs.existsSync(candidate)&&fs.statSync(candidate).isFile())return load(candidate);
  throw Error('Missing scoped dependency '+target);
 }
 vm.runInNewContext('(function(require,module,exports,React){'+code+'\n})',{console})(req,m,m.exports,React);return m.exports;
}
const crypto=require('crypto'),{execFileSync}=require('child_process');
const index=load(path.join(root,'src/data/food-manufacturing/index.ts'));
const {Reader}=load(path.join(root,'src/components/food-manufacturing/FoodManufacturingCourse.tsx'));
const daily=load(path.join(root,'src/data/food-manufacturing/daily-learning.ts'));
const source=load(path.join(root,'src/components/food-manufacturing/FoodSourcePracticeVisuals.tsx'));
const secondary=load(path.join(root,'src/data/food-manufacturing/illustrations.ts'));
const management=load(path.join(root,'src/data/food-manufacturing/management-visuals.ts'));
const concepts=load(path.join(root,'src/data/food-manufacturing/concept-source-bindings.ts'));
const locales=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const rows=[],residuals=[];let contexts=0;
const render=(lesson,language)=>{captured={images:[],views:[]};renderToStaticMarkup(React.createElement(Reader,{lesson,language,onBack:()=>{},onComplete:()=>{},saving:false,saveError:false}));return captured;};
const sortedPaths=cap=>JSON.stringify(cap.images.map(i=>i.path).sort());
for(const lesson of index.foodManufacturingLessons){
 const binding=daily.foodDailyBinding(lesson),ja=render(lesson,'ja');contexts++;
 if(!binding)residuals.push({lessonId:lesson.id,kind:'missing_current_daily_caption_binding'});
 if(!ja.views.includes('food-daily-diagram-'+lesson.id))residuals.push({lessonId:lesson.id,kind:'missing_rendered_daily_visual'});
 const primitive=ja.images.filter(i=>i.path?.includes('/daily-diagrams/')).map(i=>i.path);
 if(primitive.length)residuals.push({lessonId:lesson.id,kind:'active_primitive_daily_fallback',paths:primitive});
 for(const locale of locales.slice(1)){
  const actual=render(lesson,locale);contexts++;
  if(sortedPaths(actual)!==sortedPaths(ja))residuals.push({lessonId:lesson.id,locale,kind:'locale_changed_rendered_image_inventory'});
  if(!index.foodManufacturingTranslation(lesson,locale))residuals.push({lessonId:lesson.id,locale,kind:'missing_revision_matched_lesson_translation'});
 }
 const views=[...new Set(ja.views)],eligible=source.__qaFigures.filter(f=>source.foodSourcePracticeFigureMatches(lesson,f));
 rows.push({lessonId:lesson.id,level:lesson.level,week:lesson.week,day:lesson.day,sourceHash:lesson.sourceHash,captionParagraphId:binding?.captionParagraphId??null,images:ja.images,nativeIds:views.filter(id=>/^food-(daily-diagram|royal-|week\d|management-|technical-source-key|sign-|hazards$|haccp-monitoring$|traceability$|productivity$|illustration-)/.test(id)),sourceFigures:eligible.map(f=>({id:f.id,path:path.relative(root,f.source.uri),paragraphId:f.paragraphId,captionSupplementId:f.captionSupplementId??null,rendered:views.includes(f.id)})),secondaryFigures:secondary.foodIllustrationsFor(lesson).map(f=>({id:f.id,rendered:views.includes(f.id)})),managementFigures:management.foodManagementVisualsFor(lesson).map(f=>({id:f.id,rendered:views.includes(f.id)})),concepts:concepts.foodConceptDiagramsFor(lesson).map(f=>({id:f.id,rendered:views.includes(f.id)}))});
}
const assets=[...new Set(rows.flatMap(r=>r.images.map(i=>i.path)).filter(Boolean))].sort().map(relative=>{const file=path.join(root,relative);if(!fs.existsSync(file))return {path:relative,localByteState:'sparse_not_materialized'};const bytes=fs.readFileSync(file);return {path:relative,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),localByteState:bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP'?'actual_webp_bytes':'other_or_pointer_requires_review'};});
for(const row of rows){for(const image of row.images)if(!image.path||!image.hasAlt)residuals.push({lessonId:row.lessonId,kind:'missing_image_source_or_alt',image});for(const f of [...row.sourceFigures,...row.secondaryFigures,...row.managementFigures,...row.concepts])if(!f.rendered)residuals.push({lessonId:row.lessonId,kind:'eligible_visual_not_rendered',id:f.id});}
for(const [relative,hash]of inputs)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,relative))).digest('hex'),hash,'Census source changed while rendering: '+relative);
const result={schemaVersion:1,sector:'food',dateJst:'2026-11-07',sourceHead:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),scope:'Actual scheduled Reader rendering, including every active day, native diagram, source-practice/gallery, recognition image and inline native companion; no quiz content changes.',runtimeContexts:contexts,summary:{lessons:rows.length,uniqueRenderedAssetPaths:assets.length,sourceRegistryEntries:source.__qaFigures.length,activeSourceBindings:rows.reduce((n,r)=>n+r.sourceFigures.length,0),activeSecondaryBindings:rows.reduce((n,r)=>n+r.secondaryFigures.length,0),activeManagementBindings:rows.reduce((n,r)=>n+r.managementFigures.length,0),activeConceptBindings:rows.reduce((n,r)=>n+r.concepts.length,0),primitiveDailyFallbackIds:residuals.filter(r=>r.kind==='active_primitive_daily_fallback').map(r=>r.lessonId),residuals:residuals.length},rows,assets,residuals,inputHashes:Object.fromEntries([...inputs].sort()),acceptance:{structuralRuntimeCensus:true,allIllustrationSemanticsReviewed:false,wholeSourceKnowledgeCovered:false,sourceCoveragePercent:null,domainReviewed:false,nativeReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false},limitations:['Actual React Reader/components with deterministic native/Image/state/font/ruby/presentation adapters; no browser/device pixels.','Absent local asset bytes are sparse materialization state, not evidence remote assets are missing.','Registry counts and image presence do not certify visual correctness, source knowledge completeness or independent language/domain acceptance.']};
if(process.argv[2])fs.writeFileSync(path.resolve(process.argv[2]),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({result:'CENSUS_COMPLETE',contexts,summary:result.summary,residuals},null,2));
