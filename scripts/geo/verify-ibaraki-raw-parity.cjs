#!/usr/bin/env node
'use strict';
// Read-only Ibaraki raw dialogue parity test, independent of Metro.
// Compares the generated module's require targets with canonical JSON files,
// validates dialogue turn identity and counts, and reports content hashes.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const source=fs.readFileSync(path.join(root,'src/data/generated/geo-pilot/ibaraki-dialogues.ts'),'utf8');
const rows=[...source.matchAll(/^  "([^"]+)": \(\) => require\("\.\.\/dialogues\/([^"]+)\.json"\),$/gm)];
const issues=[];let turns=0;
const digest=crypto.createHash('sha256');
for(const [,scenarioId,targetId] of rows){
 if(scenarioId!==targetId){issues.push({scenarioId,reason:'wrong-target'});continue;}
 const file=path.join(root,'src/data/generated/dialogues',targetId+'.json');
 if(!fs.existsSync(file)){issues.push({scenarioId,reason:'missing-json'});continue;}
 const bytes=fs.readFileSync(file);
 let data;
 try{data=JSON.parse(bytes);}catch(e){issues.push({scenarioId,reason:'invalid-json'});continue;}
 const list=Array.isArray(data)?data:(data.shared??data.N5);
 if(!Array.isArray(list)){issues.push({scenarioId,reason:'missing-turn-list'});continue;}
 for(const turn of list){
  turns++;
  if(turn.scenarioId!==scenarioId)issues.push({scenarioId,turnId:turn.id,reason:'wrong-scenario-id'});
  if(turn.speaker==='NPC'&&typeof turn.npc?.textJa!=='string')issues.push({scenarioId,turnId:turn.id,reason:'missing-npc-text'});
  if(turn.speaker==='PLAYER'&&typeof turn.player?.recommendedAnswerJa!=='string')issues.push({scenarioId,turnId:turn.id,reason:'missing-player-text'});
 }
 digest.update(scenarioId).update('\0').update(bytes).update('\0');
}
console.log(JSON.stringify({scenarios:rows.length,turns,issues:issues.length,examples:issues.slice(0,15),sourceDigestSha256:digest.digest('hex'),note:'Raw JSON parity only; locale/furigana overlays and actual Metro async execution remain untested.'},null,2));
if(issues.length)process.exitCode=1;
