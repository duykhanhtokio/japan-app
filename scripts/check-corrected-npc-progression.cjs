// Exercise corrected venue completion against the actual progression implementation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { stripTypeScriptTypes } = require('node:module');
const compile = (source) => stripTypeScriptTypes(source, { mode: 'transform' }).replace(/^export /gm, '');
const categoryCode = compile(fs.readFileSync('src/data/npc-progression.ts', 'utf8'));
const categories = new Function(categoryCode + ';return {NPC_CATEGORIES,NPC_TEST_UNLOCK_ALL,normalizeNpcCategory};')();
const originalOrder = ['station','convenience-store','cafe','restaurant','ramen-shop','supermarket','shopping','bank','post-office','government-office','tax-office','hospital','pharmacy','police-station','hotel','izakaya','onsen','amusement-park','museum','landmark','shrine-temple','castle','park','nature','construction-site','laundry'];
assert.deepEqual(categories.NPC_CATEGORIES.slice(0, originalOrder.length).map(x => x.id), originalOrder);
let persisted = JSON.stringify({starterCategoryId:'station',unlockedCategoryIds:['station'],completedScenarioIds:['old-station-scene'],categoryProgress:{station:2},rewardedCategoryIds:[]});
const AsyncStorage = {getItem: async () => persisted, setItem: async (_key,value) => {persisted=value;}};
const serviceSource = fs.readFileSync('src/services/npc-progression-storage.ts','utf8').replace(/^import .+;\r?\n/gm,'');
const api = new Function('AsyncStorage','NPC_CATEGORIES','NPC_TEST_UNLOCK_ALL',compile(serviceSource) + ';return {recordNpcScenario,loadNpcCollection};')(AsyncStorage,categories.NPC_CATEGORIES,categories.NPC_TEST_UNLOCK_ALL);
(async () => {
 const required = ['Bus Terminal','Factory','Workshop','Classroom','Warehouse','Library'];
 const ids = new Set();
 for (const label of required) {
  const category=categories.normalizeNpcCategory(label); assert(category,`Missing reward/progress support: ${label}`);assert(!ids.has(category.id),'Specialist roles must not share progress identity');ids.add(category.id);
  for(let n=1;n<=5;n++) {const id=`corrected-${category.id}-${n}`;const result=await api.recordNpcScenario(id,category.id);assert.equal(result.added,true);assert.equal(result.progress,n);}
  const repeat=await api.recordNpcScenario(`corrected-${category.id}-1`,category.id);assert.equal(repeat.added,false);assert.equal(repeat.progress,5);
 }
 const state=await api.loadNpcCollection();assert.equal(state.categoryProgress.station,2);assert(state.completedScenarioIds.includes('old-station-scene'));assert.equal(state.completedScenarioIds.length,31);
 for(const id of ids){assert.equal(state.categoryProgress[id],5);assert(state.rewardedCategoryIds.includes(id));}
 // Effective corrected categories must be recognized, otherwise the dialogue finish route skips recording.
 const corrections=JSON.parse(fs.readFileSync('src/data/location-role-corrections.json'));let supported=0;
 for(const [locationId,correction] of Object.entries(corrections)) {if(required.includes(correction.category)){assert(categories.normalizeNpcCategory(correction.category),locationId);supported++;}}
 console.log(`CORRECTED NPC PROGRESSION PASS: ${ids.size} independent roles; 30 completions; repeat idempotence; legacy progress preserved; ${supported} effective corrected locations supported.`);
})().catch(error => {console.error(error);process.exitCode=1;});
