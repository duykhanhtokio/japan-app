import type { ImageSourcePropType } from 'react-native';

import { N1_2012_07_AUDIO } from '@/data/jlpt-mock/n1-2012-07-official';
import { N1_2012_07_SESSION_KEY, N1_2012_07_TRIAL, type TrialQuestion } from '@/data/jlpt-official/n1-2012-07-trial';
import { N1_2013_07_SESSION_KEY, N1_2013_07_TRIAL } from '@/data/jlpt-official/n1-2013-07-trial';
import { N1_2013_12_SESSION_KEY, N1_2013_12_TRIAL } from '@/data/jlpt-official/n1-2013-12-trial';
import { N1_2014_07_SESSION_KEY, N1_2014_07_TRIAL } from '@/data/jlpt-official/n1-2014-07-trial';
import { N1_2015_12_SESSION_KEY, N1_2015_12_TRIAL } from '@/data/jlpt-official/n1-2015-12-trial';
import { N1_2016_07_SESSION_KEY, N1_2016_07_TRIAL } from '@/data/jlpt-official/n1-2016-07-trial';
import { N1_2016_12_SESSION_KEY, N1_2016_12_TRIAL } from '@/data/jlpt-official/n1-2016-12-trial';
import { N1_2017_07_SESSION_KEY, N1_2017_07_TRIAL } from '@/data/jlpt-official/n1-2017-07-trial';
import { N1_2017_12_SESSION_KEY, N1_2017_12_TRIAL } from '@/data/jlpt-official/n1-2017-12-trial';
import { N1_2018_07_SESSION_KEY, N1_2018_07_TRIAL } from '@/data/jlpt-official/n1-2018-07-trial';
import { N1_2018_12_SESSION_KEY, N1_2018_12_TRIAL } from '@/data/jlpt-official/n1-2018-12-trial';
import { N1_2019_07_SESSION_KEY, N1_2019_07_TRIAL } from '@/data/jlpt-official/n1-2019-07-trial';
import { N2_2012_07_AUDIO } from '@/data/jlpt-mock/n2-2012-07-official';
import { N2_2012_07_SESSION_KEY, N2_2012_07_TRIAL } from '@/data/jlpt-official/n2-2012-07-trial';
import { N2_2012_12_AUDIO } from '@/data/jlpt-mock/n2-2012-12-official';
import { N2_2012_12_SESSION_KEY, N2_2012_12_TRIAL } from '@/data/jlpt-official/n2-2012-12-trial';
import { N2_2013_07_AUDIO } from '@/data/jlpt-mock/n2-2013-07-official';
import { N2_2013_07_SESSION_KEY, N2_2013_07_TRIAL } from '@/data/jlpt-official/n2-2013-07-trial';
import { N2_2013_12_AUDIO } from '@/data/jlpt-mock/n2-2013-12-official';
import { N2_2013_12_SESSION_KEY, N2_2013_12_TRIAL } from '@/data/jlpt-official/n2-2013-12-trial';
import { N2_2014_07_AUDIO } from '@/data/jlpt-mock/n2-2014-07-official';
import { N2_2014_07_SESSION_KEY, N2_2014_07_TRIAL } from '@/data/jlpt-official/n2-2014-07-trial';
import { n1December2013Explanation } from '@/data/jlpt-official/n1-2013-12-explanations';
import type { AppLanguageCode } from '@/i18n/languages';

type RawOption = { optionId: string; textJa: string };
type RawPassage = { passageId: string; textJa: string };
type RawGroup = { problemNumber: number; instructionJa: string };
type RawWrittenQuestion = {
  questionId: string; sectionId: string; problemNumber: number; questionNumber: number;
  family: TrialQuestion['family']; promptJa: string; passageId?: string; options: RawOption[];
  correctOptionId: string; source: { questionPage: number; answerPage: number };
};
type RawListeningQuestion = {
  questionId: string; sectionId: string; problemNumber: number; questionNumber: number;
  family: 'listening'; instructionJa: string; promptJa: string; options: RawOption[];
  correctOptionId: string;
  audio: { segmentId: string; startMs: number; endMs: number; transcriptJa: string; transcriptSourcePages: number[] };
  source: { questionPages: number[]; answerScriptPages: number[] };
};
type RawWritten = { problemGroups: RawGroup[]; passages: RawPassage[]; questions: RawWrittenQuestion[] };
type RawListening = { questions: RawListeningQuestion[] };
type LocalizedExplanation = { localeCode: AppLanguageCode; text: string; status: 'translated_verified' | 'translated_ai_unreviewed' };
type ExplanationRecord = { questionId: string; localizedExplanations: LocalizedExplanation[] };
type RawExplanations = { records: ExplanationRecord[] };

