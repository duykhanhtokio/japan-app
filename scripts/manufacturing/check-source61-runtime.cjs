// Actual private Reader/Attempt, exposed only in memory by the existing harness.
// Declared native/storage/appearance/Royal/asset adapters; no browser/device claim.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {componentHarness,root}=require('../../docs/ssw-workspace/manufacturing/implementation40/qa/runtime-harness.cjs');
const Module=require('node:module'),oldResolve=Module._resolveFilename,reactPath=require.resolve('react'),jsxPath=require.resolve('react/jsx-runtime');Module._resolveFilename=function(id,parent,...a){return oldResolve.call(this,id==='react'?reactPath:id==='react/jsx-runtime'?jsxPath:id,parent,...a);};
const React=require('react'),TR=require('react-test-renderer');global.IS_REACT_ACT_ENVIRONMENT=true;
const error=console.error,warnings=[];console.error=(...a)=>{if(a[0]?.toString().includes('react-test-renderer is deprecated'))return;warnings.push(a.map(String).join(' '));error(...a);};
const text=r=>{const flatten=n=>typeof n==='string'?n:Array.isArray(n)?n.map(flatten).join(''):n&&typeof n==='object'?flatten(n.children):'';return flatten(r.toJSON());};
async function act(fn){await TR.act(async()=>{if(fn)await fn();await new Promise(r=>setImmediate(r));});}
async function mount(e){let r;await act(()=>r=TR.create(e));return r;}
async function close(r){await act(()=>r.unmount());}
async function press(r,label){const buttons=r.root.findAll(n=>n.type==='Pressable'&&n.props.accessibilityLabel===label);assert.equal(buttons.length,1,label);assert(!buttons[0].props.disabled,label);await act(()=>buttons[0].props.onPress());}
(async()=>{
 const {api,stores,scope}=await componentHarness(),locales=['ja',...JSON.parse(fs.readFileSync(path.join(root,'docs/ssw-workspace/manufacturing/approved-scope.json'),'utf8')).targetLocales];
 const results=[];let readers=0,attempts=0;
 const data=JSON.parse(fs.readFileSync(path.join(root,'src/data/manufacturing/source61-assessments.json'),'utf8')),specialty='mechanical';
 for(const row of data.rows){
 const specialty=row.specialty,group=specialty,exam=api.manufacturingSupplementExams(specialty).map(api.revisedExam40).find(e=>e.id===row.id);assert(exam,'actual Course check catalog');
 for(const locale of locales){
 const provider=child=>React.createElement(api.__qaLocaleContext.Provider,{value:locale},child);let r;
 for(let index=0;index<exam.questions.length;index++){
    const q=exam.questions[index],learner='qa61-'+group+'-'+locale+'-'+index,key=api.manufacturingExamKey(learner,specialty,exam.id),a=api.freshTestAttempt(exam);a.currentQuestion=index;stores.set(key,JSON.stringify(a));
    const element=()=>provider(React.createElement(api.__qaAttempt,{learner,specialty,exam,onBack(){}}));
    r=await mount(element());assert(text(r).includes(q.stemJa),'actual question stem');
    for(const reason of q.optionReasonsJa)assert(!text(r).includes(reason),'rationale leaked before submission');
    let target=null;if(locale!=='ja'){await press(r,api.manufacturingUi(locale,'translationShow'));target=row.locales[locale];assert(text(r).includes(target.stem),'actual target stem '+locale);for(const reason of target.reasons)assert(!text(r).includes(reason),'target rationale leaked');}
    const answer=q.correctIndex,label=`${answer+1}. ${q.optionsJa[answer]}${target?'\n'+target.options[answer]:''}`;
    await press(r,label);const stored=api.restoreTestAttempt(stores.get(key),exam);assert.equal(stored.answers[index],answer);assert.equal(stored.currentQuestion,index);
    await close(r);r=await mount(element());assert(text(r).includes(q.stemJa),'position restored');
    if(locale!=='ja')await press(r,api.manufacturingUi(locale,'translationShow'));
    const selected=r.root.findAll(n=>n.type==='Pressable'&&n.props.accessibilityLabel===label);assert.equal(selected.length,1);assert.equal(selected[0].props.accessibilityState.selected,true,'answer restored');
    for(const reason of q.optionReasonsJa)assert(!text(r).includes(reason),'resume must not reveal rationale');
    await press(r,api.manufacturingUi(locale,'submit'));await press(r,api.manufacturingUi(locale,'confirm'));
    assert.equal(api.restoreTestAttempt(stores.get(key),exam).submitted,true);
    for(const reason of q.optionReasonsJa)assert(text(r).includes(reason),'reason missing after submit');
    if(target)for(const reason of target.reasons)assert(text(r).includes(reason),'target reason missing after submit');
    await close(r);attempts++;
   }
  }
  results.push({group,readerLocaleFlows:0,questionLocaleFlows:13,actualReader:false,actualAttempt:true,saveResume:true,rationalesGated:true});
 }
 assert.equal(readers,0);assert.equal(attempts,39);assert.deepEqual(warnings,[]);
 const result={status:'PASS',readerLocaleFlows:readers,questionLocaleFlows:attempts,results,scope,warnings,browserLayoutVerified:false,physicalDeviceVerified:false,measuredLearningDuration:false};
 fs.writeFileSync(path.join(root,'docs/ssw-workspace/source-coverage-v2/manufacturing-source61-runtime.json'),JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({status:'PASS',readerLocaleFlows:readers,questionLocaleFlows:attempts,saveResume:true,rationalesGated:true,scope}));
})().catch(e=>{error(e);process.exitCode=1;}).finally(()=>console.error=error);
