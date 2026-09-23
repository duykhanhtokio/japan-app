import fs from 'node:fs';

const metadata = fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts', 'utf8');
const registry = fs.readFileSync('src/data/jlpt-official/approved-n1-exams.ts', 'utf8');
const structured = [...registry.matchAll(/id: '(n[1-5]-\d{4}-(?:07|12)-exam-\d+)'/g)].map((match) => match[1]);
const pending = [...metadata.matchAll(/'n([1-5])-(\d{4})-(07|12)'/g)].map((match) => `n${match[1]}-${match[2]}-${match[3]}`);
const counts = { N1: 0, N2: 0, N3: 0, N4: 0, N5: 0 };
for (const id of [...structured, ...pending]) counts[id.slice(0, 2).toUpperCase()] += 1;
const mocks = ['N1', 'N2', 'N3', 'N4', 'N5'];
const allIds = [...structured, ...pending, ...mocks.map((level) => `${level.toLowerCase()}-mock-01`)];
const failures = [];
const officialPeriods = [...structured.map((id) => id.replace(/-exam-\d+$/, '')), ...pending];
if (new Set(officialPeriods).size !== officialPeriods.length) failures.push('same official period appears more than once');
const expectedN4 = ['n4-2011-12','n4-2012-12','n4-2013-07','n4-2013-12','n4-2014-07','n4-2017-07','n4-2018-07','n4-2021-07','n4-2021-12'];
const actualN4 = officialPeriods.filter((id) => id.startsWith('n4-')).sort();
const expectedN5 = ['n5-2011-12','n5-2012-12','n5-2013-07','n5-2017-07','n5-2018-12','n5-2020-12','n5-2021-12'];
const actualN5 = officialPeriods.filter((id) => id.startsWith('n5-')).sort();
if (allIds.length !== 66) failures.push(`catalogTotal expected 66, found ${allIds.length}`);
if (new Set(allIds).size !== allIds.length) failures.push('duplicate exam IDs found');
if (counts.N1 !== 15 || counts.N2 !== 13 || counts.N3 !== 17 || counts.N4 !== 9 || counts.N5 !== 7) failures.push(`official counts invalid: ${JSON.stringify(counts)}`);
if (JSON.stringify(actualN4) !== JSON.stringify(expectedN4)) failures.push(`N4 periods invalid: ${JSON.stringify(actualN4)}`);
if (JSON.stringify(actualN5) !== JSON.stringify(expectedN5)) failures.push(`N5 periods invalid: ${JSON.stringify(actualN5)}`);
for (const level of mocks) if (!metadata.includes(`'${level}'`)) failures.push(`mock registry level missing for ${level}`);
if (failures.length) { console.error('JLPT CATALOG COMPLETENESS FAILED'); failures.forEach((item) => console.error(`- ${item}`)); process.exit(1); }
console.log('JLPT CATALOG COMPLETENESS PASS: 66 entries = N1 official 15 + N2 official 13 + N3 official 17 + N4 official 9 + N5 official candidates 7 + mocks 5.');
