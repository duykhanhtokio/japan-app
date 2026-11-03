// Preservation/runtime-state check against the exact durable pre-batch commit.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),vm=require('node:vm'),{stripTypeScriptTypes}=require('node:module');
const root=path.resolve(__dirname,'../..'),base='docs/ssw-workspace/hospitality/recovery-v9',read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const receipt=read(`${base}/operations-source-review.json`),packet=read(`${base}/operations-assessments.json`),old=p=>JSON.parse(cp.execFileSync('git',['show',`${receipt.parentCommit}:${p}`],{cwd:root,encoding:'utf8',maxBuffer:20*1024*1024}));
const groups=['front','planning','service','restaurant','safety'],locales=Object.keys(packet.locales);let oldQuestions=0,oldPairs=0,oldReadings=0;
for(const group of groups){
 const p=`src/data/hospitality/${group}.json`,before=old(p),after=read(p),expected=structuredClone(before),items=packet.questions.filter(x=>x.group===group);
 for(const item of items){const l=expected.lessons.find(l=>l.id===item.lessonId),a=after.lessons.find(l=>l.id===item.lessonId);l.questions.push(item.question);l.revision=a.revision;}
 assert.deepEqual(after,expected,'Only the two focused questions and corresponding revisions may change in JP data');oldQuestions+=before.lessons.reduce((n,l)=>n+l.questions.length,0);
 for(const locale of locales){
  const p=`src/data/hospitality/translations/${locale}/${group}.json`,before=old(p),after=read(p),expected=structuredClone(before);
  for(const item of items){const i=packet.questions.indexOf(item),v=packet.locales[locale][i],l=expected.lessons.find(l=>l.id===item.lessonId),jp=read(`src/data/hospitality/${group}.json`).lessons.find(l=>l.id===item.lessonId);l.questions.push({...item.question,prompt:v[0],choices:v[1],explanation:v[2]});l.sourceRevision=jp.revision;}
  assert.deepEqual(after,expected,'Existing translated fields must remain identical');oldPairs+=before.lessons.length;
 }
 const pReading=`src/data/hospitality/readings/${group}.json`,beforeReading=old(pReading),afterReading=read(pReading);for(const [text,spans] of Object.entries(beforeReading.entries)){assert.deepEqual(afterReading.entries[text],spans);oldReadings++;}
}
assert.equal(oldQuestions,330);assert.equal(oldPairs,456);
const ledger=read('docs/ssw-workspace/source-coverage-v2/hospitality.json'),beforeLedger=old('docs/ssw-workspace/source-coverage-v2/hospitality.json');assert.equal(ledger.knowledgeUnits.length,beforeLedger.knowledgeUnits.length);assert.equal(ledger.denominator.status,'open');assert.equal(ledger.wholeSourceKnowledgeCovered,false);
const reviewedIds=new Set(receipt.units.map(x=>x.knowledgeId));assert.equal(reviewedIds.size,24);
for(const u of beforeLedger.knowledgeUnits){const current=ledger.knowledgeUnits.find(x=>x.knowledgeId===u.knowledgeId);assert(current);assert.deepEqual(current.before,u.before);if(!reviewedIds.has(u.knowledgeId))assert.deepEqual(current,u,'Do not alter an unreviewed knowledge unit');}
const source=fs.readFileSync(path.join(root,'src/services/hospitality-study-state.ts'),'utf8'),box={};vm.createContext(box);vm.runInContext(stripTypeScriptTypes(source).replace(/export /g,'')+'\nglobalThis.api={hotelRecord,updateHotelRecord,restoreHotelProgress};',box);
for(const item of packet.questions){
 const prior=old(`src/data/hospitality/${item.group}.json`).lessons.find(x=>x.id===item.lessonId),now=read(`src/data/hospitality/${item.group}.json`).lessons.find(x=>x.id===item.lessonId),record={revision:prior.revision,answers:{[prior.questions[0].id]:prior.questions[0].answerIndex},submitted:true,completed:true},progress={version:1,lessons:{[item.lessonId]:record}},snapshot=structuredClone(progress),fresh=box.api.hotelRecord(progress,item.lessonId,now.revision);
 assert.deepEqual(progress,snapshot);assert.equal(fresh.completed,false);const next=box.api.updateHotelRecord(progress,item.lessonId,fresh);assert.deepEqual(next.archive[item.lessonId][prior.revision],snapshot.lessons[item.lessonId]);assert.deepEqual(JSON.parse(JSON.stringify(box.api.restoreHotelProgress(JSON.stringify(next)))),JSON.parse(JSON.stringify(next)));
}
console.log(JSON.stringify({status:'PASS_OPERATIONS_OLD_CONTENT_AND_PROGRESS',parentCommit:receipt.parentCommit,oldJapaneseQuestionsPreserved:oldQuestions,oldTranslatedLessonPairsPreserved:oldPairs,oldReadingEntriesPreserved:oldReadings,newQuestions:2,newTranslatedQuestions:24,newCoveredSourceUnits:24,sourceDenominator:'open',oldProgressArchivedAndRestorable:true,newRevisionsRequireFreshAttempt:true}));
