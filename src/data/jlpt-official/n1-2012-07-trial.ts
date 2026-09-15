export type TrialOption = { id: '1' | '2' | '3' | '4'; textJa: string; imageAssetId?: string; imageRegionId?: string };
export type TrialQuestion = {
  id: string; sectionId: string; problemNumber: number; questionNumber: number;
  family: 'vocabulary' | 'grammar' | 'sentenceComposition' | 'reading' | 'listening';
  label: string; instructionJa: string; promptJa: string; passageJa?: string; passageId?: string;
  options: readonly TrialOption[]; correctOptionId: '1' | '2' | '3' | '4';
  sourcePage: number; answerSourcePage: number; visualOptionPage?: 12 | 13;
  explanationStatus: 'missing'; generatedExplanationStatus: 'not_generated';
  audio?: { segmentId: string; startMs: number; endMs: number; transcriptJa: string; transcriptSourcePage: number };
};
type VerifiedOption = { optionId: TrialOption['id']; textJa?: string; imageAssetId?: string; imageRegionId?: string };
type VerifiedQuestion = {
  questionId: string; sectionId: string; problemNumber: number; questionNumber: number; family: TrialQuestion['family'];
  instructionJa: string; promptJa: string; passageId?: string; options: VerifiedOption[];
  correctOptionId: TrialQuestion['correctOptionId']; transcriptJa?: string; transcriptSourcePage?: number; verificationStatus: 'verified';
  source: { questionPage: number; answerPage: number; imageRegion?: { pageAsset: string } };
  audio?: { segmentId: string; startMs: number; endMs: number; timingConfidence: 'verified'; verificationStatus: 'verified' | 'needs_runtime_review' };
};
type VerifiedDataset = {
  examId: string;
  counts: { writtenResponses: number; listeningResponses: number; totalResponses: number; uniqueAudioSegments: number };
  passages: Record<string, { text: string }>;
  questions: VerifiedQuestion[];
};

// Generated only after visual PDF verification and listener boundary review.
const DATASET = require('./n1-2012-07-exam-01.verified.json') as VerifiedDataset;

function familyLabel(question: VerifiedQuestion) {
  if (question.family === 'vocabulary') return '文字・語彙';
  if (question.family === 'grammar' || question.family === 'sentenceComposition') return '文法';
  if (question.family === 'reading') return '読解';
  return '聴解';
}

function questionLabel(question: VerifiedQuestion) {
  const match = question.family === 'listening' ? question.questionId.match(/q(\d+)(?:-(\d+))?$/) : null;
  const itemLabel = match?.[2] ? `${Number(match[1])}／質問${Number(match[2])}` : match?.[1] ? String(Number(match[1])) : String(question.questionNumber);
  return `${familyLabel(question)}／問題${question.problemNumber}／${itemLabel}`;
}

function toRuntimeQuestion(question: VerifiedQuestion): TrialQuestion {
  const visualOptionPage = question.source.imageRegion?.pageAsset.endsWith('page-12.jpg') ? 12
    : question.source.imageRegion?.pageAsset.endsWith('page-13.jpg') ? 13 : undefined;
  return {
    id: question.questionId, sectionId: question.sectionId, problemNumber: question.problemNumber,
    questionNumber: question.questionNumber, family: question.family, label: questionLabel(question),
    instructionJa: question.instructionJa, promptJa: question.promptJa, passageId: question.passageId,
    passageJa: question.passageId ? DATASET.passages[question.passageId]?.text : undefined,
    options: question.options.map((option) => ({ id: option.optionId, textJa: option.textJa ?? `図 ${option.optionId}`, imageAssetId: option.imageAssetId, imageRegionId: option.imageRegionId })),
    correctOptionId: question.correctOptionId, sourcePage: question.source.questionPage,
    answerSourcePage: question.source.answerPage, visualOptionPage,
    explanationStatus: 'missing', generatedExplanationStatus: 'not_generated',
    audio: question.audio ? { segmentId: question.audio.segmentId, startMs: question.audio.startMs, endMs: question.audio.endMs, transcriptJa: question.transcriptJa ?? '', transcriptSourcePage: question.transcriptSourcePage ?? question.source.answerPage } : undefined,
  };
}

export const N1_2012_07_EXAM_ID = DATASET.examId;
export const N1_2012_07_SESSION_KEY = 'jlpt:n1:2012-07:exam-01:session:v1';
export const N1_2012_07_TRIAL: readonly TrialQuestion[] = DATASET.questions.map(toRuntimeQuestion);

if (N1_2012_07_TRIAL.length !== 106) throw new Error('N1 2012-07 exam 01 must contain 106 responses.');
if (new Set(N1_2012_07_TRIAL.map((question) => question.id)).size !== 106) throw new Error('N1 2012-07 exam 01 contains duplicate question IDs.');
if (N1_2012_07_TRIAL.filter((question) => question.family !== 'listening').length !== 70) throw new Error('N1 2012-07 exam 01 must contain 70 written responses.');
if (N1_2012_07_TRIAL.filter((question) => question.family === 'listening').length !== 36) throw new Error('N1 2012-07 exam 01 must contain 36 listening responses.');
if (new Set(N1_2012_07_TRIAL.flatMap((question) => question.audio?.segmentId ?? [])).size !== 35) throw new Error('N1 2012-07 exam 01 must contain 35 unique audio segments.');
