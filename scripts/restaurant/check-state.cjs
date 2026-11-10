const path=require('node:path'),assert=require('node:assert/strict'),fs=require('node:fs');
const root=path.resolve(__dirname,'../..');
(async()=>{
 const esbuild=require('esbuild');const result=await esbuild.build({entryPoints:[path.join(root,'src/services/restaurant-study-state.ts')],bundle:true,write:false,platform:'node',format:'cjs',logLevel:'error',alias:{'@':path.join(root,'src')}});const box={exports:{}};new Function('module','exports','require',result.outputFiles[0].text)(box,box.exports,require);const api=box.exports;
 const hash='a'.repeat(64),newHash='b'.repeat(64),lesson={id:'rst-1-hyg-01',sourceHash:hash},exam={id:'rst-1-practice-01',sourceHash:hash,questions:[{id:'rst-1-q001',correctIndex:2},{id:'rst-1-q002',correctIndex:0}]};
 assert.notEqual(api.restaurantProgressKey('alice','1'),api.restaurantProgressKey('alice','2'));
 assert.notEqual(api.restaurantProgressKey('alice','1'),api.restaurantProgressKey('bob','1'));
 assert.notEqual(api.restaurantExamKey('alice','1',exam),api.restaurantExamKey('alice','1',{...exam,sourceHash:newHash}));
 const fresh=api.restoreRestaurantProgress(null);assert.deepEqual(fresh.entries,{});assert.equal(api.restoreRestaurantProgress('invalid'),null);assert.equal(api.restoreRestaurantProgress('{"version":1,"entries":[],"position":{}}'),null);
 const saved={...fresh,entries:{[lesson.id]:hash},position:{week:2,lessonId:lesson.id,sourceHash:hash,scrollY:234}};assert.deepEqual(api.restoreRestaurantProgress(JSON.stringify(saved)),saved);assert(api.restaurantLessonDone(saved,lesson));assert(!api.restaurantLessonDone(saved,{...lesson,sourceHash:newHash}));
 for(const change of [{scrollY:-1},{week:0},{lessonId:null},{sourceHash:'bad'}])assert.equal(api.restoreRestaurantProgress(JSON.stringify({...saved,position:{...saved.position,...change}})),null);
 const attempt=api.freshRestaurantAttempt(exam);attempt.answers=[2,null];attempt.currentQuestion=1;assert.deepEqual(api.restoreRestaurantAttempt(JSON.stringify(attempt),exam),attempt);assert.equal(api.restoreRestaurantAttempt(JSON.stringify(attempt),{...exam,sourceHash:newHash}),null);assert.equal(api.restoreRestaurantAttempt(JSON.stringify({...attempt,answers:[4,null]}),exam),null);assert.deepEqual(api.gradeTest(exam,attempt.answers),{correct:1,wrong:0,unanswered:1,total:2});
 const report={status:'PASS',cases:['learner and level key isolation','content revision exam isolation','strict corrupt progress handling','resume reader scroll position','completion source revision invalidation','invalid position rejection','exam answer and position resume','exam revision invalidation','out-of-range answer rejection','grading unanswered'],nativeDeviceTested:false};console.log(JSON.stringify(report));
 if(process.env.RESTAURANT_QA_WRITE_REPORT==='1')fs.writeFileSync(path.join(root,'docs/ssw-workspace/restaurant/state-qa.json'),JSON.stringify(report,null,2)+'\n');
})().catch(e=>{console.error(e);process.exitCode=1});
