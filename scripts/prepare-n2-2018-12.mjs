import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import content from './n2-2018-12-written-content.mjs';

const source=fs.readFileSync('src/data/jlpt-mock/n2-2018-12-official.ts','utf8');
const key=(name)=>source.match(new RegExp(`${name} = \\[([\\s\\S]*?)\\]`))[1].match(/\d+/g).map(Number);
const writtenKey=key('N2_2018_12_WRITTEN_KEY'),listeningKey=key('N2_2018_12_LISTENING_KEY');
if(content.length!==73)throw new Error(`Expected 73 written items, got ${content.length}`);
const problem=n=>n<=5?1:n<=10?2:n<=15?3:n<=20?4:n<=25?5:n<=30?6:n<=42?7:n<=47?8:n<=52?9:n<=57?10:n<=66?11:n<=68?12:n<=71?13:14;
const family=n=>n<=5?'kanji-reading':n<=10?'orthography':n<=20?'vocabulary-context':n<=25?'vocabulary-synonym':n<=30?'vocabulary-usage':n<=42?'grammar-fill':n<=47?'grammar-order':n<=52?'grammar-text':n<=57?'reading-short':n<=66?'reading-medium':n<=68?'reading-comparative':n<=71?'reading-long':'reading-information-retrieval';
const page=n=>n<=5?3:n<=10?4:n<=15?5:n<=20?6:n<=25?7:n<=30?8:n<=38?9:n<=42?10:n<=47?11:n<=52?12:n<=54?13:n<=57?14:n<=60?15:n<=63?16:n<=66?17:n<=68?18:n<=71?20:22;
const written=content.map((x,i)=>({questionNumber:i+1,problemNumber:problem(i+1),family:family(i+1),promptJa:x.prompt,options:x.options,correctOptionId:String(writtenKey[i]),sourcePage:page(i+1),sourcePages:[page(i+1)]}));
const audio='assets/jlpt/n2/2018-12/audio/n2-2018-12.mp3';
const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',audio],{encoding:'utf8'}).trim());
const counts=[5,6,5,10,4],unique=29,step=(duration-30)/unique;let k=0,s=0;const listening=[];
for(let p=1;p<=5;p++)for(let i=1;i<=counts[p-1];i++){const shared=p===5&&i>=3,seg=shared?27:s++,suffix=shared?(i===3?'a':'b'):undefined,start=15+seg*step,end=15+(seg+1)*step;listening.push({problemNumber:p,questionNumber:shared?3:i,...(suffix?{responseSuffix:suffix}:{}),promptJa:`問題${p}・質問${shared?3:i}${suffix?`（${suffix==='a'?1:2}）`:''}`,options:Array.from({length:p===4?3:4},(_,j)=>String(j+1)),correctOptionId:String(listeningKey[k++]),audioSeconds:[+start.toFixed(3),+end.toFixed(3)],transcriptJa:`問題${p}の質問${shared?3:i}です。音声原本から統合した候補区間です。詳細な書き起こしの校閲は後続レビューで行います。`,source:{questionPages:[p<=3?23:p===4?24:25],answerScriptPages:[26]},candidateStatus:'candidate_unverified',humanReviewed:false,perceptualApproval:false,reviewDisposition:'needs_later_review'});}
const dir='docs/jlpt-workspace/conversion/n2-2018-12';fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(`${dir}/written.review.json`,`${JSON.stringify(written,null,2)}\n`);fs.writeFileSync(`${dir}/listening.review.json`,`${JSON.stringify(listening,null,2)}\n`);
console.log(`prepared ${written.length} written and ${listening.length} listening responses; audio ${duration.toFixed(3)}s`);
