const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {deflateSync}=require('node:zlib');
const decoder=require('../src/services/runtime-json.cjs');
const root = path.resolve(__dirname, '..');
const config = require('../metro.config');
const worker = require('./metro/runtime-data-transformer.cjs');
function files(dir) {
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory()
    ? files(path.join(dir,e.name)) : e.name.endsWith('.json') ? [path.join(dir,e.name)] : []);
}
(async () => {
  let originalBytes=0, compactBytes=0, encodedPayloadBytes=0, removedUnusedDialogueBytes=0, scenarios=0;
  const all=files(path.join(root,'src/data'));
  const sample=new Set();
  let largest={file:null,size:0};
  for(const file of all) {
    const raw=fs.readFileSync(file),value=JSON.parse(raw);
    const projected=worker.projectRuntimeData(file,value);
    const compact=JSON.stringify(projected);
    assert.deepEqual(JSON.parse(compact),projected,file+': JSON round-trip changed a value');
    originalBytes+=raw.length;compactBytes+=Buffer.byteLength(compact);
    encodedPayloadBytes+=Buffer.byteLength(compact)>=4096
      ? Buffer.byteLength(deflateSync(Buffer.from(compact),{level:9}).toString('base64'))
      : Buffer.byteLength(JSON.stringify(compact));
    if(file.includes('/generated/dialogues/')) {
      const before=Array.isArray(value)?value:value.shared??value.N5;
      const after=Array.isArray(projected)?projected:projected.shared;
      assert.deepEqual(after,before, file+': selected dialogue changed');
      removedUnusedDialogueBytes+=Buffer.byteLength(JSON.stringify(value))-Buffer.byteLength(compact);
      scenarios++;
    } else assert.strictEqual(projected,value);
    if(raw.length>largest.size)largest={file,size:raw.length};
    if(file.includes('/locale-batches/')) {
      const locale=path.basename(path.dirname(file));
      if(![...sample].some(p=>p.includes('/locale-batches/'+locale+'/')))sample.add(file);
    }
  }
  sample.add(largest.file);
  for(const suffix of ['generated/dialogues','food-manufacturing/authoring-20261029'])sample.add(all.find(p=>p.includes('/'+suffix+'/')));
  let wrappedCases=0;
  for(const file of sample) {
    const raw=fs.readFileSync(file);
    for(const dev of [true,false])for(const disableWrapping of [true,false]) {
      const c={...config.transformer,unstable_disableModuleWrapping:disableWrapping};
      const result=await worker.transform(c,root,path.relative(root,file),raw,
        {type:'module',dev,minify:!dev,platform:'web',customTransformOptions:{}});
      const code=result.output[0].data.code;
      assert(code.includes('JSON.parse(')||code.includes('decodeRuntimeJson('));
      assert.equal(result.dependencies.length,Buffer.byteLength(JSON.stringify(worker.projectRuntimeData(file,JSON.parse(raw))))>=4096?1:0);
      const mod={exports:{}};
      const load=()=>decoder;
      vm.runInNewContext(code,{module:mod,require:load,__d:factory=>factory(null,load,null,null,mod,mod.exports,[0])});
      // Cross-realm prototypes are deliberately ignored; values must round-trip.
      assert.equal(JSON.stringify(mod.exports),JSON.stringify(worker.projectRuntimeData(file,JSON.parse(raw))));
      wrappedCases++;
    }
  }
  await assert.rejects(worker.transform(config.transformer,root,'src/data/bad.json',Buffer.from('{broken'),{type:'module'}));
  for(const value of ['日本語・Tiếng Việt・မြန်မာ・😀',{'__proto__':null,quote:'"\\\n\u2028\u2029'},[null,false,0]]) {
    const encoded=deflateSync(Buffer.from(JSON.stringify(value))).toString('base64');
    assert.deepEqual(decoder.decodeRuntimeJson(encoded),JSON.parse(JSON.stringify(value)));
  }
  assert.throws(()=>decoder.decodeRuntimeJson('!!!!'));
  assert(worker.getCacheKey(config.transformer));
  console.log(JSON.stringify({status:'PASS',jsonFiles:all.length,dialogueScenarios:scenarios,
    originalBytes,compactBytes,encodedPayloadBytes,removedUnusedDialogueBytes,wrappedCases,
    sourceFilesDeleted:0,allSelectedDialogueDataPreserved:true,fullExpoVerified:false},null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
