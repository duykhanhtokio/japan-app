const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const worker=require('./metro/runtime-data-transformer.cjs'),decoder=require('../src/services/runtime-json.cjs');
const config=require('expo/metro-config').getDefaultConfig(process.cwd());
function evaluate(output,unwrapped) {
  const module={exports:{}};
  vm.runInNewContext(output,{module,exports:module.exports,require:()=>decoder,__d:factory=>factory(null,()=>decoder,null,null,module,module.exports,[0])});
  return module.exports;
}
(async()=>{
  const value=JSON.parse('{"__proto__":{"safe":true},"text":"日本語・Việt・😀 $& $$ $` \\u2028 \\u2029"}');
  const source=Buffer.from('module.exports=JSON.parse('+JSON.stringify(JSON.stringify(value))+');\n');
  let cases=0;
  for(const platform of ['ios','android','web'])for(const dev of [true,false])for(const unwrapped of [true,false]) {
    const result=await worker.transform({...config.transformer,unstable_disableModuleWrapping:unwrapped},process.cwd(),'.metro-runtime-data/test-generated.cjs',source,{type:'module',dev,minify:!dev,platform,customTransformOptions:{optimize:true},unstable_transformProfile:platform==='web'?'default':'hermes-stable'});
    assert.equal(JSON.stringify(evaluate(result.output[0].data.code,unwrapped)),JSON.stringify(value));
    assert(!result.output[0].data.code.includes('__JAPAN_DATA_'));cases++;
  }
  const filename=fs.readdirSync('.metro-runtime-data/contexts').filter(f=>f.startsWith('chunk-')).map(f=>'.metro-runtime-data/contexts/'+f).sort((a,b)=>fs.statSync(b).size-fs.statSync(a).size)[0];
  const code=fs.readFileSync(filename,'utf8'),payloads=JSON.parse(JSON.parse(/const payloads=JSON\.parse\((.+)\);/.exec(code)[1]));
  const key=Object.keys(payloads)[0],entry=payloads[key],expected=entry[0]?decoder.decodeRuntimeJson(entry[1]):JSON.parse(entry[1]);
  const transformed=await worker.transform(config.transformer,process.cwd(),filename,Buffer.from(code),{type:'module',dev:true,minify:false,platform:'ios',customTransformOptions:{},unstable_transformProfile:'hermes-stable'});
  const exports=evaluate(transformed.output[0].data.code,false);
  assert.equal(JSON.stringify(exports.read(key)),JSON.stringify(expected));
  console.log(JSON.stringify({status:'PASS',platformModeCases:cases,largeInputBytes:Buffer.byteLength(code),unicodeDollarAndPrototypeKeysPreserved:true,largePayloadDecodedExactly:true}));
})().catch(error=>{console.error(error);process.exitCode=1});
