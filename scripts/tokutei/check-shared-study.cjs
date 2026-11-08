const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const root=path.resolve(__dirname,'../..');
function load(relative){const module={exports:{}};const code=ts.transpileModule(fs.readFileSync(path.join(root,relative),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInNewContext(code,{module,exports:module.exports,require});return module.exports;}
const {fitFigure}=load('src/components/tokutei/figure-layout.ts');
const {buildStudyWeeks,questionsForStudyWeek}=load('src/components/tokutei/study-calendar.ts');
// Portrait phones, landscape phones, tablets and desktop, including extreme diagrams.
let geometryCases=0;
for(const [w,h] of [[320,568],[390,844],[430,932],[844,390],[768,1024],[1024,768],[1440,900]]){
 for(const [sw,sh]of [[1536,1024],[1024,1536],[2400,300],[300,2400],[1,1]]){
  const a=fitFigure(sw,sh,w-32,h-180);assert.ok(a.width<=w-32+.001);assert.ok(a.height<=h-180+.001);assert.ok(Math.abs(a.width/a.height-sw/sh)<1e-8);geometryCases++;
 }
}
for(const n of [0,1,3,6,7,8,14,17,176]){
 const lessons=Array.from({length:n},(_,i)=>({id:`l-${i}`,title:`Lesson ${i}`,revision:'v1'})),weeks=buildStudyWeeks(lessons);
 assert.equal(weeks.length,Math.ceil(n/7));assert.deepEqual(Array.from(weeks.flatMap(w=>w.lessons.map(l=>l.id))),lessons.map(l=>l.id));
 for(const week of weeks){assert.equal(week.days.length,7);assert.deepEqual(Array.from(week.days.map(d=>d.day)),[1,2,3,4,5,6,7]);for(const d of week.days)assert.ok(d.lessons.length>0);}
}
const sample=buildStudyWeeks(Array.from({length:10},(_,i)=>({id:`l${i}`,title:`Lesson ${i}`})));
const q=(id,lessonIds)=>({id,lessonIds,prompt:'Question',options:['a','b'],correctIndex:0,explanation:'a'});
assert.deepEqual(Array.from(questionsForStudyWeek(sample[0],[q('in',['l1']),q('future',['l1','l8']),q('unbound',[])]).map(q=>q.id)),['in']);
// Real catalog lesson order/count is unchanged by the new calendar.
const manifest=JSON.parse(fs.readFileSync(path.join(root,'src/data/agriculture/course-manifest.json'),'utf8'));
for(const level of ['1','2']){const ids=manifest.levels[level].weeks.flatMap(w=>w.lessonIds);const weeks=buildStudyWeeks(ids.map(id=>({id,title:id})));assert.deepEqual(Array.from(weeks.flatMap(w=>w.lessons.map(l=>l.id))),[...new Set(ids)]);}
const hotels=JSON.parse(fs.readFileSync(path.join(root,'src/data/hospitality/catalog.json'),'utf8'));
for(const level of [1,2]){const entries=hotels.filter(l=>l.level===1||level===2);assert.equal(buildStudyWeeks(entries.map(l=>({id:l.id,title:l.title}))).flatMap(w=>w.lessons).length,entries.length);}
// Syntax and native dependencies are checked for every sector, not just the selected reader.
let sourceFiles=0;
for(const sector of ['agriculture','manufacturing','food-manufacturing','restaurant','hospitality','kaigo','kensetsu','tokutei']){
 for(const name of fs.readdirSync(path.join(root,'src/components',sector))){if(!/\.tsx?$/.test(name))continue;const file=path.join(root,'src/components',sector,name),s=fs.readFileSync(file,'utf8'),parsed=ts.createSourceFile(file,s,ts.ScriptTarget.Latest,true,name.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);assert.equal(parsed.parseDiagnostics.length,0,`${sector}/${name}: syntax`);sourceFiles++;}
}
const pkg=require(path.join(root,'package.json')),native=require(path.join(root,'node_modules/expo/bundledNativeModules.json'));
assert.equal(pkg.dependencies['react-native-svg'],native['react-native-svg']);
assert.ok(pkg.dependencies['expo-dev-client']);assert.ok(pkg.devDependencies.sharp);
for(const dependency of ['react-native-svg','expo-dev-client','sharp'])assert.doesNotThrow(()=>require.resolve(dependency,{paths:[root]}));
console.log('PASS shared Tokutei study:',JSON.stringify({geometryCases,sourceFiles,sevenDayCalendars:true,sourceLessonIdsPreserved:true,questionsExcludeFutureLessons:true,nativeDependencies:true}));
