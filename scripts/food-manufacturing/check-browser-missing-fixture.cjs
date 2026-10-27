// Regression for fixture selection/reporting only. This does not launch a browser.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'check-browser.cjs'),'utf8');
const start=source.indexOf(" const missingPack=frozenData('test-translations/vi.json')");
const end=source.indexOf('\n }\n if(deltaBase)',start);
assert(start>=0&&end>start,'Missing-translation regression block not found');
const block=source.slice(start,end);
async function run(translated,body){
 const report={},calls=[];
 const button={click:async()=>calls.push('click'),nth:()=>button};
 const context={frozenData:()=>({questions:translated}),exams:[{id:'mock',level:'1',questions:[{id:'q1'}]}],report,start:async()=>calls.push('start'),page:{getByRole:()=>button,locator:()=>({innerText:async()=>body})},assert};
 await vm.runInNewContext('(async()=>{'+block+'})()',context);
 return {report,calls};
}
(async()=>{
 const complete=await run({q1:{}},'');
 assert.equal(complete.report.missingQuestionTranslationHandled,false);
 assert.equal(complete.report.missingQuestionTranslationFixture,null);
 assert.equal(complete.report.missingQuestionTranslationCheck,'not_exercised_no_natural_fixture');
 assert.equal(complete.calls.length,0);
 const missing=await run({},'この言語の問題訳は準備中です。');
 assert.equal(missing.report.missingQuestionTranslationHandled,true);
 assert.equal(missing.report.missingQuestionTranslationFixture,'mock');
 assert.equal(missing.report.missingQuestionTranslationCheck,'exercised');
 assert.equal(missing.calls.length,4);
 await assert.rejects(()=>run({},'missing notice absent'));
 console.log(JSON.stringify({status:'PASS',testType:'vm_mock_regression',cases:3,browserLaunched:false,nativeDeviceTested:false,productionExpoTested:false,meaning:'Actual fixture-selection block exercised with mocked page; missing notice still fails, complete translations are explicitly not exercised.'}));
})().catch(error=>{console.error(error);process.exitCode=1});
