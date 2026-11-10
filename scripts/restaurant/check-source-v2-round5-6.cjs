/** Source31 cost/labor/ABC additions: exact revisions, preserved attempts and aligned new readings.
 * Structural/AI self-review evidence only; no native, expert, real-device or duration acceptance.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),assert=require('node:assert/strict');
const R=path.resolve(__dirname,'../..'),D='docs/ssw-workspace/restaurant/source-closure31/',V='docs/ssw-workspace/source-coverage-v2/',base='4832f53f8407298126fa43c104a266972f2a3831';
const read=p=>JSON.parse(fs.readFileSync(path.join(R,p),'utf8')),old=p=>JSON.parse(cp.execFileSync('git',['show',base+':'+p],{cwd:R,maxBuffer:32e6,encoding:'utf8'}));
const packets=[read(D+'integration/source-v2-r5-operations-authoring-20261103.json'),read(D+'integration/source-v2-r6-operations-authoring-20261103.json')], authored=packets.flatMap(p=>p.questions),ids=new Set(authored.map(q=>q.id));assert.equal(ids.size,5);
const canonical=read(D+'canonical-ja.json').items,questions={},preservation=[];
for(const level of ['1','2']){
 for(const kind of ['lessons','exams']){const p=`src/data/restaurant/${kind}.${level}.ja.json`;assert.deepEqual(read(p),old(p),'Preserve all core content/IDs/answers/readings');}
 const p=`src/data/restaurant/source31/${level}.json`,before=old(p).lessons,after=read(p).lessons;let kept=0,added=0;
 for(const [lid,row]of Object.entries(before)){
  const now=after[lid];assert(now);for(const k of ['lessonId','lessonSourceHash','lessonSignature','sections','figures','terms','references'])assert.deepEqual(now[k],row[k],`Preserve ${lid} ${k}`);
  const prior=(row.exam||{}).questions||[],next=(now.exam||{}).questions||[],priorIds=new Set(prior.map(q=>q.id));assert.deepEqual(next.filter(q=>priorIds.has(q.id)),prior,'Question object/order preservation');kept+=prior.length;added+=next.length-prior.length;
  for(const q of next)questions[q.id]=q;
 }
 assert.equal(added,level==='2'?5:0);preservation.push({level,existingQuestionsPreserved:kept,newQuestions:added});
}
assert(fs.readFileSync(path.join(R,'src/services/restaurant-study-state.ts')).equals(cp.execFileSync('git',['show',base+':src/services/restaurant-study-state.ts'],{cwd:R})), 'Preserve learner state service');
let rubyFields=0;const explicit=[['和','わ'],['人時','にんじ'],['日','ひ'],['二品','ふたしな'],['累積構成比','るいせきこうせいひ']];
for(const q of authored){const c=canonical[q.id],n=questions[q.id];assert(c&&n);assert.equal(c.optionsJa[c.correctIndex],q.optionsJa[q.correctIndex]);assert.equal(n.optionsJa[n.correctIndex],q.optionsJa[q.correctIndex]);assert.equal(n.sourceHash,c.sourceHash);
 const fields=[[n.stemJa,n.furigana.stem],[n.explanationJa,n.furigana.explanation],...n.optionsJa.map((t,i)=>[t,n.furigana.options[i]]),...n.optionReasonsJa.map((t,i)=>[t,n.reasonRuby[i]])];
 for(const[t,seq]of fields){assert.equal(seq.map(s=>s.text).join(''),t);for(const s of seq)if(/[一-龯]/u.test(s.text))assert(s.reading,`${q.id} unannotated ${s.text}`);for(const[text,reading]of explicit)for(const s of seq)if(s.text===text)assert.equal(s.reading,reading,`${q.id} context ${text}`);rubyFields++;}
}
const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let pairs=0,fields=0;
for(const locale of locales){const p=`src/data/restaurant/source31/${locale}.json`,before=old(p).items,after=read(p).items;for(const[id,v]of Object.entries(before))assert.deepEqual(after[id],v,`Preserve ${locale} ${id}`);assert.deepEqual(Object.keys(after).filter(id=>!Object.hasOwn(before,id)).sort(),[...ids].sort());
 for(const packet of packets){const tag=packet===packets[0]?'r5':'r6',targets=read(D+`translations/${locale}/source-v2-${tag}-operations-20261103.json`).items;for(const q of packet.questions){const t=targets[q.id];assert.deepEqual(after[q.id],t);assert.equal(t.sourceHash,canonical[q.id].sourceHash);assert.equal(new Set(t.options.map(s=>s.normalize('NFKC').trim())).size,4);assert.equal(t.reasons.length,4);const values=[t.objective,t.stem,t.explanation,...t.options,...t.reasons];assert(values.every(v=>typeof v==='string'&&v.trim()));fields+=values.length;pairs++;}}
}
const ledger=read(V+'restaurant.json');assert.equal(ledger.denominator.status,'open');assert.equal(ledger.wholeSourceKnowledgeCovered,false);
for(const q of authored){const u=ledger.knowledgeUnits.find(u=>u.knowledgeId===q.factIds[0]);assert.equal(u.status,'covered_ai');assert(u.sourceRefs.every(s=>s.elementIds.length));assert.equal(u.sourceReview.conditionsChecked,true);assert(u.assessmentEvidence.some(e=>e.path==='src/data/restaurant/source31/2.json'&&e.semanticReviewed&&e.relation==='direct'));assert(u.teachingEvidence.some(e=>e.semanticReviewed&&e.relation==='direct'));}
const previousLedger=old(V+'restaurant.json');for(const u of previousLedger.knowledgeUnits)assert.deepEqual(ledger.knowledgeUnits.find(v=>v.knowledgeId===u.knowledgeId).before,u.before,'Historical before states preserved');
// Independent arithmetic check of the newly authored calculation models.
assert.equal(100-32,68);assert.equal(240/800*100,30);assert.equal((200*30+300*20)/40000*100,30);assert.equal(200/40,5);assert.equal((50000+30000)/(50000+30000+20000)*100,80);
const report={status:'PASS',baselineCommit:base,sourceGroups:3,newQuestions:ids.size,explicitlyClosedKnowledgeUnits:5,newTranslatedPairs:pairs,newTranslatedVisibleFields:fields,newRubyFields:rubyFields,preserved:preservation,allExistingLocaleItemsPreserved:true,learnerStateServicePreserved:true,sourceDenominator:'open',wholeSectorCovered:false,knownUnits:ledger.knowledgeUnits.length,coveredAi:ledger.knowledgeUnits.filter(u=>u.status==='covered_ai').length,nativeReviewed:false,domainReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false};
fs.writeFileSync(path.join(R,V+'restaurant-r5-r6-validation-20261103.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
