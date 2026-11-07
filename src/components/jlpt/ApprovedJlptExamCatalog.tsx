import JlptAccessNotice from './JlptAccessNotice';
import { learningAction, learningTransaction, learningServerNow } from '@/services/daily-learning-client';
import { loadSubmittedArchive } from '@/services/jlpt-submitted-archive';
import type { LearningSnapshot } from '@/daily-learning/types';
import SafeAreaView from '@/components/ui/StableSafeAreaView';

import { RoyalContentPanel } from '@/components/ui/RoyalPanels';
import JlptStudyBackground from './JlptStudyBackground';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Modal, BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from 'expo-router';
import { isArtworkSource } from '@/components/ui/prepareArtwork';
import { navigateWithPreparedArtwork } from '@/components/ui/prepareSceneRoute';
import { loadJlptTrialSession, type N1TrialSession } from '@/services/jlpt-trial-session-storage';

import N1OfficialTrial from '@/components/jlpt/N1OfficialTrial';
import { JlptExamHeader, JlptPaper } from '@/components/jlpt/ui/JlptExamUI';
import type { JlptLevel } from '@/data/jlpt-learning';
import { APPROVED_N1_EXAMS, type ApprovedN1Exam } from '@/data/jlpt-official/approved-n1-exams';
import { JLPT_EXAM } from '@/theme/jlpt-exam-design-system';
import { loadJlptAttemptSummary, type JlptAttemptSummary } from '@/services/jlpt-exam-attempt-history';

type Choice = { kind: 'structured'; exam: ApprovedN1Exam; label: string; session?: N1TrialSession | null; reviewOnly?: boolean };

