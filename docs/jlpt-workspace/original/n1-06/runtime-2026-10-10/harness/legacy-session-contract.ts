// Isolated QA: runtime session key only; no legacy question or audio inputs.
export const N1_2012_07_SESSION_KEY = 'jlpt:n1:2012-07:exam-01:session:v1';

// Structural type contracts only, extracted with AST; question arrays excluded.
export type TrialOption = { id: '1' | '2' | '3' | '4'; textJa: string; imageAssetId?: string; imageRegionId?: string };
export type TrialQuestion = {
  id: string; sectionId: string; problemNumber: number; questionNumber: number;
  family: 'vocabulary' | 'grammar' | 'sentenceComposition' | 'reading' | 'listening';
  label: string; instructionJa: string; promptJa: string; passageJa?: string; passageId?: string;
  options: readonly TrialOption[]; correctOptionId: '1' | '2' | '3' | '4';
  sourcePage: number; answerSourcePage?: number; visualOptionPage?: number;
  explanationStatus: 'missing'; generatedExplanationStatus: 'not_generated';
  audio?: { segmentId: string; startMs: number; endMs: number; transcriptJa: string; transcriptSourcePage?: number };
};
type VerifiedOption = { optionId: TrialOption['id']; textJa?: string; imageAssetId?: string; imageRegionId?: string };
type VerifiedQuestion = {
  questionId: string; sectionId: string; problemNumber: number; questionNumber: number; family: TrialQuestion['family'];
  instructionJa: string; promptJa: string; passageId?: string; options: VerifiedOption[];
  correctOptionId: TrialQuestion['correctOptionId']; transcriptJa?: string; transcriptSourcePage?: number; verificationStatus: 'verified';
  source: { questionPage: number; answerPage: number; imageRegion?: { pageAsset: string } };
  audio?: { segmentId: string; startMs: number; endMs: number; timingConfidence: 'verified' | 'candidate_unverified'; verificationStatus: 'verified' | 'needs_runtime_review' };
};
type VerifiedDataset = {
  examId: string;
  counts: { writtenResponses: number; listeningResponses: number; totalResponses: number; uniqueAudioSegments: number };
  passages: Record<string, { text: string }>;
  questions: VerifiedQuestion[];
};
