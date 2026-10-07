import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { validateCandidateBatch } from './check-kaigo-priority-gap-supplements-02.mjs';
const root='docs/ssw-workspace/kaigo/';
const read=p=>JSON.parse(fs.readFileSync(root+p,'utf8'));
const gitBlob=p=>{const b=fs.readFileSync(p);return crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');};
const norm=s=>s.normalize('NFKC').replace(/\s+/gu,'');
const bundles=['01','02'].map(n=>read('drafts/priority-gap-supplements-'+n+'.json'));
const modules=bundles.flatMap(b=>b.modules);
const lessonFiles=['foundation','week2','movement','eating','excretion','hygiene','housework','review'];
const lessons=lessonFiles.flatMap(n=>read('drafts/'+n+'-lessons.json').lessons);
const byId=new Map([...lessons,...modules].map(x=>[x.id,x]));
const audit=read('reviews/priority-gap-replacement-audit-03.json');
const timing=read('reviews/priority-gap-timing-protocol-03.json');
assert.equal(audit.status,'NOT_READY_FOR_REPLACEMENT');
assert.equal(modules.length,4);
assert.equal(modules.flatMap(m=>m.dialogue).length,36);
assert.equal(modules.flatMap(m=>m.questions).length,20);
assert.equal(bundles.flatMap(b=>b.responseRubrics).length,16);
assert.equal(bundles.flatMap(b=>b.responseRubrics.flatMap(r=>r.assessmentCases)).length,48);
assert.equal(lessons.length,54);
assert.equal(lessons.flatMap(l=>l.questions).length,270);
assert.equal(audit.capabilityRows.length,15);
const uniqueRows=new Set(audit.capabilityRows.map(r=>r.id));
assert.equal(uniqueRows.size,15);
for(const r of audit.capabilityRows){
 const b=byId.get(r.baseLessonId);assert(b);
 assert(r.baseObjectiveIndices.every(i=>Number.isInteger(i)&&i>=0&&i<b.objectivesVi.length));
 assert(r.evidence.length>0);
 for(const e of r.evidence){assert(byId.has(e.lessonId));assert.equal(e.day,byId.get(e.lessonId).curriculumDay);assert(e.locator);}
 assert.equal(r.humanReviewed,false);
}
for(const m of modules){
 const b=byId.get(m.baseLessonId);
 const rowSet=audit.capabilityRows.filter(r=>r.baseLessonId===b.id);
 for(let i=0;i<b.objectivesVi.length;i++)assert(rowSet.some(r=>r.baseObjectiveIndices.includes(i)),b.id+' objective '+i);
 assert.equal(m.replacementPlan.replacementReady,false);
 assert.equal(m.replacementPlan.selectedInCurriculum,false);
 assert.equal(m.replacementPlan.originalMandatoryBlocksAlsoAssigned,false);
 assert.equal(m.replacementPlan.replacementAuditRef,'reviews/priority-gap-replacement-audit-03.json');
 assert.deepEqual(m.replacementPlan.blocks,b.dailyPractice.blocks);
 const decision=audit.candidateDecisions.find(d=>d.moduleId===m.id);assert(decision);
 assert.equal(decision.replacementReady,false);assert.equal(decision.reviewerName,null);assert.equal(decision.reviewedAt,null);
 const protocol=timing.records.find(p=>p.moduleId===m.id);assert(protocol);
 assert.equal(protocol.observed,false);
 assert.equal(protocol.activities.reduce((s,a)=>s+a.budgetSeconds,0),1800);
 assert.deepEqual(protocol.activities,m.replacementPlan.blocks.map(b=>({activity:b.activity,budgetSeconds:b.minutes*60})));
 assert(Object.values(protocol.dataToRecord).every(v=>v===null));
}
for(const s of audit.inputSnapshot.filter(x=>!x.mutableInThisUnit))assert.equal(gitBlob(s.path),s.gitBlobSha,'immutable input: '+s.path);
function checkFlags(v){if(Array.isArray(v))return v.forEach(checkFlags);if(v&&typeof v==='object'){if(v.review)for(const flag of Object.values(v.review))assert.equal(flag,false);Object.values(v).forEach(checkFlags);}}
[bundles,audit,timing].forEach(checkFlags);
assert.equal(audit.sourceVerification.hashRecomputed,true);
assert.equal(audit.sourceVerification.sha256,audit.similarity.sourceSha256);
assert.equal(audit.similarity.sourcePages,276);
assert.equal(audit.similarity.matchedFields,audit.similarity.matches.length);
assert.equal(audit.similarity.rightsCertified,false);
assert.equal(audit.loadAudit.durationMeasured,false);
assert.equal(audit.validation.appTestsExecuted,false);
assert.equal(audit.validation.semanticEvaluatorExecuted,false);
const vocabFiles=['foundation','week2','movement','eating','excretion','hygiene','housework'].map(n=>'drafts/'+n+'-vocabulary.json').concat('drafts/knowledge-glossary.json');
const vocab=vocabFiles.flatMap(p=>{const d=read(p);return d.entries??d.vocabulary;});
const ids=vocab.map(x=>x.id);
assert.equal(new Set(ids).size,ids.length);
assert(modules.every(m=>m.vocabularyIds.every(id=>ids.includes(id)||bundles[0].newConceptTerms.some(t=>t.id===id))));
const npcs=read('drafts/npc-roster.json').npcs.map(x=>x.id);
validateCandidateBatch(bundles[1],lessons,npcs,ids);
function noDuplicatePlayer(candidateModules){
 const seen=new Map(lessons.flatMap(l=>l.dialogue.filter(t=>t.speaker==='player').map(t=>[norm(t.ja??t.textJa),l.id])));
 for(const m of candidateModules)for(const t of m.dialogue.filter(t=>t.speaker==='player')){
  const k=norm(t.ja);assert(!seen.has(k),t.id+' duplicates '+seen.get(k));seen.set(k,t.id);
 }
}
noDuplicatePlayer(modules);
const invalidVocab=structuredClone(bundles[1]);invalidVocab.modules[0].vocabularyIds.push('unknown-term');
assert.throws(()=>validateCandidateBatch(invalidVocab,lessons,npcs,ids),/canonical vocabulary links/);
const copiedCore=structuredClone(modules);copiedCore[0].dialogue.find(t=>t.speaker==='player').ja=lessons[0].dialogue.find(t=>t.speaker==='player').textJa;
assert.throws(()=>noDuplicatePlayer(copiedCore),/duplicates/);
const badFlags=structuredClone(audit);badFlags.review.releaseReady=true;
assert.throws(()=>checkFlags(badFlags));
console.log(JSON.stringify({status:'PASS',scope:'four_candidate_replacement_audit_integrity_not_quality_approval',modules:4,capabilityRows:15,objectiveCoverage:11,immutableInputs:audit.inputSnapshot.filter(x=>!x.mutableInThisUnit).length,negativeControls:3,learnerTimingExecuted:false,appTestsExecuted:false},null,2));
