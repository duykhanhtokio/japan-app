// Verify evidence bindings, not semantic/expert acceptance or an exhaustive source denominator.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),doc=path.join(root,'docs/ssw-workspace/hospitality');
const ledger=JSON.parse(fs.readFileSync(path.join(doc,'knowledge-ledger.json')));
const input=JSON.parse(fs.readFileSync(path.join(doc,'source-atoms-authoring.json')));
assert.deepEqual(ledger.sourceAtoms,input.atoms,'rebuild canonical source atoms');
assert.equal(ledger.sourceAudit.allSourceKnowledgeCovered,false,'do not invent global coverage');
const sources=JSON.parse(fs.readFileSync(path.join(doc,'source-inventory.json'))).sources;
const lessons=new Map(),questions=new Map();
for(const group of ['front','planning','service','restaurant','safety'])for(const l of JSON.parse(fs.readFileSync(path.join(root,`src/data/hospitality/${group}.json`))).lessons){
 lessons.set(l.id,l);for(const q of l.questions)questions.set(q.id,{lessonId:l.id,...q});
 const author=JSON.parse(fs.readFileSync(path.join(doc,`${group}-authoring.json`))).lessons.find(a=>a.id===l.id);
 assert.equal(author.revision,l.revision,'authoring revision lags runtime');
}
const ids=new Set(),pages=new Set();let assessed=0;
for(const a of ledger.sourceAtoms){
 assert(!ids.has(a.atomId));ids.add(a.atomId);assert(a.sourceSummaryJa.trim());assert(a.sourceRefs.length);
 assert(a.before.baselineCommit&&a.before.lessonRevision&&a.before.teachingStatus);
 const l=lessons.get(a.after.evidence.lessonId);assert(l,`${a.atomId}: lesson`);
 assert.equal(l.revision,a.after.reviewedLessonRevision,`${a.atomId}: source review is stale`);
 const s=l.sections.find(s=>s.id===a.after.evidence.sectionId);assert(s,`${a.atomId}: section`);
 assert(a.after.evidence.quote.length>10&&s.body.includes(a.after.evidence.quote),`${a.atomId}: exact teaching evidence missing`);
 assert.equal(a.review.domainReviewed,false);assert.equal(a.review.nativeReviewed,false);
 assert(l.illustration.id===a.after.imageBinding.lessonImageId,`${a.atomId}: image identity`);
 for(const ref of a.sourceRefs){
  const src=sources.find(s=>s.sourceId===ref.sourceId);assert(src);
  assert.equal(src.sha256,ref.sourceSha256);assert(ref.pdfPage>=1&&ref.pdfPage<=src.pdfPages);assert(ref.locator);
  pages.add(`${ref.sourceId}:${ref.pdfPage}`);
 }
 if(a.after.assessmentStatus==='direct_ai_checked'){
  assert(a.after.questionIds.length&&a.after.assessmentFocus,`${a.atomId}: assessment evidence missing`);assessed++;
  for(const qid of a.after.questionIds){
   const q=questions.get(qid);assert(q&&q.lessonId===l.id,`${a.atomId}: wrong assessment lesson`);
   const e=a.after.questionEvidence.find(e=>e.questionId===qid);assert(e,`${a.atomId}: question snapshot`);
   assert.equal(e.prompt,q.prompt);assert.equal(e.correctChoice,q.choices[q.answerIndex],`${a.atomId}: assessment changed since AI check`);
  }
 }
}
assert.equal(ledger.sourceAudit.pages.length,117);
for(const p of ledger.sourceAudit.pages){
 assert.equal(p.allPageIdeasAccepted,false,'an atom link is not full-page acceptance');
 for(const id of p.atomIds){const a=ledger.sourceAtoms.find(a=>a.atomId===id);assert(a&&a.sourceRefs.some(r=>r.sourceId===p.sourceId&&r.pdfPage===p.pdfPage));}
}
console.log(JSON.stringify({status:'PASS',sourceAtomsWithBoundEvidence:ids.size,sourcePagesRepresented:pages.size,questionBindingsAiChecked:assessed,allSourceKnowledgeCovered:false,expertReviewed:false}));
