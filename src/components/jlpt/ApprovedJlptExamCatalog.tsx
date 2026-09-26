import { useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from 'expo-router';

import ApprovedMockExam from '@/components/jlpt/ApprovedMockExam';
import N1OfficialTrial from '@/components/jlpt/N1OfficialTrial';
import { JlptExamHeader, JlptPaper } from '@/components/jlpt/ui/JlptExamUI';
import type { JlptLevel } from '@/data/jlpt-learning';
import { MOCK_JLPT_EXAMS, PENDING_JLPT_EXAMS, type JlptExamCatalogEntry } from '@/data/jlpt-official/jlpt-exam-catalog';
import { APPROVED_N1_EXAMS, type ApprovedN1Exam } from '@/data/jlpt-official/approved-n1-exams';
import { JLPT_EXAM } from '@/theme/jlpt-exam-design-system';

type Choice =
  | { kind: 'structured'; exam: ApprovedN1Exam }
  | { kind: 'pending'; exam: JlptExamCatalogEntry }
  | { kind: 'mock'; id: string; level: JlptLevel };

export default function ApprovedJlptExamCatalog({ level, onBack }: { level: JlptLevel; onBack: () => void }) {
  const navigation = useNavigation();
  const [selected, setSelected] = useState<Choice | null>(null);
  const activeExamExit = useRef<(() => void) | null>(null);
  const choices = useMemo<Choice[]>(() => {
    const structured: Choice[] = APPROVED_N1_EXAMS.filter((exam) => exam.level === level).map((exam) => ({ kind: 'structured' as const, exam }));
    const pending: Choice[] = PENDING_JLPT_EXAMS.filter((exam) => exam.level === level).map((exam) => ({ kind: 'pending' as const, exam }));
    const mock = MOCK_JLPT_EXAMS.find((exam) => exam.level === level);
    return [...structured, ...pending, ...(mock ? [{ kind: 'mock' as const, id: mock.id, level }] : [])];
  }, [level]);

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

  if (selected?.kind === 'structured') return <N1OfficialTrial exam={selected.exam} onExit={() => { activeExamExit.current = null; setSelected(null); }} registerExit={(handler) => { activeExamExit.current = handler; }} />;
  if (selected?.kind === 'mock') return <ApprovedMockExam level={selected.level} onExit={() => setSelected(null)} />;
  if (selected?.kind === 'pending') return <View style={styles.screen}><JlptExamHeader title={`${selected.exam.level} · ${selected.exam.periodLabel}`} subtitle="変換状況" onBack={() => setSelected(null)} /><ScrollView contentContainerStyle={styles.content}><JlptPaper><Text style={styles.heading}>データ変換中</Text><Text style={styles.description}>この試験は現在、一問ずつ回答できる形式へ変換中です。元の資料はすべて保存されています。</Text><Pressable accessibilityRole="button" onPress={() => setSelected(null)} style={({ pressed }) => [styles.returnButton, pressed && styles.pressed]}><Text style={styles.returnButtonText}>試験一覧に戻る</Text></Pressable></JlptPaper></ScrollView></View>;

  return <View style={styles.screen}><JlptExamHeader title={`${level} · JLPT模擬試験`} subtitle="受験する試験を選択" onBack={onBack} /><ScrollView contentContainerStyle={styles.content}><JlptPaper><Text style={styles.heading}>試験一覧</Text><Text style={styles.description}>収録済みの試験をすべて表示しています。変換中の試験も一覧から消えません。</Text>{choices.map((choice, index) => {
    const official = choice.kind !== 'mock';
    const date = choice.kind === 'mock' ? '模擬試験' : choice.exam.periodLabel;
    const count = choice.kind === 'structured' ? choice.exam.questions.length : undefined;
    const pending = choice.kind === 'pending';
    return <Pressable key={choice.kind === 'mock' ? choice.id : choice.exam.id} accessibilityRole="button" onPress={() => setSelected(choice)} style={({ pressed }) => [styles.examRow, pressed && styles.pressed]}><View style={styles.copy}><Text style={styles.examTitle}>{official ? `第${index + 1}回 · 実題` : '模擬試験 · 第1回'}</Text><Text style={styles.period}>{date}</Text>{count ? <Text style={styles.count}>全{count}回答</Text> : null}{pending ? <Text style={styles.pending}>一問形式へ変換中</Text> : null}</View><Text style={styles.chevron}>›</Text></Pressable>;
  })}</JlptPaper></ScrollView></View>;
}

const styles = StyleSheet.create({screen:{flex:1,backgroundColor:JLPT_EXAM.color.page},content:{paddingVertical:12,paddingHorizontal:8,backgroundColor:JLPT_EXAM.color.page},heading:{fontFamily:JLPT_EXAM.font.content,fontSize:JLPT_EXAM.type.sectionTitle,lineHeight:31,color:JLPT_EXAM.color.ink,marginBottom:8},description:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:22,color:JLPT_EXAM.color.secondaryInk,marginBottom:20},examRow:{minHeight:92,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:JLPT_EXAM.color.divider,backgroundColor:JLPT_EXAM.color.paper,paddingHorizontal:16,paddingVertical:14,marginBottom:12},copy:{flex:1,minWidth:0},examTitle:{fontFamily:JLPT_EXAM.font.content,fontSize:18,lineHeight:26,color:JLPT_EXAM.color.ink},period:{fontFamily:JLPT_EXAM.font.interface,fontSize:15,lineHeight:22,color:JLPT_EXAM.color.selected,marginTop:2},count:{fontFamily:JLPT_EXAM.font.interface,fontSize:13,lineHeight:19,color:JLPT_EXAM.color.secondaryInk,marginTop:2},pending:{fontFamily:JLPT_EXAM.font.interface,fontSize:13,lineHeight:19,color:JLPT_EXAM.color.secondaryInk,marginTop:4},chevron:{fontFamily:JLPT_EXAM.font.interface,fontSize:34,lineHeight:38,color:JLPT_EXAM.color.ink,marginLeft:12},returnButton:{alignSelf:'flex-start',borderWidth:1,borderColor:JLPT_EXAM.color.ink,paddingHorizontal:18,paddingVertical:11},returnButtonText:{fontFamily:JLPT_EXAM.font.interface,fontSize:15,color:JLPT_EXAM.color.ink},pressed:{opacity:.62}});
