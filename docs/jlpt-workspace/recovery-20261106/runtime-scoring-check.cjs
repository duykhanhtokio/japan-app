const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.resolve(__dirname,'../../..');
const ts=require(path.join(process.env.JLPT_QA_DEPENDENCY_ROOT||root,'node_modules/typescript'));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('src/components/jlpt/N1OfficialTrial.tsx');
const ast=ts.createSourceFile('runner.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const scoreNode=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='calculateResult');
assert(scoreNode);
const scoreContext={result:null};
vm.runInNewContext(ts.transpileModule(scoreNode.getFullText(ast)+'\nresult=calculateResult;', {compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText,scoreContext);
let scoringChecks=0;
for(const l of ['n5','n4','n3','n2','n1'])for(let n=1;n<=6;n++){
 const m=JSON.parse(read(`src/data/jlpt-original/${l}/${String(n).padStart(2,'0')}/master.ja.json`)),q=m.questions;
 const compare=(answers,expected)=>{assert.deepEqual(JSON.parse(JSON.stringify(scoreContext.result(q,answers))),expected);scoringChecks++;};
 const all=Object.fromEntries(q.map(x=>[x.id,x.correctOptionId]));
 compare(all,{correct:q.length,wrong:0,unanswered:0,total:q.length});
 compare({}, {correct:0,wrong:0,unanswered:q.length,total:q.length});
 const wrong=Object.fromEntries(q.map(x=>[x.id,x.options.find(o=>o.id!==x.correctOptionId).id]));
 compare(wrong,{correct:0,wrong:q.length,unanswered:0,total:q.length});
 compare({[q[0].id]:q[0].correctOptionId,[q[1].id]:wrong[q[1].id]}, {correct:1,wrong:1,unanswered:q.length-2,total:q.length});
}
const memory=new Map(),storage={async getItem(k){return memory.get(k)||null},async setItem(k,v){memory.set(k,v)}};
const js=ts.transpileModule(read('src/services/learning-economy.ts'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
const mod={exports:{}};vm.runInNewContext(js,{module:mod,exports:mod.exports,require:n=>{assert.equal(n,'@react-native-async-storage/async-storage');return storage},console});
const api=mod.exports;
(async()=>{
 let promotionChecks=0;
 const check=(v,e)=>{assert.equal(v,e);promotionChecks++};
 await api.recordQualifiedExam('below','N5',79,100);let s=await api.loadLearningEconomy();check(Object.keys(s.passed.N5).length,0);
 for(let i=1;i<=5;i++)await api.recordQualifiedExam(`n5-${i}`,'N5',80,100);
 s=await api.loadLearningEconomy();check(s.officialRank,null);check(Object.keys(s.passed.N5).length,5);
 await api.recordQualifiedExam('n5-1','N5',100,100);s=await api.loadLearningEconomy();check(s.officialRank,null);check(Object.keys(s.passed.N5).length,5);
 await api.recordQualifiedExam('n5-6','N5',80,100);s=await api.loadLearningEconomy();check(s.officialRank,'N5');check(Object.keys(s.passed.N5).length,6);
 for(let i=1;i<=6;i++)await api.recordQualifiedExam(`n4-${i}`,'N4',80,100);
 s=await api.loadLearningEconomy();check(s.officialRank,'N4');
 await api.recordQualifiedExam('n5-1','N5',0,100);s=await api.loadLearningEconomy();check(s.officialRank,'N4');
 const report={status:'PASS',scope:'Executed production scoring function extracted via TypeScript AST and actual learning-economy exports with in-memory AsyncStorage; not full-router/browser/native QA',forms:30,scoringChecks,promotionChecks,checks:['all correct','all wrong','all unanswered','mixed correct/wrong/unanswered','79% excluded','80% included','five unique exams insufficient','duplicate attempt not a sixth exam','six unique exams promote','higher rank retained']};
 fs.writeFileSync(path.join(__dirname,'runtime-scoring-promotion.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exitCode=1});
