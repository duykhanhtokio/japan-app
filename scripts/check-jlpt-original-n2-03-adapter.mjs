import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root=fileURLToPath(new URL('../',import.meta.url)),path=resolve(root,'src/data/jlpt-original/n2/03/formal-trial.ts');
const source=stripTypeScriptTypes(readFileSync(path,'utf8')).replace(/export const /g,'const ');
const context={require(name){const p=resolve(dirname(path),name);assert.ok(existsSync(p),name);return name.endsWith('.json')?JSON.parse(readFileSync(p,'utf8')):{uri:p};},result:null};
vm.runInNewContext(source+'\nresult={questions:N2_ORIGINAL_03_TRIAL,images:N2_ORIGINAL_03_VISUALS,key:N2_ORIGINAL_03_SESSION_KEY,ready:N2_ORIGINAL_03_REGISTRATION_READY};',context,{filename:path});
const {questions,images,key,ready}=context.result;assert.equal(ready,true);
const registry=readFileSync(resolve(root,'src/data/jlpt-official/approved-n1-exams.ts'),'utf8');assert.equal((registry.match(/id: 'jpapp-n2-original-02-v1'/g)||[]).length,1);assert.ok(registry.includes('...(N2_ORIGINAL_03_REGISTRATION_READY ? [{'));
assert.equal(questions.length,106);assert.equal(new Set(questions.map(q=>q.id)).size,106);assert.equal(key,'jlpt:jpapp:n2:original:03:v1');assert.equal(Object.keys(images).length,0);
const starts=JSON.parse(readFileSync(resolve(root,'src/data/jlpt-official/listening-start-overrides.json'),'utf8'));assert.equal(starts['jpapp-n2-original-02-v1'],0);
const master=JSON.parse(readFileSync(resolve(root,'src/data/jlpt-original/n2/03/master.ja.json'),'utf8'));
for(const q of questions){const o=master.questions.find(x=>x.id===q.id);assert.equal(q.correctOptionId,o.correctOptionId);assert.equal(q.options.length,o.options.length);assert.equal(q.problemNumber,o.group);
 if(q.family==='listening'){
  assert.equal(q.audio.transcriptJa,'');assert.equal(q.audio.startMs,0);assert.ok(q.audio.endMs>0);
  if([3,4].includes(q.problemNumber))for(const opt of q.options)assert.equal(opt.textJa,`音声の選択肢 ${opt.id}`);
  if([3,4,5].includes(q.problemNumber))assert.notEqual(q.promptJa,o.prompt,'No advance gist/integrated question or printed immediate-response utterance');
  if(q.questionNumber===1)assert.ok(q.instructionJa.includes('練習'));
 }else assert.equal(q.sectionId,'language-knowledge-reading','N2 written uses one combined 105-minute section');
 if(o.ordering)assert.equal(q.family,'sentenceComposition');
 if(o.passageId)assert.equal(q.passageJa,master.passages[o.passageId]);
}
const shared=questions.filter(q=>q.id.includes('-listening-5-0')&&[3,4].includes(q.questionNumber));assert.equal(shared.length,2);assert.equal(shared[0].audio.segmentId,shared[1].audio.segmentId);assert.notEqual(shared[0].id,shared[1].id);
console.log('ORIGINAL N2 03 ADAPTER PASS: 106 unique scored items, combined written section, shared dialogue with independent answer IDs, spoken choices/transcripts/advance questions hidden.');
