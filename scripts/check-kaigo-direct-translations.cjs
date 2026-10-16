// Completeness, revision binding and actual native-host reader/assessment flows.
// These checks do not certify translation meaning or native-device rendering.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),modules=process.env.TOKUTEI_QA_MODULES||root;
const dep=n=>require(require.resolve(n,{paths:[modules]})),React=dep('react'),{create,act}=dep('react-test-renderer');
global.IS_REACT_ACT_ENVIRONMENT=true;global.__tokuteiStorage=new Map();global.__tokuteiFailSave=false;global.requestAnimationFrame=f=>setTimeout(f,0);global.cancelAnimationFrame=clearTimeout;
const week=Number(process.env.KAIGO_TRANSLATION_WEEK??1),number=String(week).padStart(2,'0');
const locales=process.env.KAIGO_TRANSLATION_LOCALES?.split(',')??['vi','en','id','zh-CN','zh-TW','th'];
const nodes=(t,id)=>t.root.findAll(n=>typeof n.type==='string'&&n.props.testID===id);
const get=(t,id)=>{const ns=nodes(t,id);assert.equal(ns.length,1,id);return ns[0];};
const flatten=n=>typeof n==='string'?n:Array.isArray(n)?n.map(flatten).join(' '):n&&typeof n==='object'?flatten(n.children):'';
const text=t=>flatten(t.toJSON());
const click=async(t,id)=>act(async()=>{const n=get(t,id);assert(!n.props.disabled,id);n.props.onPress();await new Promise(setImmediate);});
const mount=async m=>{let t;await act(async()=>{t=create(React.createElement(m.KaigoCourse,{active:false,onBack(){}}));await new Promise(setImmediate);});return t;};
(async()=>{
 const m=await require('./tokutei-ui-qa/compile.cjs')(root,modules);const master=JSON.parse(fs.readFileSync(path.join(root,`src/data/kaigo/japanese-master/week-${number}.json`))),qs=m.japaneseQuestionsForWeek(week),counts=[];
 for(const locale of locales){
  const p=`src/data/kaigo/japanese-master/translations/week-${number}.${locale}.json`,b=JSON.parse(fs.readFileSync(path.join(root,p)));
  assert.equal(b.language,locale);assert.equal(b.translatedFrom,'ja');assert.equal(b.humanReviewed,false);assert.equal(b.status,'translated_ai_unreviewed');
  assert.deepEqual(Object.keys(b.sections).sort(),Object.keys(master.sections).sort());assert.deepEqual(Object.keys(b.lessons).sort(),Object.keys(master.lessons).sort());assert.deepEqual(Object.keys(b.questions).sort(),qs.map(q=>q.id).sort());
  let paragraphs=0;
  for(const[id,s]of Object.entries(master.sections)){const t=m.translationForMaster(id,locale);assert(t,locale+': section '+id);assert.equal(t.status,'translated_ai_unreviewed');paragraphs+=t.paragraphs.length;assert.notEqual(t.heading+s.paragraphsJa.join(''),s.headingJa+t.paragraphs.join(''),'Untranslated whole section');assert.equal(m.translationForMaster(id,locale,undefined,{...m.japaneseMasterSections,[id]:{...s,headingJa:s.headingJa+'変更'}}),undefined,'Changed Japanese invalidates translation');if(s.figureCaptionsJa){const key=Object.keys(s.figureCaptionsJa)[0];assert.equal(m.translationForMaster(id,locale,undefined,{...m.japaneseMasterSections,[id]:{...s,figureCaptionsJa:{...s.figureCaptionsJa,[key]:s.figureCaptionsJa[key]+'変更'}}}),undefined,'Caption edits invalidate translation');}}
  for(const[id,l]of Object.entries(master.lessons)){const t=m.translationForLesson(id,locale);assert(t,locale+': lesson '+id);assert.equal(t.objectives.length,l.objectivesJa.length);assert(t.objectives.every(x=>x.trim()));assert(t.context.trim()&&t.title.trim()&&t.artCaption.trim());assert.equal(m.translationForLesson(id,locale,undefined,{...m.japaneseLessonMetadata,[id]:{...l,contextJa:l.contextJa+'変更'}}),undefined);}
  for(const q of qs){const t=m.translationForQuestion(q.id,locale);assert(t,locale+': question '+q.id);const src=m.japaneseQuestionTranslationSource(q.id);if(src.readingJa?.trim())assert(t.reading.trim());else if(src.readingJa==='')assert.equal(t.reading,'');else assert.equal(t.reading,undefined);assert.equal(new Set(t.options).size,4,'Collapsed distinct options');assert.equal(new Set(t.rationales).size,4,'Repeated rationales');assert.equal(t.correctIndex,q.correctIndex);assert.equal(m.translationForQuestion(q.id,locale,undefined,{...m.japaneseQuestionMasters,[q.id]:{...m.japaneseQuestionMasters[q.id],promptJa:'変更'}}),undefined);}
  global.__tokuteiLanguage=locale;
  for(const mode of ['day','night']) for(const entry of m.kaigoCatalog.filter(e=>Math.ceil(e.day/7)===week)) {
    global.__tokuteiStorage.set('@japan_app_tokutei_reading_appearance_v1',mode);
    const t=await mount(m);await click(t,'kaigo-week-'+week);await click(t,'kaigo-calendar-day-'+entry.day);
    const sections=m.japaneseSectionsFor(entry);
    for(const section of sections){assert.equal(nodes(t,`kaigo-master-translation-${section.id}-0`).length,0,'Translation hidden initially');assert(text(t).includes(section.paragraphsJa[0]));}
    await click(t,'kaigo-translation');
    for(const section of sections){const translated=m.translationForMaster(section.id,locale);for(let i=0;i<translated.paragraphs.length;i++){
      const node=get(t,`kaigo-master-translation-${section.id}-${i}`);assert.equal(flatten(node.children),translated.paragraphs[i]);
      const renderedStyle=Object.assign({},...node.props.style.flat(Infinity).filter(Boolean));assert.equal(renderedStyle.color,m.READING_PALETTES[mode].translationText);assert.equal(renderedStyle.backgroundColor,m.READING_PALETTES[mode].translation);
    }
    for(const key of Object.keys(section.figureCaptionsJa??{})){const caption=get(t,`kaigo-figure-caption-translation-${section.id}-${key}`);assert.equal(flatten(caption.children),translated.figureCaptions[key]);}
    }
    const metadata=m.translationForLesson(m.japaneseLessonKey(entry),locale);assert(text(t).includes(metadata.title));assert(text(t).includes(metadata.artCaption));
    await click(t,'kaigo-translation');for(const section of sections)assert.equal(nodes(t,`kaigo-master-translation-${section.id}-0`).length,0);await act(async()=>t.unmount());
  }
  global.__tokuteiStorage.clear();const t=await mount(m);await click(t,'kaigo-week-'+week);await click(t,'kaigo-assessment-open-'+week);assert.equal(nodes(t,'kaigo-weekly-prompt-translation').length,0);await click(t,'kaigo-weekly-translation');assert.equal(flatten(get(t,'kaigo-weekly-prompt-translation').children),b.questions[qs[0].id].prompt);if(qs[0].reading)assert.equal(flatten(get(t,'kaigo-weekly-reading-translation').children),b.questions[qs[0].id].reading);for(let i=0;i<4;i++){assert.equal(flatten(get(t,'kaigo-weekly-option-translation-'+i).children),b.questions[qs[0].id].options[i]);assert.equal(nodes(t,'kaigo-weekly-rationale-translation-'+i).length,0,'No answer explanation before submit');}
  for(let i=0;i<qs.length;i++){assert.equal(flatten(get(t,'kaigo-weekly-prompt-translation').children),b.questions[qs[i].id].prompt);for(let j=0;j<4;j++){assert.equal(flatten(get(t,'kaigo-weekly-option-translation-'+j).children),b.questions[qs[i].id].options[j]);assert.equal(nodes(t,'kaigo-weekly-rationale-translation-'+j).length,0);}if(qs[i].reading)assert.equal(flatten(get(t,'kaigo-weekly-reading-translation').children),b.questions[qs[i].id].reading);await click(t,'kaigo-weekly-option-'+qs[i].correctIndex);if(i<qs.length-1)await click(t,'kaigo-weekly-question-next');}await click(t,'kaigo-weekly-submit');
  // Exercise every submitted question, including earlier questions with distinct rationales.
  for(let i=qs.length-1;i>=0;i--){
    const translated=b.questions[qs[i].id];
    assert.equal(flatten(get(t,'kaigo-weekly-prompt-translation').children),translated.prompt);
    for(let j=0;j<4;j++){
      const renderedReason=flatten(get(t,'kaigo-weekly-rationale-translation-'+j).children);
      assert.match(renderedReason,new RegExp(`^${j+1}\\s*\\.\\s*`));
      assert.equal(renderedReason.replace(/^\d+\s*\.\s*/,''),translated.rationales[j]);
      assert(get(t,'kaigo-weekly-option-'+j).props.disabled,'Submitted answers remain locked');
    }
    if(i>0)await click(t,'kaigo-weekly-question-prev');
  }
  await act(async()=>t.unmount());
  counts.push({week,language:locale,sections:Object.keys(master.sections).length,paragraphs,lessons:Object.keys(master.lessons).length,questions:qs.length,rationales:qs.length*4});
 }
 const sid=Object.keys(master.sections)[0],qid=qs[0].id;assert.equal(m.translationForMaster(sid,'km',{[sid]:{vi:m.translationForMaster(sid,'vi')}}),undefined,'No other-locale fallback');assert.equal(m.translationForQuestion(qid,'km',{[qid]:{vi:m.translationForQuestion(qid,'vi')}}),undefined);assert.equal(m.translationForLesson(Object.keys(master.lessons)[0],'km',{[Object.keys(master.lessons)[0]]:{vi:m.translationForLesson(Object.keys(master.lessons)[0],'vi')}}),undefined);
 const result={status:'PASS_DIRECT_JAPANESE_TRANSLATION_WEEK',week,counts,readerModes:['day','night'],readerDayLocaleModeCases:locales.length*Object.keys(master.lessons).length*2,paragraphDisplayPairsChecked:counts.reduce((n,x)=>n+x.paragraphs,0)*2,selectedLocaleOnly:true,staleTranslationsRejected:true,noRationalesBeforeSubmission:true,submittedRationalesChecked:qs.length*4*locales.length,allSubmittedChoicesLocked:true,nativeDeviceTested:false,humanReviewed:false,domainReviewed:false,nativeReviewed:false,releaseReady:false};if(process.env.KAIGO_TRANSLATION_REPORT)fs.writeFileSync(process.env.KAIGO_TRANSLATION_REPORT,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exit(1)});
