// Run the real adapters against committed JSON and current JSON to check saved-attempt boundaries.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),modules=process.env.TOKUTEI_QA_MODULES||root;
const dep=n=>require(require.resolve(n,{paths:[modules]})),React=dep('react'),{create,act}=dep('react-test-renderer');
global.IS_REACT_ACT_ENVIRONMENT=true;global.__tokuteiStorage=new Map();global.__tokuteiFailSave=false;global.__tokuteiLanguage='vi';global.requestAnimationFrame=fn=>setTimeout(fn,0);global.cancelAnimationFrame=clearTimeout;
const nodes=(t,id)=>t.root.findAll(n=>typeof n.type==='string'&&n.props.testID===id);
const get=(t,id)=>{const ns=nodes(t,id);assert.equal(ns.length,1,id);return ns[0];};
const click=async(t,id)=>act(async()=>{const n=get(t,id);assert(!n.props.disabled);n.props.onPress();await new Promise(setImmediate);});
const mount=async m=>{let t;await act(async()=>{t=create(React.createElement(m.KaigoCourse,{active:false,onBack(){}}));await new Promise(setImmediate);});return t;};
(async()=>{
 const res=JSON.parse(fs.readFileSync(path.join(root,'docs/ssw-workspace/kaigo/reviews/JAPANESE_ASSESSMENT_RESOLUTION.json'),'utf8'));
 const baseline=res.baselineCommit,snapshots=new Map();
 const paths=execFileSync('git',['ls-tree','-r','--name-only',baseline,'src/data/kaigo'],{cwd:root,encoding:'utf8'}).trim().split('\n').filter(p=>p.endsWith('.json'));
 for(const p of paths)snapshots.set(path.resolve(root,p),execFileSync('git',['show',`${baseline}:${p}`],{cwd:root,encoding:'utf8',maxBuffer:16e6}));
 const wire=v=>JSON.parse(JSON.stringify(v));
 const compile=require('./tokutei-ui-qa/compile.cjs'),prior=await compile(root,modules,snapshots),m=await compile(root,modules);
 if(process.env.KAIGO_ASSESSMENT_CAPTURE){const capture=JSON.parse(fs.readFileSync(process.env.KAIGO_ASSESSMENT_CAPTURE,'utf8'));assert.equal(capture.commit,baseline);for(const w of capture.weekly){assert.equal(prior.japaneseAssessmentRevisionForWeek(w.week),w.revision,'Committed adapter matches pre-edit execution');assert.deepEqual(wire(prior.japaneseQuestionsForWeek(w.week)),w.questions);}for(const f of capture.mocks)assert.deepEqual(wire(prior.withJapaneseMockReview(prior.kaigoCourse.mocks.find(x=>x.id===f.sourceId))),f.effective);}
 const changedWeeks=new Set(res.patches.filter(p=>p.targetType==='weekly').map(p=>p.week));const revisedQuestions=new Set(res.patches.filter(p=>p.targetType==='weekly').map(p=>p.questionId));let weeklyChanged=0;const weekly=[];
 for(let week=1;week<=26;week++){
  const old=prior.japaneseQuestionsForWeek(week),now=m.japaneseQuestionsForWeek(week);assert.deepEqual(now.map(q=>q.id),old.map(q=>q.id));const oldRevision=prior.japaneseAssessmentRevisionForWeek(week),revision=m.japaneseAssessmentRevisionForWeek(week);
  assert.equal(oldRevision!==revision,changedWeeks.has(week),'Only edited weeks get a new Japanese attempt revision');
  for(let i=0;i<old.length;i++){assert.equal(now[i].correctIndex,old[i].correctIndex);if(revisedQuestions.has(now[i].id)){assert.notDeepEqual(now[i],old[i]);weeklyChanged++;}else assert.deepEqual(now[i],old[i]);}
  weekly.push({week,oldRevision,revision,changed:oldRevision!==revision});
  if(!changedWeeks.has(week))continue;
  global.__tokuteiStorage.clear();const oldKey=`@japan_app_kaigo_weekly:assessment:${oldRevision}:${week}`,key=`@japan_app_kaigo_weekly:assessment:${revision}:${week}`;
  const oldValue=JSON.stringify({answers:{[old[0].id]:old[0].correctIndex},submitted:false});global.__tokuteiStorage.set(oldKey,oldValue);
  const t=await mount(m);await click(t,'kaigo-week-'+week);await click(t,'kaigo-assessment-open-'+week);for(let i=0;i<4;i++)assert(!get(t,'kaigo-weekly-option-'+i).props.accessibilityState.checked,'Old Japanese answers must not attach to edited wording');
  await click(t,'kaigo-weekly-option-'+now[0].correctIndex);assert(global.__tokuteiStorage.has(key));assert.equal(global.__tokuteiStorage.get(oldKey),oldValue,'Old Japanese attempt remains intact');await act(async()=>t.unmount());
 }
 assert.equal(weeklyChanged,res.counts.weeklyQuestionsRevised);
 const changedCore=new Set(res.corePatches.map(p=>p.formId));const mockEditedIds=new Set([...res.patches.filter(p=>p.targetType==='mock'),...res.corePatches].map(p=>p.questionId));let mockChanged=0,mockQuestionsRevised=0;const mocks=[];
 for(const source of m.kaigoCourse.mocks){const old=prior.withJapaneseMockReview(prior.kaigoCourse.mocks.find(f=>f.id===source.id)),now=m.withJapaneseMockReview(source);assert(old.japaneseReviewApplied&&now.japaneseReviewApplied);const oldKey=prior.examStorageKey(old),key=m.examStorageKey(now);assert.equal(oldKey!==key,changedCore.has(source.id),'Rationale-only fixes keep the existing Japanese attempt key');
  assert.equal(now.durationMs,old.durationMs);assert.deepEqual(now.questions.map(q=>q.id),old.questions.map(q=>q.id));for(let i=0;i<old.questions.length;i++){assert.equal(now.questions[i].correctIndex,old.questions[i].correctIndex);if(mockEditedIds.has(now.questions[i].id)){assert.notDeepEqual(now.questions[i],old.questions[i],'Approved mock repair must reach effective runtime data');mockQuestionsRevised++;}else assert.deepEqual(now.questions[i],old.questions[i],'Unrecorded effective mock change');}if(oldKey!==key)mockChanged++;
  global.__tokuteiStorage.clear();const session=prior.createExamSession(old);session.currentQuestion=2;session.remainingMs=old.durationMs-9000;session.answers[old.questions[2].id]=old.questions[2].correctIndex;const saved=JSON.stringify(session);global.__tokuteiStorage.set(oldKey,saved);
  const t=await mount(m);await click(t,'kaigo-weekly-tab-mocks');await click(t,'kaigo-mock-'+source.id);
  if(oldKey===key)assert(get(t,'kaigo-option-'+old.questions[2].correctIndex).props.accessibilityState.checked,'Existing Japanese mock answer resumes');else{for(let i=0;i<4;i++)assert(!get(t,'kaigo-option-'+i).props.accessibilityState.checked);assert.equal(global.__tokuteiStorage.get(oldKey),saved);}
  await act(async()=>t.unmount());mocks.push({formId:source.id,oldKey,key,changed:oldKey!==key});
 }
 let staleTranslationsRejected=0;for(const p of res.masterPatches)for(const locale of ['vi','en'])if(prior.translationForMaster(p.sectionId,locale)){assert.equal(m.translationForMaster(p.sectionId,locale),undefined,'Edited Japanese paragraph rejects old translation');staleTranslationsRejected++;}
 assert.equal(mockChanged,changedCore.size);assert.equal(mockQuestionsRevised,mockEditedIds.size);
 const result={status:'PASS_COMMITTED_JAPANESE_ATTEMPT_REVISION_BOUNDARIES',baselineCommit:baseline,committedJsonSnapshots:paths.length,weeklyQuestionsCompared:687,weeklyQuestionObjectsRevised:weeklyChanged,weeklyRevisionsChanged:changedWeeks.size,weeklyRevisionsUnchanged:26-changedWeeks.size,oldJapaneseWeeklyAttemptsPreserved:true,fullMocksCompared:mocks.length,effectiveMockQuestionsRevised:mockQuestionsRevised,newJapaneseMockAttemptKeys:mockChanged,existingJapaneseMockAttemptKeysPreserved:mocks.length-mockChanged,allAnswerIndicesPreserved:true,staleTranslationBindingsRejected:staleTranslationsRejected,preEditExecutionCaptureMatched:Boolean(process.env.KAIGO_ASSESSMENT_CAPTURE),weekly,mocks,nativeDeviceTested:false,humanReviewed:false,domainReviewed:false,nativeReviewed:false,releaseReady:false};
 if(process.env.KAIGO_ASSESSMENT_REVISION_REPORT)fs.writeFileSync(path.resolve(root,process.env.KAIGO_ASSESSMENT_REVISION_REPORT),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,weekly:undefined,mocks:undefined}));
})().catch(e=>{console.error(e.code??'ERROR',String(e.message).slice(0,2200));console.error(e.stack?.split('\n').filter(s=>s.trim().startsWith('at ')).slice(0,3).join('\n'));process.exit(1);});
