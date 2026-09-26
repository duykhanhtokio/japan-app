import type { TrialQuestion } from './n1-2012-07-trial';

type Written = {
  id: string; section: 'vocabulary' | 'grammar_reading'; problem: number; number: number;
  prompt?: string; passage?: string; passageRef?: number; options: string[]; answer: number; sourcePage: number;
};
type Listening = {
  id: string; problem: number; number: number; prompt: string; options?: string[]; answer: number;
  optionsSource?: string; visualAsset?: string; transcriptPage?: number; transcriptPages?: number[];
};
const WRITTEN = require('./n4-2011-12/written.candidate.json').questions as Written[];
const LISTENING = require('./n4-2011-12/listening.candidate.json').segments as Listening[];
const optionId = (index: number) => String(index + 1) as '1' | '2' | '3' | '4';
const continuousAudio = {
  segmentId: 'n4-2011-12-continuous', startMs: 0, endMs: 2154188,
  transcriptJa: '', transcriptSourcePage: 20,
};
const passage = WRITTEN.find((question) => question.section === 'grammar_reading' && question.problem === 3)?.passage;

export const N4_2011_12_SESSION_KEY = 'jlpt:n4:2011-12:exam-01:session:v1';
const written: TrialQuestion[] = WRITTEN.map((question) => {
  const grammarReading = question.section === 'grammar_reading';
  const family: TrialQuestion['family'] = !grammarReading ? 'vocabulary'
    : question.problem === 2 ? 'sentenceComposition'
    : question.problem >= 4 ? 'reading' : 'grammar';
  return {
    id: question.id, sectionId: grammarReading ? 'grammar-reading' : 'vocabulary',
    problemNumber: question.problem, questionNumber: question.number, family,
    label: `${!grammarReading ? '文字・語彙' : family === 'reading' ? '読解' : '文法'}／問題${question.problem}／${question.number}`,
    instructionJa: family === 'sentenceComposition' ? '★ に入るものを選んでください。' : '1・2・3・4からいちばんいいものを一つ選んでください。',
    promptJa: question.prompt ?? `文章の［${question.number}］に入るものを選んでください。`,
    passageId: question.passageRef || question.passage && question.problem === 3 ? 'n4-2011-12-cooking' : undefined,
    passageJa: question.passage ?? (question.passageRef ? passage : undefined),
    options: question.options.map((textJa, index) => ({ id: optionId(index), textJa })),
    correctOptionId: String(question.answer) as '1' | '2' | '3' | '4',
    sourcePage: question.sourcePage, answerSourcePage: 13,
    explanationStatus: 'missing', generatedExplanationStatus: 'not_generated',
  };
});
const listening: TrialQuestion[] = LISTENING.map((question) => ({
  id: question.id, sectionId: 'listening', problemNumber: question.problem,
  questionNumber: question.number, family: 'listening',
  label: `聴解／問題${question.problem}／${question.number}`,
  instructionJa: '音声を続けて聞き、いちばんいいものを選んでください。',
  promptJa: question.prompt,
  visualOptionPage: question.optionsSource === 'image' ? 12 : question.visualAsset ? 13 : undefined,
  options: (question.options ?? ['図1', '図2', '図3', '図4']).map((textJa, index) => ({ id: optionId(index), textJa })),
  correctOptionId: String(question.answer) as '1' | '2' | '3' | '4',
  sourcePage: question.problem === 1 ? 10 : question.problem === 2 ? 11 : 12,
  answerSourcePage: 13, explanationStatus: 'missing', generatedExplanationStatus: 'not_generated',
  // This identifies the complete recording for review. Playback never seeks to a question boundary.
  audio: { ...continuousAudio, transcriptSourcePage: question.transcriptPage ?? question.transcriptPages?.[0] ?? 20 },
}));

export const N4_2011_12_TRIAL: readonly TrialQuestion[] = [...written, ...listening];
if (written.length !== 70 || listening.length !== 27 || new Set(N4_2011_12_TRIAL.map((question) => question.id)).size !== 97) {
  throw new Error('N4 2011 source package must have 70 written and 27 listening responses.');
}
if (N4_2011_12_TRIAL.some((question) => !question.promptJa || ![3, 4].includes(question.options.length) || question.options.some((option) => !option.textJa))) {
  throw new Error('N4 2011 source package contains an incomplete question.');
}
