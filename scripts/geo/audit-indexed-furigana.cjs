#!/usr/bin/env node
'use strict';
// Read-only indexed-furigana structural audit. Does not assert reading accuracy.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const lexicon=read('src/data/dialogue-content/furigana-lexicon.json');
const shardDir=path.join(root,'src/data/dialogue-content/furigana-indexed');
const files=fs.readdirSync(shardDir).filter(n=>n.endsWith('.json')).sort();
const shardFor=id=>{let h=0;for(let i=0;i<id.length;i++)h=(h*31+id.charCodeAt(i))>>>0;return String(h%32).padStart(2,'0')+'.json'};
const errors=[];let scenarioCount=0,turnCount=0,tokenCount=0;
for(const file of files){
 const shard=JSON.parse(fs.readFileSync(path.join(shardDir,file),'utf8'));
 if(shard.version!==1||!shard.scenarios||typeof shard.scenarios!=='object'){errors.push({file,reason:'invalid-shard-schema'});continue;}
 for(const [scenarioId,turns] of Object.entries(shard.scenarios)){
  scenarioCount++;
  if(shardFor(scenarioId)!==file)errors.push({file,scenarioId,reason:'wrong-shard'});
  for(const [turnId,entry] of Object.entries(turns)){
   turnCount++;
   if(!['NPC','PLAYER'].includes(entry.speaker)||!Array.isArray(entry.tokens)){errors.push({file,scenarioId,turnId,reason:'invalid-turn'});continue;}
   for(const id of entry.tokens){
    tokenCount++;
    if(!Number.isInteger(id)||id<0||id>=lexicon.length)errors.push({file,scenarioId,turnId,id,reason:'invalid-lexicon-token'});
   }
  }
 }
}
const summary={shards:files.length,lexiconEntries:lexicon.length,scenarioEntries:scenarioCount,turnEntries:turnCount,tokenReferences:tokenCount,structuralErrors:errors.length,examples:errors.slice(0,15),note:'Token and shard integrity only; full source-text alignment and reading correctness require a separate runtime parity test.'};
console.log(JSON.stringify(summary,null,2));
if(errors.length)process.exitCode=1;
