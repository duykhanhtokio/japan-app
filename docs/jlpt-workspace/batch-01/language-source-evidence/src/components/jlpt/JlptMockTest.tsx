import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { JlptLevel } from '@/data/jlpt-learning';
import type { JlptMockQuestion, JlptSectionId } from '@/data/jlpt-mock/types';
import { sampleExamFor } from '@/data/jlpt-mock/sample-exams';
import { JLPT_MAXIMUM_SCORE, scoreJlptMock } from '@/data/jlpt-exam-config';
import { saveSectionScore } from '@/services/jlpt-progress-storage';
import JlptQuestionFeed from '@/components/jlpt/JlptQuestionFeed';
import JlptAudioButton from '@/components/jlpt/JlptAudioButton';
import { useAppLanguage } from '@/context/LanguageContext';
import { jlptResultCopy, type JlptResultCopy } from '@/i18n/jlpt-result-copy';
import { ROYAL, ROYAL_FONT, RoyalButton, RoyalDialogueFrame, RoyalInfoPanel, RoyalTitlePanel } from '@/components/ui/RoyalSurface';

type Props={level:JlptLevel}; type Phase={id:string;title:string;sections:JlptSectionId[];minutes:number};
const phasesFor=(level:JlptLevel):readonly Phase[]=>{
 if(level==='N5')return[{id:'vocabulary',title:'言語知識（文字・語彙）',sections:['vocabulary'],minutes:20},{id:'grammar-reading',title:'言語知識（文法）・読解',sections:['grammar','reading'],minutes:40},{id:'listening',title:'聴解',sections:['listening'],minutes:30}];
 if(level==='N4')return[{id:'vocabulary',title:'言語知識（文字・語彙）',sections:['vocabulary'],minutes:25},{id:'grammar-reading',title:'言語知識（文法）・読解',sections:['grammar','reading'],minutes:55},{id:'listening',title:'聴解',sections:['listening'],minutes:35}];
 if(level==='N3')return[{id:'vocabulary',title:'言語知識（文字・語彙）',sections:['vocabulary'],minutes:30},{id:'grammar-reading',title:'言語知識（文法）・読解',sections:['grammar','reading'],minutes:70},{id:'listening',title:'聴解',sections:['listening'],minutes:40}];
 if(level==='N2')return[{id:'written',title:'言語知識（文字・語彙・文法）・読解',sections:['vocabulary','grammar','reading'],minutes:105},{id:'listening',title:'聴解',sections:['listening'],minutes:50}];
 return[{id:'written',title:'言語知識（文字・語彙・文法）・読解',sections:['vocabulary','grammar','reading'],minutes:110},{id:'listening',title:'聴解',sections:['listening'],minutes:60}];
};
const clock=(seconds:number)=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
export default function JlptMockTest({level}:Props){
 const exam=useMemo(()=>sampleExamFor(level),[level]),phases=useMemo(()=>phasesFor(level),[level]);
 const totalSeconds=useMemo(()=>phases.reduce((sum,item)=>sum+item.minutes*60,0),[phases]);
 const initialPhaseTimes=()=>Object.fromEntries(phases.map(item=>[item.id,item.minutes*60])) as Record<string,number>;
 const[started,setStarted]=useState(false),[phaseIndex,setPhaseIndex]=useState(0),[phaseRemaining,setPhaseRemaining]=useState<Record<string,number>>(initialPhaseTimes),[totalRemaining,setTotalRemaining]=useState(totalSeconds),[answers,setAnswers]=useState<Record<string,string>>({}),[scrollOffsets,setScrollOffsets]=useState<Record<string,number>>({}),[submitted,setSubmitted]=useState(false); const phase=phases[phaseIndex],remaining=phaseRemaining[phase.id]??0;
 const questions=useMemo(()=>exam.questions.filter(q=>phase.sections.includes(q.section)),[exam,phase]); const parts=useMemo(()=>exam.parts.filter(p=>phase.sections.includes(p.section)),[exam,phase]); const answered=questions.filter(q=>answers[q.id]).length;
 useEffect(()=>{if(!started||submitted)return;const timer=setInterval(()=>{setPhaseRemaining(current=>({...current,[phase.id]:Math.max(0,(current[phase.id]??0)-1)}));setTotalRemaining(v=>Math.max(0,v-1));},1000);return()=>clearInterval(timer);},[started,submitted,phase.id]);
 useEffect(()=>{if(!started||submitted||remaining>0)return;if(phaseIndex<phases.length-1)next();else void submit();},[remaining,started,submitted,phaseIndex,phases.length]);
 useEffect(()=>{if(started&&!submitted&&totalRemaining===0)void submit();},[totalRemaining,started,submitted]);
 const summaries=useMemo(()=>Object.fromEntries((['vocabulary','grammar','reading','listening'] as const).map(section=>{const items=exam.questions.filter(q=>q.section===section);return[section,{correct:items.filter(q=>answers[q.id]===q.correctOptionId).length,total:items.length}];})) as Record<JlptSectionId,{correct:number;total:number}>,[answers,exam]); const result=useMemo(()=>scoreJlptMock(level,summaries),[level,summaries]);
 const choose=(questionId:string,optionId:string)=>setAnswers(current=>({...current,[questionId]:optionId}));
 function next(){const n=phaseIndex+1;if(n<phases.length)setPhaseIndex(n);}
 function previous(){const n=phaseIndex-1;if(n>=0)setPhaseIndex(n);}
 async function submit(){await saveSectionScore(level,'test',Math.round(result.total/result.maximum*100));setSubmitted(true);}
 function restart(){setStarted(false);setSubmitted(false);setPhaseIndex(0);setPhaseRemaining(initialPhaseTimes());setTotalRemaining(totalSeconds);setAnswers({});setScrollOffsets({});}
 if(!started)return <View style={s.start}><RoyalInfoPanel label={`JLPT模擬試験 ${level}`}><Text style={s.startTitle}>第1回</Text><Text style={s.startText}>全{exam.questions.length}問 · 総時間 {Math.round(totalSeconds/60)}分</Text><Text style={s.muted}>{phases.map(item=>`${item.title} ${item.minutes}分`).join(' → ')}</Text><Text style={s.muted}>提出後に解答・解説・音声スクリプトを確認できます。</Text></RoyalInfoPanel><RoyalButton style={s.primary} onPress={()=>setStarted(true)} label="試験を始める" /></View>;
 if(submitted)return <Result level={level} exam={exam} answers={answers} summaries={summaries} result={result} restart={restart}/>;
 return <View style={s.exam}><RoyalDialogueFrame style={s.header}><View style={s.headerCopy}><Text style={s.phaseTitle}>{phase.title}</Text><Text style={s.muted}>{answered}/{questions.length} 回答済み · {phaseIndex+1}/{phases.length}</Text></View><View><Text style={[s.timer,remaining<300&&s.danger]}>科目 {clock(remaining)}</Text><Text style={[s.totalTimer,totalRemaining<600&&s.danger]}>全体 {clock(totalRemaining)}</Text></View></RoyalDialogueFrame><View style={s.feed}><JlptQuestionFeed key={phase.id} parts={parts} questions={questions} answers={answers} onChoose={choose} initialScrollOffset={scrollOffsets[phase.id]??0} onScrollOffset={(offset)=>setScrollOffsets(current=>({...current,[phase.id]:offset}))}/></View><View style={s.bottomRow}><RoyalButton disabled={phaseIndex===0} compact style={s.bottomButton} onPress={previous} label="前の試験科目へ" />{phaseIndex<phases.length-1?<RoyalButton compact style={s.bottomButton} onPress={next} label="次の試験科目へ" />:<RoyalButton compact style={s.bottomButton} onPress={()=>void submit()} label="答案を提出する" />}</View></View>;
}
function Result({level,exam,answers,summaries,result,restart}:{level:JlptLevel;exam:ReturnType<typeof sampleExamFor>;answers:Record<string,string>;summaries:Record<JlptSectionId,{correct:number;total:number}>;result:ReturnType<typeof scoreJlptMock>;restart:()=>void}){const{language}=useAppLanguage(),copy=jlptResultCopy[language];return <ScrollView contentContainerStyle={s.reviewContent}><RoyalTitlePanel style={s.scoreCard}><Text style={s.kicker}>{level} 第1回</Text><Text style={s.score}>{result.total}/{JLPT_MAXIMUM_SCORE}</Text><Text style={result.passed?s.pass:s.fail}>{result.passed?copy.passed:copy.failed}</Text></RoyalTitlePanel><RoyalDialogueFrame style={s.scoreDetail}><Text style={s.scaleNote}>{copy.scoreNote}</Text><Text style={s.sectionScore}>{copy.vocabularyGrammar}: {summaries.vocabulary.correct+summaries.grammar.correct}/{summaries.vocabulary.total+summaries.grammar.total}</Text><Text style={s.sectionScore}>{copy.reading}: {summaries.reading.correct}/{summaries.reading.total}</Text><Text style={s.sectionScore}>{copy.listening}: {summaries.listening.correct}/{summaries.listening.total}</Text></RoyalDialogueFrame><Text style={s.reviewHeading}>{copy.review}</Text>{exam.questions.map((q,i)=><Review key={q.id} question={q} number={i+1} selected={answers[q.id]} copy={copy}/>) }<RoyalButton style={s.primary} onPress={restart} label={copy.retry} /></ScrollView>}
function Review({question,number,selected,copy}:{question:JlptMockQuestion;number:number;selected?:string;copy:JlptResultCopy}){const ok=selected===question.correctOptionId,selectedText=question.options.find(o=>o.id===selected)?.text??copy.unanswered,correctText=question.options.find(o=>o.id===question.correctOptionId)?.text;return <RoyalDialogueFrame style={s.reviewCard}><Text style={[s.status,ok?s.pass:s.fail]}>{copy.question} {number} · {ok?copy.correct:copy.incorrect}</Text>{question.passage?<RoyalDialogueFrame style={s.passageFrame}><Text style={s.passage}>{question.passage}</Text></RoyalDialogueFrame>:null}<Text style={s.reviewPrompt}>{question.prompt}</Text><Text style={s.answerLine}>{copy.yourAnswer}: {selectedText}</Text><Text style={s.correctLine}>{copy.correctAnswer}: {question.correctOptionId}. {correctText}</Text><Text style={s.explanation}>{question.explanation}</Text>{question.audioScript?<View><JlptAudioButton prompt={question.prompt} script={question.audioScript}/><Text style={s.transcriptTitle}>{copy.audioTranscript}</Text><RoyalDialogueFrame style={s.transcriptFrame}><Text style={s.transcript}>{question.audioTranscript}</Text></RoyalDialogueFrame></View>:null}</RoyalDialogueFrame>}
const s=StyleSheet.create({
 exam:{flex:1},
 feed:{flex:1},
 header:{marginHorizontal:12,marginTop:8,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},
 headerCopy:{flex:1,minWidth:0},
 phaseTitle:{fontSize:19,lineHeight:27,fontFamily:ROYAL_FONT.heading,color:ROYAL.ink},
 timer:{fontSize:18,lineHeight:25,fontFamily:ROYAL_FONT.heading,color:ROYAL.darkGold,textAlign:'right'},
 totalTimer:{fontSize:16,lineHeight:23,fontFamily:ROYAL_FONT.body,color:ROYAL.lacquer,textAlign:'right',marginTop:3},
 danger:{color:'#9f2028'},
 bottomRow:{flexDirection:'row',gap:8,paddingHorizontal:12,paddingVertical:8},
 bottomButton:{flex:1},
 start:{padding:16,gap:12},
 primary:{marginTop:4},
 kicker:{fontFamily:ROYAL_FONT.heading,color:ROYAL.paleGold,textAlign:'center'},
 startTitle:{fontSize:34,lineHeight:43,fontFamily:ROYAL_FONT.heading,color:ROYAL.ink,textAlign:'center',marginTop:5},
 startText:{fontSize:16,lineHeight:24,fontFamily:ROYAL_FONT.body,color:ROYAL.ink,textAlign:'center',marginTop:10},
 muted:{color:ROYAL.darkGold,fontFamily:ROYAL_FONT.body,lineHeight:21,marginTop:5},
 reviewContent:{padding:16,paddingBottom:60},
 scoreCard:{paddingVertical:20},
 scoreDetail:{marginTop:10},
 score:{fontSize:44,lineHeight:54,fontFamily:ROYAL_FONT.heading,color:ROYAL.white,textAlign:'center',marginVertical:3},
 pass:{color:'#17613e',fontFamily:ROYAL_FONT.heading},
 fail:{color:'#9f2028',fontFamily:ROYAL_FONT.heading},
 scaleNote:{fontSize:15,lineHeight:22,fontFamily:ROYAL_FONT.body,color:ROYAL.ink,marginBottom:12},
 sectionScore:{fontSize:16,lineHeight:24,fontFamily:ROYAL_FONT.body,color:ROYAL.ink},
 reviewHeading:{fontSize:23,lineHeight:31,fontFamily:ROYAL_FONT.heading,color:ROYAL.lacquer,marginVertical:18},
 reviewCard:{marginBottom:12},
 status:{marginBottom:9},
 passageFrame:{marginBottom:10},
 passage:{fontSize:18,lineHeight:30,fontFamily:ROYAL_FONT.body,color:ROYAL.ink},
 reviewPrompt:{fontSize:18,lineHeight:28,fontFamily:ROYAL_FONT.heading,color:ROYAL.ink},
 answerLine:{marginTop:12,color:ROYAL.ink,fontFamily:ROYAL_FONT.body,lineHeight:23},
 correctLine:{marginTop:5,color:'#17613e',fontFamily:ROYAL_FONT.heading,lineHeight:23},
 explanation:{marginTop:10,lineHeight:23,fontFamily:ROYAL_FONT.body,color:ROYAL.ink},
 transcriptTitle:{fontFamily:ROYAL_FONT.heading,color:ROYAL.lacquer,marginTop:12},
 transcriptFrame:{marginTop:6},
 transcript:{fontFamily:ROYAL_FONT.body,color:ROYAL.ink,lineHeight:24},
});
