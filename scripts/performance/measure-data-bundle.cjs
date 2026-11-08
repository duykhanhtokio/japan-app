'use strict';
// Builds the isolated offline study-data graph with Metro's real iOS transform.
// This is not the whole Expo Router app, a device test, or Hermes bytecode size.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const Metro=require('metro'),{FileStore}=require('metro-cache');
const root=path.resolve(__dirname,'../..');
const baseline=process.argv[2]||'022966903c5c3d074645cc3523a852f56d64baed';
const output=process.argv[3];
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'yokoso-metro-data-'));
const clock=require('node:perf_hooks').performance;
const snapshots={};
const changed=execFileSync('git',['diff','--name-only',baseline,'--','src'],{cwd:root,encoding:'utf8'}).trim().split('\n');
for(const file of changed.filter(f=>/\.(ts|tsx)$/.test(f))){
    try{snapshots[path.join(root,file)]=execFileSync('git',['show',`${baseline}:${file}`],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe'],maxBuffer:32*1024*1024});}catch{/* New files are not reachable from the baseline entry. */}
}
const snapshotFile=path.join(temp,'snapshots.json');fs.writeFileSync(snapshotFile,JSON.stringify(snapshots));
const transformer=path.join(root,'scripts/tokutei-release/compressed-json-transformer.cjs');
const baselineTransformer=path.join(temp,'baseline-transformer.cjs');
fs.writeFileSync(baselineTransformer,`const upstream=require(${JSON.stringify(transformer)}),snapshots=require(${JSON.stringify(snapshotFile)}),crypto=require('node:crypto'),path=require('node:path');module.exports={transform:(config,root,file,data,options)=>{const key=path.resolve(root,file);return upstream.transform(config,root,file,Object.prototype.hasOwnProperty.call(snapshots,key)?Buffer.from(snapshots[key]):data,options);},getCacheKey:config=>crypto.createHash('sha256').update(upstream.getCacheKey(config)).update(JSON.stringify(snapshots)).digest('hex')};`);
function median(values){return [...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];}
(async()=>{
    const result={baseline,platform:'ios',dev:true,minify:false,entry:'src/data/jlpt-study-data.ts',scope:'isolated study-data graph, not full app',node:process.version,samples:3,before:[],after:[]};
    for(let i=0;i<3;i++)for(const variant of ['before','after']){
        const config={...require(path.join(root,'metro.config.js'))};
        config.resolver={...config.resolver,resolveRequest:(context,name,platform)=>context.resolveRequest(context,name.startsWith('@/')?path.join(root,'src',name.slice(2)):name,platform)};
        if(variant==='before')config.transformerPath=baselineTransformer;
        config.cacheStores=[new FileStore({root:path.join(temp,`${variant}-${i}`)})];
        config.reporter={update:event=>{if(event.type==='bundle_build_failed')console.error('Metro build failed');}};
        const sample={};
        for(const kind of ['cold','warm']){
            const start=clock.now();
            const bundle=await Metro.runBuild(config,{entry:path.join(root,result.entry),platform:'ios',dev:true,minify:false,sourceMap:false});
            sample[`${kind}Ms`]=clock.now()-start;sample.bytes=Buffer.byteLength(bundle.code);
        }
        result[variant].push(sample);
        console.log(`${variant} ${i+1}/3: cold=${sample.coldMs.toFixed(0)}ms warm=${sample.warmMs.toFixed(0)}ms bytes=${sample.bytes}`);
    }
    result.medians=Object.fromEntries(['before','after'].map(v=>[v,{coldMs:median(result[v].map(x=>x.coldMs)),warmMs:median(result[v].map(x=>x.warmMs)),unminifiedJsBytes:median(result[v].map(x=>x.bytes))}]));
    if(output)fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
    console.log(JSON.stringify(result.medians));
})().catch(error=>{console.error(error.message);process.exitCode=1;}).finally(()=>fs.rmSync(temp,{recursive:true,force:true}));
