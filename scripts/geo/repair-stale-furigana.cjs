#!/usr/bin/env node
'use strict';
// Narrow repair: exactly one reviewed PLAYER turn. No edits to Japanese source or lexicon.
// Run with --check first, then --apply; always back up the shard before writing.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const scenarioId='SC-LOC-TKS-ANAN-04-001';
const turnId='DLG-'+scenarioId+'-SHARED-04';
const expectedSource='それだと、配る日には賞味期限を過ぎていますね。別の商品で、表示を見ながら選び直せますか。';
const expectedOld='それだと配る日を過ぎますね。別の商品で、表示を見ながら選び直せますか。';
const tokens=[602,303,28,23,742,99,818,24,35,3976,631,62,1392,966,43,48,30,39,1,372,3,498,11,23,10,62,98,197,473,610,666,269,30,8,1];
const shardPath=path.join(root,'src/data/dialogue-content/furigana-indexed/00.json');
const lexicon=JSON.parse(fs.readFileSync(path.join(root,'src/data/dialogue-content/furigana-lexicon.json'),'utf8'));
const dialogue=JSON.parse(fs.readFileSync(path.join(root,'src/data/generated/dialogues',scenarioId+'.json'),'utf8'));
const turn=(dialogue.shared||dialogue.N5||[]).find(x=>x.id===turnId);
if(turn?.speaker!=='PLAYER'||turn.player?.recommendedAnswerJa!==expectedSource)throw Error('Source text changed: refusing repair');
const joined=ids=>ids.map(i=>lexicon[i]?.[0]??'').join('');
if(joined(tokens)!==expectedSource)throw Error('Proposed tokens do not match source');
const original=fs.readFileSync(shardPath,'utf8');
const shard=JSON.parse(original);
const entry=shard.scenarios?.[scenarioId]?.[turnId];
if(!entry||entry.speaker!=='PLAYER')throw Error('Target entry missing');
const current=joined(entry.tokens);
if(current===expectedSource){console.log('ALREADY FIXED: source and indexed text match');process.exit(0);}
if(current!==expectedOld)throw Error('Unexpected existing tokens: refusing repair');
const args=process.argv.slice(2);
if(args.length!==1||!['--check','--apply'].includes(args[0]))throw Error('Usage: node scripts/geo/repair-stale-furigana.cjs --check|--apply');
console.log(JSON.stringify({scenarioId,turnId,oldText:current,newText:joined(tokens),tokenCount:tokens.length,mode:args[0]},null,2));
if(args[0]==='--check')process.exit(0);
const backup=shardPath+'.backup-'+Date.now();
fs.copyFileSync(shardPath,backup,fs.constants.COPYFILE_EXCL);
entry.tokens=tokens;
const output=JSON.stringify(shard)+'\n';
fs.writeFileSync(shardPath,output);
console.log('REPAIRED:',shardPath);
console.log('BACKUP:',backup);
console.log('Run full alignment audit before committing. Do not stage backup file.');
