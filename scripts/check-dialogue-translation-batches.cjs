const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {root,locales,read,validateBatch}=require('./lib/dialogue-translation-validation.cjs');
const args=process.argv.slice(2),integrate=args.includes('--integrate')||args.includes('--refresh'),at=args.indexOf('--batches');
assert(args.includes('--refresh')||(at>=0&&args[at+1]),'Usage: node scripts/check-dialogue-translation-batches.cjs --batches 002,003 [--integrate]');
const batches=args.includes('--refresh')?[]:[...new Set(args[at+1].split(','))].sort(),results=batches.map(batch=>validateBatch(batch));
const index=read('src/data/dialogue-content/locale-batch-index.json');
const holdPath=path.join(root,'docs/localization-workspace/DIALOGUE_TRANSLATION_AUTHOR_HOLDS.json');
const holds=fs.existsSync(holdPath)?read('docs/localization-workspace/DIALOGUE_TRANSLATION_AUTHOR_HOLDS.json').holds.filter(h=>h.status==='REVISION_REQUIRED'):[];
const heldBatches=new Set(holds.map(h=>h.batch));
if(integrate){for(const result of results)for(const sid of result.scenarioIds){assert(!index[sid]||index[sid]===result.batch,'Scenario owned by another batch: '+sid);index[sid]=result.batch;}
 fs.writeFileSync(path.join(root,'src/data/dialogue-content/locale-batch-index.json'),JSON.stringify(index,null,2)+'\n');
 const all=[...new Set(Object.values(index))].sort().map(batch=>validateBatch(batch));const indexed=new Set(all.flatMap(b=>b.scenarioIds));assert.equal(indexed.size,Object.keys(index).length);
 const heldIndexedScenarios=all.filter(b=>heldBatches.has(b.batch)).reduce((n,b)=>n+b.scenarios,0),readyCount=indexed.size-heldIndexedScenarios;
 const progress={status:'IN_PROGRESS',canonicalScenarios:7128,sourceBoundSentenceScenarios:indexed.has('SC-LOC-001-01-001')?indexed.size:indexed.size+1,sourceBoundSentenceAndTaskScenarios:indexed.size,completeSentenceScenarios:(indexed.has('SC-LOC-001-01-001')?indexed.size:indexed.size+1)-heldIndexedScenarios,completeSentenceAndTaskScenarios:readyCount,remainingSentenceAndTaskScenarios:7128-readyCount,authorHoldFiles:holds.length,authorHoldIndexedScenarios:heldIndexedScenarios,authorHolds:holds.map(h=>({owner:h.owner,language:h.language,batch:h.batch,path:h.path,reason:h.reason})),supportingLocales:locales,completedBatches:all.map(b=>({batch:b.batch,scenarios:b.scenarios,turns:b.turns,hints:b.hints,authorReady:!heldBatches.has(b.batch),sourceSha256:b.sourceSha256,files:b.files})),nativeReviewed:false,semanticCrossReview:false};
 if(progress.remainingSentenceAndTaskScenarios===0&&holds.length===0)progress.status='COMPLETE_AI_TRANSLATIONS';
 fs.writeFileSync(path.join(root,'docs/localization-workspace/DIALOGUE_TRANSLATION_PROGRESS.json'),JSON.stringify(progress,null,2)+'\n');
}
const report={status:'PASS_SOURCE_ID_COVERAGE',batches:results.map(r=>({batch:r.batch,scenarios:r.scenarios,turns:r.turns,hints:r.hints,locales:r.locales})),turnTranslationChecks:results.reduce((n,r)=>n+r.turnTranslationChecks,0),hintTranslationChecks:results.reduce((n,r)=>n+r.hintTranslationChecks,0),integrated:integrate,nativeReviewed:false,semanticCrossReview:false};
fs.writeFileSync(path.join(root,'docs/localization-workspace/dialogue-batch-qa.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
