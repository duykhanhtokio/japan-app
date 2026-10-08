import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const root='docs/ssw-workspace/kaigo/';
const read=n=>JSON.parse(fs.readFileSync(root+'drafts/'+n,'utf8'));
const lessons=read('review-lessons.json').lessons;
const rubric=read('review-response-rubrics.json').lessons;
const days=read('curriculum-56-days.json').days;
const vocab=fs.readdirSync(root+'drafts').filter(x=>x.endsWith('-vocabulary.json')).flatMap(n=>{const x=read(n);return x.entries??x.vocabulary;}).concat(read('knowledge-glossary.json').entries);
const vocabIds=new Set(vocab.map(v=>v.id));assert.equal(vocabIds.size,vocab.length);assert.equal(new Set(vocab.map(v=>v.termJa)).size,vocab.length);
const baseline=fs.readdirSync(root+'drafts').filter(n=>n.endsWith('-lessons.json')&&n!=='review-lessons.json').flatMap(n=>read(n).lessons);
const ids=new Set(baseline.flatMap(l=>[l.id,...l.questions.map(q=>q.id)]));
const playerLines=new Set(baseline.flatMap(l=>l.dialogue.filter(t=>t.speaker==='player').map(t=>t.textJa)));
const npcs=new Set(read('npc-roster.json').npcs.map(n=>n.id));
const add=id=>{assert(id&&!ids.has(id),'duplicate ID '+id);ids.add(id);};
const gates=['domainHumanReviewed','nativeLanguageReviewed','publisherReviewed','rightsReviewed','runtimeIntegrated','releaseReady'];
const review=r=>{assert.equal(r.aiEditorialReviewed,true);gates.forEach(k=>assert.equal(r[k],false));};
const question=q=>{add(q.id);assert(q.promptJa);assert.equal(new Set(q.optionsJa).size,4);assert.equal(q.rationalesVi.length,4);assert(Number.isInteger(q.correctIndex)&&q.correctIndex>=0&&q.correctIndex<4);q.rationalesVi.forEach((s,i)=>assert(s.startsWith(i===q.correctIndex?'Đúng:':'Sai:')));review(q.review);};
const source=l=>{assert.equal(l.sourceMetadata.sha256,'997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54');assert.equal(l.sourceMetadata.publishSourceBytes,false);};
assert.equal(lessons.length,5);assert.equal(rubric.length,5);
let turns=0,responses=0,cases=0,checks=0;
const positions=[];
for(const [i,l] of lessons.entries()){
 add(l.id);assert.equal(l.curriculumDay,[50,51,52,53,56][i]);assert(npcs.has(l.npcId));review(l.review);source(l);
 assert.equal(l.knowledgeVi.length,4);assert.equal(l.knowledgeModule.sections.length,4);
 assert(l.knowledgeModule.sections.every((s,j)=>s.explanationVi===l.knowledgeVi[j]&&s.explanationVi.length>100&&s.sourcePages.length>0&&s.sourcePages.every(p=>l.sourceRefs.some(r=>r.printedPage===p.printedPage&&r.pdfPage===p.pdfPage))));
 assert(l.sourceRefs.every(p=>p.pdfPage===p.printedPage+2));assert(l.vocabularyIds.every(id=>vocabIds.has(id)));assert(l.knowledgeModule.conceptTermIds.every(id=>l.vocabularyIds.includes(id)));
 const day=days[l.curriculumDay-1];assert.equal(day.lessonId,l.id);assert.deepEqual(day.npcIds,[l.npcId]);assert.deepEqual(day.dailyBlocks,l.dailyPractice.blocks);assert.deepEqual(l.dailyPractice.blocks.map(b=>b.minutes),[5,5,5,10,5]);assert.deepEqual(l.dailyPractice.introducedVocabularyIds,[]);assert.equal(l.dailyPractice.durationMeasured,false);assert.equal(l.dailyPractice.activities.reduce((n,a)=>n+a.minutes,0),30);
 assert(l.dialogue.length>=6&&l.dialogue.length<=12);turns+=l.dialogue.length;
 l.dialogue.forEach((t,j)=>{assert.equal(t.turn,j+1);assert.equal(t.speaker,j%2?'player':'npc');assert(t.textJa&&t.meaningVi);assert(!/\\u[0-9a-f]{4}|[\u00c0-\u1ef9]/iu.test(t.textJa));if(t.speaker==='player'){assert(!playerLines.has(t.textJa),'duplicate player line');playerLines.add(t.textJa);}});
 assert(l.reading.textJa&&l.reading.meaningVi);assert.equal(l.questions.length,5);
 for(const q of l.questions){question(q);positions.push(q.correctIndex);checks++;assert.equal(q.practiceScope,'lesson_check_not_full_mock');}
 assert.equal(l.expressions.length,2);l.expressions.forEach(e=>{add(e.id);assert(l.dialogue.some(t=>t.speaker==='player'&&t.textJa===e.textJa&&t.meaningVi===e.meaningVi));});
 const rb=rubric.find(r=>r.lessonId===l.id);assert(rb);assert.equal(rb.turns.length,l.dialogue.filter(t=>t.speaker==='player').length);
 rb.turns.forEach(t=>{add(t.id);assert.equal(t.promptTurn,t.playerTurn-1);assert.equal(t.acceptedExamplesJa[0],l.dialogue[t.playerTurn-1].textJa);assert.equal(new Set(t.acceptedExamplesJa).size,2);assert(t.requiredMeaningVi.length>=2);assert(t.assessmentVi.partial&&t.assessmentVi.clarification&&t.assessmentVi.asrUncertain);responses++;});
 assert.equal(rb.scenarioAssessmentCases.length,4);assert.equal(new Set(rb.scenarioAssessmentCases.map(c=>c.expected)).size,4);
 rb.scenarioAssessmentCases.forEach(c=>{add(c.id);assert(c.inputJa);assert(rb.turns.some(t=>t.playerTurn===c.playerTurn));if(c.expected==='bounded_clarification'){assert.equal(c.inputSpeaker,'npc');assert(c.expectedPlayerReplyJa);assert.equal(c.advance,false);}else{assert.equal(c.inputSpeaker,'player');assert.equal(c.advance,c.expected==='complete_semantic_variant');}cases++;});
 assert(l.transferPractice.contextVi&&l.transferPractice.taskVi&&l.transferPractice.boundaryVi);
}
assert.equal(turns,34);assert.equal(checks,25);assert.equal(responses,17);assert.equal(cases,20);
const dist=p=>[0,1,2,3].map(n=>p.filter(x=>x===n).length);
const balance=p=>{const n=dist(p);assert(Math.max(...n)-Math.min(...n)<=1);assert(p.every((x,i)=>i<2||!(x===p[i-1]&&x===p[i-2])));return n;};
balance(positions);
const kanji=/[\u3400-\u4dbf\u4e00-\u9fff々]/u;
const ruby=(runs,s)=>{assert(Array.isArray(runs));assert.equal(runs.map(x=>x.text).join(''),s);runs.forEach(x=>{if(kanji.test(x.text)){assert(x.readingKana&&/^[ぁ-ゖー]+$/u.test(x.readingKana),'missing/invalid reading '+x.text);assert(!kanji.test(x.readingKana));}});};
const supports=read('kaigo-mock-review-support-vi.json');assert.equal(supports.entries.length,60);assert.equal(supports.displayGate,'after_submission_only');assert.equal(supports.humanNativeReviewed,false);
const supportIds=new Set(supports.entries.map(x=>x.questionId));assert.equal(supportIds.size,60);
let mockQuestions=0,figures=0;const mockStats=[];
for(const [n,count,min,day,blueprint] of [
 ['kaigo-skills-mock-01',45,60,54,{fundamentals:10,mind_body:6,communication:4,physical_care:20,cbt_practical:5}],
 ['kaigo-japanese-mock-01',15,30,55,{terms:5,dialogue:5,documents:5}]
]){
 const f=read(n+'.json');add(f.id);source(f);review(f.review);assert.equal(f.language,'ja');assert.equal(f.questionCount,count);assert.equal(f.questions.length,count);assert.equal(f.durationMinutes,min);assert.equal(f.durationMs,min*60*1000);assert.equal(f.curriculumDay,day);assert.equal(days[day-1].mockId,f.id);assert.equal(days[day-1].plannedMinutes,min);assert.deepEqual(days[day-1].dailyBlocks,[]);assert.deepEqual(f.sectionBlueprint,blueprint);
 const got={};for(const q of f.questions){question(q);got[q.sectionId]=(got[q.sectionId]??0)+1;assert(q.sourceRefs.every(p=>p.pdfPage===p.printedPage+2));ruby(q.furigana.prompt,q.promptJa);q.optionsJa.forEach((v,i)=>ruby(q.furigana.options[i],v));if(q.passageJa)ruby(q.furigana.passage,q.passageJa);if(q.figurePath){assert.equal(q.sectionId,'cbt_practical');assert(fs.existsSync(root+'drafts/'+q.figurePath));const svg=fs.readFileSync(root+'drafts/'+q.figurePath,'utf8');assert(svg.startsWith('<svg'));assert(!/https?:\/\/[^\s]*\.(png|jpg)|<image|<script/.test(svg));ruby(q.furigana.figureDescription,q.figureDescriptionJa);assert.equal(q.figureHumanReviewed,false);figures++;}const v=supports.entries.find(x=>x.questionId===q.id);assert(v&&v.promptVi&&v.optionsVi.length===4&&v.optionsVi.every(s=>s));assert.equal(v.displayGate,'after_submission_only');if(q.passageJa)assert(v.passageVi);if(q.figurePath)assert(v.figureDescriptionVi);mockQuestions++;}
 assert.deepEqual(got,blueprint);const distribution=balance(f.questions.map(q=>q.correctIndex));assert.equal(f.officialExam,false);assert.equal(f.runtimeIntegrated,false);assert.equal(f.appIntegrationReady,false);assert.equal(f.measuredDuration,false);assert.equal(f.policy.scoring.correct,1);assert.equal(f.policy.scoring.incorrect,0);assert.equal(f.policy.scoring.unanswered,0);assert.equal(f.policy.submission.reviewAfterSubmissionOnly,true);assert.equal(f.policy.resume.freezeQuestionAndOptionOrder,true);mockStats.push({id:n,questions:count,minutes:min,distribution});
}
assert.equal(mockQuestions,60);assert.equal(figures,5);assert.equal(new Set([...lessons.flatMap(l=>l.questions.map(q=>q.promptJa)),...['kaigo-skills-mock-01','kaigo-japanese-mock-01'].flatMap(n=>read(n+'.json').questions.map(q=>q.promptJa))]).size,85);
const manifest=read('week-08-manifest.json');assert.equal(manifest.plannedMinutes,240);assert.equal(days.slice(49).reduce((n,d)=>n+d.plannedMinutes,0),240);assert.equal(manifest.durationMeasured,false);assert.equal(manifest.releaseReady,false);
const plan=JSON.parse(fs.readFileSync(root+'approved-plan.json','utf8'));assert.equal(plan.production.lessonsAuthored,baseline.length+lessons.length);assert.equal(plan.production.lessonQuestionsAuthored,baseline.concat(lessons).reduce((n,l)=>n+l.questions.length,0));const activeMockPaths=read('mock-collection.json').forms.map(f=>f.path);assert.equal(plan.production.mockQuestionsAuthored,activeMockPaths.flatMap(p=>read(p).questions).length);assert.equal(plan.approved.mockExpansion.totalMocks,activeMockPaths.length);assert.equal(plan.approved.firstMockPolicy.runtimeImplemented,false);
const names=['review-lessons.json','review-response-rubrics.json','kaigo-skills-mock-01.json','kaigo-japanese-mock-01.json','kaigo-mock-review-support-vi.json','week-08-manifest.json','curriculum-56-days.json',...Array.from({length:5},(_,i)=>`mock-figures/skills-practical-0${i+1}.svg`)];
const hashes=Object.fromEntries(names.map(n=>[n,crypto.createHash('sha256').update(fs.readFileSync(root+'drafts/'+n)).digest('hex')]));
const report={status:'PASS bounded structural/content invariants; not human/native/clinical/runtime certification',week:8,lessons:5,dialogueTurns:turns,lessonQuestions:checks,playerTurnRubrics:responses,scenarioCaseSpecs:cases,mockQuestions,figures,mockStats,plannedMinutes:240,durationMeasured:false,humanReviewed:false,runtimeIntegrated:false,releaseReady:false,hashes,limits:['Editorial interpretation, distractor quality and originality require reading beyond assertions','Furigana preserves surface and has kana coverage; this is not native pronunciation certification','Scoring/resume/submission are approved specifications, not executed app behavior','Figures are new draft SVGs; domain review pending','No measured learner timing or official-exam equivalence']};
if(process.argv.includes('--write-report'))fs.writeFileSync(root+'drafts/week8-validation.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS week8 draft:5lessons34turns25checks17rubrics20case specs;45skills+15Japanese,5newfigures. Human/runtime/time gates pending.');
