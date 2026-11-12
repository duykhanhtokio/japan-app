#!/usr/bin/env node
'use strict';
// Validate a generated manifest against canonical source relations.
// No runtime wiring, entitlement changes, or source file mutations.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const canonical=rel=>read(path.join(root,rel));
const file=process.argv[2];
if(!file){console.error('Usage: node scripts/geo/validate-geo-manifest.cjs <manifest.json>');process.exit(2);}
const manifest=read(path.resolve(file));
const scenarioLocations=canonical('src/data/generated/life-on-demand/scenario-locations.json');
const locationCities=canonical('src/data/generated/life-on-demand/location-cities.json');
const cities=canonical('src/data/generated/cities.json');
const cityById=new Map(cities.map(c=>[c.id,c]));
const seen=new Set(),errors=[];
for(const [regionId,region] of Object.entries(manifest.regions||{})){
 for(const pref of region.prefectures||[]){
  if(pref.regionId!==regionId)errors.push('Region mismatch: '+pref.prefectureId);
  for(const [cityId,city] of Object.entries(pref.cities||{})){
   if(cityById.get(cityId)?.prefectureId!==pref.prefectureId)errors.push('Prefecture mismatch: '+cityId);
   for(const [locationId,ids] of Object.entries(city.locations||{})){
    if(locationCities[locationId]!==cityId)errors.push('Location mismatch: '+locationId);
    for(const id of ids){
     if(seen.has(id))errors.push('Duplicate scenario: '+id);
     seen.add(id);
     if(scenarioLocations[id]!==locationId)errors.push('Scenario mismatch: '+id);
    }
   }
  }
 }
}
for(const id of Object.keys(scenarioLocations))if(!seen.has(id))errors.push('Missing scenario: '+id);
const generic=fs.readdirSync(path.join(root,'src/data/generated/dialogues')).filter(f=>f.startsWith('GENERIC-CITY-')&&f.endsWith('.json')).sort();
if(JSON.stringify(generic)!==JSON.stringify([...(manifest.shared?.genericDialogueFiles||[])].sort()))errors.push('Generic dialogue inventory mismatch');
const summary={expectedScenarios:Object.keys(scenarioLocations).length,actualScenarios:seen.size,genericFiles:generic.length,errors:errors.length,samples:errors.slice(0,20)};
console.log(JSON.stringify(summary,null,2));
if(errors.length)process.exitCode=1;
