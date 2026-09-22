import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const approvedSource = fs.readFileSync(path.join(root, 'src/data/jlpt-official/approved-n1-exams.ts'), 'utf8');
const catalogSource = fs.readFileSync(path.join(root, 'src/data/jlpt-official/jlpt-exam-catalog.ts'), 'utf8');
const structuredIds = [...approvedSource.matchAll(/id: '(n[1-4]-\d{4}-(?:07|12)-exam-\d+)'/g)].map((match) => match[1]);
const catalogIds = [...catalogSource.matchAll(/'n[1-4]-\d{4}-(?:07|12)'/g)].map((match) => match[0].slice(1, -1));
const structuredOfficial = structuredIds.length, mockReady = 5, scannedOnly = catalogIds.length;
const total = structuredOfficial + mockReady + scannedOnly;
const routeFiles = ['src/app/[level]/[section].tsx', 'src/components/jlpt/ApprovedJlptExamCatalog.tsx'];
const forbidden = /ApprovedScannedExam|ScannedN1OfficialTest|writtenPages|listeningPages|Royal(Button|InfoPanel|OptionRow|TitlePanel|DialogueFrame)/;
const invalidRuntime = routeFiles.filter((relative) => forbidden.test(fs.readFileSync(path.join(root, relative), 'utf8')));
const officialPeriods = [...structuredIds.map((id) => id.replace(/-exam-\d+$/, '')), ...catalogIds];
const expectedN4 = ['n4-2011-12','n4-2012-12','n4-2013-07','n4-2013-12','n4-2014-07','n4-2017-07','n4-2018-07','n4-2021-07','n4-2021-12'];
const actualN4 = officialPeriods.filter((id) => id.startsWith('n4-')).sort();
if (total !== 59 || new Set(officialPeriods).size !== 54 || JSON.stringify(actualN4) !== JSON.stringify(expectedN4) || invalidRuntime.length) {
  console.error('JLPT INVENTORY/RUNTIME CHECK FAILED'); console.error({ total, structuredOfficial, mockReady, scannedOnly, invalidRuntime }); process.exit(1);
}
console.log(`JLPT INVENTORY PASS: catalog 59; structured official ${structuredOfficial}; mock ready ${mockReady}; pending visible ${scannedOnly}; exact N4 periods 9; scanned/Royal exam runtime 0`);
