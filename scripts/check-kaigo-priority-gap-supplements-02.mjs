import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function validateCandidateBatch(a, bases, npcIds) {
  const require = (ok, message) => { if (!ok) throw new Error(message); };
  const ids = new Set();
  const visit = v => {
    if (Array.isArray(v)) return v.forEach(visit);
    if (!v || typeof v !== 'object') return;
    if (typeof v.id === 'string') { require(!ids.has(v.id), 'duplicate ID: ' + v.id); ids.add(v.id); }
    if (v.review) for (const [k,x] of Object.entries(v.review)) require(x === false, 'review gate promoted: ' + k);
    for (const x of Object.values(v)) visit(x);
  };
  visit(a);
  require(a.status === 'NOT_READY_FOR_INTEGRATION', 'integration gate');
  require(a.modules.length === 2 && a.responseRubrics.length === 8, 'module/rubric counts');
  require(a.newConceptTerms.length === 0, 'no new canonical term rows');
  require(a.coreCountsUnchanged.lessons === 54 && a.coreCountsUnchanged.lessonQuestions === 270 && a.coreCountsUnchanged.mockQuestions === 60, 'core counts');
  const questions = [], turns = [], cases = [];
  for (const m of a.modules) {
    const b = bases.find(x => x.id === m.baseLessonId);
    require(b && b.curriculumDay === m.curriculumDay, 'replacement target/day');
    require(npcIds.includes(m.npcId), 'unknown NPC');
    require(JSON.stringify(m.vocabularyIds) === JSON.stringify(b.vocabularyIds), 'base vocabulary links');
    require(m.knowledgeModule.sections.length === 4 && m.expressions.length === 2, 'knowledge/expressions');
    require(m.dialogue.length >= 6 && m.dialogue.length <= 12, 'turn range');
    require(m.questions.length === 5, 'question count');
    require(m.replacementPlan.selectedInCurriculum === false && m.replacementPlan.originalMandatoryBlocksAlsoAssigned === false, 'candidate selection/load');
    require(m.replacementPlan.durationMeasured === false && m.replacementPlan.newMandatoryVocabularyCount === 0, 'timing/vocabulary claim');
    require(JSON.stringify(m.replacementPlan.blocks) === JSON.stringify(b.dailyPractice.blocks), 'preserve day blocks');
    require(m.replacementPlan.blocks.reduce((s,x)=>s+x.minutes,0) === 30, 'planned minutes');
    const playerIds = m.dialogue.filter(x=>x.speaker==='player').map(x=>x.id);
    const rs = a.responseRubrics.filter(x=>x.moduleId===m.id);
    require(rs.length === playerIds.length && JSON.stringify(rs.map(x=>x.id)) === JSON.stringify(m.responseRubricIds), 'rubric coverage');
    m.dialogue.forEach((t,i)=>{
      require(t.speaker === (i%2?'player':'npc'), 'turn speaker order');
      require(t.ja.trim() && t.vi.trim(), 'dialogue languages');
      require(!/[À-ỹ]/u.test(t.ja), 'Vietnamese in Japanese field');
    });
    for (const q of m.questions) {
      require(q.optionsJa.length===4 && q.optionsVi.length===4 && q.rationalesVi.length===4, 'four choices/rationales');
      require(Number.isInteger(q.correctIndex) && q.correctIndex>=0 && q.correctIndex<4, 'answer index');
      require(new Set(q.optionsJa).size===4 && new Set(q.optionsVi).size===4, 'duplicate choices');
      require(q.feedbackAfterAttempt===true, 'feedback timing');
      for (const s of [q.promptJa,q.promptVi,...q.optionsJa,...q.optionsVi,...q.rationalesVi]) require(typeof s==='string' && s.trim(), 'empty question field');
    }
    for (const r of rs) {
      const i=m.dialogue.findIndex(t=>t.id===r.playerTurnId);
      require(i>0 && m.dialogue[i].speaker==='player', 'rubric player link');
      require(r.promptTurnId===m.dialogue[i-1].id && r.nextTurnId===m.dialogue[i+1].id, 'rubric adjacent links');
      require(r.requiredMeanings.length>=2 && r.acceptableJa.length>=2, 'atomic meaning/variants');
      require(r.acceptableJa.includes(m.dialogue[i].ja), 'model matches rubric');
      require(r.evaluationPolicy.exactStringMatchRequired===false && r.evaluationPolicy.runtimeImplemented===false, 'meaning/runtime policy');
      require(r.assessmentCases.length===3 && new Set(r.assessmentCases.map(c=>c.expected)).size===3 && r.assessmentCases.every(c=>c.specOnly===true), 'three spec case types');
      cases.push(...r.assessmentCases);
    }
    for (const s of m.sourceRefs) require(Number.isInteger(s.printedPage) && s.pdfPage===s.printedPage+2, 'textbook locator');
    questions.push(...m.questions); turns.push(...m.dialogue);
  }
  require(questions.length===10 && turns.length===18 && cases.length===24, 'aggregate counts');
  require(new Set(questions.map(x=>x.promptJa)).size===10, 'duplicate question stems');
  const keys=questions.map(x=>x.correctIndex);
  require(keys.every((x,i)=>i<2 || x!==keys[i-1] || x!==keys[i-2]), 'three identical key run');
  const keyCounts=[0,1,2,3].map(k=>keys.filter(x=>x===k).length);
  require(Math.max(...keyCounts)-Math.min(...keyCounts)<=1, 'batch answer distribution');
  return {structuralChecks:'PASS',modules:2,questions:questions.length,dialogueTurns:turns.length,rubrics:8,caseSpecs:cases.length,keyCounts,scope:'candidate_integrity_only_not_semantic_runtime_or_human_approval'};
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = 'docs/ssw-workspace/kaigo/drafts/';
  const read = name => JSON.parse(readFileSync(root + name, 'utf8'));
  const bases = [...read('review-lessons.json').lessons, ...read('housework-lessons.json').lessons];
  const npcs = read('npc-roster.json').npcs.map(x=>x.id);
  console.log(JSON.stringify(validateCandidateBatch(read('priority-gap-supplements-02.json'), bases, npcs), null, 2));
}
