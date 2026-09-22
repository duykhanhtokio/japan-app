import fs from 'node:fs';

const outDir = 'docs/jlpt-workspace/conversion/n4-2013-07';
const vocabularyKeys = [2,4,3,1,4,2,3,1,1,4,3,3,3,4,1,1,2,3,1,4,2,2,2,1,2,4,1,3,1,4,3,2,4,3,2];
const grammarReadingKeys = [1,3,2,3,4,4,2,2,3,3,1,2,4,1,4,1,4,1,2,1,3,1,2,3,4,1,3,2,4,1,4,3,3,2,4];
const listeningKeys = [[2,3,3,1,2,2,4,3],[1,2,1,3,3,2,4],[2,1,1,3,1],[3,3,3,2,2,2,2,1]];
const listeningStartsMs = [
  [203440,279600,350800,424220,509320,585840,655000,727360],
  [946540,1043500,1143880,1227500,1323000,1419800,1514960],
  [1737980,1778580,1812320,1850920,1890400],
  [2015640,2045720,2079400,2111180,2142780,2177680,2208320,2243420],
];
const listeningSectionEndsMs = [806820,1654380,1928540,2276860];
const make = (section, counts, keys, pageSets, explanationSets) => {
  let offset = 0;
  return counts.flatMap((count, problemIndex) => Array.from({length: count}, (_, questionIndex) => ({
    auditId: `${section}-p${problemIndex + 1}-q${questionIndex + 1}`,
    section,
    problemNumber: problemIndex + 1,
    questionNumber: questionIndex + 1,
    correctOptionId: String(keys[offset++]),
    questionSourcePages: pageSets[problemIndex],
    answerKeyPage: 14,
    explanationOrTranslationPages: explanationSets[problemIndex],
    questionVisualAudit: 'checked_against_pdf_page',
    answerAudit: 'checked_against_page_14_key',
    explanationTranslationAudit: 'source_present_not_runtime_transcribed',
  })));
};
const vocabulary = make('vocabulary',[9,6,10,5,5],vocabularyKeys,[[2],[2,3],[3],[3,4],[4]],[[15],[15,16],[16,17],[17],[17]]);
const grammarReading = make('grammar-reading',[15,5,5,4,4,2],grammarReadingKeys,[[5,6],[6],[6,7],[7],[8],[9]],[[18],[18,19],[19],[19],[19],[19]]);
const listening = listeningKeys.flatMap((keys, problemIndex) => keys.map((answer, questionIndex) => ({
  auditId:`listening-p${problemIndex+1}-q${questionIndex+1}`,
  section:'listening',problemNumber:problemIndex+1,questionNumber:questionIndex+1,
  correctOptionId:String(answer),questionSourcePages:[[10,11],[11,12],[12,13],[13]][problemIndex],
  answerKeyPage:14,transcriptSourcePages:[[20,21],[21,22],[22,23],[23]][problemIndex],
  questionVisualAudit:'checked_against_pdf_page',answerAudit:'checked_against_page_14_key',
  transcriptAudit:'source_present_and_cross_checked_against_audio; character_level_runtime_transcription_pending',
  timingMs:{
    start:listeningStartsMs[problemIndex][questionIndex],
    end:listeningStartsMs[problemIndex][questionIndex+1]??listeningSectionEndsMs[problemIndex],
  },
  timingEvidence:{
    method:'local Whisper small word-timestamp alignment; question-number markers cross-referenced to PDF transcript pages; boundaries extend to the next question or section marker',
    sourceAudioSha256:'e7e022baa2fdb50820c15bca39bee099b9834bc0f4daa7b6aa92556f4834fb86',
    sourceTranscript:'PDF pages 20-23',
    authoritativeSourceTiming:false,
  },
  timingVerificationStatus:'candidate_unverified',
  humanReviewed:false,perceptualApproval:false,reviewDisposition:'needs_later_review',
})));
if(vocabulary.length!==35||grammarReading.length!==35||listening.length!==28) throw new Error('N4 2013-07 audit counts invalid');
const ids=[...vocabulary,...grammarReading,...listening].map(x=>x.auditId);if(new Set(ids).size!==98)throw new Error('duplicate audit IDs');
for(const record of listening){if(record.timingMs.start>=record.timingMs.end||record.timingMs.end>2316957)throw new Error(`invalid candidate timing ${record.auditId}`);}
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(`${outDir}/written.audit.json`,`${JSON.stringify({counts:{vocabulary:35,grammarReading:35,total:70},records:[...vocabulary,...grammarReading]},null,2)}\n`);
fs.writeFileSync(`${outDir}/listening.audit.json`,`${JSON.stringify({counts:{responses:28,problems:[8,7,5,8]},records:listening},null,2)}\n`);
console.log('N4 2013-07 audit prepared: 70 written + 28 listening response records.');
