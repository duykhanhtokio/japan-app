import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { JlptExamHeader, JlptPaper } from '@/components/jlpt/ui/JlptExamUI';
import type { ApprovedN1Exam } from '@/data/jlpt-official/approved-n1-exams';
import { JLPT_EXAM } from '@/theme/jlpt-exam-design-system';

export default function N1ExamPicker({ exams, onChoose, onBack }: { exams: readonly ApprovedN1Exam[]; onChoose: (exam: ApprovedN1Exam) => void; onBack: () => void }) {
  return <View style={styles.screen}>
    <JlptExamHeader title="N1 · JLPT模擬試験" subtitle="受験する試験を選択" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content}><JlptPaper>
      <Text style={styles.heading}>試験一覧</Text>
      <Text style={styles.description}>原本・解答・聴解データの検証が完了した試験です。</Text>
      {exams.map((exam) => <Pressable key={exam.id} accessibilityRole="button" onPress={() => onChoose(exam)} style={({ pressed }) => [styles.examRow, pressed && styles.pressed]}>
        <View style={styles.copy}><Text style={styles.examTitle}>{exam.title}</Text><Text style={styles.period}>{exam.periodLabel}</Text><Text style={styles.count}>全{exam.questions.length}問</Text></View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>)}
    </JlptPaper></ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:JLPT_EXAM.color.page},
  content:{paddingVertical:12,paddingHorizontal:8,backgroundColor:JLPT_EXAM.color.page},
  heading:{fontFamily:JLPT_EXAM.font.content,fontSize:JLPT_EXAM.type.sectionTitle,lineHeight:31,color:JLPT_EXAM.color.ink,marginBottom:8},
  description:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:22,color:JLPT_EXAM.color.secondaryInk,marginBottom:20},
  examRow:{minHeight:92,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:JLPT_EXAM.color.divider,backgroundColor:JLPT_EXAM.color.paper,paddingHorizontal:16,paddingVertical:14,marginBottom:12},
  copy:{flex:1,minWidth:0},examTitle:{fontFamily:JLPT_EXAM.font.content,fontSize:18,lineHeight:26,color:JLPT_EXAM.color.ink},
  period:{fontFamily:JLPT_EXAM.font.interface,fontSize:15,lineHeight:22,color:JLPT_EXAM.color.selected,marginTop:2},
  count:{fontFamily:JLPT_EXAM.font.interface,fontSize:13,lineHeight:19,color:JLPT_EXAM.color.secondaryInk,marginTop:2},
  chevron:{fontFamily:JLPT_EXAM.font.interface,fontSize:34,lineHeight:38,color:JLPT_EXAM.color.ink,marginLeft:12},pressed:{opacity:.62},
});