export default function ApprovedJlptExamCatalog({ level, onBack }: { level: JlptLevel; onBack: () => void }) {
  const navigation = useNavigation();
  const [accessSnapshot,setAccessSnapshot]=useState<LearningSnapshot|null>(null);
  const [accessMessage,setAccessMessage]=useState('');
  const opening=useRef(false);
  const [history,setHistory]=useState<{choice:Choice;sessions:N1TrialSession[]}|null>(null);
  async function refreshAccess(){try{setAccessSnapshot(await learningAction('account'));setAccessMessage('');}catch(error){setAccessMessage((error as Error).message);}}
  const [selected, setSelected] = useState<Choice | null>(null);
  useEffect(()=>{if(!selected)void refreshAccess();},[selected]);
  const [summaries, setSummaries] = useState<Record<string, JlptAttemptSummary>>({});
  const activeExamExit = useRef<(() => void) | null>(null);
  const choices = useMemo<Choice[]>(() => {
    const structured: Choice[] = APPROVED_N1_EXAMS.filter((exam) => exam.level === level).map((exam, index) => {
      const label = `第${index + 1}回`;
      return { kind: 'structured' as const, label, exam: { ...exam, periodLabel: label, startLabel: '試験を始める' } };
    });
    return structured;
  }, [level]);

  useEffect(() => {
    if (selected) return;
    let active = true;
    void Promise.all(choices.map(async ({ exam }) => [exam.id, await loadJlptAttemptSummary(exam.storageKey)] as const)).then((entries) => {
      if (active) setSummaries(Object.fromEntries(entries));
    });
    return () => { active = false; };
  }, [choices, selected]);

  useEffect(() => {
    if (!selected) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (selected.kind === 'structured' && activeExamExit.current) activeExamExit.current();
      else setSelected(null);
      return true;
    });
    return () => subscription.remove();
  }, [selected]);

  useEffect(() => navigation.addListener('beforeRemove', (event) => {
    if (!selected) return;
    event.preventDefault();
    if (selected.kind === 'structured' && activeExamExit.current) activeExamExit.current();
    else setSelected(null);
  }), [navigation, selected]);

  async function openHistory(choice:Choice){
    const current=await loadJlptTrialSession(choice.exam.storageKey);
    const local=await loadSubmittedArchive(choice.exam.storageKey);
    const cloud=Object.values(accessSnapshot?.state.archives?.[choice.exam.id]??{});
    const sessions=[...new Map([...cloud,...local,...(current?.submitted?[current]:[])].filter(s=>s.submitted&&s.result&&s.submittedAt).map(s=>[s.submittedAt,s])).values()].sort((a,b)=>String(b.submittedAt).localeCompare(String(a.submittedAt)));
    if(!sessions.length){Alert.alert('JLPT','Chưa có bài đã nộp được lưu cho đề này.');return;}
    setHistory({choice,sessions});
  }
  async function showChoice(choice:Choice,session:N1TrialSession|null,reviewOnly=false){
    await navigateWithPreparedArtwork(`/${level}/test`,()=>setSelected({...choice,session,reviewOnly}),
      Object.values(choice.exam.visualOptions).flatMap(source=>isArtworkSource(source)?[source]:[]));
  }
  async function openChoice(choice:Choice){
    if(opening.current)return;opening.current=true;
    try{
      const session=await loadJlptTrialSession(choice.exam.storageKey);
      const archives=await loadSubmittedArchive(choice.exam.storageKey);
      const cloud=accessSnapshot?.state.archives?.[choice.exam.id];
      const archived=session?.submitted?session:archives.at(-1)??(cloud?Object.values(cloud).at(-1):null);
      let allowed=false;
      try { const result=await learningAction('access',{examId:choice.exam.id,runId:session?.submitted?undefined:session?.accessRunId});setAccessSnapshot(result);allowed=!!result.result.allowed; }
      catch(error){setAccessMessage((error as Error).message);}
      if(allowed){await showChoice(choice,session);return;}
      const original=/^n[1-5]-\d{4}-\d{2}-exam-\d+$/.test(choice.exam.id);
      Alert.alert('JLPT',original?'Đề gốc cần 1 vé vàng để mở trong 7 ngày hoặc Premium.':'Đề app tự soạn thuộc Premium 3.000¥/tháng.',[
        {text:'Đóng',style:'cancel'},
        ...(archived?[{text:'Xem bài đã nộp',onPress:()=>{void showChoice(choice,archived,true);}}]:[]),
        ...(original?[{text:'Dùng 1 vé vàng',onPress:()=>{void learningTransaction('unlock',{examId:choice.exam.id}).then(async value=>{setAccessSnapshot(value);await showChoice(choice,session);}).catch(error=>Alert.alert('JLPT',error.message));}}]:[]),
      ]);
    } finally {opening.current=false;}
  }
  function accessLabel(id:string){
    if(!accessSnapshot)return '🔒 · Đang chờ xác minh quyền thi';
    const now=learningServerNow()??accessSnapshot.serverNow;
    if(accessSnapshot.premiumUntil>now)return 'Premium';
    if(accessSnapshot.state.freeExamId===id)return 'Miễn phí';
    const expiry=accessSnapshot.state.grants[id];
    if(expiry>now)return `Vé vàng · Hết hạn ${new Date(expiry).toLocaleString()}`;
    return /^n[1-5]-/.test(id)?'🔒 · Vé vàng / Premium':'🔒 · Premium';
  }

  return <JlptStudyBackground enabled={!!selected}>{selected?.kind === 'structured' ? <SafeAreaView testID="jlpt-exam-safe-area" style={styles.examScreen}><N1OfficialTrial exam={selected.exam} initialSession={selected.session} reviewOnly={selected.reviewOnly} onExit={() => { activeExamExit.current = null; setSelected(null); }} registerExit={(handler) => { activeExamExit.current = handler; }} /></SafeAreaView> : <SafeAreaView style={styles.screen}><JlptExamHeader title={`${level} · 模擬試験一覧`} subtitle="受験する試験を選択" transparent onBack={onBack} /><ScrollView contentContainerStyle={styles.content}><JlptPaper style={styles.catalogPaper}><Text style={styles.heading}>模擬試験一覧</Text><Text style={styles.description}>受験する試験を選んでください。</Text><JlptAccessNotice text={accessMessage || `Chìa khóa: ${accessSnapshot?.state.keys??'—'} · Vé vàng: ${accessSnapshot?.state.tickets??'—'}`} onRetry={()=>{void refreshAccess();}} />{choices.map((choice) => {
    const count = choice.kind === 'structured' ? choice.exam.questions.length : undefined;
    const summary = summaries[choice.exam.id];
    const percent = summary?.latestTotal ? Math.round(summary.latestCorrect / summary.latestTotal * 100) : null;
    const submittedAt = summary?.latestSubmittedAt;
    const submittedDate = submittedAt && Number.isFinite(Date.parse(submittedAt))
      ? new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(submittedAt))
      : '—';
    return <Pressable key={choice.exam.id} accessibilityRole="button" onPress={() => { void openChoice(choice); }} style={({ pressed }) => [pressed && styles.pressed]}><RoyalContentPanel style={styles.examRow}>
      <View style={styles.copy}>
        <Text style={styles.examTitle}>{choice.label}</Text>
        <Text style={styles.count}>全{count}問</Text><Text style={styles.count}>{accessLabel(choice.exam.id)}</Text>
        <View style={styles.stats}>
          <Text style={styles.stat}>受験回数：{summary?.attempts ?? 0}回</Text>
          <Text style={styles.stat}>正答率：{percent === null ? '—' : `${percent}%`}</Text>
          <Text style={styles.lastAttempt}>最終受験：{submittedDate}</Text>
        </View>
      </View>
      <View><Text style={styles.chevron}>›</Text><Pressable accessibilityRole="button" onPress={event=>{event.stopPropagation();void openHistory(choice);}}><Text style={styles.count}>Bài đã nộp</Text></Pressable></View>
    </RoyalContentPanel></Pressable>;
  })}</JlptPaper></ScrollView></SafeAreaView>}<Modal visible={!!history} transparent onRequestClose={()=>setHistory(null)}><View style={{flex:1,backgroundColor:'#0009',padding:24,justifyContent:'center'}}><View style={{maxHeight:'85%',backgroundColor:'#fffaf0',padding:18,borderRadius:12}}><Text style={styles.heading}>Bài đã nộp</Text><ScrollView>{history?.sessions.map(session=><Pressable key={session.submittedAt} style={{paddingVertical:14,borderBottomWidth:1,borderColor:'#d5ccbc'}} onPress={()=>{const choice=history.choice;setHistory(null);void showChoice(choice,session,true);}}><Text style={styles.count}>{session.submittedAt ? new Date(session.submittedAt).toLocaleString() : '—'} · {session.result?.correct}/{session.result?.total}</Text></Pressable>)}</ScrollView><Pressable onPress={()=>setHistory(null)} style={{padding:14}}><Text>Đóng</Text></Pressable></View></View></Modal></JlptStudyBackground>;
}

