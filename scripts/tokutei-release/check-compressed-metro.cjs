'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),{transform}=require('./compressed-json-transformer.cjs');
const esbuild=require('esbuild'),config=require('expo/metro-config').getDefaultConfig(root),helper={exports:{}};
new Function('module','exports','require',esbuild.transformSync(fs.readFileSync(path.join(root,'src/services/decode-bundled-json.ts'),'utf8'),{loader:'ts',format:'cjs'}).code)(helper,helper.exports,name=>{assert.equal(name,'fflate/browser');return require(name);});
(async()=>{
 const file='src/data/hospitality/service.json',data=fs.readFileSync(path.join(root,file)),expected=JSON.parse(data),cases=[];
 for(const platform of['web','ios','android']){
  const transformed=await transform(config.transformer,root,file,data,{dev:false,minify:true,platform,type:'module',inlineRequires:true,experimentalImportSupport:false,unstable_transformProfile:'default',customTransformOptions:{}});
  assert.equal(transformed.dependencies.length,1);assert(transformed.dependencies[0].name.endsWith('services/decode-bundled-json'));
  const output=transformed.output.find(o=>o.type==='js/module');assert(output);
  let factory;vm.runInNewContext(output.data.code,{__d:f=>{factory=f;}});assert.equal(typeof factory,'function');
  const module={exports:{}};factory({},()=>helper.exports,undefined,undefined,module,module.exports,[0]);
  assert.deepEqual(module.exports,expected);cases.push({platform,minifiedWorkerOutput:true,decodedValuesUnchanged:true,dependencyResolved:true});
 }
 const report={status:'PASS',scope:'Actual Expo transform worker and emitted module factory execution; no native app launch or full application export inferred.',cases,physicalDeviceTested:false,fullApplicationExport:false};
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
