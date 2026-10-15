const assert=require('node:assert/strict'),path=require('path'),fs=require('fs'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),modules=process.env.TOKUTEI_QA_MODULES||root;
const dep=n=>require(require.resolve(n,{paths:[modules]})),React=dep('react'),renderer=dep('react-test-renderer'),{act}=renderer;
global.IS_REACT_ACT_ENVIRONMENT=true;global.__tokuteiStorage=new Map();global.__tokuteiFailSave=false;global.__tokuteiLanguage='vi';global.requestAnimationFrame=fn=>setTimeout(fn,0);global.cancelAnimationFrame=clearTimeout;
const hosts=(t,id)=>t.root.findAll(n=>typeof n.type==='string'&&n.props.testID===id);
const get=(t,id)=>{const a=hosts(t,id);assert.equal(a.length,1,id);return a[0];};
async function click(t,id){await act(async()=>{get(t,id).props.onPress();await new Promise(setImmediate);});}
function text(n){return typeof n==='string'?n:Array.isArray(n)?n.map(text).join(' '):n&&typeof n==='object'?text(n.children):'';}
(async()=>{
 const m=await require('./tokutei-ui-qa/compile.cjs')(root,modules);
 const input=JSON.parse(fs.readFileSync(path.join(root,'src/data/kaigo/japanese-master/translations/week-01.vi.json')));
 assert.equal(Object.keys(input.sections).length,73);assert.equal(Object.keys(input.lessons).length,7);
 let t,paragraphs=0,sections=0;
 await act(async()=>{t=renderer.create(React.createElement(m.KaigoCourse,{active:false,onBack(){}}));await new Promise(setImmediate);});
 await click(t,'kaigo-week-1');
 for(const entry of m.kaigoCatalog.filter(e=>e.day<=7)){
  await click(t,'kaigo-calendar-day-'+entry.day);assert(!/[À-ỹ]/u.test(text(t.toJSON())),'Vietnamese must remain hidden until explicitly opened');
  await click(t,'kaigo-translation');
  const lesson=m.translationForLesson(entry.id,'vi');assert(lesson);assert(text(t.toJSON()).includes(lesson.title));assert(text(t.toJSON()).includes(lesson.artCaption));
  assert(!text(t.toJSON()).includes('旧版参考訳'),'No legacy reference label in the revised week');
  for(const section of m.japaneseSectionsFor(entry)){
   const tr=m.translationForMaster(section.id,'vi');assert(tr);assert.equal(tr.paragraphs.length,section.paragraphsJa.length);
   assert.equal(tr.status,'translated_ai_unreviewed');
   tr.paragraphs.forEach((p,i)=>{
    const source=get(t,`kaigo-source-${section.id}-${i}`),target=get(t,`kaigo-master-translation-${section.id}-${i}`);
    assert.equal(source.parent.parent,target.parent.parent,'Each translation must immediately follow its Japanese paragraph');
    const children=source.parent.parent.children;assert.equal(children.indexOf(target.parent),children.indexOf(source.parent)+1);
    assert.equal(text(target.toJSON?.()??{children:target.children}),p);paragraphs++;
   });
   assert.equal(hosts(t,`kaigo-translation-${section.id}-0`).length,0,'No duplicate legacy paragraph');sections++;
  }
  await click(t,'kaigo-translation');assert(!/[À-ỹ]/u.test(text(t.toJSON())));await click(t,'kaigo-reading-back');
 }
 await act(async()=>t.unmount());
 assert.equal(sections,73);assert.equal(paragraphs,246);
 const id='kaigo-foundation-01-summary',tr=m.translationForMaster(id,'vi');
 assert.equal(m.translationForMaster(id,'vi',{[id]:{vi:{...tr,paragraphs:tr.paragraphs.slice(0,1)}}}),undefined,'Incomplete translations must not render');
 const lid='kaigo-foundation-01',lesson=m.japaneseLessonMetadata[lid],meta=m.translationForLesson(lid,'vi');
 assert.equal(m.translationForLesson(lid,'vi',{[lid]:{vi:meta}},{...m.japaneseLessonMetadata,[lid]:{...lesson,artCaptionJa:lesson.artCaptionJa+'変更'}}),undefined,'Caption changes invalidate metadata translations');
 const report={date:'2026-10-16',status:'PASS_WEEK1_VI_REWRITE_AND_PARAGRAPH_ALIGNMENT',days:7,sections,paragraphs,lessonTitles:7,artCaptions:7,sourceLanguage:'ja',sourceJapaneseSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'src/data/kaigo/japanese-master/week-01.json'))).digest('hex'),legacyReferencesReplacedInWeek1:true,legacyDataPreserved:true,paragraphPairsChecked:true,explicitTranslationChecked:true,missingAndStaleTranslationsRejected:true,editorialReview:'AI comparison of Japanese meaning and natural Vietnamese wording; no independent human review',humanReviewed:false,domainReviewed:false,nativeDeviceTested:false,releaseReady:false};
 fs.writeFileSync(path.join(root,'docs/ssw-workspace/kaigo/reviews/vietnamese-week1-revision-2026-10-16.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exit(1);});
