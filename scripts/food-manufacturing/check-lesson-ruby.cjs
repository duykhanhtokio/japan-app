const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {stripTypeScriptTypes}=require('node:module');
const root=path.resolve(__dirname,'../..'),data=path.join(root,'src/data/food-manufacturing');
const lessons=['1','2'].flatMap(l=>JSON.parse(fs.readFileSync(path.join(data,`lessons.${l}.ja.json`))).lessons);
const gateSource=stripTypeScriptTypes(fs.readFileSync(path.join(root,'src/components/world/japanese-ruby-data.ts'),'utf8').replace(/^import type .*$/gm,'')).replace(/^export /gm,'');
const {hasAlignedRuby}=vm.runInNewContext(gateSource+';({hasAlignedRuby})');
let source=fs.readFileSync(path.join(data,'lesson-ruby.ts'),'utf8')
 .replace(/^import type .*$/gm,'').replace(/^import \{hasAlignedRuby\}.*$/gm,'')
 .replace(/^import (pack\d) from '(.+\.json)';$/gm,(_,name,file)=>`const ${name}=load(${JSON.stringify(file)});`);
source=stripTypeScriptTypes(source).replace(/^export /gm,'');
const packs=Array.from({length:6},(_,i)=>JSON.parse(fs.readFileSync(path.join(data,`ruby/lessons-0${i+1}.json`))));
const {foodManufacturingLessonRuby,readings}=vm.runInNewContext(source+';({foodManufacturingLessonRuby,readings})',{hasAlignedRuby,load:file=>JSON.parse(fs.readFileSync(path.join(data,file)))});
let fields=0,segments=0,kanjiSegments=0;
const ids=new Set();
for(const pack of packs){assert.equal(pack.status,'authored_ai_unreviewed');for(const id of Object.keys(pack.lessons)){assert(!ids.has(id));ids.add(id);}}
assert.equal(ids.size,78);
for(const lesson of lessons){
 const expected={titleJa:lesson.titleJa,objectiveJa:lesson.objectiveJa,activityJa:lesson.activityJa,summaryJa:lesson.summaryJa};
 for(const p of lesson.paragraphs){expected[`paragraphs.${p.id}.titleJa`]=p.titleJa;expected[`paragraphs.${p.id}.textJa`]=p.textJa;}
 assert.equal(readings[lesson.id].sourceHash,lesson.sourceHash);
 assert.deepEqual(Object.keys(readings[lesson.id].fields).sort(),Object.keys(expected).sort());
 for(const [key,text] of Object.entries(expected)){
  const value=foodManufacturingLessonRuby(lesson,key,text);assert(value,`${lesson.id}/${key}`);fields++;segments+=value.length;
  for(const part of value)if(/\p{Script=Han}/u.test(part.text)){assert(part.reading);kanjiSegments++;}
  assert.equal(foodManufacturingLessonRuby({...lesson,sourceHash:'stale'},key,text),undefined);
  assert.equal(foodManufacturingLessonRuby(lesson,key,text+'変更'),undefined);
 }
 // A damaged entry must fail closed instead of displaying partial/wrong readings.
 const entry=readings[lesson.id],saved=entry.fields.objectiveJa;
 entry.fields.objectiveJa=[{text:lesson.objectiveJa,reading:'INVALID'}];assert.equal(foodManufacturingLessonRuby(lesson,'objectiveJa',lesson.objectiveJa),undefined);
 entry.fields.objectiveJa=[{text:lesson.objectiveJa}];assert.equal(foodManufacturingLessonRuby(lesson,'objectiveJa',lesson.objectiveJa),undefined);
 entry.fields.objectiveJa=saved;
}
console.log(JSON.stringify({status:'PASS',lessons:lessons.length,fields,segments,kanjiSegments,staleAndMisalignedRejected:fields,malformedAndUncoveredRejected:156,nativeReviewed:false,deviceTested:false}));
