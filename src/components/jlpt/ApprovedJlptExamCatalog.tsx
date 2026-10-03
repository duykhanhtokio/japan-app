import { SafeAreaView } from 'react-native-safe-area-context';
import { RoyalContentPanel } from '@/components/ui/RoyalPanels';
import JlptStudyBackground from './JlptStudyBackground';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from 'expo-router';

import N1OfficialTrial from '@/components/jlpt/N1OfficialTrial';
import { JlptExamHeader, JlptPaper } from '@/components/jlpt/ui/JlptExamUI';
import type { JlptLevel } from '@/data/jlpt-learning';
import { APPROVED_N1_EXAMS, type ApprovedN1Exam } from '@/data/jlpt-official/approved-n1-exams';
import { JLPT_EXAM } from '@/theme/jlpt-exam-design-system';
import { loadJlptAttemptSummary, type JlptAttemptSummary } from '@/services/jlpt-exam-attempt-history';

type Choice = { kind: 'structured'; exam: ApprovedN1Exam; label: string };

export default function ApprovedJlptExamCatalog({ level, onBack }: { level: JlptLevel; onBack: () => void }) {
  const navigation = useNavigation();
  const [selected, setSelected] = useState<Choice | null>(null);
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

  if (selected?.kind === 'structured') return <SafeAreaView testID="jlpt-exam-safe-area" style={styles.examScreen}><N1OfficialTrial exam={selected.exam} onExit={() => { activeExamExit.current = null; setSelected(null); }} registerExit={(handler) => { activeExamExit.current = handler; }} /></SafeAreaView>;
  return <JlptStudyBackground><SafeAreaView style={styles.screen}><JlptExamHeader title={`${level} · 模擬試験一覧`} subtitle="受験する試験を選択" transparent onBack={onBack} /><ScrollView contentContainerStyle={styles.content}><JlptPaper style={styles.catalogPaper}><Text style={styles.heading}>模擬試験一覧</Text><Text style={styles.description}>受験する試験を選んでください。</Text>{choices.map((choice) => {
    const count = choice.kind === 'structured' ? choice.exam.questions.length : undefined;
    const summary = summaries[choice.exam.id];
    const percent = summary?.latestTotal ? Math.round(summary.latestCorrect / summary.latestTotal * 100) : null;
    const submittedAt = summary?.latestSubmittedAt;
    const submittedDate = submittedAt && Number.isFinite(Date.parse(submittedAt))
      ? new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(submittedAt))
      : '—';
    return <Pressable key={choice.exam.id} accessibilityRole="button" onPress={() => setSelected(choice)} style={({ pressed }) => [pressed && styles.pressed]}><RoyalContentPanel style={styles.examRow}>
      <View style={styles.copy}>
        <Text style={styles.examTitle}>{choice.label}</Text>
        <Text style={styles.count}>全{count}問</Text>
        <View style={styles.stats}>
          <Text style={styles.stat}>受験回数：{summary?.attempts ?? 0}回</Text>
          <Text style={styles.stat}>正答率：{percent === null ? '—' : `${percent}%`}</Text>
          <Text style={styles.lastAttempt}>最終受験：{submittedDate}</Text>
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </RoyalContentPanel></Pressable>;
  })}</JlptPaper></ScrollView></SafeAreaView></JlptStudyBackground>;
}

const styles = StyleSheet.create({examScreen:{flex:1,backgroundColor:JLPT_EXAM.color.page},screen:{flex:1,backgroundColor:'transparent'},content:{paddingVertical:12,paddingHorizontal:8,backgroundColor:'transparent'},heading:{fontFamily:JLPT_EXAM.font.content,fontSize:JLPT_EXAM.type.sectionTitle,lineHeight:31,color:JLPT_EXAM.color.ink,marginBottom:8},description:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:22,color:JLPT_EXAM.color.secondaryInk,marginBottom:20},catalogPaper:{backgroundColor:'transparent'},examRow:{minHeight:112,flexDirection:'row',alignItems:'center',paddingHorizontal:28,paddingVertical:26,marginBottom:12},copy:{flex:1,minWidth:0},examTitle:{fontFamily:JLPT_EXAM.font.content,fontSize:18,lineHeight:26,color:JLPT_EXAM.color.ink},count:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:21,color:JLPT_EXAM.color.secondaryInk,marginTop:2},stats:{flexDirection:'row',flexWrap:'wrap',columnGap:12,rowGap:4,marginTop:8},stat:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:21,color:JLPT_EXAM.color.ink,flexGrow:1,flexBasis:110},lastAttempt:{fontFamily:JLPT_EXAM.font.interface,fontSize:13,lineHeight:20,color:JLPT_EXAM.color.secondaryInk,marginTop:5},chevron:{fontFamily:JLPT_EXAM.font.interface,fontSize:34,lineHeight:38,color:JLPT_EXAM.color.ink,marginLeft:12},pressed:{opacity:.62}});
