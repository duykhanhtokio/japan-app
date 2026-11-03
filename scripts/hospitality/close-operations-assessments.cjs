// Two independently authored assessment gaps; preserve all existing runtime text.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),doc='docs/ssw-workspace/hospitality',base=`${doc}/recovery-v9`;
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const write=(p,d)=>fs.writeFileSync(path.join(root,p),JSON.stringify(d,null,2)+'\n');
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const packet=read(`${base}/operations-assessments.json`),review=read(`${base}/operations-source-review.json`),ledgerPath='docs/ssw-workspace/source-coverage-v2/hospitality.json',ledger=read(ledgerPath);
assert.equal(cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),review.parentCommit);
const localeNames=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
assert.deepEqual(Object.keys(packet.locales).sort(),[...localeNames].sort());
const catalog=read('src/data/hospitality/catalog.json'),daily=read(`${doc}/daily-workload.json`),atoms=read(`${doc}/source-atoms-authoring.json`),legacy=read(`${doc}/knowledge-ledger.json`),readingStatus=read(`${doc}/reading-build-status.json`);
const dictionary={'部下':'ぶか','対応':'たいおう','結果':'けっか','聞':'き','責任者':'せきにんしゃ','責任':'せきにん','後':'あと','原因':'げんいん','調':'しら','終':'お','確認':'かくにん','次':'つぎ','同':'おな','問題':'もんだい','適切':'てきせつ','判断':'はんだん','先':'さき','根拠':'こんきょ','決':'き','最初':'さいしょ','把握':'はあく','内容':'ないよう','食事':'しょくじ','皿':'さら','空':'から','客様':'きゃくさま','追加注文':'ついかちゅうもん','希望':'きぼう','放置':'ほうち','確':'たし','下膳':'げぜん','料理':'りょうり','飲':'の','物':'もの','本人':'ほんにん','高':'たか','断':'ことわ','食':'た','別々':'べつべつ','手':'て','観察':'かんさつ','注文':'ちゅうもん','追加':'ついか','必':'かなら'};
const pattern=new RegExp(Object.keys(dictionary).sort((a,b)=>b.length-a.length).join('|'),'g'),han=/[一-龯々〆]/;
function annotate(text){let cursor=0;const spans=[];for(const m of text.matchAll(pattern)){assert(!han.test(text.slice(cursor,m.index)),`Missing reading: ${text.slice(cursor,m.index)}`);spans.push([m.index,m[0].length,dictionary[m[0]]]);cursor=m.index+m[0].length;}assert(!han.test(text.slice(cursor)),`Missing reading: ${text.slice(cursor)}`);return spans;}
const atParent=p=>JSON.parse(cp.execFileSync('git',['show',`${review.parentCommit}:${p}`],{cwd:root,encoding:'utf8',maxBuffer:12*1024*1024}));
for(const item of packet.questions)for(const text of [item.question.prompt,...item.question.choices,item.question.explanation])annotate(text);
const output=[];
for(const [i,item] of packet.questions.entries()){
 const p=`src/data/hospitality/${item.group}.json`,data=read(p),lesson=data.lessons.find(l=>l.id===item.lessonId),before=atParent(p).lessons.find(l=>l.id===item.lessonId),q=item.question;
 if(lesson.questions.some(x=>x.id===q.id))assert.deepEqual(lesson.questions.at(-1),q);assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);
 const canonical=ledger.knowledgeUnits.find(u=>u.knowledgeId===item.knowledgeId);assert.equal(canonical.status,'partial');
 const texts=[q.prompt,...q.choices,q.explanation];texts.forEach(annotate);
 if(!lesson.questions.some(x=>x.id===q.id))lesson.questions.push(q);delete lesson.revision;lesson.revision=hash(lesson);write(p,data);
 const authorPath=`${doc}/${item.group}-authoring.json`,author=read(authorPath),authored=author.lessons.find(l=>l.id===lesson.id);if(!authored.questions.some(x=>x.id===q.id)){assert.equal(authored.revision,before.revision);assert.deepEqual(authored.questions,before.questions);authored.questions.push(q);}else assert.deepEqual(authored.questions,lesson.questions);authored.revision=lesson.revision;write(authorPath,author);
 const translated=[];
 for(const locale of localeNames){
  const translationPath=`src/data/hospitality/translations/${locale}/${item.group}.json`,data=read(translationPath),l=data.lessons.find(l=>l.id===lesson.id),beforeTranslation=atParent(translationPath).lessons.find(l=>l.id===lesson.id),v=packet.locales[locale][i];
  assert([before.revision,lesson.revision].includes(l.sourceRevision));assert.equal(l.status,'translated_ai_unreviewed');assert.deepEqual(l.questions.filter(x=>x.id!==q.id).map(x=>x.id),before.questions.map(x=>x.id));assert.equal(v.length,3);assert.equal(v[1].length,4);assert.equal(new Set(v[1]).size,4);for(const t of [v[0],...v[1],v[2]])assert(typeof t==='string'&&t.trim());
  const tq={...q,prompt:v[0],choices:v[1],explanation:v[2]};if(!l.questions.some(x=>x.id===q.id))l.questions.push(tq);else assert.deepEqual(l.questions.at(-1),tq);l.sourceRevision=lesson.revision;write(translationPath,data);
  const unchanged=structuredClone(l);unchanged.questions.pop();unchanged.sourceRevision=before.revision;assert.deepEqual(unchanged,beforeTranslation,'Existing translation text must remain byte-equivalent as JSON values');translated.push({locale,questionSha256:hash(tq)});
 }
 const readingPath=`src/data/hospitality/readings/${item.group}.json`,reading=read(readingPath),oldEntries=atParent(readingPath).entries,oldEntryCount=Object.keys(oldEntries).length;let newEntries=0;
 for(const text of texts){if(!reading.entries[text]){reading.entries[text]=annotate(text);newEntries++;}}
 for(const [text,spans] of Object.entries(oldEntries))assert.deepEqual(reading.entries[text],spans);
 reading.lessons[lesson.id]={sourceRevision:lesson.revision,textCount:atParent(readingPath).lessons[lesson.id].textCount+texts.filter(t=>han.test(t)).length};newEntries=Object.keys(reading.entries).length-oldEntryCount;fs.writeFileSync(path.join(root,readingPath),JSON.stringify(reading)+'\n');
 const groupStatus=readingStatus.groups.find(g=>g.group===item.group);groupStatus.uniqueTexts=Object.keys(reading.entries).length;groupStatus.kanjiSegments=Object.values(reading.entries).reduce((n,v)=>n+v.length,0);
 catalog.find(l=>l.id===lesson.id).revision=lesson.revision;daily.days.find(d=>d.lessonId===lesson.id).questionCount=lesson.questions.length;
 // Rebind only unchanged atom teaching/assessment snapshots after the actual JP addition.
 for(const atom of atoms.atoms.filter(a=>a.after.evidence.lessonId===lesson.id)){
  assert.equal(atom.after.reviewedLessonRevision,before.revision);const section=lesson.sections.find(s=>s.id===atom.after.evidence.sectionId);assert(section.body.includes(atom.after.evidence.quote));
  for(const e of atom.after.questionEvidence||[]){const current=lesson.questions.find(q=>q.id===e.questionId);assert(current);assert.equal(e.prompt,current.prompt);assert.equal(e.correctChoice,current.choices[current.answerIndex]);}
  atom.after.reviewedLessonRevision=lesson.revision;
 }
 const atom=atoms.atoms.find(a=>a.atomId===item.knowledgeId);assert(atom);atom.after.questionIds=[...new Set([...atom.after.questionIds,q.id])];atom.after.questionEvidence.push({questionId:q.id,prompt:q.prompt,correctChoice:q.choices[q.answerIndex]});atom.after.assessmentFocus='Original focused follow-through or multi-cue observation question supplements the previously partial assessment.';atom.review.currentSourceReviewRef=`${base}/operations-source-review.json`;
 for(const row of legacy.units.filter(u=>u.lesson_id===lesson.id&&q.knowledgeIds.includes(u.knowledge_id)))row.question_ids=[...new Set([...row.question_ids,q.id])];
 canonical.assessmentEvidence.forEach(e=>{e.relation='direct';e.semanticReviewed=true;e.reviewNote='Old question still checks one component; the appended focused question completes this bounded objective.';});
 canonical.assessmentEvidence.push({path:p,jsonPointer:`/lessons/${data.lessons.indexOf(lesson)}/questions/${lesson.questions.length-1}`,sha256:hash(q),sha256Mode:'json-value',relation:'direct',semanticReviewed:true,reviewNote:item.group==='service'?'New q11 explicitly tests cause investigation and response decision AFTER hearing the result. Existing q04 tests result-first order.':'New q08 separately includes finished plates, empty glass and wish for more food/drinks. Existing q1 remains the empty-glass component.'});
 canonical.after.assessment='present';canonical.status='covered_ai';canonical.unresolved=[];canonical.expressionReview.note='Existing independent teaching preserved; new independently authored situation and distractors test the specific missing assessment component, with no source sentence sequence or source image reproduced.';
 const r=review.units.find(u=>u.knowledgeId===item.knowledgeId);r.beforeSupplement={status:'partial',unresolved:review.units.find(u=>u.knowledgeId===item.knowledgeId).objectiveReview};r.afterStatus='covered_ai';r.currentAssessmentEvidence=canonical.assessmentEvidence;r.objectiveReview=canonical.assessmentEvidence.at(-1).reviewNote;
 const unchanged=structuredClone(lesson);unchanged.questions.pop();unchanged.revision=before.revision;assert.deepEqual(unchanged,before,'No old Japanese lesson/question content may change');
 output.push({knowledgeId:item.knowledgeId,questionId:q.id,oldLessonRevision:before.revision,newLessonRevision:lesson.revision,oldQuestionsPreserved:before.questions.length,oldReadingEntriesPreserved:oldEntryCount,newReadingEntries:newEntries,translatedQuestionRecords:translated});
}
legacy.sourceAtoms=atoms.atoms;write(`${doc}/knowledge-ledger.json`,legacy);write(`${doc}/source-atoms-authoring.json`,atoms);write('src/data/hospitality/catalog.json',catalog);write(`${doc}/daily-workload.json`,daily);fs.writeFileSync(path.join(root,`${doc}/reading-build-status.json`),JSON.stringify(readingStatus)+'\n');write(ledgerPath,ledger);
review.newlyCoveredAi=24;review.newlyExplicitPartial=0;review.discoveredAssessmentGaps=2;review.assessmentGapsRemedied=2;review.coveredAi=128;review.openUnits=256;review.scope='Bounded source review plus two focused JP assessment additions and 24 directly authored locale records. Preserve old lesson text/questions/readings and revision-isolate old study attempts. No whole-page completion, actual-device or practical-skill acceptance inferred.';review.assessmentSupplements=output;write(`${base}/operations-source-review.json`,review);
write(`${base}/operations-assessment-integration.json`,{status:'PASS_OPERATIONS_ASSESSMENT_PRESERVATION',parentCommit:review.parentCommit,changes:output,sourceCoveredAi:128,knownUnits:384,sourceDenominator:'open',newlyCoveredAi:24,nativeReviewed:false,domainReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false});
console.log(JSON.stringify({status:'OPERATIONS_ASSESSMENTS_ADDED',questions:output.map(x=>x.questionId),translatedQuestionRecords:24,coveredAi:128,knownUnits:384}));
