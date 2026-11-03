const fs=require('fs'),assert=require('assert/strict'),c=require('crypto'),z=require('zlib');
const dir=__dirname+'/',hash=x=>c.createHash('sha256').update(JSON.stringify(x)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const ledger=read('docs/ssw-workspace/source-coverage-v2/agriculture.json'),regions=JSON.parse(z.gunzipSync(fs.readFileSync('docs/ssw-workspace/source-coverage-v2/agriculture-AGR-S2-regions.json.gz'))),lessons=read('src/data/agriculture/lessons.ja.json').lessons;
const packets=['proposal.json','proposal-additive.json','proposal-soil-details.json'],seen=new Set();let covered=0,partial=0,checks=0;
for(const path of packets){const p=read(dir+path);for(const u of p.canonicalUpdates){
 assert(!seen.has(u.knowledgeId));seen.add(u.knowledgeId);assert.equal(hash(u.before),u.beforeSha256);assert.equal(u.before.status,'candidate');
 const current=ledger.knowledgeUnits.find(x=>x.knowledgeId===u.knowledgeId);assert(current);assert([u.beforeSha256,hash(u.after)].includes(hash(current)),`Concurrent changed unit ${u.knowledgeId}`);
 assert.equal(u.after.review.domainReviewed,false);assert.equal(u.after.review.nativeReviewed,false);assert.equal(u.after.review.physicalDeviceTested,false);
 if(u.after.status==='covered_ai'){assert.equal(u.after.unresolved.length,0);covered++;}else{assert.equal(u.after.status,'partial');assert(u.after.unresolved.length);partial++;}
 for(const r of u.after.sourceRefs){assert.equal(r.sourceId,'AGR-S2');assert(r.elementIds.length);for(const id of r.elementIds)assert(regions.pages.find(x=>x.pdfPage===r.pdfPage).elements.some(x=>x.elementId===id));}
 for(const e of [...u.after.teachingEvidence,...u.after.assessmentEvidence]){
  if(e.checkId){assert((p.readerAdditions||[]).some(r=>r.id===e.checkId));continue;}
  let v=read(e.path);for(const k of e.jsonPointer.slice(1).split('/'))v=v[k.replace(/~1/g,'/').replace(/~0/g,'~')];assert.equal(hash(v),e.sha256);
  if(v.lessonSourceHash)assert.equal(v.lessonSourceHash,lessons.find(l=>l.id===v.lessonId).sourceHash);
 }
}
for(const row of p.readerAdditions||[]){checks++;assert.equal(Object.keys(row.translations).length,12);assert.equal(row.promptRuby.map(x=>x.text).join(''),row.promptJa);assert.equal(row.modelAnswerRuby.map(x=>x.text).join(''),row.modelAnswerJa);for(const t of [...row.promptRuby,...row.modelAnswerRuby])if(/[\p{Script=Han}々]/u.test(t.text))assert(t.readingKana&&t.readingKana.trim());for(const t of Object.values(row.translations)){assert(t.prompt&&t.modelAnswer);assert.equal(t.translatedFrom,'ja');}for(const part of row.answerOrigin.parts)assert.equal(part.sourceHash,lessons.find(x=>x.id===part.lessonId).sourceHash);}
}
assert.equal(covered,39);assert.equal(partial,0);assert.equal(checks,2);
const result={status:'PASS',guardedUnits:seen.size,coveredAiProposed:covered,partialProposed:partial,newReaderChecks:checks,translationPairs:24,sourceElementsVerified:true,currentEvidenceHashesVerified:true,currentLessonVersionsVerified:true,noAcceptedUnitsReopened:true,scope:'Self-validation only; coordinator integration and runtime rendering still pending.'};
fs.writeFileSync(dir+'validation.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
