import { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View, type ImageSourcePropType } from 'react-native';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';

import { JlptActionButton, JlptAnswerOption, JlptExamHeader, JlptPaper, JlptProgressBar, JlptSubmitConfirmation } from '@/components/jlpt/ui/JlptExamUI';
import type { ApprovedScannedExam } from '@/data/jlpt-official/approved-scanned-exams.generated';
import { clearJlptTrialSession, loadJlptTrialSession, saveJlptTrialSession } from '@/services/jlpt-trial-session-storage';
import { JLPT_EXAM } from '@/theme/jlpt-exam-design-system';

type Phase = 'written' | 'listening';
type Answers = Record<string, string>;
const answerId = (phase: Phase, index: number) => `${phase}-${index + 1}`;
const clock = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

function SourcePages({ pages, label }: { pages: readonly ImageSourcePropType[]; label: string }) {
  const { width } = useWindowDimensions();
  const pageWidth = Math.min(920, width - 36);
  return <View style={styles.pages}>{pages.map((source, index) => <View key={`${label}-${index}`} style={styles.pageWrap}>
    <Text style={styles.pageLabel}>{label} · {index + 1}/{pages.length}</Text>
    <Image source={source} resizeMode="contain" style={{ width: pageWidth, height: pageWidth * 1.4142 }} />
  </View>)}</View>;
}

function AnswerGrid({ phase, count, answers, disabled, onChoose }: { phase: Phase; count: number; answers: Answers; disabled?: boolean; onChoose: (id: string, value: string) => void }) {
  return <View style={styles.answerList}>{Array.from({ length: count }, (_, index) => {
    const id = answerId(phase, index);
    return <View key={id} style={styles.answerRow}><Text style={styles.answerNumber}>{index + 1}</Text><View style={styles.options}>
      {['1', '2', '3', '4'].map((value) => <JlptAnswerOption key={value} number={value} selected={answers[id] === value} disabled={disabled} scale={1} onPress={() => onChoose(id, value)}>{value}</JlptAnswerOption>)}
    </View></View>;
  })}</View>;
}

