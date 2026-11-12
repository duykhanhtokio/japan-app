#!/usr/bin/env node
'use strict';
// Stage 3: audit dialogue locale-batch references without modifying source data.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const index=load('src/data/dialogue-content/locale-batch-index.json');
const localeRoot=path.join(root,'src/data/dialogue-content/locale-batches');
const locales=fs.readdirSync(localeRoot,{withFileTypes:true}).filter(x=>x.isDirectory()).map(x=>x.name).sort();
const scenarioLocations=load('src/data/generated/life-on-demand/scenario-locations.json');
const missing=[],counts={};
for(const locale of locales){
 const dir=path.join(localeRoot,locale);
 const available=new Set(fs.readdirSync(dir).filter(f=>f.endsWith('.json')));
 let found=0;
 for(const [scenarioId,batchId] of Object.entries(index)){
  if(available.has(batchId+'.json'))found++;
  else missing.push({locale,scenarioId,batchId});
 }
 counts[locale]={availableFiles:available.size,indexEntriesResolved:found};
}
const orphanIndex=Object.keys(index).filter(id=>!Object.hasOwn(scenarioLocations,id));
const summary={locales:locales.length,indexEntries:Object.keys(index).length,orphanIndexEntries:orphanIndex.length,missingBatchReferences:missing.length,byLocale:counts,examples:{orphanIndex:orphanIndex.slice(0,12),missingBatches:missing.slice(0,12)},note:'This audits file references only; semantic equivalence of translations and furigana remains untested.'};
console.log(JSON.stringify(summary,null,2));
if(missing.length||orphanIndex.length)process.exitCode=1;
