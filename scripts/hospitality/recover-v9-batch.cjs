// Integrate self-reviewed sidecars in small, independently persistent batches.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{isDeepStrictEqual}=require('node:util');
const root=path.resolve(__dirname,'../..'),doc='docs/ssw-workspace/hospitality',baseline='bb4eb47c72363d1adf30a877024baa82bb5ef089';
const batches=[['hotel-restaurant-04','hotel-restaurant-05','hotel-restaurant-08'],['hotel-planning-06','hotel-safety-02','hotel-safety-04'],['hotel-safety-06','hotel-safety-07','hotel-safety-08']];
const n=Number(process.argv[2]),apply=process.argv.includes('--apply');assert(n>=1&&n<=3);const ids=batches[n-1],locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'],groups=['front','planning','service','restaurant','safety'];
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')),write=(p,x)=>fs.writeFileSync(path.join(root,p),JSON.stringify(x,null,2)+'\n');
const git=(...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:24*1024*1024}).trim();
const old=(ref,p)=>JSON.parse(git('show',`${ref}:${p}`)),same=(a,b,msg)=>assert(isDeepStrictEqual(a,b),msg),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const reportPath=`${doc}/recovery-v9/batch-${n}-integration.json`,parent=apply?git('rev-parse','HEAD'):read(reportPath).parentCommit;
const source={};for(const g of groups){const p=`src/data/hospitality/${g}.json`;source[g]=read(p).lessons;same(read(p),old(baseline,p),'Canonical Japanese changed');}
for(const p of ['src/data/hospitality/catalog.json','docs/ssw-workspace/source-coverage-v2/hospitality.json'])same(read(p),old(baseline,p),'Catalog/source coverage changed');
function strings(l){return [l.title,...l.objectives.map(x=>x.text),...l.sections.flatMap(x=>[x.title,x.body]),...l.terms.map(x=>x.meaning),l.example.situation,...l.example.steps,l.practice.prompt,...l.practice.expectedPoints,...l.questions.flatMap(x=>[x.prompt,...x.choices,x.explanation]),l.illustration.caption,l.illustration.alt];}
const patches=[],pairs=[];let fields=0,newQuestions=0,outside=0;
for(const locale of locales)for(const g of groups){const p=`src/data/hospitality/translations/${locale}/${g}.json`,before=old(parent,p),after=apply?structuredClone(before):read(p);
 for(const s of source[g].filter(x=>ids.includes(x.id))){
  const sidecarPath=`${doc}/recovery-v9/${locale}/${s.id}.json`,packet=read(sidecarPath),t=packet.lesson;assert.equal(packet.locale,locale);assert.equal(packet.review.selfReviewed,true);
  for(const f of ['nativeReviewed','domainReviewed','physicalDeviceTested','learnerDurationMeasured'])assert.equal(packet.review[f],false,'Unearned acceptance');
  assert.equal(t.id,s.id);assert.equal(t.sourceRevision,s.revision);assert.equal(t.status,'translated_ai_unreviewed');assert.equal(t.reading,s.reading);
  for(const f of ['objectives','sections','terms','questions'])assert.equal(t[f].length,s[f].length,`${locale}/${s.id}/${f}`);
  for(const f of ['objectives','sections'])same(t[f].map(x=>x.id),s[f].map(x=>x.id),'IDs changed');
  same(t.terms.map(x=>[x.ja,x.reading]),s.terms.map(x=>[x.ja,x.reading]),'Term metadata changed');
  same(t.questions.map(x=>[x.id,x.answerIndex,x.knowledgeIds]),s.questions.map(x=>[x.id,x.answerIndex,x.knowledgeIds]),'Question metadata changed');
  assert.equal(t.example.steps.length,s.example.steps.length);assert.equal(t.practice.expectedPoints.length,s.practice.expectedPoints.length);assert.equal(t.illustration.id,s.illustration.id);assert.equal(t.illustration.keyObjectiveId,s.illustration.keyObjectiveId);
  for(const q of t.questions){assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);}
  const text=strings(t);assert.equal(text.length,strings(s).length);text.forEach(x=>assert(typeof x==='string'&&x.trim(),'Empty translated field'));t.sections.forEach((x,i)=>assert.notEqual(x.body,s.sections[i].body,'Copied Japanese'));
  const previous=before.lessons.find(x=>x.id===s.id);newQuestions+=t.questions.filter(q=>!previous?.questions.some(x=>x.id===q.id)).length;fields+=text.length;
  if(apply){const index=after.lessons.findIndex(x=>x.id===s.id);if(index<0)after.lessons.push(t);else after.lessons[index]=t;}else same(after.lessons.find(x=>x.id===s.id),t,'Runtime differs from self-reviewed sidecar');
  pairs.push({locale,lessonId:s.id,sourceRevision:s.revision,sidecarPath,lessonSha256:hash(t),reviewedSidecarSha256:hash(packet)});
 }
 same(after.lessons.filter(x=>!ids.includes(x.id)),before.lessons.filter(x=>!ids.includes(x.id)),`${locale}/${g}: outside scope changed`);outside+=before.lessons.filter(x=>!ids.includes(x.id)).length;
 assert.equal(new Set(after.lessons.map(x=>x.id)).size,after.lessons.length,'Duplicate lesson');if(apply&&source[g].some(x=>ids.includes(x.id)))patches.push([p,after]);
}
assert.equal(pairs.length,36);
const dailyPath=`${doc}/daily-workload.json`,daily=old(parent,dailyPath);for(const day of daily.days)if(ids.includes(day.lessonId))for(const locale of locales)day.translationStatus[locale]='translated_ai_unreviewed';
if(apply){for(const[p,d]of patches)write(p,d);write(dailyPath,daily);}else same(read(dailyPath),daily,'Only selected day translation statuses may change');
const report={status:'PASS_RECOVERY_V9_BATCH',batch:n,parentCommit:parent,baselineCommit:baseline,lessonIds:ids,pairs:36,translatedFields:fields,newQuestionTranslations:newQuestions,preservedOutsidePairs:outside,japaneseCanonicalUnchanged:true,sourceCoverageChanged:false,nativeReviewed:false,domainReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false,pairEvidence:pairs};
if(apply)write(reportPath,report);else same(report,read(reportPath),'Integration report stale');console.log(JSON.stringify({...report,pairEvidence:undefined}));
