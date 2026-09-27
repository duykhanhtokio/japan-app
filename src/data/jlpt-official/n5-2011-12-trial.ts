import type { TrialQuestion } from './n1-2012-07-trial';

type WrittenCandidate = {
  id: string;
  sourcePage: number;
  prompt: string;
  options: string[];
  answer: number;
  visualSourcePage?: number;
};

type ListeningCandidate = {
  id: string;
  sourcePage: number;
  prompt: string;
  options: string[];
  answer: number;
  transcriptSourcePages: number[];
  candidateStartMs: number;
  candidateEndMs: number;
  visualOptionAsset?: string;
};

const WRITTEN = require('../../../docs/jlpt-workspace/conversion/n5-2011-12/written.partial.json') as {
  questions: WrittenCandidate[];
  remainingWritten: number;
};
const LISTENING = require('../../../docs/jlpt-workspace/conversion/n5-2011-12/listening.partial.json') as {
  questions: ListeningCandidate[];
  remainingListening: number;
};

const optionId = (index: number) => String(index + 1) as '1' | '2' | '3' | '4';
const parsePosition = (id: string) => {
  const match = id.match(/-p(\d+)-q(\d+)$/);
  if (!match) throw new Error(`N5 2011-12 question ID is invalid: ${id}`);
  return { problemNumber: Number(match[1]), questionNumber: Number(match[2]) };
};

const writtenVisualPage = (question: WrittenCandidate) => {
  if (question.id.endsWith('-vocabulary-p3-q9') || question.id.endsWith('-vocabulary-p3-q10')) return 101;
  if (question.id.endsWith('-grammar-reading-p4-q2')) return 102;
  if (question.id.endsWith('-grammar-reading-p6-q1')) return 103;
  return undefined;
};

const listeningVisualPage = (question: ListeningCandidate) => {
  if (question.visualOptionAsset?.endsWith('listening-p1-options.jpg')) return 104;
  if (question.visualOptionAsset?.endsWith('listening-p3-q1-q4.jpg')) return 105;
  if (question.visualOptionAsset?.endsWith('listening-p3-q5.jpg')) return 106;
  return undefined;
};

export const N5_2011_12_SESSION_KEY = 'jlpt:n5:2011-12:exam-01:session:v1';

const written: TrialQuestion[] = WRITTEN.questions.map((question) => {
  const { problemNumber, questionNumber } = parsePosition(question.id);
  const vocabulary = question.id.includes('-vocabulary-');
  const family: TrialQuestion['family'] = vocabulary
    ? 'vocabulary'
    : problemNumber === 2
      ? 'sentenceComposition'
      : problemNumber <= 3
        ? 'grammar'
        : 'reading';
  return {
    id: question.id,
    sectionId: vocabulary ? 'vocabulary' : 'grammar-reading',
    problemNumber,
    questionNumber,
    family,
    label: `${vocabulary ? '文字・語彙' : family === 'reading' ? '読解' : '文法'}／問題${problemNumber}／${questionNumber}`,
    instructionJa: family === 'sentenceComposition'
      ? '★ に入るものを選んでください。'
      : '1・2・3・4からいちばんいいものを一つ選んでください。',
    promptJa: question.prompt,
    options: question.options.map((textJa, index) => ({ id: optionId(index), textJa })),
    correctOptionId: String(question.answer) as '1' | '2' | '3' | '4',
    sourcePage: question.sourcePage,
    answerSourcePage: 13,
    visualOptionPage: writtenVisualPage(question),
    explanationStatus: 'missing',
    generatedExplanationStatus: 'not_generated',
  };
});

const listening: TrialQuestion[] = LISTENING.questions.map((question) => {
  const { problemNumber, questionNumber } = parsePosition(question.id);
  return {
    id: question.id,
    sectionId: 'listening',
    problemNumber,
    questionNumber,
    family: 'listening',
    label: `聴解／問題${problemNumber}／${questionNumber}`,
    instructionJa: '録音を続けて聞き、いちばんいいものを一つ選んでください。',
    promptJa: question.prompt,
    options: question.options.map((textJa, index) => ({ id: optionId(index), textJa })),
    correctOptionId: String(question.answer) as '1' | '2' | '3' | '4',
    sourcePage: question.sourcePage,
    answerSourcePage: 13,
    visualOptionPage: listeningVisualPage(question),
    explanationStatus: 'missing',
    generatedExplanationStatus: 'not_generated',
    // N4/N5 playback uses the complete recording. Candidate per-question ranges stay review metadata.
    audio: {
      segmentId: 'n5-2011-12-continuous',
      startMs: 0,
      endMs: 1712901,
      transcriptJa: '',
      transcriptSourcePage: question.transcriptSourcePages[0],
    },
  };
});

export const N5_2011_12_TRIAL: readonly TrialQuestion[] = [...written, ...listening];

if (
  WRITTEN.remainingWritten !== 0
  || LISTENING.remainingListening !== 0
  || written.length !== 65
  || listening.length !== 24
  || new Set(N5_2011_12_TRIAL.map((question) => question.id)).size !== 89
) {
  throw new Error('N5 2010–2011 source package must contain 65 written and 24 listening responses.');
}

if (N5_2011_12_TRIAL.some((question) => !question.promptJa || ![3, 4].includes(question.options.length) || question.options.some((option) => !option.textJa))) {
  throw new Error('N5 2010–2011 source package contains an incomplete question.');
}
