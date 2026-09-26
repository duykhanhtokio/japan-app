import type { ImageSourcePropType } from 'react-native';

import { N1_2012_07_AUDIO } from '@/data/jlpt-mock/n1-2012-07-official';
import { N1_2012_07_SESSION_KEY, N1_2012_07_TRIAL, type TrialQuestion } from '@/data/jlpt-official/n1-2012-07-trial';
import { N1_2013_07_SESSION_KEY, N1_2013_07_TRIAL } from '@/data/jlpt-official/n1-2013-07-trial';
import { N1_2013_12_SESSION_KEY, N1_2013_12_TRIAL } from '@/data/jlpt-official/n1-2013-12-trial';
import { N1_2014_07_SESSION_KEY, N1_2014_07_TRIAL } from '@/data/jlpt-official/n1-2014-07-trial';
import { N1_2014_12_AUDIO } from '@/data/jlpt-mock/n1-2014-12-official';
import { N1_2014_12_SESSION_KEY, N1_2014_12_TRIAL } from '@/data/jlpt-official/n1-2014-12-trial';
import { N1_2015_07_AUDIO } from '@/data/jlpt-mock/n1-2015-07-official';
import { N1_2015_07_SESSION_KEY, N1_2015_07_TRIAL } from '@/data/jlpt-official/n1-2015-07-trial';
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
import { N2_2014_12_AUDIO } from '@/data/jlpt-mock/n2-2014-12-official';
import { N2_2014_12_SESSION_KEY, N2_2014_12_TRIAL } from '@/data/jlpt-official/n2-2014-12-trial';
import { N2_2015_07_AUDIO } from '@/data/jlpt-mock/n2-2015-07-official';
import { N2_2015_07_SESSION_KEY, N2_2015_07_TRIAL } from '@/data/jlpt-official/n2-2015-07-trial';
import { N2_2015_12_AUDIO } from '@/data/jlpt-mock/n2-2015-12-official';
import { N2_2015_12_SESSION_KEY, N2_2015_12_TRIAL } from '@/data/jlpt-official/n2-2015-12-trial';
import { N2_2016_07_AUDIO } from '@/data/jlpt-mock/n2-2016-07-official';
import { N2_2016_07_SESSION_KEY, N2_2016_07_TRIAL } from '@/data/jlpt-official/n2-2016-07-trial';
import { N2_2016_12_AUDIO } from '@/data/jlpt-mock/n2-2016-12-official';
import { N2_2016_12_SESSION_KEY, N2_2016_12_TRIAL } from '@/data/jlpt-official/n2-2016-12-trial';
import { N2_2017_07_AUDIO } from '@/data/jlpt-mock/n2-2017-07-official';
import { N2_2017_07_SESSION_KEY, N2_2017_07_TRIAL } from '@/data/jlpt-official/n2-2017-07-trial';
import { N2_2017_12_AUDIO } from '@/data/jlpt-mock/n2-2017-12-official';
import { N2_2017_12_SESSION_KEY, N2_2017_12_TRIAL } from '@/data/jlpt-official/n2-2017-12-trial';
import { N2_2018_12_AUDIO } from '@/data/jlpt-mock/n2-2018-12-official';
import { N2_2018_12_SESSION_KEY, N2_2018_12_TRIAL } from '@/data/jlpt-official/n2-2018-12-trial';
import { N3_2012_07_AUDIO } from '@/data/jlpt-mock/n3-2012-07-official';
import { N3_2012_07_SESSION_KEY, N3_2012_07_TRIAL } from '@/data/jlpt-official/n3-2012-07-trial';
import { N3_2012_12_AUDIO } from '@/data/jlpt-mock/n3-2012-12-official';
import { N3_2012_12_SESSION_KEY, N3_2012_12_TRIAL } from '@/data/jlpt-official/n3-2012-12-trial';
import { N3_2013_07_AUDIO } from '@/data/jlpt-mock/n3-2013-07-official';
import { N3_2013_07_SESSION_KEY, N3_2013_07_TRIAL } from '@/data/jlpt-official/n3-2013-07-trial';
import { N3_2013_12_AUDIO } from '@/data/jlpt-mock/n3-2013-12-official';
import { N3_2013_12_SESSION_KEY, N3_2013_12_TRIAL } from '@/data/jlpt-official/n3-2013-12-trial';
import { N3_2014_07_AUDIO } from '@/data/jlpt-mock/n3-2014-07-official';
import { N3_2014_07_SESSION_KEY, N3_2014_07_TRIAL } from '@/data/jlpt-official/n3-2014-07-trial';
import { N3_2014_12_AUDIO } from '@/data/jlpt-mock/n3-2014-12-official';
import { N3_2014_12_SESSION_KEY, N3_2014_12_TRIAL } from '@/data/jlpt-official/n3-2014-12-trial';
import { N3_2015_12_AUDIO } from '@/data/jlpt-mock/n3-2015-12-official';
import { N3_2015_12_SESSION_KEY, N3_2015_12_TRIAL } from '@/data/jlpt-official/n3-2015-12-trial';
import { N3_2016_07_AUDIO } from '@/data/jlpt-mock/n3-2016-07-official';
import { N3_2016_07_SESSION_KEY, N3_2016_07_TRIAL } from '@/data/jlpt-official/n3-2016-07-trial';
import { N3_2016_12_AUDIO } from '@/data/jlpt-mock/n3-2016-12-official';
import { N3_2016_12_SESSION_KEY, N3_2016_12_TRIAL } from '@/data/jlpt-official/n3-2016-12-trial';
import { N3_2017_07_AUDIO } from '@/data/jlpt-mock/n3-2017-07-official';
import { N3_2017_07_SESSION_KEY, N3_2017_07_TRIAL } from '@/data/jlpt-official/n3-2017-07-trial';
import { N3_2017_12_AUDIO } from '@/data/jlpt-mock/n3-2017-12-official';
import { N3_2017_12_SESSION_KEY, N3_2017_12_TRIAL } from '@/data/jlpt-official/n3-2017-12-trial';
import { N3_2018_07_AUDIO } from '@/data/jlpt-mock/n3-2018-07-official';
import { N3_2018_07_SESSION_KEY, N3_2018_07_TRIAL } from '@/data/jlpt-official/n3-2018-07-trial';
import { N3_2018_12_AUDIO } from '@/data/jlpt-mock/n3-2018-12-official';
import { N3_2018_12_SESSION_KEY, N3_2018_12_TRIAL } from '@/data/jlpt-official/n3-2018-12-trial';
import { N3_2020_12_AUDIO } from '@/data/jlpt-mock/n3-2020-12-official';
import { N3_2020_12_SESSION_KEY, N3_2020_12_TRIAL } from '@/data/jlpt-official/n3-2020-12-trial';
import { N3_2021_07_AUDIO } from '@/data/jlpt-mock/n3-2021-07-official';
import { N3_2021_07_SESSION_KEY, N3_2021_07_TRIAL } from '@/data/jlpt-official/n3-2021-07-trial';
import { N3_2021_12_AUDIO } from '@/data/jlpt-mock/n3-2021-12-official';
import { N3_2021_12_SESSION_KEY, N3_2021_12_TRIAL } from '@/data/jlpt-official/n3-2021-12-trial';
import { N3_2022_07_AUDIO } from '@/data/jlpt-mock/n3-2022-07-official';
import { N3_2022_07_SESSION_KEY, N3_2022_07_TRIAL } from '@/data/jlpt-official/n3-2022-07-trial';
import { N4_2013_07_SESSION_KEY, N4_2013_07_TRIAL } from '@/data/jlpt-official/n4-2013-07-trial';
import { N4_2011_12_SESSION_KEY, N4_2011_12_TRIAL } from '@/data/jlpt-official/n4-2011-12-trial';
import { N4_2012_12_SESSION_KEY, N4_2012_12_TRIAL } from '@/data/jlpt-official/n4-2012-12-trial';
import { N4_2013_12_SESSION_KEY, N4_2013_12_TRIAL } from '@/data/jlpt-official/n4-2013-12-trial';
import { N4_2014_07_SESSION_KEY, N4_2014_07_TRIAL } from '@/data/jlpt-official/n4-2014-07-trial';
import { N5_2013_07_SESSION_KEY, N5_2013_07_TRIAL } from '@/data/jlpt-official/n5-2013-07-trial';
import { N5_2021_12_SESSION_KEY, N5_2021_12_TRIAL } from '@/data/jlpt-official/n5-2021-12-trial';
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
  level: 'N1' | 'N2' | 'N3' | 'N4' | 'N5';
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
    id: 'n1-2014-12-exam-06', level: 'N1', title: '日本語能力試験 N1', periodLabel: '2014年12月・第6回',
    startLabel: '第6回を始める', storageKey: N1_2014_12_SESSION_KEY, questions: N1_2014_12_TRIAL,
    audioSource: N1_2014_12_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; audio timing remains candidate/unverified.
    id: 'n1-2015-07-exam-07', level: 'N1', title: '日本語能力試験 N1', periodLabel: '2015年7月・第7回',
    startLabel: '第7回を始める', storageKey: N1_2015_07_SESSION_KEY, questions: N1_2015_07_TRIAL,
    audioSource: N1_2015_07_AUDIO, visualOptions: {},
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
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n2-2014-12-exam-06', level: 'N2', title: '日本語能力試験 N2', periodLabel: '2014年12月・第6回',
    startLabel: '第6回を始める', storageKey: N2_2014_12_SESSION_KEY, questions: N2_2014_12_TRIAL,
    audioSource: N2_2014_12_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n2-2015-07-exam-07', level: 'N2', title: '日本語能力試験 N2', periodLabel: '2015年7月・第7回',
    startLabel: '第7回を始める', storageKey: N2_2015_07_SESSION_KEY, questions: N2_2015_07_TRIAL,
    audioSource: N2_2015_07_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n2-2015-12-exam-08', level: 'N2', title: '日本語能力試験 N2', periodLabel: '2015年12月・第8回',
    startLabel: '第8回を始める', storageKey: N2_2015_12_SESSION_KEY, questions: N2_2015_12_TRIAL,
    audioSource: N2_2015_12_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n2-2016-07-exam-09', level: 'N2', title: '日本語能力試験 N2', periodLabel: '2016年7月・第9回',
    startLabel: '第9回を始める', storageKey: N2_2016_07_SESSION_KEY, questions: N2_2016_07_TRIAL,
    audioSource: N2_2016_07_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n2-2016-12-exam-10', level: 'N2', title: '日本語能力試験 N2', periodLabel: '2016年12月・第10回',
    startLabel: '第10回を始める', storageKey: N2_2016_12_SESSION_KEY, questions: N2_2016_12_TRIAL,
    audioSource: N2_2016_12_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n2-2017-07-exam-11', level: 'N2', title: '日本語能力試験 N2', periodLabel: '2017年7月・第11回',
    startLabel: '第11回を始める', storageKey: N2_2017_07_SESSION_KEY, questions: N2_2017_07_TRIAL,
    audioSource: N2_2017_07_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n2-2017-12-exam-12', level: 'N2', title: '日本語能力試験 N2', periodLabel: '2017年12月・第12回',
    startLabel: '第12回を始める', storageKey: N2_2017_12_SESSION_KEY, questions: N2_2017_12_TRIAL,
    audioSource: N2_2017_12_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n2-2018-12-exam-14', level: 'N2', title: '日本語能力試験 N2', periodLabel: '2018年12月・第14回',
    startLabel: '第14回を始める', storageKey: N2_2018_12_SESSION_KEY, questions: N2_2018_12_TRIAL,
    audioSource: N2_2018_12_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n3-2012-07-exam-01', level: 'N3', title: '日本語能力試験 N3', periodLabel: '2012年7月・第1回',
    startLabel: '第1回を始める', storageKey: N3_2012_07_SESSION_KEY, questions: N3_2012_07_TRIAL,
    audioSource: N3_2012_07_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n3-2012-12-exam-02', level: 'N3', title: '日本語能力試験 N3', periodLabel: '2012年12月・第2回',
    startLabel: '第2回を始める', storageKey: N3_2012_12_SESSION_KEY, questions: N3_2012_12_TRIAL,
    audioSource: N3_2012_12_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n3-2013-07-exam-03', level: 'N3', title: '日本語能力試験 N3', periodLabel: '2013年7月・第3回',
    startLabel: '第3回を始める', storageKey: N3_2013_07_SESSION_KEY, questions: N3_2013_07_TRIAL,
    audioSource: N3_2013_07_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n3-2013-12-exam-04', level: 'N3', title: '日本語能力試験 N3', periodLabel: '2013年12月・第4回',
    startLabel: '第4回を始める', storageKey: N3_2013_12_SESSION_KEY, questions: N3_2013_12_TRIAL,
    audioSource: N3_2013_12_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n3-2014-07-exam-05', level: 'N3', title: '日本語能力試験 N3', periodLabel: '2014年7月・第5回',
    startLabel: '第5回を始める', storageKey: N3_2014_07_SESSION_KEY, questions: N3_2014_07_TRIAL,
    audioSource: N3_2014_07_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n3-2014-12-exam-06', level: 'N3', title: '日本語能力試験 N3', periodLabel: '2014年12月・第6回',
    startLabel: '第6回を始める', storageKey: N3_2014_12_SESSION_KEY, questions: N3_2014_12_TRIAL,
    audioSource: N3_2014_12_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n3-2015-12-exam-08', level: 'N3', title: '日本語能力試験 N3', periodLabel: '2015年12月・第8回',
    startLabel: '第8回を始める', storageKey: N3_2015_12_SESSION_KEY, questions: N3_2015_12_TRIAL,
    audioSource: N3_2015_12_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n3-2016-07-exam-09', level: 'N3', title: '日本語能力試験 N3', periodLabel: '2016年7月・第9回',
    startLabel: '第9回を始める', storageKey: N3_2016_07_SESSION_KEY, questions: N3_2016_07_TRIAL,
    audioSource: N3_2016_07_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n3-2016-12-exam-10', level: 'N3', title: '日本語能力試験 N3', periodLabel: '2016年12月・第10回',
    startLabel: '第10回を始める', storageKey: N3_2016_12_SESSION_KEY, questions: N3_2016_12_TRIAL,
    audioSource: N3_2016_12_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n3-2017-07-exam-11', level: 'N3', title: '日本語能力試験 N3', periodLabel: '2017年7月・第11回',
    startLabel: '第11回を始める', storageKey: N3_2017_07_SESSION_KEY, questions: N3_2017_07_TRIAL,
    audioSource: N3_2017_07_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n3-2017-12-exam-12', level: 'N3', title: '日本語能力試験 N3', periodLabel: '2017年12月・第12回',
    startLabel: '第12回を始める', storageKey: N3_2017_12_SESSION_KEY, questions: N3_2017_12_TRIAL,
    audioSource: N3_2017_12_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n3-2018-07-exam-13', level: 'N3', title: '日本語能力試験 N3', periodLabel: '2018年7月・第13回',
    startLabel: '第13回を始める', storageKey: N3_2018_07_SESSION_KEY, questions: N3_2018_07_TRIAL,
    audioSource: N3_2018_07_AUDIO, visualOptions: {},
  },
  {
    // Complete candidate; one scan-gap placeholder and candidate audio remain for later review.
    id: 'n3-2018-12-exam-14', level: 'N3', title: '日本語能力試験 N3', periodLabel: '2018年12月・第14回',
    startLabel: '第14回を始める', storageKey: N3_2018_12_SESSION_KEY, questions: N3_2018_12_TRIAL,
    audioSource: N3_2018_12_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n3-2020-12-exam-15', level: 'N3', title: '日本語能力試験 N3', periodLabel: '2020年12月・第15回',
    startLabel: '第15回を始める', storageKey: N3_2020_12_SESSION_KEY, questions: N3_2020_12_TRIAL,
    audioSource: N3_2020_12_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n3-2021-07-exam-16', level: 'N3', title: '日本語能力試験 N3', periodLabel: '2021年7月・第16回',
    startLabel: '第16回を始める', storageKey: N3_2021_07_SESSION_KEY, questions: N3_2021_07_TRIAL,
    audioSource: N3_2021_07_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n3-2021-12-exam-17', level: 'N3', title: '日本語能力試験 N3', periodLabel: '2021年12月・第17回',
    startLabel: '第17回を始める', storageKey: N3_2021_12_SESSION_KEY, questions: N3_2021_12_TRIAL,
    audioSource: N3_2021_12_AUDIO, visualOptions: {},
  },
  {
    // Complete source-backed candidate; timing/transcript remain candidate/unverified.
    id: 'n3-2022-07-exam-18', level: 'N3', title: '日本語能力試験 N3', periodLabel: '2022年7月・第18回',
    startLabel: '第18回を始める', storageKey: N3_2022_07_SESSION_KEY, questions: N3_2022_07_TRIAL,
    audioSource: N3_2022_07_AUDIO, visualOptions: {},
  },
  {
    // The supplied 2010–2011 source is a practice package; its original audio plays continuously.
    id: 'n4-2011-12-exam-01', level: 'N4', title: '日本語能力試験 N4', periodLabel: '2010–2011年・第1回',
    startLabel: '第1回を始める', storageKey: N4_2011_12_SESSION_KEY, questions: N4_2011_12_TRIAL,
    audioSource: require('../../../assets/jlpt/n4/2011-12/audio/n4-2011-12.mp3'),
    visualOptions: {
      12: require('../../../assets/jlpt/n4/2011-12/visual-options/problem1-item1.jpg'),
      13: require('../../../assets/jlpt/n4/2011-12/visual-options/problem3-items1-5.jpg'),
    },
    explanationFor: (questionId) => questionId === 'n4-2011-12-grammar_reading-p5-q30'
      ? '答えは3を採用しています。本文では、仕事を始めたころは本の場所を覚え、並べ方を教わるなど、慣れない仕事が多くて大変だったと説明しています。印刷された解答表は4ですが、「一日中ずっと本や雑誌を並べていた」とは本文にありません。\nChọn 3 theo nội dung bài đọc: lúc mới làm có nhiều việc chưa quen. Bảng đáp án in số 4 mâu thuẫn với đoạn văn.'
      : undefined,
  },
  {
    // Source-image-verified content; audio timing remains candidate/unverified pending perceptual review.
    id: 'n4-2012-12-exam-02', level: 'N4', title: '日本語能力試験 N4', periodLabel: '2012年12月・第2回',
    startLabel: '第2回を始める', storageKey: N4_2012_12_SESSION_KEY, questions: N4_2012_12_TRIAL,
    audioSource: require('../../../assets/jlpt/n4/2012-12/audio/n4-2012-12.mp3'), visualOptions: {},
  },
  {
    // Character-verified content; audio timing remains candidate/unverified pending perceptual review.
    id: 'n4-2013-07-exam-03', level: 'N4', title: '日本語能力試験 N4', periodLabel: '2013年7月・第3回',
    startLabel: '第3回を始める', storageKey: N4_2013_07_SESSION_KEY, questions: N4_2013_07_TRIAL,
    audioSource: require('../../../assets/jlpt/n4/2013-07/audio/n4-2013-07.mp3'), visualOptions: {},
  },
  {
    // Character-verified content; audio timing remains candidate/unverified pending perceptual review.
    id: 'n4-2013-12-exam-04', level: 'N4', title: '日本語能力試験 N4', periodLabel: '2013年12月・第4回',
    startLabel: '第4回を始める', storageKey: N4_2013_12_SESSION_KEY, questions: N4_2013_12_TRIAL,
    audioSource: require('../../../assets/jlpt/n4/2013-12/audio/n4-2013-12.mp3'), visualOptions: {},
  },
  {
    // Source-image-verified content; audio timing remains candidate/unverified pending perceptual review.
    id: 'n4-2014-07-exam-05', level: 'N4', title: '日本語能力試験 N4', periodLabel: '2014年7月・第5回',
    startLabel: '第5回を始める', storageKey: N4_2014_07_SESSION_KEY, questions: N4_2014_07_TRIAL,
    audioSource: require('../../../assets/jlpt/n4/2014-07/audio/n4-2014-07.mp3'), visualOptions: {},
  },
  {
    // Source-backed candidate; visual choices transcribed as text and listening boundaries need later review.
    id: 'n5-2013-07-exam-03', level: 'N5', title: '日本語能力試験 N5', periodLabel: '2013年7月・第3回',
    startLabel: '第3回を始める', storageKey: N5_2013_07_SESSION_KEY, questions: N5_2013_07_TRIAL,
    audioSource: require('../../../assets/jlpt/n5/2013-07/audio/n5-2013-07.mp3'), visualOptions: {},
  },
  {
    id: 'n5-2021-12-exam-07', level: 'N5', title: '日本語能力試験 N5', periodLabel: '2021年12月・第7回',
    startLabel: '第7回を始める', storageKey: N5_2021_12_SESSION_KEY, questions: N5_2021_12_TRIAL,
    audioSource: require('../../../assets/jlpt/n5/2021-12/audio/n5-2021-12.mp3'),
    visualOptions: {
      101: require('../../../assets/jlpt/n5/2021-12/visual-options/p1q1.jpg'),
      102: require('../../../assets/jlpt/n5/2021-12/visual-options/p1q2.jpg'),
      103: require('../../../assets/jlpt/n5/2021-12/visual-options/p1q3.jpg'),
      104: require('../../../assets/jlpt/n5/2021-12/visual-options/p1q4.jpg'),
      105: require('../../../assets/jlpt/n5/2021-12/visual-options/p1q7.jpg'),
      106: require('../../../assets/jlpt/n5/2021-12/visual-options/p2q1.jpg'),
      107: require('../../../assets/jlpt/n5/2021-12/visual-options/p2q2.jpg'),
      108: require('../../../assets/jlpt/n5/2021-12/visual-options/p2q3.jpg'),
      109: require('../../../assets/jlpt/n5/2021-12/visual-options/p2q4.jpg'),
      110: require('../../../assets/jlpt/n5/2021-12/visual-options/p2q6.jpg'),
      111: require('../../../assets/jlpt/n5/2021-12/visual-options/p3q1.jpg'),
      112: require('../../../assets/jlpt/n5/2021-12/visual-options/p3q2.jpg'),
      113: require('../../../assets/jlpt/n5/2021-12/visual-options/p3q3.jpg'),
      114: require('../../../assets/jlpt/n5/2021-12/visual-options/p3q4.jpg'),
      115: require('../../../assets/jlpt/n5/2021-12/visual-options/p3q5.jpg'),
    },
  },
];

if (writtenQuestions.length !== 70 || listeningQuestions.length !== 36 || N1_2012_12_QUESTIONS.length !== 106) {
  throw new Error('N1 2012-12 exam 02 must contain 70 written and 36 listening responses.');
}
