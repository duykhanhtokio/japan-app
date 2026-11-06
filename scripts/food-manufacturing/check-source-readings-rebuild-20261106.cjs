// Verify the actual offline loader, not a copied repair implementation.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {stripTypeScriptTypes}=require('node:module');
const root=path.resolve(__dirname,'../..'),data=path.join(root,'src/data/food-manufacturing');
const read=p=>JSON.parse(fs.readFileSync(path.join(data,p),'utf8'));
const pack=read('ruby/weekly-first.json'),rest=read('ruby/weekly-rest.json');
const [mock1a,mock1b,mock2a,mock2b]=['1-a','1-b','2-a','2-b'].map(n=>read(`ruby/mock-${n}.json`));
const parts=Array.from({length:6},(_,i)=>read(`authoring-20261029/part${i+1}.json`));
const supplementalQuestionRuby=Object.assign({},...parts.map(p=>p.questionRuby?.questions??{}));
const rawReadings=Object.assign({},pack.questions,rest.questions,mock1a.questions,mock1b.questions,mock2a.questions,mock2b.questions,supplementalQuestionRuby);
const gate=stripTypeScriptTypes(fs.readFileSync(path.join(root,'src/components/world/japanese-ruby-data.ts'),'utf8').replace(/^import type .*$/gm,'')).replace(/^export /gm,'');
const {hasAlignedRuby}=vm.runInNewContext(gate+';({hasAlignedRuby})');
const code=stripTypeScriptTypes(fs.readFileSync(path.join(data,'question-ruby.ts'),'utf8').replace(/^import .*$/gm,'')).replace(/^export /gm,'');
const {foodManufacturingQuestionRuby:getRuby}=vm.runInNewContext(code+';({foodManufacturingQuestionRuby})',{pack,rest,mock1a,mock1b,mock2a,mock2b,supplementalQuestionRuby,hasAlignedRuby});
function revision(value){const text=JSON.stringify(value);let h=2166136261;for(let i=0;i<text.length;i++)h=Math.imul(h^text.charCodeAt(i),16777619);return `fnv1a-${(h>>>0).toString(16)}`;}
const expectedChanges=new Set(['food-1-q201/stemJa','food-1-q201/optionReasonsJa.2','food-2-q075/optionsJa.0','food-2-q064/optionsJa.0']);
const seen=new Set();let fields=0,stale=0;
for(const e of [...read('exams.ja.json').exams,...parts.flatMap(p=>p.exams??[])])for(const q of e.questions){
 const question={id:q.id,sourceHash:revision({promptJa:q.promptJa,optionsJa:q.optionsJa,explanationJa:q.explanationJa,optionExplanationsJa:q.optionExplanationsJa})};
 const values={stemJa:q.promptJa,...Object.fromEntries(q.optionsJa.map((s,i)=>[`optionsJa.${i}`,s])),explanationJa:q.explanationJa,...Object.fromEntries(q.optionExplanationsJa.map((s,i)=>[`optionReasonsJa.${i}`,s]))};
 for(const [field,text]of Object.entries(values)){
  const result=getRuby(question,field,text);assert(result,`${q.id}/${field}: unavailable`);assert.equal(result.map(s=>s.text).join(''),text);
  const key=`${q.id}/${field}`,changed=JSON.stringify(result)!==JSON.stringify(rawReadings[q.id].fields[field]);
  assert.equal(changed,expectedChanges.has(key),`unexpected reading difference ${key}`);if(changed)seen.add(key);
  assert.equal(getRuby({...question,sourceHash:'stale'},field,text),undefined);assert.equal(getRuby(question,field,text+'変更'),undefined);fields++;stale+=2;
  if(key==='food-1-q201/stemJa'||key==='food-1-q201/optionReasonsJa.2')assert(result.some(s=>s.text==='切傷'&&s.reading==='せっしょう'));
  if(key==='food-2-q075/optionsJa.0'){assert(result.some(s=>s.text==='日'&&s.reading==='び'));assert(result.map(s=>s.reading??s.text).join('').includes('てんけんび'));}
  if(key==='food-2-q064/optionsJa.0')assert.equal(result.map(s=>s.reading??s.text).join(''),'おんどとふりょうりつをにじくにしたさんぷず。');
 }
}
assert.deepEqual([...seen].sort(),[...expectedChanges].sort());assert.equal(fields,8480);
console.log(JSON.stringify({status:'PASS',questions:848,fields,changedFields:4,rootReadingCorrections:3,untouchedFields:fields-4,staleOrMisalignedRejections:stale,canonicalQuestionTextPreserved:true,answersAndRevisionsPreserved:true,actualOfflineLoader:true,sourceRecoveryMode:'rebuild_content_not_d72833f84_recovery',nativeReviewed:false,physicalDeviceTested:false}));
