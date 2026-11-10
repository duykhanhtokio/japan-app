// Integration/preservation only; semantic review belongs to each locale author.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),baseline='d03ead72b51c3ef5888f687e00d860ec7ba6dbe5';
const ids=['hotel-restaurant-01','hotel-restaurant-02','hotel-restaurant-03'];
const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const old=p=>JSON.parse(cp.execFileSync('git',['show',`${baseline}:${p}`],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024}));
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const fields=l=>[l.title,...l.objectives.map(x=>x.text),...l.sections.flatMap(x=>[x.title,x.body]),...l.terms.map(x=>x.meaning),l.example.situation,...l.example.steps,l.practice.prompt,...l.practice.expectedPoints,...l.questions.flatMap(x=>[x.prompt,...x.choices,x.explanation]),l.illustration.caption,l.illustration.alt];
for(const group of ['front','planning','service','restaurant','safety'])assert.deepEqual(read(`src/data/hospitality/${group}.json`),old(`src/data/hospitality/${group}.json`),'Japanese canonical changed');
assert.deepEqual(read('src/data/hospitality/catalog.json'),old('src/data/hospitality/catalog.json'),'Catalog or revisions changed');
assert.deepEqual(read('docs/ssw-workspace/source-coverage-v2/hospitality.json'),old('docs/ssw-workspace/source-coverage-v2/hospitality.json'),'Source acceptance ledger changed during translation');
const source=read('src/data/hospitality/restaurant.json').lessons;
let preserved=0,translatedFields=0,newQuestionTranslations=0;const pairs=[];
for(const locale of locales){
 const p=`src/data/hospitality/translations/${locale}/restaurant.json`,before=old(p),after=read(p);
 for(const group of ['front','planning','service','safety']){const other=`src/data/hospitality/translations/${locale}/${group}.json`;assert.deepEqual(read(other),old(other),`${locale}/${group}: outside scope changed`);}
 assert.equal(new Set(after.lessons.map(x=>x.id)).size,after.lessons.length,'Duplicate lesson');
 assert.deepEqual(after.lessons.filter(x=>!ids.includes(x.id)),before.lessons.filter(x=>!ids.includes(x.id)),`${locale}: outside scope changed`);
 preserved+=before.lessons.filter(x=>!ids.includes(x.id)).length;
 assert.equal(after.lessons.length,before.lessons.length+ids.filter(id=>!before.lessons.some(x=>x.id===id)).length,'Unexpected additions');
 for(const id of ids){
  const s=source.find(x=>x.id===id),t=after.lessons.find(x=>x.id===id);assert(t,`${locale}/${id} missing`);
  const prior=before.lessons.find(x=>x.id===id);newQuestionTranslations+=t.questions.filter(q=>!prior?.questions.some(x=>x.id===q.id)).length;
  assert.equal(t.sourceRevision,s.revision);assert.equal(t.status,'translated_ai_unreviewed');assert.equal(t.reading,s.reading);
  for(const key of ['objectives','sections','terms','questions'])assert.equal(t[key].length,s[key].length,`${locale}/${id}/${key}`);
  for(const key of ['objectives','sections'])assert.deepEqual(t[key].map(x=>x.id),s[key].map(x=>x.id));
  assert.deepEqual(t.terms.map(x=>[x.ja,x.reading]),s.terms.map(x=>[x.ja,x.reading]));
  assert.deepEqual(t.questions.map(x=>[x.id,x.answerIndex,x.knowledgeIds]),s.questions.map(x=>[x.id,x.answerIndex,x.knowledgeIds]));
  assert.equal(t.example.steps.length,s.example.steps.length);assert.equal(t.practice.expectedPoints.length,s.practice.expectedPoints.length);
  assert.equal(t.illustration.id,s.illustration.id);assert.equal(t.illustration.keyObjectiveId,s.illustration.keyObjectiveId);
  for(const q of t.questions){assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);}
  assert.notEqual(t.review?.nativeReviewed,true);assert.notEqual(t.review?.domainReviewed,true);
  const values=fields(t);assert.equal(values.length,fields(s).length);values.forEach(v=>assert(typeof v==='string'&&v.trim(),'Empty field'));
  t.sections.forEach((x,i)=>assert.notEqual(x.body,s.sections[i].body,'Copied Japanese body'));
  translatedFields+=values.length;pairs.push({locale,lessonId:id,sourceRevision:s.revision,jsonValueSha256:hash(t),translatedFields:values.length});
 }
}
assert.equal(pairs.length,36);
const receipts=['en-vi','zh','id-tl','hi-bn','ne-my','th-km'],seen=new Set();
for(const tag of receipts){
 const receipt=read(`docs/ssw-workspace/hospitality/continuation-v8-${tag}.json`);
 assert.equal(receipt.baselineCommit,baseline);
 for(const flag of ['nativeReviewed','domainReviewed','physicalDeviceTested','learnerDurationMeasured'])assert.equal(receipt[flag],false,`${tag}: unearned acceptance`);
 const entries=Array.isArray(receipt.pairs)?receipt.pairs:receipt.pairEvidence;assert.equal(entries.length,6);
 for(const item of entries){const key=`${item.locale}/${item.lessonId}`;assert(!seen.has(key),'Duplicate author receipt');seen.add(key);const actual=pairs.find(x=>x.locale===item.locale&&x.lessonId===item.lessonId);assert(actual,`Unexpected receipt ${key}`);assert.equal(item.jsonValueSha256,actual.jsonValueSha256,`${key}: author receipt stale`);assert.equal(item.sourceRevision,actual.sourceRevision);}
}
assert.equal(seen.size,36);
const status=read('docs/ssw-workspace/hospitality/translation-status.json');assert.equal(status.completePairs,348);assert.equal(status.stale.length+status.missing.length,108);
const dailyPath='docs/ssw-workspace/hospitality/daily-workload.json',daily=read(dailyPath),dailyBefore=old(dailyPath);
const expectedDaily=structuredClone(dailyBefore);
for(const day of expectedDaily.days)if(ids.includes(day.lessonId))for(const locale of locales)day.translationStatus[locale]='translated_ai_unreviewed';
assert.deepEqual(daily,expectedDaily,'Only target day translation status may change; acceptance/workload must remain unchanged');
const report={status:'PASS_CONTINUATION_V8',baseline,lessonIds:ids,pairsCompleted:36,translatedFields,newQuestionTranslations,preservedOutsideRestaurantPairs:preserved,currentSectorPairs:348,remainingPairs:108,japaneseCanonicalUnchanged:true,sourceCoverageChanged:false,semanticReview:'locale author self-review only',nativeReviewed:false,domainReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false,pairs};
fs.writeFileSync(path.join(root,'docs/ssw-workspace/hospitality/continuation-v8-integration.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,pairs:undefined}));
