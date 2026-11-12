#!/usr/bin/env node
'use strict';
// Read-only exact-text alignment of indexed furigana against source dialogue.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const lexicon=read('src/data/dialogue-content/furigana-lexicon.json');
const dir=path.join(root,'src/data/dialogue-content/furigana-indexed');
const dialogueDir=path.join(root,'src/data/generated/dialogues');
let scenarios=0,turns=0,aligned=0,unresolved=0;
const issues=[];
const files=fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort();
for(const file of files){
 const shard=JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'));
 for(const [scenarioId,entries] of Object.entries(shard.scenarios||{})){
  scenarios++;
  const source=path.join(dialogueDir,scenarioId+'.json');
  if(!fs.existsSync(source)){issues.push({scenarioId,reason:'missing-direct-source'});unresolved+=Object.keys(entries).length;continue;}
  const data=JSON.parse(fs.readFileSync(source,'utf8'));
  const rows=Array.isArray(data)?data:(data.shared??data.N5??[]);
  const byId=new Map(rows.map(row=>[row.id,row]));
  for(const [turnId,entry] of Object.entries(entries)){
   turns++;
   const turn=byId.get(turnId);
   const text=entry.speaker==='NPC'?turn?.npc?.textJa:turn?.player?.recommendedAnswerJa;
   if(!turn||turn.speaker!==entry.speaker||typeof text!=='string'){
    issues.push({scenarioId,turnId,reason:'missing-turn-or-text'});unresolved++;continue;
   }
   const reconstructed=entry.tokens.map(id=>lexicon[id]?.[0]??'').join('');
   if(reconstructed!==text){
    issues.push({scenarioId,turnId,reason:'text-mismatch',sourceLength:text.length,reconstructedLength:reconstructed.length});unresolved++;continue;
   }
   aligned++;
  }
 }
}
console.log(JSON.stringify({shards:files.length,scenarioEntries:scenarios,checkedTurns:turns,alignedTurns:aligned,unresolvedTurns:unresolved,issues:issues.length,examples:issues.slice(0,20),note:'Checks exact Japanese text alignment, not phonetic correctness or non-indexed furigana.'},null,2));
if(issues.length)process.exitCode=1;
