import type { TrialQuestion } from './n1-2012-07-trial';

type Written = { id: string; section: 'vocabulary' | 'grammar_reading'; problem: number; number: number; prompt?: string; passage?: string; options: string[]; answer: number; sourcePage: number | number[] };
type ListeningText = { problem: number; number: number; prompt: string; options: string[]; visualDescriptionAi?: boolean; reviewFlag?: string };
type ListeningAudit = { id: string; problemNumber: number; questionNumber: number; correctOptionId: string; startMs: number; endMs: number; questionSourcePages: number[]; transcriptSourcePages: number[] };
const WRITTEN = require('./n5-2013-07/written.candidate.json').questions as Written[];
const LISTENING = require('./n5-2013-07/listening.candidate.json').segments as ListeningAudit[];
const LISTENING_TEXT = require('../../../docs/jlpt-workspace/conversion/n5-2013-07/listening.questions.candidate.json').questions as ListeningText[];
const optionId = (index: number) => String(index + 1) as '1' | '2' | '3' | '4';
const sourcePage = (page: number | number[]) => Array.isArray(page) ? page[0] : page;

export const N5_2013_07_SESSION_KEY = 'jlpt:n5:2013-07:exam-03:session:v1';
const written: TrialQuestion[] = WRITTEN.map(question => {
  const grammarReading = question.section === 'grammar_reading';
  const family: TrialQuestion['family'] = !grammarReading ? 'vocabulary' : question.problem === 2 ? 'sentenceComposition' : question.problem <= 3 ? 'grammar' : 'reading';
  const label = `${!grammarReading ? '文字・語彙' : family === 'reading' ? '読解' : '文法'}／問題${question.problem}／${question.number}`;
  return {
    id: question.id, sectionId: grammarReading ? 'grammar-reading' : 'vocabulary', problemNumber: question.problem,
    questionNumber: question.number, family, label,
    instructionJa: question.problem === 2 && grammarReading ? '★ に入るものを選んでください。' : '1・2・3・4からいちばんいいものを一つ選んでください。',
    promptJa: question.prompt ?? `文中の ${question.number} に入るものを選んでください。`,
    passageJa: question.passage,
    options: question.options.map((textJa, index) => ({ id: optionId(index), textJa })),
    correctOptionId: String(question.answer) as '1' | '2' | '3' | '4',
    sourcePage: sourcePage(question.sourcePage), answerSourcePage: 14,
    explanationStatus: 'missing', generatedExplanationStatus: 'not_generated',
  };
});
const listening: TrialQuestion[] = LISTENING.map(segment => {
  const source = LISTENING_TEXT.find(item => item.problem === segment.problemNumber && item.number === segment.questionNumber);
  if (!source) throw new Error(`N5 2013 listening source text missing: ${segment.id}`);
  return {
    id: segment.id, sectionId: 'listening', problemNumber: segment.problemNumber, questionNumber: segment.questionNumber,
    family: 'listening', label: `聴解／問題${segment.problemNumber}／${segment.questionNumber}`,
    instructionJa: source.visualDescriptionAi ? '原資料の図の選択肢を文章で表した候補です。聴いて選んでください。' : '聴いて、いちばんいいものを選んでください。',
    promptJa: source.prompt, options: source.options.map((textJa, index) => ({ id: optionId(index), textJa })),
    correctOptionId: segment.correctOptionId as '1' | '2' | '3' | '4', sourcePage: segment.questionSourcePages[0], answerSourcePage: 14,
    explanationStatus: 'missing', generatedExplanationStatus: 'not_generated',
    audio: { segmentId: segment.id, startMs: segment.startMs, endMs: segment.endMs, transcriptJa: '', transcriptSourcePage: segment.transcriptSourcePages[0] },
  };
});
export const N5_2013_07_TRIAL: readonly TrialQuestion[] = [...written, ...listening];
if (written.length !== 67 || listening.length !== 24 || new Set(N5_2013_07_TRIAL.map(item => item.id)).size !== 91) throw new Error('N5 2013-07 response count mismatch.');
if (N5_2013_07_TRIAL.some(item => !item.promptJa || item.options.length < 3 || item.options.some(option => !option.textJa))) throw new Error('N5 2013-07 incomplete question content.');