export type ApprovedN1Exam = {
  id: string;
  level: 'N1' | 'N2' | 'N3';
  title: string;
  periodLabel: string;
  startLabel: string;
  storageKey: string;
  questions: readonly TrialQuestion[];
  audioSource: number;
  visualOptions: Readonly<Record<number, ImageSourcePropType>>;
  explanationFor?: (questionId: string, language: AppLanguageCode) => string | undefined;
};

const WRITTEN = require('./n1-2012-12/written.json') as RawWritten;
const LISTENING = require('./n1-2012-12/listening.json') as RawListening;
const EXPLANATIONS = require('./n1-2012-12/explanations.13-locales.json') as RawExplanations;

const passageById = new Map(WRITTEN.passages.map((passage) => [passage.passageId, passage.textJa]));
const instructionByProblem = new Map(WRITTEN.problemGroups.map((group) => [group.problemNumber, group.instructionJa]));
const explanationByQuestion = new Map(EXPLANATIONS.records.map((record) => [record.questionId, record.localizedExplanations]));

function familyLabel(question: Pick<TrialQuestion, 'family'>) {
  if (question.family === 'vocabulary') return '文字・語彙';
  if (question.family === 'grammar' || question.family === 'sentenceComposition') return '文法';
  if (question.family === 'reading') return '読解';
  return '聴解';
}

function options(raw: RawOption[]): TrialQuestion['options'] {
  return raw.map((option) => ({ id: option.optionId as '1' | '2' | '3' | '4', textJa: option.textJa }));
}

const writtenQuestions: TrialQuestion[] = WRITTEN.questions.map((question) => ({
  id: question.questionId,
  sectionId: question.sectionId,
  problemNumber: question.problemNumber,
  questionNumber: question.questionNumber,
  family: question.family,
  label: `${familyLabel(question)}／問題${question.problemNumber}／${question.questionNumber}`,
  instructionJa: instructionByProblem.get(question.problemNumber) ?? '',
  promptJa: question.promptJa,
  passageId: question.passageId,
  passageJa: question.passageId ? passageById.get(question.passageId) : undefined,
  options: options(question.options),
  correctOptionId: question.correctOptionId as '1' | '2' | '3' | '4',
  sourcePage: question.source.questionPage,
  answerSourcePage: question.source.answerPage,
  explanationStatus: 'missing',
  generatedExplanationStatus: 'not_generated',
}));

const listeningQuestions: TrialQuestion[] = LISTENING.questions.map((question) => ({
  id: question.questionId,
  sectionId: question.sectionId,
  problemNumber: question.problemNumber,
  questionNumber: question.questionNumber,
  family: 'listening',
  label: `聴解／問題${question.problemNumber}／${question.questionNumber}`,
  instructionJa: question.instructionJa,
  promptJa: question.promptJa,
  options: options(question.options),
  correctOptionId: question.correctOptionId as '1' | '2' | '3' | '4',
  sourcePage: question.source.questionPages[0] ?? 1,
  answerSourcePage: question.source.answerScriptPages[0] ?? 1,
  explanationStatus: 'missing',
  generatedExplanationStatus: 'not_generated',
  audio: {
    segmentId: question.audio.segmentId,
    startMs: question.audio.startMs,
    endMs: question.audio.endMs,
    transcriptJa: question.audio.transcriptJa,
    transcriptSourcePage: question.audio.transcriptSourcePages[0] ?? 1,
  },
}));

