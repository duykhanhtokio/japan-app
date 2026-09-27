import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const audit = JSON.parse(read('docs/jlpt-workspace/conversion/n5-2020-12/original-mock-runtime-audit.json'));
const blueprint = read('src/data/jlpt-mock/n5-blueprint.ts');
const vocabulary = read('src/data/jlpt-mock/n5-test-01-vocabulary.ts');
const rest = read('src/data/jlpt-mock/n5-test-01-rest.ts');
const exam = read('src/data/jlpt-mock/n5-test-01.ts');
const registry = read('src/data/jlpt-mock/sample-exams.ts');
const catalog = read('src/data/jlpt-official/jlpt-exam-catalog.ts');
const runner = read('src/components/jlpt/ApprovedMockExam.tsx');

const callCount = (source, name) => [...source.matchAll(new RegExp(`\\n\\s*${name}\\(`, 'g'))].length;
const blueprintCounts = [...blueprint.matchAll(/questionCount:\s*(\d+)/g)].map((match) => Number(match[1]));

assert.deepEqual(blueprintCounts, audit.problemCounts);
assert.equal(callCount(vocabulary, 'question'), 35);
assert.equal(callCount(rest, 'grammar'), 26);
assert.equal(callCount(rest, 'reading'), 6);
assert.equal(callCount(rest, 'listening'), 24);
assert.deepEqual(audit.counts, { vocabulary: 35, grammarReading: 32, written: 67, listening: 24, total: 91 });
assert.match(vocabulary, /Every item is authored/);
assert.match(exam, /id:\s*'n5-mock-01'/);
assert.match(exam, /\.\.\.N5_TEST_01_VOCABULARY/);
assert.match(exam, /\.\.\.N5_TEST_01_LISTENING/);
assert.match(registry, /N5:\s*balanceCorrectPositions\(N5_TEST_01\)/);
assert.match(catalog, /\['N1', 'N2', 'N3', 'N4', 'N5'\]/);
assert.match(catalog, /id:\s*`\$\{level\.toLowerCase\(\)\}-mock-01`/);
assert.match(runner, /Speech\.speak\(q\.audioScript/);
assert.equal(audit.copyrightDisposition.commercialAssetsUsed, false);
assert.equal(audit.copyrightDisposition.officialDecember2020IdentityClaimed, false);
assert.equal(audit.runtime.catalogId, 'n5-mock-01');

console.log('N5 ORIGINAL MOCK PASS: n5-mock-01 is registered with 67 written and 24 listening responses; listening uses repository-authored scripts through runtime speech; no commercial source asset or official December 2020 identity is used.');
