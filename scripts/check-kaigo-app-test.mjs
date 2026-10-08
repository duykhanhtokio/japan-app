import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {answerExam,canAdvancePractice,canRevealPractice,createExamSession,examReview,examStorageKey,publicQuestion,restoreExamSession,scoreQuestions,submitExam,tickExam} from '../src/services/kaigo-session.ts';
const root='docs/ssw-workspace/kaigo/';
const course=JSON.parse(fs.readFileSync('src/data/kaigo/content.json','utf8'));
const manifest=JSON.parse(fs.readFileSync(root+'reviews/app-test-content-manifest.json','utf8'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
assert.equal(hash(fs.readFileSync(manifest.output.path)),manifest.output.sha256,'runtime bytes');
for(const f of manifest.inputs)assert.equal(hash(fs.readFileSync(f.path)),f.sha256,'frozen authoring input '+f.path);
assert.equal(course.humanReviewed,false);assert.equal(course.releaseReady,false);assert.equal(course.mode,'publisher_requested_test_only');
assert.equal(course.days.length,56);assert.equal(course.lessons.length,54);assert.equal(course.lessons.flatMap(l=>l.questions).length,270);assert.equal(course.candidates.length,8);assert.equal(course.candidates.flatMap(l=>l.questions).length,40);assert.equal(course.mocks.length,6);assert.equal(course.mocks.flatMap(l=>l.questions).length,180);
const ids=new Set(),add=id=>{assert(id&&!ids.has(id),'unique IDs '+id);ids.add(id);};
const terms=new Set(course.terms.map(x=>x.id)),npcs=new Set(course.npcs.map(x=>x.id));
for(const t of course.terms){add(t.id);assert(t.termJa&&t.readingJa&&t.meaningVi,'complete term');}for(const n of course.npcs)add(n.id);
const groups=['foundation','week2','movement','eating','excretion','hygiene','housework','review'];
const original=groups.flatMap(g=>JSON.parse(fs.readFileSync(root+'drafts/'+g+'-lessons.json')).lessons);
for(const l of [...course.lessons,...course.candidates]){add(l.id);assert.equal(l.questions.length,5);assert(npcs.has(l.npcId));assert(l.readingJa&&l.readingVi&&l.knowledgeSectionsVi.length>=4);for(const id of l.termIds)assert(terms.has(id),'term link '+id);for(const t of l.dialogue){add(t.id);assert(npcs.has(t.npcId)&&t.textJa&&t.meaningVi);if(t.speaker==='player')assert(t.meaningsVi.length&&t.alternativesJa.includes(t.textJa),'correct per-turn rubric '+t.id);}for(const v of l.transfers){add(v.id);assert(v.steps.length);for(const s of v.steps){assert(npcs.has(s.npcId)&&s.meaningsVi.length&&s.promptVi,'bounded transfer step');}}for(const q of l.questions){add(q.id);assert(q.optionsJa.length===4&&q.rationalesVi.length===4&&q.correctIndex>=0&&q.correctIndex<4);}
 if(!l.candidate){const o=original.find(x=>x.id===l.id);assert.deepEqual(l.dialogue.map(t=>t.textJa),o.dialogue.map(t=>t.textJa),'core speech intact');assert.deepEqual(l.questions.map(q=>q.correctIndex),o.questions.map(q=>q.correctIndex),'core answers intact');}
 const copy=structuredClone(l);delete copy.contentRevision;assert.equal(hash(JSON.stringify(copy,null,2)+'\n'),l.contentRevision,'lesson revision fingerprint');
}
const days=JSON.parse(fs.readFileSync(root+'drafts/curriculum-56-days.json')).days;assert.deepEqual(course.days.map(d=>[d.day,d.lessonId,d.mockId]),days.map(d=>[d.day,d.lessonId??null,d.mockId??null]),'day identities unchanged; revised time allocation separately checked');
function noSourceFields(v){if(Array.isArray(v))return v.forEach(noSourceFields);if(v&&typeof v==='object')for(const[k,x]of Object.entries(v)){assert(!['sourceMetadata','sourceRefs','sourcePrintedPage','sourcePdfPage','sourcePages','sourceRole','libraryFileId','structureSource','additionalKnowledgeSources'].includes(k),'private/editorial source metadata leaked');if(typeof x==='string')assert(!/libfile_|https?:\/\/|\.pdf(?:$|\b)/i.test(x),'source URL or private pointer leaked');noSourceFields(x);}}noSourceFields(course);
let checks=0;const test=(label,run)=>{run();checks++;};
for(const f of course.mocks){add(f.id);const source=JSON.parse(fs.readFileSync(root+'drafts/'+f.id+'.json'));assert.equal(f.durationMs,source.durationMs);assert.equal(f.durationMs,f.id.includes('skills')?3600000:1800000);assert.deepEqual(f.questions.map(q=>[q.id,q.promptJa,q.optionsJa,q.correctIndex]),source.questions.map(q=>[q.id,q.promptJa,q.optionsJa,q.correctIndex]));
 for(const q of f.questions){add(q.id);assert(q.promptVi&&q.optionsVi.length===4&&q.rationalesVi.length===4);assert.equal(q.furigana.prompt.map(t=>t.text).join(''),q.promptJa);q.optionsJa.forEach((o,i)=>assert.equal(q.furigana.options[i].map(t=>t.text).join(''),o));if(q.passageJa)assert.equal(q.furigana.passage.map(t=>t.text).join(''),q.passageJa);if(q.figureKey){assert(fs.existsSync('assets/kaigo/practical/'+q.figureKey+'.png'));assert.equal(q.furigana.figureDescription.map(t=>t.text).join(''),q.figureDescriptionJa);}const p=publicQuestion(q);assert(!('correctIndex'in p)&&!('promptVi'in p)&&!('rationalesVi'in p),'pre-submit public projection');}
 const init=createExamSession(f),q=f.questions[0];
 test('restore exact question answer remaining',()=>{let s=answerExam(init,q,2);s={...tickExam(s,1234),currentQuestion:f.questions.length-1};assert.deepEqual(restoreExamSession(JSON.stringify(s),f),s);});
 test('no answer before submit',()=>assert.equal(examReview(init,f),null));
 test('expiry locks and submits',()=>{const s=tickExam(init,f.durationMs,99);assert.equal(s.status,'submitted');assert.equal(s.remainingMs,0);assert.equal(s.submittedAt,99);assert.equal(answerExam(s,q,1),s);});
 test('cancel or paused clock unchanged',()=>{assert.equal(tickExam(init,0),init);assert.equal(tickExam(init,-1),init);assert.equal(tickExam(init,NaN),init);});
 test('partial early submit scores raw',()=>{const s=submitExam(answerExam(init,q,q.correctIndex),44);assert.equal(examReview(s,f).score,1);assert.equal(scoreQuestions(f.questions,{}),0);});
 test('content revision has separate resume key',()=>assert.notEqual(examStorageKey(f),examStorageKey({...f,contentRevision:'changed'})));
 test('reject stale form',()=>assert.deepEqual(restoreExamSession(JSON.stringify({...init,contentRevision:'old'}),f),init));
 test('reject corrupt answers',()=>assert.deepEqual(restoreExamSession(JSON.stringify({...init,answers:{[q.id]:99}}),f),init));
 test('reject corrupt question position',()=>assert.deepEqual(restoreExamSession(JSON.stringify({...init,currentQuestion:-1}),f),init));
 test('reject damaged storage',()=>assert.deepEqual(restoreExamSession('{broken',f),init));
 test('full perfect answers',()=>assert.equal(scoreQuestions(f.questions,Object.fromEntries(f.questions.map(q=>[q.id,q.correctIndex]))),f.questions.length));
 test('restore expired active session submits',()=>assert.equal(restoreExamSession(JSON.stringify({...init,remainingMs:0}),f).status,'submitted'));
}
test('no fixed reply before attempt',()=>assert.equal(canRevealPractice('   '),false));
test('advance needs attempt plus all meanings',()=>{assert.equal(canAdvancePractice('はい',true,[true,false],2),false);assert.equal(canAdvancePractice('はい',false,[true,true],2),false);assert.equal(canAdvancePractice('',true,[true,true],2),false);assert.equal(canAdvancePractice('はい',true,[true,true],2),true);});
const route=fs.readFileSync('src/app/specified-skills/kaigo.tsx','utf8');assert(route.includes('if(!__DEV__)'),'development only gate');const entry=fs.readFileSync('src/app/specified-skills/index.tsx','utf8');assert(entry.includes("ja!=='介護'||!__DEV__")&&entry.includes("pushPrepared('/specified-skills/kaigo')"),'real sector navigation');
console.log(JSON.stringify({status:'PASS_INTERNAL_TEST_INTEGRATION_NOT_CONTENT_APPROVAL',...manifest.counts,immutableInputs:manifest.inputs.length,IDsChecked:ids.size,behaviorChecks:checks,clinicalOrSemanticEvaluator:false,nativeDeviceTested:false,releaseReady:false}));
