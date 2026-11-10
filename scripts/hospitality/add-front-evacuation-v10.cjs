// Add a dedicated assessment; preserve every existing lesson/question/translation.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {hash,pointer}=require('../source-coverage-v2/check.cjs');
const root=path.resolve(__dirname,'../..');process.chdir(root);
const doc='docs/ssw-workspace/hospitality',read=p=>JSON.parse(fs.readFileSync(p));
const write=(p,x,compact=false)=>fs.writeFileSync(p,JSON.stringify(x,null,compact?undefined:2)+'\n');
const h=x=>hash(JSON.stringify(x)),packet=read(`${doc}/front-evacuation-v10-question.json`),q=packet.question;
const p='src/data/hospitality/front.json',data=read(p),l=data.lessons.find(l=>l.id==='hotel-front-03'),before=structuredClone(l);
assert.equal(l.questions.length,8);assert(!l.questions.some(x=>x.id===q.id));
const prepared=Object.entries(packet.locales).map(([locale,v])=>{
 const p=`src/data/hospitality/translations/${locale}/front.json`,d=read(p),t=d.lessons.find(t=>t.id===l.id);
 assert.equal(t.sourceRevision,before.revision);assert.equal(v.length,3);assert.equal(v[1].length,4);assert.equal(new Set(v[1]).size,4);
 return {locale,v,p,d,t,before:structuredClone(t)};
});assert.equal(prepared.length,12);
const dictionary={'避難経路':'ひなんけいろ','非常口':'ひじょうぐち','食事会場':'しょくじかいじょう','客室':'きゃくしつ','避難':'ひなん','案内':'あんない','適切':'てきせつ','内容':'ないよう','場所':'ばしょ','向かう':'むかう','番号':'ばんごう','伝え':'つたえ','経路':'けいろ','省く':'はぶく','普段':'ふだん','道':'みち','災害時':'さいがいじ','各自':'かくじ','探し':'さがし','館内図':'かんないず','分かる':'わかる','形':'かたち','実際':'じっさい','施設':'しせつ','確認':'かくにん','用い':'もちい'};
const pattern=new RegExp(Object.keys(dictionary).sort((a,b)=>b.length-a.length).join('|'),'g'),han=/[一-龯々〆]/;
function annotate(text){let cursor=0;const rows=[];for(const m of text.matchAll(pattern)){assert(!han.test(text.slice(cursor,m.index)),`Missing reading ${text.slice(cursor,m.index)}`);rows.push([m.index,m[0].length,dictionary[m[0]]]);cursor=m.index+m[0].length;}assert(!han.test(text.slice(cursor)));return rows;}
const texts=[q.prompt,...q.choices,q.explanation];texts.forEach(annotate);
l.questions.push(q);delete l.revision;l.revision=h(l);write(p,data);
const authorPath=`${doc}/front-authoring.json`,author=read(authorPath),a=author.lessons.find(a=>a.id===l.id);
assert.deepEqual(a.questions,before.questions);a.questions.push(q);a.revision=l.revision;write(authorPath,author);
for(const t of prepared){t.t.questions.push({...q,prompt:t.v[0],choices:t.v[1],explanation:t.v[2]});t.t.sourceRevision=l.revision;write(t.p,t.d);const restored=structuredClone(t.t);restored.questions.pop();restored.sourceRevision=before.revision;assert.deepEqual(restored,t.before);}
const catalogPath='src/data/hospitality/catalog.json',catalog=read(catalogPath);catalog.find(c=>c.id===l.id).revision=l.revision;write(catalogPath,catalog);
const dailyPath=`${doc}/daily-workload.json`,daily=read(dailyPath);daily.days.find(d=>d.lessonId===l.id).questionCount=l.questions.length;write(dailyPath,daily);
const rp='src/data/hospitality/readings/front.json',readings=read(rp),oldEntries=structuredClone(readings.entries);
for(const text of texts){assert(!readings.entries[text]);readings.entries[text]=annotate(text);}
readings.lessons[l.id].sourceRevision=l.revision;readings.lessons[l.id].textCount+=texts.filter(t=>han.test(t)).length;write(rp,readings,true);
const rstatusPath=`${doc}/reading-build-status.json`,rstatus=read(rstatusPath),rg=rstatus.groups.find(g=>g.group==='front');rg.uniqueTexts=Object.keys(readings.entries).length;rg.kanjiSegments=Object.values(readings.entries).reduce((n,x)=>n+x.length,0);rstatus.generator+='; front03 q09 manually annotated without regenerating existing entries';write(rstatusPath,rstatus,true);
const atomPath=`${doc}/source-atoms-authoring.json`,atoms=read(atomPath),legacyPath=`${doc}/knowledge-ledger.json`,legacy=read(legacyPath);
for(const atom of atoms.atoms.filter(a=>a.after.evidence.lessonId===l.id)){
 assert.equal(atom.after.reviewedLessonRevision,before.revision);
 assert(l.sections.find(s=>s.id===atom.after.evidence.sectionId).body.includes(atom.after.evidence.quote));
 for(const e of atom.after.questionEvidence||[]){const now=l.questions.find(q=>q.id===e.questionId);assert.equal(now.prompt,e.prompt);assert.equal(now.choices[now.answerIndex],e.correctChoice);}
 atom.after.reviewedLessonRevision=l.revision;
}
const atom=atoms.atoms.find(a=>a.atomId==='HF1-012-03');
atom.after.questionIds.push(q.id);atom.after.questionEvidence.push({questionId:q.id,prompt:q.prompt,correctChoice:q.choices[q.answerIndex]});atom.after.assessmentFocus='New q09 explicitly tests both the emergency-exit location and the room-to-exit evacuation route. Old q02 is retained as general property guidance, not sole evidence of route assessment.';
for(const row of legacy.units.filter(u=>u.lesson_id===l.id&&q.knowledgeIds.includes(u.knowledge_id)))row.question_ids=[...new Set([...row.question_ids,q.id])];
legacy.sourceAtoms=atoms.atoms;write(atomPath,atoms);
const semPath=`${doc}/semantic-review-authoring-20261101.json`,sem=read(semPath);
for(const row of sem.sourceClaims.filter(r=>r.lessonId===l.id)){assert.equal(row.sourceRevision,before.revision);row.sourceRevision=l.revision;if(row.atomId==='HF1-012-03'){row.questionIds=atom.after.questionIds;row.assessmentScope=atom.after.assessmentStatus;}}
legacy.semanticReview=sem;write(semPath,sem);write(legacyPath,legacy);
const lp='docs/ssw-workspace/source-coverage-v2/hospitality.json',ledger=read(lp),u=ledger.knowledgeUnits.find(u=>u.knowledgeId==='HF1-012-03');assert.equal(u.status,'candidate');
u.assessmentEvidence.push({path:p,jsonPointer:'/lessons/2/questions/8',sha256:h(q),sha256Mode:'json-value',relation:'candidate',semanticReviewed:false,reviewNote:'Focused exit-and-route assessment authored; source review required before coverage acceptance.'});write(lp,ledger);
write(`${doc}/front-evacuation-v10-integration.json`,{schemaVersion:1,status:'ASSESSMENT_ADDED_PRIOR_FIELDS_PRESERVED',lessonId:l.id,questionId:q.id,oldRevision:before.revision,newRevision:l.revision,oldQuestionsPreserved:8,newQuestionSha256:h(q),translations:prepared.map(t=>({locale:t.locale,questionSha256:h(t.t.questions.at(-1)),sourceRevision:t.t.sourceRevision,status:t.t.status})),oldReadingEntriesPreserved:Object.keys(oldEntries).length,newReadingEntries:texts.map(text=>({text,sha256:h(readings.entries[text])})),review:{domainReviewed:false,nativeReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false,audioAuditioned:false},wholeSourceKnowledgeCovered:false});
console.log(JSON.stringify({status:'EVACUATION_ASSESSMENT_ADDED',questionId:q.id,translations:12,newReadingEntries:6,newRevision:l.revision}));
