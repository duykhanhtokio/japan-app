#!/usr/bin/env node
'use strict';
// Data-module CPU/IO diagnostics, explicitly not phone startup or navigation timing.
const fs=require('node:fs'),path=require('node:path'),{performance}=require('node:perf_hooks');
const esbuild=require('esbuild');
const ROOT=path.resolve(__dirname,'../..'),compiled=new Map();
function fileFor(p){for(const suffix of['','.ts','.tsx','.js','.json','/index.ts','/index.js'])if(fs.existsSync(p+suffix)&&fs.statSync(p+suffix).isFile())return p+suffix;throw Error('Missing module '+path.relative(ROOT,p));}
function loader(){
 const modules=new Map(),reads=[];
 function load(file){
  file=fileFor(file);if(modules.has(file))return modules.get(file).exports;
  const module={exports:{}};modules.set(file,module);
  if(/\.(png|webp|jpe?g|svg|mp3|wav|ttf|otf)$/.test(file)){module.exports={uri:path.relative(ROOT,file)};reads.push({path:path.relative(ROOT,file),kind:'asset-reference',bytes:0});return module.exports;}
  const source=fs.readFileSync(file,'utf8');reads.push({path:path.relative(ROOT,file),kind:file.endsWith('.json')?'json':'code',bytes:Buffer.byteLength(source)});
  if(file.endsWith('.json')){module.exports=JSON.parse(source);return module.exports;}
  let code=compiled.get(file);if(!code){code=esbuild.transformSync(source,{loader:file.endsWith('.tsx')?'tsx':file.endsWith('.ts')?'ts':'js',format:'cjs',target:'node24'}).code;compiled.set(file,code);}
  const requireLocal=spec=>{if(spec.startsWith('.'))return load(path.resolve(path.dirname(file),spec));if(spec.startsWith('@/'))return load(path.join(ROOT,'src',spec.slice(2)));return require(spec);};
  new Function('require','module','exports','__filename','__dirname',code)(requireLocal,module,module.exports,file,path.dirname(file));return module.exports;
 }
 return {load,reads};
}
const scenarios=[
 {sector:'agriculture',entry:'src/data/agriculture/index.ts',select:a=>a.agricultureWeeks('1')},
 {sector:'manufacturing',entry:'src/data/manufacturing/index.ts',select:a=>a.loadManufacturingCourse('mechanical')},
 {sector:'food',entry:'src/data/food-manufacturing/index.ts',select:a=>a.foodManufacturingWeeks('1')},
 {sector:'restaurant',entry:'src/data/restaurant/index.ts',select:a=>a.restaurantWeeks('1')},
 {sector:'hospitality',entry:'src/data/hospitality/index.ts',select:a=>a.loadHotelLesson('hotel-service-01')},
 {sector:'construction',entry:'src/data/kensetsu/index.ts',select:a=>a.weeks},
 {sector:'kaigo',entry:'src/data/kaigo/index.ts',select:a=>a.kaigoDailyPlan},
];
function measured(s){const l=loader(),start=performance.now(),api=l.load(path.join(ROOT,s.entry)),importMs=performance.now()-start,importReads=l.reads.length,selectionStart=performance.now();s.select(api);return {importMs,selectionMs:performance.now()-selectionStart,importReads,reads:l.reads};}
function main(){
 const results=[];
 for(const s of scenarios){
  try{
   measured(s); // Populate TypeScript compilation cache before measured trials.
   const trials=Array.from({length:3},()=>measured(s)),last=trials.at(-1),median=key=>trials.map(t=>t[key]).sort((a,b)=>a-b)[1];
   results.push({sector:s.sector,status:'MEASURED_HOST_DATA_ONLY',importMsMedian:median('importMs'),selectionMsMedian:median('selectionMs'),evaluatedOnImport:last.importReads,evaluatedAfterSelection:last.reads.length,jsonBytes:last.reads.filter(r=>r.kind==='json').reduce((n,r)=>n+r.bytes,0),loadedFiles:last.reads});
  }catch(e){results.push({sector:s.sector,status:'BLOCKED',reason:e.message});}
 }
 const report={schemaVersion:1,kind:'host_data_module_profile',node:process.version,samples:3,typeScriptTransformationExcluded:true,filesReadFromWarmHostFilesystem:true,transportMeasured:'Raw JSON host loader; compressed Metro decoding is outside this profile.',platformAdapters:'Asset references are handles; no image decode, React render, UI navigation, native/Expo startup or device measurements.',physicalDeviceTested:false,appStartupMeasured:false,appNavigationMeasured:false,results};
 const out=process.argv[2];if(out)fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,results:results.map(({loadedFiles,...r})=>r)}));
 if(results.some(r=>r.status==='BLOCKED'))process.exitCode=1;
}
if(require.main===module)main();
module.exports={loader};
