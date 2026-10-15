import fs from 'node:fs';
import assert from 'node:assert/strict';
const dir='docs/ssw-workspace/kensetsu/';
const sessions=Array.from({length:385},(_,i)=>JSON.parse(fs.readFileSync(dir+`shared-session-${String(i+1).padStart(3,'0')}.json`)));
const weeks=Array.from({length:55},(_,i)=>JSON.parse(fs.readFileSync(dir+`shared-week-${String(i+1).padStart(3,'0')}.json`)));
const runtime=fs.readFileSync('src/data/kensetsu/index.ts','utf8');
const assetPaths=new Set(sessions.flatMap(s=>[...(s.illustrations??[]).map(a=>a.path),...s.clusters.filter(c=>c.illustration).map(c=>c.illustration.assetPath)]));
const assetRegistry=runtime+fs.readFileSync('src/data/kensetsu/weekly-illustrations.ts','utf8');
for(const p of assetPaths){assert(fs.existsSync(p));assert(assetRegistry.includes(p));}
const paragraphs=sessions.flatMap(s=>s.clusters.flatMap(c=>c.paragraphs));
assert.equal(paragraphs.length,3856);
for(const [i,s] of sessions.entries()){
 assert(runtime.includes(`import session${String(i+1).padStart(3,'0')}`));
 assert.equal(s.appIntegrationReady,false);assert.equal(s.durationMeasured,false);
 for(const c of s.clusters){assert(c.paragraphs.every(p=>typeof p.ja==='string'&&p.ja.length));if(c.illustration)assert(fs.existsSync(c.illustration.assetPath));}
 for(const a of s.illustrations??[])assert(fs.existsSync(a.path));
}
weeks.forEach((w,i)=>assert.deepEqual(w.sessionIds,sessions.slice(i*7,i*7+7).map(s=>s.id)));
const reader=fs.readFileSync('src/components/kensetsu/KensetsuCourse.tsx','utf8'),compactReader=reader.replace(/\s+/g,'');
assert(compactReader.includes('!reachedEnd&&!done'));assert(reader.includes('AsyncStorage.setItem(key'));
assert(compactReader.includes('completionKey(learner,level,field)'));
assert(!reader.includes('translation===c.id'));assert(reader.includes('kensetsu-reflections'));assert(reader.includes('resizeMode="contain"'));assert(!reader.slice(reader.indexOf('function Reader('),reader.indexOf('function Calendar(')).includes('RoyalContentPanel'));assert(reader.includes('testID="kensetsu-translation"'));assert(reader.includes('p.translations?.[language]'));assert(reader.includes('kensetsu-week-page'));assert(!reader.includes('kensetsu-resume'));
assert(fs.readFileSync('src/app/specified-skills/kensetsu.tsx','utf8').includes('if(!__DEV__)'));
const entry=fs.readFileSync('src/app/specified-skills/index.tsx','utf8');assert(/["']\/specified-skills\/kensetsu["']/.test(entry));
console.log(`KENSETSU APP TEST DATA PASS: 55 weeks / 385 sessions / 3856 paragraphs; ${assetPaths.size} image files registered; development gate; native runtime not tested.`);
