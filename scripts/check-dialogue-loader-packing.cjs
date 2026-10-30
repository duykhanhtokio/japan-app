const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),service=path.join(root,'src/services');
const {projectContextImports}=require('./metro/runtime-data-transformer.cjs');
function context(directory,recursive,pattern) {
  const base=path.resolve(service,directory);
  function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?recursive?walk(path.join(dir,e.name)):[]:[path.join(dir,e.name)]);}
  const files=walk(base).map(file=>'./'+path.relative(base,file).replaceAll('\\','/')).filter(file=>pattern.test(file));
  const load=key=>JSON.parse(fs.readFileSync(path.join(base,key),'utf8'));load.keys=()=>files;return load;
}
async function loader(packed) {
  const filename=path.join(service,'dialogue-content-loader.ts');
  let contents=fs.readFileSync(filename,'utf8');if(packed)contents=projectContextImports(filename,contents);
  const result=await require('esbuild').build({stdin:{contents,loader:'ts',resolveDir:service,sourcefile:filename},bundle:true,write:false,platform:'node',format:'cjs',external:['@runtime-data/*'],alias:{'@':path.join(root,'src')},logLevel:'error'});
  const host=Object.assign(name=>name.startsWith('@runtime-data/')?require(path.join(root,'.metro-runtime-data/contexts',name.slice('@runtime-data/'.length)+'.cjs')):require(name),{context});
  const module={exports:{}};new Function('module','exports','require',result.outputFiles[0].text)(module,module.exports,host);
  return module.exports.loadDialogueTurns;
}
(async()=>{
  require('../metro.config');
  const before=await loader(false),after=await loader(true);
  const names=fs.readdirSync(path.join(root,'src/data/generated/dialogues')).filter(f=>f.endsWith('.json')).sort();
  const ids=new Set([0,1,31,63,64,65,127,128,255,256,1023,1024,names.length-1].map(i=>names[i]?.slice(0,-5)).filter(Boolean));
  for(const file of fs.readdirSync(path.join(root,'src/data/dialogue-content/translations')).filter(f=>f.endsWith('.json')))ids.add(file.slice(0,-5));
  ids.add('SC-LOC-JP-99999-01-001');ids.add('UNKNOWN-SCENARIO');
  let turns=0;
  for(const id of ids){const expected=before(id),actual=after(id);assert.deepEqual(actual,expected,id);turns+=actual.length;}
  console.log(JSON.stringify({status:'PASS',scenarioCases:ids.size,turnsCompared:turns,genericAndMissingFallback:true,translationsHintsRubyIdsAndLinksPreserved:true}));
})().catch(error=>{console.error(error);process.exitCode=1});
