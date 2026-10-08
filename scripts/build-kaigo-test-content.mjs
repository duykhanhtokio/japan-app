import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir='docs/ssw-workspace/kaigo/drafts/';
const inputs=new Map();
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function read(name){const p=dir+name,b=fs.readFileSync(path.join(root,p));inputs.set(p,hash(b));return JSON.parse(b);}
const groups=['foundation','week2','movement','eating','excretion','hygiene','housework','review'];
const serial=d=>JSON.stringify(d,null,2)+'\n';
const meanings=r=>(r?.requiredMeanings??r?.requiredMeaningVi??[]).map(x=>typeof x==='string'?x:x.vi);
const terms=groups.slice(0,7).flatMap(g=>{const b=read(g+'-vocabulary.json');return b.entries??b.vocabulary;}).concat(read('knowledge-glossary.json').entries,['01','02','03','04'].flatMap(n=>read('priority-gap-supplements-'+n+'.json').newConceptTerms)).map(x=>({id:x.id,termJa:x.termJa??x.ja,readingJa:x.readingJa??x.readingKana??x.kana,meaningVi:x.meaningVi??x.vi}));
assert.equal(new Set(terms.map(x=>x.id)).size,terms.length,'term ID uniqueness');
const npcs=read('npc-roster.json').npcs.map(x=>({id:x.id,nameJa:x.nameJa,roleVi:x.roleVi}));
const npcIds=new Set(npcs.map(x=>x.id));
const step=(x,r,npcId)=>({id:x.id,npcId,promptVi:x.promptVi??x.goalVi??x.promptCardVi??'',promptJa:x.promptJa??'',promptMeaningVi:x.promptMeaningVi??'',modelJa:x.modelJa??'',modelVi:x.modelVi??'',meaningsVi:meanings(r).length?meanings(r):x.meaningsVi??[x.goalVi].filter(Boolean),alternativesJa:r?.acceptableJa??r?.acceptedExamplesJa??x.acceptableJa??[],replyJa:x.afterAttemptCard?.ja??'',replyVi:x.afterAttemptCard?.vi??''});
const staged=f=>({id:f.id,titleVi:'Luyện kết quả theo từng bước',contextVi:f.contextVi??'',boundaryVi:'Tự đối chiếu ý; chỉ dùng dữ kiện và phản hồi của tình huống.',steps:f.steps.map(s=>step(s,s.rubric,s.npcId))});
const proposal=read('priority-gap-transfer-proposals-08.json');
function cloth(){const p=proposal.proposals[0];return {id:p.id,titleVi:'Khăn và phạm vi hỗ trợ',contextVi:p.contextVi,boundaryVi:p.objectiveVi,steps:p.dialogue.filter(t=>t.speaker==='player').map(t=>{const r=p.responseRubrics.find(r=>r.playerTurnId===t.id);assert(r,'cloth rubric');const i=p.dialogue.indexOf(t),before=p.dialogue[i-1],after=p.dialogue[i+1];return step({id:t.id,promptVi:meanings(r).join('; '),promptJa:before?.speaker==='npc'&&i===1?before.ja:'',promptMeaningVi:before?.speaker==='npc'&&i===1?before.vi:'',modelJa:t.ja,modelVi:t.vi,afterAttemptCard:after?.speaker==='npc'?{ja:after.ja,vi:after.vi}:undefined},r,t.npcId);})};}
function transfers(m){const t=m.transferPractice;if(!t)return [];const r=t.rubric;const legacy=[];
 const rc=t.residentConfirmation;
 if(rc?.steps){for(const x of rc.steps)legacy.push(step(x,{requiredMeaningVi:[x.goalVi],acceptableJa:x.acceptableJa},rc.npcId));}
 else if(rc?.modelJa)legacy.push(step({id:m.id+'-resident-confirm',promptVi:rc.promptVi,modelJa:rc.modelJa}, {requiredMeaningVi:[rc.promptVi],acceptableJa:rc.acceptableJa},'kaigo-npc-resident-a'));
 if(t.familyExplanation)legacy.push(step({id:m.id+'-family-explanation',promptVi:t.taskVi,modelJa:t.familyExplanation.modelJa}, {requiredMeanings:r.requiredMeanings.filter(x=>x.responseTarget==='family_explanation'),acceptableJa:t.familyExplanation.acceptableJa},'kaigo-npc-family'));
 const reportMeanings=r?.requiredMeanings?.filter(x=>!x.responseTarget||x.responseTarget==='care_lead_report')??t.expectedMeaningVi;
 legacy.push(step({id:t.id+'-report',promptVi:[rc?.outcomeCard?.vi,t.taskVi,t.responseRoleVi].filter(Boolean).join('\n'),modelJa:t.modelJa??'',modelVi:'',meaningsVi:t.expectedMeaningVi??[]}, {requiredMeanings:reportMeanings,acceptableJa:r?.acceptableJa},r?'kaigo-npc-care-lead':m.npcId));
 const result=[{id:t.id+'-legacy',titleVi:'Tình huống chuyển giao',contextVi:t.contextVi,boundaryVi:t.boundaryVi??m.scopeLimitsVi?.join('\n')??'',steps:legacy}];
 for(const key of ['rehearsalPlan09','rehearsalPlan10'])if(t[key]){const p=t[key];assert.equal(p.selectionGate.maximumRequiredVariantsPerRehearsal,1);assert.equal(p.selectionGate.candidateSelected,false);const v=p.defaultVariant;result.unshift(v.kind==='embedded_staged_flow'?staged(v.flow):cloth());}
 return result;
}
function question(q){return {id:q.id,promptJa:q.promptJa,promptVi:q.promptVi??'',optionsJa:q.optionsJa,optionsVi:q.optionsVi??[],correctIndex:q.correctIndex,rationalesVi:q.rationalesVi,rationalesJa:q.rationalesJa??[]};}
function lesson(m,rubrics,candidate=false){const k=m.knowledgeModule;const turns=m.dialogue.map((t,i)=>{const r=rubrics.find(r=>(t.turn!==undefined&&r.playerTurn===t.turn)||(t.id!==undefined&&r.playerTurnId===t.id));return {id:t.id??m.id+'-turn-'+(i+1),speaker:t.speaker,npcId:t.npcId??m.npcId,textJa:t.textJa??t.ja,meaningVi:t.meaningVi??t.vi,meaningsVi:meanings(r),alternativesJa:r?.acceptedExamplesJa??r?.acceptableJa??[]};});
 for(const t of turns){assert(npcIds.has(t.npcId),'dialogue NPC');if(t.speaker==='player')assert(t.meaningsVi.length,'player rubric '+t.id);}
 return {id:m.id,day:m.curriculumDay,titleVi:m.titleVi,npcId:m.npcId,playerRoleVi:m.playerRoleVi,contextVi:m.contextVi,candidate,baseLessonId:m.baseLessonId??m.id,objectivesVi:m.objectivesVi??[],knowledgeSummaryJa:k?.summaryJa??'',knowledgeSectionsVi:k?.sections.map(s=>s.explanationVi)??m.knowledgeVi??[],retrieval:k?.retrievalCheck??null,contrast:k?.caseContrastVi??null,termIds:[...(m.vocabularyIds??[]),...(k?.conceptTermIds??[])],inlineNotes:m.inlineConceptNotes?.map(x=>({termJa:x.ja,readingJa:x.kana,meaningVi:x.vi}))??[],expressions:m.expressions.map(x=>({textJa:x.textJa??x.ja,meaningVi:x.meaningVi??x.vi})),dialogue:turns,transfers:transfers(m),readingJa:m.reading.textJa??m.reading.ja,readingVi:m.reading.meaningVi??m.reading.vi,questions:m.questions.map(question),plannedMinutes:30};
}
const lessons=groups.flatMap(g=>{const b=read(g+'-lessons.json'),rb=read(g+'-response-rubrics.json');return b.lessons.map(m=>lesson(m,rb.lessons.find(r=>r.lessonId===m.id).turns));});
const candidates=['01','02','03','04'].flatMap(n=>{const b=read('priority-gap-supplements-'+n+'.json');return b.modules.map(m=>lesson(m,b.responseRubrics.filter(r=>r.moduleId===m.id),true));});
const support=read('kaigo-mock-review-support-vi.json');
const mocks=['skills','japanese'].map(kind=>{const m=read('kaigo-'+kind+'-mock-01.json');return {id:m.id,version:m.version,titleVi:kind==='skills'?'Thi thử kỹ năng':'Thi thử tiếng Nhật',durationMs:m.durationMs,questions:m.questions.map(q=>{const vi=support.entries.find(x=>x.questionId===q.id);assert(vi,'mock Vietnamese review');const x={...question(q),promptVi:vi.promptVi,optionsVi:vi.optionsVi,passageJa:q.passageJa??'',passageVi:vi.passageVi??'',figureDescriptionJa:q.figureDescriptionJa??'',figureDescriptionVi:vi.figureDescriptionVi??'',figureKey:q.figurePath?path.basename(q.figurePath,'.svg'):null,furigana:q.furigana};if(q.figurePath){const p=dir+q.figurePath;inputs.set(p,hash(fs.readFileSync(path.join(root,p))));}return x;})};});
const days=read('curriculum-56-days.json').days.map(d=>({day:d.day,week:d.week,titleVi:d.titleVi,plannedMinutes:d.plannedMinutes,lessonId:d.lessonId??null,mockId:d.mockId??null}));
for(const l of [...lessons,...candidates])l.contentRevision=hash(serial(l));
for(const m of mocks)m.contentRevision=hash(serial(m));
assert.equal(lessons.length,54);assert.equal(lessons.flatMap(l=>l.questions).length,270);assert.equal(candidates.length,8);assert.equal(mocks.flatMap(m=>m.questions).length,60);assert.equal(days.length,56);
const content={version:1,mode:'publisher_requested_test_only',humanReviewed:false,releaseReady:false,days,lessons,candidates,terms,npcs,mocks};
const out='src/data/kaigo/content.json';fs.mkdirSync(path.dirname(path.join(root,out)),{recursive:true});const bytes=serial(content);fs.writeFileSync(path.join(root,out),bytes);
const manifest={version:1,date:'2026-10-08',authorizationVi:'Chủ dự án yêu cầu hoàn thiện, lưu GitHub và đưa vào app để kiểm tra; chỉ nội bộ kiểm thử, không chứng nhận human review hoặc phát hành.',baselineRemoteCommit:'dd83c9ec1f1ecd0ad7dc02d884805b62190fa05c',output:{path:out,sha256:hash(bytes)},inputs:[...inputs].map(([path,sha256])=>({path,sha256})),counts:{days:56,lessons:54,lessonQuestions:270,optionalCandidates:8,optionalCandidateQuestions:40,mocks:2,mockQuestions:60,npcs:npcs.length,terms:terms.length},candidateSelectionChanged:false,curriculumChanged:false,humanReviewed:false,releaseReady:false};
fs.writeFileSync(path.join(root,'docs/ssw-workspace/kaigo/reviews/app-test-content-manifest.json'),serial(manifest));
console.log(JSON.stringify({status:'EXPORTED_TEST_CONTENT',...manifest.counts,bytes:Buffer.byteLength(bytes)}));
