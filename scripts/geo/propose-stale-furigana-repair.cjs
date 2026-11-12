#!/usr/bin/env node
'use strict';
// Read-only proposal for repairing one stale indexed-furigana entry.
// Never modifies authored Japanese, lexicon, or shard.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const scenarioId='SC-LOC-TKS-ANAN-04-001';
const turnId='DLG-'+scenarioId+'-SHARED-04';
const lexicon=read('src/data/dialogue-content/furigana-lexicon.json');
const dialogue=read('src/data/generated/dialogues/'+scenarioId+'.json');
const rows=Array.isArray(dialogue)?dialogue:(dialogue.shared??dialogue.N5??[]);
const turn=rows.find(t=>t.id===turnId);
if(!turn||turn.speaker!=='PLAYER'||!turn.player?.recommendedAnswerJa)throw Error('Source turn not found');
const source=turn.player.recommendedAnswerJa;
let hash=0;for(let i=0;i<scenarioId.length;i++)hash=(hash*31+scenarioId.charCodeAt(i))>>>0;
const shardName=String(hash%32).padStart(2,'0')+'.json';
const shard=read('src/data/dialogue-content/furigana-indexed/'+shardName);
const current=shard.scenarios?.[scenarioId]?.[turnId];
if(!current)throw Error('Indexed entry not found');
const old=current.tokens.map(i=>lexicon[i]?.[0]||'').join('');
const byFirst=new Map();
lexicon.forEach((entry,id)=>{if(!Array.isArray(entry)||typeof entry[0]!=='string'||!entry[0])return;const ch=entry[0][0];if(!byFirst.has(ch))byFirst.set(ch,[]);byFirst.get(ch).push({id,text:entry[0],reading:entry[1]||null});});
const memo=new Map();
function pathsAt(pos){
 if(pos===source.length)return {count:1,best:[]};
 if(memo.has(pos))return memo.get(pos);
 let count=0,best=null;
 for(const candidate of byFirst.get(source[pos])||[]){
  if(!source.startsWith(candidate.text,pos))continue;
  const suffix=pathsAt(pos+candidate.text.length);
  if(!suffix.count)continue;
  count=Math.min(2,count+suffix.count);
  const path=[candidate,...suffix.best];
  if(!best||path.length<best.length)best=path;
 }
 const result={count,best};memo.set(pos,result);return result;
}
const result=pathsAt(0);
console.log(JSON.stringify({scenarioId,turnId,shardName,source,staleIndexedText:old,sourceLength:source.length,oldLength:old.length,hasLexiconSegmentation:result.count>0,segmentationUnique:result.count===1,proposedTokenCount:result.best?.length??0,proposedSegments:result.best?.map(x=>({text:x.text,reading:x.reading,id:x.id}))??[],note:'Read-only candidate; lexical segmentation does not establish correct readings. Human review required before write.'},null,2));
if(!result.count)process.exitCode=2;