const N1_2012_12_QUESTIONS = [...writtenQuestions, ...listeningQuestions];

function localizedExplanation(questionId: string, language: AppLanguageCode) {
  const entries = explanationByQuestion.get(questionId);
  return entries?.find((item) => item.localeCode === language)?.text
    ?? entries?.find((item) => item.localeCode === 'en')?.text
    ?? entries?.find((item) => item.localeCode === 'zh-CN')?.text;
}

export const APPROVED_N1_EXAMS: readonly ApprovedN1Exam[] = [
  {
    id: 'n1-2012-07-exam-01', level: 'N1', title: '日本語能力試験 N1', periodLabel: '2012年7月・第1回',
    startLabel: '第1回を始める', storageKey: N1_2012_07_SESSION_KEY, questions: N1_2012_07_TRIAL,
    audioSource: N1_2012_07_AUDIO,
    visualOptions: {
      12: require('../../../assets/jlpt/n1/2012-07/visual-options/problem1-item1.jpg'),
      13: require('../../../assets/jlpt/n1/2012-07/visual-options/problem1-item6.jpg'),
    },
  },
  {
    id: 'n1-2012-12-exam-02', level: 'N1', title: '日本語能力試験 N1', periodLabel: '2012年12月・第2回',
    startLabel: '第2回を始める', storageKey: 'jlpt:n1:2012-12:exam-02:session:v1', questions: N1_2012_12_QUESTIONS,
    audioSource: require('../../../assets/jlpt/n1/2012-12/audio/n1-2012-12.mp3'), visualOptions: {},
    explanationFor: localizedExplanation,
  },
  {
    id: 'n1-2013-07-exam-03', level: 'N1', title: '日本語能力試験 N1', periodLabel: '2013年7月・第3回',
    startLabel: '第3回を始める', storageKey: N1_2013_07_SESSION_KEY, questions: N1_2013_07_TRIAL,
    audioSource: require('../../../assets/jlpt/n1/2013-07/audio/n1-2013-07.mp3'), visualOptions: {},
  },
  {
    // Runtime and audio accepted by the user on 2026-09-17.
    id: 'n1-2013-12-exam-04', level: 'N1', title: '日本語能力試験 N1', periodLabel: '2013年12月・第4回',
    startLabel: '第4回を始める', storageKey: N1_2013_12_SESSION_KEY, questions: N1_2013_12_TRIAL,
    audioSource: require('../../../assets/jlpt/n1/2013-12/audio/n1-2013-12.mp3'), visualOptions: {},
    explanationFor: n1December2013Explanation,
  },
  {
    // Source-verified candidate; final Simulator/audio review pending.
    id: 'n1-2014-07-exam-05', level: 'N1', title: '日本語能力試験 N1', periodLabel: '2014年7月・第5回',
    startLabel: '第5回を始める', storageKey: N1_2014_07_SESSION_KEY, questions: N1_2014_07_TRIAL,
    audioSource: require('../../../assets/jlpt/n1/2014-07/audio/n1-2014-07.mp3'), visualOptions: {},
  },
  {
    // Complete source-backed candidate; audio timing remains candidate/unverified.
    id: 'n1-2015-12-exam-08', level: 'N1', title: '日本語能力試験 N1', periodLabel: '2015年12月・第8回',
    startLabel: '第8回を始める', storageKey: N1_2015_12_SESSION_KEY, questions: N1_2015_12_TRIAL,
    audioSource: require('../../../assets/jlpt/n1/2015-12/audio/n1-2015-12.mp3'), visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing is deliberately candidate/unverified.
    id: 'n1-2016-07-exam-09', level: 'N1', title: '日本語能力試験 N1', periodLabel: '2016年7月・第9回',
    startLabel: '第9回を始める', storageKey: N1_2016_07_SESSION_KEY, questions: N1_2016_07_TRIAL,
    audioSource: require('../../../assets/jlpt/n1/2016-07/audio/n1-2016-07.mp3'), visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n1-2016-12-exam-10', level: 'N1', title: '日本語能力試験 N1', periodLabel: '2016年12月・第10回',
    startLabel: '第10回を始める', storageKey: N1_2016_12_SESSION_KEY, questions: N1_2016_12_TRIAL,
    audioSource: require('../../../assets/jlpt/n1/2016-12/audio/n1-2016-12.m4a'), visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n1-2017-07-exam-11', level: 'N1', title: '日本語能力試験 N1', periodLabel: '2017年7月・第11回',
    startLabel: '第11回を始める', storageKey: N1_2017_07_SESSION_KEY, questions: N1_2017_07_TRIAL,
    audioSource: require('../../../assets/jlpt/n1/2017-07/audio/n1-2017-07.m4a'), visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n1-2017-12-exam-12', level: 'N1', title: '日本語能力試験 N1', periodLabel: '2017年12月・第12回',
    startLabel: '第12回を始める', storageKey: N1_2017_12_SESSION_KEY, questions: N1_2017_12_TRIAL,
    audioSource: require('../../../assets/jlpt/n1/2017-12/audio/n1-2017-12.m4a'), visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n1-2018-07-exam-13', level: 'N1', title: '日本語能力試験 N1', periodLabel: '2018年7月・第13回',
    startLabel: '第13回を始める', storageKey: N1_2018_07_SESSION_KEY, questions: N1_2018_07_TRIAL,
    audioSource: require('../../../assets/jlpt/n1/2018-07/audio/n1-2018-07.mp3'), visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n1-2018-12-exam-14', level: 'N1', title: '日本語能力試験 N1', periodLabel: '2018年12月・第14回',
    startLabel: '第14回を始める', storageKey: N1_2018_12_SESSION_KEY, questions: N1_2018_12_TRIAL,
    audioSource: require('../../../assets/jlpt/n1/2018-12/audio/n1-2018-12.mp3'), visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n1-2019-07-exam-15', level: 'N1', title: '日本語能力試験 N1', periodLabel: '2019年7月・第15回',
    startLabel: '第15回を始める', storageKey: N1_2019_07_SESSION_KEY, questions: N1_2019_07_TRIAL,
    audioSource: require('../../../assets/jlpt/n1/2019-07/audio/n1-2019-07.mp3'), visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n2-2012-07-exam-01', level: 'N2', title: '日本語能力試験 N2', periodLabel: '2012年7月・第1回',
    startLabel: '第1回を始める', storageKey: N2_2012_07_SESSION_KEY, questions: N2_2012_07_TRIAL,
    audioSource: N2_2012_07_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n2-2012-12-exam-02', level: 'N2', title: '日本語能力試験 N2', periodLabel: '2012年12月・第2回',
    startLabel: '第2回を始める', storageKey: N2_2012_12_SESSION_KEY, questions: N2_2012_12_TRIAL,
    audioSource: N2_2012_12_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n2-2013-07-exam-03', level: 'N2', title: '日本語能力試験 N2', periodLabel: '2013年7月・第3回',
    startLabel: '第3回を始める', storageKey: N2_2013_07_SESSION_KEY, questions: N2_2013_07_TRIAL,
    audioSource: N2_2013_07_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n2-2013-12-exam-04', level: 'N2', title: '日本語能力試験 N2', periodLabel: '2013年12月・第4回',
    startLabel: '第4回を始める', storageKey: N2_2013_12_SESSION_KEY, questions: N2_2013_12_TRIAL,
    audioSource: N2_2013_12_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n2-2014-07-exam-05', level: 'N2', title: '日本語能力試験 N2', periodLabel: '2014年7月・第5回',
    startLabel: '第5回を始める', storageKey: N2_2014_07_SESSION_KEY, questions: N2_2014_07_TRIAL,
    audioSource: N2_2014_07_AUDIO, visualOptions: {},
  },
];

if (writtenQuestions.length !== 70 || listeningQuestions.length !== 36 || N1_2012_12_QUESTIONS.length !== 106) {
  throw new Error('N1 2012-12 exam 02 must contain 70 written and 36 listening responses.');
}
