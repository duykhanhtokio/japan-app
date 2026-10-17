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
 const policy=JSON.parse(fs.readFileSync(path.join(root,'src/data/kensetsu/reuse-policy.json')));
 let differentialPngFilesVerified=0;
 for(const view of policy.deltaViews){
  const key=(view.sessionId.includes('-building-')?'b':'c')+Number(view.sessionId.split('-').pop());
  const file=path.join(root,'assets/kensetsu/differential',key+'.png'),bytes=fs.readFileSync(file);
  assert(bytes.length>64,'Empty/truncated diagram: '+key);
  assert(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'Invalid PNG: '+key);
  assert.equal(bytes.toString('ascii',12,16),'IHDR');assert.equal(bytes.readUInt32BE(16),1200);assert.equal(bytes.readUInt32BE(20),650);
  assert.equal(bytes.toString('ascii',bytes.length-8,bytes.length-4),'IEND','Truncated PNG: '+key);differentialPngFilesVerified++;
 }
 assert.equal(differentialPngFilesVerified,42);
 const canonical=JSON.parse(fs.readFileSync(path.join(root,'src/data/kensetsu/review-tests.ja.json')));
 const differential=JSON.parse(fs.readFileSync(path.join(root,'src/data/kensetsu/differential-review-tests.ja.json')));
 const utilities=JSON.parse(fs.readFileSync(path.join(root,'src/data/kensetsu/utilities-review-tests.ja.json')));
 const theoryCompletion=JSON.parse(fs.readFileSync(path.join(root,'src/data/kensetsu/theory-review-tests.ja.json')));
 const originalQuestions=new Map([...canonical.exams,...differential.exams,...utilities.exams,...theoryCompletion.exams].flatMap(e=>e.questions).map(q=>[q.id,q]));
 const sharedSets={};
 for(const field of ['utilities','building','civil']){
  const theory=m.sessionsForScope('1',field,'theory');assert.equal(theory.length,161);
  const practical=m.sessionsForScope('1',field,'practical');assert.equal(practical.length,field==='utilities'?224:field==='building'?140:128);
  assert.equal(new Set(practical.map(s=>s.id)).size,practical.length);
  if(field!=='utilities'){
   const assigned=policy.canonicalPracticalAssignments[field];assert.equal(assigned.length,field==='building'?108:104);
   for(const id of assigned){const lesson=practical.find(s=>s.id===id);assert.strictEqual(lesson,m.sessionById.get(id));}
   assert(!practical.some(s=>s.id==='kensetsu-common-session-169')); // utilities electrical detail
   assert(!practical.some(s=>s.id==='kensetsu-common-session-309')); // utilities pipe detail
   sharedSets[field]=practical.filter(s=>assigned.includes(s.id)).map(s=>s.id);
  }
  for(const subject of ['theory','practical']){assert.equal(m.sessionsForScope('2',field,subject).length,0);assert.equal(m.reviewTestsForScope('2',field,subject).length,0);}
 }
 assert.equal(m.sessions.length,427);
 assert(!m.sessionsForScope('1','civil','practical').some(s=>s.id==='kensetsu-building-practical-session-012'),'Carpentry scope leaked into civil');
 for(const n of [13,14,16,17,18,19,20,21,22,26,27,28,29,30,31,32,34])assert(!m.sessionsForScope('1','civil','practical').some(s=>s.id==='kensetsu-building-practical-session-'+String(n).padStart(3,'0')),'Finishes scope leaked into civil');
 assert(!m.sessionsForScope('1','building','practical').some(s=>s.id==='kensetsu-civil-practical-session-008'),'Landscaping scope leaked into building');
 for(const field of ['building','civil']){
  const last=m.reviewTestsForScope('1',field,'practical').at(-1),pos=last.questions.map(q=>q.correctIndex),counts=[0,1,2,3].map(x=>pos.filter(p=>p===x).length);
  assert.equal(last.questions.length,field==='building'?4:3);assert(Math.max(...counts)-Math.min(...counts)<=1);for(let i=2;i<pos.length;i++)assert(!(pos[i]===pos[i-1]&&pos[i]===pos[i-2]));
 }
 // Source6k23–24 supports these four original sheet-metal lessons only.
 for(const n of [337,338,339,340])assert(m.sessionsForScope('1','building','practical').some(s=>s.id==='kensetsu-common-session-'+n));
 assert(!m.sessionsForScope('1','civil','practical').some(s=>s.id==='kensetsu-common-session-337'));
 assert(!m.sessionsForScope('1','building','practical').some(s=>s.id==='kensetsu-common-session-341'));
 for(const n of [9,10,11,12,13])assert(!m.sessionsForScope('1','building','practical').some(s=>s.id==='kensetsu-civil-practical-session-'+String(n).padStart(3,'0')),'Civil method leaked');
 const scopeRows=[];
 for(const field of ['utilities','building','civil'])for(const subject of ['theory','practical']){
  const tests=m.reviewTestsForScope('1',field,subject),questions=tests.flatMap(e=>e.questions);
  assert(questions.length>0);assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
  for(const exam of tests){
   assert.equal(exam.questionCount,exam.questions.length);assert.equal(exam.maxPoints,exam.questions.length);
   assert.equal(m.gradeTest(exam,exam.questions.map(q=>q.correctIndex)).correct,exam.questions.length);
   assert.deepEqual(m.restoreTestAttempt(JSON.stringify(m.freshTestAttempt(exam)),exam),m.freshTestAttempt(exam));
   for(const q of exam.questions){
    const original=originalQuestions.get(q.id);assert(original,'New duplicated field question exposed: '+q.id);
    for(const key of ['promptJa','choicesJa','correctIndex','explanationJa','sourceReferences','distractorRationalesJa'])assert.deepEqual(q[key],original[key]);
    assert(q.sourceReferences.every(r=>{const s=m.sessionById.get(r.sessionId);return s&&(m.isSessionInScope(s,'1',field,subject)||(subject==='practical'&&m.isSessionInScope(s,'1',field,'theory')));}));
   }
  }
  scopeRows.push({field,subject,tests:tests.length,questions:questions.length});
 }
 const t=m.reviewTestsForScope('1','utilities','theory'),p=m.reviewTestsForScope('1','utilities','practical');
 assert.equal(t.reduce((n,e)=>n+e.questionCount,0),400);assert.equal(p.reduce((n,e)=>n+e.questionCount,0),400);
 assert.equal(m.restoreTestAttempt(JSON.stringify(m.freshTestAttempt(m.reviewTests[4])),t[4]),null);
 for(const exam of [...t,...p].filter(e=>!e.id.includes(':')&&m.reviewTests.some(original=>original.id===e.id))){const old=m.reviewTests.find(e=>e.id===exam.id);assert.deepEqual(m.restoreTestAttempt(JSON.stringify(m.freshTestAttempt(old)),exam),m.freshTestAttempt(old));}
 for(const id of policy.retiredSessionIds){assert(!m.sessions.some(s=>s.id===id));assert(m.restoreProgress(JSON.stringify({[id+':r1']:true}))[id+':r1']);}
 assert(!m.restoreProgress(JSON.stringify({[policy.retiredSessionIds[0]+':r1']:true}))['kensetsu-common-session-166:r1']);
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;globalThis.__scopeStorage=new Map();globalThis.requestAnimationFrame=f=>{f();return 1};globalThis.cancelAnimationFrame=()=>{};
 const React=dep('react'),TR=dep('react-test-renderer');let renderer;const {act}=TR;
 const settle=async fn=>act(async()=>{if(fn)fn();await Promise.resolve();await Promise.resolve();});
 const host=(id,type='Pressable')=>renderer.root.findAll(n=>n.type===type&&n.props.testID===id);
 const click=async id=>{const n=host(id)[0];assert(n,'Missing '+id);assert(!n.props.disabled,'Disabled '+id);await settle(()=>n.props.onPress());};
 const mount=async(language="vi")=>settle(()=>{renderer=TR.create(React.createElement(m.KensetsuCourse,{learner:'reuse-learner',language,onBack(){}}));});
 const unmount=async()=>settle(()=>renderer.unmount());
 await mount();await click('kensetsu-level-2');assert.equal(host('kensetsu-level-2-pending','Text').length,1);assert.equal(host('kensetsu-field-building').length,0);await unmount();
 let deltaParagraphsRendered=0,excludedParagraphsAbsent=0;
 for(const view of policy.deltaViews)for(const field of ['building','civil'].filter(field=>m.isSessionInScope(m.sessionById.get(view.sessionId),'1',field,'practical'))){
  const key=m.completionKey('reuse-learner','1',field);
  // An old calendar index must not restore the wrong week after sharing changes the list.
  globalThis.__scopeStorage.set(key+':navigation:practical:v2',JSON.stringify({week:0,lastId:view.sessionId,view:'days',offset:0}));
  await mount();await click('kensetsu-field-'+field);await click('kensetsu-mode-practical-study');await click('kensetsu-day-'+Number(view.sessionId.split('-').pop()));
  const original=JSON.parse(fs.readFileSync(path.join(root,'docs/ssw-workspace/kensetsu',view.sessionId.includes('-building-')?'building':'civil','practical','session-'+view.sessionId.split('-').pop()+'.json')));
  for(const cluster of original.clusters)for(const paragraph of cluster.paragraphs){
   const found=renderer.root.findAll(n=>n.type==='Text'&&n.children.includes(paragraph.ja)).length>0;
   if(view.activeParagraphIds.includes(paragraph.id)){assert(found,paragraph.id);deltaParagraphsRendered++;}
   else{assert(!found,'Repeated prose visible: '+paragraph.id);excludedParagraphsAbsent++;}
  }
  await unmount();
 }
 assert.equal(deltaParagraphsRendered,140);assert.equal(excludedParagraphsAbsent,60);
 for(const field of ['building','civil']){
  const key=m.completionKey('reuse-learner','1',field),retired=policy.retiredSessionIds.find(id=>id.includes('-'+field+'-'))+':r1';
  globalThis.__scopeStorage.set(key,JSON.stringify({[retired]:true}));globalThis.__scopeStorage.delete(key+':navigation:practical:v2');
  await mount();await click('kensetsu-field-'+field);await click('kensetsu-mode-practical-study');await click('kensetsu-week-1');await click('kensetsu-day-162');
  const lesson=m.sessionById.get('kensetsu-common-session-162');assert(renderer.root.findAll(n=>n.type==='Text'&&n.children.includes(lesson.clusters[0].paragraphs[0].ja)).length>0);
  assert(host('kensetsu-complete')[0].props.disabled);
  await settle(()=>host('kensetsu-reader','ScrollView')[0].props.onScroll({nativeEvent:{contentOffset:{y:2000},layoutMeasurement:{height:844},contentSize:{height:2200}}}));await click('kensetsu-complete');
  const saved=JSON.parse(globalThis.__scopeStorage.get(key));assert(saved[retired]&&saved[m.completionId(lesson)]);await unmount();
  await mount();await click('kensetsu-field-'+field);await click('kensetsu-mode-practical-tests');
  const exam=m.reviewTestsForScope('1',field,'practical')[0];await click('kensetsu-test-exam-01');assert.equal(host('kensetsu-test-explanation','Text').length,0);
  await click('kensetsu-test-choice-'+(exam.questions[0].correctIndex+1));await click('kensetsu-test-submit');await click('kensetsu-test-confirm-submit');assert.equal(host('kensetsu-test-result','View').length,1);await unmount();
 }
 for(const field of ['building','civil']){
  const scoped=m.reviewTestsForScope('1',field,'practical'),exam=scoped.at(-1);assert(exam.id.startsWith('kensetsu-delta-test-16'));
  await mount();await click('kensetsu-field-'+field);await click('kensetsu-mode-practical-tests');await click('kensetsu-test-exam-'+String(scoped.length).padStart(2,'0'));
  assert(renderer.root.findAll(n=>n.type==='Text'&&n.children.includes(exam.questions[0].promptJa)).length>0);
  assert.equal(host('kensetsu-test-explanation','Text').length,0);
  await click('kensetsu-test-choice-'+(exam.questions[0].correctIndex+1));await click('kensetsu-test-submit');await click('kensetsu-test-confirm-submit');
  assert.equal(host('kensetsu-test-result','View').length,1);await unmount();
 }
 const theoryExtras=[...differential.exams,...theoryCompletion.exams].filter(e=>e.id.startsWith('kensetsu-theory-extra-test-'));assert.equal(theoryExtras.length,5);
 let theory40QuestionHostSubmissions=0;
 for(const theoryExtra of theoryExtras){
  assert.equal(theoryExtra.questions.length,40);const theoryPositions=theoryExtra.questions.map(q=>q.correctIndex);
  for(let p=0;p<4;p++)assert.equal(theoryPositions.filter(x=>x===p).length,10);
  for(let i=2;i<theoryPositions.length;i++)assert(!(theoryPositions[i]===theoryPositions[i-1]&&theoryPositions[i]===theoryPositions[i-2]));
  for(const field of ['utilities','building','civil']){
   const tests=m.reviewTestsForScope('1',field,'theory'),index=tests.findIndex(e=>e.id===theoryExtra.id),exam=tests[index];assert(index>=0);assert.equal(exam.questionCount,40);
   assert.deepEqual(exam.questions,theoryExtra.questions);
   await mount();await click('kensetsu-field-'+field);await click('kensetsu-mode-theory-tests');await click('kensetsu-test-exam-'+String(index+1).padStart(2,'0'));
   assert(renderer.root.findAll(n=>n.type==='Text'&&n.children.includes(exam.questions[0].promptJa)).length>0);
   assert.equal(host('kensetsu-test-explanation','Text').length,0);
   await click('kensetsu-test-choice-'+(exam.questions[0].correctIndex+1));await click('kensetsu-test-submit');await click('kensetsu-test-confirm-submit');
   assert.equal(host('kensetsu-test-result','View').length,1);theory40QuestionHostSubmissions++;await unmount();
  }
 }
 assert.equal(theory40QuestionHostSubmissions,15);
 const allQuestions=[...canonical.exams,...differential.exams,...utilities.exams,...theoryCompletion.exams].flatMap(e=>e.questions);
 const norm=text=>text.normalize('NFKC').replace(/[\s。、！？「」]/gu,'');
 assert.equal(new Set(allQuestions.map(q=>norm(q.promptJa))).size,allQuestions.length,'Duplicate normalized prompt');
 for(const q of [...differential.exams,...utilities.exams,...theoryCompletion.exams].flatMap(e=>e.questions)){
  assert.equal(q.choicesJa.length,4);assert.equal(new Set(q.choicesJa.map(norm)).size,4);assert(q.correctIndex>=0&&q.correctIndex<4);
  for(const ref of q.sourceReferences){const bytes=fs.readFileSync(path.join(root,ref.lessonFile));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),ref.lessonSha256);const lesson=m.sessionById.get(ref.sessionId);assert(ref.paragraphIds.every(id=>lesson.clusters.some(c=>c.paragraphs.some(p=>p.id===id))));}
 }
 const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
 let localeParagraphRenderChecks=0;
 for(const view of policy.deltaViews){
  const lesson=m.sessionById.get(view.sessionId),field=view.sessionId.includes('-building-')?'building':'civil';
  for(const locale of locales){
   assert(lesson.titleTranslations?.[locale]);
   for(const c of lesson.clusters){assert(c.titleTranslations?.[locale]);assert(c.illustration?.captionTranslations?.[locale]);assert(m.illustrations[c.illustration.assetPath]);for(const term of c.terms??[])assert(term.translations?.[locale],term.ja+':'+locale);}
   globalThis.__scopeStorage.set(m.completionKey('reuse-learner','1',field)+':navigation:practical:v2',JSON.stringify({week:0,lastId:view.sessionId,view:'days',offset:0}));
   await mount(locale);await click('kensetsu-field-'+field);await click('kensetsu-mode-practical-study');await click('kensetsu-day-'+Number(view.sessionId.split('-').pop()));
   await click('kensetsu-translation');
   for(const c of lesson.clusters)for(const paragraph of c.paragraphs){
    const expected=paragraph.translations?.[locale];assert(expected&&expected!==paragraph.ja,paragraph.id+':'+locale);
    const nodes=host('kensetsu-translation-'+paragraph.id,'Text');assert(nodes.some(n=>n.children.includes(expected)),paragraph.id+':'+locale);localeParagraphRenderChecks++;
   }
   assert(host('kensetsu-study-image').length>0);await unmount();
  }
 }
 assert.equal(localeParagraphRenderChecks,1248);
 const hashes=JSON.parse(fs.readFileSync(path.join(root,'docs/ssw-workspace/kensetsu/PRACTICAL_REUSE_PRESERVED_INPUTS_2026-10-17.json')));
 for(const [file,hash]of Object.entries(hashes))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex'),hash,file);
 const report={status:'PASS_SOURCE_BOUND_REUSE_DEDUP_AND_ACTUAL_HOST_FLOW',sharedCanonicalLessonsPerField:{building:108,civil:104},distinctCanonicalLessonsReused:109,activeCanonicalAndDeltaRecords:427,additionalFactViews:42,uniqueAdditionalParagraphs:104,additionalParagraphRenderChecks:deltaParagraphsRendered,excludedParagraphChecks:excludedParagraphsAbsent,sharedAdditionalFactViewsLinkedIntoCivil:14,duplicateParagraphsRemovedFromNineUniqueViews:38,fullyRetiredDraftLessons:5,retiredDraftParagraphs:30,totalPriorDraftParagraphsRemovedFromActiveReader:68,scopedQuestions:scopeRows,targetLocales:locales,localeParagraphRenderChecks,additionalDiagrams:42,differentialPngFilesVerified,newInstructionalParagraphsAuthored:0,newQuestionsAuthored:115,originalLessonTranslationAndQuestionInputsBytePreserved:Object.keys(hashes).length,canonicalLessonTranslationsAndArtworkReusedByReference:true,archivedDraftCompletionPreservedWithoutMarkingReplacementLessons:true,navigationRestoredByStableLessonId:true,utilitiesSpecificSourceLessonsNotInOtherFields:true,twoGoDeferred:true,actualHostComponentFlow:true,newSupplementaryTestHostSubmissionFields:2,newTheory40QuestionHostSubmissionFields:3,theory40QuestionHostSubmissions,fullAdditionalTheoryForms:5,additionalTheoryQuestions:235,additionalPracticalQuestions:104,additionalUtilitiesQuestions:165,nativeDeviceTested:false,browserScreenshots:false,wholeSourceCoverageConfirmed:false,releaseReady:false};
 if(process.env.KENSETSU_SCOPE_QA_REPORT)fs.writeFileSync(process.env.KENSETSU_SCOPE_QA_REPORT,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exit(1)});
