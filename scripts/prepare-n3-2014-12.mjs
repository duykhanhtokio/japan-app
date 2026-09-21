import fs from 'node:fs';
import content from './n3-2014-12-written-content.mjs';

const source=fs.readFileSync('src/data/jlpt-mock/n3-2014-12-official.ts','utf8');
const key=(name)=>source.match(new RegExp(`${name} = \\[([\\s\\S]*?)\\]`))[1].match(/\d+/g).map(Number);
const writtenKey=key('N3_2014_12_WRITTEN_KEY'),listeningKey=key('N3_2014_12_LISTENING_KEY');
if(content.length!==74)throw new Error(`Expected 74 written items, got ${content.length}`);
const problem=n=>n<=8?1:n<=14?2:n<=25?3:n<=30?4:n<=35?5:n<=48?6:n<=53?7:n<=58?8:n<=62?9:n<=68?10:n<=72?11:12;
const family=n=>n<=8?'kanji-reading':n<=14?'orthography':n<=25?'vocabulary-context':n<=30?'vocabulary-synonym':n<=35?'vocabulary-usage':n<=48?'grammar-fill':n<=53?'grammar-order':n<=58?'grammar-text':n<=62?'reading-short':n<=68?'reading-medium':n<=72?'reading-long':'reading-information-retrieval';
const page=n=>n<=18?2:n<=33?3:n<=47?4:n<=56?5:n<=61?6:n<=65?7:n<=72?8:9;
const written=content.map((x,i)=>({questionNumber:i+1,problemNumber:problem(i+1),family:family(i+1),promptJa:x.prompt,options:x.options,correctOptionId:String(writtenKey[i]),sourcePage:page(i+1),sourcePages:[page(i+1)]}));
// The source recording is deliberately divided into broad candidate ranges. Exact
// perceptual boundaries are deferred, so no human-review claim is made here.
const candidateDuration=1800,counts=[6,6,3,4,9],step=(candidateDuration-30)/28;let k=0;const listening=[];
for(let p=1;p<=5;p++)for(let i=1;i<=counts[p-1];i++){const start=15+k*step,end=15+(k+1)*step;listening.push({problemNumber:p,questionNumber:i,promptJa:`問題${p}・質問${i}`,options:Array.from({length:p>=4?3:4},(_,j)=>String(j+1)),correctOptionId:String(listeningKey[k++]),audioSeconds:[+start.toFixed(3),+end.toFixed(3)],transcriptJa:`問題${p}の質問${i}です。音声原本から統合した候補区間です。詳細な書き起こしの校閲は後続レビューで行います。`,source:{questionPages:[p===1?10:11],answerScriptPages:[Math.min(14,p+8)]},candidateStatus:'candidate_unverified',humanReviewed:false,perceptualApproval:false,reviewDisposition:'needs_later_review'});}
const dir='docs/jlpt-workspace/conversion/n3-2014-12';fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(`${dir}/written.review.json`,`${JSON.stringify(written,null,2)}\n`);fs.writeFileSync(`${dir}/listening.review.json`,`${JSON.stringify(listening,null,2)}\n`);
console.log(`prepared ${written.length} written and ${listening.length} listening responses; candidate window ${candidateDuration}s`);
