/* global __dirname */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const locations = read('src/data/generated/locations.json');
const cities = read('src/data/generated/cities.json');
const corrections = read('src/data/location-role-corrections.json');
const places = read('src/data/location-place-artwork.json');
// A restaurant category can also contain a famous restaurant district.
const characteristicName = /横丁|商店街|市場|居酒屋街|通り|道頓堀|すすきの|中華街|温泉郷|温泉街/;
const uniqueCategories = new Set(['Landmark', 'Castle', 'Shrine / Temple', 'Nature', 'Park', 'Amusement Park']);
const sharedCategories = new Set(['Restaurant', 'Cafe', 'Laundry', 'Convenience Store', 'Ramen Shop', 'Izakaya', 'Bank', 'Hospital', 'Supermarket', 'Post Office', 'Police Station', 'Government Office', 'Tax Office', 'Construction Site', 'Hotel']);
const byCity = new Map(cities.map(city => [city.id, { cityId: city.id, nameJa: city.nameJa, locations: [] }]));
for (const location of locations) {
  const city = byCity.get(location.cityId);
  if (!city) throw new Error('Unknown city: ' + location.id);
  const category = corrections[location.id]?.category ?? location.category;
  const mode = characteristicName.test(location.nameJa) || uniqueCategories.has(category)
    ? 'place-specific' : sharedCategories.has(category) ? 'shared-service' : 'needs-individual-review';
  const artwork = places[location.id];
  if (artwork && (artwork.cityId !== location.cityId || artwork.nameJa !== location.nameJa || artwork.category !== category)) {
    throw new Error('Stale place identity: ' + location.id);
  }
  city.locations.push({ id: location.id, nameJa: location.nameJa, category, mode,
    status: artwork ? 'place-artwork-integrated' : mode === 'shared-service' ? 'shared-service-permitted' : 'pending-geographic-review',
    ...(artwork ? { asset: artwork.asset, reference: artwork.reference } : {}) });
}
const rows = [...byCity.values()].sort((a, b) => a.cityId.localeCompare(b.cityId));
const counts = locations.reduce((result, location) => {
  const row = byCity.get(location.cityId).locations.find(row => row.id === location.id);
  result[row.status] = (result[row.status] ?? 0) + 1;
  return result;
}, {});
const report = { policy: 'Shared service interiors are permitted; named districts and geographic attractions require individual verification. Pending rows are never counted as complete.', cityCount: rows.length, locationCount: locations.length, counts, cities: rows };
const target = path.join(root, 'docs/checkpoints/LOCATION_CITY_REVIEW_2026-10-06.json');
if (process.argv.includes('--write')) fs.writeFileSync(target, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ cityCount: rows.length, locationCount: locations.length, counts }));
if (process.argv.includes('--require-complete') && counts['pending-geographic-review']) process.exitCode = 1;
