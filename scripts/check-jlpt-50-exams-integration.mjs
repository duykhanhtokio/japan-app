import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const approvedSource = fs.readFileSync(path.join(root, 'src/data/jlpt-official/approved-n1-exams.ts'), 'utf8');
const catalogSource = fs.readFileSync(path.join(root, 'src/data/jlpt-official/jlpt-exam-catalog.ts'), 'utf8');
const structuredIds = [...approvedSource.matchAll(/id: '(n[1-5]-\d{4}-(?:07|12)-exam-\d+)'/g)].map((match) => match[1]);
const catalogIds = [...catalogSource.matchAll(/'n[1-5]-\d{4}-(?:07|12)'/g)].map((match) => match[0].slice(1, -1));
const structuredOfficial = structuredIds.length, mockReady = 5, scannedOnly = catalogIds.length;
const total = structuredOfficial + mockReady + scannedOnly;
const routeFiles = ['src/app/[level]/[section].tsx', 'src/components/jlpt/ApprovedJlptExamCatalog.tsx'];
const forbidden = /ApprovedScannedExam|ScannedN1OfficialTest|writtenPages|listeningPages|Royal(Button|InfoPanel|OptionRow|TitlePanel|DialogueFrame)/;
const invalidRuntime = routeFiles.filter((relative) => forbidden.test(fs.readFileSync(path.join(root, relative), 'utf8')));
const officialPeriods = [...structuredIds.map((id) => id.replace(/-exam-\d+$/, '')), ...catalogIds];
const expectedN4 = ['n4-2011-12','n4-2012-12','n4-2013-07','n4-2013-12','n4-2014-07','n4-2017-07','n4-2018-07','n4-2021-07','n4-2021-12'];
const actualN4 = officialPeriods.filter((id) => id.startsWith('n4-')).sort();
const expectedN5 = ['n5-2011-12','n5-2012-12','n5-2013-07','n5-2017-07','n5-2018-12','n5-2020-12','n5-2021-12'];
const actualN5 = officialPeriods.filter((id) => id.startsWith('n5-')).sort();
if (total !== 66 || new Set(officialPeriods).size !== 61 || JSON.stringify(actualN4) !== JSON.stringify(expectedN4) || JSON.stringify(actualN5) !== JSON.stringify(expectedN5) || invalidRuntime.length) {
  console.error('JLPT INVENTORY/RUNTIME CHECK FAILED'); console.error({ total, structuredOfficial, mockReady, scannedOnly, invalidRuntime }); process.exit(1);
}
console.log(`JLPT INVENTORY PASS: catalog 66; structured official ${structuredOfficial}; mock ready ${mockReady}; pending visible ${scannedOnly}; exact N4 periods 9; exact N5 candidate periods 7; scanned/Royal exam runtime 0`);
