import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const locked = new Map([
  ['src/app/[level]/[section].tsx', '4a4e0e1da02cb5b08d8e2309a441a9746c22dab280c97e0097ca32898b0d74c1'],
  ['src/components/jlpt/N1OfficialTrial.tsx', 'c43d0822cf0d6c0f054c2f84cdfca080c2ef0d8e928a6e7be9a701d3fd12c255'],
  ['src/components/jlpt/N1ExamPicker.tsx', '6c8676b97d12d3da6fe36f5fde28adb1833bcb7208628c00dc61f1b9c5c55098'],
  ['src/components/jlpt/ui/JlptExamUI.tsx', '0ecea5a9f733d8d076bde7b7c1ea75be692255aae55e4447da3121ae06aec6cc'],
  ['src/services/jlpt-trial-session-storage.ts', 'ea21a8b371feeea3453cd10c5247bcb072c92f2ef5b4c5309d83df3392d1d7e1'],
  ['src/theme/jlpt-exam-design-system.ts', '9d8276e32e5b1b25485d84cbe961acd5cbca5b106ee2dd95e6fbaadd9d2b9bb7'],
  ['src/components/jlpt/ApprovedJlptExamCatalog.tsx', '9ce47495e0a27d996a1a724a4994529f465b25b7382a9f5c8a57ce1d461c8636'],
  ['src/components/jlpt/ApprovedScannedExam.tsx', 'efa9b3abdcd3097b96415ecf731fe1400433dbdd53e38b606d3a6324aba728a9'],
  ['src/components/jlpt/ApprovedMockExam.tsx', '101daaf3d0867f773e5eaef560d13d7e0532a4e62bc5f0036cd59c0b12175fdb'],
  ['src/data/jlpt-official/approved-scanned-exams.generated.ts', '1e7baa59e6939929a46487fd9d91915217f1c7c2ba322f94c2ba72d93ecac0aa'],
]);

let failed = false;
for (const [relativePath, expected] of locked) {
  try {
    const bytes = await readFile(path.join(root, relativePath));
    const actual = createHash('sha256').update(bytes).digest('hex');
    if (actual !== expected) {
      failed = true;
      console.error(`JLPT UI LOCK FAILED: ${relativePath}`);
      console.error(`  expected ${expected}`);
      console.error(`  actual   ${actual}`);
    }
  } catch (error) {
    failed = true;
    console.error(`JLPT UI LOCK FAILED: cannot read ${relativePath}`);
    console.error(`  ${error instanceof Error ? error.message : String(error)}`);
  }
}

const registryFiles = [
  'src/data/jlpt-official/approved-n1-exams.ts',
  'src/data/jlpt-official/jlpt-exam-catalog.ts',
];
const registrySources = new Map();
for (const relativePath of registryFiles) {
  try {
    registrySources.set(relativePath, await readFile(path.join(root, relativePath), 'utf8'));
  } catch (error) {
    failed = true;
    console.error(`JLPT REGISTRY CHECK FAILED: cannot read ${relativePath}`);
    console.error(`  ${error instanceof Error ? error.message : String(error)}`);
  }
}

const approved = registrySources.get(registryFiles[0]) ?? '';
const catalog = registrySources.get(registryFiles[1]) ?? '';
const forbiddenRuntime = /Royal(?:Button|InfoPanel|OptionRow|TitlePanel|DialogueFrame)|ApprovedScannedExam|ScannedN1OfficialTest|writtenPages|listeningPages|scriptPages/;
const requiredApprovedIds = ['n1-2012-07-exam-01', 'n1-2012-12-exam-02'];
for (const id of requiredApprovedIds) {
  if (!approved.includes(`id: '${id}'`)) {
    failed = true;
    console.error(`JLPT REGISTRY CHECK FAILED: approved exam removed: ${id}`);
  }
}
if (forbiddenRuntime.test(approved) || forbiddenRuntime.test(catalog)) {
  failed = true;
  console.error('JLPT REGISTRY CHECK FAILED: Royal/scanned-page runtime token detected.');
}
const pendingIds = [...catalog.matchAll(/'n[1-5]-\d{4}-(?:07|12)'/g)].map((match) => match[0].slice(1, -1));
if (new Set(pendingIds).size !== pendingIds.length) {
  failed = true;
  console.error('JLPT REGISTRY CHECK FAILED: duplicate pending exam ID.');
}
const structuredIds = [...approved.matchAll(/id: '(n[1-5]-\d{4}-(?:07|12)-exam-\d+)'/g)].map((match) => match[1]);
if (new Set(structuredIds).size !== structuredIds.length) {
  failed = true;
  console.error('JLPT REGISTRY CHECK FAILED: duplicate structured exam ID.');
}
const expectedN4 = ['n4-2011-12','n4-2012-12','n4-2013-07','n4-2013-12','n4-2014-07','n4-2017-07','n4-2018-07','n4-2021-07','n4-2021-12'];
const expectedN5 = ['n5-2011-12','n5-2012-12','n5-2013-07','n5-2017-07','n5-2018-12','n5-2020-12','n5-2021-12'];
const officialPeriods = [...structuredIds.map((id) => id.replace(/-exam-\d+$/, '')), ...pendingIds];
const actualN4 = officialPeriods.filter((id) => id.startsWith('n4-')).sort();
const actualN5 = officialPeriods.filter((id) => id.startsWith('n5-')).sort();
if (structuredIds.length + pendingIds.length + 5 !== 66) {
  failed = true;
  console.error(`JLPT REGISTRY CHECK FAILED: expected 66 total entries, found ${structuredIds.length + pendingIds.length + 5}.`);
}
if (JSON.stringify(actualN4) !== JSON.stringify(expectedN4)) {
  failed = true;
  console.error(`JLPT REGISTRY CHECK FAILED: exact N4 period set is invalid: ${JSON.stringify(actualN4)}.`);
}
if (JSON.stringify(actualN5) !== JSON.stringify(expectedN5)) {
  console.error(`JLPT REGISTRY CHECK FAILED: exact N5 period set is invalid: ${JSON.stringify(actualN5)}.`);
  process.exit(1);
}

if (failed) {
  console.error('STOP: approved JLPT UI changed. Restore the checkpoint or obtain explicit user approval.');
  process.exit(1);
}

console.log(`JLPT APPROVED UI LOCK PASS: ${locked.size}/${locked.size} byte-locked files match; registries satisfy structural policy.`);
