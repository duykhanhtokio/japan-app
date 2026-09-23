import fs from 'node:fs';

const outDir = 'docs/jlpt-workspace/conversion/n4-2021-12';
const listeningStartsMs = [
  [205900,264500,338100,400820,488060,575600,643440,726460],
  [954780,1053440,1143020,1232880,1336540,1452320,1546380],
  [1778120,1814820,1853960,1897860,1936420],
  [2063840,2095980,2128720,2159060,2191440,2227040,2256160,2289020],
];
const listeningSectionEndsMs = [815120,1694360,1977740,2327197];

const makeWritten = (section, counts, pageSets) => counts.flatMap((count, problemIndex) => Array.from({length: count}, (_, questionIndex) => {
  const missing = section==='vocabulary'&&problemIndex===1&&questionIndex===4;
  return {
    auditId: `${section}-p${problemIndex + 1}-q${questionIndex + 1}`,
    section,
    problemNumber: problemIndex + 1,
    questionNumber: questionIndex + 1,
    correctOptionId: null,
    questionSourcePages: missing?[]:pageSets[problemIndex],
    answerKeyPage: null,
    explanationOrTranslationPages: [],
    questionVisualAudit: missing?'source_missing_between_overall_questions_11_and_13':'checked_against_pdf_page',
    answerAudit: 'source_absent',
    explanationTranslationAudit: 'source_absent',
  };
}));

const vocabulary = makeWritten('vocabulary',[7,5,8,4,4],[[1],[2],[2,3],[3,4],[4,5]]);
const grammarReading = makeWritten('grammar-reading',[13,4,4,3,3,2],[[5,6],[6,7],[7,8],[8,9,10],[10,11],[11,12]]);
const listeningCounts=[8,7,5,8];
const listening = listeningCounts.flatMap((count, problemIndex) => Array.from({length:count},(_,questionIndex)=>({
  auditId:`listening-p${problemIndex+1}-q${questionIndex+1}`,
  section:'listening',
  problemNumber:problemIndex+1,
  questionNumber:questionIndex+1,
  correctOptionId:null,
  questionSourcePages:[[13,14,15],[15,16,17],[18,19,20],[20]][problemIndex],
  answerKeyPage:null,
  transcriptSourcePages:[],
  questionVisualAudit:'checked_against_pdf_page',
  answerAudit:'source_absent',
  transcriptAudit:'source_absent; local Whisper output used only as an unverified timing-navigation aid',
  timingMs:{
    start:listeningStartsMs[problemIndex][questionIndex],
    end:listeningStartsMs[problemIndex][questionIndex+1]??listeningSectionEndsMs[problemIndex],
  },
  timingEvidence:{
    method:'local Whisper small word-timestamp navigation with independent section/question markers; no source transcript; boundaries extend to the next question or section marker',
    sourceAudioSha256:'ee1d6e27c114736c2d2d66c87f3d4889b281d10c3d9978b2fc78366edc4365a6',
    sourceTranscript:null,
    authoritativeSourceTiming:false,
  },
  timingVerificationStatus:'candidate_unverified',
  humanReviewed:false,
  perceptualApproval:false,
  reviewDisposition:'needs_later_review',
})));

if(vocabulary.length!==28||grammarReading.length!==29||listening.length!==28) throw new Error('N4 2021-12 expected audit counts invalid');
const ids=[...vocabulary,...grammarReading,...listening].map(record=>record.auditId);
if(new Set(ids).size!==85) throw new Error('N4 2021-12 expected exactly 85 unique audit IDs');
if([...vocabulary,...grammarReading].filter(record=>record.questionSourcePages.length===0).length!==1) throw new Error('N4 2021-12 expected exactly one missing written source item');
for(const record of listening){if(record.timingMs.start>=record.timingMs.end||record.timingMs.end>2327197)throw new Error(`invalid candidate timing ${record.auditId}`);}
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(`${outDir}/written.audit.json`,`${JSON.stringify({counts:{vocabularyExpected:28,vocabularyObserved:27,grammarReadingExpected:29,grammarReadingObserved:29,totalExpected:57,totalObserved:56},records:[...vocabulary,...grammarReading]},null,2)}\n`);
fs.writeFileSync(`${outDir}/listening.audit.json`,`${JSON.stringify({counts:{responsesExpected:28,responsesObserved:28,problems:[8,7,5,8]},records:listening},null,2)}\n`);
console.log('N4 2021-12 audit prepared: 57 expected written IDs (56 observed; overall question 12 missing) + 28 listening response records; answers absent.');
