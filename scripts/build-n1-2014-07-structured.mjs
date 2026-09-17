import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const reviewDir = 'docs/jlpt-workspace/conversion/n1-2014-07';
const outDir = 'src/data/jlpt-official/n1-2014-07';
const readReviews = (pattern) => fs.readdirSync(reviewDir).filter((name) => pattern.test(name)).sort()
  .flatMap((name) => JSON.parse(fs.readFileSync(`${reviewDir}/${name}`, 'utf8')));
const written = readReviews(/^written-page-\d+\.review\.json$/);
const listening = readReviews(/^listening-problem-\d+\.review\.json$/);
const sourceModule = fs.readFileSync('src/data/jlpt-mock/n1-2014-07-official.ts', 'utf8');
const key = (name) => sourceModule.match(new RegExp(`${name} = \\[([\\s\\S]*?)\\]`))[1].match(/\d+/g).map(Number);
const writtenKey = key('WRITTEN_KEY');
const listeningKey = key('LISTENING_KEY');
assert.equal(written.length, 70);
assert.equal(listening.length, 37);
assert.deepEqual(written.map((q) => q.questionNumber), Array.from({ length: 70 }, (_, i) => i + 1));

const familyMap = {
  'kanji-reading': 'vocabulary', 'vocabulary-context': 'vocabulary',
  'vocabulary-synonym': 'vocabulary', 'vocabulary-usage': 'vocabulary',
  'grammar-choice': 'grammar', 'grammar-order': 'sentenceComposition', 'grammar-text': 'grammar',
  'reading-short': 'reading', 'reading-medium': 'reading', 'reading-long': 'reading',
  'reading-comparative': 'reading', 'sentence-composition': 'sentenceComposition', 'reading-integrated': 'reading', 'reading-information': 'reading',
};
const instructions = {
  1: 'では、まず質問を聞いてください。それから話を聞いて、問題用紙の（１）から（４）の中から、最もよいものを一つ選んでください。',
  2: 'では、まず質問を聞いてください。そのあと、問題用紙のせんたくしを読んでください。読む時間があります。それから話を聞いて、問題用紙の（１）から（４）の中から、最もよいものを一つ選んでください。',
  3: 'では、問題用紙に何も印刷されていません。この問題は、全体としてどんな内容かを聞く問題です。話の前に質問はありません。まず話を聞いてください。それから、質問とせんたくしを聞いて、（１）から（４）の中から、最もよいものを一つ選んでください。',
  4: 'では、問題用紙に何も印刷されていません。まず文を聞いてください。それから、それに対する返事を聞いて、（１）から（３）の中から、最もよいものを一つ選んでください。',
  5: 'では、長めの話を聞きます。この問題には練習はありません。メモをとってもかまいません。',
};
const options = (q) => q.options.map((textJa, index) => ({ optionId: String(index + 1), textJa }));
const passages = {};
const passageIds = new Map();
const writtenQuestions = written.map((q, index) => {
  assert.equal(Number(q.correctOptionId), writtenKey[index]);
  assert.equal(q.options.length, 4);
  assert.ok(familyMap[q.family], `Unknown family: ${q.family}`);
  let passageId;
  if (q.passageJa) {
    passageId = passageIds.get(q.passageJa);
    if (!passageId) {
      passageId = `n1-2014-07-passage-q${String(q.questionNumber).padStart(2, '0')}`;
      passageIds.set(q.passageJa, passageId);
      passages[passageId] = { text: q.passageJa };
    }
  }
  return {
    questionId: `n1-2014-07-written-q${String(q.questionNumber).padStart(2, '0')}`,
    sectionId: 'written', problemNumber: q.problemNumber, questionNumber: q.questionNumber,
    family: familyMap[q.family], sourceFamily: q.family, instructionJa: q.underlinedText ? `${q.instructionJa}（対象：${q.underlinedText}）` : q.instructionJa,
    promptJa: q.promptJa, underlinedText: q.underlinedText, sourceNote: q.sourceNote, passageId, options: options(q), correctOptionId: q.correctOptionId,
    verificationStatus: 'verified_against_source_image',
    source: { questionPage: q.sourcePage, questionPages: q.sourcePages ?? [q.sourcePage], answerPage: 1 },
  };
});
const listeningQuestions = listening.map((q, index) => {
  assert.equal(Number(q.correctOptionId), listeningKey[index]);
  assert.equal(q.options.length, q.problemNumber === 4 ? 3 : 4);
  assert.ok(q.transcriptJa.length > 20);
  assert.ok(q.audio.endMs > q.audio.startMs);
  const suffix = q.responseSuffix ? `-${q.responseSuffix}` : '';
  return {
    questionId: `n1-2014-07-p${q.problemNumber}-q${String(q.sourceQuestionNumber ?? q.questionNumber).padStart(2, '0')}${suffix}`,
    sectionId: 'listening', problemNumber: q.problemNumber, questionNumber: q.sourceQuestionNumber ?? q.questionNumber,
    responseSuffix: q.responseSuffix ?? undefined, family: 'listening',
    instructionJa: instructions[q.problemNumber], promptJa: q.promptJa, options: options(q),
    correctOptionId: q.correctOptionId, source: q.source,
    answerVerificationStatus: 'verified_against_source_key', transcriptVerificationStatus: q.transcriptVerificationStatus,
    verificationStatus: 'source_verified_pending_runtime_review',
    audio: { ...q.audio, timingVerificationStatus: 'pending_runtime_review', transcriptJa: q.transcriptJa, transcriptSourcePages: q.source.answerScriptPages },
  };
});
const sha256 = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const sourceAssets = {};
for (const folder of ['question', 'answer-script']) {
  const dir = `assets/jlpt/n1/2014-07/${folder}`;
  for (const file of fs.readdirSync(dir).filter((name) => /^page-\d+\.jpg$/.test(name)).sort()) {
    sourceAssets[`${dir}/${file}`] = sha256(`${dir}/${file}`);
  }
}
const audioHash = sha256('assets/jlpt/n1/2014-07/audio/n1-2014-07.mp3');
assert.equal(audioHash, 'f534896b9c9962ce3ff1eae69f49b7afb1a0e93438ab437d63d3a55032937309');
const questions = [...writtenQuestions, ...listeningQuestions];
assert.equal(new Set(questions.map((q) => q.questionId)).size, 107);
assert.equal(new Set(listeningQuestions.map((q) => q.audio.segmentId)).size, 36);
const dataset = {
  schemaVersion: 1, examId: 'n1-2014-07-exam-05', status: 'needs_runtime_review',
  counts: { writtenResponses: 70, listeningResponses: 37, totalResponses: 107, uniqueAudioSegments: 36 },
  source: { audioSha256: audioHash, assets: sourceAssets },
  review: {
    audioTiming: 'Local ASR candidate ranges, all decoded; user Simulator listening review pending.',
    writtenSourceAnomalies: 'Printed anomalies retained, including question 22 answer-key discrepancy; see conversion checkpoint.',
    explanations: 'Pending source explanation conversion and in-session AI translations after runtime review. No external translation service or runtime translation dependency.',
  },
  passages, questions,
};
fs.mkdirSync(outDir, { recursive: true });
const serialized = `${JSON.stringify(dataset, null, 2)}\n`;
if (process.argv.includes('--check')) assert.equal(fs.readFileSync(`${outDir}/exam.candidate.json`, 'utf8'), serialized, 'Candidate differs from source reviews');
else fs.writeFileSync(`${outDir}/exam.candidate.json`, serialized);
console.log('N1 2014-07 built: 70 written + 37 listening; 36 candidate audio segments; runtime review pending.');
