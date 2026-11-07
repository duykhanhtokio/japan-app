const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const bank=read('src/data/agriculture/mock-exams.ja.json'),weekly=read('src/data/agriculture/weekly-checks.ja.json'),manifest=read('src/data/agriculture/course-manifest.json');
const lessons=new Map(read('src/data/agriculture/lessons.ja.json').lessons.map(l=>[l.id,l])),knowledge=new Map(read('docs/ssw-workspace/agriculture/knowledge-ledger.json').knowledge.map(k=>[k.id,k]));
const sort=x=>Array.isArray(x)?x.map(sort):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sort(x[k])])):x;
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(sort(x))).digest('hex');
const ids=new Set(weekly.exams.flatMap(e=>[e.id,...e.questions.map(q=>q.id)])),stems=new Set(weekly.exams.flatMap(e=>e.questions.map(q=>q.stemJa))),objectives=new Set();
assert.equal(bank.schemaVersion,1);assert.equal(bank.officialSimulation,false);
for(const exam of bank.exams){
 assert(!ids.has(exam.id),'Duplicate exam ID '+exam.id);ids.add(exam.id);
 assert.equal(exam.kind,'mock');assert(exam.level==='1'||exam.level==='2');assert.deepEqual(exam.levels,[exam.level]);
 assert(exam.titleJa);assert.equal(exam.officialSimulation,false);assert.equal(exam.timeLimitMinutes,null);assert.equal(exam.passThreshold,null);
 assert.equal(exam.questions.length,40);const counts=[0,0,0,0];
 for(const [i,q]of exam.questions.entries()){
  assert(!ids.has(q.id),'Duplicate question ID '+q.id);ids.add(q.id);assert(q.stemJa&&q.stemJa.trim());
  assert(!stems.has(q.stemJa),'Duplicate stem '+q.id);stems.add(q.stemJa);
  assert(q.objectiveId&&typeof q.objectiveId==='string','Missing assessment objective '+q.id);
  assert(!objectives.has(q.objectiveId),'Repeated assessment objective '+q.objectiveId);objectives.add(q.objectiveId);
  assert.equal(q.optionsJa.length,4);assert.equal(new Set(q.optionsJa).size,4);assert(q.optionsJa.every(x=>typeof x==='string'&&x.trim()));
  assert.equal(q.optionReasonsJa.length,4);assert(q.optionReasonsJa.every(x=>typeof x==='string'&&x.trim()));
  assert(Number.isInteger(q.correctIndex)&&q.correctIndex>=0&&q.correctIndex<4);counts[q.correctIndex]++;
  if(i>=2)assert(!(q.correctIndex===exam.questions[i-1].correctIndex&&q.correctIndex===exam.questions[i-2].correctIndex),'Three consecutive answers '+q.id);
  const lesson=lessons.get(q.lessonId);assert(lesson,'Unknown lesson '+q.id);assert(lesson.levels.includes(exam.level),'Lesson outside level '+q.id);assert.equal(q.lessonSourceHash,lesson.sourceHash);
  assert(q.knowledgeIds.length>0);for(const id of q.knowledgeIds)assert(knowledge.get(id)?.lessonIds.includes(q.lessonId),'Unknown knowledge binding '+q.id+'/'+id);
  assert.equal(q.nativeReviewed,false);assert.equal(q.domainReviewed,false);
 }
 assert.deepEqual(counts,[10,10,10,10]);assert.equal(exam.revision,'v1-'+hash(exam.questions).slice(0,16));
}
for(const level of ['1','2'])assert.deepEqual(manifest.levels[level].mockExams,bank.exams.filter(e=>e.level===level).map(e=>e.id));
const formsByLevel=Object.fromEntries(['1','2'].map(l=>[l,bank.exams.filter(e=>e.level===l).length]));
assert.equal(bank.complete,formsByLevel['1']===10&&formsByLevel['2']===10);
console.log(JSON.stringify({status:'PASS',formsByLevel,mockQuestions:bank.exams.reduce((n,e)=>n+e.questions.length,0),complete:bank.complete,semanticUniquenessCertified:false,nativeReviewed:false,domainReviewed:false}));
