import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {stripTypeScriptTypes} from 'node:module';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import vm from 'node:vm';
const out=fileURLToPath(new URL('./',import.meta.url)),root=resolve(out,'../../../../..'),data=resolve(root,'src/data/manufacturing');
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const source=stripTypeScriptTypes(readFileSync(resolve(data,'editorial-translations.ts'),'utf8')).replaceAll('export ','');
const context={require(name){return read(resolve(data,name));},result:null};
vm.runInNewContext(source+'\nresult={revisedManufacturingLessonTranslation};',context);
const terms=JSON.parse(gunzipSync(readFileSync(resolve(out,'terminology-map.json.gz')))).terms;
const semantic=read(resolve(out,'semantic-review.json'));
const lessons=['mechanical','electrical','surface'].flatMap(s=>read(resolve(data,s+'.json')).lessons);
let count=0;
for(const row of semantic.records){
 const lesson=lessons.find(l=>l.id===row.lessonId);
 const raw=read(resolve(data,'translations',row.locale+'.json')).lessons[lesson.id];
 const effective=context.result.revisedManufacturingLessonTranslation(lesson,row.locale,raw);
 assert.equal(effective.terms[row.termIndex].meaning,row.effectiveBefore);
 const mapped=terms[row.termJa].glossaryOccurrences.find(x=>x.lessonId===row.lessonId&&x.termIndex===row.termIndex).targets[row.locale];
 assert.equal(mapped.meaning,row.effectiveBefore);count++;
}
console.log(`RUNTIME EFFECTIVE TARGET PASS: ${count} reviewed meanings equal actual production editorial getter output; raw-bank false positives not duplicated.`);
