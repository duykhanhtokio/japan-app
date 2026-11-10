// Reproducible bounded mechanical audit; no semantic or timing certification.
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../../../..'),out=__dirname;
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),inputs={};
const read=p=>{const b=fs.readFileSync(path.join(root,p));inputs[p]=hash(b);return JSON.parse(b);};
const lessons=read('src/data/agriculture/lessons.ja.json').lessons,by=new Map(lessons.map(l=>[l.id,l]));
const manifest=read('src/data/agriculture/course-manifest.json'),compat=read('src/data/agriculture/source-hash-compatibility.json').lessons;
const errors=[],banks=[],compatBindings=[];
for(const [bank,total] of [['weekly-checks',427],['mock-exams',800]]) {
 const data=read(`src/data/agriculture/${bank}.ja.json`),seen=new Set(); let count=0;
 for(const exam of data.exams) for(const q of exam.questions) {
  count++;const l=by.get(q.lessonId),at=`${exam.id}/${q.id}`;
  if(seen.has(q.id))errors.push({code:'DUPLICATE_QUESTION',at});seen.add(q.id);
  if(!l)errors.push({code:'MISSING_LESSON',at});
  else {
   if(q.lessonSourceHash!==l.sourceHash) {
    const c=compat[l.id];if(c?.currentSourceHash===l.sourceHash&&c.compatibleSourceHashes.includes(q.lessonSourceHash))compatBindings.push(q.id);
    else errors.push({code:'STALE_QUESTION_SOURCE',at});
   }
   for(const level of exam.levels||[exam.level])if(!manifest.levels[level]?.weeks.some(w=>w.lessonIds.includes(l.id)))errors.push({code:'UNSCHEDULED_LESSON',at,level});
  }
  if(q.optionsJa?.length!==4||!Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>3||q.optionReasonsJa?.length!==4)errors.push({code:'INVALID_QUESTION_SHAPE',at});
 }
 if(count!==total)errors.push({code:'WRONG_COUNT',bank,count,total});banks.push({bank,exams:data.exams.length,questions:count});
}
const dep=read('docs/ssw-workspace/agriculture/continuation-20261103b/daily/current-dependencies.json');
const levels={};for(const level of ['1','2']){const days=dep.days.filter(d=>d.level===level),ns=days.map(d=>d.japaneseParagraphCharacters).sort((a,b)=>a-b),median=ns[Math.floor(ns.length/2)];levels[level]={scheduledOccurrences:days.length,medianJapaneseParagraphCharacters:median,minJapaneseParagraphCharacters:ns[0],maxJapaneseParagraphCharacters:ns.at(-1),belowHalfMedian:days.filter(d=>d.japaneseParagraphCharacters<median/2).map(d=>d.lessonId),unmeasured:days.filter(d=>d.measuredMinutes===null).length};}
const tracked=new Set(cp.execFileSync('git',['ls-tree','-r','--name-only','HEAD','assets/agriculture'],{cwd:root,encoding:'utf8'}).trim().split('\n'));
const checks=read('src/data/agriculture/reader-moisture-checks.json').checks;
const body={schemaVersion:1,baselineCommit:cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),scope:'mechanical_dependencies_and_daily_metadata_only',groups:{banks:{status:errors.length?'FAIL':'PASS',banks,compatibleQuestionIds:compatBindings,errors},days:{levels,withoutLinkedFigure:dep.groups.scheduledDays.withoutLinkedFigure,assets:{linked:dep.figureAssets.length,trackedAtBaseline:dep.figureAssets.filter(f=>tracked.has(f.assetPath)).length,materialized:dep.figureAssets.filter(f=>f.available).length,notTracked:dep.figureAssets.filter(f=>!tracked.has(f.assetPath)).map(f=>f.assetPath)},screeningIsAcceptance:false},localesAndRuby:{lessonLocalePairs:dep.groups.lessonRevisions.checkedPairs,checks:checks.length,readerCheckLocalePairs:dep.groups.retrievalRevisions.checkedLocalePairs,dependencyErrors:dep.errors}},inputSha256:inputs,limits:{sourceUnitsNewlyAccepted:0,allLocaleSemanticsReviewed:false,figurePixelsInspected:false,figureRelevanceReviewed:false,learnerDurationMeasured:false,physicalDeviceTested:false,domainReviewed:false,nativeReviewed:false,audioAudited:false,sourceCoveragePercent:null}};
fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify(body,null,2)+'\n');console.log(JSON.stringify({banks:body.groups.banks.status,days:levels,assetSummary:body.groups.days.assets,lessonLocalePairs:body.groups.localesAndRuby.lessonLocalePairs,checks:checks.length}));if(errors.length)process.exitCode=1;
