#!/usr/bin/env node
'use strict';
// Read-only by default. Generates a report only when --out <path> is supplied.
// Uses canonical repository relations rather than parsing scenario filenames.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const cities = read('src/data/generated/cities.json');
const locationCities = read('src/data/generated/life-on-demand/location-cities.json');
const scenarioLocations = read('src/data/generated/life-on-demand/scenario-locations.json');
const dialogueDir = path.join(root, 'src/data/generated/dialogues');
const regionFor = n => n === 1 ? 'hokkaido' : n <= 7 ? 'tohoku' : n <= 14 ? 'kanto' : n <= 23 ? 'chubu' : n <= 30 ? 'kansai' : n <= 35 ? 'chugoku' : n <= 39 ? 'shikoku' : n <= 47 ? 'kyushu' : null;
const prefectureNumber = id => {
  const match = /^PRF-(\\d{1,2})$/.exec(id || '');
  return match ? Number(match[1]) : null;
};
const cityById = new Map(cities.map(c => [c.id, c]));
const issues = [];
const regionCounts = {};
const prefectureCounts = {};
const mapping = {};
for (const [scenarioId, locationId] of Object.entries(scenarioLocations)) {
  const cityId = locationCities[locationId];
  const city = cityById.get(cityId);
  const number = prefectureNumber(city?.prefectureId);
  const regionId = number === null ? null : regionFor(number);
  if (!cityId || !city || !regionId) {
    issues.push({scenarioId, locationId, cityId: cityId || null, prefectureId: city?.prefectureId || null, reason:'unresolved-geography'});
    continue;
  }
  mapping[scenarioId] = {regionId, prefectureId:city.prefectureId, cityId, locationId};
  regionCounts[regionId] = (regionCounts[regionId] || 0) + 1;
  prefectureCounts[city.prefectureId] = (prefectureCounts[city.prefectureId] || 0) + 1;
}
const dialogueFiles = fs.readdirSync(dialogueDir).filter(n => n.endsWith('.json'));
const genericFiles = dialogueFiles.filter(n => n.startsWith('GENERIC-CITY-'));
const missingDirect = dialogueFiles.filter(n => !n.startsWith('GENERIC-CITY-') && !mapping[n.slice(0,-5)]);
const report = {
  schemaVersion:1,
  totalCities:cities.length,
  indexedScenarios:Object.keys(scenarioLocations).length,
  mappedScenarios:Object.keys(mapping).length,
  dialogueFileCount:dialogueFiles.length,
  genericDialogueFiles:genericFiles.length,
  directDialogueFilesWithoutScenarioIndex:missingDirect,
  unresolvedGeography:issues,
  regionCounts,
  prefectureCounts,
  note:'Inventory only. Generic fallback, non-dialogue scenarios, and locale batches require separate coverage checks before switching loaders.'
};
const args = process.argv.slice(2);
if (args.length === 2 && args[0] === '--out') {
  const out = path.resolve(args[1]);
  fs.mkdirSync(path.dirname(out), {recursive:true});
  fs.writeFileSync(out, JSON.stringify({ ...report, mapping }, null, 2) + '\n');
  console.log('Wrote:', out);
} else if (args.length !== 0) {
  console.error('Usage: node scripts/geo/geo-inventory.cjs [--out path]');
  process.exit(2);
}
console.log(JSON.stringify({...report, directDialogueFilesWithoutScenarioIndex:missingDirect.slice(0,20), unresolvedGeography:issues.slice(0,20)}, null, 2));
if (issues.length || missingDirect.length) {
  console.error('Audit has unresolved records; do not switch runtime loader.');
  process.exitCode = 1;
}
