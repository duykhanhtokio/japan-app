// Extract canonical active dialogue sources only; never fabricate translations.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),[batch,startArg,countArg]=process.argv.slice(2),start=Number(startArg),count=Number(countArg);
assert(/^\d{3,}$/.test(batch??''),'Usage: node scripts/prepare-dialogue-localization-batch.cjs BATCH START COUNT');
assert(Number.isInteger(start)&&start>=0&&Number.isInteger(count)&&count>0);
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const scenarios=new Map(['src/data/generated/scenarios.json','src/data/dialogue-content/scenario-overrides.json','src/data/dialogue-content/independent-city-overrides.json'].flatMap(read).map(s=>[s.id,s]));
const selected=[...scenarios.keys()].slice(start,start+count),sources={};assert.equal(selected.length,count);
for(const scenarioId of selected){let file=`src/data/generated/dialogues/${scenarioId}.json`;const direct=fs.existsSync(path.join(root,file));if(!direct){const m=/^SC-LOC-JP-\d{5}-(\d{2})-001$/.exec(scenarioId);assert(m,'Missing direct source: '+scenarioId);file=`src/data/generated/dialogues/GENERIC-CITY-${m[1]}.json`;}
 const d=read(file),turns=Array.isArray(d)?d:d.shared??d.N5;assert(Array.isArray(turns),scenarioId);sources[scenarioId]={turns:Object.fromEntries(turns.map(t=>{const id=direct?t.id:t.id.replace(/GENERIC-CITY-\d{2}/g,scenarioId);const sourceJa=t.speaker==='NPC'?t.npc?.textJa:t.player?.recommendedAnswerJa;assert(sourceJa?.trim(),id);return [id,{speaker:t.speaker,sourceJa,...(t.speaker==='PLAYER'&&t.player.hint?{hintJa:t.player.hint}:{})}];}))};
}
const destination=path.join(root,'docs/localization-workspace/sources',`dialogue-batch-${batch}.ja.json`);assert(!fs.existsSync(destination),'Preserve existing batch: '+destination);fs.writeFileSync(destination,JSON.stringify({batch,scenarios:sources},null,2)+'\n');console.log(JSON.stringify({batch,start,scenarios:selected.length,first:selected[0],last:selected.at(-1)}));
