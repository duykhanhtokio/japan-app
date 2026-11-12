#!/usr/bin/env node
'use strict';
// Generate all 47 prefecture dialogue modules with literal Metro requires.
// No content edits, no entitlement gates, no production-loader switch.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const cities=read('src/data/generated/cities.json');
const locCity=read('src/data/generated/life-on-demand/location-cities.json');
const scenarioLoc=read('src/data/generated/life-on-demand/scenario-locations.json');
const cityPref=new Map(cities.map(c=>[c.id,c.prefectureId]));
const grouped=new Map(Array.from({length:47},(_,i)=>['PRF-'+String(i+1).padStart(3,'0'),[]]));
for(const [scenarioId,locationId] of Object.entries(scenarioLoc)){
 const pref=cityPref.get(locCity[locationId]);
 if(!grouped.has(pref))throw Error('Unknown prefecture: '+scenarioId);
 if(!fs.existsSync(path.join(root,'src/data/generated/dialogues',scenarioId+'.json')))throw Error('Missing source: '+scenarioId);
 grouped.get(pref).push(scenarioId);
}
const outputDir=path.join(root,'src/data/generated/geo-prefectures');
const indexPath=path.join(outputDir,'index.ts');
const lines=['// Generated: all prefectures are offline, loaded by explicit dynamic imports.','export type PrefectureDialogueModule = { loadRawDialogue: (scenarioId: string) => unknown | undefined };','export const prefectureModules: Record<string, () => Promise<PrefectureDialogueModule>> = {'];
const generated=[];
let count=0;
for(const [pref,ids] of grouped){
 ids.sort();count+=ids.length;
 const body=['// Generated. Do not edit manually.','const modules: Record<string, () => unknown> = {',
 ...ids.map(id=>'  '+JSON.stringify(id)+': () => require('+JSON.stringify('../dialogues/'+id+'.json')+'),'),
 '};','export function loadRawDialogue(scenarioId: string): unknown | undefined {','  return modules[scenarioId]?.();','}',''];
 generated.push([path.join(outputDir,pref+'.ts'),body.join('\n')]);
 lines.push('  '+JSON.stringify(pref)+': () => import('+JSON.stringify('./'+pref)+'),');
}
lines.push('};','');
generated.push([indexPath,lines.join('\n')]);
if(count!==Object.keys(scenarioLoc).length)throw Error('Scenario count mismatch');
const mode=process.argv[2];
if(!['--check','--write'].includes(mode)||process.argv.length!==3)throw Error('Usage: node scripts/geo/generate-prefecture-modules.cjs --check|--write');
if(mode==='--write'){fs.mkdirSync(outputDir,{recursive:true});for(const [file,body] of generated)fs.writeFileSync(file,body);}
console.log(JSON.stringify({mode,prefectures:grouped.size,scenarios:count,generatedFiles:generated.length,outputDir,productionWired:false},null,2));
