import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const outputDir = 'docs/jlpt-workspace/conversion/n5-2017-07';
fs.mkdirSync(outputDir, { recursive: true });
const makeWritten = ({ section, problemNumber, answers, pages, overallOffset = 0 }) => answers.map((correctOptionId, index) => {
  const questionNumber = index + 1;
  return {
    auditId: `${section}-p${problemNumber}-q${questionNumber}`,
    section, problemNumber, questionNumber, overallQuestionNumber: overallOffset + questionNumber,
    correctOptionId: String(correctOptionId), questionSourcePages: pages(questionNumber), answerKeyPages: [40, 41],
    explanationOrTranslationPages: [], questionVisualAudit: 'checked_against_pdf_page',
    answerAudit: 'checked_against_physical_pages_40_and_41_key',
    explanationTranslationAudit: 'source_absent_for_this_question',
    runtimeTranscriptionStatus: 'pending_character_level_verification',
  };
});

const vocabularyAnswers = [2,4,1,2,2,3,4,2,2,3,1,2,3,4,4,1,3,1,4,3,1,1,3,2,1,4,2,4,3,1,2,3,4];
const grammarReadingAnswers = [2,3,2,4,3,2,3,1,3,3,1,1,4,2,4,1,4,1,4,2,2,4,2,4,3,1,2,3,4,4,1,2];
const writtenRecords = [
  ...makeWritten({section:'vocabulary',problemNumber:1,answers:vocabularyAnswers.slice(0,10),pages:(q)=>q<=6?[2]:[3]}),
  ...makeWritten({section:'vocabulary',problemNumber:2,answers:vocabularyAnswers.slice(10,18),pages:(q)=>q<=6?[4]:[5],overallOffset:10}),
  ...makeWritten({section:'vocabulary',problemNumber:3,answers:vocabularyAnswers.slice(18,28),pages:(q)=>q<=6?[6]:[7],overallOffset:18}),
  ...makeWritten({section:'vocabulary',problemNumber:4,answers:vocabularyAnswers.slice(28),pages:(q)=>q<=2?[8]:[9],overallOffset:28}),
  ...makeWritten({section:'grammar-reading',problemNumber:1,answers:grammarReadingAnswers.slice(0,16),pages:(q)=>q<=5?[11]:q<=12?[12]:[13]}),
  ...makeWritten({section:'grammar-reading',problemNumber:2,answers:grammarReadingAnswers.slice(16,21),pages:(q)=>q===1?[14]:[15],overallOffset:16}),
  ...makeWritten({section:'grammar-reading',problemNumber:3,answers:grammarReadingAnswers.slice(21,26),pages:(q)=>q<=2?[16]:[17],overallOffset:21}),
  ...makeWritten({section:'grammar-reading',problemNumber:4,answers:grammarReadingAnswers.slice(26,29),pages:(q)=>q===1?[18]:q===2?[19]:[20],overallOffset:26}),
  ...makeWritten({section:'grammar-reading',problemNumber:5,answers:grammarReadingAnswers.slice(29,31),pages:(q)=>q===1?[21]:[22],overallOffset:29}),
  ...makeWritten({section:'grammar-reading',problemNumber:6,answers:grammarReadingAnswers.slice(31),pages:()=>[23,24],overallOffset:31}),
];
const listeningAnswers = [[2,2,3,3,1,4,4],[4,3,2,4,1,3],[1,3,2,3,2],[1,1,2,3,3,1]];

const timingSeconds = [
  ['listening-p1-q1',169.54,232.28],['listening-p1-q2',232.28,290.16],['listening-p1-q3',290.16,343.42],
  ['listening-p1-q4',343.42,410.10],['listening-p1-q5',410.10,484.00],['listening-p1-q6',484.00,551.64],['listening-p1-q7',551.64,634.82],
  ['listening-p2-q1',757.62,826.42],['listening-p2-q2',826.42,900.32],['listening-p2-q3',900.32,964.02],
  ['listening-p2-q4',964.02,1025.88],['listening-p2-q5',1025.88,1091.86],['listening-p2-q6',1091.86,1168.76],
  ['listening-p3-q1',1263.80,1297.00],['listening-p3-q2',1297.00,1332.22],['listening-p3-q3',1332.22,1365.74],
  ['listening-p3-q4',1365.74,1400.66],['listening-p3-q5',1400.66,1443.40],
  ['listening-p4-q1',1525.26,1555.16],['listening-p4-q2',1555.16,1584.20],['listening-p4-q3',1584.20,1614.42],
  ['listening-p4-q4',1614.42,1644.88],['listening-p4-q5',1644.88,1672.78],['listening-p4-q6',1672.78,1703.36],
];
const timingCandidates = timingSeconds.map(([auditId,startSeconds,endSeconds])=>({auditId,start:Math.round(startSeconds*1000),end:Math.round(endSeconds*1000)}));
assert.ok(timingCandidates.every((item,index)=>item.start===Math.round(timingSeconds[index][1]*1000)&&item.end===Math.round(timingSeconds[index][2]*1000)));

const listeningRecords = listeningAnswers.flatMap((answers,problemIndex)=>answers.map((correctOptionId,index)=>{
  const problemNumber=problemIndex+1, questionNumber=index+1, auditId=`listening-p${problemNumber}-q${questionNumber}`;
  const timing=timingCandidates.find((item)=>item.auditId===auditId)??null;
  const questionSourcePages=problemNumber===1?[questionNumber<=2?27:questionNumber<=4?28:questionNumber<=6?29:30]:problemNumber===2?[questionNumber<=2?32:questionNumber<=4?33:34]:problemNumber===3?[questionNumber===1?35:questionNumber<=2?36:questionNumber<=4?37:38]:[];
  return {auditId,section:'listening',problemNumber,questionNumber,correctOptionId:String(correctOptionId),questionSourcePages,answerKeyPages:[40,41],
    transcriptSourcePages:problemNumber===1?[42,43,44]:problemNumber===2?[44,45,46]:problemNumber===3?[46,47,48]:[48,49],
    questionVisualAudit:questionSourcePages.length?'checked_against_pdf_page':'not_applicable_audio_only',answerAudit:'checked_against_physical_pages_40_and_41_key',
    transcriptAudit:'source_present; audio_cross_check_and_character_level_runtime_transcription_pending',timingMs:timing?{start:timing.start,end:timing.end}:null,
    timingEvidence:timing?{method:'local Whisper small word-timestamp navigation aligned to printed transcript question markers',authoritativeSourceTiming:false}:null,
    timingVerificationStatus:timing?'candidate_unverified':'missing',humanReviewed:false,perceptualApproval:false,reviewDisposition:'needs_later_review'};
}));
assert.equal(writtenRecords.length,65); assert.equal(new Set(writtenRecords.map(r=>r.auditId)).size,65);
assert.equal(listeningRecords.length,24); assert.equal(new Set(listeningRecords.map(r=>r.auditId)).size,24);
fs.writeFileSync(path.join(outputDir,'written.audit.json'),`${JSON.stringify({counts:{vocabulary:33,grammarReading:32,total:65},records:writtenRecords},null,2)}\n`);
fs.writeFileSync(path.join(outputDir,'listening.audit.json'),`${JSON.stringify({counts:{responses:24,problems:[7,6,5,6],candidateTimings:timingCandidates.length},records:listeningRecords},null,2)}\n`);
console.log(`N5 2017-07 AUDIT DATA: ${writtenRecords.length} written, ${listeningRecords.length} listening, ${timingCandidates.length} timing candidates.`);
