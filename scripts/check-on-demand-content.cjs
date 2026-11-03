const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process'),esbuild=require('esbuild');
const root=path.resolve(__dirname,'..'),entry='src/services/life-content-repository.ts';
function runtime(baseline){
 const cache=new Map(),jsonLoads=[];
 function load(file){
  if(cache.has(file))return cache.get(file).exports;
  const box={exports:{}};cache.set(file,box);
  if(file.endsWith('.json')){const bytes=fs.readFileSync(file);jsonLoads.push({path:path.relative(root,file),bytes:bytes.length});box.exports=JSON.parse(bytes);return box.exports;}
  const source=baseline&&file===path.join(root,entry)?execFileSync('git',['show',`${baseline}:${entry}`],{cwd:root,encoding:'utf8'}):fs.readFileSync(file,'utf8');
  const js=esbuild.transformSync(source,{loader:'ts',format:'cjs'}).code;
  const localRequire=id=>{const p=id.startsWith('@/')?path.join(root,'src',id.slice(2)):path.resolve(path.dirname(file),id);const target=[p,p+'.ts',p+'.json',path.join(p,'index.ts')].find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());assert(target,`Unresolved ${id}`);return load(target);};
  vm.runInThisContext(`(function(module,exports,require){${js}\n})`,{filename:file})(box,box.exports,localRequire);return box.exports;
 }
 return {api:load(path.join(root,entry)),jsonLoads};
}
const baseline=process.env.ON_DEMAND_BASE_REF||'126c53d76733ca80a105d3e8b1b812f531148f0b';
const revisions=JSON.parse(fs.readFileSync(path.join(root,'src/data/generated/life-on-demand/input-revisions.json')));
for(const input of revisions.inputs)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,input.path))).digest('hex'),input.sha256,`Rebuild on-demand content after editing ${input.path}`);
const lazy=runtime();assert.equal(lazy.jsonLoads.length,0,'Import must evaluate zero curriculum JSON');
const old=runtime(baseline),api=lazy.api,original=old.api,all=original.getAllLifeCities();
assert.deepEqual(api.getAllLifeCities(),all);assert.deepEqual(lazy.jsonLoads.map(x=>x.path),['src/data/generated/cities.json']);
const first=all.find(c=>original.getLifeLocationsByCity(c.id).length);api.getLifeDialogueCountByCity(first.id);api.getLifeScenarioCountByCity(first.id);api.getLifeLocationCountByCity(first.id);
assert(!lazy.jsonLoads.some(x=>/scenarios-\d|locations-\d/.test(x.path)),'City totals must not load location/scenario bodies');
const locations=api.getLifeLocationsByCity(first.id);assert.equal(lazy.jsonLoads.filter(x=>/locations-\d/.test(x.path)).length,1);assert(!lazy.jsonLoads.some(x=>/scenarios-\d/.test(x.path)));
const firstLocation=locations.find(l=>original.getLifeScenariosByLocation(l.id).length);api.getLifeAvailableScenarioCountByLocation(firstLocation.id);assert(!lazy.jsonLoads.some(x=>/scenarios-\d/.test(x.path)),'Location card counts must not load scenario bodies');const scenarios=api.getLifeScenariosByLocation(firstLocation.id);
assert.equal(lazy.jsonLoads.filter(x=>/scenarios-\d/.test(x.path)).length,1);assert.strictEqual(api.getLifeScenarioById(scenarios[0].id),scenarios[0]);assert.strictEqual(api.getLifeLocationById(firstLocation.id),firstLocation);
const selectedBytes=lazy.jsonLoads.reduce((n,x)=>n+x.bytes,0),eagerBytes=old.jsonLoads.reduce((n,x)=>n+x.bytes,0);
assert(selectedBytes<eagerBytes/3,'A selected city/location must stay bounded');
let locationCount=0,scenarioCount=0;
for(const city of all){assert.deepEqual(api.getLifeCityById(city.id),original.getLifeCityById(city.id));assert.deepEqual(api.getLifeCitiesByPrefecture(city.prefectureId),original.getLifeCitiesByPrefecture(city.prefectureId));assert.equal(api.getLifeDialogueCountByCity(city.id),original.getLifeDialogueCountByCity(city.id));assert.equal(api.getLifeScenarioCountByCity(city.id),original.getLifeScenarioCountByCity(city.id));const rows=original.getLifeLocationsByCity(city.id);assert.equal(api.getLifeLocationCountByCity(city.id),rows.length);assert.deepEqual(api.getLifeLocationsByCity(city.id),rows);for(const l of rows){locationCount++;assert.equal(api.getLifeAvailableScenarioCountByLocation(l.id),original.getLifeScenariosByLocation(l.id).filter(s=>original.hasLifeDialogue(s.id)).length);assert.deepEqual(api.getLifeLocationById(l.id),l);const values=original.getLifeScenariosByLocation(l.id);assert.deepEqual(api.getLifeScenariosByLocation(l.id),values);for(const s of values){scenarioCount++;assert.deepEqual(api.getLifeScenarioById(s.id),s);assert.deepEqual(api.getLifeScenarioIndex(s.id),original.getLifeScenarioIndex(s.id));assert.equal(api.hasLifeDialogue(s.id),original.hasLifeDialogue(s.id));}}}
const indexIds=new Set([...Object.keys(require('../src/data/generated/scenario-index.json')),...Object.keys(require('../src/data/dialogue-content/scenario-index-overrides.json'))]);for(const id of indexIds)assert.deepEqual(api.getLifeScenarioIndex(id),original.getLifeScenarioIndex(id));
for(const id of ['missing-on-demand-id','','__proto__','constructor']){assert.deepEqual(api.getLifeLocationsByCity(id),original.getLifeLocationsByCity(id));assert.deepEqual(api.getLifeScenariosByLocation(id),original.getLifeScenariosByLocation(id));assert.equal(api.getLifeLocationById(id),null);assert.equal(api.getLifeScenarioById(id),null);}
const report={status:'PASS_ON_DEMAND_CONTENT',baseline,importedCurriculumJsonFiles:0,cities:all.length,locations:locationCount,scenarios:scenarioCount,indexEntries:indexIds.size,selectedCityLocationJsonBytes:selectedBytes,previousEagerJsonBytes:eagerBytes,allPublicValuesAndOrderingPreserved:true,cacheIdentityPreserved:true,deviceStartupMeasured:false};
if(process.env.ON_DEMAND_REPORT)fs.writeFileSync(process.env.ON_DEMAND_REPORT,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
