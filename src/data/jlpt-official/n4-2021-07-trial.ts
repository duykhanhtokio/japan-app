import type { TrialQuestion } from './n1-2012-07-trial';

type SourceQuestion = {
  id: string; sourcePage: number; prompt: string; options: string[]; answer: number;
  passageJa?: string; visualOptionPage?: number;
  audio?: { segmentId: string; startMs: number; endMs: number };
};
const WRITTEN = require('./n4-2021-07/written.candidate.json') as { questions: SourceQuestion[] };
const LISTENING = require('./n4-2021-07/listening.candidate.json') as { questions: SourceQuestion[] };

export const N4_2021_07_SESSION_KEY = 'jlpt:n4:2021-07:exam-08:session:v1';
const written: TrialQuestion[] = WRITTEN.questions.map((q) => {
  const [, section, problem, number] = q.id.match(/^n4-2021-07-(vocabulary|grammar-reading)-p(\d+)-q(\d+)$/) ?? [];
  if (!section) throw new Error(`Invalid N4 2021-07 question ID ${q.id}`);
  const p = Number(problem);
  const family: TrialQuestion['family'] = section === 'vocabulary' ? 'vocabulary' : p === 2 ? 'sentenceComposition' : p >= 4 ? 'reading' : 'grammar';
  return {
    id: q.id, sectionId: section, problemNumber: p, questionNumber: Number(number), family,
    label: `${section === 'vocabulary' ? '文字・語彙' : family === 'reading' ? '読解' : '文法'}／問題${p}／${number}`,
    instructionJa: family === 'sentenceComposition' ? '★ に入るものを選んでください。' : '1・2・3・4からいちばんいいものを一つ選んでください。',
    promptJa: q.prompt, passageId: q.passageJa ? `n4-2021-07-${section}-p${p}` : undefined,
    passageJa: q.passageJa, options: q.options.map((textJa, i) => ({ id: String(i + 1) as '1' | '2' | '3' | '4', textJa })),
    correctOptionId: String(q.answer) as '1' | '2' | '3' | '4',
    sourcePage: q.sourcePage, answerSourcePage: 31, explanationStatus: 'missing', generatedExplanationStatus: 'not_generated',
  };
});
const listening: TrialQuestion[] = LISTENING.questions.map((q) => {
  const [, problem, number] = q.id.match(/^n4-2021-07-listening-p(\d+)-q(\d+)$/) ?? [];
  if (!problem || !q.audio) throw new Error(`Invalid N4 2021-07 listening question ${q.id}`);
  return {
    id: q.id, sectionId: 'listening', problemNumber: Number(problem), questionNumber: Number(number), family: 'listening',
    label: `聴解／問題${problem}／${number}`, instructionJa: '録音を最後まで続けて聞き、いちばんいいものを選んでください。',
    promptJa: q.prompt, visualOptionPage: q.visualOptionPage,
    options: q.options.map((textJa, i) => ({ id: String(i + 1) as '1' | '2' | '3' | '4', textJa })),
    correctOptionId: String(q.answer) as '1' | '2' | '3' | '4', sourcePage: q.sourcePage, answerSourcePage: 31,
    explanationStatus: 'missing', generatedExplanationStatus: 'not_generated',
    audio: { segmentId: q.audio.segmentId, startMs: q.audio.startMs, endMs: q.audio.endMs, transcriptJa: '', transcriptSourcePage: q.sourcePage },
  };
});
export const N4_2021_07_TRIAL: readonly TrialQuestion[] = [...written, ...listening];
if (written.length !== 57 || listening.length !== 28 || new Set(N4_2021_07_TRIAL.map((q) => q.id)).size !== 85) {
  throw new Error('N4 July 2021 requires 57 written and 28 listening responses.');
}
if (N4_2021_07_TRIAL.some((q) => !q.promptJa || q.options.length < 3 || q.options.some((o) => !o.textJa))) {
  throw new Error('N4 July 2021 contains an incomplete question.');
}
