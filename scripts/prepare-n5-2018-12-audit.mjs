import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const outputDir = 'docs/jlpt-workspace/conversion/n5-2018-12';
fs.mkdirSync(outputDir, { recursive: true });

const explanationPageForWritten = (section, overallQuestionNumber) => {
  if (section === 'vocabulary') {
    if (overallQuestionNumber <= 12) return [16];
    if (overallQuestionNumber <= 26) return [17];
    return [18];
  }
  if (overallQuestionNumber <= 5) return [18];
  if (overallQuestionNumber <= 19) return [19];
  return [20];
};

const makeWritten = ({ section, problemNumber, answers, pages, overallOffset = 0 }) => answers.map((correctOptionId, index) => {
  const questionNumber = index + 1;
  const overallQuestionNumber = overallOffset + questionNumber;
  return {
    auditId: `${section}-p${problemNumber}-q${questionNumber}`,
    section, problemNumber, questionNumber, overallQuestionNumber,
    correctOptionId: String(correctOptionId), questionSourcePages: pages(questionNumber), answerKeyPages: [15],
    explanationOrTranslationPages: explanationPageForWritten(section, overallQuestionNumber),
    questionVisualAudit: 'checked_against_pdf_page', answerAudit: 'checked_against_physical_page_15_key',
    explanationTranslationAudit: 'simplified_chinese_source_present_and_visually_checked',
    runtimeTranscriptionStatus: 'pending_character_level_verification',
  };
});

const vocabularyAnswers = [2,3,2,3,1,3,4,1,4,2,1,4,2,1,4,1,3,4,3,2,4,3,2,4,1,1,2,1,2,4,3,1,4,2,2];
const grammarReadingAnswers = [3,1,4,3,2,1,2,3,1,4,3,2,1,4,2,1,2,1,2,4,3,2,3,3,1,4,3,4,1,3,2,4];
const writtenRecords = [
  ...makeWritten({section:'vocabulary',problemNumber:1,answers:vocabularyAnswers.slice(0,12),pages:()=>[3]}),
  ...makeWritten({section:'vocabulary',problemNumber:2,answers:vocabularyAnswers.slice(12,20),pages:(q)=>q<=3?[3]:[4],overallOffset:12}),
  ...makeWritten({section:'vocabulary',problemNumber:3,answers:vocabularyAnswers.slice(20,30),pages:()=>[4],overallOffset:20}),
  ...makeWritten({section:'vocabulary',problemNumber:4,answers:vocabularyAnswers.slice(30),pages:()=>[5],overallOffset:30}),
  ...makeWritten({section:'grammar-reading',problemNumber:1,answers:grammarReadingAnswers.slice(0,16),pages:(q)=>q<=6?[5]:[6]}),
  ...makeWritten({section:'grammar-reading',problemNumber:2,answers:grammarReadingAnswers.slice(16,21),pages:(q)=>q<=2?[6]:[7],overallOffset:16}),
  ...makeWritten({section:'grammar-reading',problemNumber:3,answers:grammarReadingAnswers.slice(21,26),pages:()=>[7],overallOffset:21}),
  ...makeWritten({section:'grammar-reading',problemNumber:4,answers:grammarReadingAnswers.slice(26,29),pages:(q)=>q===1?[7]:[8],overallOffset:26}),
  ...makeWritten({section:'grammar-reading',problemNumber:5,answers:grammarReadingAnswers.slice(29,31),pages:()=>[9],overallOffset:29}),
  ...makeWritten({section:'grammar-reading',problemNumber:6,answers:grammarReadingAnswers.slice(31),pages:()=>[9,10],overallOffset:31}),
];
const listeningAnswers = [[3,1,4,2,1,4,3],[4,1,3,1,2,2],[3,3,1,2,2],[1,3,3,2,1,2]];

