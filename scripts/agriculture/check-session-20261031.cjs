// Mechanical integration gates only; author self-checks are separate evidence.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..'),base='16ada70a15671fa866635c458fc6f3a7cf741ed7';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const old=p=>JSON.parse(execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:30*1024*1024}));
const sort=x=>Array.isArray(x)?x.map(sort):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sort(x[k])])):x;
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(sort(x))).digest('hex');
const bank=read('src/data/agriculture/mock-exams.ja.json'),lessons=read('src/data/agriculture/lessons.ja.json').lessons;
const byLesson=new Map(lessons.map(l=>[l.id,l])),byParagraph=new Map(lessons.flatMap(l=>l.paragraphs.map(p=>[p.id,{lesson:l,paragraph:p}])));
const baselineBank=old('src/data/agriculture/mock-exams.ja.json');
for(const exam of baselineBank.exams)assert.deepEqual(bank.exams.find(e=>e.id===exam.id),exam,'Old exam changed: '+exam.id);
for(const lesson of old('src/data/agriculture/lessons.ja.json').lessons)assert.deepEqual(byLesson.get(lesson.id),lesson,'Old lesson changed: '+lesson.id);
let preservedTranslations=0;
for(const locale of ['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']){
 const p='src/data/agriculture/translations/'+locale+'.json',before=old(p),after=read(p);
 for(const [id,t] of Object.entries(before)){assert.deepEqual(after[id],t,locale+'/'+id);preservedTranslations++;}
}
assert.equal(bank.exams.length,20);assert.equal(bank.exams.flatMap(e=>e.questions).length,800);assert.equal(bank.complete,true);
for(const level of ['1','2'])assert.equal(bank.exams.filter(e=>e.level===level).length,10);
const figures=new Map(read('src/data/agriculture/recognition-images.json').images.map(f=>[f.id,f]));
const renderSource=fs.readFileSync(path.join(root,'src/components/agriculture/RecognitionImages.tsx'),'utf8');
const illustrations=read('src/data/agriculture/exam-illustrations.json').illustrations,byIllustration=new Map(illustrations.map(i=>[i.id,i]));
assert.equal(byIllustration.size,illustrations.length);
let illustratedQuestions=0;
for(const exam of bank.exams)for(const question of exam.questions){
 if(!question.illustrationId)continue;
 illustratedQuestions++;const i=byIllustration.get(question.illustrationId);assert(i,question.id);
 assert.equal(i.revision,question.illustrationRevision);assert(i.scopeLevels.includes(exam.level));
 const f=figures.get(i.figureId);assert(f&&f.scopeLevels.includes(exam.level));assert.equal(f.assetSha256,i.sourceAssetSha256);
 assert(renderSource.includes('"'+f.assetKey+'"')||renderSource.includes("'"+f.assetKey+"'"),'Missing static image mapping '+f.id);
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f.assetPath))).digest('hex'),f.assetSha256);
 assert(i.titleJa&&i.altJa&&Array.isArray(i.masks));
 for(const m of i.masks){assert([m.x,m.y,m.width,m.height].every(Number.isFinite));assert(m.x>=0&&m.y>=0&&m.width>0&&m.height>0&&m.x+m.width<=1.00001&&m.y+m.height<=1.00001);}
 const answer=question.optionsJa[question.correctIndex];assert(!i.titleJa.includes(answer)&&!i.altJa.includes(answer),'Answer in accessible illustration label: '+question.id);
}
const recon=read('docs/ssw-workspace/agriculture/completion-40/source-reconciliation.json');
const scopeFigures=new Map([...figures,...read('src/data/agriculture/diagrams.json').diagrams.map(f=>[f.id,f])]);
let accessibleOccurrences=0;
for(const row of recon.rows){
 if(!row.disposition.startsWith('covered'))continue;
 for(const level of row.scopeLevels){
  const text=(row.paragraphIds||[]).some(pid=>byParagraph.get(pid)?.lesson.levels.includes(level));
  const image=(row.figureIds||[]).some(fid=>{const f=scopeFigures.get(fid);return f&&f.scopeLevels.includes(level)&&f.lessonIds.some(lid=>byLesson.get(lid)?.levels.includes(level));});
  assert(text||image,'Unreachable source occurrence '+row.id+'/'+level);
 }
 accessibleOccurrences++;
}
assert.equal(recon.routingProblems.length,0);
const baselineHolds=old('docs/ssw-workspace/agriculture/completion-40/source-reconciliation.json').rows.filter(r=>r.disposition==='hold');
for(const row of baselineHolds)assert.deepEqual(recon.rows.find(r=>r.id===row.id),row,'Unverified source hold changed '+row.id);
assert.equal(baselineHolds.length,55);
const report={status:'PASS',priorExamsPreserved:baselineBank.exams.length,priorLessonsPreserved:240,priorLessonLocalePairsPreserved:preservedTranslations,newForms:16,newQuestions:640,totalForms:20,totalMockQuestions:800,formsPerLevel:10,illustratedQuestions,illustrationDefinitions:illustrations.length,accessibleSourceOccurrences:accessibleOccurrences,sourceOccurrencesAreNotUniqueKnowledge:true,remainingRoutingProblems:0,retainedUnresolvedSourceHolds:55,crossWorkerContentReview:false,semanticUniquenessCertified:false,fullSourceCoverageCertified:false,nativeReviewed:false,domainReviewed:false,physicalDeviceTested:false,mockBankSha256:hash(bank)};
fs.writeFileSync(path.join(root,'docs/ssw-workspace/agriculture/session-20261031/integration-qa.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
