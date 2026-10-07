import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const base = 'docs/ssw-workspace/kaigo/';
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const manifest = read(base + 'reviews/mock-revision-02-changes.json');
const canonical = value => {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])]));
  return value;
};
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const questionHash = q => sha(JSON.stringify(canonical(q)));
const mocks = ['skills', 'japanese'].map(k => read(base + `drafts/kaigo-${k}-mock-01.json`));
const questions = mocks.flatMap(m => m.questions);
const byId = new Map(questions.map(q => [q.id, q]));
const support = read(base + 'drafts/kaigo-mock-review-support-vi.json');
const inventory = read(base + 'reviews/week-08-furigana-inventory.json');
assert.equal(manifest.reviewedQuestionCount, 60);
assert.equal(manifest.revisedQuestionCount, 57);
assert.equal(byId.size, 60);
assert.equal(new Set(manifest.changes.map(c => c.questionId)).size, 57);
assert.equal(manifest.unchangedQuestionIds.length, 3);
assert.deepEqual(new Set([...manifest.changes.map(c => c.questionId), ...manifest.unchangedQuestionIds]), new Set(byId.keys()));
for (const flag of ['domainReviewed', 'nativeReviewed', 'runtimeIntegrated', 'releaseReady']) assert.equal(manifest[flag], false);
for (const mock of mocks) {
  const before = manifest.baselineQuestionIdentityAndKeys.find(m => m.mockId === mock.id);
  assert(before);
  assert.equal(mock.version, 2);
  for (const k of ['durationMinutes', 'durationMs', 'sectionBlueprint', 'policy']) assert.deepEqual(mock[k], before[k], `${mock.id}/${k}`);
  assert.deepEqual(mock.questions.map(({id, sectionId, correctIndex, pointValue}) => ({id, sectionId, correctIndex, pointValue})), before.questions);
  assert.equal(mock.measuredDuration, false);
  for (const k of ['runtimeIntegrated', 'appIntegrationReady', 'releaseReady', 'officialExam']) assert.equal(mock[k], false);
  const counts = [0, 0, 0, 0];
  mock.questions.forEach((q, i) => {
    counts[q.correctIndex]++;
    if (i >= 2) assert(!(q.correctIndex === mock.questions[i-1].correctIndex && q.correctIndex === mock.questions[i-2].correctIndex));
    for (const k of ['domainHumanReviewed', 'nativeLanguageReviewed', 'publisherReviewed', 'rightsReviewed', 'runtimeIntegrated', 'releaseReady']) assert.equal(q.review[k], false);
    assert.equal(q.pointValue, 1);
    assert.equal(new Set(q.optionsJa).size, 4);
    assert.equal(q.rationalesVi.length, 4);
    q.rationalesVi.forEach((r, n) => assert(r.startsWith(n === q.correctIndex ? 'Đúng:' : 'Sai:')));
    q.sourceRefs.forEach(r => assert.equal(r.pdfPage, r.printedPage + 2));
  });
  assert(Math.max(...counts) - Math.min(...counts) <= 1);
}
for (const change of manifest.changes) {
  const q = byId.get(change.questionId);
  assert.equal(q.promptJa, change.afterPromptJa);
  assert.deepEqual(q.optionsJa, change.afterOptionsJa);
  assert.equal(q.correctIndex, change.answerIndexUnchanged);
  assert.equal(questionHash(q), change.afterQuestionSha256);
  assert(q.promptJa !== change.beforePromptJa || JSON.stringify(q.optionsJa) !== JSON.stringify(change.beforeOptionsJa));
}
for (const id of manifest.unchangedQuestionIds) {
  const withoutRuby = q => Object.fromEntries(Object.entries(q).filter(([k]) => k !== 'furigana'));
  assert.deepEqual(withoutRuby(byId.get(id)), withoutRuby(manifest.beforeUnchangedQuestions[id]), id);
}
assert.equal(support.version, 2);
assert.equal(support.humanNativeReviewed, false);
assert.equal(support.runtimeIntegrated, false);
assert.equal(support.displayGate, 'after_submission_only');
assert.equal(support.entries.length, 60);
assert.deepEqual(new Set(support.entries.map(e => e.questionId)), new Set(byId.keys()));
for (const e of support.entries) {
  assert.equal(e.displayGate, 'after_submission_only');
  assert.equal(e.optionsVi.length, 4);
  assert(e.promptVi && e.optionsVi.every(v => v.trim()));
  const q = byId.get(e.questionId);
  if (q.passageJa) assert(e.passageVi);
  if (q.figurePath) assert(e.figureDescriptionVi);
}
// Length ranks describe possible cues, not validated item quality or difficulty.
for (const metric of manifest.afterSurfaceCues) {
  const mock = mocks.find(m => m.id === metric.mockId);
  const bins = {shortest: [], middle: [], longest: [], tied: []};
  for (const q of mock.questions) {
    const lengths = q.optionsJa.map(s => [...s.replace(/\s+/gu, '')].length);
    const n = lengths[q.correctIndex];
    const rank = lengths.filter(v => v === n).length > 1 ? 'tied' : n === Math.min(...lengths) ? 'shortest' : n === Math.max(...lengths) ? 'longest' : 'middle';
    bins[rank].push(q.id);
  }
  assert.deepEqual(bins, metric.correctLengthRankQuestionIds);
  assert.equal(metric.correctUniquelyLongestCount, bins.longest.length);
  assert.deepEqual(metric.questionIds, bins.longest);
}
assert.equal(inventory.version, 2);
assert.equal(inventory.humanNativeReviewed, false);
const runs = [];
const walk = value => {
  if (Array.isArray(value)) value.forEach(walk);
  else if (value && typeof value === 'object') {
    if ('text' in value && 'readingKana' in value) runs.push(value);
    Object.values(value).forEach(walk);
  }
};
questions.forEach(q => walk(q.furigana));
for (const [text, reading] of Object.entries(inventory.criticalPhraseOverrides)) {
  const matches = runs.filter(r => r.text === text);
  assert(matches.length > 0, text);
  matches.forEach(r => assert.equal(r.readingKana, reading, text));
}
assert.equal(byId.get('kaigo-skills-mock-01-q05').additionalKnowledgeSources[0].printedPage, 28);
assert.equal(byId.get('kaigo-skills-mock-01-q05').additionalKnowledgeSources[0].pdfPage, 30);
for (const item of [...manifest.currentFileHashes, ...manifest.unchangedContentEvidence]) assert.equal(sha(fs.readFileSync(item.path)), item.sha256, item.path);
const lessons = fs.readdirSync(base + 'drafts').filter(f => f.endsWith('-lessons.json')).flatMap(f => read(base + 'drafts/' + f).lessons);
assert.equal(lessons.length, 54);
assert.equal(lessons.flatMap(l => l.questions).length, 270);
const lessonStems = new Set(lessons.flatMap(l => l.questions.map(q => q.promptJa)));
assert.equal(new Set(questions.map(q => q.promptJa)).size, 60);
questions.forEach(q => assert(!lessonStems.has(q.promptJa), `exact lesson/mock stem collision: ${q.id}`));
console.log('PASS mock revision 02: 57 revised question bodies, 60 stable IDs/keys/policies, synchronized draft support hashes, critical ruby readings and unchanged lesson/figure hashes. Domain/native/rights/timing/runtime approval remains pending.');