export default function ApprovedScannedExamScreen({ exam, onExit }: { exam: ApprovedScannedExam; onExit: () => void }) {
  const storageKey = `jlpt:${exam.id}:approved-ui:v1`;
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<Phase>('written');
  const [remaining, setRemaining] = useState(exam.writtenMinutes * 60);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const player = useAudioPlayer(exam.audio);
  const total = exam.writtenKey.length + exam.listeningKey.length;
  const answered = Object.keys(answers).length;

  useEffect(() => { void setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false }); }, []);
  useEffect(() => { void loadJlptTrialSession(storageKey).then((saved) => { if (!saved?.started) return; setAnswers(saved.answers); setStarted(true); setSubmitted(saved.submitted); setPhase(saved.currentQuestion === 'listening' ? 'listening' : 'written'); }); }, [storageKey]);
  useEffect(() => { if (!started || submitted || phase !== 'written') return; const timer = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000); return () => clearInterval(timer); }, [phase, started, submitted]);
  useEffect(() => { if (started && phase === 'written' && remaining === 0) { setPhase('listening'); void persist(answers, 'listening'); } }, [remaining, started, phase, answers]);
  useEffect(() => () => player.pause(), [player]);

  const correct = useMemo(() => exam.writtenKey.filter((value, index) => answers[answerId('written', index)] === String(value)).length + exam.listeningKey.filter((value, index) => answers[answerId('listening', index)] === String(value)).length, [answers, exam]);
  const persist = (nextAnswers = answers, nextPhase = phase, nextSubmitted = submitted) => saveJlptTrialSession(storageKey, { answers: nextAnswers, mode: 'exam', status: nextSubmitted ? 'submitted' : 'in_progress', started: true, submitted: nextSubmitted, currentQuestion: nextPhase, scrollY: 0, playedAudioSegments: [], submittedAt: nextSubmitted ? new Date().toISOString() : null, result: nextSubmitted ? { correct, wrong: total - correct, unanswered: total - Object.keys(nextAnswers).length, total } : null });
  const choose = (id: string, value: string) => { if (submitted) return; const next = { ...answers, [id]: value }; setAnswers(next); void persist(next); };
  function changePhase(next: Phase) { player.pause(); setPhase(next); void persist(answers, next); }
  function begin() { setAnswers({}); setStarted(true); setSubmitted(false); setPhase('written'); setRemaining(exam.writtenMinutes * 60); void clearJlptTrialSession(storageKey).then(() => persist({}, 'written', false)); }
  function submit() { player.pause(); setConfirming(false); setSubmitted(true); void persist(answers, phase, true); }
  function restart() { player.pause(); void player.seekTo(0); setStarted(false); setSubmitted(false); setAnswers({}); setPhase('written'); setRemaining(exam.writtenMinutes * 60); void clearJlptTrialSession(storageKey); }

  if (!started) return <View style={styles.screen}><JlptExamHeader title={`${exam.level} · JLPT模擬試験`} subtitle="日本語能力試験" onBack={onExit} /><ScrollView contentContainerStyle={styles.start}><JlptPaper><Text style={styles.title}>{exam.dateLabel} 実題</Text><Text style={styles.copy}>原本の問題ページ、正答表、聴解音声を収録しています。正答とスクリプトは提出後に表示されます。</Text><Text style={styles.copy}>全{total}回答 · 筆記 {exam.writtenMinutes}分 · 聴解 {exam.listeningMinutesLabel}</Text><JlptActionButton label="試験を始める" onPress={begin} style={styles.action} /></JlptPaper></ScrollView></View>;

  if (submitted) return <View style={styles.screen}><JlptExamHeader title={`${exam.level} · 試験結果`} subtitle={exam.dateLabel} onBack={onExit} /><ScrollView contentContainerStyle={styles.content}><JlptPaper><Text style={styles.resultTitle}>試験結果</Text><Text style={styles.score}>{correct}/{total}</Text><Text style={styles.copy}>正答率 {Math.round(correct / total * 100)}% · 未回答 {total - answered}</Text><Text style={styles.note}>公式の尺度得点への換算や合否判定は行いません。</Text><Text style={styles.heading}>正答表（原本）</Text><SourcePages pages={[exam.answerKeyPage]} label="ANSWER KEY" /><Text style={styles.heading}>聴解スクリプト（原本）</Text><SourcePages pages={exam.scriptPages} label="SCRIPT" /><JlptActionButton kind="secondary" label="もう一度受験する" onPress={restart} style={styles.action} /></JlptPaper></ScrollView></View>;

  const phaseCount = phase === 'written' ? exam.writtenKey.length : exam.listeningKey.length;
  const phaseAnswers = Object.keys(answers).filter((id) => id.startsWith(`${phase}-`)).length;
  return <View style={styles.screen}><JlptExamHeader title={`${exam.level} · ${exam.dateLabel}`} subtitle={phase === 'written' ? `筆記 · ${clock(remaining)}` : '聴解'} onBack={onExit} /><View style={styles.progressCopy}><Text style={styles.progressText}>{answered}/{total} 回答済み</Text></View><JlptProgressBar answered={answered} total={total} /><ScrollView contentContainerStyle={styles.content}><JlptPaper>
    <Text style={styles.heading}>{phase === 'written' ? '言語知識・読解' : '聴解'}</Text>
    {phase === 'listening' ? <View style={styles.audioRow}><JlptActionButton label="▶ 音声を再生" onPress={() => player.play()} /><JlptActionButton kind="secondary" label="一時停止" onPress={() => player.pause()} /></View> : null}
    <SourcePages pages={phase === 'written' ? exam.writtenPages : exam.listeningPages} label="問題冊子" />
    <Text style={styles.heading}>解答欄（{phaseAnswers}/{phaseCount}）</Text><AnswerGrid phase={phase} count={phaseCount} answers={answers} onChoose={choose} />
    {phase === 'written' ? <JlptActionButton label="聴解へ進む" onPress={() => changePhase('listening')} style={styles.action} /> : <><JlptActionButton kind="secondary" label="筆記へ戻る" onPress={() => changePhase('written')} style={styles.action} /><JlptActionButton label="答案を提出する" onPress={() => setConfirming(true)} style={styles.action} /></>}
  </JlptPaper></ScrollView><JlptSubmitConfirmation visible={confirming} total={total} answered={answered} onCancel={() => setConfirming(false)} onSubmit={submit} /></View>;
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:JLPT_EXAM.color.page},start:{flexGrow:1,justifyContent:'center',padding:16,backgroundColor:JLPT_EXAM.color.page},content:{paddingVertical:12,paddingHorizontal:8,backgroundColor:JLPT_EXAM.color.page},title:{fontFamily:JLPT_EXAM.font.content,fontSize:24,lineHeight:34,color:JLPT_EXAM.color.ink,textAlign:'center'},copy:{fontFamily:JLPT_EXAM.font.interface,fontSize:15,lineHeight:24,color:JLPT_EXAM.color.secondaryInk,textAlign:'center',marginTop:10},note:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:22,color:JLPT_EXAM.color.secondaryInk,borderLeftWidth:4,borderLeftColor:JLPT_EXAM.color.unanswered,padding:12,marginTop:16},action:{marginTop:14},heading:{fontFamily:JLPT_EXAM.font.content,fontSize:22,lineHeight:31,color:JLPT_EXAM.color.ink,marginVertical:14},progressCopy:{paddingHorizontal:12,paddingVertical:8,backgroundColor:JLPT_EXAM.color.paper},progressText:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,color:JLPT_EXAM.color.ink},pages:{alignItems:'center',gap:12},pageWrap:{backgroundColor:JLPT_EXAM.color.paper,borderWidth:1,borderColor:JLPT_EXAM.color.divider},pageLabel:{padding:7,fontFamily:JLPT_EXAM.font.interface,color:JLPT_EXAM.color.secondaryInk},answerList:{gap:10},answerRow:{borderBottomWidth:1,borderBottomColor:JLPT_EXAM.color.divider,paddingBottom:10},answerNumber:{fontFamily:JLPT_EXAM.font.content,fontSize:18,color:JLPT_EXAM.color.ink,marginBottom:5},options:{width:'100%'},audioRow:{gap:8,marginBottom:16},resultTitle:{fontFamily:JLPT_EXAM.font.content,fontSize:28,lineHeight:38,color:JLPT_EXAM.color.ink,textAlign:'center'},score:{fontFamily:JLPT_EXAM.font.content,fontSize:42,lineHeight:54,color:JLPT_EXAM.color.correct,textAlign:'center',marginTop:10},
});
