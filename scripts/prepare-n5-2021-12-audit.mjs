import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const outputDir='docs/jlpt-workspace/conversion/n5-2021-12';fs.mkdirSync(outputDir,{recursive:true});
const makeWritten=({section,problemNumber,count,pages,overallOffset=0})=>Array.from({length:count},(_,index)=>{const questionNumber=index+1;return{
  auditId:`${section}-p${problemNumber}-q${questionNumber}`,section,problemNumber,questionNumber,overallQuestionNumber:overallOffset+questionNumber,
  correctOptionId:null,questionSourcePages:pages(questionNumber),answerKeyPages:[],explanationOrTranslationPages:[],questionVisualAudit:'checked_against_pdf_page',
  answerAudit:'source_absent',explanationTranslationAudit:'source_absent',runtimeTranscriptionStatus:'pending_character_level_verification'};});
const writtenRecords=[
  ...makeWritten({section:'vocabulary',problemNumber:1,count:7,pages:()=>[1]}),
  ...makeWritten({section:'vocabulary',problemNumber:2,count:5,pages:q=>q<=3?[1]:[2],overallOffset:7}),
  ...makeWritten({section:'vocabulary',problemNumber:3,count:6,pages:()=>[2],overallOffset:12}),
  ...makeWritten({section:'vocabulary',problemNumber:4,count:3,pages:q=>q===1?[2]:[3],overallOffset:18}),
  ...makeWritten({section:'grammar-reading',problemNumber:1,count:9,pages:q=>q<=4?[3]:[4]}),
  ...makeWritten({section:'grammar-reading',problemNumber:2,count:4,pages:q=>q<=2?[4]:[5],overallOffset:9}),
  ...makeWritten({section:'grammar-reading',problemNumber:3,count:4,pages:q=>q<=2?[5]:[5,6],overallOffset:13}),
  ...makeWritten({section:'grammar-reading',problemNumber:4,count:2,pages:q=>q===1?[6]:[6,7],overallOffset:17}),
  ...makeWritten({section:'grammar-reading',problemNumber:5,count:2,pages:()=>[7],overallOffset:19}),
  ...makeWritten({section:'grammar-reading',problemNumber:6,count:1,pages:()=>[8],overallOffset:21}),
];
const timingSeconds=[
  ['listening-p1-q1',209.82,266.32],['listening-p1-q2',266.32,332.92],['listening-p1-q3',332.92,395.58],
  ['listening-p1-q4',395.58,456.36],['listening-p1-q5',456.36,521.32],['listening-p1-q6',521.32,598.28],['listening-p1-q7',598.28,669.28],
  ['listening-p2-q1',791.92,862.18],['listening-p2-q2',862.18,917.78],['listening-p2-q3',917.78,973.24],
  ['listening-p2-q4',973.24,1035.60],['listening-p2-q5',1035.60,1095.56],['listening-p2-q6',1095.56,1165.42],
  ['listening-p3-q1',1305.72,1344.56],['listening-p3-q2',1344.56,1376.56],['listening-p3-q3',1376.56,1408.10],
  ['listening-p3-q4',1408.10,1446.10],['listening-p3-q5',1446.10,1481.80],
  ['listening-p4-q1',1563.32,1588.82],['listening-p4-q2',1588.82,1615.62],['listening-p4-q3',1615.62,1642.40],
  ['listening-p4-q4',1642.40,1673.80],['listening-p4-q5',1673.80,1706.18],['listening-p4-q6',1706.18,1741.40],
];
const timingCandidates=timingSeconds.map(([auditId,startSeconds,endSeconds])=>({auditId,start:Math.round(startSeconds*1000),end:Math.round(endSeconds*1000)}));
assert.ok(timingCandidates.every((item,index)=>item.start===Math.round(timingSeconds[index][1]*1000)&&item.end===Math.round(timingSeconds[index][2]*1000)));
const problemCounts=[7,6,5,6];const listeningRecords=problemCounts.flatMap((count,problemIndex)=>Array.from({length:count},(_,index)=>{const problemNumber=problemIndex+1,questionNumber=index+1,auditId=`listening-p${problemNumber}-q${questionNumber}`;const timing=timingCandidates.find(item=>item.auditId===auditId)??null;
  const questionSourcePages=problemNumber===1?[questionNumber===1?9:questionNumber<=3?10:questionNumber<=6?11:12]:problemNumber===2?[questionNumber<=2?13:questionNumber<=5?14:15]:problemNumber===3?[questionNumber===1?15:questionNumber<=4?16:17]:[];
  return{auditId,section:'listening',problemNumber,questionNumber,correctOptionId:null,questionSourcePages,answerKeyPages:[],transcriptSourcePages:[],questionVisualAudit:questionSourcePages.length?'checked_against_pdf_page':'not_applicable_audio_only',answerAudit:'source_absent',transcriptAudit:'source_absent',
    timingMs:timing?{start:timing.start,end:timing.end}:null,timingEvidence:timing?{method:'local Whisper small word-timestamp navigation aligned to printed question order and recognized question markers',authoritativeSourceTiming:false}:null,
    timingVerificationStatus:timing?'candidate_unverified':'missing',humanReviewed:false,perceptualApproval:false,reviewDisposition:'needs_later_review'};}));
assert.equal(writtenRecords.length,43);assert.equal(new Set(writtenRecords.map(r=>r.auditId)).size,43);assert.equal(listeningRecords.length,24);assert.equal(new Set(listeningRecords.map(r=>r.auditId)).size,24);
fs.writeFileSync(path.join(outputDir,'written.audit.json'),`${JSON.stringify({counts:{vocabulary:21,grammarReading:22,total:43,answersPresent:0,explanationsPresent:0},records:writtenRecords},null,2)}\n`);
fs.writeFileSync(path.join(outputDir,'listening.audit.json'),`${JSON.stringify({counts:{responses:24,problems:problemCounts,answersPresent:0,transcriptsPresent:0,candidateTimings:timingCandidates.length},records:listeningRecords},null,2)}\n`);
console.log(`N5 2021-12 SOURCE AUDIT DATA: ${writtenRecords.length} written, ${listeningRecords.length} listening, ${timingCandidates.length} timing candidates.`);
