'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{deflateSync}=require('node:zlib'),vm=require('node:vm');
const esbuild=require('esbuild'),{packedSource}=require('./compressed-json-transformer.cjs');
const root=path.resolve(__dirname,'../..'),helperFile=path.join(root,'src/services/decode-bundled-json.ts');
const js=esbuild.transformSync(fs.readFileSync(helperFile,'utf8'),{loader:'ts',format:'cjs',target:'es2020'}).code;
const moduleBox={exports:{}};
const isolated=vm.createContext({module:moduleBox,exports:moduleBox.exports,require:name=>{assert.equal(name,'fflate/browser');return require(name);},Uint8Array,JSON,Number,Error,Object,String,Buffer:undefined,atob:undefined,fetch:undefined});
vm.runInContext(js,isolated);const decode=moduleBox.exports.decodeBundledJson;
const specimen={ja:'読み方・細い実線',vi:'Điều kiện áp dụng',km:'ភាសាខ្មែរ',my:'မြန်မာဘာသာ',math:'SO₄²⁻・Ba²⁺',emoji:'🌱',nested:[false,null,0,-1,1.25],['__proto__']:{kept:true}};
const data=Buffer.from(JSON.stringify(specimen)),payload=deflateSync(data).toString('base64');assert.equal(JSON.stringify(decode(payload,data.length)),JSON.stringify(specimen));
assert.throws(()=>decode(payload,data.length+1),/size/);assert.throws(()=>decode('!bad',1),/encoding/);assert.throws(()=>decode(payload,-1),/size/);assert.throws(()=>decode(deflateSync(Buffer.from('not JSON')).toString('base64'),8));
const large=Buffer.from(JSON.stringify({body:'日本語と翻訳'.repeat(10000)}));
assert(packedSource(root,'src/data/hospitality/test.json',large));
assert.equal(packedSource(root,'src/data/jlpt-official/test.json',large),null);
assert.equal(packedSource(root,'src/components/jlpt/Test.tsx',large),null);
assert.equal(packedSource(root,'node_modules/package.json',large),null);
assert.equal(packedSource(root,'src/data/hospitality/tiny.json',Buffer.from('{}')),null);
function walk(folder){return fs.readdirSync(folder,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(folder,e.name)):e.name.endsWith('.json')?[path.join(folder,e.name)]:[]);}
let modules=0,inputBytes=0,packedCodeBytes=0;
for(const sector of['agriculture','manufacturing','food-manufacturing','restaurant','hospitality','kaigo','kensetsu','dialogue-content','generated']){
 for(const file of walk(path.join(root,'src/data',sector))){
  const bytes=fs.readFileSync(file),packed=packedSource(root,path.relative(root,file),bytes);if(!packed)continue;
  const decoded=decode(packed.payload,packed.expectedBytes),normalized=bytes.toString('utf8').replace(/^\uFEFF/,'');
  assert.equal(JSON.stringify(decoded),JSON.stringify(JSON.parse(normalized)),path.relative(root,file));
  const box={exports:{}};new Function('require','module',packed.code)(name=>{assert(name.endsWith('services/decode-bundled-json'));return{decodeBundledJson:decode};},box);
  assert.equal(JSON.stringify(box.exports),JSON.stringify(decoded));modules++;inputBytes+=bytes.length;packedCodeBytes+=Buffer.byteLength(packed.code);
 }
}
const report={status:'PASS',testedModules:modules,inputBytes,packedCodeBytes,ratio:packedCodeBytes/inputBytes,allValuesUnchanged:true,unicodeAndNumbersPreserved:true,sourceFilesNotRewritten:true,noBufferAtobOrNetworkNeeded:true,usesBrowserOnlyInflater:true,corruptEncodingAndSizeRejected:true,jlptModulesDelegatedUnchanged:true,wholeAppExportPassed:false,physicalDeviceTested:false};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
