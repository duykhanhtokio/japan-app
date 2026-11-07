/* Full current food provider/asset census; structural SSR does not certify device pixels or domain coverage. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const babel=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=process.env.FOOD_QA_REPO_ROOT||path.resolve(__dirname,'../..'),cache=new Map();
let forcedExpandedFigure=null,forceClosureZoom=false;
const wrap=tag=>({children,testID,accessibilityLabel})=>React.createElement(tag,{'data-testid':testID,'aria-label':accessibilityLabel},children);
const nil=()=>null;
const rn={View:wrap('div'),Text:wrap('span'),ScrollView:wrap('div'),Pressable:wrap('button'),Image:({source,accessibilityLabel,testID})=>{assert(source?.uri,'Rendered Image must have an actual source');return React.createElement('img',{src:source.uri,alt:accessibilityLabel,'data-testid':testID});},Modal:({visible,children})=>visible?React.createElement('div',null,children):null,StyleSheet:{create:s=>s,absoluteFill:{position:'absolute'}}};
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
const treeFile=process.env.FOOD_CENSUS_TREE_FILE||path.join(root,'docs/ssw-workspace/food-manufacturing/royal-final-active-census-20261107.json');
const manifest=JSON.parse(fs.readFileSync(treeFile,'utf8')),tree=manifest.entries||manifest.trackedTree;
assert(Array.isArray(tree),'Frozen source/asset tree is required');const byPath=new Map(tree.map(e=>[e.path,e]));
const index=load(path.join(root,'src/data/food-manufacturing/index.ts'));
const {Reader}=load(path.join(root,'src/components/food-manufacturing/FoodManufacturingCourse.tsx'));
const daily=load(path.join(root,'src/data/food-manufacturing/daily-learning.ts'));
const selectors=[['Royal','royal-weekly-images.ts','foodRoyalWeeklyImageFor'],['week2-native','royal-week2-native.ts','foodRoyalWeek2NativeFor'],['week4-native','royal-week4-native.ts','foodRoyalWeek4NativeFor'],['week5-native','royal-week5-native.ts','foodRoyalWeek5NativeFor'],['week7-native','royal-week7-native.ts','foodRoyalWeek7NativeFor'],['week8-native','royal-week8-native.ts','foodRoyalWeek8NativeFor'],['safety-signs','royal-safety-signs.ts','foodRoyalSafetySignsFor'],['retained-technical','royal-retained-technical.ts','foodRoyalRetainedTechnicalFor']].map(([name,file,key])=>{const fn=load(path.join(root,'src/data/food-manufacturing',file))[key];assert.equal(typeof fn,'function',name);return {name,fn}});
const lessons=index.foodManufacturingLessons;assert.equal(lessons.length,96);assert.equal(new Set(lessons.map(l=>l.id)).size,96);
const locales=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const failures=[],records=[],active=new Map();let contexts=0;
const check=(condition,message)=>{if(!condition)failures.push(message)};
const scopedData=load(path.join(root,'src/data/food-manufacturing/royal-native-context-readings.json'));
const scopedRuby=load(path.join(root,'src/data/food-manufacturing/royal-native-context-readings.ts')).foodRoyalNativeLabelRuby;
const escaped=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
const scopedLabelCoverage=[],renderedScopedLabels=new Set();
const sourceFigures=load(path.join(root,'src/components/food-manufacturing/FoodSourcePracticeVisuals.tsx')).__censusFigures;
assert(Array.isArray(sourceFigures),'Inspect actual production figure registry');
const illustrationFor=load(path.join(root,'src/data/food-manufacturing/illustrations.ts')).foodIllustrationsFor;
const managementFor=load(path.join(root,'src/data/food-manufacturing/management-visuals.ts')).foodManagementVisualsFor;
const conceptData=load(path.join(root,'src/data/food-manufacturing/diagrams.json'));
let sourceFigureContexts=0,royalCaptionContexts=0;
for(const entry of scopedData.labels){const lesson=lessons.find(l=>l.id===entry.lessonId),tokens=lesson&&scopedRuby(lesson,entry.labelJa),unknown=tokens?.filter(t=>/\p{Script=Han}/u.test(t.text)&&!t.reading).map(t=>t.text)||[];
 check(!!tokens,entry.lessonId+' invalid exact-context reading provenance '+entry.labelJa);check(unknown.length===0,entry.lessonId+' unannotated Han in scoped label '+entry.labelJa+': '+unknown.join(','));
 check(!lesson||!scopedRuby({...lesson,sourceHash:'stale-census-revision'},entry.labelJa),entry.lessonId+' scoped reading accepts stale revision');
 scopedLabelCoverage.push({lessonId:entry.lessonId,labelJa:entry.labelJa,currentProvenanceValid:!!tokens,unannotatedHan:unknown});
}
for(const lesson of lessons){
 const binding=daily.foodDailyBinding(lesson),providers=selectors.map(s=>({name:s.name,value:s.fn(lesson)})).filter(p=>p.value);
 check(!!binding,lesson.id+' missing current daily source binding');check(providers.length>0,lesson.id+' missing current Royal/native provider');
 const captions=[...new Set(providers.map(p=>p.value.captionParagraphId).filter(Boolean))];for(const id of captions)check(lesson.paragraphs.some(p=>p.id===id),lesson.id+' missing provider caption '+id);
 const royal=providers.find(p=>p.name==='Royal')?.value;if(royal)check(royal.captionParagraphId===binding?.captionParagraphId,lesson.id+' Royal source caption differs from actual Daily caption');
 const expectedSourceFigures=sourceFigures.filter(f=>f.lessonId===lesson.id);for(const f of expectedSourceFigures)check(f.lessonSourceHash===lesson.sourceHash,lesson.id+' stale retained figure binding '+f.id);
 const otherFigureIds=[...illustrationFor(lesson).map(f=>f.id),...managementFor(lesson).map(f=>f.id),...conceptData.diagrams.filter(d=>d.lessonIds.includes(lesson.id)).map(d=>d.id)];
 for(const s of selectors)check(!s.fn({...lesson,sourceHash:'stale-census-revision'}),lesson.id+' '+s.name+' accepts wrong source revision');
 let expectedImages;const ids=new Set();
 for(const language of locales){
  if(language!=='ja')check(!!index.foodManufacturingTranslation(lesson,language),lesson.id+' missing matching lesson translation '+language);
  const html=renderToStaticMarkup(React.createElement(Reader,{lesson,language,onBack:nil,onComplete:nil,saving:false,saveError:false}));
  check(html.includes('data-testid="food-daily-learning-'+lesson.id+'"'),lesson.id+' daily provider absent in actual Reader '+language);
  check(html.includes('data-testid="food-daily-diagram-'+lesson.id+'"'),lesson.id+' no actual current primary visual section '+language);
  check(!html.includes('/daily-diagrams/'),lesson.id+' old primitive image still active '+language);
  if(royal){const p=lesson.paragraphs.find(p=>p.id===royal.captionParagraphId),tag=[...html.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]).find(tag=>tag.includes(escaped(royal.source.uri)));check(!!p&&!!tag&&tag.includes(escaped(p.textJa)),lesson.id+' primary Royal alt lacks exact Japanese source caption '+language);if(language!=='ja'){const t=index.foodManufacturingTranslation(lesson,language);check(!!t&&!!tag&&tag.includes(escaped(t.paragraphs[royal.captionParagraphId])),lesson.id+' primary Royal alt lacks sourceHash-matched locale caption '+language);}royalCaptionContexts++;}
  for(const f of expectedSourceFigures){check(html.includes('data-testid="'+f.id+'"'),lesson.id+' retained source figure absent '+f.id+' '+language);sourceFigureContexts++;}
  for(const id of otherFigureIds)check(html.includes('data-testid="'+id+'"'),lesson.id+' retained illustration/native concept/management figure absent '+id+' '+language);
  const found=[];
  for(const m of html.matchAll(/<img\b([^>]*)>/g)){
   const uri=m[1].match(/\bsrc="([^"]+)"/)?.[1],alt=m[1].match(/\balt="([^"]*)"/)?.[1];check(!!uri&&!!alt,lesson.id+' unlabeled/unbound actual image '+language);if(!uri)continue;
   const p=path.relative(root,uri),entry=byPath.get(p);check(!!entry&&entry.type==='blob'&&entry.size>0,lesson.id+' untracked/empty asset '+p);found.push(p);
   if(language==='ja'){
    let record=active.get(p);if(!record){record={path:p,gitBlobSha:entry?.sha,bytes:entry?.size,lessonUses:[]};active.set(p,record);}record.lessonUses.push(lesson.id);
   }
  }
  found.sort();if(!expectedImages)expectedImages=found;else check(JSON.stringify(found)===JSON.stringify(expectedImages),lesson.id+' image inventory changes with locale '+language);
  for(const m of html.matchAll(/data-testid="([^"]+)"/g))if(/^(food-(?:source|technical|management|hazards|traceability|productivity|royal|pathogen|safety))/.test(m[1]))ids.add(m[1]);
  if(language==='ja'){const labels=new Set([...html.matchAll(/aria-label="([^"]*)"/g)].map(m=>m[1]));for(const e of scopedData.labels.filter(e=>e.lessonId===lesson.id))if(labels.has(escaped(e.labelJa)))renderedScopedLabels.add(e.lessonId+'\0'+e.labelJa);}
  contexts++;
 }
 records.push({lessonId:lesson.id,week:lesson.week,level:lesson.level,sourceHash:lesson.sourceHash,captionParagraphIds:captions,providers:providers.map(p=>({name:p.name,...(p.value.kind?{kind:p.value.kind}:{})})),actualInlineImages:expectedImages||[],nativeAndSourceFigureIds:[...ids].sort()});
 if(records.length%12===0)process.stderr.write('Census rendered '+records.length+'/96 lessons\n');
}
const sha=v=>require('node:crypto').createHash('sha1').update('blob '+v.length+'\0').update(v).digest('hex');
const loadedSources=[];for(const file of cache.keys()){const p=path.relative(root,file),entry=byPath.get(p);if(!p.startsWith('src/'))continue;const actual=sha(fs.readFileSync(file));check(entry?.sha===actual,'Source snapshot hash mismatch '+p);loadedSources.push({path:p,gitBlobSha:actual});}
const weeks=Array.from({length:8},(_,i)=>{const rows=records.filter(r=>r.week===i+1);check(rows.length===12,'Week '+(i+1)+' actual lessons !=12');return {week:i+1,lessons:rows.length,withRoyalImage:rows.filter(r=>r.providers.some(p=>p.name==='Royal')).length,withNativeProvider:rows.filter(r=>r.providers.some(p=>p.name!=='Royal')).length,activeUniqueImages:new Set(rows.flatMap(r=>r.actualInlineImages)).size};});
const axis=load(path.join(root,'src/data/food-manufacturing/royal-technical-axis-readings.json')),readingDebt=[];
function debts(value,key=''){if(!value||typeof value!=='object')return;for(const [k,v] of Object.entries(value)){const p=key+'/'+k;if(/debt|unsettled.*conflict/i.test(k))readingDebt.push({path:p,value:v});else if(k!=='tokens')debts(v,p)}}debts(axis);
const legacyDebtLabels=Object.keys(axis.week07CanonicalExpansion?.unknownHanDebt||{}),legacyDebtResolution=legacyDebtLabels.map(text=>({text,scopedCurrentContexts:scopedLabelCoverage.filter(e=>e.labelJa===text&&e.currentProvenanceValid&&!e.unannotatedHan.length).map(e=>e.lessonId)}));
const scopedReadingSummary={exactContexts:scopedData.labels.length,currentValidContexts:scopedLabelCoverage.filter(e=>e.currentProvenanceValid&&!e.unannotatedHan.length).length,actuallyRenderedContexts:renderedScopedLabels.size,inactiveContexts:scopedLabelCoverage.filter(e=>!renderedScopedLabels.has(e.lessonId+'\0'+e.labelJa)),legacyDebtResolution,provenance:'Existing revision-scoped canonical/reference dictionary guards; this census does not independently certify linguistic accuracy or all canonical prose.'};
check(scopedReadingSummary.inactiveContexts.length===0,'Declared current exact reading contexts are not actually rendered');
check(sourceFigures.every(f=>lessons.some(l=>l.id===f.lessonId)),'Retained source figure targets an unknown scheduled lesson');
const output={schemaVersion:1,sector:'food',baseCommit:manifest.commit||manifest.baseCommit,scope:'All96 existing scheduled lessons and their actually active Reader providers/assets',actualReaderLocaleContexts:contexts,lessonCount:records.length,royalCaptionContexts,retainedSourceFigures:sourceFigures.length,retainedSourceFigureContexts:sourceFigureContexts,uniqueActiveImageAssets:active.size,weeks,failures,historicalGlobalAxisDebt:readingDebt,scopedReadingSummary,records,activeAssets:[...active.values()].map(a=>({...a,lessonUses:[...new Set(a.lessonUses)].sort(),inlineOccurrences:a.lessonUses.length})).sort((a,b)=>a.path.localeCompare(b.path)),loadedSources:loadedSources.sort((a,b)=>a.path.localeCompare(b.path)),trackedTree:tree.map(({path,type,sha,size})=>({path,type,sha,size})),acceptance:{domainReviewed:false,nativeReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false,releaseReady:false,globalSourceAcceptance:false}};
if(process.env.FOOD_CENSUS_OUTPUT)fs.writeFileSync(process.env.FOOD_CENSUS_OUTPUT,JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({result:failures.length?'FAIL':'PASS',lessons:records.length,actualReaderLocaleContexts:contexts,uniqueActiveImageAssets:active.size,loadedSourceBlobs:loadedSources.length,scopedReadingSummary,weeks,failures},null,2));
assert.equal(failures.length,0,'Actual current provider/asset census has unresolved failures');
