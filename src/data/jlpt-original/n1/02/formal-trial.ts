import type { TrialQuestion, TrialOption } from '../../../jlpt-official/n1-2012-07-trial';
import type { ImageSourcePropType } from 'react-native';
type OriginalQuestion = {
 id:string; section:'vocabulary'|'grammar_reading'|'listening'; group:number; number:number; prompt:string;
 options:{id:TrialOption['id'];text:string}[];correctOptionId:TrialOption['id'];passageId?:string;
 ordering?:{prefix:string;suffix:string;starSlot:number;solutionOptionIds:string[];completedSentence:string};
 sharedDialogueId?:string;
};
const master=require('./master.ja.json') as {examId:string;runtimeIntegrated:boolean;questions:OriginalQuestion[];passages:Record<string,string>};
const organization=require('./listening-organization.ja.json') as {groups:{problem:number;example:{options:{id:string;text:string}[]}}[]};
const audio=require('./audio.manifest.json') as {durationMs:number;matchesLevelDurationTarget:boolean};
export const N1_ORIGINAL_02_SESSION_KEY='jlpt:jpapp:n1:original:02:v1';
export const N1_ORIGINAL_02_REGISTRATION_READY=master.runtimeIntegrated&&audio.matchesLevelDurationTarget;
export const N1_ORIGINAL_02_VISUALS:Readonly<Record<number,ImageSourcePropType>>={};
function practiceInstruction(q:OriginalQuestion):string {
 if(q.section!=='listening'||q.number!==1)return '';
 if([1,2,5].includes(q.group))return '\n練習（採点なし・選択操作不要）：\n'+organization.groups.find(g=>g.problem===q.group)!.example.options.map(o=>o.id+' '+o.text).join('\n');
 return '\n音声の練習は採点しません。練習中は選択ボタンを押しません。';
}
export const N1_ORIGINAL_02_TRIAL:readonly TrialQuestion[]=master.questions.map(q=>{
 const listening=q.section==='listening',ordering=!listening&&q.group===6,reading=!listening&&q.group>=8;
 const family:TrialQuestion['family']=listening?'listening':q.section==='vocabulary'?'vocabulary':ordering?'sentenceComposition':reading?'reading':'grammar';
 const heading=listening?'聴解':q.section==='vocabulary'?'文字・語彙':reading?'読解':'文法';
 const spokenOnly=listening&&[3,4].includes(q.group);
 return {
  id:q.id,sectionId:listening?'listening':'language-knowledge-reading',problemNumber:q.group,questionNumber:q.number,family,label:`${heading}／問題${q.group}／${q.number}`,
  instructionJa:(spokenOnly?'音声の選択肢を聞いて、一つ選んでください。':ordering?'四つのことばを並べて、★に入るものを選んでください。':`${listening?'話を聞いて、':''}いちばんいいものを一つ選んでください。`)+practiceInstruction(q),
  promptJa:listening&&q.group===3?'話を最後まで聞いて、音声の質問に答えてください。':listening&&q.group===4?'音声の短い言葉を聞いて、合う返事の番号を一つ選んでください。':listening&&q.group===5?'複数の条件を聞き、音声の質問に答えてください。'+(q.number===3?'続く二つの質問は同じ話を使います。話は一度だけ再生されます。':''):q.prompt,
  passageId:q.passageId,passageJa:q.passageId?master.passages[q.passageId]:undefined,
  options:q.options.map(o=>({id:o.id,textJa:spokenOnly?`音声の選択肢 ${o.id}`:o.text})),correctOptionId:q.correctOptionId,
  sourcePage:0,explanationStatus:'missing',generatedExplanationStatus:'not_generated',
  audio:listening?{segmentId:q.sharedDialogueId?`${master.examId}-${q.sharedDialogueId}`:`${master.examId}-continuous`,startMs:0,endMs:audio.durationMs,transcriptJa:''}:undefined,
 };
});
if(N1_ORIGINAL_02_TRIAL.length!==106||new Set(N1_ORIGINAL_02_TRIAL.map(q=>q.id)).size!==106)throw new Error('Original N1 02 must retain 106 independent scored IDs.');
