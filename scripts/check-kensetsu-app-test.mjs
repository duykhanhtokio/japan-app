import fs from 'node:fs';
import assert from 'node:assert/strict';
const dir='docs/ssw-workspace/kensetsu/';
const sessions=Array.from({length:378},(_,i)=>JSON.parse(fs.readFileSync(dir+`shared-session-${String(i+1).padStart(3,'0')}.json`)));
const weeks=Array.from({length:54},(_,i)=>JSON.parse(fs.readFileSync(dir+`shared-week-${String(i+1).padStart(3,'0')}.json`)));
const runtime=fs.readFileSync('src/data/kensetsu/index.ts','utf8');
const paragraphs=sessions.flatMap(s=>s.clusters.flatMap(c=>c.paragraphs));
assert.equal(paragraphs.length,3771);
for(const [i,s] of sessions.entries()){
 assert(runtime.includes(`import session${String(i+1).padStart(3,'0')}`));
 assert.equal(s.appIntegrationReady,false);assert.equal(s.durationMeasured,false);
 for(const c of s.clusters){assert(c.paragraphs.every(p=>typeof p.ja==='string'&&p.ja.length));if(c.illustration)assert(fs.existsSync(c.illustration.assetPath));}
 for(const a of s.illustrations??[])assert(fs.existsSync(a.path));
}
weeks.forEach((w,i)=>assert.deepEqual(w.sessionIds,sessions.slice(i*7,i*7+7).map(s=>s.id)));
const reader=fs.readFileSync('src/components/kensetsu/KensetsuCourse.tsx','utf8');
assert(reader.includes('!reachedEnd||done'));assert(reader.includes('AsyncStorage.setItem(key'));
assert(reader.includes('completionKey(learner,level,field)'));
assert(!reader.includes('translation===c.id'));assert(reader.includes('kensetsu-reflections'));assert(reader.includes('resizeMode="contain"'));assert(!reader.slice(reader.indexOf('function Reader('),reader.indexOf('function Calendar(')).includes('RoyalContentPanel'));assert(!reader.includes('p.translations'));
assert(fs.readFileSync('src/app/specified-skills/kensetsu.tsx','utf8').includes('if(!__DEV__)'));
const entry=fs.readFileSync('src/app/specified-skills/index.tsx','utf8');assert(entry.includes("'/specified-skills/kensetsu'"));
console.log('KENSETSU APP TEST DATA PASS: 54 weeks / 378 sessions / 3771 paragraphs; shared canonical imports; 3 image files; development gate; native runtime not tested.');