const timingSeconds = [
  ['listening-p1-q1',159.94,221.14],['listening-p1-q2',221.14,281.10],['listening-p1-q3',281.10,343.62],
  ['listening-p1-q4',343.62,414.46],['listening-p1-q5',414.46,501.92],['listening-p1-q6',501.92,565.78],['listening-p1-q7',565.78,639.04],
  ['listening-p2-q1',757.48,812.62],['listening-p2-q2',812.62,870.14],['listening-p2-q3',870.14,946.04],
  ['listening-p2-q4',946.04,1023.94],['listening-p2-q5',1023.94,1106.84],['listening-p2-q6',1106.84,1181.52],
  ['listening-p3-q1',1273.40,1310.92],['listening-p3-q2',1310.92,1347.46],['listening-p3-q3',1347.46,1380.68],
  ['listening-p3-q4',1380.68,1417.20],['listening-p3-q5',1417.20,1457.48],
  ['listening-p4-q1',1536.64,1566.96],['listening-p4-q2',1566.96,1596.86],['listening-p4-q3',1596.86,1628.26],
  ['listening-p4-q4',1628.26,1662.14],['listening-p4-q5',1662.14,1694.48],['listening-p4-q6',1694.48,1725.26],
];
const timingCandidates = timingSeconds.map(([auditId,startSeconds,endSeconds])=>({auditId,start:Math.round(startSeconds*1000),end:Math.round(endSeconds*1000)}));
assert.ok(timingCandidates.every((item,index)=>item.start===Math.round(timingSeconds[index][1]*1000)&&item.end===Math.round(timingSeconds[index][2]*1000)));

const listeningRecords = listeningAnswers.flatMap((answers,problemIndex)=>answers.map((correctOptionId,index)=>{
  const problemNumber=problemIndex+1, questionNumber=index+1, auditId=`listening-p${problemNumber}-q${questionNumber}`;
  const timing=timingCandidates.find((item)=>item.auditId===auditId)??null;
  const questionSourcePages=problemNumber===1?[questionNumber<=4?11:12]:problemNumber===2?[questionNumber<=3?12:13]:problemNumber===3?[questionNumber<=3?13:14]:[];
  return {auditId,section:'listening',problemNumber,questionNumber,correctOptionId:String(correctOptionId),questionSourcePages,answerKeyPages:[15],
    transcriptSourcePages:problemNumber===1?[21,22]:problemNumber===2?[22,23]:problemNumber===3?[23]:[24],
    questionVisualAudit:questionSourcePages.length?'checked_against_pdf_page':'not_applicable_audio_only',answerAudit:'checked_against_physical_page_15_key',
    transcriptAudit:'source_present; audio_cross_check_and_character_level_runtime_transcription_pending',timingMs:timing?{start:timing.start,end:timing.end}:null,
    timingEvidence:timing?{method:'local Whisper small word-timestamp navigation aligned to printed transcript question markers',authoritativeSourceTiming:false}:null,
    timingVerificationStatus:timing?'candidate_unverified':'missing',humanReviewed:false,perceptualApproval:false,reviewDisposition:'needs_later_review'};
}));
assert.equal(writtenRecords.length,67); assert.equal(new Set(writtenRecords.map(r=>r.auditId)).size,67);
assert.equal(listeningRecords.length,24); assert.equal(new Set(listeningRecords.map(r=>r.auditId)).size,24);
fs.writeFileSync(path.join(outputDir,'written.audit.json'),`${JSON.stringify({counts:{vocabulary:35,grammarReading:32,total:67},records:writtenRecords},null,2)}\n`);
fs.writeFileSync(path.join(outputDir,'listening.audit.json'),`${JSON.stringify({counts:{responses:24,problems:[7,6,5,6],candidateTimings:timingCandidates.length},records:listeningRecords},null,2)}\n`);
console.log(`N5 2018 source AUDIT DATA: ${writtenRecords.length} written, ${listeningRecords.length} listening, ${timingCandidates.length} timing candidates.`);
