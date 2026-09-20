import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const reviewPaths = [
  'docs/jlpt-workspace/conversion/n1-2015-12/written-page-02.review.json',
  'docs/jlpt-workspace/conversion/n1-2015-12/written-page-03.review.json',
];
const questionPaths = [
  'assets/jlpt/n1/2015-12/question/page-02.jpg',
  'assets/jlpt/n1/2015-12/question/page-03.jpg',
];
const answerPath = 'assets/jlpt/n1/2015-12/answer-script/page-01.jpg';
const sourcePath = 'src/data/jlpt-mock/n1-2015-12-official.ts';
const expectedHashes = new Map([
  [questionPaths[0], 'c5318f40788403c0525c1de2670c8ba6f71efae6b2f77c7d82ccf9b6fe027085'],
  [questionPaths[1], '96ea603c719feb91d99a2a36be112fd42824d796b98a070019f25c1c624ec429'],
  [answerPath, '36857fcd2d5987b0ce37b4dbab1dfd95e957a57552c542bb379291ef62b88529'],
  [sourcePath, '817145cefd066d55fe4edcf1fa8fe5cf430a93a3fb4a3a3434ba37a47bb6127b'],
]);
const expectedKeys = [1, 2, 3, 4, 2, 1, 1, 3, 1, 2, 2, 4, 3, 4, 1, 2, 3, 4, 3, 4, 2, 3, 2, 1, 4, 1, 4, 1, 3];

const fail = message => {
  throw new Error(`N1 2015-12 RECOVERY FAIL: ${message}`);
};

for (const [path, expected] of expectedHashes) {
  const actual = createHash('sha256').update(await readFile(path)).digest('hex');
  if (actual !== expected) fail(`${path} SHA-256 ${actual} != ${expected}`);
}

const recordsByPage = await Promise.all(reviewPaths.map(async path => JSON.parse(await readFile(path, 'utf8'))));
if (!Array.isArray(recordsByPage[0]) || recordsByPage[0].length !== 19) fail(`expected 19 page-02 records, found ${recordsByPage[0]?.length}`);
if (!Array.isArray(recordsByPage[1]) || recordsByPage[1].length !== 10) fail(`expected 10 page-03 records, found ${recordsByPage[1]?.length}`);
const records = recordsByPage.flat();

const ids = new Set();
for (let index = 0; index < records.length; index += 1) {
  const record = records[index];
  const questionNumber = index + 1;
  if (record.questionNumber !== questionNumber) fail(`record ${index} has questionNumber ${record.questionNumber}`);
  if (ids.has(record.questionNumber)) fail(`duplicate question ${record.questionNumber}`);
  ids.add(record.questionNumber);
  const expectedPage = questionNumber <= 19 ? 2 : 3;
  if (record.sourcePage !== expectedPage) fail(`question ${questionNumber} has sourcePage ${record.sourcePage}`);
  if (![1, 2, 3, 4, 5].includes(record.problemNumber)) fail(`question ${questionNumber} has invalid problemNumber`);
  if (!Array.isArray(record.options) || record.options.length !== 4 || record.options.some(option => typeof option !== 'string' || option.length === 0)) {
    fail(`question ${questionNumber} must have four nonempty options`);
  }
  if (record.correctOptionId !== String(expectedKeys[index])) {
    fail(`question ${questionNumber} key ${record.correctOptionId} != ${expectedKeys[index]}`);
  }
  if (typeof record.promptJa !== 'string' || record.promptJa.length === 0) fail(`question ${questionNumber} lacks promptJa`);
  if ([1, 3, 4].includes(record.problemNumber) && !record.underlinedText) {
    fail(`question ${questionNumber} lacks underlinedText`);
  }
}

const sourceText = await readFile(sourcePath, 'utf8');
const keyMatch = sourceText.match(/N1_2015_12_WRITTEN_KEY\s*=\s*\[([\s\S]*?)\]\s*as const/);
if (!keyMatch) fail('could not locate N1_2015_12_WRITTEN_KEY');
const declaredKeys = [...keyMatch[1].matchAll(/\d+/g)].map(match => Number(match[0]));
if (declaredKeys.length !== 70) fail(`declared written key count ${declaredKeys.length} != 70`);
if (!expectedKeys.every((key, index) => declaredKeys[index] === key)) fail('recovered keys differ from source declaration');

console.log('N1 2015-12 RECOVERY PASS: pages 2-3 questions 1-29; four options each; unique IDs; 29/29 keys match 70-entry declaration; source hashes match');
