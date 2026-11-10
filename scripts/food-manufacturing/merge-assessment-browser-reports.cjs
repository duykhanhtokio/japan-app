// Combine disjoint locale runs only when all use the same frozen data and baseline.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),directory=path.join(root,'docs/ssw-workspace/food-manufacturing');
const [output,...names]=process.argv.slice(2);
if(!output||names.length<2||[output,...names].some(n=>!/^[a-z0-9-]+\.json$/.test(n)))throw Error('Usage: node merge-assessment-browser-reports.cjs output.json group-a.json group-b.json [...]');
const reports=names.map(name=>JSON.parse(fs.readFileSync(path.join(directory,name),'utf8'))),first=reports[0],locales=new Set();
let pairs=0,leaks=0,responsive=0;
for(const report of reports){
 assert.equal(report.status,'PASS');assert.equal(report.inheritedRuntimeUnchanged,true);
 assert.equal(report.deltaBaselineCommit,first.deltaBaselineCommit);assert.equal(report.deltaBaselineReport,first.deltaBaselineReport);assert.equal(report.inheritedQuestionPairs,first.inheritedQuestionPairs);
 assert.deepEqual(report.sourceHashes,first.sourceHashes);assert.deepEqual(report.viewports,first.viewports);
 assert.equal(report.missingQuestionTranslationHandled,true);assert.equal(report.nativeDeviceTested,false);assert.equal(report.productionExpoTested,false);
 assert.equal(report.testTranslationLeakChecks,report.translatedQuestionPairs);assert.equal(report.testTranslationResponsiveCases,report.translatedQuestionPairs*report.viewports.length);
 for(const locale of report.testedQuestionLocales){assert(!locales.has(locale),'Overlapping locale: '+locale);locales.add(locale);}
 pairs+=report.translatedQuestionPairs;leaks+=report.testTranslationLeakChecks;responsive+=report.testTranslationResponsiveCases;
}
const allLocales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];assert.deepEqual([...locales].sort(),allLocales.sort());
for(const [file,hash]of Object.entries(first.sourceHashes))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'src/data/food-manufacturing',file))).digest('hex'),hash,'Data changed after QA: '+file);
const counts=Object.fromEntries(allLocales.map(locale=>[locale,Object.keys(JSON.parse(fs.readFileSync(path.join(root,'src/data/food-manufacturing/test-translations',locale+'.json'),'utf8')).questions).length]));
const total=Object.values(counts).reduce((a,b)=>a+b,0);assert.equal(first.inheritedQuestionPairs+pairs,total,'New pair coverage incomplete');
const merged={status:'PASS',mode:'merged_assessment_translation_delta',deltaBaselineCommit:first.deltaBaselineCommit,deltaBaselineReport:first.deltaBaselineReport,sourceHashes:first.sourceHashes,groupReports:names,testedQuestionLocales:[...locales],translatedQuestionCounts:counts,inheritedQuestionPairs:first.inheritedQuestionPairs,newTranslatedQuestionPairs:pairs,combinedVerifiedQuestionPairs:total,testTranslationLeakChecks:leaks,testTranslationResponsiveCases:responsive,viewports:first.viewports,missingQuestionTranslationHandled:true,inheritedRuntimeUnchanged:true,screenshots:reports.flatMap(r=>r.screenshots),adapters:first.adapters,nativeDeviceTested:false,productionExpoTested:false,meaning:'Disjoint new locale pairs tested in browser; old pairs inherited only after exact data and runtime preservation checks. Not native/domain/Expo certification.'};
fs.writeFileSync(path.join(directory,output),JSON.stringify(merged,null,2)+'\n');console.log(JSON.stringify({status:merged.status,newPairs:pairs,inheritedPairs:first.inheritedQuestionPairs,combinedPairs:total,responsiveCases:responsive}));
