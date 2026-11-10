// Add one missing payment-reconciliation assessment, preserving existing fields.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..');process.chdir(root);
const doc='docs/ssw-workspace/hospitality',read=p=>JSON.parse(fs.readFileSync(p)),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
function write(p,x){const pretty=fs.existsSync(p)&&fs.readFileSync(p,'utf8').startsWith('{\n')||Array.isArray(x);fs.writeFileSync(p,JSON.stringify(x,null,pretty?2:undefined)+'\n');}
const packet=read(`${doc}/rebuild-payment-20261106-question.json`),q=packet.question,p='src/data/hospitality/front.json',data=read(p),l=data.lessons[4],before=structuredClone(l);
assert.equal(l.id,'hotel-front-05');assert.equal(l.questions.length,9);assert(!l.questions.some(x=>x.id===q.id));assert.equal(q.answerIndex,1);
const prepared=Object.entries(packet.locales).map(([locale,v])=>{const p=`src/data/hospitality/translations/${locale}/front.json`,d=read(p),t=d.lessons.find(t=>t.id===l.id);assert.equal(t.sourceRevision,l.revision);assert.equal(v.length,3);assert.equal(v[1].length,4);assert.equal(new Set(v[1]).size,4);return {locale,p,d,t,v,before:structuredClone(t)};});assert.equal(prepared.length,12);
l.questions.push(q);delete l.revision;l.revision=hash(l);write(p,data);
const ap=`${doc}/front-authoring.json`,author=read(ap),a=author.lessons.find(x=>x.id===l.id);assert.deepEqual(a.questions,before.questions);a.questions.push(q);a.revision=l.revision;write(ap,author);
for(const t of prepared){t.t.questions.push({...q,prompt:t.v[0],choices:t.v[1],explanation:t.v[2]});t.t.sourceRevision=l.revision;write(t.p,t.d);const restored=structuredClone(t.t);restored.questions.pop();restored.sourceRevision=before.revision;assert.deepEqual(restored,t.before);}
const cp='src/data/hospitality/catalog.json',catalog=read(cp);catalog.find(x=>x.id===l.id).revision=l.revision;write(cp,catalog);
const dp=`${doc}/daily-workload.json`,daily=read(dp);daily.days.find(x=>x.lessonId===l.id).questionCount=l.questions.length;write(dp,daily);
const rp='src/data/hospitality/readings/front.json',r=read(rp),oldEntries=structuredClone(r.entries);for(const [text,spans] of Object.entries(packet.readings)){assert(!r.entries[text]);r.entries[text]=spans;}r.lessons[l.id].sourceRevision=l.revision;r.lessons[l.id].textCount+=6;write(rp,r);
const rsp=`${doc}/reading-build-status.json`,rs=read(rsp),rg=rs.groups.find(g=>g.group==='front');rg.uniqueTexts=Object.keys(r.entries).length;rg.kanjiSegments=Object.values(r.entries).reduce((n,a)=>n+a.length,0);rs.generator+='; six targeted payment assessment texts, prior readings preserved';write(rsp,rs);
const sap=`${doc}/source-atoms-authoring.json`,atoms=read(sap),lp=`${doc}/knowledge-ledger.json`,legacy=read(lp);
for(const atom of atoms.atoms.filter(a=>a.after.evidence.lessonId===l.id)){
 assert.equal(atom.after.reviewedLessonRevision,before.revision);assert(l.sections.find(s=>s.id===atom.after.evidence.sectionId).body.includes(atom.after.evidence.quote));
 for(const e of atom.after.questionEvidence||[]){const now=l.questions.find(q=>q.id===e.questionId);assert.equal(now.prompt,e.prompt);assert.equal(now.choices[now.answerIndex],e.correctChoice);}
 atom.after.reviewedLessonRevision=l.revision;
}
const atom=atoms.atoms.find(a=>a.atomId==='HF1-017-04');atom.after.questionIds=[q.id];atom.after.questionEvidence=[{questionId:q.id,prompt:q.prompt,correctChoice:q.choices[q.answerIndex]}];atom.after.assessmentFocus='Dedicated application checks itemized amount against recorded payment irrespective of card payment method; old q06 only assessed statement/payment/receipt order.';
for(const row of legacy.units.filter(u=>q.knowledgeIds.includes(u.knowledge_id)))row.question_ids=[...new Set([...row.question_ids,q.id])];
legacy.sourceAtoms=atoms.atoms;write(sap,atoms);
const sp=`${doc}/semantic-review-authoring-20261101.json`,sem=read(sp);for(const row of sem.sourceClaims.filter(r=>r.lessonId===l.id)){assert.equal(row.sourceRevision,before.revision);row.sourceRevision=l.revision;if(row.atomId==='HF1-017-04'){row.questionIds=atom.after.questionIds;row.assessmentScope=atom.after.assessmentStatus;}}legacy.semanticReview=sem;write(sp,sem);write(lp,legacy);
const restored=structuredClone(l);restored.questions.pop();restored.revision=before.revision;assert.deepEqual(restored,before);for(const [k,v] of Object.entries(oldEntries))assert.deepEqual(r.entries[k],v);
write(`${doc}/rebuild-payment-20261106-integration.json`,{schemaVersion:1,workType:'rebuild_missing_content_from_verified_github_baseline',missingCommitRecovered:false,lessonId:l.id,questionId:q.id,oldRevision:before.revision,newRevision:l.revision,oldQuestionsPreserved:before.questions.length,newQuestionHash:hash(q),translationCount:12,oldTranslationFieldsPreserved:true,newReadingTexts:6,oldReadingEntriesPreserved:Object.keys(oldEntries).length,sourceIdea:'HF1-017-04',remainingSourceDenominator:'open',review:{domainReviewed:false,nativeReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false}});
console.log(JSON.stringify({status:'PAYMENT_ASSESSMENT_ADDED',questionId:q.id,translations:12,newReadingTexts:6,revision:l.revision}));
