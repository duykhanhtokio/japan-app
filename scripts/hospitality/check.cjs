const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),crypto=require('crypto');
const root=path.resolve(__dirname,'../..'),doc=path.join(root,'docs/ssw-workspace/hospitality');
const catalog=require('../../src/data/hospitality/catalog.json'),ledger=require('../../docs/ssw-workspace/hospitality/knowledge-ledger.json').units;
const ids=new Set(),qids=new Set(),kids=new Set(),lessons=[];for(const row of ledger){kids.add(row.knowledge_id);assert(row.before_status&&row.after_status);}
for(const group of ['front','planning','service','restaurant','safety'])for(const lesson of require(`../../src/data/hospitality/${group}.json`).lessons){
 assert(!ids.has(lesson.id));ids.add(lesson.id);lessons.push(lesson);assert(lesson.title&&lesson.reading&&lesson.objectives.length&&lesson.sections.length&&lesson.questions.length&&lesson.terms.length);
 assert(lesson.review.domainReviewed===false&&lesson.review.nativeReviewed===false,'do not invent human review');
 const noRev={...lesson};delete noRev.revision;assert.equal(crypto.createHash('sha256').update(JSON.stringify(noRev)).digest('hex'),lesson.revision);
 for(const section of lesson.sections){assert(section.body.length>50,`${lesson.id}: short section`);assert(!section.sourceRefs,'source metadata in runtime');}
 for(const q of lesson.questions){assert(!qids.has(q.id));qids.add(q.id);assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert(Number.isInteger(q.answerIndex)&&q.answerIndex>=0&&q.answerIndex<4);assert(q.explanation.length>15);for(const k of q.knowledgeIds)assert(kids.has(k),`question ${q.id}: missing ${k}`);}
 for(const k of lesson.knowledgeIds)assert(kids.has(k),`${lesson.id}: missing ${k}`);
 assert(lesson.objectives.some(o=>o.id===lesson.illustration.keyObjectiveId),`image objective ${lesson.id}`);
 const image=path.join(root,`assets/app/hospitality/${lesson.id}.png`);assert(fs.existsSync(image),`missing figure ${image}`);assert(fs.statSync(image).size>1000);
}
assert.equal(catalog.length,lessons.length);
for(const row of ledger){const l=lessons.find(l=>l.id===row.lesson_id);assert(l,`unknown lesson ${row.knowledge_id}`);assert(l.sections.some(s=>s.id===row.section_id),`unknown section ${row.knowledge_id}`);for(const q of row.question_ids||[])assert(qids.has(q));const p=typeof row.source_page==='number'?row.source_page:row.source_page.pdf;assert(p>=1&&p<=(row.source_id==='hotel-1'?52:65),`source page ${row.knowledge_id}`);}
const audit=JSON.parse(fs.readFileSync(path.join(doc,'page-audit.json')));assert.equal(audit.pages.length,117);assert.equal(new Set(audit.pages.map(p=>`${p.sourceId}:${p.pdfPage}`)).size,117);
console.log(JSON.stringify({status:'PASS',lessons:lessons.length,questions:qids.size,sourceKnowledgeLinks:ledger.length,pages:117,visualReviewed:audit.pages.filter(p=>p.visualReviewed).length,domainReviewed:false,physicalDeviceTested:false}));
