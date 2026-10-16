// Check actual translated mock data in every submitted-review screen, not synthetic language strings.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),modules=process.env.TOKUTEI_QA_MODULES||root;
const dep=n=>require(require.resolve(n,{paths:[modules]})),React=dep('react'),{create,act}=dep('react-test-renderer');
global.IS_REACT_ACT_ENVIRONMENT=true;global.__tokuteiStorage=new Map();global.__tokuteiFailSave=false;
global.requestAnimationFrame=f=>setTimeout(f,0);global.cancelAnimationFrame=clearTimeout;
const nodes=(t,id)=>t.root.findAll(n=>typeof n.type==='string'&&n.props.testID===id);
const get=(t,id)=>{const n=nodes(t,id);assert.equal(n.length,1,id);return n[0];};
const flat=n=>typeof n==='string'?n:Array.isArray(n)?n.map(flat).join(' '):n&&typeof n==='object'?flat(n.children):'';
// JSX separates the numeric prefix, dot and prose into adjacent native children.
const assertNumberedReason=(t,id,index,expected)=>{const rendered=flat(get(t,id).children);assert.match(rendered,new RegExp(`^${index+1}\\s*\\.\\s*`));assert.equal(rendered.replace(/^\d+\s*\.\s*/,''),expected);};
const click=async(t,id)=>act(async()=>{const n=get(t,id);assert(!n.props.disabled,id);n.props.onPress();await new Promise(setImmediate);});
(async()=>{
 const m=await require('./tokutei-ui-qa/compile.cjs')(root,modules);
 const dir=path.join(root,'src/data/kaigo/japanese-master/mock-translations');
 const locales=process.env.KAIGO_MOCK_TRANSLATION_LOCALES?.split(',')??(fs.existsSync(dir)?fs.readdirSync(dir).flatMap(n=>n.match(/^mocks\.(.+)\.json$/)?.[1]??[]):[]);
 assert(locales.length,'No actual completed mock translations; fixture tests do not count as translation completion');
 const counts=[];
 for(const language of locales){
  global.__tokuteiLanguage=language;let questions=0,passages=0,figureDescriptions=0;
  const batch=JSON.parse(fs.readFileSync(path.join(dir,`mocks.${language}.json`)));
  const formIds=Object.keys(batch.forms);assert(formIds.length>0);
  assert(formIds.every(id=>m.kaigoCourse.mocks.some(f=>f.id===id)),'Unknown translated form');
  for(const raw of m.kaigoCourse.mocks.filter(f=>!formIds.includes(f.id))){
   const unavailable=m.withJapaneseMockReview(raw);
   assert.equal(m.translationForMockTitle(unavailable,language),undefined,'No invented title for untranslated form');
   for(const q of unavailable.questions)assert.equal(m.translationForMockQuestion(unavailable,q.id,language),undefined,'No fallback for untranslated form');
  }
  for(const raw of m.kaigoCourse.mocks.filter(f=>formIds.includes(f.id))){
   const form=m.withJapaneseMockReview(raw);assert(form.japaneseReviewApplied);
   assert.deepEqual(Object.keys(batch.forms[form.id].questions).sort(),form.questions.map(q=>q.id).sort(),'Incomplete translated form');
   assert(m.translationForMockTitle(form,language),'Missing/stale selected-locale title');
   assert.equal(m.translationForMockTitle({...form,titleJa:form.titleJa+'変更'},language),undefined,'Changed Japanese title invalidates translation');
   for(const q of form.questions){assert(m.translationForMockQuestion(form,q.id,language),'Missing/stale selected-locale question');assert.equal(m.translationForMockQuestion({...form,questions:form.questions.map(item=>item.id===q.id?{...item,promptJa:item.promptJa+'変更'}:item)},q.id,language),undefined,'Changed effective Japanese invalidates question translation');assert.equal(m.translationForMockQuestion(form,q.id,'km',{[form.id]:{vi:m.translationForMockTitle(form,language)}}),undefined,'No fallback for an untranslated selected locale');}
   global.__tokuteiStorage.clear();let t;
   await act(async()=>{t=create(React.createElement(m.KaigoCourse,{active:false,onBack(){}}));await new Promise(setImmediate);});
   await click(t,'kaigo-weekly-tab-mocks');await click(t,'kaigo-mock-'+form.id);
   assert.equal(nodes(t,'kaigo-mock-translation').length,0,'Translation remains in submitted review');
   assert.equal(nodes(t,'kaigo-mock-prompt-translation').length,0);
   assert.equal(nodes(t,`kaigo-mock-rationale-${form.questions[0].id}-0`).length,0);
   await click(t,'kaigo-option-'+form.questions[0].correctIndex);
   await click(t,'kaigo-submit-exam');assert.equal(nodes(t,'kaigo-mock-review').length,0);
   await click(t,'kaigo-confirm-submit');assert.equal(nodes(t,'kaigo-mock-review').length,1);
   assert.equal(nodes(t,'kaigo-mock-prompt-translation').length,0,'Explicit translation action required');
   await click(t,'kaigo-mock-translation');
   for(let index=0;index<form.questions.length;index++){
    const q=form.questions[index],target=m.translationForMockQuestion(form,q.id,language);
    assert.equal(flat(get(t,'kaigo-mock-title-translation').children),m.translationForMockTitle(form,language).title);
    assert.equal(flat(get(t,'kaigo-mock-prompt-translation').children),target.prompt);
    for(let i=0;i<4;i++){
     assert.equal(flat(get(t,'kaigo-mock-option-translation-'+i).children),target.options[i]);
     assertNumberedReason(t,'kaigo-mock-rationale-translation-'+i,i,target.rationales[i]);
     assertNumberedReason(t,`kaigo-mock-rationale-${q.id}-${i}`,i,q.rationalesJa[i]);
     assert(get(t,'kaigo-option-'+i).props.disabled,'Submitted choices remain locked');
    }
    for(const[field,id]of [['passage','kaigo-mock-passage-translation'],['figureDescription','kaigo-mock-figure-translation']]){
     if(target[field])assert.equal(flat(get(t,id).children),target[field]);else assert.equal(nodes(t,id).length,0);
    }
    if(q.passageJa)passages++;if(q.figureDescriptionJa)figureDescriptions++;questions++;
    if(index<form.questions.length-1)await click(t,'kaigo-mock-next');
   }
   await click(t,'kaigo-mock-translation');assert.equal(nodes(t,'kaigo-mock-prompt-translation').length,0);
   await act(async()=>t.unmount());
   const saved=JSON.parse(global.__tokuteiStorage.get(m.examStorageKey(form)));
   assert.equal(saved.status,'submitted');assert.equal(saved.remainingMs,form.durationMs);
   assert.deepEqual(saved.answers,{[form.questions[0].id]:form.questions[0].correctIndex});
  }
  counts.push({language,forms:formIds.length,formIds:formIds.sort(),questions,options:questions*4,rationales:questions*4,passages,figureDescriptions});
 }
 const report={status:'PASS_ACTUAL_DIRECT_JAPANESE_MOCK_TRANSLATION_RUNTIME',counts,selectedLocaleOnly:true,explicitTranslationAction:true,translationAndRationalesOnlyInSubmittedReview:true,allSubmittedChoicesLocked:true,staleJapaneseTitlesAndQuestionsRejected:true,untranslatedSelectedLocaleHasNoFallback:true,attemptAnswersAndTimingPreserved:true,humanReviewed:false,domainReviewed:false,nativeReviewed:false,nativeDeviceTested:false,rightsReviewed:false,releaseReady:false};
 if(process.env.KAIGO_MOCK_TRANSLATION_REPORT)fs.writeFileSync(process.env.KAIGO_MOCK_TRANSLATION_REPORT,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exit(1)});
