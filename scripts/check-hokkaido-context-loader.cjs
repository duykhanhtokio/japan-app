const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const esbuild=require(require.resolve('esbuild',{paths:[process.env.TOKUTEI_QA_MODULES||root]}));
const result=esbuild.buildSync({entryPoints:[path.join(root,'src/services/dialogue-content-loader.ts')],bundle:true,write:false,format:'cjs',platform:'node',logLevel:'error',alias:{'@':path.join(root,'src')}});
const hostRequire=Object.assign(require,{context(dir,recursive,pattern){
 const full=path.resolve(root,'src/services',dir),files=[];
 function walk(parent,prefix=''){for(const e of fs.readdirSync(parent,{withFileTypes:true})){const k=prefix+e.name;if(e.isDirectory()){if(recursive)walk(path.join(parent,e.name),k+'/');}else if(pattern.test(k))files.push('./'+k);}}
 walk(full);const context=key=>JSON.parse(fs.readFileSync(path.join(full,key),'utf8'));context.keys=()=>files;return context;
}});
const box={exports:{}};new Function('module','exports','require',result.outputFiles[0].text)(box,box.exports,hostRequire);
const base=path.join(root,'docs/localization-workspace/region-review/hokkaido-20261103');
let scenarios=0,fields=0;const idx=JSON.parse(fs.readFileSync(path.join(root,'src/data/dialogue-content/locale-batch-index.json')));
for(let w=1;w<=6;w++){
 const receipt=JSON.parse(fs.readFileSync(path.join(base,`worker-${w}.json`))),cache=new Map();
 for(const review of receipt.reviews){const sid=review.scenarioId;if(!cache.has(sid)){cache.set(sid,box.exports.loadDialogueTurns(sid));scenarios++;}
  const turns=cache.get(sid);assert.equal(turns.length,11);
  const pack=JSON.parse(fs.readFileSync(path.join(root,`src/data/dialogue-content/locale-batches/${review.locale}/${idx[sid]}.json`)));
  for(const field of review.fields){const turn=turns.find(t=>t.id===field.turnId),entry=pack.scenarios[sid].turns[field.turnId];assert(turn);const actual=field.field==='translation'?(turn.npc||turn.player).translations[review.locale]:turn.player.hintTranslations[review.locale];assert.equal(actual,entry[field.field]);fields++;}
 }
}
const report={status:'PASS',scenarios,fields,actualLoaderTested:true,nativeReviewed:false,deviceVerified:false};
fs.writeFileSync(path.join(base,'loader-qa.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
