const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const esbuild=require('esbuild'),root=path.resolve(__dirname,'../..'),data=path.join(root,'src/data/restaurant');
(async()=>{
 const compiled=await esbuild.transform(fs.readFileSync(path.join(data,'index.ts'),'utf8'),{loader:'ts',format:'cjs'}),box={exports:{}},loaded=[];
 new Function('module','exports','require',compiled.code)(box,box.exports,p=>{if(p==='./types')return {RESTAURANT_CONTENT_VERSION:'1'};loaded.push(p);return JSON.parse(fs.readFileSync(path.resolve(data,p),'utf8'));});
 const api=box.exports;assert.deepEqual(loaded,['./diagrams.json']);
 const weeks=api.restaurantWeeks('1');assert(weeks.length>0);assert(loaded.includes('./lessons.1.ja.json'));assert(!loaded.includes('./lessons.2.ja.json'));assert(!loaded.some(p=>p.includes('exams')||p.includes('translations')));
 const lesson=weeks[0].lessons[0];const vi=api.restaurantLessonTranslation(lesson,'vi');assert(vi);assert.equal(api.restaurantLessonTranslation({...lesson,sourceHash:'f'.repeat(64)},'vi'),null);assert(!loaded.includes('./translations/en.json'));assert(!loaded.includes('./translations/ja.json'));assert.equal(api.restaurantLessonTranslation(lesson,'unsupported'),null);
 assert.equal(api.restaurantExams('2','practice').length,10);assert(loaded.includes('./exams.2.ja.json'));assert(!loaded.includes('./exams.1.ja.json'));assert(!loaded.includes('./lessons.2.ja.json'));
 const report={status:'PASS',cases:['no eager lesson/exam/translation evaluation','selected level only','selected locale only','stale translation rejected','no unrelated fallback language','exam bank loads only when requested'],timingBenchmarkPerformed:false};
 fs.writeFileSync(path.join(root,'docs/ssw-workspace/restaurant/loading-qa.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exitCode=1});
