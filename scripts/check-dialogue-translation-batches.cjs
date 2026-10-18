const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {root,locales,read,validateBatch}=require('./lib/dialogue-translation-validation.cjs');
const args=process.argv.slice(2),integrate=args.includes('--integrate'),at=args.indexOf('--batches');
assert(at>=0&&args[at+1],'Usage: node scripts/check-dialogue-translation-batches.cjs --batches 002,003 [--integrate]');
const batches=[...new Set(args[at+1].split(','))].sort(),results=batches.map(batch=>validateBatch(batch));
const index=read('src/data/dialogue-content/locale-batch-index.json');
if(integrate){for(const result of results)for(const sid of result.scenarioIds){assert(!index[sid]||index[sid]===result.batch,'Scenario owned by another batch: '+sid);index[sid]=result.batch;}
 fs.writeFileSync(path.join(root,'src/data/dialogue-content/locale-batch-index.json'),JSON.stringify(index,null,2)+'\n');
 const all=[...new Set(Object.values(index))].sort().map(batch=>validateBatch(batch));const indexed=new Set(all.flatMap(b=>b.scenarioIds));assert.equal(indexed.size,Object.keys(index).length);
 const progress={status:'IN_PROGRESS',canonicalScenarios:7128,completeSentenceScenarios:indexed.has('SC-LOC-001-01-001')?indexed.size:indexed.size+1,completeSentenceAndTaskScenarios:indexed.size,remainingSentenceAndTaskScenarios:7128-indexed.size,supportingLocales:locales,completedBatches:all.map(b=>({batch:b.batch,scenarios:b.scenarios,turns:b.turns,hints:b.hints,sourceSha256:b.sourceSha256,files:b.files})),nativeReviewed:false,semanticCrossReview:false};
 if(progress.remainingSentenceAndTaskScenarios===0)progress.status='COMPLETE_AI_TRANSLATIONS';
 fs.writeFileSync(path.join(root,'docs/localization-workspace/DIALOGUE_TRANSLATION_PROGRESS.json'),JSON.stringify(progress,null,2)+'\n');
}
const report={status:'PASS_SOURCE_ID_COVERAGE',batches:results.map(r=>({batch:r.batch,scenarios:r.scenarios,turns:r.turns,hints:r.hints,locales:r.locales})),turnTranslationChecks:results.reduce((n,r)=>n+r.turnTranslationChecks,0),hintTranslationChecks:results.reduce((n,r)=>n+r.hintTranslationChecks,0),integrated:integrate,nativeReviewed:false,semanticCrossReview:false};
fs.writeFileSync(path.join(root,'docs/localization-workspace/dialogue-batch-qa.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
