/** Supplement binding, stale-revision rejection and React/RNW rendering; no device certification. */
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto'),cp=require('child_process');
const root=path.resolve(__dirname,'../..'),out=process.env.RESTAURANT_SOURCE31_QA_DIR||'/tmp/restaurant-source31-qa';fs.mkdirSync(out,{recursive:true});
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
(async()=>{
 const build=await require('esbuild').build({stdin:{contents:`import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {RestaurantSourceSupplement} from './src/components/restaurant/RestaurantSourceSupplement';export * from './src/data/restaurant/source31';export const render=props=>renderToStaticMarkup(<RestaurantSourceSupplement {...props}/>);`,resolveDir:root,loader:'tsx'},outfile:path.join(out,'entry.cjs'),bundle:true,platform:'node',format:'cjs',nodePaths:(process.env.NODE_PATH||'').split(path.delimiter),jsx:'automatic',external:['react','react-dom','react-dom/server'],define:{__DEV__:'true'},loader:{'.png':'dataurl'},plugins:[{name:'rnw-source31',setup(b){
 b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));
 b.onResolve({filter:/^@react-native-async-storage\/async-storage$/},()=>({path:'storage',namespace:'adapter'}));
 b.onLoad({filter:/.*/,namespace:'adapter'},()=>({contents:'export default {getItem:async()=>null,setItem:async()=>{}}',loader:'js'}));
 b.onResolve({filter:/^@\//},a=>{const p=path.join(root,'src',a.path.slice(2));for(const ext of ['','.tsx','.ts','.json','/index.ts'])if(fs.existsSync(p+ext)&&fs.statSync(p+ext).isFile())return {path:p+ext};throw Error(p);});
 }}]});
 const api=require(path.join(out,'entry.cjs'));let renders=0,questions=0,sections=0,figures=0;
 const cross=read('docs/ssw-workspace/restaurant/source-closure31/unit-crosswalk.json'),report=read('docs/ssw-workspace/restaurant/source-closure31/build-validation.json');
 assert.equal(Object.keys(cross.units).length+report.missingPacketUnits.length,639);
 assert.equal(cross.pages.length+report.missingPacketPages.length,271);
 for(const level of ['1','2']){
  const lessons=read(`src/data/restaurant/lessons.${level}.ja.json`).lessons;
  for(const l of lessons){const row=api.sourceLesson31(l);if(!row)continue;
   assert.equal(api.sourceLesson31({...l,summaryJa:l.summaryJa+'changed'}),null);
   assert.equal(api.sourceLesson31({...l,sourceHash:'changed'}),null);
   for(const lang of ['ja','vi']){const html=api.render({lesson:l,learner:'source31-test',language:lang,showTranslation:lang!=='ja'});for(const section of row.sections)assert(html.includes(section.id),section.id);if(row.exam)assert(html.includes('source31-open-'+l.id));assert(!html.includes('source31-review'));renders++;}
   for(const f of row.figures){const p=path.join(root,f.assetFile),raw=fs.readFileSync(p);assert(raw.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),f.sha256);assert.equal(raw.readUInt32BE(16),f.width);assert.equal(raw.readUInt32BE(20),f.height);figures++;}
   for(const q of row.exam?.questions??[]){assert.equal(q.optionsJa.length,4);assert.equal(new Set(q.optionsJa).size,4);assert.equal(q.optionReasonsJa.length,4);assert(q.correctIndex>=0&&q.correctIndex<4);assert.equal(api.sourceQuestionTarget31({...q,stemJa:q.stemJa+'changed'},'vi'),null);questions++;}
   sections+=row.sections.length;
  }
 }
 for(const p of ['src/services/restaurant-study-state.ts',...['1','2'].flatMap(l=>[`src/data/restaurant/lessons.${l}.ja.json`,`src/data/restaurant/exams.${l}.ja.json`])])assert(fs.readFileSync(path.join(root,p)).equals(cp.execFileSync('git',['show','8a0ebfe5:'+p],{cwd:root,maxBuffer:30e6})),p);
 const result={status:'PASS',renders,sections,questions,figures,staleLessonRejected:true,staleQuestionRejected:true,canonicalContentAndProgressPreserved:true,browserTested:false,physicalDeviceTested:false};fs.writeFileSync(path.join(root,'docs/ssw-workspace/restaurant/source-closure31/integration-qa.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exitCode=1});
