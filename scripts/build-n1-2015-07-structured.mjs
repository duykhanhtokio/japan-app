import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const reviewDir = 'docs/jlpt-workspace/conversion/n1-2015-07';
const outDir = 'src/data/jlpt-official/n1-2015-07';
const readReviews = (pattern) => fs.readdirSync(reviewDir).filter((name) => pattern.test(name)).sort()
  .flatMap((name) => JSON.parse(fs.readFileSync(`${reviewDir}/${name}`, 'utf8')));
const written = readReviews(/^written-.*\.review\.json$/).sort((a, b) => a.questionNumber - b.questionNumber);
const listening = readReviews(/^listening-problem-\d+\.review\.json$/);
const sourceModule = fs.readFileSync('src/data/jlpt-mock/n1-2015-07-official.ts', 'utf8');
const key = (name) => sourceModule.match(new RegExp(`${name} = \\[([\\s\\S]*?)\\]`))[1].match(/\d+/g).map(Number);
const writtenKey = key('WRITTEN_KEY');
const listeningKey = key('LISTENING_KEY');
assert.equal(written.length, 70);
assert.equal(listening.length, 37);
assert.deepEqual(written.map((q) => q.questionNumber), Array.from({ length: 70 }, (_, i) => i + 1));

const familyMap = {
  'kanji-reading': 'vocabulary', 'vocabulary-context': 'vocabulary',
  'vocabulary-synonym': 'vocabulary', 'vocabulary-usage': 'vocabulary',
  grammar: 'grammar', 'grammar-choice': 'grammar', 'grammar-order': 'sentenceComposition', 'grammar-text': 'grammar',
  'reading-short': 'reading', 'reading-medium': 'reading', 'reading-long': 'reading',
  'reading-comparative': 'reading', 'reading-information-retrieval': 'reading',
};
const writtenInstructions = {
  1: '＿＿＿の言葉の読み方として最もよいものを、1・2・3・4から一つ選びなさい。',
  2: '（　）に入れるのに最もよいものを、1・2・3・4から一つ選びなさい。',
  3: '＿＿＿の言葉に意味が最も近いものを、1・2・3・4から一つ選びなさい。',
  4: '次の言葉の使い方として最もよいものを、1・2・3・4から一つ選びなさい。',
  5: '次の文の（　）に入れるのに最もよいものを、1・2・3・4から一つ選びなさい。',
  6: '次の文の ★ に入る最もよいものを、1・2・3・4から一つ選びなさい。',
};
const listeningInstructions = {
  1: 'では、まず質問を聞いてください。それから話を聞いて、問題用紙の（１）から（４）の中から、最もよいものを一つ選んでください。',
  2: 'では、まず質問を聞いてください。そのあと、問題用紙のせんたくしを読んでください。読む時間があります。それから話を聞いて、問題用紙の（１）から（４）の中から、最もよいものを一つ選んでください。',
  3: 'では、問題用紙に何も印刷されていません。この問題は、全体としてどんな内容かを聞く問題です。話の前に質問はありません。まず話を聞いてください。それから、質問とせんたくしを聞いて、（１）から（４）の中から、最もよいものを一つ選んでください。',
  4: 'では、問題用紙に何も印刷されていません。まず文を聞いてください。それから、それに対する返事を聞いて、（１）から（３）の中から、最もよいものを一つ選んでください。',
  5: 'では、長めの話を聞きます。この問題には練習はありません。メモをとってもかまいません。',
};
const options = (q) => q.options.map((textJa, index) => ({ optionId: String(index + 1), textJa }));
const passages = {};
const passageIds = new Map();
const writtenQuestions = written.map((q) => {
  assert.equal(Number(q.correctOptionId), writtenKey[q.questionNumber - 1]);
  assert.equal(q.options.length, 4);
  assert.ok(familyMap[q.family], `Unknown family: ${q.family}`);
  let passageId;
  if (q.passageJa) {
    passageId = passageIds.get(q.passageJa);
    if (!passageId) {
      passageId = `n1-2015-07-passage-q${String(q.questionNumber).padStart(2, '0')}`;
      passageIds.set(q.passageJa, passageId);
      passages[passageId] = { text: q.passageJa };
    }
  }
  const promptJa = q.promptJa ?? q.wordJa;
  assert.ok(promptJa);
  const instructionJa = q.instructionJa ?? writtenInstructions[q.problemNumber];
  assert.ok(instructionJa);
  return {
    questionId: `n1-2015-07-written-q${String(q.questionNumber).padStart(2, '0')}`,
    sectionId: 'written', problemNumber: q.problemNumber, questionNumber: q.questionNumber,
    family: familyMap[q.family], sourceFamily: q.family,
    instructionJa: q.underlinedText ? `${instructionJa}（対象：${q.underlinedText}）` : instructionJa,
    promptJa, underlinedText: q.underlinedText, passageId, options: options(q), correctOptionId: q.correctOptionId,
    verificationStatus: 'verified_against_source_image',
    source: { questionPage: q.sourcePage, questionPages: q.sourcePages ?? [q.sourcePage], answerPage: 1 },
  };
});
const listeningQuestions = listening.map((q, index) => {
  assert.equal(Number(q.correctOptionId), listeningKey[index]);
  assert.equal(q.options.length, q.problemNumber === 4 ? 3 : 4);
  assert.ok(q.transcriptJa.length > 20);
  assert.equal(q.audioTimingStatus, 'candidate_unverified');
  assert.equal(q.audio.timingVerificationStatus, 'candidate_unverified');
  assert.equal(q.audio.humanReviewed, false);
  assert.equal(q.audio.perceptualApproval, false);
  assert.equal(q.audio.reviewDisposition, 'needs_later_review');
  assert.equal(q.audio.sourceAudioSha256, '37bb9bc85dba19522939e546b8d964bbd3f840160ec99f129a8154ebc11fb6a2');
  assert.ok(q.audio.endMs > q.audio.startMs);
  const sourceQuestionNumber = q.sourceQuestionNumber ?? q.questionNumber;
  const suffix = q.responseSuffix ? `-${q.responseSuffix}` : '';
  return {
    questionId: `n1-2015-07-p${q.problemNumber}-q${String(sourceQuestionNumber).padStart(2, '0')}${suffix}`,
    sectionId: 'listening', problemNumber: q.problemNumber, questionNumber: sourceQuestionNumber,
    responseSuffix: q.responseSuffix ?? undefined, family: 'listening',
    instructionJa: listeningInstructions[q.problemNumber], promptJa: q.promptJa, options: options(q),
    correctOptionId: q.correctOptionId, source: q.source,
    answerVerificationStatus: 'verified_against_source_key', transcriptVerificationStatus: q.transcriptVerificationStatus,
    verificationStatus: 'candidate_unverified',
    audio: { ...q.audio, transcriptJa: q.transcriptJa, transcriptSourcePages: q.source.answerScriptPages },
  };
});
const sha256 = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const sourceAssets = {};
for (const folder of ['question', 'answer-script']) {
  const dir = `assets/jlpt/n1/2015-07/${folder}`;
  for (const file of fs.readdirSync(dir).filter((name) => /^page-\d+\.jpg$/.test(name)).sort()) {
    sourceAssets[`${dir}/${file}`] = sha256(`${dir}/${file}`);
  }
}
const audioHash = sha256('assets/jlpt/n1/2015-07/audio/n1-2015-07.mp3');
assert.equal(audioHash, '37bb9bc85dba19522939e546b8d964bbd3f840160ec99f129a8154ebc11fb6a2');
const questions = [...writtenQuestions, ...listeningQuestions];
assert.equal(new Set(questions.map((q) => q.questionId)).size, 107);
assert.equal(new Set(listeningQuestions.map((q) => q.audio.segmentId)).size, 36);
const dataset = {
  schemaVersion: 1, examId: 'n1-2015-07-exam-07', status: 'candidate_complete',
  counts: { writtenResponses: 70, listeningResponses: 37, totalResponses: 107, uniqueAudioSegments: 36 },
  blockers: [],
  source: { audioSha256: audioHash, assets: sourceAssets },
  review: {
    audioTiming: 'Candidate/unverified local ffmpeg and Whisper alignment only; humanReviewed and perceptualApproval remain false and later review is required.',
    writtenSourceAnomalies: 'Source page 4 repeats printed number 28. Its sequential placement between questions 28 and 30 establishes that item as question 29; the answer matches official key slot 29.',
    explanations: 'Pending source explanation conversion and in-session AI translations. No external translation service or runtime translation dependency.',
  },
  passages, questions,
};
fs.mkdirSync(outDir, { recursive: true });
const serialized = `${JSON.stringify(dataset, null, 2)}\n`;
const outputPath = `${outDir}/exam.candidate.json`;
if (process.argv.includes('--check')) assert.equal(fs.readFileSync(outputPath, 'utf8'), serialized, 'Candidate differs from source reviews');
else fs.writeFileSync(outputPath, serialized);
console.log('N1 2015-07 built: 70 written + 37 listening; 36 candidate audio segments.');
