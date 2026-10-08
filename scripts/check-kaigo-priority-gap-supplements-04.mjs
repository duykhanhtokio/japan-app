import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir='docs/ssw-workspace/kaigo/';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const norm=s=>s.normalize('NFKC').replace(/\s/g,'');
const gitSha=b=>crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
export function validateC06(bundle,core,curriculum,npcs,vocabulary,evidence){
 assert.equal(bundle.modules.length,2);assert.deepEqual(bundle.coreCountsUnchanged,{ordinaryLessons:54,lessonQuestions:270,mockQuestions:60});
 const ids=new Set();const add=id=>{assert.equal(typeof id,'string');assert(!ids.has(id),'duplicate '+id);ids.add(id)};
 function gates(v){if(!v||typeof v!=='object')return;for(const [k,x] of Object.entries(v)){if(['domainHumanReviewed','nativeLanguageReviewed','publisherReviewed','rightsReviewed','runtimeIntegrated','appIntegrationReady','releaseReady'].includes(k))assert.equal(x,false,'gate '+k);if(x&&typeof x==='object')gates(x)}}
 gates(bundle);gates(evidence);
 let turns=0,qcount=0,sections=0,specs=0;const keys=[];
 const rubricMap=new Map(bundle.responseRubrics.map(r=>[r.id,r]));
 const allQ=core.flatMap(x=>x.questions||[]); const seenStems=new Set(allQ.map(q=>norm(q.promptJa||q.textJa||'')));
 const playerLines=new Set();
 for(const m of bundle.modules){
  add(m.id);assert(npcs.has(m.npcId));assert(m.vocabularyIds.length>0);m.vocabularyIds.forEach(v=>assert(vocabulary.has(v),'vocab '+v));
  const base=core.find(x=>x.id===m.baseLessonId);assert(base);assert.equal(base.curriculumDay,m.curriculumDay);
  const day=curriculum.days.find(x=>x.day===m.curriculumDay);assert.equal(day.lessonId,base.id);
  const p=m.replacementPlan;assert.equal(p.status,'NOT_READY_FOR_REPLACEMENT');assert.equal(p.replacementReady,false);assert.equal(p.selectedInCurriculum,false);assert.equal(p.originalLessonRetained,true);assert.equal(p.originalMandatoryBlocksAlsoAssigned,false);assert.equal(p.durationMeasured,false);assert.equal(p.newMandatoryVocabularyCount,0);assert.equal(p.blocks.reduce((a,b)=>a+b.minutes,0),30);
  assert.equal(m.newTermIds.length,0);assert.equal(m.knowledgeModule.sections.length,4);sections+=4;
  assert(m.scopeLimitsVi.length>=3);assert(m.knowledgeModule.retrievalCheck.expectedVi.length>0);
  assert(m.dialogue.length>=6&&m.dialogue.length<=12);turns+=m.dialogue.length;
  m.dialogue.forEach((t,i)=>{add(t.id);assert.equal(t.speaker,i%2?'player':'npc');assert(t.ja&&t.vi);assert(!/[À-ỹ]/.test(t.ja));if(t.speaker==='npc')assert.equal(t.npcId,m.npcId);else {assert(!playerLines.has(norm(t.ja)));playerLines.add(norm(t.ja));}});
  const tr=new Map(m.dialogue.map(t=>[t.id,t]));assert.equal(m.responseRubricIds.length,4);
  for(const id of m.responseRubricIds){const r=rubricMap.get(id);assert(r);assert.equal(r.moduleId,m.id);assert.equal(tr.get(r.playerTurnId)?.speaker,'player');assert.equal(tr.get(r.promptTurnId)?.speaker,'npc');if(r.nextTurnId)assert(tr.has(r.nextTurnId));checkRubric(r)}
  function checkRubric(r){add(r.id);assert(r.requiredMeanings.length>=2);r.requiredMeanings.forEach(x=>{add(x.id);assert(x.vi)});assert(r.acceptableJa.length>=2);assert.equal(r.evaluationPolicy.exactStringMatchRequired,false);assert.equal(r.evaluationPolicy.runtimeImplemented,false);assert.deepEqual(r.assessmentCases.map(x=>x.expected),['accept_meaning','clarify_missing_information','correct_before_advance']);r.assessmentCases.forEach(c=>{add(c.id);assert.equal(c.specOnly,true);assert(c.inputJa)});specs+=3;}
  assert(m.reading.ja&&m.reading.vi);assert.equal(m.reading.fictional,true);
  assert.equal(m.questions.length,5);qcount+=5;
  for(const q of m.questions){add(q.id);assert(q.promptJa&&q.promptVi);assert.equal(q.optionsJa.length,4);assert.equal(q.optionsVi.length,4);assert.equal(q.rationalesVi.length,4);assert.equal(new Set(q.optionsJa.map(norm)).size,4);assert(Number.isInteger(q.correctIndex)&&q.correctIndex>=0&&q.correctIndex<4);assert(q.rationalesVi[q.correctIndex].startsWith('Đúng:'));q.rationalesVi.forEach((x,i)=>assert(x.startsWith(i===q.correctIndex?'Đúng:':'Sai:')));const n=norm(q.promptJa);assert(!seenStems.has(n),'duplicate question stem');seenStems.add(n);keys.push(q.correctIndex);}
  assert(m.transferPractice.modelJa);assert.equal(m.transferPractice.sameDaySlot.additionalMandatoryMinutes,0);checkRubric(m.transferPractice.rubric);
 }
 assert.equal(turns,16);assert.equal(sections,8);assert.equal(qcount,10);assert.equal(specs,30);
 assert.equal(rubricMap.size,8);assert.equal(evidence.retentionRows.length,6);assert(evidence.retentionRows.every(x=>x.ready===false));
 assert.equal(evidence.loadReview.measured,false);assert.equal(evidence.loadReview.observedLearnerData,null);
 const a=bundle.modules[0],b=bundle.modules[1];
 assert.equal(a.curriculumDay,47);assert.equal(b.curriculumDay,53);
 assert.equal(a.npcId,'kaigo-npc-nurse');assert.equal(b.npcId,'kaigo-npc-care-peer');
 assert(a.contextVi.includes('sau gọi trợ giúp'));assert(b.contextVi.includes('Diễn tập ngoại tuyến'));
 assert(a.dialogue[5].ja.includes('つながり'));assert(a.dialogue[5].ja.includes('指示'));
 assert(b.dialogue[1].ja.includes('まだ救急への連絡はできていません'));
 assert(b.dialogue[1].ja.includes('今すぐ'));assert(b.dialogue[7].ja.includes('接続を確認'));
 assert(b.dialogue[7].ja.includes('対応完了とはしません'));
 assert(a.reading.separateCases&&b.reading.separateCases);
 assert.equal(bundle.sources.length,4);assert(bundle.sources.every(x=>x.publishSourceBytes===false));
 assert.equal(bundle.candidateCounts.questions,10);
 const counts=[0,1,2,3].map(k=>keys.filter(x=>x===k).length);assert(Math.max(...counts)-Math.min(...counts)<=1);
 for(let i=2;i<keys.length;i++)assert(!(keys[i]===keys[i-1]&&keys[i]===keys[i-2]));
 return {modules:2,turns,questions:qcount,rubrics:10,unexecutedAssessmentSpecs:specs,answerPositions:counts,idsChecked:ids.size};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const b=read(dir+'drafts/priority-gap-supplements-04.json'),e=read(dir+'reviews/priority-gap-supplements-04-evidence.json');
 assert.equal(e.candidateIdentity.gitBlobSha,gitSha(Buffer.from(JSON.stringify(b,null,2)+'\n')));
 const permissionPath=path.join(root,dir+'reviews/priority-gap-partial-repair-06.json');
 const permission=fs.existsSync(permissionPath)?read(dir+'reviews/priority-gap-partial-repair-06.json'):null;
 const {verifyHistoricalInput}=await import('./check-kaigo-priority-gap-permission-repair.mjs');
 for(const f of e.inputSnapshot){const bytes=fs.readFileSync(path.join(root,f.path));if(permission)verifyHistoricalInput(f.path,bytes,f.gitBlobSha,permission);else assert.equal(gitSha(bytes),f.gitBlobSha,'baseline '+f.path);}

 const names=['foundation','week2','movement','eating','excretion','hygiene','housework','review'];
 const core=names.flatMap(n=>read(dir+'drafts/'+n+'-lessons.json').lessons);
 assert.equal(core.length,54);assert.equal(core.reduce((s,l)=>s+l.questions.length,0),270);
 const mocks=['skills','japanese'].map(n=>read(dir+'drafts/kaigo-'+n+'-mock-01.json'));assert.equal(mocks.reduce((s,m)=>s+m.questions.length,0),60);
 const prior=['01','02','03'].flatMap(n=>read(dir+'drafts/priority-gap-supplements-'+n+'.json').modules);
 const npc=new Set(read(dir+'drafts/npc-roster.json').npcs.map(x=>x.id));
 const vocab=new Set(['foundation','week2','housework'].flatMap(n=>{const j=read(dir+'drafts/'+n+'-vocabulary.json');return (j.entries||j.vocabulary).map(x=>x.id)}));
 const curriculum=read(dir+'drafts/curriculum-56-days.json');
 for(const m of e.retentionRows){const base=core.find(l=>l.id===m.baseLessonId);assert(base.objectivesVi.includes(m.originalObjectiveVi));}
 const result=validateC06(b,[...core,...mocks,...prior],curriculum,npc,vocab,e);
 const controls=[x=>x.modules[0].replacementPlan.selectedInCurriculum=true,x=>x.review.releaseReady=true,x=>x.modules[1].npcId='kaigo-npc-nurse',x=>x.modules[1].dialogue[1].ja='発信したので、連絡済みです。',x=>x.modules[0].contextVi='記録を完成してから救急要請する。'];
 for(const mutate of controls){const x=structuredClone(b);mutate(x);assert.throws(()=>validateC06(x,[...core,...mocks,...prior],curriculum,npc,vocab,e))}
 const screen=read(dir+'reviews/priority-gap-supplements-04-source-screen.json');assert.equal(screen.sourcePages,276);assert.equal(screen.matchedFields,0);assert.equal(screen.rightsCertified,false);assert.equal(screen.fields,350);assert.equal(screen.fieldsAtLeast60Codepoints,67);
 console.log(JSON.stringify({status:'PASS_structural_integrity_not_quality_approval',...result,immutableInputBlobs:e.inputSnapshot.length,coreLessons:54,coreQuestions:270,mockQuestions:60,negativeControlsRejected:controls.length,learnerTimingExecuted:false,semanticEvaluatorExecuted:false}));
}

