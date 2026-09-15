const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'../src/data/generated');
const read=(name)=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const cities=read('cities.json'),locations=read('locations.json'),scenarios=read('scenarios.json'),index=read('scenario-index.json');
const cityIds=new Set(cities.map(x=>x.id)),locationIds=new Set(locations.map(x=>x.id)),errors=[],covered=new Set(); let turns=0;
for(const location of locations)if(!location.cityId||!cityIds.has(location.cityId))errors.push(`Orphan location: ${location.id}`);
for(const scenario of scenarios){
  if(!scenario.cityId||!cityIds.has(scenario.cityId))errors.push(`Invalid city: ${scenario.id}`);
  if(!scenario.locationId||!locationIds.has(scenario.locationId))errors.push(`Invalid location: ${scenario.id}`);
  const file=path.join(root,'dialogues',`${scenario.id}.json`); if(!fs.existsSync(file)){errors.push(`Missing: ${scenario.id}`);continue;}
  const rows=JSON.parse(fs.readFileSync(file,'utf8')); turns+=rows.length; covered.add(scenario.cityId);
  if(index[scenario.id]?.dialogueCount!==rows.length)errors.push(`Index mismatch: ${scenario.id}`);
  rows.forEach((row,i)=>{if(row.scenarioId!==scenario.id||row.turnOrder!==i+1)errors.push(`Order/id: ${row.id}`);if(row.speaker==='NPC'&&!row.npc?.textJa)errors.push(`NPC missing: ${row.id}`);if(row.speaker==='PLAYER'&&!row.player?.recommendedAnswerJa)errors.push(`Player missing: ${row.id}`);});
}
const summary={cities:cities.length,citiesWithDialogue:covered.size,locations:locations.length,scenarios:scenarios.length,dialogueFiles:fs.readdirSync(path.join(root,'dialogues')).filter(x=>x.endsWith('.json')).length,dialogueTurns:turns,errors:errors.length};console.log(JSON.stringify(summary,null,2));if(errors.length){console.error(errors.slice(0,100).join('\n'));process.exit(1);}