const styles = StyleSheet.create({examScreen:{flex:1,backgroundColor:'transparent'},screen:{flex:1,backgroundColor:'transparent'},content:{paddingVertical:12,paddingHorizontal:8,backgroundColor:'transparent'},heading:{fontFamily:JLPT_EXAM.font.content,fontSize:JLPT_EXAM.type.sectionTitle,lineHeight:31,color:JLPT_EXAM.color.ink,marginBottom:8},description:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:22,color:JLPT_EXAM.color.secondaryInk,marginBottom:20},catalogPaper:{backgroundColor:'transparent'},examRow:{minHeight:112,flexDirection:'row',alignItems:'center',paddingHorizontal:28,paddingVertical:26,marginBottom:12},copy:{flex:1,minWidth:0},examTitle:{fontFamily:JLPT_EXAM.font.content,fontSize:18,lineHeight:26,color:JLPT_EXAM.color.ink},count:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:21,color:JLPT_EXAM.color.secondaryInk,marginTop:2},stats:{flexDirection:'row',flexWrap:'wrap',columnGap:12,rowGap:4,marginTop:8},stat:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:21,color:JLPT_EXAM.color.ink,flexGrow:1,flexBasis:110},lastAttempt:{fontFamily:JLPT_EXAM.font.interface,fontSize:13,lineHeight:20,color:JLPT_EXAM.color.secondaryInk,marginTop:5},chevron:{fontFamily:JLPT_EXAM.font.interface,fontSize:34,lineHeight:38,color:JLPT_EXAM.color.ink,marginLeft:12},pressed:{opacity:.62}});
