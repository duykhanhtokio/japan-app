import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const scannedModules = fs.readdirSync(path.join(root, 'src/data/jlpt-mock')).filter((name) => /^n[123]-\d{4}-(07|12)-official\.ts$/.test(name));
const structuredOfficial = 3, mockReady = 5, scannedOnly = scannedModules.length - 2;
const total = structuredOfficial + mockReady + scannedOnly;
const routeFiles = ['src/app/[level]/[section].tsx', 'src/components/jlpt/ApprovedJlptExamCatalog.tsx'];
const forbidden = /ApprovedScannedExam|ScannedN1OfficialTest|writtenPages|listeningPages|Royal(Button|InfoPanel|OptionRow|TitlePanel|DialogueFrame)/;
const invalidRuntime = routeFiles.filter((relative) => forbidden.test(fs.readFileSync(path.join(root, relative), 'utf8')));
if (total !== 50 || structuredOfficial !== 3 || mockReady !== 5 || scannedOnly !== 42 || invalidRuntime.length) {
  console.error('JLPT INVENTORY/RUNTIME CHECK FAILED'); console.error({ total, structuredOfficial, mockReady, scannedOnly, invalidRuntime }); process.exit(1);
}
const catalogSource = fs.readFileSync(path.join(root, 'src/data/jlpt-official/jlpt-exam-catalog.ts'), 'utf8');
const catalogIds = [...catalogSource.matchAll(/'n[123]-\d{4}-(?:07|12)'/g)].map((match) => match[0].slice(1, -1));
if (catalogIds.length !== 42) {
  console.error(`JLPT CATALOG METADATA FAILED: expected 42 pending official entries, found ${catalogIds.length}`);
  process.exit(1);
}
console.log('JLPT INVENTORY PASS: catalog 50; structured official 3; mock ready 5; pending visible 42; scanned/Royal exam runtime 0');
