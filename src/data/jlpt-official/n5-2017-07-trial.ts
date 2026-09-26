import type { TrialQuestion } from './n1-2012-07-trial';

type Candidate = {
  id: string; sourcePage: number; prompt: string; options: string[]; answer: number;
  passage?: string; visualOptionAsset?: string; transcriptSourcePage?: number;
};
type PacketQuestion = {
  questionId: string; sectionId: string; problemNumber: number; questionNumber: number;
  correctOptionId: string; answerSourcePages: number[];
};
const WRITTEN = require('../../../docs/jlpt-workspace/conversion/n5-2017-07/written.partial.json') as { questions: Candidate[]; remainingWritten: number };
const LISTENING = require('../../../docs/jlpt-workspace/conversion/n5-2017-07/listening.partial.json') as { questions: Candidate[]; remainingListening: number };
const PACKET = require('../../../docs/jlpt-workspace/source-packets/n5-2017-07.source-packet.json') as { writtenQuestions: PacketQuestion[]; listeningQuestions: PacketQuestion[] };
const source = new Map([...PACKET.writtenQuestions, ...PACKET.listeningQuestions].map(question => [question.questionId, question]));

// These keys are paired with the static Metro require map in approved-n1-exams.ts.
const visualPageByName: Readonly<Record<string, number>> = {
  'vocab-p2q1-spelling.jpg': 201, 'vocab-p2q2-kanji.jpg': 202, 'vocab-p2q3-kanji.jpg': 203,
  'vocab-p2q4-kanji.jpg': 204, 'vocab-p2q5-kanji.jpg': 205, 'vocab-p2q6-kanji.jpg': 206,
  'vocab-p3q9-apples.jpg': 207, 'vocab-p3q10-glasses.jpg': 208, 'reading-p4q2-rooms.jpg': 209,
  'listening-p1q1-socks.jpg': 210, 'listening-p1q3-bags.jpg': 211, 'listening-p1q4-items.jpg': 212,
  'listening-p1q5-actions.jpg': 213, 'listening-p1q6-items.jpg': 214,
};

function toTrial(item: Candidate, listening: boolean): TrialQuestion {
  const ref = source.get(item.id);
  if (!ref || String(item.answer) !== ref.correctOptionId) throw new Error(`N5 2017-07 source mapping invalid: ${item.id}`);
  const vocabulary = !listening && ref.sectionId === 'vocabulary';
  const family: TrialQuestion['family'] = listening ? 'listening' : vocabulary ? 'vocabulary'
    : ref.problemNumber === 2 ? 'sentenceComposition' : ref.problemNumber <= 3 ? 'grammar' : 'reading';
  const visualName = item.visualOptionAsset?.split('/').at(-1);
  const visualOptionPage = visualName ? visualPageByName[visualName] : undefined;
  if (visualName && !visualOptionPage) throw new Error(`N5 2017-07 visual missing: ${visualName}`);
  const passageGroup = ref.problemNumber === 3 ? (ref.questionNumber <= 2 ? 'sushi' : 'bookshop')
    : ref.problemNumber === 5 ? 'shared' : String(ref.questionNumber);
  const passageId = item.passage ? `n5-2017-07-reading-${ref.problemNumber}-${passageGroup}` : undefined;
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

export const N5_2017_07_SESSION_KEY = 'jlpt:n5:2017-07:exam-04:session:v1';
export const N5_2017_07_TRIAL: readonly TrialQuestion[] = [
  ...WRITTEN.questions.map(question => toTrial(question, false)),
  ...LISTENING.questions.map(question => toTrial(question, true)),
];
if (WRITTEN.remainingWritten || LISTENING.remainingListening || WRITTEN.questions.length !== 65 || LISTENING.questions.length !== 24 || new Set(N5_2017_07_TRIAL.map(question => question.id)).size !== 89) {
  throw new Error('N5 2017-07 must contain 65 written and 24 listening responses.');
}