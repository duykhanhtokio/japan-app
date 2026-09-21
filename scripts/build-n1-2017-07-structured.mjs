import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const examId = 'n1-2017-07-exam-11';
const reviewDir = 'docs/jlpt-workspace/conversion/n1-2017-07';
const root = 'assets/jlpt/n1/2017-07';
const written = JSON.parse(fs.readFileSync(`${reviewDir}/written.review.json`, 'utf8'));
const listeningReview = JSON.parse(fs.readFileSync(`${reviewDir}/listening.review.json`, 'utf8'));
const sourceModule = fs.readFileSync('src/data/jlpt-mock/n1-2017-07-official.ts', 'utf8');
const key = (name) => sourceModule.match(new RegExp(`${name} = \\[([\\s\\S]*?)\\]`))[1].match(/\d+/g).map(Number);
const writtenKey = key('N1_2017_07_WRITTEN_KEY');
const listeningKey = key('N1_2017_07_LISTENING_KEY');
assert.equal(written.length, 70);
assert.equal(listeningReview.length, 35);

const familyMap = {
  'kanji-reading':'vocabulary','vocabulary-context':'vocabulary','vocabulary-synonym':'vocabulary','vocabulary-usage':'vocabulary',
  'grammar-fill':'grammar','grammar-order':'sentenceComposition','grammar-text':'grammar',
  'reading-short':'reading','reading-medium':'reading','reading-long':'reading','reading-comparative':'reading','reading-information-retrieval':'reading',
  'context-vocabulary':'vocabulary','paraphrase':'vocabulary','word-usage':'vocabulary',
  'grammar':'grammar','sentence-order':'sentenceComposition','text-grammar':'grammar',
  'reading-comparison':'reading','information-search':'reading',
};
const instructions = {
  1:'＿＿＿の言葉の読み方として最もよいものを、1・2・3・4から一つ選びなさい。',
  2:'（　）に入れるのに最もよいものを、1・2・3・4から一つ選びなさい。',
  3:'＿＿＿の言葉に意味が最も近いものを、1・2・3・4から一つ選びなさい。',
  4:'次の言葉の使い方として最もよいものを、1・2・3・4から一つ選びなさい。',
  5:'次の文の（　）に入れるのに最もよいものを、1・2・3・4から一つ選びなさい。',
  6:'次の文の ★ に入る最もよいものを、1・2・3・4から一つ選びなさい。',
  7:'次の文章を読んで、文章全体の趣旨を踏まえて最もよいものを選びなさい。',
};
const listeningInstructions = {
  1:'まず質問を聞いてください。それから話を聞いて、最もよいものを一つ選んでください。',
  2:'まず質問を聞き、選択肢を読んでから話を聞いて、最もよいものを一つ選んでください。',
  3:'話を聞いてから、質問と選択肢を聞き、最もよいものを一つ選んでください。',
  4:'文とそれに対する返事を聞いて、最もよいものを一つ選んでください。',
  5:'長めの話を聞いて、質問に対する最もよいものを一つ選んでください。',
};
const optionObjects = (values) => values.map((textJa,index)=>({optionId:String(index+1),textJa}));
const passages={}; const passageIds=new Map();
const writtenQuestions=written.map((q,index)=>{
  assert.equal(Number(q.correctOptionId),writtenKey[index]); assert.equal(q.options.length,4); assert.ok(familyMap[q.family]);
  let passageId;
  if(q.passageJa){ passageId=passageIds.get(q.passageJa); if(!passageId){passageId=`n1-2017-07-passage-q${String(q.questionNumber).padStart(2,'0')}`;passageIds.set(q.passageJa,passageId);passages[passageId]={text:q.passageJa};} }
  return {questionId:`n1-2017-07-written-q${String(q.questionNumber).padStart(2,'0')}`,sectionId:'written',problemNumber:q.problemNumber,questionNumber:q.questionNumber,family:familyMap[q.family],sourceFamily:q.family,instructionJa:instructions[q.problemNumber]??'次の文章を読んで、問いに答えなさい。',promptJa:q.promptJa,passageId,options:optionObjects(q.options),correctOptionId:q.correctOptionId,verificationStatus:'candidate_source_transcription',source:{questionPage:q.sourcePage,questionPages:q.sourcePages,answerPage:1}};
});

