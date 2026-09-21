import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import content from './n2-2017-12-written-content.mjs';

const source=fs.readFileSync('src/data/jlpt-mock/n2-2017-12-official.ts','utf8');
const key=(name)=>source.match(new RegExp(`${name} = \\[([\\s\\S]*?)\\]`))[1].match(/\d+/g).map(Number);
const writtenKey=key('N2_2017_12_WRITTEN_KEY'),listeningKey=key('N2_2017_12_LISTENING_KEY');
if(content.length!==75)throw new Error(`Expected 75 written items, got ${content.length}`);
const problem=n=>n<=5?1:n<=10?2:n<=22?3:n<=27?4:n<=32?5:n<=44?7:n<=49?8:n<=54?9:n<=59?10:n<=68?11:n<=70?12:n<=73?13:14;
const family=n=>n<=5?'kanji-reading':n<=10?'orthography':n<=22?'vocabulary-context':n<=27?'vocabulary-synonym':n<=32?'vocabulary-usage':n<=44?'grammar-fill':n<=49?'grammar-order':n<=54?'grammar-text':n<=59?'reading-short':n<=68?'reading-medium':n<=70?'reading-comparative':n<=73?'reading-long':'reading-information-retrieval';
const page=n=>n<=17?2:n<=31?3:n<=43?4:n<=54?5:n<=59?7:n<=65?8:n<=68?9:n<=70?10:n<=73?11:12;
const written=content.map((x,i)=>({questionNumber:i+1,problemNumber:problem(i+1),family:family(i+1),promptJa:x.prompt,options:x.options,correctOptionId:String(writtenKey[i]),sourcePage:page(i+1),sourcePages:[page(i+1)]}));
const audio='assets/jlpt/n2/2017-12/audio/n2-2017-12.mp3';
const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',audio],{encoding:'utf8'}).trim());
const counts=[5,6,5,12,4],unique=31,step=(duration-30)/unique;let k=0,s=0;const listening=[];
for(let p=1;p<=5;p++)for(let i=1;i<=counts[p-1];i++){const shared=p===5&&i>=3,seg=shared?29:s++,suffix=shared?(i===3?'a':'b'):undefined,start=15+seg*step,end=15+(seg+1)*step;listening.push({problemNumber:p,questionNumber:shared?3:i,...(suffix?{responseSuffix:suffix}:{}),promptJa:`問題${p}・質問${shared?3:i}${suffix?`（${suffix==='a'?1:2}）`:''}`,options:Array.from({length:p===4?3:4},(_,j)=>String(j+1)),correctOptionId:String(listeningKey[k++]),audioSeconds:[+start.toFixed(3),+end.toFixed(3)],transcriptJa:`問題${p}の質問${shared?3:i}です。音声原本から統合した候補区間です。詳細な書き起こしの校閲は後続レビューで行います。`,source:{questionPages:[p<=3?12:13],answerScriptPages:[Math.min(14,p*2+2)]},candidateStatus:'candidate_unverified',humanReviewed:false,perceptualApproval:false,reviewDisposition:'needs_later_review'});}
const dir='docs/jlpt-workspace/conversion/n2-2017-12';fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(`${dir}/written.review.json`,`${JSON.stringify(written,null,2)}\n`);fs.writeFileSync(`${dir}/listening.review.json`,`${JSON.stringify(listening,null,2)}\n`);
console.log(`prepared ${written.length} written and ${listening.length} listening responses; audio ${duration.toFixed(3)}s`);
