import type { TrialQuestion } from './n1-2012-07-trial';

type Written = { id: string; prompt: string; options: string[]; passage?: string };
type Listening = { id: string; prompt: string; options: string[]; visual?: string | null; sourcePage: number; startMs: number; endMs: number; transcriptCandidate: string };
type Assembly = { records: { questionId: string; section: string; problemNumber: number; questionNumber: number; sourcePages: number[]; candidateAnswer: number }[] };
const WRITTEN = require('./n5-2021-12/written.candidate.json') as { questions: Written[]; passages: Record<string, string> };
const LISTENING = require('./n5-2021-12/listening.candidate.json') as { questions: Listening[] };
const ASSEMBLY = require('../../../docs/jlpt-workspace/conversion/n5-2021-12/response-assembly.candidate.json') as Assembly;
const byId = new Map(ASSEMBLY.records.map(record => [record.questionId, record]));
const visualIds = ['p1q1','p1q2','p1q3','p1q4','p1q7','p2q1','p2q2','p2q3','p2q4','p2q6','p3q1','p3q2','p3q3','p3q4','p3q5'];

export const N5_2021_12_SESSION_KEY = 'jlpt:n5:2021-12:exam-07:session:v1';
export const N5_2021_12_TRIAL: readonly TrialQuestion[] = [
  ...WRITTEN.questions.map((question): TrialQuestion => {
    const source = byId.get(question.id);
    if (!source) throw new Error(`N5 2021 written source missing: ${question.id}`);
    const vocabulary = source.section === 'vocabulary';
    const family: TrialQuestion['family'] = vocabulary ? 'vocabulary' : source.problemNumber === 2 ? 'sentenceComposition' : source.problemNumber <= 3 ? 'grammar' : 'reading';
    const passageId = Object.keys(WRITTEN.passages).find(id => id === question.id ||
      (id === 'grammar-reading-p3-q1' && question.id === 'grammar-reading-p3-q2') ||
      (id === 'grammar-reading-p3-q3' && question.id === 'grammar-reading-p3-q4') ||
      (id === 'grammar-reading-p5-q1' && question.id === 'grammar-reading-p5-q2'));
    return {
      id: question.id, sectionId: vocabulary ? 'vocabulary' : 'grammar-reading', problemNumber: source.problemNumber,
      questionNumber: source.questionNumber, family, label: `${vocabulary ? '文字・語彙' : family === 'reading' ? '読解' : '文法'}／問題${source.problemNumber}／${source.questionNumber}`,
      instructionJa: source.problemNumber === 2 && !vocabulary ? '★ に入るものを選んでください。' : '1・2・3・4からいちばんいいものを一つ選んでください。',
      promptJa: question.prompt, passageId, passageJa: passageId ? WRITTEN.passages[passageId] : undefined,
      options: question.options.map((textJa, index) => ({ id: String(index + 1) as '1'|'2'|'3'|'4', textJa })),
      correctOptionId: String(source.candidateAnswer) as '1'|'2'|'3'|'4', sourcePage: source.sourcePages[0], answerSourcePage: source.sourcePages[0],
      explanationStatus: 'missing', generatedExplanationStatus: 'not_generated',
    };
  }),
  ...LISTENING.questions.map((question): TrialQuestion => {
    const source = byId.get(question.id);
    if (!source) throw new Error(`N5 2021 listening source missing: ${question.id}`);
    const visualIndex = question.visual ? visualIds.indexOf(question.visual) : -1;
    return {
      id: question.id, sectionId: 'listening', problemNumber: source.problemNumber, questionNumber: source.questionNumber,
      family: 'listening', label: `聴解／問題${source.problemNumber}／${source.questionNumber}`,
      instructionJa: '録音を続けて聞き、いちばんいいものを選んでください。', promptJa: question.prompt,
      options: question.options.map((textJa, index) => ({ id: String(index + 1) as '1'|'2'|'3'|'4', textJa })),
      correctOptionId: String(source.candidateAnswer) as '1'|'2'|'3'|'4', sourcePage: question.sourcePage, answerSourcePage: question.sourcePage,
      visualOptionPage: visualIndex < 0 ? undefined : 101 + visualIndex,
      explanationStatus: 'missing', generatedExplanationStatus: 'not_generated',
      audio: { segmentId: question.id, startMs: question.startMs, endMs: question.endMs, transcriptJa: question.transcriptCandidate, transcriptSourcePage: question.sourcePage },
    };
  }),
];
if (WRITTEN.questions.length !== 43 || LISTENING.questions.length !== 24 || new Set(N5_2021_12_TRIAL.map(q => q.id)).size !== 67) throw new Error('N5 2021-12 response count mismatch.');
if (N5_2021_12_TRIAL.some(q => !q.promptJa || q.options.length < 3 || q.options.some(o => !o.textJa) || !q.correctOptionId)) throw new Error('N5 2021-12 question content incomplete.');
