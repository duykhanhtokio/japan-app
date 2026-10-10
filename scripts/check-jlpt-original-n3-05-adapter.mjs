import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root=fileURLToPath(new URL('../',import.meta.url));
const path=resolve(root,'src/data/jlpt-original/n3/05/formal-trial.ts');
const source=stripTypeScriptTypes(readFileSync(path,'utf8')).replace(/export const /g,'const ');
const context={require(name){const p=resolve(dirname(path),name);assert.ok(existsSync(p),name);return name.endsWith('.json')?JSON.parse(readFileSync(p,'utf8')):{uri:p};},result:null};
vm.runInNewContext(source+'\nresult={questions:N3_ORIGINAL_05_TRIAL,images:N3_ORIGINAL_05_VISUALS,key:N3_ORIGINAL_05_SESSION_KEY,ready:N3_ORIGINAL_05_REGISTRATION_READY};',context,{filename:path});
const {questions,images,key,ready}=context.result;
assert.equal(ready,true);
const registry=readFileSync(resolve(root,"src/data/jlpt-official/approved-n1-exams.ts"),"utf8");
assert.equal((registry.match(/id: 'jpapp-n3-original-05-v1'/g)||[]).length,1);
assert.ok(registry.includes("...(N3_ORIGINAL_05_REGISTRATION_READY ? [{"));
assert.equal(questions.length,102);assert.equal(new Set(questions.map(q=>q.id)).size,102);
assert.ok(key.includes('original:05'));
// New recordings include their own opening; the legacy 6.5s fallback would cut it off.
const starts=JSON.parse(readFileSync(resolve(root,'src/data/jlpt-official/listening-start-overrides.json'),'utf8'));
assert.equal(starts['jpapp-n3-original-05-v1'],0);
const startService=stripTypeScriptTypes(readFileSync(resolve(root,'src/services/jlpt-listening-start-storage.ts'),'utf8'))
 .replace(/^import savedStarts.*$/m,'').replace(/export /g,'');
const startContext={savedStarts:starts,result:null};
vm.runInNewContext(startService+"\nresult={original:getJlptListeningStart('jpapp-n3-original-05-v1'),fallback:getJlptListeningStart('unknown-exam')};",startContext);
assert.equal(startContext.result.original,0);assert.equal(startContext.result.fallback,6500);
const master=JSON.parse(readFileSync(resolve(root,'src/data/jlpt-original/n3/05/master.ja.json'),'utf8'));
for(const q of questions){
 const original=master.questions.find(x=>x.id===q.id);assert.equal(q.correctOptionId,original.correctOptionId);
 assert.equal(q.options.length,original.options.length);
 if(q.family==='listening'){
  assert.equal(q.audio.transcriptJa,'');assert.equal(q.audio.startMs,0);assert.ok(q.audio.endMs>0);
  for(const o of q.options)assert.equal(o.textJa,original.options.find(x=>x.id===o.id).text);
  if(q.problemNumber===5){
   assert.notEqual(q.promptJa,original.prompt,'Immediate-response utterances must remain audio-only');
   assert.ok(q.promptJa.includes('音声の短い言葉'));
  }
  if(q.questionNumber===1)assert.ok(q.instructionJa.includes('練習'));
  assert.ok(!q.instructionJa.includes('練習中は選択ボタンを押しません。練習中は選択ボタンを押しません。'));
 }
 if(q.family==='listening' && q.problemNumber===3)assert.notEqual(q.promptJa,original.prompt,'Summary question stays hidden until spoken');
 if(original.section==='grammar_reading')assert.equal(q.problemNumber,original.group-5);
 if(original.ordering)assert.equal(q.family,'sentenceComposition');
 if(q.visualOptionPage)assert.ok(images[q.visualOptionPage]);
}
assert.ok(images[401].uri.endsWith('problem-4-01.png'));
assert.equal(Object.keys(images).length,4);
console.log('ORIGINAL N3 05 ADAPTER PASS: 102 independent items, correct keys, five non-scored practice instructions, four mapped visuals, spoken choices/transcripts hidden. Execution check only; no device or full TypeScript approval.');
