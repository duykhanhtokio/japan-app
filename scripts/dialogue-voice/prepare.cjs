// Export the real source-bound loader, including corrected location categories and readings.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
(async()=>{
 const esbuild=require(require.resolve('esbuild',{paths:[process.env.TOKUTEI_QA_MODULES||root]}));
 const b=await esbuild.build({stdin:{contents:`export {loadDialogueTurns} from './src/services/dialogue-content-loader';export {getLifeScenarioById,getLifeLocationById} from './src/services/life-content-repository';`,resolveDir:root},bundle:true,write:false,platform:'node',format:'cjs',logLevel:'error',plugins:[{name:'aliases',setup(b){b.onResolve({filter:/^@\//},a=>{const base=path.join(root,'src',a.path.slice(2));return {path:fs.existsSync(base)?base:base+'.ts'};});}}]});
 const requireData=Object.assign(name=>require(name),{context(dir,recursive){const base=path.resolve(root,'src/services',dir),files={},cache=new Map();function scan(dir,prefix='.'){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(e.isDirectory()){if(recursive)scan(path.join(dir,e.name),prefix+'/'+e.name);}else if(e.name.endsWith('.json'))files[prefix+'/'+e.name]=path.join(dir,e.name);}}scan(base);return Object.assign(key=>{if(!files[key])throw Error(key);if(!cache.has(key)){cache.set(key,JSON.parse(fs.readFileSync(files[key],'utf8')));if(cache.size>32)cache.delete(cache.keys().next().value);}return cache.get(key);},{keys:()=>Object.keys(files)});}});
 const m={exports:{}};new Function('module','exports','require',b.outputFiles[0].text)(m,m.exports,requireData);
 const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
 const cast=read('src/data/dialogue-content/npc-voice-casting.json'),voices=read('src/data/jlpt-original/voice-casting.json');
 const ids=new Set(['src/data/generated/scenarios.json','src/data/dialogue-content/scenario-overrides.json','src/data/dialogue-content/independent-city-overrides.json'].flatMap(p=>read(p).map(s=>s.id)));
 const rows=[],unverified=new Set();
 for(const scenarioId of [...ids].sort()){
  const scenario=m.exports.getLifeScenarioById(scenarioId),location=m.exports.getLifeLocationById(scenario.locationId);
  const category=(location?.category||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  // Unknown categories use landmark art in the real renderer; laundry has distinct art, requiring inspection.
  if(cast.unverifiedCategories.includes(category)){unverified.add(category);continue;}
  const role=cast.categories[category]||cast.fallbackRole;
  for(const turn of m.exports.loadDialogueTurns(scenarioId))if(turn.speaker==='NPC'){
   const text=turn.npc.textJa;if(!text)throw Error('Missing NPC source '+turn.id);
   const ruby=turn.npc.textRuby;
   if(!ruby||ruby.map(x=>x.text).join('')!==text)throw Error('Missing aligned pronunciation '+turn.id);
   rows.push({scenarioId,turnId:turn.id,sourceJa:text,spokenKana:ruby.map(x=>x.reading||x.text).join(''),role,speakerId:voices.roles[role].speakerId,category});
  }
 }
 const output=process.argv[2];if(!output)throw Error('Usage: node scripts/dialogue-voice/prepare.cjs /absolute/plan.json');
 fs.writeFileSync(output,JSON.stringify({schemaVersion:1,engine:voices.engine,settings:{speedScale:voices.settings.speedScale,outputSamplingRate:24000,outputStereo:false},credits:Object.values(voices.roles).map(v=>v.credit),unverifiedCategories:[...unverified],rows}));
 console.log(JSON.stringify({scenarios:ids.size,npcLines:rows.length,unverifiedCategories:[...unverified],output}));
})().catch(e=>{console.error(e);process.exit(1)});
