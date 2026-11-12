#!/usr/bin/env node
'use strict';
// Verify the generated Ibaraki static-require map matches canonical scenario
// membership. No runtime wiring, no source mutations.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const cities=read('src/data/generated/cities.json');
const lc=read('src/data/generated/life-on-demand/location-cities.json');
const sl=read('src/data/generated/life-on-demand/scenario-locations.json');
const eligible=new Set(cities.filter(c=>c.prefectureId==='PRF-008').map(c=>c.id));
const expected=Object.entries(sl).filter(([id,loc])=>eligible.has(lc[loc])).map(([id])=>id).sort();
const file=path.join(root,'src/data/generated/geo-pilot/ibaraki-dialogues.ts');
const source=fs.readFileSync(file,'utf8');
const found=[...source.matchAll(/^  "(.*?)": \(\) => require\("\.\.\/dialogues\/(.*?)\.json"\),$/gm)];
const errors=[];
const ids=found.map(m=>m[1]).sort();
if(ids.length!==expected.length)errors.push('Scenario count mismatch');
for(let i=0;i<expected.length;i++)if(ids[i]!==expected[i]){errors.push('Membership mismatch at '+i);break;}
for(const match of found)if(match[1]!==match[2])errors.push('Require path mismatch: '+match[1]);
if(!source.includes('export function loadIbarakiRawDialogue('))errors.push('Missing loader export');
const result={expectedScenarios:expected.length,staticRequires:found.length,errors:errors.length,examples:errors.slice(0,10),note:'Static graph parity only; Metro runtime and translations/furigana are not yet tested.'};
console.log(JSON.stringify(result,null,2));
if(errors.length)process.exitCode=1;
