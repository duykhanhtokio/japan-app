import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const reviewDir = 'docs/jlpt-workspace/conversion/n1-2015-12';
const outDir = 'src/data/jlpt-official/n1-2015-12';
const written = fs.readdirSync(reviewDir).filter((name) => /^written-.*\.review\.json$/.test(name)).sort()
  .flatMap((name) => JSON.parse(fs.readFileSync(`${reviewDir}/${name}`, 'utf8')))
  .sort((a, b) => a.questionNumber - b.questionNumber);
const listeningReview = JSON.parse(fs.readFileSync(`${reviewDir}/listening.review.json`, 'utf8'));
const sourceModule = fs.readFileSync('src/data/jlpt-mock/n1-2015-12-official.ts', 'utf8');
const key = (name) => sourceModule.match(new RegExp(`${name} = \\[([\\s\\S]*?)\\]`))[1].match(/\d+/g).map(Number);
const writtenKey = key('N1_2015_12_WRITTEN_KEY');
const listeningKey = key('N1_2015_12_LISTENING_KEY');
assert.equal(written.length, 70);
assert.equal(listeningReview.length, 37);

const familyMap = {
  'kanji-reading': 'vocabulary', 'vocabulary-context': 'vocabulary',
  'vocabulary-synonym': 'vocabulary', 'vocabulary-usage': 'vocabulary',
  grammar: 'grammar', 'grammar-fill': 'grammar', 'grammar-choice': 'grammar',
  'grammar-order': 'sentenceComposition', 'grammar-text': 'grammar',
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
  1: 'では、まず質問を聞いてください。それから話を聞いて、問題用紙の（1）から（4）の中から、最もよいものを一つ選んでください。',
  2: 'では、まず質問を聞いてください。そのあと、問題用紙のせんたくしを読んでください。読む時間があります。それから話を聞いて、問題用紙の（1）から（4）の中から、最もよいものを一つ選んでください。',
  3: 'では、問題用紙に何も印刷されていません。この問題は、全体としてどんな内容かを聞く問題です。話の前に質問はありません。まず話を聞いてください。それから、質問とせんたくしを聞いて、（1）から（4）の中から、最もよいものを一つ選んでください。',
  4: 'では、問題用紙に何も印刷されていません。まず文を聞いてください。それから、それに対する返事を聞いて、（1）から（3）の中から、最もよいものを一つ選んでください。',
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
      passageId = `n1-2015-12-passage-q${String(q.questionNumber).padStart(2, '0')}`;
      passageIds.set(q.passageJa, passageId);
      passages[passageId] = { text: q.passageJa };
    }
  }
  const promptJa = q.promptJa ?? q.wordJa;
  assert.ok(promptJa);
  const instructionJa = q.instructionJa ?? writtenInstructions[q.problemNumber] ?? '最もよいものを一つ選びなさい。';
  return {
    questionId: `n1-2015-12-written-q${String(q.questionNumber).padStart(2, '0')}`,
    sectionId: 'written', problemNumber: q.problemNumber, questionNumber: q.questionNumber,
    family: familyMap[q.family], sourceFamily: q.family,
    instructionJa: q.underlinedText ? `${instructionJa}（対象：${q.underlinedText}）` : instructionJa,
    promptJa, underlinedText: q.underlinedText, passageId, options: options(q), correctOptionId: q.correctOptionId,
    verificationStatus: 'verified_against_source_image',
    source: { questionPage: q.sourcePage, questionPages: q.sourcePages ?? [q.sourcePage], answerPage: 1 },
  };
});

const audioHash = createHash('sha256').update(fs.readFileSync('assets/jlpt/n1/2015-12/audio/n1-2015-12.mp3')).digest('hex');
assert.equal(audioHash, 'ae208c2d4d3000e5a7925ca56ea468e0933aec33470d65e29d248ac0a0b0a81e');
const listeningQuestions = listeningReview.map((q, index) => {
  const [startSeconds, endSeconds] = q.audioSeconds;
  const startMs = Math.round(startSeconds * 1000);
  const endMs = Math.round(endSeconds * 1000);
  assert.ok(endMs > startMs);
  assert.equal(q.options.length, q.problemNumber === 4 ? 3 : 4);
  assert.ok(q.transcriptJa.length > 20);
  return {
    questionId: `n1-2015-12-p${q.problemNumber}-q${String(q.questionNumber).padStart(2, '0')}${q.responseSuffix ? `-${q.responseSuffix}` : ''}`,
    sectionId: 'listening', problemNumber: q.problemNumber, questionNumber: q.questionNumber,
    responseSuffix: q.responseSuffix, family: 'listening', instructionJa: listeningInstructions[q.problemNumber],
    promptJa: q.promptJa, options: options(q), correctOptionId: String(listeningKey[index]), source: q.source,
    answerVerificationStatus: 'verified_against_source_key', transcriptVerificationStatus: 'verified_against_source_image',
    verificationStatus: 'candidate_unverified',
    audio: {
      segmentId: `n1-2015-12-p${q.problemNumber}-q${String(q.questionNumber).padStart(2, '0')}`,
      startMs, endMs, transcriptJa: q.transcriptJa, transcriptSourcePages: q.source.answerScriptPages,
      timingVerificationStatus: 'candidate_unverified',
      timingEvidence: `Local ffmpeg silencedetect boundaries ${startSeconds.toFixed(6)} s and ${endSeconds.toFixed(6)} s were multiplied by 1000 and rounded to ${startMs} ms and ${endMs} ms. Candidate only; later perceptual review is required.`,
      sourceAudioSha256: audioHash, candidateDate: '2026-09-21', humanReviewed: false,
      perceptualApproval: false, reviewDisposition: 'needs_later_review',
    },
  };
});

const sha256 = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const sourceAssets = {};
for (const folder of ['question', 'answer-script']) {
  const dir = `assets/jlpt/n1/2015-12/${folder}`;
  for (const file of fs.readdirSync(dir).filter((name) => /^page-\d+\.jpg$/.test(name)).sort()) {
    sourceAssets[`${dir}/${file}`] = sha256(`${dir}/${file}`);
  }
}
const questions = [...writtenQuestions, ...listeningQuestions];
assert.equal(questions.length, 107);
assert.equal(new Set(questions.map((q) => q.questionId)).size, 107);
assert.equal(new Set(listeningQuestions.map((q) => q.audio.segmentId)).size, 36);
const dataset = {
  schemaVersion: 1, examId: 'n1-2015-12-exam-08', status: 'candidate_complete',
  counts: { writtenResponses: 70, listeningResponses: 37, totalResponses: 107, uniqueAudioSegments: 36 },
  blockers: [], source: { audioSha256: audioHash, assets: sourceAssets },
  review: {
    audioTiming: 'Candidate/unverified local ffmpeg silencedetect alignment only; humanReviewed and perceptualApproval remain false and later review is required.',
    explanations: 'Multilingual explanations and translations are deferred.',
  },
  passages, questions,
};
fs.mkdirSync(outDir, { recursive: true });
const serialized = `${JSON.stringify(dataset, null, 2)}\n`;
const outputPath = `${outDir}/exam.candidate.json`;
if (process.argv.includes('--check')) assert.equal(fs.readFileSync(outputPath, 'utf8'), serialized, 'Candidate differs from source reviews');
else fs.writeFileSync(outputPath, serialized);
console.log('N1 2015-12 built: 70 written + 37 listening responses; 36 candidate audio segments.');
