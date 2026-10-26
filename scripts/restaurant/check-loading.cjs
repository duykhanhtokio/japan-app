const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const esbuild=require('esbuild'),root=path.resolve(__dirname,'../..'),data=path.join(root,'src/data/restaurant');
(async()=>{
 const compiled=await esbuild.transform(fs.readFileSync(path.join(data,'index.ts'),'utf8'),{loader:'ts',format:'cjs'}),box={exports:{}},loaded=[];
 new Function('module','exports','require',compiled.code)(box,box.exports,p=>{if(p==='./types')return {RESTAURANT_CONTENT_VERSION:'1'};loaded.push(p);const value=JSON.parse(fs.readFileSync(path.resolve(data,p),'utf8'));if(p==='./translations/vi.json')value.glossary={...value.glossary,'qa-entry':{sourceHash:'a'.repeat(64),term:'Thuật ngữ kiểm tra',explanation:'Giải nghĩa kiểm tra.'}};return value;});
 const api=box.exports;assert.deepEqual(loaded,['./diagrams.json']);
 const weeks=api.restaurantWeeks('1');assert(weeks.length>0);assert(loaded.includes('./lessons.1.ja.json'));assert(!loaded.includes('./lessons.2.ja.json'));assert(!loaded.some(p=>p.includes('exams')||p.includes('translations')));
 const lesson=weeks[0].lessons[0];const vi=api.restaurantLessonTranslation(lesson,'vi');assert(vi);assert.equal(api.restaurantLessonTranslation({...lesson,sourceHash:'f'.repeat(64)},'vi'),null);assert(!loaded.includes('./translations/en.json'));assert(!loaded.includes('./translations/ja.json'));assert.equal(api.restaurantLessonTranslation(lesson,'unsupported'),null);
 assert.equal(api.restaurantExams('2','practice').length,10);assert(loaded.includes('./exams.2.ja.json'));assert(!loaded.includes('./exams.1.ja.json'));assert(!loaded.includes('./lessons.2.ja.json'));
 const weekly=api.restaurantExams('2','weekly')[0].questions[0];
 assert(api.restaurantQuestionTranslation(weekly,'vi'));
 assert.equal(api.restaurantQuestionTranslation({...weekly,sourceHash:'f'.repeat(64)},'vi'),null);
 assert.equal(api.restaurantQuestionTranslation(weekly,'unsupported'),null);
 const entry={id:'qa-entry',sourceHash:'a'.repeat(64)};assert.equal(api.restaurantGlossaryTranslation(entry,'vi').term,'Thuật ngữ kiểm tra');assert.equal(api.restaurantGlossaryTranslation({...entry,sourceHash:'b'.repeat(64)},'vi'),null);assert.equal(api.restaurantGlossaryTranslation({...entry,id:'missing'},'vi'),null);assert.equal(api.restaurantGlossaryTranslation(entry,'unsupported'),null);
 // Templates must preserve counts and must never interpolate undeclared tokens.
 assert.equal(api.restaurantUi('第{week}週','ja',{week:12}),'第12週');
 assert.equal(api.restaurantUi('完了 {done}/{total}','ja',{done:2,total:5}),'完了 2/5');
 assert.equal(api.restaurantUi('第{week}週','unsupported'), '第{week}週');
 const translatedCount=api.restaurantUi('完了 {done}/{total}','vi',{done:2,total:5});
 assert(translatedCount.includes('2')&&translatedCount.includes('5')&&!translatedCount.includes('{'));
 const report={status:'PASS',cases:['current question translation accepted and stale revision rejected','unsupported question language has no unrelated fallback','localized counts with named placeholders','missing interpolation values remain explicit','no eager lesson/exam/translation evaluation','selected level only','selected locale only','stale translation rejected','no unrelated fallback language','exam bank loads only when requested','current glossary translation accepted','stale glossary definition rejected','missing glossary translation explicit'],timingBenchmarkPerformed:false};
 fs.writeFileSync(path.join(root,'docs/ssw-workspace/restaurant/loading-qa.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exitCode=1});
