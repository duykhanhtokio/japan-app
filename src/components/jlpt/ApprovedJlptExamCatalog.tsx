import { useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from 'expo-router';

import ApprovedMockExam from '@/components/jlpt/ApprovedMockExam';
import N1OfficialTrial from '@/components/jlpt/N1OfficialTrial';
import { JlptExamHeader, JlptPaper } from '@/components/jlpt/ui/JlptExamUI';
import type { JlptLevel } from '@/data/jlpt-learning';
import { MOCK_JLPT_EXAMS } from '@/data/jlpt-official/jlpt-exam-catalog';
import { APPROVED_N1_EXAMS, type ApprovedN1Exam } from '@/data/jlpt-official/approved-n1-exams';
import { JLPT_EXAM } from '@/theme/jlpt-exam-design-system';

type Choice =
  | { kind: 'structured'; exam: ApprovedN1Exam; label: string }
  | { kind: 'mock'; id: string; level: JlptLevel; label: string };

export default function ApprovedJlptExamCatalog({ level, onBack }: { level: JlptLevel; onBack: () => void }) {
  const navigation = useNavigation();
  const [selected, setSelected] = useState<Choice | null>(null);
  const activeExamExit = useRef<(() => void) | null>(null);
  const choices = useMemo<Choice[]>(() => {
    const structured: Choice[] = APPROVED_N1_EXAMS.filter((exam) => exam.level === level).map((exam, index) => {
      const label = `Đề số ${index + 1}`;
      return { kind: 'structured' as const, label, exam: { ...exam, periodLabel: label, startLabel: `Bắt đầu ${label.toLowerCase()}` } };
    });
    const mock = MOCK_JLPT_EXAMS.find((exam) => exam.level === level);
    return [...structured, ...(mock ? [{ kind: 'mock' as const, id: mock.id, level, label: `Đề số ${structured.length + 1}` }] : [])];
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
  if (selected?.kind === 'mock') return <ApprovedMockExam level={selected.level} examLabel={selected.label} onExit={() => setSelected(null)} />;

  return <View style={styles.screen}><JlptExamHeader title={`${level} · Danh sách đề`} subtitle="Chọn đề để làm bài" onBack={onBack} /><ScrollView contentContainerStyle={styles.content}><JlptPaper><Text style={styles.heading}>Danh sách đề</Text><Text style={styles.description}>Các đề đã sẵn sàng để làm trực tiếp trên ứng dụng.</Text>{choices.map((choice) => {
    const count = choice.kind === 'structured' ? choice.exam.questions.length : undefined;
    return <Pressable key={choice.kind === 'mock' ? choice.id : choice.exam.id} accessibilityRole="button" onPress={() => setSelected(choice)} style={({ pressed }) => [styles.examRow, pressed && styles.pressed]}><View style={styles.copy}><Text style={styles.examTitle}>{choice.label}</Text>{count ? <Text style={styles.count}>Tổng số câu: {count}</Text> : null}</View><Text style={styles.chevron}>›</Text></Pressable>;
  })}</JlptPaper></ScrollView></View>;
}

const styles = StyleSheet.create({screen:{flex:1,backgroundColor:JLPT_EXAM.color.page},content:{paddingVertical:12,paddingHorizontal:8,backgroundColor:JLPT_EXAM.color.page},heading:{fontFamily:JLPT_EXAM.font.content,fontSize:JLPT_EXAM.type.sectionTitle,lineHeight:31,color:JLPT_EXAM.color.ink,marginBottom:8},description:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:22,color:JLPT_EXAM.color.secondaryInk,marginBottom:20},examRow:{minHeight:92,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:JLPT_EXAM.color.divider,backgroundColor:JLPT_EXAM.color.paper,paddingHorizontal:16,paddingVertical:14,marginBottom:12},copy:{flex:1,minWidth:0},examTitle:{fontFamily:JLPT_EXAM.font.content,fontSize:18,lineHeight:26,color:JLPT_EXAM.color.ink},count:{fontFamily:JLPT_EXAM.font.interface,fontSize:13,lineHeight:19,color:JLPT_EXAM.color.secondaryInk,marginTop:2},chevron:{fontFamily:JLPT_EXAM.font.interface,fontSize:34,lineHeight:38,color:JLPT_EXAM.color.ink,marginLeft:12},pressed:{opacity:.62}});
