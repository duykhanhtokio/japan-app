const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../../../..');
(async()=>{
 const output=await require('esbuild').build({entryPoints:[path.join(root,'src/data/manufacturing/recognition38/index.ts')],bundle:true,platform:'node',format:'cjs',write:false,logLevel:'silent'});const m={exports:{}};new Function('module','exports','require',output.outputFiles[0].text)(m,m.exports,require);const api=m.exports;let passed=0,questions=0;
 for(const p of api.manufacturingRecognitionPacks())for(const q of p.questions){questions++;if(!api.manufacturingRecognitionQuestionAssets(q))throw Error('missing image binding');passed++;
 for(const change of [{...q,sourceHash:'stale'},{...q,imageAssetIds:[]},{...q,imageAssetHashes:{}},{...q,correctIndex:(q.correctIndex+1)%4},{...q,stemJa:q.stemJa+'x'},{...q,optionReasonsJa:[]},{...q,optionsJa:q.optionsJa.slice().reverse()}]){if(api.manufacturingRecognitionQuestionAssets(change)!==null)throw Error('guard bypass');passed++;}}
 const result={status:'PASS',packs:api.manufacturingRecognitionPacks().length,questions,currentImageBindingAndStaleTamperCases:passed,actualPngBytesValidatedByThisCheck:false};fs.writeFileSync(path.join(__dirname,'api-image-guards.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exitCode=1});
