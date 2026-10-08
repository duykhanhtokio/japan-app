import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const base='docs/ssw-workspace/kaigo/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const revision=read(base+'drafts/chapter-revision-2026-10-08.json');
const audit=read(base+'reviews/chapter-coverage-2026-10-08.json');
const inventory=read(base+'drafts/source-vocabulary-inventory-2026-10-08.json');
const course=read('src/data/kaigo/content.json');
const old=read(base+'drafts/curriculum-56-days.json');
const counts=xs=>xs.reduce((c,x)=>(c[x]=(c[x]??0)+1,c),{});
assert.equal(audit.knowledgeItems.length,159);
assert.equal(new Set(audit.knowledgeItems.map(x=>x.id)).size,159);
assert.equal(new Set(audit.knowledgeItems.map(x=>x.chapterId)).size,14);
assert.deepEqual(counts(audit.knowledgeItems.map(x=>x.before)),audit.counts.knowledgeBefore);
assert.deepEqual(counts(audit.knowledgeItems.map(x=>x.after)),audit.counts.knowledgeAfter);
assert(audit.knowledgeItems.some(x=>x.after==='nông'),'do not turn text supplements into full practical coverage');
assert.equal(audit.counts.allSourceKnowledgeFullyCovered,false);
assert.equal(audit.nationalSource.full713QuestionsAudited,false);
assert.equal(audit.nationalChapters.length,12);
for(const row of audit.knowledgeItems){
 assert(['đủ','thiếu','nông'].includes(row.before)&&['đủ','thiếu','nông'].includes(row.after));
 assert(row.sourcePrintedPages&&row.findingVi&&row.remainingVi);
 assert(row.afterEvidence.length);
 for(const e of row.afterEvidence){const m=revision.modules.find(m=>m.id===e.moduleId);assert(m&&m.lessonId===e.lessonId&&m.day===e.day);assert(m.coverageItemIds.includes(row.id));}
}
assert.equal(revision.modules.length,54);
assert.equal(revision.modules.flatMap(m=>m.retrievalProbes).length,121);
const probeIds=new Set();
for(const m of revision.modules){
 const l=course.lessons.find(l=>l.id===m.lessonId);assert(l&&l.day===m.day);
 assert.equal(l.knowledgeTitleVi,m.titleVi);assert.deepEqual(l.knowledgeProbes,m.retrievalProbes.map(({id,promptVi,expectedVi})=>({id,promptVi,expectedVi})));
 for(const p of m.retrievalProbes){assert(p.id&&!probeIds.has(p.id)&&p.promptVi&&p.expectedVi&&p.visibleAfterAttempt===true);probeIds.add(p.id);}
 assert.deepEqual(l.knowledgeSectionsVi.slice(0,m.knowledgeSectionsVi.length),m.knowledgeSectionsVi);
 assert(l.activeTermIds.length<=8&&l.activeTermIds.length>0);
 assert.equal(new Set(l.termIds).size,l.termIds.length);
 assert.deepEqual([...l.activeTermIds,...l.referenceTermIds].sort(),[...l.termIds].sort());
 assert(l.practiceRevision&&l.contentRevision!==l.practiceRevision);
}
assert.equal(inventory.entries.length,287);
for(const e of inventory.entries)assert(course.terms.some(t=>t.termJa===e.termJa&&t.readingJa===e.readingJa),'source word missing from runtime '+e.id);
assert.equal(revision.languageTasks.length,52);
assert.equal(revision.languageTasks.filter(t=>t.kind==='dialogue_comprehension').length,29);
assert.equal(revision.languageTasks.filter(t=>t.kind==='document_comprehension').length,23);
assert.equal(new Set(revision.languageTasks.map(t=>t.sourcePrintedPage)).size,52);
assert.equal(new Set(revision.languageTasks.map(t=>t.day)).size,52,'one short reading per assigned day');
for(const t of revision.languageTasks){const l=course.lessons.find(l=>l.id===t.lessonId);assert(l&&l.day===t.day);assert.deepEqual(l.languageTasks.find(x=>x.id===t.id),{id:t.id,titleVi:t.titleVi,textJa:t.textJa,promptVi:t.promptVi,expectedVi:t.expectedVi});}
assert.deepEqual(course.days.map(d=>[d.day,d.lessonId,d.mockId,d.plannedMinutes]),old.days.map(d=>[d.day,d.lessonId??null,d.mockId??null,d.plannedMinutes]),'keep day identities and full mock durations');
for(const d of course.days){assert.equal(Object.values(d.timeBlocks).reduce((a,b)=>a+b,0),d.plannedMinutes);assert.equal(d.plannedMinutes,d.day===54?60:30);}
assert.equal(course.days.reduce((s,d)=>s+d.plannedMinutes,0),1710);
assert.equal(course.days.filter(d=>d.week===8).reduce((s,d)=>s+d.plannedMinutes,0),240);
assert.equal(course.mocks.find(m=>m.id.includes('skills')).durationMs,60*60*1000);
assert.equal(course.mocks.find(m=>m.id.includes('japanese')).durationMs,30*60*1000);
assert.equal(revision.schedule.measuredWithLearners,false);assert.equal(course.humanReviewed,false);assert.equal(course.releaseReady,false);
const ui=fs.readFileSync('src/components/kaigo/KaigoCourse.tsx','utf8');assert(ui.includes('lesson.practiceRevision??lesson.contentRevision'),'preserve old lesson practice state');assert(ui.includes('lesson.contentRevision}:${probe.id}'),'separate revised knowledge attempts');
console.log(JSON.stringify({status:'PASS_CHAPTER_DATA_AND_SCHEDULE_NOT_HUMAN_APPROVAL',knowledgeSections:159,before:audit.counts.knowledgeBefore,after:audit.counts.knowledgeAfter,modules:54,knowledgeProbes:121,languageTasks:52,lexicalRecords:287,runtimeTerms:course.terms.length,totalMinutes:1710,ordinaryMinutes:30,skillsMinutes:60,timeMeasuredWithLearners:false}));
