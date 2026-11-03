// Hash and preservation checks only; semantic decisions are in author receipts.
const fs=require('node:fs'),assert=require('node:assert/strict'),cp=require('node:child_process');
const {hash,pointer,validateFile}=require('../source-coverage-v2/check.cjs');
const root=require('node:path').resolve(__dirname,'../..');process.chdir(root);
const read=p=>JSON.parse(fs.readFileSync(p));
const base='2aa8c72ef0dc475250631f222b3e3c7d0da7e3e9';
const old=p=>JSON.parse(cp.execFileSync('git',['show',`${base}:${p}`],{maxBuffer:64*1024*1024}));
const jsonHash=x=>hash(JSON.stringify(x));
const receipt=read('docs/ssw-workspace/hospitality/front-locale-reading-v10-review-20261103.json');
const current=read('src/data/hospitality/front.json'),baseline=old('src/data/hospitality/front.json');
const integration=read('docs/ssw-workspace/hospitality/front-evacuation-v10-integration.json');
const restoredCurrent=structuredClone(current),changed=restoredCurrent.lessons[2];
assert.equal(changed.questions.at(-1).id,'hotel-front-03-q09');
assert.equal(jsonHash(changed.questions.pop()),integration.newQuestionSha256);
assert.equal(changed.revision,integration.newRevision);changed.revision=integration.oldRevision;
assert.deepEqual(restoredCurrent,baseline,'Only additive front03 q09/revision may change');
const source=current.lessons[0];
assert.equal(source.revision,receipt.sourceRevision);
for(const group of receipt.groups){
 const q=source.questions.find(q=>q.id===group.questionId);assert.equal(jsonHash(q),group.japaneseQuestionSha256);
 assert.equal(group.locales.length,12);
 for(const row of group.locales){
  const lesson=read(`src/data/hospitality/translations/${row.locale}/front.json`).lessons.find(l=>l.id===source.id);
  assert.equal(lesson.sourceRevision,source.revision);assert.equal(lesson.sourceRevision,row.sourceRevision);
  assert.equal(lesson.status,'translated_ai_unreviewed');
  const translated=lesson.questions.find(t=>t.id===q.id);assert.equal(jsonHash(translated),row.questionSha256);
  assert.equal(translated.answerIndex,q.answerIndex);assert.deepEqual(translated.knowledgeIds,q.knowledgeIds);
 }
}
const twPath='src/data/hospitality/translations/zh-TW/front.json',twBefore=old(twPath),twAfter=read(twPath);
twAfter.lessons[2].questions.pop();twAfter.lessons[2].sourceRevision=integration.oldRevision;
for(const c of receipt.corrections){
 const a=twBefore.lessons[0].questions.find(q=>q.id===c.questionId);
 const b=twAfter.lessons[0].questions.find(q=>q.id===c.questionId);
 assert.equal(pointer(a,'/'+c.field),c.before);assert.equal(pointer(b,'/'+c.field),c.after);
 a.choices[Number(c.field.split('/')[1])]=c.after;
}
assert.deepEqual(twBefore,twAfter,'Only the two scoped Chinese choices may change');
const readingPath='src/data/hospitality/readings/front.json',before=old(readingPath),after=read(readingPath);
for(const c of receipt.readingCorrections){
 const entry=before.entries[c.text];const i=entry.findIndex(r=>JSON.stringify(r)===JSON.stringify(c.before));assert(i>=0);entry[i]=c.after;
}
const restoredReadings=structuredClone(after);
for(const e of integration.newReadingEntries){assert.equal(jsonHash(restoredReadings.entries[e.text]),e.sha256);delete restoredReadings.entries[e.text];}
restoredReadings.lessons['hotel-front-03'].sourceRevision=integration.oldRevision;
restoredReadings.lessons['hotel-front-03'].textCount-=6;
assert.deepEqual(before,restoredReadings,'Only five corrected spans and six new question entries/revision may change');
for(const e of receipt.japaneseReadingEntries)assert.equal(jsonHash(after.entries[e.text]),e.sha256);
const sourceReceipt=read('docs/ssw-workspace/hospitality/front-source-v10-review-20261103.json');
assert.deepEqual(sourceReceipt.groups.map(g=>g.group),[1,2,3]);assert.equal(sourceReceipt.units.length,9);
const ledger=read('docs/ssw-workspace/source-coverage-v2/hospitality.json');
for(const row of sourceReceipt.units){
 const u=ledger.knowledgeUnits.find(u=>u.knowledgeId===row.knowledgeId);
 assert.equal(u.status,'covered_ai');assert.deepEqual(u.sourceRefs,row.sourceRefs);
 assert.equal(u.sourceReview.reviewRef,'docs/ssw-workspace/hospitality/front-source-v10-review-20261103.json');
}
const evacuation=read('docs/ssw-workspace/hospitality/front-evacuation-v10-source-review.json');
assert.equal(evacuation.knowledgeId,'HF1-012-03');
assert.equal(ledger.knowledgeUnits.find(u=>u.knowledgeId===evacuation.knowledgeId).status,'covered_ai');
const packet=read('docs/ssw-workspace/hospitality/front-evacuation-v10-question.json');
for(const row of integration.translations){
 const file=`src/data/hospitality/translations/${row.locale}/front.json`,actual=read(file),prior=old(file);
 const l=actual.lessons[2],q=l.questions.pop(),v=packet.locales[row.locale];
 assert.equal(q.id,'hotel-front-03-q09');assert.equal(jsonHash(q),row.questionSha256);
 assert.equal(q.prompt,v[0]);assert.deepEqual(q.choices,v[1]);assert.equal(q.explanation,v[2]);assert.equal(q.answerIndex,0);
 assert.equal(l.sourceRevision,integration.newRevision);l.sourceRevision=integration.oldRevision;
 if(row.locale==='zh-TW')for(const c of receipt.corrections){const q=prior.lessons[0].questions.find(q=>q.id===c.questionId);q.choices[Number(c.field.split('/')[1])]=c.after;}
 assert.deepEqual(actual,prior,`${row.locale}: unrelated translated fields changed`);
}
for(const r of [receipt.review,sourceReceipt.review,evacuation.review,integration.review])for(const v of Object.values(r))assert.equal(v,false);
const result=validateFile(root,'docs/ssw-workspace/source-coverage-v2/hospitality.json');
const emergencyReceipt=read('docs/ssw-workspace/hospitality/recovery-v9/emergency-source-review.json');
const expectedCovered=new Set([...old('docs/ssw-workspace/source-coverage-v2/hospitality.json').knowledgeUnits.filter(u=>u.status==='covered_ai').map(u=>u.knowledgeId),...sourceReceipt.units.map(u=>u.knowledgeId),evacuation.knowledgeId,...emergencyReceipt.units.map(u=>u.knowledgeId)]);
assert.deepEqual(ledger.knowledgeUnits.filter(u=>u.status==='covered_ai').map(u=>u.knowledgeId).sort(),[...expectedCovered].sort(),'Preserve exact union of original, front and emergency accepted IDs');
assert.equal(result.coveredAi,expectedCovered.size);assert.equal(result.sourceCoveragePercent,null);assert.equal(result.fullyCovered,false);
const vm=require('node:vm'),{stripTypeScriptTypes}=require('node:module');
const state=stripTypeScriptTypes(fs.readFileSync('src/services/hospitality-study-state.ts','utf8')).replaceAll('export ','');
const box={};vm.createContext(box);vm.runInContext(state+'\nglobalThis.api={hotelRecord,updateHotelRecord,restoreHotelProgress};',box);
const oldRecord={revision:integration.oldRevision,answers:Object.fromEntries(baseline.lessons[2].questions.map(q=>[q.id,q.answerIndex])),submitted:true,completed:true};
const progress={version:1,lessons:{'hotel-front-03':oldRecord}},next=box.api.hotelRecord(progress,'hotel-front-03',integration.newRevision);
assert.equal(next.completed,false);assert.equal(next.submitted,false);assert.equal(Object.keys(next.answers).length,0);
const updated=box.api.updateHotelRecord(progress,'hotel-front-03',next);
assert.equal(JSON.stringify(updated.archive['hotel-front-03'][integration.oldRevision]),JSON.stringify(oldRecord));
assert.equal(JSON.stringify(box.api.restoreHotelProgress(JSON.stringify(updated))),JSON.stringify(updated));
console.log(JSON.stringify({status:'PASS',sourceGroups:3,newlyCoveredAi:10,coveredAi:result.coveredAi,openKnownUnits:ledger.knowledgeUnits.length-result.coveredAi,localeQuestionReviews:36,newTranslatedQuestions:12,newReadingEntries:6,furiganaCorrections:5,chineseWordingCorrections:2,nativeOrDomainCertification:false,deviceOrDurationCertification:false}));
