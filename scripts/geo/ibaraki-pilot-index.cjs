#!/usr/bin/env node
'use strict';
// Ibaraki pilot inventory: read-only; does not change the live dialogue loader.
// Output is a deterministic per-city/location index for later runtime packaging.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const cities=read('src/data/generated/cities.json');
const locCity=read('src/data/generated/life-on-demand/location-cities.json');
const scLoc=read('src/data/generated/life-on-demand/scenario-locations.json');
const localeIndex=read('src/data/dialogue-content/locale-batch-index.json');
const target='PRF-008';
const cityIds=new Set(cities.filter(c=>c.prefectureId===target).map(c=>c.id));
const result={schemaVersion:1,prefectureId:target,regionId:'kanto',cities:{}};
for(const cityId of [...cityIds].sort())result.cities[cityId]={locations:{}};
for(const [scenarioId,locationId] of Object.entries(scLoc)){
 const cityId=locCity[locationId];
 if(!cityIds.has(cityId))continue;
 const locs=result.cities[cityId].locations;
 if(!locs[locationId])locs[locationId]=[];
 locs[locationId].push({scenarioId,dialogueFile:'src/data/generated/dialogues/'+scenarioId+'.json',localeBatchId:localeIndex[scenarioId]||null});
}
let count=0;
for(const city of Object.values(result.cities))for(const scenarios of Object.values(city.locations)){scenarios.sort((a,b)=>a.scenarioId.localeCompare(b.scenarioId));count+=scenarios.length;}
const missing=[];
for(const city of Object.values(result.cities))for(const scenarios of Object.values(city.locations))for(const row of scenarios)if(!fs.existsSync(path.join(root,row.dialogueFile)))missing.push(row.scenarioId);
const args=process.argv.slice(2);
if(args.length!==2||args[0]!=='--out')throw Error('Usage: node scripts/geo/ibaraki-pilot-index.cjs --out /tmp/ibaraki-pilot.json');
if(missing.length)throw Error('Missing dialogue files: '+missing.slice(0,10).join(','));
const out=path.resolve(args[1]);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({prefectureId:target,cityCount:cityIds.size,scenarioCount:count,missingDialogueFiles:missing.length,output:out,note:'Index only: no Metro runtime performance improvement until loader implementation and measurement.'},null,2));
