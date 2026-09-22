import fs from 'node:fs';

const outDir = 'docs/jlpt-workspace/conversion/n4-2017-07';
const vocabularyKeys = [1,1,4,2,2,3,1,2,4,1,4,3,4,4,1,4,3,2,2,4,3,1,2,3,3,2,1,3,2,4,3,4,1,2];
const grammarReadingKeys = [3,4,1,2,4,2,3,1,2,4,1,1,3,4,2,3,2,4,3,3,2,3,2,1,4,4,3,2,3,2,4,4,1,3,2];
const listeningKeys = [[1,4,3,4,3,2,2,1],[4,2,3,3,1,2,3],[1,2,1,2,1],[2,3,2,1,2,3,3,1]];
const listeningStartsMs = [
  [162600,228180,282640,366520,443380,528940,585900,666100],
  [874300,971300,1063100,1151920,1243860,1340660,1441420],
  [1624200,1661540,1700300,1740720,1777840],
  [1902980,1931540,1963220,1994580,2026180,2057420,2087800,2117520],
];
const listeningSectionEndsMs = [735420,1538780,1814300,2192497];

const makeWritten = (section, counts, keys, pageSets, answerKeyPages) => {
  let offset = 0;
  return counts.flatMap((count, problemIndex) => Array.from({length: count}, (_, questionIndex) => ({
    auditId: `${section}-p${problemIndex + 1}-q${questionIndex + 1}`,
    section,
    problemNumber: problemIndex + 1,
    questionNumber: questionIndex + 1,
    correctOptionId: String(keys[offset++]),
    questionSourcePages: pageSets[problemIndex],
    answerKeyPage: answerKeyPages[problemIndex],
    explanationOrTranslationPages: [],
    questionVisualAudit: 'checked_against_pdf_page',
    answerAudit: `checked_against_page_${answerKeyPages[problemIndex]}_key`,
    explanationTranslationAudit: 'source_absent',
  })));
};

const vocabulary = makeWritten('vocabulary',[9,6,9,5,5],vocabularyKeys,[[2,3],[4],[5,6],[7,8],[9,10]],[43,43,43,43,43]);
const grammarReading = makeWritten('grammar-reading',[15,5,5,4,4,2],grammarReadingKeys,[[11,12,13,14],[15,16],[17,18],[19,20,21,22],[23,24],[25,26]],[43,43,43,44,44,44]);
const listening = listeningKeys.flatMap((keys, problemIndex) => keys.map((answer, questionIndex) => ({
  auditId:`listening-p${problemIndex+1}-q${questionIndex+1}`,
  section:'listening',
  problemNumber:problemIndex+1,
  questionNumber:questionIndex+1,
  correctOptionId:String(answer),
  questionSourcePages:[[28,29,30,31,32],[33,34,35,36,37],[38,39,40,41],[42]][problemIndex],
  answerKeyPage:44,
  transcriptSourcePages:[[45,46,47,48],[48,49,50,51],[51,52],[52,53,54]][problemIndex],
  questionVisualAudit:'checked_against_pdf_page',
  answerAudit:'checked_against_page_44_key',
  transcriptAudit:'source_present_and_cross_checked_against_audio; character_level_runtime_transcription_pending',
  timingMs:{
    start:listeningStartsMs[problemIndex][questionIndex],
    end:listeningStartsMs[problemIndex][questionIndex+1]??listeningSectionEndsMs[problemIndex],
  },
  timingEvidence:{
    method:'local Whisper small word-timestamp alignment; question-number markers cross-referenced to PDF transcript pages; boundaries extend to the next question or section marker',
    sourceAudioSha256:'2de3b7a0f65888ff77c4ac8b4f08e4956359f5b996fb9cc471b2e2627b06dbf5',
    sourceTranscript:'PDF pages 45-54',
    authoritativeSourceTiming:false,
  },
  timingVerificationStatus:'candidate_unverified',
  humanReviewed:false,
  perceptualApproval:false,
  reviewDisposition:'needs_later_review',
})));

if(vocabulary.length!==34||grammarReading.length!==35||listening.length!==28) throw new Error('N4 2017-07 audit counts invalid');
const ids=[...vocabulary,...grammarReading,...listening].map(record=>record.auditId);
if(new Set(ids).size!==97) throw new Error('N4 2017-07 expected exactly 97 unique audit IDs');
for(const record of listening){if(record.timingMs.start>=record.timingMs.end||record.timingMs.end>2192497)throw new Error(`invalid candidate timing ${record.auditId}`);}
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(`${outDir}/written.audit.json`,`${JSON.stringify({counts:{vocabulary:34,grammarReading:35,total:69},records:[...vocabulary,...grammarReading]},null,2)}\n`);
fs.writeFileSync(`${outDir}/listening.audit.json`,`${JSON.stringify({counts:{responses:28,problems:[8,7,5,8]},records:listening},null,2)}\n`);
console.log('N4 2017-07 audit prepared: 69 written + 28 listening response records.');
