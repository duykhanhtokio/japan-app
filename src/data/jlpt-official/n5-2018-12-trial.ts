import type { TrialQuestion } from './n1-2012-07-trial';

type Candidate = {
  id: string; sourcePage: number; prompt: string; options: string[]; answer: number;
  passage?: string; visualOptionAsset?: string; transcriptSourcePage?: number;
};
type PacketQuestion = {
  questionId: string; sectionId: string; problemNumber: number; questionNumber: number;
  correctOptionId: string; answerSourcePages: number[];
};
const WRITTEN = require('../../../docs/jlpt-workspace/conversion/n5-2018-12/written.partial.json') as { questions: Candidate[]; remainingWritten: number };
const LISTENING = require('../../../docs/jlpt-workspace/conversion/n5-2018-12/listening.partial.json') as { questions: Candidate[]; remainingListening: number };
const PACKET = require('../../../docs/jlpt-workspace/source-packets/n5-2018-12.source-packet.json') as { writtenQuestions: PacketQuestion[]; listeningQuestions: PacketQuestion[] };
const source = new Map([...PACKET.writtenQuestions, ...PACKET.listeningQuestions].map(question => [question.questionId, question]));

// These keys are paired with the static Metro require map in approved-n1-exams.ts.
const visualPageByName: Readonly<Record<string, number>> = {
  'vocab-p1q9.jpg': 301,
  'vocab-p2q1.jpg': 302,
  'vocab-p2q3.jpg': 303,
  'vocab-p2q4.jpg': 304,
  'vocab-p2q6.jpg': 305,
  'reading-p6q1-route.jpg': 306,
  'listening-p1q1-map.jpg': 307,
  'listening-p1q2-magazines.jpg': 308,
  'listening-p1q3-calendar.jpg': 309,
  'listening-p1q4-food.jpg': 310,
  'listening-p1q7-party.jpg': 311,
  'listening-p2q1-juice.jpg': 312,
  'listening-p2q3-transport.jpg': 313,
  'listening-p2q4-actions.jpg': 314,
  'listening-p3q1-hiking.jpg': 315,
  'listening-p3q2-gift.jpg': 316,
  'listening-p3q3-visitor.jpg': 317,
  'listening-p3q4-bicycles.jpg': 318,
  'listening-p3q5-restaurant.jpg': 319,
};

function toTrial(item: Candidate, listening: boolean): TrialQuestion {
  const ref = source.get(item.id);
  if (!ref || String(item.answer) !== ref.correctOptionId) throw new Error(`N5 2018-12 source mapping invalid: ${item.id}`);
  const vocabulary = !listening && ref.sectionId === 'vocabulary';
  const family: TrialQuestion['family'] = listening ? 'listening' : vocabulary ? 'vocabulary'
    : ref.problemNumber === 2 ? 'sentenceComposition' : ref.problemNumber <= 3 ? 'grammar' : 'reading';
  const visualName = item.visualOptionAsset?.split('/').at(-1);
  const visualOptionPage = visualName ? visualPageByName[visualName] : undefined;
  if (visualName && !visualOptionPage) throw new Error(`N5 2018-12 visual missing: ${visualName}`);
  const passageGroup = !vocabulary && ref.problemNumber === 3 ? (ref.questionNumber <= 2 ? 'juice' : 'coffee')
    : ref.problemNumber === 5 ? 'shared' : String(ref.questionNumber);
  const passageId = item.passage ? `n5-2018-12-reading-${ref.problemNumber}-${passageGroup}` : undefined;
  return {
    id: item.id, sectionId: listening ? 'listening' : ref.sectionId, problemNumber: ref.problemNumber,
    questionNumber: ref.questionNumber, family,
    label: `${listening ? '聴解' : vocabulary ? '文字・語彙' : family === 'reading' ? '読解' : '文法'}／問題${ref.problemNumber}／${ref.questionNumber}`,
    instructionJa: listening ? '録音を続けて聞き、いちばんいいものを一つ選んでください。'
      : family === 'sentenceComposition' ? '★ に入るものを選んでください。' : '1・2・3・4からいちばんいいものを一つ選んでください。',
    promptJa: item.prompt, passageId, passageJa: item.passage,
    options: item.options.map((textJa, index) => ({ id: String(index + 1) as '1'|'2'|'3'|'4', textJa })),
    correctOptionId: ref.correctOptionId as '1'|'2'|'3'|'4', sourcePage: item.sourcePage,
    answerSourcePage: ref.answerSourcePages[0] ?? item.transcriptSourcePage ?? item.sourcePage,
    visualOptionPage, explanationStatus: 'missing', generatedExplanationStatus: 'not_generated',
    // Exam playback uses one MP3 from its start. These metadata values never seek per question.
    audio: listening ? { segmentId: item.id, startMs: 0, endMs: 0, transcriptJa: '', transcriptSourcePage: item.transcriptSourcePage ?? item.sourcePage } : undefined,
  };
}

export const N5_2018_12_SESSION_KEY = 'jlpt:n5:2018-12:exam-05:session:v1';
export const N5_2018_12_TRIAL: readonly TrialQuestion[] = [
  ...WRITTEN.questions.map(question => toTrial(question, false)),
  ...LISTENING.questions.map(question => toTrial(question, true)),
];
if (WRITTEN.remainingWritten || LISTENING.remainingListening || WRITTEN.questions.length !== 67 || LISTENING.questions.length !== 24 || new Set(N5_2018_12_TRIAL.map(question => question.id)).size !== 91) {
  throw new Error('N5 2018-12 must contain 67 written and 24 listening responses.');
}
