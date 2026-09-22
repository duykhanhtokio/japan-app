import fs from 'node:fs';

const outDir = 'docs/jlpt-workspace/conversion/n4-2014-07';
const vocabularyKeys = [4,3,1,2,4,1,2,2,3,3,2,1,4,3,2,2,4,4,2,3,1,4,1,1,3,2,4,4,1,3,2,1,1,3,4];
const grammarReadingKeys = [2,3,1,2,4,1,2,3,3,4,1,1,2,3,4,2,3,4,1,3,2,4,3,1,2,1,1,1,2,4,3,2,4,3,3];
const listeningKeys = [[3,3,1,1,4,3,3,2],[2,2,2,1,3,3,4],[2,2,1,3,2],[3,3,2,3,1,1,2,1]];
const listeningStartsMs = [
  [153280,220600,287820,365440,434800,522580,595300,681240],
  [918360,1013480,1119180,1198440,1297800,1409200,1515020],
  [1732360,1775060,1819920,1858140,1897560],
  [2020880,2055140,2087760,2123140,2156640,2192040,2225900,2260040],
];
const listeningSectionEndsMs = [781080,1648220,1934220,2298906];

const makeWritten = (section, counts, keys, pageSets, explanationSets) => {
  let offset = 0;
  return counts.flatMap((count, problemIndex) => Array.from({length: count}, (_, questionIndex) => ({
    auditId: `${section}-p${problemIndex + 1}-q${questionIndex + 1}`,
    section,
    problemNumber: problemIndex + 1,
    questionNumber: questionIndex + 1,
    correctOptionId: String(keys[offset++]),
    questionSourcePages: pageSets[problemIndex],
    answerKeyPage: 15,
    explanationOrTranslationPages: explanationSets[problemIndex],
    questionVisualAudit: 'checked_against_pdf_page',
    answerAudit: 'checked_against_page_15_key',
    explanationTranslationAudit: 'source_present_not_runtime_transcribed',
  })));
};

const vocabulary = makeWritten('vocabulary',[9,6,10,5,5],vocabularyKeys,[[3],[3,4],[4],[4,5],[5]],[[16],[16],[17],[17],[18]]);
const grammarReading = makeWritten('grammar-reading',[15,5,5,4,4,2],grammarReadingKeys,[[6,7],[7],[7,8],[8,9],[9,10],[10,11]],[[18,19],[19],[19],[20],[20],[20]]);
const listening = listeningKeys.flatMap((keys, problemIndex) => keys.map((answer, questionIndex) => ({
  auditId:`listening-p${problemIndex+1}-q${questionIndex+1}`,
  section:'listening',
  problemNumber:problemIndex+1,
  questionNumber:questionIndex+1,
  correctOptionId:String(answer),
  questionSourcePages:[[12],[13],[13,14],[14]][problemIndex],
  answerKeyPage:15,
  transcriptSourcePages:[[21,22],[22,23],[23,24],[24]][problemIndex],
  questionVisualAudit:'checked_against_pdf_page',
  answerAudit:'checked_against_page_15_key',
  transcriptAudit:'source_present_and_cross_checked_against_audio; character_level_runtime_transcription_pending',
  timingMs:{
    start:listeningStartsMs[problemIndex][questionIndex],
    end:listeningStartsMs[problemIndex][questionIndex+1]??listeningSectionEndsMs[problemIndex],
  },
  timingEvidence:{
    method:'local Whisper small word-timestamp alignment; question-number markers cross-referenced to PDF transcript pages; boundaries extend to the next question or section marker',
    sourceAudioSha256:'80ce92d3503b10457843aa15de0c02a343ab67e8a94460c8109f5c121cf0af9c',
    sourceTranscript:'PDF pages 21-24',
    authoritativeSourceTiming:false,
  },
  timingVerificationStatus:'candidate_unverified',
  humanReviewed:false,
  perceptualApproval:false,
  reviewDisposition:'needs_later_review',
})));

if(vocabulary.length!==35||grammarReading.length!==35||listening.length!==28) throw new Error('N4 2014-07 audit counts invalid');
const ids=[...vocabulary,...grammarReading,...listening].map(record=>record.auditId);
if(new Set(ids).size!==98) throw new Error('duplicate audit IDs');
for(const record of listening){if(record.timingMs.start>=record.timingMs.end||record.timingMs.end>2298906)throw new Error(`invalid candidate timing ${record.auditId}`);}
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(`${outDir}/written.audit.json`,`${JSON.stringify({counts:{vocabulary:35,grammarReading:35,total:70},records:[...vocabulary,...grammarReading]},null,2)}\n`);
fs.writeFileSync(`${outDir}/listening.audit.json`,`${JSON.stringify({counts:{responses:28,problems:[8,7,5,8]},records:listening},null,2)}\n`);
console.log('N4 2014-07 audit prepared: 70 written + 28 listening response records.');
