// Detect accented Latin/Vietnamese text without incorrectly rejecting Greek scientific symbols such as α.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),modules=process.env.TOKUTEI_QA_MODULES||root;
const dep=n=>require(require.resolve(n,{paths:[modules]})),React=dep('react'),{create,act}=dep('react-test-renderer');
global.IS_REACT_ACT_ENVIRONMENT=true;global.__tokuteiStorage=new Map();global.__tokuteiFailSave=false;global.__tokuteiLanguage='vi';global.requestAnimationFrame=fn=>setTimeout(fn,0);global.cancelAnimationFrame=clearTimeout;
const hosts=(t,id)=>t.root.findAll(n=>typeof n.type==='string'&&n.props.testID===id);
const get=(t,id)=>{const ns=hosts(t,id);assert.equal(ns.length,1,id);return ns[0];};
const flatten=n=>typeof n==='string'?n:Array.isArray(n)?n.map(flatten).join(' '):n&&typeof n==='object'?flatten(n.children):'';
const click=async(t,id)=>{await act(async()=>{const n=get(t,id);assert(!n.props.disabled,id+' disabled');n.props.onPress();await new Promise(setImmediate);});};
const mount=async m=>{let t;await act(async()=>{t=create(React.createElement(m.KaigoCourse,{active:false,onBack(){}}));await new Promise(setImmediate);});return t;};
(async()=>{
 const m=await require('./tokutei-ui-qa/compile.cjs')(root,modules);
 const knownQuestionIds=new Set(m.weeklyQuestions.map(q=>q.id));
 for(const id of Object.keys(m.japaneseQuestionMasters))assert(knownQuestionIds.has(id),'Unknown Japanese question ID '+id);
 assert.equal(m.japaneseWeeklyQuestions.length,m.weeklyQuestions.length);
 assert.deepEqual(m.japaneseWeeklyQuestions.map(q=>q.id),m.weeklyQuestions.map(q=>q.id));
 let sections=0,paragraphs=0,questions=0;const weeks=[];
 for(let week=1;week<=26;week++){
  const active=m.japaneseQuestionsForWeek(week),old=m.questionsForWeek(week),authored=active.filter(q=>q.japaneseMaster);
  if(!authored.length){assert.deepEqual(active,old);assert.equal(m.japaneseAssessmentRevisionForWeek(week),m.assessmentRevisionForWeek(week));continue;}
  assert.equal(authored.length,active.length,'No mixed-language assessment within an authored week');weeks.push(week);questions+=active.length;
  assert.notEqual(m.japaneseAssessmentRevisionForWeek(week),m.assessmentRevisionForWeek(week),'New Japanese content gets independent attempt revision');
  for(const q of active){assert.equal(q.language,'ja');assert.equal(q.prompt,q.japanese);assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.rationales.length,4);assert.equal(new Set(q.rationales).size,4);assert(q.correctIndex>=0&&q.correctIndex<4);assert(!/[À-ÖØ-öø-ÿĂăĐđĨĩŨũƠơƯư\u1EA0-\u1EF9]/u.test(JSON.stringify([q.prompt,q.options,q.rationales,q.reading])));}
  const entries=m.kaigoCatalog.filter(e=>Math.ceil(e.day/7)===week);
  for(const e of entries){const meta=m.japaneseLessonMetadata[m.japaneseLessonKey(e)];assert(meta,'Missing Japanese day metadata '+e.day);assert.equal(meta.day,e.day,'Metadata belongs to another scheduled day');assert(meta.titleJa&&meta.objectivesJa.length&&meta.artCaptionJa);assert(!/[À-ÖØ-öø-ÿĂăĐđĨĩŨũƠơƯư\u1EA0-\u1EF9]/u.test(JSON.stringify([meta.titleJa,meta.objectivesJa,meta.contextJa,meta.artCaptionJa])),'Japanese metadata contains translation text '+e.day);
   for(const s of m.japaneseSectionsFor(e)){assert(s.masterStatus,'Master missing '+s.id);assert(s.japaneseComplete);assert(s.headingJa);assert(s.paragraphsJa.length);assert(!/[À-ÖØ-öø-ÿĂăĐđĨĩŨũƠơƯư\u1EA0-\u1EF9]/u.test(JSON.stringify([s.headingJa,s.paragraphsJa])));for(const p of s.paragraphsJa){assert(p.trim());assert(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(p));paragraphs++;}sections++;}
  }
 }
 const oldKey=`@japan_app_kaigo_weekly:assessment:${m.assessmentRevisionForWeek(1)}:1`,oldValue=JSON.stringify({answers:{[m.questionsForWeek(1)[0].id]:0},submitted:false});global.__tokuteiStorage.set(oldKey,oldValue);
 for(const week of weeks){let t=await mount(m);await click(t,'kaigo-week-'+week);await click(t,'kaigo-assessment-open-'+week);const qs=m.japaneseQuestionsForWeek(week);
  assert(!/[À-ÖØ-öø-ÿĂăĐđĨĩŨũƠơƯư\u1EA0-\u1EF9]/u.test(flatten(t.toJSON())),'Japanese assessment must be usable before opening translation');assert.equal(hosts(t,'kaigo-weekly-review').length,0);
  assert(!get(t,'kaigo-weekly-option-0').props.accessibilityState.checked,'Legacy answer is not applied to rewritten content');
  await click(t,'kaigo-weekly-translation');assert(flatten(t.toJSON()).includes('この言語の翻訳は準備中です。'));assert(!/[À-ÖØ-öø-ÿĂăĐđĨĩŨũƠơƯư\u1EA0-\u1EF9]/u.test(flatten(t.toJSON())));await click(t,'kaigo-weekly-translation');
  await click(t,'kaigo-weekly-option-'+qs[0].correctIndex);const newKey=`@japan_app_kaigo_weekly:assessment:${m.japaneseAssessmentRevisionForWeek(week)}:${week}`;assert(global.__tokuteiStorage.has(newKey));await act(async()=>t.unmount());
  t=await mount(m);await click(t,'kaigo-week-'+week);await click(t,'kaigo-assessment-open-'+week);assert(get(t,'kaigo-weekly-option-'+qs[0].correctIndex).props.accessibilityState.checked,'Japanese attempt resumes');
  for(let i=0;i<qs.length;i++){assert(flatten(t.toJSON()).includes(qs[i].japanese));assert.equal(hosts(t,'kaigo-weekly-rationale-0').length,0,'No rationale before submission');await click(t,'kaigo-weekly-option-'+qs[i].correctIndex);if(i<qs.length-1)await click(t,'kaigo-weekly-question-next');}
  await click(t,'kaigo-weekly-submit');assert.equal(hosts(t,'kaigo-weekly-review').length,1);for(let i=0;i<4;i++){assert(flatten({children:get(t,'kaigo-weekly-rationale-'+i).children}).includes(qs.at(-1).rationales[i]));assert(get(t,'kaigo-weekly-option-'+i).props.disabled);}
  await act(async()=>t.unmount());
 }
 assert.equal(global.__tokuteiStorage.get(oldKey),oldValue,'Old attempt remains unchanged');
 const report={status:'PASS_JAPANESE_AUTHORING_INTERNAL_PREVIEW',weeks,days:weeks.reduce((n,w)=>n+m.kaigoCatalog.filter(e=>Math.ceil(e.day/7)===w).length,0),readerSections:sections,japaneseParagraphs:paragraphs,weeklyQuestions:questions,optionRationales:questions*4,japaneseFirst:true,missingTranslationNoLegacyFallback:true,assessmentResumeAndSubmissionChecked:true,oldAttemptKeysPreserved:true,legacyRuntimeDataPreserved:true,humanReviewed:false,domainReviewed:false,nativeDeviceTested:false,sourceBookCoveragePercent:null,translationsPaused:true,releaseReady:false};
 if(process.env.KAIGO_JAPANESE_PRODUCTION_REPORT)fs.writeFileSync(process.env.KAIGO_JAPANESE_PRODUCTION_REPORT,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exit(1);});
