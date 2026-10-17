// Exhaustive host checks for the additional utilities practical form; RN/storage adapters, not device certification.
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
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;globalThis.__scopeStorage=new Map();
 globalThis.requestAnimationFrame=f=>{f();return 1};globalThis.cancelAnimationFrame=()=>{};
 const React=dep('react'),TR=dep('react-test-renderer'),{act}=TR;let renderer;
 const settle=async fn=>act(async()=>{if(fn)fn();await Promise.resolve();await Promise.resolve();});
 const hosts=(id,type)=>renderer.root.findAll(n=>n.type===type&&n.props.testID===id);
 const click=async id=>{const node=hosts(id,'Pressable')[0];assert(node,'Missing '+id);assert(!node.props.disabled,'Disabled '+id);await settle(()=>node.props.onPress());};
 const textPresent=value=>renderer.root.findAll(n=>n.type==='Text'&&n.children.filter(x=>typeof x==='string').join('').includes(value)).length>0;
 const utilitiesBank=JSON.parse(fs.readFileSync(path.join(root,'src/data/kensetsu/utilities-review-tests.ja.json')));
 const oldBank=JSON.parse(fs.readFileSync(path.join(root,'src/data/kensetsu/review-tests.ja.json')));
 const deltaBank=JSON.parse(fs.readFileSync(path.join(root,'src/data/kensetsu/differential-review-tests.ja.json')));
 const allQuestions=[...oldBank.exams,...deltaBank.exams,...utilitiesBank.exams].flatMap(e=>e.questions);
 const norm=s=>s.normalize('NFKC').replace(/[\s。、！？「」]/gu,'');
 assert.equal(new Set(allQuestions.map(q=>norm(q.promptJa))).size,allQuestions.length);
 for(const exam of utilitiesBank.exams){
  assert.equal(exam.questions.length,exam.id==='kensetsu-utilities-completion-test-01'?5:40);
  for(const field of ['building','civil'])for(const subject of ['theory','practical'])assert(!m.reviewTestsForScope('1',field,subject).some(e=>e.id.startsWith(exam.id)),'Utilities scope leaked');
  for(const q of exam.questions){
   assert.equal(new Set(q.choicesJa.map(norm)).size,4);
   for(const ref of q.sourceReferences){const data=fs.readFileSync(path.join(root,ref.lessonFile));assert.equal(crypto.createHash('sha256').update(data).digest('hex'),ref.lessonSha256);const lesson=m.sessionById.get(ref.sessionId);assert(ref.paragraphIds.every(id=>lesson.clusters.some(c=>c.paragraphs.some(p=>p.id===id))));}
  }
 }
 const originalMixed=oldBank.exams.find(e=>e.id==='kensetsu-review-v2-05');
 const legacy={...originalMixed,id:originalMixed.id+':practical:scope-v1',revision:originalMixed.revision+':practical:scope-v1',questions:originalMixed.questions.filter(q=>q.sourceReferences.every(ref=>m.isSessionInScope(m.sessionById.get(ref.sessionId),'1','utilities','practical')))};
 assert.equal(legacy.questions.length,35);
 const legacyAttempt=m.freshTestAttempt(legacy);legacyAttempt.answers[0]=legacy.questions[0].correctIndex;legacyAttempt.currentQuestion=17;legacyAttempt.submitted=true;
 const legacyRaw=JSON.stringify(legacyAttempt),legacyKey=m.testStorageKey('full-utilities-correct','1','utilities',legacy.id);globalThis.__scopeStorage.set(legacyKey,legacyRaw);
 const completed=m.reviewTestsForScope('1','utilities','practical').find(e=>e.id==='kensetsu-utilities-complete-test-01');
 assert(completed);assert.deepEqual(completed.questions.slice(0,35).map(q=>q.id),legacy.questions.map(q=>q.id));assert.equal(m.restoreTestAttempt(legacyRaw,completed),null);
 let catalogTitlesChecked=0;
 for(const field of ['utilities','building','civil'])for(const subject of ['theory','practical']){
  const tests=m.reviewTestsForScope('1',field,subject);
  assert.equal(new Set(tests.map(e=>e.titleJa)).size,tests.length,'Repeated scoped exam title');
  tests.forEach((exam,index)=>{assert.equal(exam.titleJa,`建設1号 ${subject==='theory'?'学科':'実技'} 確認テスト 第${index+1}回`);catalogTitlesChecked++;});
 }
 let choicesChecked=0,resumesChecked=0;const cases=[];
 for(const field of ['utilities']){
  const tests=m.reviewTestsForScope('1',field,'practical');
  const forms=tests;
  assert.equal(forms.length,10,'Utilities requires ten full forms');
  const pooled=forms.flatMap(e=>e.questions);assert.equal(pooled.length,400);assert.equal(new Set(pooled.map(q=>q.id)).size,400);
  for(const exam of forms){const positions=exam.questions.map(q=>q.correctIndex);for(let i=0;i<4;i++)assert.equal(positions.filter(p=>p===i).length,10);for(let i=2;i<positions.length;i++)assert(!(positions[i]===positions[i-1]&&positions[i]===positions[i-2]));}

  for(const exam of forms){
   assert.equal(exam.questionCount,40);assert.equal(new Set(exam.questions.map(q=>q.id)).size,40);
   const index=tests.findIndex(e=>e.id===exam.id);
   for(const mode of ['correct','wrong','mixed']){
    const learner='full-utilities-'+mode,storageKey=m.testStorageKey(learner,'1',field,exam.id);
    const expected=m.freshTestAttempt(exam);
    const mount=async()=>{await settle(()=>{renderer=TR.create(React.createElement(m.KensetsuReviewTests,{learner,level:'1',field,subject:'practical',onBack(){}}));});await click('kensetsu-test-exam-'+String(index+1).padStart(2,'0'));};
    const unmount=()=>settle(()=>renderer.unmount());
    await mount();
    for(let i=0;i<40;i++){
     const q=exam.questions[i];assert(textPresent(q.promptJa),exam.id+':'+i);
     assert.equal(hosts('kensetsu-test-explanation','View').length,0,'Answer leaked before submit');
     for(let j=0;j<4;j++){const choice=hosts('kensetsu-test-choice-'+(j+1),'Pressable')[0];assert(choice);assert(choice.findAll(n=>n.type==='Text'&&n.children.includes(q.choicesJa[j])).length>0);choicesChecked++;}
     const answer=mode==='correct'?q.correctIndex:mode==='wrong'?(q.correctIndex+1)%4:i%4===0?null:i%4===1?(q.correctIndex+1)%4:q.correctIndex;
     if(answer!==null)await click('kensetsu-test-choice-'+(answer+1));expected.answers[i]=answer;expected.currentQuestion=i;
     if(i===13||i===27){
      const stored=m.restoreTestAttempt(globalThis.__scopeStorage.get(storageKey),exam);assert.deepEqual(stored,expected);
      await unmount();await mount();assert(textPresent(q.promptJa));assert.deepEqual(m.restoreTestAttempt(globalThis.__scopeStorage.get(storageKey),exam),expected);resumesChecked++;
     }
     if(i<39)await click('kensetsu-test-next');
    }
    await click('kensetsu-test-submit');assert.equal(hosts('kensetsu-test-result','View').length,0);
    await click('kensetsu-test-confirm-submit');expected.submitted=true;
    const expectedGrade=mode==='correct'?{correct:40,wrong:0,unanswered:0,total:40}:mode==='wrong'?{correct:0,wrong:40,unanswered:0,total:40}:{correct:20,wrong:10,unanswered:10,total:40};
    const saved=m.restoreTestAttempt(globalThis.__scopeStorage.get(storageKey),exam);assert.deepEqual(saved,expected);assert.deepEqual(m.gradeTest(exam,saved.answers),expectedGrade);
    assert(textPresent('結果 · '+expectedGrade.correct+'/40'));
    assert(hosts('kensetsu-test-explanation','View').length>0);
    assert(hosts('kensetsu-test-choice-1','Pressable')[0].props.disabled);
    await unmount();await mount();assert(textPresent('結果 · '+expectedGrade.correct+'/40'));assert.deepEqual(m.restoreTestAttempt(globalThis.__scopeStorage.get(storageKey),exam),expected);
    cases.push({field,examId:exam.id,mode,...expectedGrade});await unmount();
   }
  }
 }
 assert.equal(globalThis.__scopeStorage.get(legacyKey),legacyRaw,'Legacy 35-question attempt overwritten');
 const report={legacy35QuestionAttemptPreserved:true,tenFullUtilitiesForms:true,utilitiesQuestionPool:400,status:'PASS_FULL_UTILITIES_HOST_ATTEMPTS',differentialBankSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'src/data/kensetsu/utilities-review-tests.ja.json'))).digest('hex'),cases,catalogTitlesChecked,choicesChecked,resumesChecked,preSubmitAnswersHidden:true,submittedChoicesLocked:true,exactQuestionAndAnswerResume:true,submittedReloadPreserved:true,adapters:['React Native host components','in-memory AsyncStorage','artwork','safe area'],browserScreenshots:false,nativeDeviceTested:false,domainReviewed:false,releaseReady:false};
 if(process.env.KENSETSU_FULL_UTILITIES_REPORT)fs.writeFileSync(process.env.KENSETSU_FULL_UTILITIES_REPORT,JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({status:report.status,attempts:cases.length,catalogTitlesChecked,choicesChecked,resumesChecked}));
})().catch(e=>{console.error(e);process.exit(1)});
