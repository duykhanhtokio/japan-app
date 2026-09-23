import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const outputDir='docs/jlpt-workspace/conversion/n5-2020-12'; fs.mkdirSync(outputDir,{recursive:true});
const makeWritten=({section,problemNumber,count,pages,overallOffset=0})=>Array.from({length:count},(_,index)=>{const questionNumber=index+1;return{
  auditId:`${section}-p${problemNumber}-q${questionNumber}`,section,problemNumber,questionNumber,overallQuestionNumber:overallOffset+questionNumber,
  correctOptionId:null,questionSourcePages:pages(questionNumber),answerKeyPages:[],explanationOrTranslationPages:[],questionVisualAudit:'checked_against_pdf_page',
  answerAudit:'source_absent',explanationTranslationAudit:'source_absent',runtimeTranscriptionStatus:'pending_character_level_verification'};});
const writtenRecords=[
  ...makeWritten({section:'vocabulary',problemNumber:1,count:12,pages:q=>q<=11?[2]:[3]}),
  ...makeWritten({section:'vocabulary',problemNumber:2,count:8,pages:()=>[3],overallOffset:12}),
  ...makeWritten({section:'vocabulary',problemNumber:3,count:10,pages:q=>q===1?[3]:[4],overallOffset:20}),
  ...makeWritten({section:'vocabulary',problemNumber:4,count:5,pages:q=>q<=4?[5]:[6],overallOffset:30}),
  ...makeWritten({section:'grammar-reading',problemNumber:1,count:16,pages:q=>q<=9?[8]:[9]}),
  ...makeWritten({section:'grammar-reading',problemNumber:2,count:5,pages:()=>[10],overallOffset:16}),
  ...makeWritten({section:'grammar-reading',problemNumber:3,count:5,pages:()=>[11,12],overallOffset:21}),
  ...makeWritten({section:'grammar-reading',problemNumber:4,count:3,pages:q=>[12+q],overallOffset:26}),
  ...makeWritten({section:'grammar-reading',problemNumber:5,count:2,pages:()=>[16,17],overallOffset:29}),
  ...makeWritten({section:'grammar-reading',problemNumber:6,count:1,pages:()=>[17,18],overallOffset:31}),
];

const questionTracks=[
  ['listening-p1-q1','BPT_N5_2_05.mp3',173.498069,245.196007],['listening-p1-q2','BPT_N5_2_06.mp3',245.196007,318.301320],
  ['listening-p1-q3','BPT_N5_2_07.mp3',318.301320,389.087076],['listening-p1-q4','BPT_N5_2_08.mp3',389.087076,452.862014],
  ['listening-p1-q5','BPT_N5_2_09.mp3',452.862014,527.088014],['listening-p1-q6','BPT_N5_2_10.mp3',527.088014,594.954770],
  ['listening-p1-q7','BPT_N5_2_11.mp3',594.954770,657.609026],
  ['listening-p2-q1','BPT_N5_2_14.mp3',767.749151,845.128718],['listening-p2-q2','BPT_N5_2_15.mp3',845.128718,925.349096],
  ['listening-p2-q3','BPT_N5_2_16.mp3',925.349096,988.993721],['listening-p2-q4','BPT_N5_2_17.mp3',988.993721,1070.412977],
  ['listening-p2-q5','BPT_N5_2_18.mp3',1070.412977,1134.396415],['listening-p2-q6','BPT_N5_2_19.mp3',1134.396415,1204.999728],
  ['listening-p3-q1','BPT_N5_2_23.mp3',1333.331487,1367.056365],['listening-p3-q2','BPT_N5_2_24.mp3',1367.056365,1402.397121],
  ['listening-p3-q3','BPT_N5_2_25.mp3',1402.397121,1442.403059],['listening-p3-q4','BPT_N5_2_26.mp3',1442.403059,1477.691684],
  ['listening-p3-q5','BPT_N5_2_27.mp3',1477.691684,1512.380873],
  ['listening-p4-q1','BPT_N5_2_30.mp3',1591.011442,1621.895509],['listening-p4-q2','BPT_N5_2_31.mp3',1621.895509,1653.248698],
  ['listening-p4-q3','BPT_N5_2_32.mp3',1653.248698,1683.376954],['listening-p4-q4','BPT_N5_2_33.mp3',1683.376954,1714.313143],
  ['listening-p4-q5','BPT_N5_2_34.mp3',1714.313143,1745.171143],['listening-p4-q6','BPT_N5_2_35.mp3',1745.171143,1778.244456],
];
const timingCandidates=questionTracks.map(([auditId,sourceFile,startSeconds,endSeconds])=>({auditId,sourceFile,start:Math.round(startSeconds*1000),end:Math.round(endSeconds*1000)}));
assert.ok(timingCandidates.every((item,index)=>item.start===Math.round(questionTracks[index][2]*1000)&&item.end===Math.round(questionTracks[index][3]*1000)));
const problemCounts=[7,6,5,6]; const listeningRecords=problemCounts.flatMap((count,problemIndex)=>Array.from({length:count},(_,index)=>{
  const problemNumber=problemIndex+1,questionNumber=index+1,auditId=`listening-p${problemNumber}-q${questionNumber}`,timing=timingCandidates.find(item=>item.auditId===auditId);
  const questionSourcePages=problemNumber===1?[questionNumber<=2?21:questionNumber<=4?22:questionNumber<=6?23:24]:problemNumber===2?[questionNumber<=2?26:questionNumber<=4?27:28]:problemNumber===3?[questionNumber<=2?30:questionNumber<=4?31:32]:[];
  return{auditId,section:'listening',problemNumber,questionNumber,correctOptionId:null,questionSourcePages,answerKeyPages:[],transcriptSourcePages:[],
    questionVisualAudit:questionSourcePages.length?'checked_against_pdf_page':'not_applicable_audio_only',answerAudit:'source_absent',transcriptAudit:'source_absent',
    audioSourceFile:timing.sourceFile,timingMs:{start:timing.start,end:timing.end},timingEvidence:{method:'supplied question-track metadata and mechanically accumulated source-file durations',authoritativeSourceTiming:false},
    timingVerificationStatus:'candidate_unverified',humanReviewed:false,perceptualApproval:false,reviewDisposition:'needs_later_review'};
}));
assert.equal(writtenRecords.length,67);assert.equal(new Set(writtenRecords.map(r=>r.auditId)).size,67);assert.equal(listeningRecords.length,24);assert.equal(new Set(listeningRecords.map(r=>r.auditId)).size,24);
fs.writeFileSync(path.join(outputDir,'written.audit.json'),`${JSON.stringify({counts:{vocabulary:35,grammarReading:32,total:67,answersPresent:0,explanationsPresent:0},records:writtenRecords},null,2)}\n`);
fs.writeFileSync(path.join(outputDir,'listening.audit.json'),`${JSON.stringify({counts:{responses:24,problems:problemCounts,answersPresent:0,transcriptsPresent:0,candidateTimings:24},records:listeningRecords},null,2)}\n`);
console.log(`N5 2020 catalog-target SOURCE AUDIT DATA: ${writtenRecords.length} written, ${listeningRecords.length} listening, ${timingCandidates.length} candidate track boundaries.`);
