import type { TrialQuestion, TrialOption } from '../../../jlpt-official/n1-2012-07-trial';
import type { ImageSourcePropType } from 'react-native';

type OriginalQuestion = {
  id: string; section: 'vocabulary' | 'grammar_reading' | 'listening';
  group: number; number: number; prompt: string;
  options: { id: TrialOption['id']; text: string }[];
  correctOptionId: TrialOption['id']; passageId?: string;
  prefix?: string; suffix?: string; slots?: number; starSlot?: number;
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
  return q.group === 3 ? '\n最初は画像の左側「練習」を見てください。本問１番は右側です。練習は採点しません。練習中は選択ボタンを押しません。' : '\n音声の練習は採点しません。練習中は選択ボタンを押しません。';
}
const audio = require('./audio.manifest.json') as { durationMs: number; matchesThirtyMinuteTarget: boolean };

export const N5_ORIGINAL_05_SESSION_KEY = 'jlpt:jpapp:n5:original:05:v1';
// Register only when the master is integrated and the complete listening track is ready.
export const N5_ORIGINAL_05_REGISTRATION_READY = master.runtimeIntegrated && audio.matchesThirtyMinuteTarget;
export const N5_ORIGINAL_05_VISUALS: Readonly<Record<number, ImageSourcePropType>> = {
  301: require('../../../../../assets/jlpt-original/n5/05/images/problem-3-01.png'),
  302: require('../../../../../assets/jlpt-original/n5/05/images/problem-3-02.png'),
  303: require('../../../../../assets/jlpt-original/n5/05/images/problem-3-03.png'),
  304: require('../../../../../assets/jlpt-original/n5/05/images/problem-3-04.png'),
  305: require('../../../../../assets/jlpt-original/n5/05/images/problem-3-05.png'),
};

export const N5_ORIGINAL_05_TRIAL: readonly TrialQuestion[] = master.questions.map(q => {
  const listening = q.section === 'listening';
  const ordering = q.section === 'grammar_reading' && q.group === 2;
  const reading = q.section === 'grammar_reading' && q.group >= 4;
  const family: TrialQuestion['family'] = listening ? 'listening'
    : q.section === 'vocabulary' ? 'vocabulary'
    : ordering ? 'sentenceComposition' : reading ? 'reading' : 'grammar';
  const heading = listening ? '聴解' : q.section === 'vocabulary' ? '文字・語彙' : reading ? '読解' : '文法';
  const spokenOnly = listening && q.group >= 3;
  const slots = ordering ? Array.from({ length: q.slots! }, (_, i) => i + 1 === q.starSlot ? ' ★ ' : ' ＿＿ ').join('') : '';
  return {
    id: q.id,
    sectionId: q.section === 'grammar_reading' ? 'grammar-reading' : q.section,
    problemNumber: q.group,
    questionNumber: q.number,
    family,
    label: `${heading}／問題${q.group}／${q.number}`,
    instructionJa: (spokenOnly ? '音声の選択肢を聞いて、一つ選んでください。'
      : ordering ? '四つのことばを並べて、★に入るものを選んでください。'
      : `${listening ? '話を聞いて、' : ''}いちばんいいものを一つ選んでください。`) + practiceInstruction(q),
    promptJa: ordering ? `${q.prefix}${slots}${q.suffix}\n${q.prompt}` : q.prompt,
    passageId: q.passageId,
    passageJa: q.passageId ? master.passages[q.passageId] : undefined,
    // Spoken alternatives must not become printed hints in the exam UI.
    options: q.options.map(o => ({ id: o.id, textJa: spokenOnly ? `音声の選択肢 ${o.id}` : o.text })),
    correctOptionId: q.correctOptionId,
    sourcePage: 0, // Independent authoring has no source-paper page.
    visualOptionPage: listening && q.group === 3 ? 300 + q.number : undefined,
    explanationStatus: 'missing',
    generatedExplanationStatus: 'not_generated',
    audio: listening ? { segmentId: `${master.examId}-continuous`, startMs: 0, endMs: audio.durationMs, transcriptJa: '' } : undefined,
  };
});

if (N5_ORIGINAL_05_TRIAL.length !== 91 || new Set(N5_ORIGINAL_05_TRIAL.map(q => q.id)).size !== 91) {
  throw new Error('Original N5 05 adapter must preserve all 91 independent question IDs.');
}
