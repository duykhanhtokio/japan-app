const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
function load(file, assets = false, dependencies = {}) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(code, { module: mod, exports: mod.exports, require: name => {
    if (name in dependencies) return dependencies[name];
    if (assets) return path.resolve(path.dirname(path.join(root, file)), name);
    if (name.startsWith('@/data/')) return read('src/data/' + name.slice(7));
    throw new Error('Unexpected dependency: ' + name);
  }, Map, Set, Object, Array, Math, console });
  return mod.exports;
}
const repository = load('src/services/life-content-repository.ts');
const artwork = load('src/components/world/life-assets.ts', true);
const categories = load('src/data/npc-progression.ts').NPC_CATEGORIES;
const backgrounds = load('src/components/world/location-backgrounds.generated.ts', true, { './life-assets': artwork, '@/data/location-background-assignment.json': read('src/data/location-background-assignment.json') });
const cards = load('src/components/world/npc-card-assets.ts', true).npcCardById;
const raw = read('src/data/generated/locations.json');
const corrections = read('src/data/location-role-corrections.json');
const identities = new Map();
const hashes = new Map();
for (const item of raw) {
  const location = repository.getLifeLocationById(item.id);
  assert(location, 'Missing location ' + item.id);
  assert.equal(location.cityId, item.cityId);
  assert.equal(location.nameJa, item.nameJa);
  assert.equal(location.category, corrections[item.id]?.category ?? item.category);
  const npc = artwork.npcForCategory(location.category);
  const slug = artwork.categoryAssetKey(location.category);
  assert.equal(path.basename(npc), slug + '.png', 'Wrong NPC for ' + location.id);
  assert(fs.existsSync(npc));
  if (!hashes.has(npc)) hashes.set(npc, require('node:crypto').createHash('sha256').update(fs.readFileSync(npc)).digest('hex'));
  const digest = hashes.get(npc);
  if (identities.has(digest)) assert.equal(identities.get(digest), slug, 'Cross-role duplicated NPC');
  identities.set(digest, slug);
  if (corrections[item.id]) assert.equal(location.npcJob, corrections[item.id].npcJob);
}
for (const id of Object.keys(corrections)) assert(raw.some(location => location.id === id), 'Stale correction ' + id);
// Historical bank buildings remain landmarks rather than active banking counters.
assert.equal(repository.getLifeLocationById('LOC-003-11').category, 'Landmark');
for (const role of categories) {
  assert(fs.existsSync(cards[role.id]), 'Missing collectible card ' + role.id);
  const scene = artwork.sceneForCategory(role.category);
  assert.equal(path.basename(path.dirname(scene)), artwork.categoryAssetKey(role.category));
}
const laundries = raw.filter(location => location.nameJa.includes('コインランドリー'));
assert.equal(laundries.length, 9);
for (const location of laundries) {
  const corrected = repository.getLifeLocationById(location.id);
  assert.equal(corrected.category, 'Laundry');
  assert.equal(corrected.npcJob, 'Laundry Attendant');
  assert.equal(backgrounds.locationBackground(location.id, corrected.category), artwork.sceneForCategory('Laundry'));
}
assert.notEqual(artwork.npcForCategory('Convenience Store'), artwork.npcForCategory('Supermarket'));
console.log(`LOCATION NPC ROLE PASS: ${raw.length} locations, ${Object.keys(corrections).length} corrected roles, ${identities.size} distinct NPC categories; stable city/IDs, no cross-role image reuse.`);
