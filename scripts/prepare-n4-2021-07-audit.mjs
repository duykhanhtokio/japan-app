import fs from 'node:fs';

const outDir = 'docs/jlpt-workspace/conversion/n4-2021-07';
const vocabularyKeys = [2,1,3,2,3,4,1,2,4,3,2,1,3,3,2,1,4,2,4,1,4,1,3,4,4,1,2,3];
const grammarReadingKeys = [2,3,3,4,3,1,4,4,2,1,2,4,1,2,4,1,4,2,1,4,3,3,2,4,3,1,4,2,2];
const listeningKeys = [[3,3,2,3,2,1,2,3],[1,2,3,1,3,2,4],[1,3,2,1,2],[3,3,1,1,1,2,2,1]];
const listeningStartsMs = [
  [205080,284620,370580,461180,534780,611280,682840,771980],
  [989160,1088620,1184280,1294660,1417700,1518280,1611780],
  [1839120,1876900,1909080,1950680,1988140],
  [2112340,2138460,2164820,2199600,2230460,2265540,2299840,2336760],
];
const listeningSectionEndsMs = [850560,1753220,2025660,2376020];

const makeWritten = (section, counts, keys, pageSets) => {
  let offset = 0;
  return counts.flatMap((count, problemIndex) => Array.from({length: count}, (_, questionIndex) => ({
    auditId: `${section}-p${problemIndex + 1}-q${questionIndex + 1}`,
    section,
    problemNumber: problemIndex + 1,
    questionNumber: questionIndex + 1,
    correctOptionId: String(keys[offset++]),
    questionSourcePages: pageSets[problemIndex],
    answerKeyPage: 31,
    explanationOrTranslationPages: [],
    questionVisualAudit: 'checked_against_pdf_page',
    answerAudit: 'checked_against_page_31_key',
    explanationTranslationAudit: 'source_absent',
  })));
};

const vocabulary = makeWritten('vocabulary',[7,5,8,4,4],vocabularyKeys,[[2],[3],[4],[5,6],[6,7]]);
const grammarReading = makeWritten('grammar-reading',[13,4,4,3,3,2],grammarReadingKeys,[[8,9,10],[10,11],[11,12],[12,13,14],[15,16],[16,17]]);
const listening = listeningKeys.flatMap((keys, problemIndex) => keys.map((answer, questionIndex) => ({
  auditId:`listening-p${problemIndex+1}-q${questionIndex+1}`,
  section:'listening',
  problemNumber:problemIndex+1,
  questionNumber:questionIndex+1,
  correctOptionId:String(answer),
  questionSourcePages:[[19,20,21,22,23],[24,25,26],[27,28,29,30],[30]][problemIndex],
  answerKeyPage:31,
  transcriptSourcePages:[],
  questionVisualAudit:'checked_against_pdf_page',
  answerAudit:'checked_against_page_31_key',
  transcriptAudit:'source_absent; local Whisper output used only as an unverified timing-navigation aid',
  timingMs:{
    start:listeningStartsMs[problemIndex][questionIndex],
    end:listeningStartsMs[problemIndex][questionIndex+1]??listeningSectionEndsMs[problemIndex],
  },
  timingEvidence:{
    method:'local Whisper small word-timestamp navigation with independent section/question markers; no source transcript; boundaries extend to the next question or section marker',
    sourceAudioSha256:'8f9c61b59b6e6dde9ad4bba9cb47acfb74400288159f76a3ccbd95128e9c4309',
    sourceTranscript:null,
    authoritativeSourceTiming:false,
  },
  timingVerificationStatus:'candidate_unverified',
  humanReviewed:false,
  perceptualApproval:false,
  reviewDisposition:'needs_later_review',
})));

if(vocabulary.length!==28||grammarReading.length!==29||listening.length!==28) throw new Error('N4 2021-07 audit counts invalid');
const ids=[...vocabulary,...grammarReading,...listening].map(record=>record.auditId);
if(new Set(ids).size!==85) throw new Error('N4 2021-07 expected exactly 85 unique audit IDs');
for(const record of listening){if(record.timingMs.start>=record.timingMs.end||record.timingMs.end>2376020)throw new Error(`invalid candidate timing ${record.auditId}`);}
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(`${outDir}/written.audit.json`,`${JSON.stringify({counts:{vocabulary:28,grammarReading:29,total:57},records:[...vocabulary,...grammarReading]},null,2)}\n`);
fs.writeFileSync(`${outDir}/listening.audit.json`,`${JSON.stringify({counts:{responses:28,problems:[8,7,5,8]},records:listening},null,2)}\n`);
console.log('N4 2021-07 audit prepared: 57 written + 28 listening response records.');
