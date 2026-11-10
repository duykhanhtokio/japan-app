const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {componentHarness}=require('./runtime-harness.cjs');
global.IS_REACT_ACT_ENVIRONMENT=true;
const React=require('react'),TR=require('react-test-renderer');
const warnings=[],originalError=console.error;console.error=(...args)=>{if(args[0]?.toString().includes('react-test-renderer is deprecated'))return;warnings.push(args.map(String).join(' '));originalError(...args)};
const text=renderer=>JSON.stringify(renderer.toJSON());
async function flush(fn){await TR.act(async()=>{if(fn)await fn();await new Promise(r=>setImmediate(r));});}
async function mount(element){let renderer;await flush(()=>{renderer=TR.create(element)});return renderer;}
async function unmount(renderer){await flush(()=>renderer.unmount());}
function button(renderer,label){const matches=renderer.root.findAll(n=>n.type==='Pressable'&&n.props.accessibilityLabel===label);assert.equal(matches.length,1,'Unique visible button '+label);return matches[0];}
async function press(renderer,label){const b=button(renderer,label);assert(!b.props.disabled,'Unexpected disabled button '+label);await flush(()=>b.props.onPress());}
function testId(renderer,id){return renderer.root.findAll(n=>typeof n.type==='string'&&n.props.testID===id);}
(async()=>{
 const{api,stores,failures,scope}=await componentHarness(),locales=['ja','vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];const weekly=[],mock=[];
 for(const specialty of ['mechanical','electrical','surface'])for(const locale of locales){
  const learner=`qa40-${specialty}-${locale}`,u=k=>api.manufacturingUi(locale,k),course=api.loadManufacturingCourse(specialty),exam=course.checks[0],key=api.manufacturingExamKey(learner,specialty,exam.id);
  const element=()=>React.createElement(api.__qaLocaleContext.Provider,{value:locale},React.createElement(api.__qaAttempt,{learner,specialty,exam,onBack(){}}));
  let r=await mount(element());const first=exam.questions[0];
  for(const why of first.optionReasonsJa.filter(x=>x.length>12))assert(!text(r).includes(why),'Rationale shown before submit');
  await press(r,`${first.correctIndex+1}. ${first.optionsJa[first.correctIndex]}`);await press(r,u('next'));const second=exam.questions[1];
  assert.equal(JSON.parse(stores.get(key)).currentQuestion,1);assert.equal(JSON.parse(stores.get(key)).answers[0],first.correctIndex);
  await unmount(r);r=await mount(element());assert(text(r).includes(second.stemJa),'Reopened weekly position not restored');
  failures.write=true;await press(r,`${second.correctIndex+1}. ${second.optionsJa[second.correctIndex]}`);assert(text(r).includes(u('answerSaveError')));assert(button(r,u('submit')).props.disabled,'Submit must block on failed write');
  failures.write=false;await press(r,u('retry'));assert(!text(r).includes(u('answerSaveError')));assert.equal(JSON.parse(stores.get(key)).answers[1],second.correctIndex);
  let translated=null;if(locale!=='ja'){
   await press(r,u('translationShow'));translated=api.manufacturingQuestionTranslation(second,locale);assert(translated,'Translation getter missing '+locale);assert(text(r).includes(translated.stem),'Translated stem missing');
   for(const why of translated.reasons.filter(x=>x.length>12))assert(!text(r).includes(why),'Translated rationale before submit');
  }
  await press(r,u('submit'));await press(r,u('cancel'));assert.equal(JSON.parse(stores.get(key)).submitted,false);await press(r,u('submit'));await press(r,u('confirm'));
  assert.equal(JSON.parse(stores.get(key)).submitted,true);for(const why of second.optionReasonsJa)assert(text(r).includes(why),'Japanese rationale absent after submit');if(translated)for(const why of translated.reasons)assert(text(r).includes(why),'Translated rationale absent after submit');
  const grade=api.gradeTest(exam,JSON.parse(stores.get(key)).answers);assert.equal(grade.correct,2);assert.equal(grade.unanswered,exam.questions.length-2);await unmount(r);
  const stale={...api.freshTestAttempt(exam),contentRevision:'QA_STALE_REVISION'};stores.set(key,JSON.stringify(stale));r=await mount(element());assert(text(r).includes(u('recordMismatch')));assert.equal(stores.get(key),JSON.stringify(stale),'Stale attempt silently overwritten');await unmount(r);
  weekly.push({specialty,locale,answerAndPositionResume:true,writeFailureRetry:true,confirmCancelSubmit:true,rationalesOnlyAfterSubmit:true,translatedRationalesAfterSubmit:locale!=='ja',grading:true,staleNotOverwritten:true});
  // Actual MockAttempt navigation plus completed-state review; full grading fixture uses actual state APIs.
  const m=api.loadManufacturingMocks(specialty)[0],mk=api.manufacturingMockKey(learner,specialty,m.id),mt=k=>api.manufacturingMockUi(locale,k),me=()=>React.createElement(api.__qaMockAttempt,{learner,exam:m,language:locale,onBack(){}});
  r=await mount(me());await press(r,mt('startSection'));const q=m.sections.theory.questions[0];await press(r,`${q.correctIndex+1}. ${q.optionsJa[q.correctIndex]}`);await press(r,u('next'));assert.equal(testId(r,'manufacturing-mock-rationales').length,0);assert.equal(testId(r,'manufacturing-mock-results').length,0);
  const saved=JSON.parse(stores.get(mk));assert.equal(saved.sections.theory.currentQuestion,1);assert.equal(saved.sections.theory.answers[0],q.correctIndex);await unmount(r);r=await mount(me());assert.equal(JSON.parse(stores.get(mk)).sections.theory.currentQuestion,1);assert.equal(testId(r,'manufacturing-mock-rationales').length,0);await unmount(r);
  let a=api.freshManufacturingMock(m),now=Date.now()-10000;for(const s of api.MOCK_SECTION_IDS){a=api.startManufacturingMockSection(a,m,s,now);m.sections[s].questions.forEach((x,i)=>a=api.answerManufacturingMock(a,m,s,i,x.correctIndex,now+i+1));now+=100;a=api.submitManufacturingMockSection(a,m,s,now);now+=100;}
  assert(api.manufacturingMockComplete(a));assert(api.gradeManufacturingMock(a,m).passed);stores.set(mk,JSON.stringify(a));r=await mount(me());assert.equal(testId(r,'manufacturing-mock-results').length,1);assert.equal(testId(r,'manufacturing-mock-rationales').length,1);for(const why of q.optionReasonsJa)assert(text(r).includes(why));
  if(locale!=='ja'){await press(r,u('translationShow'));const t=api.manufacturingMockTranslation(q,locale);assert(t);assert(text(r).includes(t.stem));for(const why of t.reasons)assert(text(r).includes(why));}
  await unmount(r);mock.push({specialty,locale,answerPositionResume:true,noEarlyResultsOrRationale:true,allCorrectTwoSectionGrading:true,completedReview:true,translatedReview:locale!=='ja'});
 }
 assert.equal(weekly.length,39);assert.equal(mock.length,39);assert.deepEqual(warnings,[]);
 const result={status:'PASS',weeklyFlows:weekly.length,mockFlows:mock.length,weekly,mock,scope,warnings,physicalDeviceVerified:false,browserLayoutVerified:false};fs.writeFileSync(path.join(__dirname,'controller-flows.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:'PASS',weeklyFlows:weekly.length,mockFlows:mock.length,warnings:0,scope}));
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{console.error=originalError});
