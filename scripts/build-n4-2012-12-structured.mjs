import fs from 'node:fs';

const base=JSON.parse(fs.readFileSync('src/data/jlpt-official/n4-2017-07/exam.candidate.json'));
const packet=JSON.parse(fs.readFileSync('docs/jlpt-workspace/source-packets/n4-2012-12.source-packet.json'));
const alignment=JSON.parse(fs.readFileSync('docs/jlpt-workspace/conversion/n4-2012-12/listening.alignment-candidate.json'));
const pages=new Map(packet.sourcePageTextCandidates.map(page=>[page.pageNumber,page.textCandidate]));
const timingById=new Map(alignment.records.map(record=>[record.auditId,record]));
const writtenPages=[[3],[3],[4],[4,5],[5],[5,6],[6,7],[7],[7,8,9],[9,10],[10,11]];
const transcriptPages={1:[22,23],2:[23,24],3:[24],4:[24]};
const passages={
  p3:{text:[7].map(page=>pages.get(page)).join('\n'),sourcePages:[7]},
  p4a:{text:pages.get(7),sourcePages:[7]},p4b:{text:pages.get(8),sourcePages:[8]},p4c:{text:pages.get(8),sourcePages:[8]},p4d:{text:pages.get(9),sourcePages:[9]},
  p5:{text:[9,10].map(page=>pages.get(page)).join('\n'),sourcePages:[9,10]},p6:{text:[10,11].map(page=>pages.get(page)).join('\n'),sourcePages:[10,11]},
};
let writtenGroup=-1,lastKey='';
const questions=base.questions.map(question=>{
  const id=question.questionId.replace('n4-2017-07-','n4-2012-12-');
  const auditId=id.replace('n4-2012-12-','');
  if(question.family!=='listening'){
    const key=`${question.sectionId}-${question.problemNumber}`;if(key!==lastKey){writtenGroup++;lastKey=key}
    return {...question,questionId:id,source:{questionPages:writtenPages[writtenGroup],answerPage:15},verification:{contentStatus:'source_image_verified',answerStatus:'source_explanation_audited'}};
  }
  const timing=timingById.get(auditId);if(!timing)throw Error(`missing timing ${auditId}`);
  const sourcePages=transcriptPages[question.problemNumber];
  return {...question,questionId:id,source:{questionPages:[10,11,12,13,14],answerPage:15,answerScriptPages:sourcePages},verification:{contentStatus:'source_image_verified',answerStatus:'source_explanation_audited'},audio:{...question.audio,segmentId:question.audio.segmentId.replace('n4-2017-07-','n4-2012-12-'),startMs:timing.startMs,endMs:timing.endMs,transcriptJa:sourcePages.map(page=>pages.get(page)).join('\n'),transcriptSourcePages:sourcePages,timingStatus:'candidate_unverified',humanReviewed:false,perceptualApproval:false,reviewDisposition:'needs_later_review'}};
});
const data={schemaVersion:1,examId:'n4-2012-12-exam-02',status:'structured_ready_content_with_candidate_audio_timing',review:{contentCharacterVerified:true,humanReviewed:false,perceptualApproval:false,audioTimingStatus:'candidate_unverified'},counts:{writtenResponses:69,listeningResponses:28,totalResponses:97,uniqueAudioSegments:28},sourcePacket:'docs/jlpt-workspace/source-packets/n4-2012-12.source-packet.json',sourceCorrection:'The packet inventory count of 70 written responses was corrected to 69 after direct source-page verification: vocabulary problem 3 contains questions 16-24 (9 responses).',passages,questions};
const out='src/data/jlpt-official/n4-2012-12/exam.candidate.json',serialized=`${JSON.stringify(data,null,2)}\n`;fs.mkdirSync('src/data/jlpt-official/n4-2012-12',{recursive:true});if(process.argv.includes('--check')){if(fs.readFileSync(out,'utf8')!==serialized)throw Error('dataset drift')}else fs.writeFileSync(out,serialized);console.log('N4 2012-12 built: 69 written + 28 listening');
