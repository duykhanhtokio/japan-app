#!/usr/bin/env node
'use strict';
// Stage 2: build deterministic geographic manifests only. No runtime imports,
// content rewrites, permission gates or asset changes.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const cities=read('src/data/generated/cities.json');
const locCity=read('src/data/generated/life-on-demand/location-cities.json');
const scLoc=read('src/data/generated/life-on-demand/scenario-locations.json');
const dialogueDir=path.join(root,'src/data/generated/dialogues');
const localeIndex=read('src/data/dialogue-content/locale-batch-index.json');
const regions=['hokkaido','tohoku','kanto','chubu','kansai','chugoku','shikoku','kyushu'];
const regionOf=n=>n===1?regions[0]:n<=7?regions[1]:n<=14?regions[2]:n<=23?regions[3]:n<=30?regions[4]:n<=35?regions[5]:n<=39?regions[6]:n<=47?regions[7]:null;
const byCity=new Map(cities.map(c=>[c.id,c]));
const grouped=new Map();
const errors=[];
for(const [scenarioId,locationId] of Object.entries(scLoc)){
 const cityId=locCity[locationId],city=byCity.get(cityId);
 const match=/^PRF-(\d{3})$/.exec(city?.prefectureId||'');
 const n=match?Number(match[1]):0,region=regionOf(n);
 if(!region||!cityId){errors.push({scenarioId,reason:'unresolved-geography'});continue;}
 if(!grouped.has(city.prefectureId))grouped.set(city.prefectureId,{regionId:region,prefectureId:city.prefectureId,cities:{}});
 const group=grouped.get(city.prefectureId);
 if(!group.cities[cityId])group.cities[cityId]={locations:{}};
 const locations=group.cities[cityId].locations;
 if(!locations[locationId])locations[locationId]=[];
 locations[locationId].push(scenarioId);
}
const sourceFiles=fs.readdirSync(dialogueDir).filter(f=>f.endsWith('.json')).sort();
const generic=sourceFiles.filter(f=>f.startsWith('GENERIC-CITY-'));
const indexed=new Set(Object.keys(scLoc));
const missing=sourceFiles.filter(f=>!f.startsWith('GENERIC-CITY-')&&!indexed.has(f.slice(0,-5)));
if(errors.length||missing.length)throw Error('Cannot generate: unresolved geographic links or dialogue files');
const output={schemaVersion:1,sourceHash:crypto.createHash('sha256').update(JSON.stringify({cities,locCity,scLoc})).digest('hex'),regions:{},shared:{genericDialogueFiles:generic},localeBatchIndexEntries:Object.keys(localeIndex).length};
for(const region of regions)output.regions[region]={prefectures:[]};
for(const [prefId,entry] of [...grouped].sort(([a],[b])=>a.localeCompare(b))){
 for(const city of Object.values(entry.cities))for(const list of Object.values(city.locations))list.sort();
 output.regions[entry.regionId].prefectures.push(entry);
}
const counted=Object.values(output.regions).flatMap(r=>r.prefectures).reduce((sum,p)=>sum+Object.values(p.cities).reduce((c,city)=>c+Object.values(city.locations).reduce((n,ids)=>n+ids.length,0),0),0);
if(counted!==Object.keys(scLoc).length)throw Error('Scenario count mismatch');
const args=process.argv.slice(2);
if(args.length!==2||args[0]!=='--out')throw Error('Usage: node scripts/geo/generate-geo-manifest.cjs --out <path>');
const destination=path.resolve(args[1]);
fs.mkdirSync(path.dirname(destination),{recursive:true});
fs.writeFileSync(destination,JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({output:destination,regions:regions.length,prefectures:grouped.size,scenarios:counted,genericFiles:generic.length,localeBatchIndexEntries:output.localeBatchIndexEntries,sourceHash:output.sourceHash},null,2));
