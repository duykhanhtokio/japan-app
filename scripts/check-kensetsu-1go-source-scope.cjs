const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),modules=process.env.TOKUTEI_QA_MODULES||root;
const dep=name=>require(require.resolve(name,{paths:[modules]}));
(async()=>{
 const mocks={
 'react-native':`import React,{forwardRef,useImperativeHandle} from 'react';export const View='View',Text='Text',Image='Image',Pressable='Pressable';export const Modal=p=>p.visible?React.createElement('Modal',p,p.children):null;export const ScrollView=forwardRef((p,r)=>{useImperativeHandle(r,()=>({scrollTo(){}}));return React.createElement('ScrollView',p,p.children)});export const StyleSheet={create:x=>x,absoluteFillObject:{},flatten:x=>Object.assign({},...[x].flat(Infinity).filter(Boolean))};export const useWindowDimensions=()=>({width:390,height:844,fontScale:1});export const AppState={addEventListener:()=>({remove(){}})};`,
 '@react-native-async-storage/async-storage':`export default {getItem:async k=>globalThis.__scopeStorage.get(k)??null,setItem:async(k,v)=>globalThis.__scopeStorage.set(k,v)};`,
 'react-native-safe-area-context':`export const useSafeAreaInsets=()=>({top:59,bottom:34,left:0,right:0});`,
 '@/components/ui/RoyalSurface':`import React from 'react';export const ROYAL_FONT={body:'System',heading:'System'},ROYAL_LAYOUT={screenGutter:12,backSafeTop:8};export const RoyalBackButton=p=>React.createElement('Pressable',{onPress:p.onPress,testID:'scope-back'},'戻る');`,
 '@/components/ui/RoyalPanels':`import React from 'react';export const RoyalContentPanel=p=>React.createElement('View',p,p.children);export const RoyalExplanationPanel=RoyalContentPanel;`,
 '@/components/ui/RoyalPageBackground':`import React from 'react';export default p=>React.createElement('View',p,p.children);`,
 };
 const result=await dep('esbuild').build({stdin:{contents:[
 'src/data/kensetsu/index.ts','src/data/kensetsu/scope.ts','src/data/kensetsu/review-tests.ts','src/components/kensetsu/KensetsuCourse.tsx','src/components/kensetsu/KensetsuReviewTests.tsx','src/services/kensetsu-test-state.ts',
 ].map(p=>`export * from ${JSON.stringify(path.join(root,p))};`).join('\n'),resolveDir:root,loader:'tsx'},bundle:true,write:false,format:'cjs',platform:'node',jsx:'automatic',logLevel:'error',plugins:[{name:'host-scope-fixture',setup(b){
 b.onResolve({filter:/.*/},a=>{if(mocks[a.path])return {path:a.path,namespace:'mock'};if(/\.(png|jpe?g|webp)$/.test(a.path))return {path:a.path,namespace:'asset'};if(a.path==='react'||a.path.startsWith('react/'))return {path:a.path,external:true};if(a.path.startsWith('@/')){const base=path.join(root,'src',a.path.slice(2));for(const suffix of ['.ts','.tsx','/index.ts'])if(fs.existsSync(base+suffix))return {path:base+suffix};throw Error(base);}});
 b.onLoad({filter:/.*/,namespace:'mock'},a=>({contents:mocks[a.path],loader:'tsx'}));b.onLoad({filter:/.*/,namespace:'asset'},()=>({contents:'export default 1;',loader:'js'}));
 }}]});
 const box={exports:{}};new Function('module','exports','require',result.outputFiles[0].text)(box,box.exports,dep);const m=box.exports;
 const theory=m.sessionsForScope('1','utilities','theory'),practical=m.sessionsForScope('1','utilities','practical');
 assert.equal(theory.length,161);assert.equal(practical.length,224);assert.equal(new Set([...theory,...practical].map(s=>s.id)).size,385);
 for(const field of ['utilities','building','civil']){
  assert.deepEqual(m.sessionsForScope('1',field,'theory').map(s=>s.id),theory.map(s=>s.id));
  assert.equal(m.weeksForScope('1',field,'theory').length,23);
  for(const subject of ['theory','practical'])assert.equal(m.sessionsForScope('2',field,subject).length,0);
  if(field!=='utilities'){assert.equal(m.sessionsForScope('1',field,'practical').length,7);assert.equal(m.weeksForScope('1',field,'practical').length,1);assert.equal(m.reviewTestsForScope('1',field,'practical').length,1);assert.equal(m.reviewTestsForScope('1',field,'practical')[0].questionCount,7);}
 }
 assert.equal(m.weeksForScope('1','utilities','practical').length,32);
 assert.equal(m.sessionSubject({id:'unknown',sourceReferences:[{sourceId:'unknown'}]}),null);
 assert.equal(m.sessionSubject({id:'missing'}),null);
 const t=m.reviewTestsForScope('1','utilities','theory'),p=m.reviewTestsForScope('1','utilities','practical');
 assert.deepEqual(t.map(e=>e.questionCount),[40,40,40,40,5]);assert.deepEqual(p.map(e=>e.questionCount),[35,40,40,40,40,40]);
 const fieldTests=['building','civil'].flatMap(field=>m.reviewTestsForScope('1',field,'practical'));
 const all=[...m.reviewTests,...fieldTests].flatMap(e=>e.questions),byId=new Map(all.map(q=>[q.id,q]));
 assert.equal(new Set([...t,...p].flatMap(e=>e.questions.map(q=>q.id))).size,400);
 for(const field of ['building','civil'])assert.deepEqual(m.reviewTestsForScope('1',field,'theory'),t);
 for(const subject of ['theory','practical'])for(const field of ['utilities','building','civil'])assert.equal(m.reviewTestsForScope('2',field,subject).length,0);
 for(const exam of [...t,...p,...fieldTests]){
  assert.equal(exam.questions.length,exam.questionCount);assert.equal(exam.maxPoints,exam.questionCount);
  assert.equal(m.gradeTest(exam,exam.questions.map(q=>q.correctIndex)).correct,exam.questionCount);
  const saved={...m.freshTestAttempt(exam),currentQuestion:exam.questions.length-1};saved.answers[0]=exam.questions[0].correctIndex;
  assert.deepEqual(m.restoreTestAttempt(JSON.stringify(saved),exam),saved);
  for(const q of exam.questions){const original=byId.get(q.id);for(const key of ['promptJa','choicesJa','correctIndex','explanationJa','sourceReferences','distractorRationalesJa'])assert.deepEqual(q[key],original[key]);}
 }
 assert.equal(m.restoreTestAttempt(JSON.stringify(m.freshTestAttempt(m.reviewTests[4])),t[4]),null);
 assert.equal(m.restoreTestAttempt(JSON.stringify(m.freshTestAttempt(m.reviewTests[4])),p[0]),null);
 for(const exam of [...t,...p].filter(e=>!e.id.includes(':'))){const original=m.reviewTests.find(e=>e.id===exam.id);assert.deepEqual(m.restoreTestAttempt(JSON.stringify(m.freshTestAttempt(original)),exam),m.freshTestAttempt(original));}
 // Actual course and exam components; only native surfaces/artwork/storage adapted.
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;globalThis.__scopeStorage=new Map();globalThis.requestAnimationFrame=f=>{f();return 1};globalThis.cancelAnimationFrame=()=>{};
 const React=dep('react'),TR=dep('react-test-renderer');let renderer;const {act}=TR;
 const settle=async fn=>act(async()=>{if(fn)fn();await Promise.resolve();await Promise.resolve();});
 const host=(id,type='Pressable')=>renderer.root.findAll(n=>n.type===type&&n.props.testID===id);
 const click=async id=>{const n=host(id)[0];assert(n,'Missing control '+id);assert(!n.props.disabled,'Disabled '+id);await settle(()=>n.props.onPress());};
 const mount=async()=>settle(()=>{renderer=TR.create(React.createElement(m.KensetsuCourse,{learner:'scope-learner',language:'vi',onBack(){}}));});
 await mount();await click('kensetsu-level-2');assert.equal(host('kensetsu-level-2-pending','Text').length,1);assert.equal(host('kensetsu-field-utilities').length,0);await click('kensetsu-level-1');
 for(const field of ['building','civil']){
  await click('kensetsu-field-'+field);assert(!host('kensetsu-mode-practical-study')[0].props.disabled);assert(!host('kensetsu-mode-practical-tests')[0].props.disabled);
  await click('kensetsu-mode-theory-tests');assert.equal(renderer.root.findAll(n=>n.type==='Pressable'&&/^kensetsu-test-exam-/.test(n.props.testID||'')).length,5);
  await click('kensetsu-test-exam-05');assert.equal(host('kensetsu-test-question','Text').length,1);assert.equal(host('kensetsu-test-explanation','Text').length,0);
  await settle(()=>renderer.unmount());await mount();
 }
 let newParagraphsRendered=0;
 for(const field of ['building','civil']){
  for(let day=1;day<=7;day++){
   await click('kensetsu-field-'+field);await click('kensetsu-mode-practical-study');if(host('kensetsu-week-1').length)await click('kensetsu-week-1');await click('kensetsu-day-'+day);
   const lesson=m.sessionsForScope('1',field,'practical')[day-1];
   for(const cluster of lesson.clusters)for(const paragraph of cluster.paragraphs){assert(renderer.root.findAll(n=>n.type==='Text'&&n.children.includes(paragraph.ja)).length>0,paragraph.id);newParagraphsRendered++;}
   await settle(()=>renderer.unmount());await mount();
  }
  await click('kensetsu-field-'+field);await click('kensetsu-mode-practical-tests');await click('kensetsu-test-exam-01');assert.equal(host('kensetsu-test-explanation','Text').length,0);
  await click('kensetsu-test-choice-'+(m.reviewTestsForScope('1',field,'practical')[0].questions[0].correctIndex+1));
  await click('kensetsu-test-submit');await click('kensetsu-test-confirm-submit');assert.equal(host('kensetsu-test-result','View').length,1);
  await settle(()=>renderer.unmount());await mount();
 }
 assert.equal(newParagraphsRendered,84);
 await click('kensetsu-field-utilities');await click('kensetsu-mode-practical-study');assert.equal(host('kensetsu-group-4').length,1);await click('kensetsu-week-1');await click('kensetsu-day-162');assert.equal(host('kensetsu-complete')[0].props.disabled,true);
 const reader=host('kensetsu-reader','ScrollView')[0];await settle(()=>reader.props.onScroll({nativeEvent:{contentOffset:{y:2000},layoutMeasurement:{height:844},contentSize:{height:2200}}}));
 await click('kensetsu-complete');const key=m.completionKey('scope-learner','1','utilities');assert.equal(JSON.parse(globalThis.__scopeStorage.get(key))[m.completionId(practical[0])],true);
 await settle(()=>renderer.unmount());await mount();await click('kensetsu-field-utilities');await click('kensetsu-mode-theory-study');assert.equal(host('kensetsu-group-4').length,0);await click('kensetsu-week-1');assert.equal(host('kensetsu-day-162').length,0);await click('kensetsu-day-1');
 await settle(()=>host('kensetsu-reader','ScrollView')[0].props.onScroll({nativeEvent:{contentOffset:{y:2000},layoutMeasurement:{height:844},contentSize:{height:2200}}}));await click('kensetsu-complete');
 const saved=JSON.parse(globalThis.__scopeStorage.get(key));assert(saved[m.completionId(theory[0])]&&saved[m.completionId(practical[0])]);
 await settle(()=>renderer.unmount());
 const report={status:'PASS_1GO_SOURCE_SCOPE_AND_ACTUAL_HOST_FLOW',theory:{lessons:161,weeks:23,fields:['utilities','building','civil'],tests:t.map(e=>({id:e.id,questions:e.questionCount}))},utilitiesPractical:{lessons:224,weeks:32,tests:p.map(e=>({id:e.id,questions:e.questionCount}))},questionsPreserved:400,sourceQuestionAnswerAndRationaleUnchanged:true,fullFormAttemptsResume:true,splitFifthFormHasNewAttemptIds:true,twoGoDeferred:true,buildingCivilPracticalFirstWeekEach:7,newJapaneseParagraphsRendered:newParagraphsRendered,newFieldReviewQuestions:14,remainingFieldSourceContentPending:true,actualHostComponentFlow:true,completionAndSubjectNavigationIsolation:true,nativeDeviceTested:false,browserScreenshots:false,releaseReady:false};
 if(process.env.KENSETSU_SCOPE_QA_REPORT)fs.writeFileSync(process.env.KENSETSU_SCOPE_QA_REPORT,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exit(1)});
