import fs from 'node:fs';

const packet = JSON.parse(fs.readFileSync('docs/jlpt-workspace/source-packets/n5-2017-07.source-packet.json', 'utf8'));
const candidate = JSON.parse(fs.readFileSync('docs/jlpt-workspace/conversion/n5-2017-07/written.partial.json', 'utf8'));
const listening = JSON.parse(fs.readFileSync('docs/jlpt-workspace/conversion/n5-2017-07/listening.partial.json', 'utf8'));
const refs = new Map(packet.writtenQuestions.map(question => [question.questionId, question]));
const seen = new Set();
for (const question of candidate.questions) {
  const ref = refs.get(question.id);
  if (!ref) throw new Error(`Unknown written question ${question.id}`);
  if (seen.has(question.id)) throw new Error(`Duplicate written question ${question.id}`);
  seen.add(question.id);
  if (!ref.sourcePages.includes(question.sourcePage)) throw new Error(`Wrong source page ${question.id}`);
  if (String(question.answer) !== ref.correctOptionId) throw new Error(`Wrong keyed answer ${question.id}`);
  if (!question.prompt?.trim() || question.options?.length !== 4 || question.options.some(option => !option?.trim())) {
    throw new Error(`Incomplete text ${question.id}`);
  }
}
if (candidate.remainingWritten !== packet.writtenQuestions.length - seen.size) throw new Error('Remaining count mismatch');
const listeningRefs = new Map(packet.listeningQuestions.map(question => [question.questionId, question]));
const heard = new Set();
for (const question of listening.questions) {
  const ref = listeningRefs.get(question.id);
  if (!ref || heard.has(question.id)) throw new Error(`Unknown or duplicate listening question ${question.id}`);
  heard.add(question.id);
  if (ref.sourcePages.length && !ref.sourcePages.includes(question.sourcePage)) throw new Error(`Wrong listening source page ${question.id}`);
  if (String(question.answer) !== ref.correctOptionId) throw new Error(`Wrong listening key ${question.id}`);
  if (!question.prompt?.trim() || question.options?.length !== 3 || question.options.some(option => !option?.trim())) {
    throw new Error(`Incomplete listening text ${question.id}`);
  }
}
if (listening.remainingListening !== packet.listeningQuestions.length - heard.size) throw new Error('Remaining listening count mismatch');
if (candidate.remainingListening !== packet.listeningQuestions.length) throw new Error('Written checkpoint initial listening count mismatch');
console.log(`N5 2017-07 conversion mapping PASS: ${seen.size}/${packet.writtenQuestions.length} written; ${heard.size}/${packet.listeningQuestions.length} listening`);
