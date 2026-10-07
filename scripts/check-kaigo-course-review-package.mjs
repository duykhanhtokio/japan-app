import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base = 'docs/ssw-workspace/kaigo/';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const audit = read(base + 'reviews/whole-course-coverage-audit.json');
const repairs = read(base + 'reviews/whole-course-objective-repairs.json');
const work = read(base + 'reviews/whole-course-review-worklist.json');
const screen = read(base + 'reviews/whole-course-similarity-screen.json');
const lessons = fs.readdirSync(base + 'drafts').filter(f => f.endsWith('-lessons.json')).flatMap(f => read(base + 'drafts/' + f).lessons);
const byId = new Map(lessons.map(l => [l.id, l]));
const mocks = ['skills', 'japanese'].flatMap(k => read(base + 'drafts/kaigo-' + k + '-mock-01.json').questions);
const mockIds = new Set(mocks.map(q => q.id));
assert.equal(byId.size, 54);
assert.equal(lessons.reduce((n,l) => n + l.questions.length, 0), 270);
assert.equal(mockIds.size, 60);
assert.equal(audit.lessons.length, 54);
assert.equal(audit.mockQuestions.length, 60);
assert.equal(audit.coverageRows.length, 28);
assert.equal(new Set(audit.coverageRows.map(r => r.id)).size, 28);
assert.deepEqual(new Set(audit.lessons.map(l => l.lessonId)), new Set(byId.keys()));
assert.deepEqual(new Set(audit.mockQuestions.map(q => q.questionId)), mockIds);
for (const r of audit.coverageRows) {
  assert(['draft_partial', 'draft_introductory', 'no_dedicated_lesson'].includes(r.status));
  assert.equal(r.domainReviewed, false);
  assert(r.gapVi.length > 20);
  for (const id of r.lessonIds) assert(byId.has(id), id);
  for (const id of r.skillsQuestionIds) assert(mockIds.has(id), id);
}
for (const l of audit.lessons) {
  assert(l.coverageRowIds.length > 0);
  for (const id of l.coverageRowIds) assert(audit.coverageRows.find(r => r.id === id)?.lessonIds.includes(l.lessonId));
}
for (const q of audit.mockQuestions) {
  if (q.mockId.includes('skills')) assert(q.coverageRowIds.length > 0);
  for (const id of q.coverageRowIds) assert(audit.coverageRows.find(r => r.id === id)?.skillsQuestionIds.includes(q.questionId));
}
for (const s of audit.inputSnapshot) assert.equal(crypto.createHash('sha256').update(fs.readFileSync(s.path)).digest('hex'), s.sha256, s.path);
assert.deepEqual(screen.inputSnapshot, audit.inputSnapshot);
assert.equal(screen.matchedFields, screen.matches.length);
assert.equal(screen.humanRightsReviewed, false);
assert.equal(repairs.changes.length, 33);
assert.equal(new Set(repairs.changes.map(c => c.lessonId)).size, 33);
const canonical = value => {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])]));
  return value;
};
for (const c of repairs.changes) {
  assert.equal(byId.get(c.lessonId).objectivesVi[0], c.afterVi);
  assert(!/^(Không|Chưa|Giải thích nguyên tắc:|Giải thích:)/u.test(c.afterVi));
}
assert.equal(audit.boundedRepairEvidence.length, 5);
for (const evidence of audit.boundedRepairEvidence) {
  const data = read(evidence.path);
  for (const l of data.lessons) {
    assert(repairs.changes.some(c => c.lessonId === l.id));
    l.objectivesVi[0] = evidence.mask;
  }
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(canonical(data))).digest('hex'), evidence.maskedFirstObjectivesSha256, evidence.path);
}
assert.equal(work.items.length, 114);
assert.deepEqual(new Set(work.items.map(x => x.unitId)), new Set([...byId.keys(), ...mockIds]));
for (const item of work.items) {
  assert.equal(item.decision, null);
  assert.equal(item.reviewerName, null);
  assert.equal(item.reviewedAt, null);
  assert.deepEqual(item.evidence, []);
}
for (const x of work.crossUnitChecks) assert.equal(x.status, 'pending');
for (const flags of [audit.review, work.review]) for (const value of Object.values(flags)) assert.equal(value, false);
for (const issue of [...audit.mockOverlapClusters, ...audit.distractorReviewFlags]) for (const id of issue.questionIds) assert(mockIds.has(id));
for (const metric of audit.surfaceCueMetrics) {
  const questions = mocks.filter(q => q.id.startsWith(metric.mockId + '-q'));
  const ids = questions.filter(q => {
    const lengths = q.optionsJa.map(s => [...s.replace(/\s+/gu, '')].length);
    const max = Math.max(...lengths);
    return lengths[q.correctIndex] === max && lengths.filter(n => n === max).length === 1;
  }).map(q => q.id);
  assert.equal(metric.totalQuestions, questions.length);
  assert.equal(metric.correctUniquelyLongestCount, ids.length);
  assert.deepEqual(metric.questionIds, ids);
}
assert.equal(audit.status, 'NOT_READY_FOR_INTEGRATION');
console.log('PASS course review package: 54 lessons, 270 lesson checks, 60 mock questions, 33 bounded objective repairs, 28 conservative coverage rows, 114 unsigned review units; hashes/links/unchanged-content checked. This does not certify domain, native, rights, timing or runtime.');