const sha256=(path)=>createHash('sha256').update(fs.readFileSync(path)).digest('hex');
const audioPath=`${root}/audio/n1-2017-07.m4a`; const audioHash=sha256(audioPath);
assert.equal(audioHash,'e9221552fee6fe2dd051d5f30c966c49919291d9beeb2893360c3257b45566f5');
const listeningQuestions=listeningReview.map((q,index)=>{
  assert.equal(Number(q.correctOptionId),listeningKey[index]);
  const [startSeconds,endSeconds]=q.audioSeconds; const startMs=Math.round(startSeconds*1000),endMs=Math.round(endSeconds*1000);
  assert.ok(endMs>startMs&&endMs<=3083870);
  return {questionId:`n1-2017-07-p${q.problemNumber}-q${String(q.questionNumber).padStart(2,'0')}${q.responseSuffix?`-${q.responseSuffix}`:''}`,sectionId:'listening',problemNumber:q.problemNumber,questionNumber:q.questionNumber,responseSuffix:q.responseSuffix,family:'listening',instructionJa:listeningInstructions[q.problemNumber],promptJa:q.promptJa,options:optionObjects(q.options),correctOptionId:q.correctOptionId,source:q.source,answerVerificationStatus:'verified_against_source_key',transcriptVerificationStatus:'candidate_unverified',verificationStatus:'candidate_unverified',audio:{segmentId:`n1-2017-07-p${q.problemNumber}-q${String(q.questionNumber).padStart(2,'0')}`,startMs,endMs,transcriptJa:q.transcriptJa,transcriptSourcePages:q.source.answerScriptPages,timingVerificationStatus:'candidate_unverified',timingEvidence:`Local ffmpeg silencedetect candidate boundaries ${startSeconds.toFixed(3)} s and ${endSeconds.toFixed(3)} s were multiplied by 1000 and rounded to ${startMs} ms and ${endMs} ms. Timing is intentionally unverified pending later perceptual review.`,sourceAudioSha256:audioHash,candidateDate:'2026-09-21',humanReviewed:false,perceptualApproval:false,reviewDisposition:'needs_later_review'}};
});
const assets={}; for(const dir of ['question','answer-script']) for(const file of fs.readdirSync(`${root}/${dir}`).filter((x)=>/^page-\d+\.jpg$/.test(x)).sort()) assets[`${root}/${dir}/${file}`]=sha256(`${root}/${dir}/${file}`);
const questions=[...writtenQuestions,...listeningQuestions];
assert.equal(questions.length,105); assert.equal(new Set(questions.map((q)=>q.questionId)).size,105); assert.equal(new Set(listeningQuestions.map((q)=>q.audio.segmentId)).size,34);
const data={schemaVersion:1,examId,status:'candidate_complete',counts:{writtenResponses:70,listeningResponses:35,totalResponses:105,uniqueAudioSegments:34},blockers:[],source:{audioSha256:audioHash,assets},review:{audioTiming:'Candidate/unverified automated segmentation; humanReviewed and perceptualApproval remain false and later review is required.',transcripts:'Candidate integration text; source-script proofreading is deferred.',explanations:'Multilingual explanations and translations are deferred.'},passages,questions};
const out='src/data/jlpt-official/n1-2017-07/exam.candidate.json'; const serialized=`${JSON.stringify(data,null,2)}\n`;
if(process.argv.includes('--check')) assert.equal(fs.readFileSync(out,'utf8'),serialized,'Candidate differs from source reviews'); else fs.writeFileSync(out,serialized);
console.log('N1 2017-07 built: 70 source-written + 35 listening responses; 34 candidate audio segments.');
