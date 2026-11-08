'use strict';
// Static app-source graph including deferred imports. Source bytes are NOT a
// serialized bundle size or proof that these modules evaluate during startup.
const fs=require('node:fs'),path=require('node:path'),esbuild=require('esbuild');
const root=path.resolve(__dirname,'../..');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const routes=walk(path.join(root,'src/app')).filter(f=>/\.(tsx?|jsx?)$/.test(f)&&!/(?:\.web\.[^.]+|\+api\.[^.]+)$/.test(f));
const seen=new Set(),missing=new Set(),json=[],assets=new Set(),external=new Set(),parents=new Map();
const queue=routes.slice();for(const f of routes)parents.set(f,null);
function resolve(base){return [base+'.ios.tsx',base+'.native.tsx',base+'.tsx',base+'.ios.ts',base+'.native.ts',base+'.ts',base,base+'.json',path.join(base,'index.ts'),path.join(base,'index.tsx')].find(f=>fs.existsSync(f)&&fs.statSync(f).isFile());}
for(let i=0;i<queue.length;i++){
 const file=queue[i];if(seen.has(file))continue;seen.add(file);
 if(file.endsWith('.json')){json.push({path:path.relative(root,file),rawBytes:fs.statSync(file).size});continue;}
 if(!/\.(tsx?|jsx?)$/.test(file))continue;
 const source=esbuild.transformSync(fs.readFileSync(file,'utf8'),{loader:file.endsWith('x')?'tsx':'ts',format:'cjs'}).code;
 for(const match of source.matchAll(/(?:require|import)\(\s*["']([^"']+)["']\s*\)/g)){
  const id=match[1];if(!id.startsWith('.')&&!id.startsWith('@/')){external.add(id);continue;}
  const base=id.startsWith('@/')?path.join(root,'src',id.slice(2)):path.resolve(path.dirname(file),id);
  if(/\.(?:png|jpe?g|webp|svg|gif|mp3|m4a|wav|ttf|wasm|mp4)$/.test(base)){assets.add(path.relative(root,base));continue;}
  const next=resolve(base);if(!next){missing.add(path.relative(root,base));continue;}
  if(!parents.has(next))parents.set(next,file);queue.push(next);
 }
}
function chain(file){const result=[];let f=path.join(root,file);while(f){result.unshift(path.relative(root,f));f=parents.get(f);}return result;}
json.sort((a,b)=>b.rawBytes-a.rawBytes);
const report={scope:'static app-source graph; dynamic imports included; npm internals excluded',routeFiles:routes.length,sourceAndJsonModules:seen.size,jsonFiles:json.length,rawJsonBytes:json.reduce((n,x)=>n+x.rawBytes,0),assetReferences:assets.size,assetBytesInspected:false,externalPackages:external.size,missing: [...missing],largestJson:json.slice(0,12).map(row=>({...row,importPath:chain(row.path)})),actualMetroBundleSize:false,startupEvaluationProven:false};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({routes:report.routeFiles,modules:report.sourceAndJsonModules,jsonFiles:report.jsonFiles,rawJsonBytes:report.rawJsonBytes,assets:report.assetReferences,missing:report.missing.length}));
