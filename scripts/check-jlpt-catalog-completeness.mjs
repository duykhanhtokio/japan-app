import fs from 'node:fs';

const metadata = fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts', 'utf8');
const registry = fs.readFileSync('src/data/jlpt-official/approved-n1-exams.ts', 'utf8');
const structured = [...registry.matchAll(/id: '(n[123]-\d{4}-(?:07|12)-exam-\d+)'/g)].map((match) => match[1]);
const pending = [...metadata.matchAll(/'n([123])-(\d{4})-(07|12)'/g)].map((match) => `n${match[1]}-${match[2]}-${match[3]}`);
const counts = { N1: 0, N2: 0, N3: 0, N4: 0, N5: 0 };
for (const id of [...structured, ...pending]) counts[id.slice(0, 2).toUpperCase()] += 1;
const mocks = ['N1', 'N2', 'N3', 'N4', 'N5'];
const allIds = [...structured, ...pending, ...mocks.map((level) => `${level.toLowerCase()}-mock-01`)];
const failures = [];
const officialPeriods = [...structured.map((id) => id.replace(/-exam-\d+$/, '')), ...pending];
if (new Set(officialPeriods).size !== officialPeriods.length) failures.push('same official period appears more than once');
if (allIds.length !== 50) failures.push(`catalogTotal expected 50, found ${allIds.length}`);
if (new Set(allIds).size !== allIds.length) failures.push('duplicate exam IDs found');
if (counts.N1 !== 15 || counts.N2 !== 13 || counts.N3 !== 17) failures.push(`official counts invalid: ${JSON.stringify(counts)}`);
for (const level of mocks) if (!metadata.includes(`'${level}'`)) failures.push(`mock registry level missing for ${level}`);
if (failures.length) { console.error('JLPT CATALOG COMPLETENESS FAILED'); failures.forEach((item) => console.error(`- ${item}`)); process.exit(1); }
console.log('JLPT CATALOG COMPLETENESS PASS: 50 entries = N1 official 15 + N2 official 13 + N3 official 17 + mocks 5.');
