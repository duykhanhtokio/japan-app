import type { TrialQuestion, TrialOption } from '../../../jlpt-official/n1-2012-07-trial';
import type { ImageSourcePropType } from 'react-native';

type OriginalQuestion = {
  id: string; section: 'vocabulary' | 'grammar_reading' | 'listening';
  group: number; number: number; prompt: string;
  options: { id: TrialOption['id']; text: string }[];
  correctOptionId: TrialOption['id']; passageId?: string;
  ordering?: { prefix: string; suffix: string; starSlot: number; solutionOptionIds: string[]; completedSentence: string };
};
type OriginalMaster = {
  examId: string; runtimeIntegrated: boolean; questions: OriginalQuestion[];
  passages: Record<string, string>;
};
const master = require('./master.ja.json') as OriginalMaster;
const organization = require('./listening-organization.ja.json') as { groups: { problem: number; example: { options: {id: string; text: string}[] } }[] };
function practiceInstruction(q: OriginalQuestion): string {
  if (q.section !== 'listening' || q.number !== 1) return '';
  if (q.group <= 2) return '\n練習（採点なし・選択操作不要）：\n' + organization.groups.find(g => g.problem === q.group)!.example.options.map(o => o.id + ' ' + o.text).join('\n');
  return q.group === 4 ? '\n練習と本問１番は同じ自転車店の絵を使います。音声で説明される場面の目的に注意してください。練習は採点しません。練習中は選択ボタンを押しません。' : '\n音声の練習は採点しません。練習中は選択ボタンを押しません。';
}
const audio = require('./audio.manifest.json') as { durationMs: number; matchesLevelDurationTarget: boolean };

export const N3_ORIGINAL_04_SESSION_KEY = 'jlpt:jpapp:n3:original:04:v1';
// Register only when the master is integrated and the complete listening track is ready.
export const N3_ORIGINAL_04_REGISTRATION_READY = master.runtimeIntegrated && audio.matchesLevelDurationTarget;
export const N3_ORIGINAL_04_VISUALS: Readonly<Record<number, ImageSourcePropType>> = {
  401: require('../../../../../assets/jlpt-original/n3/04/images/problem-4-01.png'),
  402: require('../../../../../assets/jlpt-original/n3/04/images/problem-4-02.png'),
  403: require('../../../../../assets/jlpt-original/n3/04/images/problem-4-03.png'),
  404: require('../../../../../assets/jlpt-original/n3/04/images/problem-4-04.png'),
};

export const N3_ORIGINAL_04_TRIAL: readonly TrialQuestion[] = master.questions.map(q => {
  const listening = q.section === 'listening';
  const ordering = q.section === 'grammar_reading' && q.group === 7;
  const reading = q.section === 'grammar_reading' && q.group >= 9;
  const family: TrialQuestion['family'] = listening ? 'listening'
    : q.section === 'vocabulary' ? 'vocabulary'
    : ordering ? 'sentenceComposition' : reading ? 'reading' : 'grammar';
  const heading = listening ? '聴解' : q.section === 'vocabulary' ? '文字・語彙' : reading ? '読解' : '文法';
  const spokenOnly = listening && q.group >= 3;

  return {
    id: q.id,
    sectionId: q.section === 'grammar_reading' ? 'grammar-reading' : q.section,
    problemNumber: q.section === 'grammar_reading' ? q.group - 5 : q.group,
    questionNumber: q.number,
    family,
    label: `${heading}／問題${q.section === 'grammar_reading' ? q.group - 5 : q.group}／${q.number}`,
    instructionJa: (spokenOnly ? '音声の選択肢を聞いて、一つ選んでください。'
      : ordering ? '四つのことばを並べて、★に入るものを選んでください。'
      : `${listening ? '話を聞いて、' : ''}いちばんいいものを一つ選んでください。`) + practiceInstruction(q),
    promptJa: listening && q.group === 3
      ? '話を最後まで聞いて、音声の質問に答えてください。'
      : listening && q.group === 5
      ? '音声の短い言葉を聞いて、合う返事の番号を一つ選んでください。'
      : q.prompt,
    passageId: q.passageId,
    passageJa: q.passageId ? master.passages[q.passageId] : undefined,
    // Publisher request: display full selectable alternatives, including spoken choices.
    options: q.options.map(o => ({ id: o.id, textJa: o.text })),
    correctOptionId: q.correctOptionId,
    practiceOptions: listening && q.group === 4 && q.number === 1 ? organization.groups.find(g => g.problem === q.group)!.example.options : undefined,
    sourcePage: 0, // Independent authoring has no source-paper page.
    visualOptionPage: listening && q.group === 4 ? 400 + q.number : undefined,
    explanationStatus: 'missing',
    generatedExplanationStatus: 'not_generated',
    audio: listening ? { segmentId: `${master.examId}-continuous`, startMs: 0, endMs: audio.durationMs, transcriptJa: '' } : undefined,
  };
});

if (N3_ORIGINAL_04_TRIAL.length !== 102 || new Set(N3_ORIGINAL_04_TRIAL.map(q => q.id)).size !== 102) {
  throw new Error('Original N3 04 adapter must preserve all 102 independent question IDs.');
}
