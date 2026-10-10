import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {examStorageKey} from '../src/services/kaigo-session.ts';
const base='docs/ssw-workspace/kaigo/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const collection=read(base+'drafts/mock-collection.json');
const forms=collection.forms.map(f=>read(base+'drafts/'+f.path));
const support=collection.reviewSupportPaths.flatMap(p=>read(base+'drafts/'+p).entries);
const course=read('src/data/kaigo/content.json');
const baseline=read(base+'reviews/mock-expansion-baseline.json');
function ruby(tokens,text){assert(Array.isArray(tokens));assert.equal(tokens.map(t=>t.text).join(''),text);for(const t of tokens)if(/[\p{Script=Han}々]/u.test(t.text))assert(t.readingKana&&/^[\p{Script=Hiragana}\p{Script=Katakana}ー]+$/u.test(t.readingKana),'kanji reading '+t.text);}
function validate(fs0){
 assert.equal(fs0.length,12);assert.equal(fs0.filter(f=>f.id.includes('skills')).length,6);
 const ids=new Set();let questions=0,figures=0;
 for(const f of fs0){
  assert(!ids.has(f.id));ids.add(f.id);const skills=f.id.includes('skills');assert.equal(f.questions.length,skills?45:15);assert.equal(f.durationMs,skills?3600000:1800000);
  const expected=skills?{fundamentals:10,mind_body:6,communication:4,physical_care:20,cbt_practical:5}:{terms:5,dialogue:5,documents:5};
  const sections={},positions=[0,0,0,0];
  f.questions.forEach((q,i)=>{
   assert(!ids.has(q.id));ids.add(q.id);questions++;sections[q.sectionId]=(sections[q.sectionId]??0)+1;
   assert.equal(q.optionsJa.length,4);assert.equal(new Set(q.optionsJa).size,4);assert(Number.isInteger(q.correctIndex)&&q.correctIndex>=0&&q.correctIndex<4);positions[q.correctIndex]++;
   assert.equal(q.pointValue,1);assert.equal(q.rationalesVi.length,4);q.rationalesVi.forEach((r,j)=>assert(r.startsWith(j===q.correctIndex?'Đúng:':'Sai:')));
   ruby(q.furigana.prompt,q.promptJa);q.optionsJa.forEach((o,j)=>ruby(q.furigana.options[j],o));if(q.passageJa)ruby(q.furigana.passage,q.passageJa);
   const vi=support.find(s=>s.questionId===q.id);assert(vi&&vi.promptVi&&vi.optionsVi.length===4&&vi.optionsVi.every(Boolean));assert.equal(vi.displayGate,'after_submission_only');
   if(q.passageJa)assert(vi.passageVi);
   if(q.figurePath){figures++;ruby(q.furigana.figureDescription,q.figureDescriptionJa);assert(vi.figureDescriptionVi);const key=q.figurePath.split('/').pop().replace('.svg','');const asset='assets/kaigo/practical/'+key+'.png';const fallback=process.env.KAIGO_ASSET_FALLBACK_ROOT;assert(fs.existsSync(asset)||(fallback&&fs.existsSync(fallback+'/'+asset)),asset);}
   if(i>=2)assert(!(q.correctIndex===f.questions[i-1].correctIndex&&q.correctIndex===f.questions[i-2].correctIndex));
  });
  assert.deepEqual(sections,expected);assert(Math.max(...positions)-Math.min(...positions)<=1);
  assert.equal(f.policy.scoring.correct,1);assert.equal(f.policy.scoring.incorrect,0);assert.equal(f.policy.scoring.unanswered,0);assert.equal(f.policy.resume.freezeQuestionAndOptionOrder,true);assert.equal(f.policy.submission.reviewAfterSubmissionOnly,true);assert.equal(f.releaseReady,false);assert.equal(f.officialExam,false);
 }
 assert.equal(questions,360);assert.equal(figures,30);
 return {questions,figures};
}
const counts=validate(forms);
const globalPositions=[0,0,0,0];forms.flatMap(f=>f.questions).forEach(q=>globalPositions[q.correctIndex]++);assert.deepEqual(globalPositions,[90,90,90,90]);
const mutations=[f=>f[1].questions.pop(),f=>f[1].questions[1].id=f[1].questions[0].id,f=>f[1].questions[0].furigana.prompt=[],f=>f[1].questions[0].sectionId='terms',f=>f[1].questions[0].rationalesVi[0]='unsupported',f=>f[1].questions[0].correctIndex=99,f=>{f[1].questions.slice(0,3).forEach(q=>q.correctIndex=0);},f=>f[1].policy.scoring.correct=2];
for(const mutate of mutations){const f=structuredClone(forms);mutate(f);assert.throws(()=>validate(f));}
for(const [field,digest]of Object.entries(baseline.unchangedCourseFields))assert.equal(hash(course[field]),digest,'unchanged '+field);
for(const old of baseline.originalMocks)assert.equal(hash(course.mocks.find(f=>f.id===old.id)),old.objectSha256,'original form and resume revision unchanged');
assert.equal(new Set(course.mocks.map(examStorageKey)).size,12,'isolated resume storage');
const lessonStems=new Set(course.lessons.flatMap(l=>l.questions.map(q=>q.promptJa)));
const allStems=new Set();for(const f of forms)for(const q of f.questions){assert(!lessonStems.has(q.promptJa),'lesson/mock collision');assert(!allStems.has(q.promptJa),'mock stem collision');allStems.add(q.promptJa);}
const stats=forms.map(f=>{const positions=[0,0,0,0];let uniqueLongestCorrect=0,uniqueShortestCorrect=0;for(const q of f.questions){positions[q.correctIndex]++;const lens=q.optionsJa.map(s=>Array.from(s.replace(/[\s。、「」：:]/g,'')).length);const key=lens[q.correctIndex];if(key===Math.max(...lens)&&lens.filter(x=>x===key).length===1)uniqueLongestCorrect++;if(key===Math.min(...lens)&&lens.filter(x=>x===key).length===1)uniqueShortestCorrect++;}return{id:f.id,questions:f.questions.length,minutes:f.durationMs/60000,positions,uniqueLongestCorrect,uniqueShortestCorrect};});
const report={status:'PASS_DATA_INVARIANTS_NOT_HUMAN_ORIGINALITY_OR_NATIVE_CERTIFICATION',forms:12,...counts,newQuestions:180,newFigures:15,optionRationales:1440,negativeControlsRejected:mutations.length,originalFormsAndCourseUnchanged:true,isolatedResumeKeys:12,globalPositions,stats,questionHashes:forms.flatMap(f=>f.questions.map(q=>({id:q.id,sha256:hash(q)}))),humanReviewed:false,releaseReady:false};
fs.writeFileSync(base+'reviews/twelve-mocks-qa.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,questionHashes:undefined}));

const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;const canonicalHash=x=>hash(canonical(x));
const frozen=read(base+'reviews/twelve-mocks-baseline.json');for(const [key,value] of Object.entries(frozen.unchangedFields))assert.equal(canonicalHash(course[key]),value,key);for(const item of frozen.originalMocks)assert.equal(canonicalHash(course.mocks.find(m=>m.id===item.id)),item.objectSha256,item.id);
assert.equal(course.mocks.length,12);for(const form of forms){const integrated=course.mocks.find(m=>m.id===form.id);assert(integrated);for(const q of form.questions){const actual=integrated.questions.find(x=>x.id===q.id);assert(actual);for(const key of ['promptJa','optionsJa','correctIndex','rationalesVi','furigana'])assert.deepEqual(actual[key],q[key],q.id+':'+key);}}console.log('SIX_PREEXISTING_FORMS_AND_ALL_NON_MOCK_FIELDS_UNCHANGED; 360_DRAFT_RUNTIME_MATCH');
