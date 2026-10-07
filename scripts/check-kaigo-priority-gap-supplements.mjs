import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base = 'docs/ssw-workspace/kaigo/';
const read = p => JSON.parse(fs.readFileSync(base + p, 'utf8'));
const bundle = read('drafts/priority-gap-supplements-01.json');
const evidence = read('reviews/priority-gap-supplements-01-evidence.json');
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const lessons = fs.readdirSync(base + 'drafts').filter(f => f.endsWith('-lessons.json')).flatMap(f => read('drafts/' + f).lessons);
const byId = new Map(lessons.map(l => [l.id, l]));
const npcs = new Set(read('drafts/npc-roster.json').npcs.map(n => n.id));
const oldTerms = fs.readdirSync(base + 'drafts').filter(f => f.endsWith('-vocabulary.json') || f === 'knowledge-glossary.json').flatMap(f => {
  const d = read('drafts/' + f);
  return Object.values(d).find(v => Array.isArray(v)) ?? [];
});
const termIds = new Set([...oldTerms, ...bundle.newConceptTerms].map(t => t.id));
assert.equal(byId.size, 54);
assert.equal(lessons.flatMap(l => l.questions).length, 270);
assert.equal(bundle.modules.length, 2);
assert.equal(bundle.modules.flatMap(m => m.dialogue).length, 18);
assert.equal(bundle.modules.flatMap(m => m.questions).length, 10);
assert.equal(bundle.responseRubrics.length, 8);
assert.equal(bundle.responseRubrics.flatMap(r => r.assessmentCases).length, 24);
assert.equal(new Set(bundle.newConceptTerms.map(t => t.termJa)).size, 6);
for (const t of bundle.newConceptTerms) {
  assert(!oldTerms.some(o => o.termJa === t.termJa), t.termJa);
  assert(/^[ぁ-ゖー]+$/u.test(t.readingKana));
  assert.equal(t.readingVerification, 'AI_context_checked_not_native_or_visual_Japanese_source_review');
}
const allCoreQuestions = lessons.flatMap(l => l.questions);
const allMockQuestions = ['skills', 'japanese'].flatMap(k => read(`drafts/kaigo-${k}-mock-01.json`).questions);
assert.equal(allMockQuestions.length, 60);
const stems = new Set([...allCoreQuestions, ...allMockQuestions].map(q => q.promptJa));
const playerLines = new Set(lessons.flatMap(l => l.dialogue.filter(t => t.speaker === 'player').map(t => t.ja)));
for (const m of bundle.modules) {
  const original = byId.get(m.baseLessonId);
  assert(original);
  assert.equal(original.curriculumDay, m.curriculumDay);
  assert(npcs.has(m.npcId));
  assert(m.vocabularyIds.every(id => termIds.has(id)));
  const plan = m.replacementPlan;
  assert.equal(plan.selectedInCurriculum, false);
  assert.equal(plan.originalMandatoryBlocksAlsoAssigned, false);
  assert.equal(plan.originalLessonRetained, true);
  assert.equal(plan.mode, 'replace_blocks_not_append_minutes');
  assert.deepEqual(plan.blocks, original.dailyPractice.blocks);
  assert.equal(plan.blocks.reduce((n, b) => n + b.minutes, 0), 30);
  assert.equal(plan.durationMeasured, false);
  assert.equal(plan.newMandatoryVocabularyCount, 0);
  assert(plan.retainedCoverageLessonIds.every(id => byId.has(id)));
  assert.equal(m.knowledgeModule.sections.length, 4);
  assert.equal(m.questions.length, 5);
  assert(m.reading.ja && m.reading.vi);
  assert(m.scopeLimitsVi.length >= 3);
  assert(m.transferPractice.modelJa && m.transferPractice.expectedMeaningVi.length === 3);
  assert.equal(m.assetStatus.runtime, 'not_integrated');
  for (const q of m.questions) {
    assert(!stems.has(q.promptJa), q.id); stems.add(q.promptJa);
    assert.equal(q.optionsJa.length, 4);
    assert.equal(new Set(q.optionsJa).size, 4);
    assert.equal(q.optionsVi.length, 4);
    assert.equal(q.rationalesVi.length, 4);
    assert(q.correctIndex >= 0 && q.correctIndex < 4);
    q.rationalesVi.forEach((s, n) => assert(s.startsWith(n === q.correctIndex ? 'Đúng:' : 'Sai:')));
  }
  m.dialogue.forEach((t, n) => {
    assert.equal(t.speaker, n % 2 ? 'player' : 'npc');
    assert(t.ja && t.vi);
    assert(!/[À-ỹ]/u.test(t.ja));
    if (t.speaker === 'player') { assert(!playerLines.has(t.ja), t.id); playerLines.add(t.ja); }
  });
  for (const rid of m.responseRubricIds) {
    const r = bundle.responseRubrics.find(r => r.id === rid);
    assert(r && r.moduleId === m.id);
    assert.equal(r.requiredMeanings.length, 2);
    assert.equal(r.acceptableJa.length, 2);
    const at = m.dialogue.findIndex(t => t.id === r.playerTurnId);
    assert.equal(m.dialogue[at].speaker, 'player');
    assert.equal(m.dialogue[at - 1].id, r.promptTurnId);
    assert.equal(m.dialogue[at + 1].id, r.nextTurnId);
    assert(r.acceptableJa.includes(m.dialogue[at].ja));
    assert.equal(r.evaluationPolicy.runtimeImplemented, false);
    assert.equal(r.evaluationPolicy.exactStringMatchRequired, false);
    assert.equal(r.evaluationPolicy.asrUncertain, 'repeat_or_edit_no_knowledge_penalty');
    assert.deepEqual(r.assessmentCases.map(c => c.expected), ['accept_meaning','clarify_missing_information','correct_before_advance']);
    assert(r.assessmentCases.every(c => c.specOnly));
  }
}
const ids=[];
const walk = v => {
  if (Array.isArray(v)) v.forEach(walk);
  else if (v && typeof v === 'object') {
    if (v.id) ids.push(v.id);
    if (v.review) Object.values(v.review).forEach(flag => assert.equal(flag, false));
    Object.values(v).forEach(walk);
  }
};
walk(bundle);
assert.equal(new Set(ids).size, ids.length);
assert.equal(evidence.newFile.sha256, sha(evidence.newFile.path));
for (const e of evidence.unchangedCoreEvidence) assert.equal(sha(e.path), e.sha256, e.path);
assert.equal(evidence.reviewWorklist.length, 2);
assert(evidence.reviewWorklist.every(x => x.decision === null && x.reviewerName === null && x.reviewedAt === null));
assert.equal(evidence.screen.matchedFields, evidence.screen.matchedPaths.length);
assert.equal(evidence.curriculumSelected, false);
const q05=allMockQuestions.find(q=>q.id==='kaigo-skills-mock-01-q05');
assert.deepEqual([q05.additionalKnowledgeSources[0].printedPage,q05.additionalKnowledgeSources[0].pdfPage],[27,30]);
const official=bundle.sources.find(s=>s.id==='mhlw-infection-2023');
assert(official.pages.every(p=>p.pdfPage===p.printedPage+3));
console.log('PASS priority-gap candidates: 2 proposed replacements, 18 turns, 10 questions, 8 meaning rubrics/24 unexecuted case specs; 30-minute allocations retained, core lesson hashes unchanged, MHLW source page pair corrected. Human/load/rights/runtime gates pending.');
