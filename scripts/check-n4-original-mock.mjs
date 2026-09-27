import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const audit = JSON.parse(read('docs/jlpt-workspace/conversion/n4-2018-07/original-mock-runtime-audit.json'));
const structure = read('src/data/jlpt-mock/official-structure.ts');
const factory = read('src/data/jlpt-mock/sample-exam-factory.ts');
const authored = read('src/data/jlpt-mock/other-level-authored-content.ts');
const registry = read('src/data/jlpt-mock/sample-exams.ts');
const catalog = read('src/data/jlpt-official/jlpt-exam-catalog.ts');
const runner = read('src/components/jlpt/ApprovedMockExam.tsx');

const n4Structure = structure.match(/N4:\s*\[(.*?)\],\n\s*N5:/s)?.[1];
assert.ok(n4Structure, 'N4 structure missing');
const counts = [...n4Structure.matchAll(/p\('[^']+','[^']+',\s*(\d+)/g)].map((match) => Number(match[1]));
assert.deepEqual(counts, audit.problemCounts);
assert.equal(counts.slice(0, 11).reduce((sum, count) => sum + count, 0), 70);
assert.equal(counts.slice(11).reduce((sum, count) => sum + count, 0), 28);
assert.equal(counts.reduce((sum, count) => sum + count, 0), 98);
assert.deepEqual(audit.counts, { vocabulary: 35, grammarReading: 35, written: 70, listening: 28, total: 98 });
assert.match(factory, /return\{id:`\$\{level\.toLowerCase\(\)\}-mock-01`/);
assert.match(authored, /N4:\[/);
assert.match(registry, /N4:\s*balanceCorrectPositions\(buildSampleExam\('N4'\)\)/);
assert.match(catalog, /id:\s*`\$\{level\.toLowerCase\(\)\}-mock-01`/);
assert.match(runner, /Speech\.speak\(q\.audioScript/);
assert.equal(audit.copyrightDisposition.thirdPartyExamAssetsUsed, false);
assert.equal(audit.copyrightDisposition.officialJuly2018IdentityClaimed, false);
assert.equal(audit.runtime.catalogId, 'n4-mock-01');

console.log('N4 ORIGINAL MOCK PASS: n4-mock-01 is registered with 70 written and 28 listening responses; listening uses repository-authored scripts through runtime speech; no July 2018 or mislabeled-workbook asset is used.');
