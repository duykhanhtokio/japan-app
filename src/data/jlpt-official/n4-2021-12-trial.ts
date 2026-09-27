import type { TrialQuestion } from './n1-2012-07-trial';

type WrittenCandidate = {
  id: string;
  sourcePage: number;
  prompt: string;
  options: string[];
  answer: number;
};

type ListeningCandidate = WrittenCandidate & {
  candidateStartMs: number;
  candidateEndMs: number;
  timingVerificationStatus: 'candidate_unverified';
  humanReviewed: false;
  perceptualApproval: false;
  reviewDisposition: 'needs_later_review';
  visualOptionAsset?: string | null;
};

const WRITTEN = require('../../../docs/jlpt-workspace/conversion/n4-2021-12/written.partial.json') as {
  questions: WrittenCandidate[];
  remainingWritten: number;
};
const LISTENING = require('../../../docs/jlpt-workspace/conversion/n4-2021-12/listening.partial.json') as {
  questions: ListeningCandidate[];
  remainingListening: number;
};

const optionId = (index: number) => String(index + 1) as '1' | '2' | '3' | '4';
const parsePosition = (id: string) => {
  const match = id.match(/-p(\d+)-q(\d+)$/);
  if (!match) throw new Error(`N4 2021-12 question ID is invalid: ${id}`);
  return { problemNumber: Number(match[1]), questionNumber: Number(match[2]) };
};

const visualPageByAsset = new Map([
  ['assets/jlpt/n4/2021-12/visual-options/listening-p1-q2.jpg', 201],
  ['assets/jlpt/n4/2021-12/visual-options/listening-p1-q3-q4.jpg', 202],
  ['assets/jlpt/n4/2021-12/visual-options/listening-p1-q6.jpg', 203],
  ['assets/jlpt/n4/2021-12/visual-options/listening-p3-q1.jpg', 204],
  ['assets/jlpt/n4/2021-12/visual-options/listening-p3-q2-q3.jpg', 205],
  ['assets/jlpt/n4/2021-12/visual-options/listening-p3-q4-q5.jpg', 206],
]);

export const N4_2021_12_SESSION_KEY = 'jlpt:n4:2021-12:exam-09:session:v1';

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
    visualOptionPage: question.visualOptionAsset ? visualPageByAsset.get(question.visualOptionAsset) : undefined,
    explanationStatus: 'missing',
    generatedExplanationStatus: 'not_generated',
    // N4/N5 playback uses the complete recording. Candidate ranges remain review metadata.
    audio: {
      segmentId: 'n4-2021-12-continuous',
      startMs: 0,
      endMs: 2327197,
      transcriptJa: '',
    },
  };
});

export const N4_2021_12_TRIAL: readonly TrialQuestion[] = [...written, ...listening];

if (
  WRITTEN.remainingWritten !== 0
  || LISTENING.remainingListening !== 0
  || written.length !== 57
  || listening.length !== 28
  || new Set(N4_2021_12_TRIAL.map((question) => question.id)).size !== 85
) {
  throw new Error('N4 2021-12 source package must contain 57 written and 28 listening responses.');
}

if (N4_2021_12_TRIAL.some((question) => !question.promptJa || ![3, 4].includes(question.options.length) || question.options.some((option) => !option.textJa))) {
  throw new Error('N4 2021-12 source package contains an incomplete question.');
}
