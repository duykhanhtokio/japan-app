// Complete source-backed candidate; audio timing remains candidate/unverified pending later perceptual review.
import type { TrialQuestion } from './n1-2012-07-trial';

type DatasetQuestion = {
  questionId: string;
  sectionId: string;
  problemNumber: number;
  questionNumber: number;
  responseSuffix?: 'a' | 'b';
  family: TrialQuestion['family'];
  instructionJa: string;
  promptJa: string;
  passageId?: string;
  options: { optionId: string; textJa: string }[];
  correctOptionId: string;
  source: { questionPage?: number; questionPages?: number[]; answerPage?: number; answerScriptPages?: number[] };
  audio?: { segmentId: string; startMs: number; endMs: number; transcriptJa: string; transcriptSourcePages: number[] };
};
type Dataset = { passages: Record<string, { text: string }>; questions: DatasetQuestion[] };

const DATASET = require('./n1-2015-12/exam.candidate.json') as Dataset;

function familyLabel(family: TrialQuestion['family']) {
  if (family === 'vocabulary') return '文字・語彙';
  if (family === 'grammar' || family === 'sentenceComposition') return '文法';
  if (family === 'reading') return '読解';
  return '聴解';
}

export const N1_2015_12_SESSION_KEY = 'jlpt:n1:2015-12:exam-08:session:v1';
export const N1_2015_12_TRIAL: readonly TrialQuestion[] = DATASET.questions.map((question) => ({
  id: question.questionId,
  sectionId: question.sectionId,
  problemNumber: question.problemNumber,
  questionNumber: question.questionNumber,
  family: question.family,
  label: `${familyLabel(question.family)}／問題${question.problemNumber}／${question.questionNumber}${question.responseSuffix ? `／質問${question.responseSuffix === 'a' ? 1 : 2}` : ''}`,
  instructionJa: question.instructionJa,
  promptJa: question.promptJa,
  passageId: question.passageId,
  passageJa: question.passageId ? DATASET.passages[question.passageId]?.text : undefined,
  options: question.options.map((option) => ({ id: option.optionId as '1' | '2' | '3' | '4', textJa: option.textJa })),
  correctOptionId: question.correctOptionId as '1' | '2' | '3' | '4',
  sourcePage: question.source.questionPage ?? question.source.questionPages?.[0] ?? 1,
  answerSourcePage: question.source.answerPage ?? question.source.answerScriptPages?.[0] ?? 1,
  explanationStatus: 'missing',
  generatedExplanationStatus: 'not_generated',
  audio: question.audio ? {
    segmentId: question.audio.segmentId,
    startMs: question.audio.startMs,
    endMs: question.audio.endMs,
    transcriptJa: question.audio.transcriptJa,
    transcriptSourcePage: question.audio.transcriptSourcePages[0] ?? 1,
  } : undefined,
}));

if (N1_2015_12_TRIAL.length !== 107) throw new Error('N1 2015-12 must contain 107 responses.');
if (new Set(N1_2015_12_TRIAL.map((question) => question.id)).size !== 107) throw new Error('N1 2015-12 contains duplicate question IDs.');
if (N1_2015_12_TRIAL.filter((question) => question.family !== 'listening').length !== 70) throw new Error('N1 2015-12 must contain 70 written responses.');
if (N1_2015_12_TRIAL.filter((question) => question.family === 'listening').length !== 37) throw new Error('N1 2015-12 must contain 37 listening responses.');
if (new Set(N1_2015_12_TRIAL.flatMap((question) => question.audio?.segmentId ?? [])).size !== 36) throw new Error('N1 2015-12 must contain 36 unique candidate audio segments.');
