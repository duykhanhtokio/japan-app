const path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
(async()=>{
 const out=await require('esbuild').build({entryPoints:[path.join(root,'src/services/manufacturing-mock-state.ts')],bundle:true,platform:'node',format:'cjs',write:false});const m={exports:{}};new Function('module','exports',out.outputFiles[0].text)(m,m.exports);const a=m.exports;
 const section=(id,n,options,min)=>({id,durationMs:40*60*1000,passMinimumCorrect:min,questions:Array.from({length:n},(_,i)=>({id:id+'-'+i,correctIndex:i%options,optionsJa:Array.from({length:options},(_,j)=>String(j))}))});
 const exam={id:'mfg1-mechanical-mock-test',revision:'unit-v1',specialty:'mechanical',kind:'mock',officialSimulation:true,titleJa:'テスト用',sections:{theory:section('t',30,2,20),practical:section('p',10,4,6)}};
 assert.equal(exam.sections.theory.durationMs,2400000);assert.equal(exam.sections.practical.durationMs,2400000);assert.equal(2*exam.sections.theory.durationMs,4800000);
 let x=a.freshManufacturingMock(exam);assert.equal(a.gradeManufacturingMock(x,exam),null);assert.equal(a.restoreManufacturingMock(null,exam).sections.theory.startedAt,null);assert.equal(a.startManufacturingMockSection(x,exam,'practical',100),x);
 x=a.startManufacturingMockSection(x,exam,'theory',1000);const deadline=x.sections.theory.deadlineAt;assert.equal(a.mockRemainingMs(x.sections.theory,exam.sections.theory,2000),2399000);assert.equal(a.startManufacturingMockSection(x,exam,'theory',2000),x);
 x=a.answerManufacturingMock(x,exam,'theory',0,1,2000);assert.equal(x.sections.theory.answers[0],1);assert.equal(a.answerManufacturingMock(x,exam,'theory',0,2,2100),x);x=a.navigateManufacturingMock(x,exam,'theory',9,2200);
 const restored=a.restoreManufacturingMock(JSON.stringify(x),exam);assert.deepEqual(restored,x);assert.equal(restored.sections.theory.deadlineAt,deadline);assert.equal(restored.sections.theory.currentQuestion,9);
 assert.equal(a.mockRemainingMs(restored.sections.theory,exam.sections.theory,1000),2398800);assert.equal(a.restoreManufacturingMock(JSON.stringify(x),{...exam,revision:'changed'}),null);
 for(const mutate of [s=>s.sections.theory.answers[0]=2,s=>s.sections.theory.deadlineAt++,s=>s.sections.theory.questionIds.reverse(),s=>s.sections.practical.startedAt=5,s=>s.version=2]){const bad=JSON.parse(JSON.stringify(x));mutate(bad);assert.equal(a.restoreManufacturingMock(JSON.stringify(bad),exam),null);}
 const frozenAnswer=x.sections.theory.answers[0];x=a.answerManufacturingMock(x,exam,'theory',0,0,deadline);assert.equal(x.sections.theory.answers[0],frozenAnswer);assert.equal(x.sections.theory.submission,'expired');assert.equal(x.sections.theory.submittedAt,deadline);assert.equal(a.gradeManufacturingMock(x,exam),null);
 x=a.startManufacturingMockSection(x,exam,'practical',deadline+5000);assert.equal(x.sections.practical.deadlineAt,deadline+5000+2400000);assert.equal(a.mockRemainingMs(x.sections.practical,exam.sections.practical,deadline+5000),2400000);x=a.normalizeManufacturingMock(x,exam,x.sections.practical.deadlineAt+100000);assert(a.manufacturingMockComplete(x));assert(a.restoreManufacturingMock(JSON.stringify(x),exam));
 for(const [theoryCorrect,practicalCorrect,passed]of [[20,6,true],[19,10,false],[30,5,false],[0,0,false],[30,10,true]]){
  let attempt=a.startManufacturingMockSection(a.freshManufacturingMock(exam),exam,'theory',1000);
  for(let i=0;i<theoryCorrect;i++)attempt=a.answerManufacturingMock(attempt,exam,'theory',i,exam.sections.theory.questions[i].correctIndex,1100);
  attempt=a.submitManufacturingMockSection(attempt,exam,'theory',1200);assert.equal(a.gradeManufacturingMock(attempt,exam),null);attempt=a.startManufacturingMockSection(attempt,exam,'practical',1300);
  for(let i=0;i<practicalCorrect;i++)attempt=a.answerManufacturingMock(attempt,exam,'practical',i,exam.sections.practical.questions[i].correctIndex,1400);
  attempt=a.submitManufacturingMockSection(attempt,exam,'practical',1500);const result=a.gradeManufacturingMock(attempt,exam);assert.equal(result.theory.correct,theoryCorrect);assert.equal(result.practical.correct,practicalCorrect);assert.equal(result.passed,passed);assert(a.restoreManufacturingMock(JSON.stringify(attempt),exam));
 }
 assert.notEqual(a.manufacturingMockKey('a:b','mechanical','x'),a.manufacturingMockKey('a%3Ab','mechanical','x'));assert.notEqual(a.manufacturingMockKey('a','mechanical','x'),a.manufacturingMockKey('a','surface','x'));assert.notEqual(a.manufacturingMockKey('a','mechanical','x'),a.manufacturingMockKey('b','mechanical','x'));
 console.log(JSON.stringify({status:'PASS',scope:'independent section clocks; restore/background expiry; two-option bounds; stale revision; independent 20/30 and6/10 thresholds; no grades before both sections; namespaced keys'}));
})().catch(e=>{console.error(e);process.exitCode=1});
