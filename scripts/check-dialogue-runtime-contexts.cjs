const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const {prepareRuntimeData}=require('./metro/prepare-runtime-data.cjs');
const {prepareDialogueContexts}=require('./metro/prepare-dialogue-contexts.cjs');
const worker=require('./metro/runtime-data-transformer.cjs');
const decoder=require('../src/services/runtime-json.cjs');
function readModule(filename,requireModule) {
  const module={exports:{}};
  vm.runInNewContext(fs.readFileSync(filename,'utf8'),{module,exports:module.exports,require:requireModule},{filename});
  return module.exports;
}
(async()=>{
  const contexts=prepareDialogueContexts(root,prepareRuntimeData(root));
  let files=0,chunks=0;const groupCounts={};
  for(const [name,group]of contexts) {
    for(const chunk of group.chunks) {
      const loaded=readModule(chunk.filename,()=>decoder);
      for(const entry of chunk.entries) {
        const expected=worker.projectRuntimeData(entry.source,JSON.parse(fs.readFileSync(entry.source,'utf8')));
        const value=loaded.read(entry.key);
        assert.equal(JSON.stringify(value),JSON.stringify(expected),entry.source);
        assert.strictEqual(loaded.read(entry.key),value,'Module identity must remain stable');files++;
      }
      assert.throws(()=>loaded.read('./missing.json'));chunks++;
    }
    const cache=new Map();
    const context=readModule(group.filePath,relative=>{
      const target=path.resolve(path.dirname(group.filePath),relative);
      if(!cache.has(target))cache.set(target,readModule(target,()=>decoder));
      return cache.get(target);
    });
    assert.equal(JSON.stringify(context.keys()),JSON.stringify(group.entries.map(e=>e.key)));
    assert.throws(()=>context('./missing.json'),{code:'MODULE_NOT_FOUND'});
    assert.throws(()=>context('__proto__'),{code:'MODULE_NOT_FOUND'});
    if(group.entries.length)assert.strictEqual(context(group.entries[0].key),context(group.entries[0].key));
    groupCounts[name]=group.entries.length;
  }
  const config=require('expo/metro-config').getDefaultConfig(root);
  let projectedDependencies=0;
  for(const filename of ['src/services/dialogue-content-loader.ts','src/services/dialogue-audio-packs.ts']) {
    const result=await worker.transform(config.transformer,root,filename,fs.readFileSync(path.join(root,filename)),{type:'module',dev:true,minify:false,platform:'ios',customTransformOptions:{}});
    assert(!result.dependencies.some(d=>d.data.contextParams));
    projectedDependencies+=result.dependencies.filter(d=>d.name.startsWith('@runtime-data/')).length;
  }
  assert.equal(projectedDependencies,6);
  console.log(JSON.stringify({status:'PASS',sourceFiles:files,chunks,contextModules:contexts.size,groupCounts,projectedDependencies,allProjectedRuntimeValuesPreserved:true,stableModuleIdentity:true,iosBundleTested:false},null,2));
})().catch(error=>{console.error(error);process.exitCode=1});
