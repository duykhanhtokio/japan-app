import assert from 'node:assert/strict';
import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('docs/jlpt-workspace/conversion/n1-2014-12/source-only-structured.candidate.json', 'utf8'));
assert.equal(data.status, 'source_only_pre_runtime');
assert.equal(data.questions.length, 107);
assert.equal(new Set(data.questions.map((q) => q.questionId)).size, 107);
const listening = data.questions.filter((q) => q.sectionId === 'listening');
assert.equal(listening.length, 37);
for (const q of data.questions) assert.ok(q.options.some((o) => o.optionId === q.correctOptionId), q.questionId);
for (const q of listening) assert.equal('audio' in q, false, q.questionId);
console.log('N1 2014-12 SOURCE-ONLY SCHEMA PASS: 107 unique source-traceable responses; no runtime audio metadata.');
