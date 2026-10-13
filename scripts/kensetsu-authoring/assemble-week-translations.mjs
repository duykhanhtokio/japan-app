import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {collectTranslatableUnits} from '../../src/data/kensetsu/localization.ts';

const week=Number(process.argv[2]);
const input=process.argv[3];
assert(Number.isInteger(week)&&week>=1&&week<=55,'Provide week 1–55');
assert(input&&fs.statSync(input).isDirectory(),'Provide the locale-pair directory');
const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const pairs=[['en','vi'],['zh-CN','zh-TW'],['th','km'],['id','tl'],['hi','ne'],['bn','my']];
const sources=Array.from({length:7},(_,i)=>{
 const number=String((week-1)*7+i+1).padStart(3,'0');
 const session=JSON.parse(fs.readFileSync(`docs/ssw-workspace/kensetsu/shared-session-${number}.json`,'utf8'));
 return {number,session,units:collectTranslatableUnits(session)};
});
const bundles=new Map(sources.map(({session,units})=>[session.id,{sessionId:session.id,entries:Object.fromEntries(Object.entries(units).map(([id,sourceJa])=>[id,{sourceJa,translations:{}}]))}]));

// Validate all inputs against the current canonical lessons before writing any output.
for(const pair of pairs){
 const data=JSON.parse(fs.readFileSync(path.join(input,`pair-${pair.join('-')}.json`),'utf8'));
 assert.deepEqual(data.locales,pair,'Wrong locale pair');
 assert.deepEqual(data.sessions.map(s=>s.sessionId).sort(),sources.map(s=>s.session.id).sort(),'Wrong or duplicate sessions');
 for(const translated of data.sessions){
  const bundle=bundles.get(translated.sessionId);
  assert.deepEqual(Object.keys(translated.entries).sort(),Object.keys(bundle.entries).sort(),'Missing or extra units');
  for(const [id,entry] of Object.entries(translated.entries)){
   assert.equal(entry.sourceJa,bundle.entries[id].sourceJa,`${translated.sessionId}:${id}: stale Japanese`);
   assert.deepEqual(Object.keys(entry.translations).sort(),pair.slice().sort(),'Wrong translation keys');
   for(const locale of pair){
    const text=entry.translations[locale];
    assert(typeof text==='string'&&text.trim(),`${translated.sessionId}:${id}:${locale}: empty`);
    assert.equal(bundle.entries[id].translations[locale],undefined,'Duplicate translation');
    bundle.entries[id].translations[locale]=text;
   }
  }
 }
}
const outputs=sources.map(({number,session})=>{
 const bundle=bundles.get(session.id);
 for(const entry of Object.values(bundle.entries)){
  assert.deepEqual(Object.keys(entry.translations).sort(),locales.slice().sort());
  entry.translations=Object.fromEntries(locales.map(locale=>[locale,entry.translations[locale]]));
 }
 const file=`src/data/kensetsu/translations/session-${number}.json`;
 const content=JSON.stringify(bundle,null,2)+'\n';
 if(fs.existsSync(file))assert.equal(fs.readFileSync(file,'utf8'),content,`Refusing to overwrite existing different bundle: ${file}`);
 return {file,content};
});
for(const {file,content} of outputs)if(!fs.existsSync(file))fs.writeFileSync(file,content);
const units=sources.reduce((n,s)=>n+Object.keys(s.units).length,0);
console.log(`ASSEMBLY PASS: week ${week}, 7 lessons, ${units} canonical units, ${units*12} translations; existing different bundles never overwritten.`);
