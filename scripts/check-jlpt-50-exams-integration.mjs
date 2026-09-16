import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const approvedSource = fs.readFileSync(path.join(root, 'src/data/jlpt-official/approved-n1-exams.ts'), 'utf8');
const catalogSource = fs.readFileSync(path.join(root, 'src/data/jlpt-official/jlpt-exam-catalog.ts'), 'utf8');
const structuredIds = [...approvedSource.matchAll(/id: '(n[123]-\d{4}-(?:07|12)-exam-\d+)'/g)].map((match) => match[1]);
const catalogIds = [...catalogSource.matchAll(/'n[123]-\d{4}-(?:07|12)'/g)].map((match) => match[0].slice(1, -1));
const structuredOfficial = structuredIds.length, mockReady = 5, scannedOnly = catalogIds.length;
const total = structuredOfficial + mockReady + scannedOnly;
const routeFiles = ['src/app/[level]/[section].tsx', 'src/components/jlpt/ApprovedJlptExamCatalog.tsx'];
const forbidden = /ApprovedScannedExam|ScannedN1OfficialTest|writtenPages|listeningPages|Royal(Button|InfoPanel|OptionRow|TitlePanel|DialogueFrame)/;
const invalidRuntime = routeFiles.filter((relative) => forbidden.test(fs.readFileSync(path.join(root, relative), 'utf8')));
const officialPeriods = [...structuredIds.map((id) => id.replace(/-exam-\d+$/, '')), ...catalogIds];
if (total !== 50 || new Set(officialPeriods).size !== 45 || invalidRuntime.length) {
  console.error('JLPT INVENTORY/RUNTIME CHECK FAILED'); console.error({ total, structuredOfficial, mockReady, scannedOnly, invalidRuntime }); process.exit(1);
}
console.log(`JLPT INVENTORY PASS: catalog 50; structured official ${structuredOfficial}; mock ready ${mockReady}; pending visible ${scannedOnly}; scanned/Royal exam runtime 0`);
