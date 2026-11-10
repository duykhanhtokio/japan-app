// Actual Course/Reader/retrieval and progress functions, with explicit host UI/storage adapters.
// Restrict JSON payloads to the two reviewed lessons; this is not a full-course/device test.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),Module=require('node:module');
const root=path.resolve(__dirname,'../..'),modules=process.env.TOKUTEI_QA_MODULES||root,dep=n=>require(require.resolve(n,{paths:[modules]})),React=dep('react'),renderer=dep('react-test-renderer'),{act}=renderer,esbuild=dep('esbuild');global.IS_REACT_ACT_ENVIRONMENT=true;
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')),hash=x=>crypto.createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
const wantedIds=['agr-reader-thinning-condition-cues','agr-reader-nursery-five-groups','agr-reader-transplanting-scope-tradeoffs'],allChecks=read('src/data/agriculture/reader-moisture-checks.json').checks,checks=wantedIds.map(id=>allChecks.find(c=>c.id===id)),lessonIds=new Set(checks.map(c=>c.lessonId)),lessons=read('src/data/agriculture/lessons.ja.json').lessons,course=read('src/data/agriculture/course-manifest.json'),locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
assert(checks.every(Boolean));global.__agriV8Store=new Map();global.__agriV8Writes=[];
const native="exports.View='View';exports.Text='Text';exports.ScrollView='ScrollView';exports.Pressable='Pressable';exports.Modal='Modal';exports.Image='Image';exports.StyleSheet={create:x=>x,absoluteFill:{}};exports.useWindowDimensions=()=>({width:390,height:844});";
const fixtures={
 native,
 storage:"exports.default={getItem:async k=>global.__agriV8Store.get(k)??null,setItem:async(k,v)=>{global.__agriV8Writes.push({key:k,value:v});global.__agriV8Store.set(k,v)}};",
 appearance:"const React=require('react');exports.StudyAppearanceProvider=p=>React.createElement(React.Fragment,null,p.children);exports.ReadingAppearanceControl=()=>null;exports.TranslationText=p=>React.createElement('TranslationText',p,p.children);exports.useStudyAppearance=()=>({colors:{text:'#123',muted:'#456',background:'#fff',border:'#aaa',translation:'#eee',translationText:'#123'}});",
 safe:"exports.useSafeAreaInsets=()=>({top:0,bottom:0,left:0,right:0});",
 backdrop:"exports.useBackdropOcclusion=()=>{};",
 royal:"const React=require('react');const Panel=p=>React.createElement('Panel',p,p.children);exports.default=Panel;exports.RoyalContentPanel=Panel;exports.RoyalExplanationPanel=Panel;",
 chrome:"const React=require('react');exports.TokuteiHeader=p=>React.createElement('Header',p,p.title);exports.TokuteiDayCard=p=>React.createElement('DayCard',p,p.title);",
 recognition:"exports.RecognitionImages=()=>null;exports.hasRecognitionImage=()=>false;exports.getAgricultureFigureAsset=()=>null;",
 concept:"exports.ConceptDiagrams=()=>null;",
 examImage:"exports.AgricultureExamIllustration=()=>null;exports.hasAgricultureExamIllustration=()=>false;"
};
const oldError=console.error;let deprecationWarnings=0;console.error=(...a)=>{if(String(a[0]).startsWith('react-test-renderer is deprecated.')){deprecationWarnings++;return;}oldError(...a);};
function text(node){if(typeof node==='string'||typeof node==='number')return String(node);if(!node?.children)return '';return node.children.map(text).join('');}
const named=(tree,id)=>tree.root.findAll(n=>typeof n.type==='string'&&n.props.testID===id);
function button(tree,title){const nodes=tree.root.findAll(n=>n.type==='Pressable'&&text(n)===title);assert.equal(nodes.length,1,'Expected one button: '+title);return nodes[0];}
async function click(node){assert(node.props.onPress);await act(async()=>{node.props.onPress();await Promise.resolve();});}
function evaluate(code){const m=new Module(path.join(root,'agri-v8-host.cjs'),module);m.paths=Module._nodeModulePaths(modules);m._compile(code,path.join(root,'agri-v8-host.cjs'));return m.exports;}
(async()=>{
 const result=await esbuild.build({entryPoints:[path.join(root,'src/components/agriculture/AgricultureCourse.tsx')],write:false,bundle:true,platform:'node',format:'cjs',jsx:'automatic',nodePaths:[path.join(modules,'node_modules'),modules],plugins:[{name:'explicit-v8-host-adapters',setup(b){
  b.onResolve({filter:/^react($|\/)/},a=>({path:require.resolve(a.path,{paths:[modules]}),external:true}));
  b.onResolve({filter:/^react-native$/},()=>({path:'native',namespace:'fixture'}));
  b.onResolve({filter:/^@react-native-async-storage\/async-storage$/},()=>({path:'storage',namespace:'fixture'}));
  b.onResolve({filter:/^react-native-safe-area-context$/},()=>({path:'safe',namespace:'fixture'}));
  b.onResolve({filter:/StudyAppearance$/},()=>({path:'appearance',namespace:'fixture'}));
  b.onResolve({filter:/RoyalPageBackground$|RoyalPanels$/},()=>({path:'royal',namespace:'fixture'}));
  b.onResolve({filter:/AppBackdrop$/},()=>({path:'backdrop',namespace:'fixture'}));
  b.onResolve({filter:/TokuteiChrome$/},()=>({path:'chrome',namespace:'fixture'}));

  b.onResolve({filter:/\/ConceptDiagrams$/},()=>({path:'concept',namespace:'fixture'}));
  b.onResolve({filter:/\/AgricultureExamIllustration$/},()=>({path:'examImage',namespace:'fixture'}));
  b.onResolve({filter:/^@\//},a=>{const p=path.join(root,'src',a.path.slice(2)),file=[p,p+'.ts',p+'.tsx',p+'.json',path.join(p,'index.ts')].find(f=>fs.existsSync(f)&&fs.statSync(f).isFile());assert(file,'Alias file missing '+p);return{path:file};});
  b.onLoad({filter:/.*/,namespace:'fixture'},a=>({contents:"Object.defineProperty(exports,'__esModule',{value:true});"+fixtures[a.path],loader:'js'}));
  b.onLoad({filter:/[\\/]agriculture[\\/]lessons\.ja\.json$/},a=>({contents:JSON.stringify({...read(path.relative(root,a.path)),lessons:lessons.filter(l=>lessonIds.has(l.id))}),loader:'json'}));
  b.onLoad({filter:/[\\/]agriculture[\\/]translations[\\/][^\\/]+\.json$/},a=>{const all=read(path.relative(root,a.path));return{contents:JSON.stringify(Object.fromEntries(Object.entries(all).filter(([id])=>lessonIds.has(id)))),loader:'json'};});
  b.onResolve({filter:/\.(png|jpe?g|webp)$/},a=>({path:path.resolve(a.resolveDir,a.path),namespace:'host-asset'}));
  b.onLoad({filter:/.*/,namespace:'host-asset'},a=>({contents:`module.exports=${JSON.stringify({uri:a.path})}`,loader:'js'}));
 }}]});
 const physical='assets/agriculture/completion-40/general/agr-f40-general-thinning-comparison.png',figRecord=read('src/data/agriculture/recognition-images.json').images.find(f=>f.id==='agr-f40-general-thinning-comparison');assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,physical))).digest('hex'),figRecord.assetSha256);const Component=evaluate(result.outputFiles[0].text).AgricultureCourse;let caseCount=0,newReadingsChecked=0,preservedRecords=0;
 for(const c of checks){
  for(const f of ['promptRuby','modelAnswerRuby'])for(const token of c[f])if(/[\p{Script=Han}々]/u.test(token.text)){assert(token.readingKana);newReadingsChecked++;}
  assert(!('answerIndex'in c)&&!('score'in c)&&!('passThreshold'in c),'Retrieval must remain ungraded');
  const lesson=lessons.find(l=>l.id===c.lessonId);
  for(const level of c.levels)for(const language of locales){
   const learner=`v8-${c.id}-${level}-${language}`,key=`@japan_app_agriculture:completion:v1:${encodeURIComponent(learner)}:${level}`,oldRecord={version:1,entries:{'agr-rice':lessons.find(l=>l.id==='agr-rice').sourceHash}};global.__agriV8Store.clear();global.__agriV8Store.set(key,JSON.stringify(oldRecord));global.__agriV8Writes=[];
   let tree;async function mount(){await act(async()=>{tree=renderer.create(React.createElement(Component,{learner,language,onBack:()=>{}}));await Promise.resolve();});await click(button(tree,`特定技能${level}号`));const week=course.levels[level].weeks.find(w=>w.lessonIds.includes(lesson.id));await click(button(tree,`第${week.number}週\n${week.titleJa}`));return tree.root.findAll(n=>n.type==='DayCard'&&n.props.title===lesson.titleJa)[0];}
   const day=await mount();assert.equal(day.props.done,false);await click(day);if(c.id==='agr-reader-thinning-condition-cues'){const fig=named(tree,'agr-f40-general-thinning-comparison-image');assert(fig.length>=1,'Actual registered thinning diagram must mount beside retrieval');assert.equal(fig[0].props.source.uri,path.join(root,'assets/agriculture/completion-40/general/agr-f40-general-thinning-comparison.png'));}
   assert.equal(named(tree,c.id+'-answer').length,0);assert.equal(named(tree,c.id+'-translation').length,0);assert.equal(global.__agriV8Writes.length,0);
   await click(button(tree,'訳を表示'));assert.equal(named(tree,c.id+'-translation')[0].props.children,c.translations[language].prompt);
   const toggle=named(tree,c.id+'-toggle')[0].findAll(n=>n.type==='Pressable')[0];await click(toggle);
   const answer=named(tree,c.id+'-answer')[0];const baseText=answer.findAll(n=>n.type==='Text'&&n.props.style?.fontSize===17).map(text).join('');assert.equal(baseText,c.modelAnswerJa);assert.equal(named(tree,c.id+'-answer-translation')[0].props.children,c.translations[language].modelAnswer);
   assert.equal(global.__agriV8Writes.length,0,'Opening an ungraded answer must not save or grade');assert.deepEqual(JSON.parse(global.__agriV8Store.get(key)),oldRecord);
   await click(toggle);assert.equal(named(tree,c.id+'-answer').length,0);assert.equal(global.__agriV8Writes.length,0);
   await click(button(tree,'完了する'));assert.equal(global.__agriV8Writes.length,1);const saved=JSON.parse(global.__agriV8Store.get(key));assert.deepEqual(saved,{version:1,entries:{...oldRecord.entries,[lesson.id]:lesson.sourceHash}});assert(![...global.__agriV8Store.keys()].some(k=>k.includes(':exam:')),'No scored-exam attempt may be created');preservedRecords++;
   await act(()=>tree.unmount());const reopened=await mount();assert.equal(reopened.props.done,true,'Current lesson completion must restore');await click(reopened);assert.equal(named(tree,c.id+'-answer').length,0,'Answer toggle must start closed after reopening');await act(()=>tree.unmount());caseCount++;
  }
 }
 const inputs=['src/components/agriculture/AgricultureCourse.tsx','src/components/agriculture/MoistureReaderChecks.tsx','src/components/agriculture/DailyLearningSupport.tsx','src/components/agriculture/DailyInstructionDiagram.tsx','src/components/agriculture/ZoomableFigure.tsx','src/components/agriculture/RecognitionImages.tsx','src/data/agriculture/recognition-images.json','assets/agriculture/completion-40/general/agr-f40-general-thinning-comparison.png','src/services/agriculture-study-state.ts','src/data/agriculture/reader-moisture-checks.json','src/data/agriculture/daily-learning-support.json','src/data/agriculture/lessons.ja.json','src/data/agriculture/course-manifest.json',...locales.map(l=>`src/data/agriculture/translations/${l}.json`)];
 const evidence={status:'PASS_AGRICULTURE_V9_ACTUAL_READER_HOST',newActivities:checks.map(c=>c.id),localeCases:caseCount,locales:12,levels:2,newKanjiTokensChecked:newReadingsChecked,oldProgressRecordsPreserved:preservedRecords,answersInitiallyHidden:true,translationToggleUsesExactLocale:true,answersCloseAndReopen:true,retrievalUngraded:true,retrievalToggleDoesNotWriteProgress:true,realCourseCompletionPersistsAndRestores:true,noExamAttemptCreated:true,actualThinningImageMounted:true,sourceInputSha256:Object.fromEntries(inputs.map(p=>[p,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex')])),adapters:['React Native host primitives at390x844; no pixel rendering','AsyncStorage in-memory map','Royal/backdrop/safe-area/chrome/appearance host surfaces','Unrelated exam/concept components omitted; actual RecognitionImages/ZoomableFigure registry used; reviewed thinning image mount asserted','Own two lesson JSON payloads and corresponding locale records selected from actual files; actual index/loader/StudyState/Course/Reader/MoistureReaderChecks implementations run','PNG file imports retain absolute asset URI; no native image rendering'],reactTestRendererDeprecationWarnings:deprecationWarnings,physicalDeviceTested:false,nativeReviewed:false,domainReviewed:false,learnerDurationMeasured:false,productionExpoTested:false};
 fs.writeFileSync(path.join(root,'docs/ssw-workspace/source-coverage-v2/agriculture-nursery-v9-host-validation.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify({...evidence,sourceInputSha256:'recorded'+inputs.length+'inputhashes',adapters:evidence.adapters.length}));
})().catch(e=>{oldError(e);process.exitCode=1;}).finally(()=>{console.error=oldError;});
