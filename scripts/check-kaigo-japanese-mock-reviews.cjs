const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const root=path.resolve(__dirname,'..'),modules=process.env.TOKUTEI_QA_MODULES||root;
const dep=n=>require(require.resolve(n,{paths:[modules]})),React=dep('react'),{create,act}=dep('react-test-renderer');
global.IS_REACT_ACT_ENVIRONMENT=true;global.__tokuteiStorage=new Map();global.__tokuteiFailSave=false;global.__tokuteiLanguage='vi';global.requestAnimationFrame=fn=>setTimeout(fn,0);global.cancelAnimationFrame=clearTimeout;
const nodes=(t,id)=>t.root.findAll(n=>typeof n.type==='string'&&n.props.testID===id);
const get=(t,id)=>{const ns=nodes(t,id);assert.equal(ns.length,1,id);return ns[0];};
const flatten=n=>typeof n==='string'?n:Array.isArray(n)?n.map(flatten).join(' '):n&&typeof n==='object'?flatten(n.children):'';
const click=async(t,id)=>act(async()=>{const n=get(t,id);assert(!n.props.disabled,id+' disabled');n.props.onPress();await new Promise(setImmediate);});
const mount=async m=>{let t;await act(async()=>{t=create(React.createElement(m.KaigoCourse,{active:false,onBack(){}}));await new Promise(setImmediate);});await click(t,'kaigo-weekly-tab-mocks');return t;};
(async()=>{
 const m=await require('./tokutei-ui-qa/compile.cjs')(root,modules);
 const forms=m.kaigoCourse.mocks;assert.equal(forms.length,12);let questions=0;
 for(const source of forms){const form=m.withJapaneseMockReview(source);assert(form.japaneseReviewApplied,source.id+' Japanese explanations missing');assert.notEqual(form,source);
  const corrections=m.japaneseMockCoreCorrections[source.id];
  if(corrections)assert.notEqual(m.examStorageKey(form),m.examStorageKey(source),'Edited core receives a new attempt revision');
  else assert.equal(m.examStorageKey(form),m.examStorageKey(source),'Explanation-only additions preserve saved attempt key');
  assert.equal(form.durationMs,source.durationMs);assert.equal(form.version,source.version);if(!corrections)assert.equal(form.contentRevision,source.contentRevision);
  assert.equal(form.questions.length,source.questions.length);assert.deepEqual(form.questions.map(q=>q.id),source.questions.map(q=>q.id));
  for(let i=0;i<form.questions.length;i++){const q=form.questions[i],old=source.questions[i];
   const repair=corrections?.questions[q.id]?.replacement??{};assert.deepEqual(q,{...old,rationalesJa:q.rationalesJa,...repair},'Only recorded editorial repairs and Japanese rationales may change');assert.equal(q.correctIndex,old.correctIndex);assert.equal(q.furigana.prompt.map(t=>t.text).join(''),q.promptJa,'Prompt furigana must match effective wording');for(let j=0;j<4;j++)assert.equal(q.furigana.options[j].map(t=>t.text).join(''),q.optionsJa[j],'Option furigana must match effective wording');assert.equal(q.rationalesJa.length,4);assert.equal(new Set(q.rationalesJa).size,4);for(const text of q.rationalesJa){assert(text.trim());assert(!/[À-ỹ]/u.test(text));}
   assert(!('correctIndex' in m.publicQuestion(q)));assert(!('rationalesJa' in m.publicQuestion(q)));questions++;
  }
  const review=m.japaneseMockReviews[source.id],q=source.questions[0],item=review.questions[q.id];
  for(const patch of [{promptJa:item.promptJa+'変更'},{optionsJa:['変更',...item.optionsJa.slice(1)]},{passageJa:item.passageJa+'変更'},{figureDescriptionJa:item.figureDescriptionJa+'変更'},{correctIndex:(item.correctIndex+1)%4},{rationalesJa:item.rationalesJa.slice(1)}]){
   assert.equal(m.withJapaneseMockReview(source,{[source.id]:{...review,questions:{...review.questions,[q.id]:{...item,...patch}}}}),source,'Changed core or incomplete explanation rejected');
  }
  const correctionId=corrections&&Object.keys(corrections.questions)[0];
  const index=correctionId?source.questions.findIndex(q=>q.id===correctionId):2,active=m.createExamSession(source);active.currentQuestion=index;active.remainingMs=source.durationMs-9000;active.answers[source.questions[index].id]=source.questions[index].correctIndex;
  const oldKey=m.examStorageKey(source),oldValue=JSON.stringify(active),key=m.examStorageKey(form);global.__tokuteiStorage.set(oldKey,oldValue);
  let t=await mount(m);await click(t,'kaigo-mock-'+source.id);assert.equal(nodes(t,'kaigo-mock-review').length,0);
  if(corrections){
   assert(!get(t,'kaigo-option-0').props.accessibilityState.checked,'Old answers do not attach to a revised form');await act(async()=>t.unmount());
   const resumed={...active,contentRevision:form.contentRevision};global.__tokuteiStorage.set(key,JSON.stringify(resumed));t=await mount(m);await click(t,'kaigo-mock-'+source.id);
  }
  assert(get(t,'kaigo-option-'+source.questions[index].correctIndex).props.accessibilityState.checked,'Compatible answer resumes');
  assert.equal(nodes(t,`kaigo-mock-rationale-${source.questions[index].id}-0`).length,0,'No explanations before submission');
  await click(t,'kaigo-submit-exam');assert.equal(nodes(t,'kaigo-mock-review').length,0);await click(t,'kaigo-confirm-submit');assert.equal(nodes(t,'kaigo-mock-review').length,1);
  for(let i=0;i<4;i++){assert.equal(get(t,`kaigo-mock-rationale-${source.questions[index].id}-${i}`).children.join(''),`${i+1}. ${form.questions[index].rationalesJa[i]}`);assert(get(t,'kaigo-option-'+i).props.disabled);}
  for(const locale of ['vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']){global.__tokuteiLanguage=locale;await click(t,'kaigo-mock-translation');assert(flatten(t.toJSON()).includes('この言語の翻訳は準備中です。'));assert(!/[À-ỹ]/u.test(flatten(t.toJSON())),'No stale Vietnamese translation for '+locale);await click(t,'kaigo-mock-translation');}
  await act(async()=>t.unmount());const saved=JSON.parse(global.__tokuteiStorage.get(key));assert.equal(saved.status,'submitted');assert.equal(saved.currentQuestion,index);assert.equal(saved.remainingMs,active.remainingMs);assert.deepEqual(saved.answers,active.answers);
  if(corrections)assert.equal(global.__tokuteiStorage.get(oldKey),oldValue,'Old revision remains archived unchanged');
  t=await mount(m);await click(t,'kaigo-mock-'+source.id);assert.equal(nodes(t,'kaigo-mock-review').length,1,'Submitted compatible attempt restores with Japanese explanation');await act(async()=>t.unmount());
 }
 assert.equal(questions,360);
 const report={status:'PASS_JAPANESE_MOCK_EXPLANATIONS_INTERNAL_PREVIEW',forms:forms.length,questions,optionRationales:questions*4,unchangedCoreForms:forms.length-Object.keys(m.japaneseMockCoreCorrections).length,explicitlyRevisedForms:Object.keys(m.japaneseMockCoreCorrections).length,sourceLegacyJSONPreserved:true,oldAttemptRecordsPreserved:true,revisedFormsUseSeparateKeys:true,originalTimingPreserved:true,explanationsOnlyAfterSubmission:true,missingTranslationsNoVietnameseFallback:true,selectedTranslationLanguagesChecked:12,humanReviewed:false,domainReviewed:false,nativeDeviceTested:false,releaseReady:false};
 if(process.env.KAIGO_JAPANESE_MOCK_REPORT)fs.writeFileSync(process.env.KAIGO_JAPANESE_MOCK_REPORT,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exit(1);});
