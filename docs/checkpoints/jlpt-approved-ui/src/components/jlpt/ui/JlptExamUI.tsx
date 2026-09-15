import type { PropsWithChildren, ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { JLPT_EXAM } from '@/theme/jlpt-exam-design-system';

export function JlptExamHeader({ title, subtitle, onBack, right }: { title: string; subtitle?: string; onBack: () => void; right?: ReactNode }) {
  return <View style={s.header}>
    <Pressable accessibilityRole="button" accessibilityLabel="戻る" onPress={onBack} hitSlop={8} style={({ pressed }) => [s.back, pressed && s.pressed]}>
      <Text style={s.backText}>‹</Text>
    </Pressable>
    <View style={s.headerCopy}><Text style={s.headerTitle}>{title}</Text>{subtitle ? <Text style={s.headerSubtitle}>{subtitle}</Text> : null}</View>
    {right ? <View style={s.headerRight}>{right}</View> : <View style={s.headerSpacer} />}
  </View>;
}

export function JlptPaper({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[s.paper, style]}>{children}</View>;
}

export function JlptSectionHeading({ problem, detail }: { problem: string; detail?: string }) {
  return <View style={s.sectionHeading}><Text style={s.problem}>{problem}</Text>{detail ? <Text style={s.problemDetail}>{detail}</Text> : null}</View>;
}

export function JlptInstruction({ children, scale = 1 }: PropsWithChildren<{ scale?: number }>) {
  return <Text style={[s.instruction, scaled(JLPT_EXAM.type.instruction, JLPT_EXAM.line.instruction, scale)]}>{children}</Text>;
}

export function JlptReadingPassage({ children, scale = 1 }: PropsWithChildren<{ scale?: number }>) {
  return <View style={s.passageBlock}><Text style={[s.passage, scaled(JLPT_EXAM.type.passage, JLPT_EXAM.line.passage, scale)]}>{children}</Text></View>;
}

export function JlptQuestionText({ children, scale = 1, style }: PropsWithChildren<{ scale?: number; style?: StyleProp<TextStyle> }>) {
  return <Text style={[s.question, scaled(JLPT_EXAM.type.question, JLPT_EXAM.line.question, scale), style]}>{children}</Text>;
}

export function JlptAnswerOption({ number, children, selected, disabled, onPress, scale = 1, accessibilityLabel }: PropsWithChildren<{ number: string | number; selected: boolean; disabled?: boolean; onPress: () => void; scale?: number; accessibilityLabel?: string }>) {
  return <Pressable
    accessibilityRole="radio"
    accessibilityState={{ checked: selected, disabled: !!disabled }}
    accessibilityLabel={accessibilityLabel ?? `${number}. ${typeof children === 'string' ? children : ''}`.trim()}
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [s.answer, selected && s.answerSelected, pressed && !disabled && s.answerPressed]}
  >
    <View style={[s.answerNumber, selected && s.answerNumberSelected]}><Text style={[s.answerNumberText, selected && s.answerNumberTextSelected]}>{number}</Text></View>
    <View style={s.answerCopy}>{typeof children === 'string' ? <Text style={[s.answerText, scaled(JLPT_EXAM.type.answer, JLPT_EXAM.line.answer, scale)]}>{children}</Text> : children}</View>
  </Pressable>;
}

export function JlptProgressBar({ answered, total }: { answered: number; total: number }) {
  const progress = total > 0 ? Math.min(1, Math.max(0, answered / total)) : 0;
  return <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: answered }} style={s.progressTrack}>
    <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
  </View>;
}

export function JlptActionButton({ label, onPress, disabled, kind = 'primary', style }: { label: string; onPress: () => void; disabled?: boolean; kind?: 'primary' | 'secondary' | 'danger'; style?: StyleProp<ViewStyle> }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled: !!disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.action, kind === 'secondary' && s.actionSecondary, kind === 'danger' && s.actionDanger, disabled && s.disabled, pressed && !disabled && s.pressed, style]}>
    <Text style={[s.actionText, kind === 'secondary' && s.actionSecondaryText]}>{label}</Text>
  </Pressable>;
}

export function JlptFontControls({ scale, onSmaller, onLarger }: { scale: number; onSmaller: () => void; onLarger: () => void }) {
  return <View accessibilityRole="toolbar" style={s.fontControls}>
    <Pressable accessibilityRole="button" accessibilityLabel="文字を小さくする" onPress={onSmaller} style={s.fontControl}><Text style={s.fontControlText}>文字 −</Text></Pressable>
    <Text style={s.fontScale}>{Math.round(scale * 100)}%</Text>
    <Pressable accessibilityRole="button" accessibilityLabel="文字を大きくする" onPress={onLarger} style={s.fontControl}><Text style={s.fontControlText}>文字 ＋</Text></Pressable>
  </View>;
}

export function JlptReviewFeedback({ correct, answer, sourcePage }: { correct: boolean; answer: string; sourcePage: number }) {
  return <View style={[s.feedback, correct ? s.feedbackCorrect : s.feedbackWrong]}>
    <Text style={[s.feedbackTitle, correct ? s.correct : s.wrong]}>{correct ? '正解' : '不正解'}</Text>
    <Text style={s.feedbackText}>正答：{answer}　出典：問題冊子 p.{sourcePage}</Text>
  </View>;
}

export function JlptQuestionNavigator({ visible, labels, answered, current, onChoose, onClose }: { visible: boolean; labels: string[]; answered: Set<string>; current?: string; onChoose: (id: string) => void; onClose: () => void }) {
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={s.modalShade}><View style={s.navigator}>
      <View style={s.navigatorHeader}><Text style={s.navigatorTitle}>問題一覧</Text><Pressable accessibilityRole="button" onPress={onClose} style={s.close}><Text style={s.closeText}>閉じる</Text></Pressable></View>
      <View style={s.legend}><Text style={s.legendText}>□ 未回答</Text><Text style={s.legendText}>■ 回答済み</Text></View>
      <ScrollView contentContainerStyle={s.navigatorGrid}>{labels.map((id, index) => <Pressable key={id} accessibilityRole="button" accessibilityLabel={`問題 ${index + 1}`} onPress={() => onChoose(id)} style={[s.navigatorCell, answered.has(id) && s.navigatorAnswered, current === id && s.navigatorCurrent]}><Text style={[s.navigatorCellText, current === id && s.navigatorCurrentText]}>{index + 1}</Text></Pressable>)}</ScrollView>
    </View></View>
  </Modal>;
}

export function JlptResumePrompt({ visible, examName, mode, updatedAt, answered, total, currentLabel, onContinue, onRestart, onCancel }: { visible: boolean; examName: string; mode: 'exam' | 'practice'; updatedAt: string; answered: number; total: number; currentLabel: string; onContinue: () => void; onRestart: () => void; onCancel: () => void }) {
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View style={s.confirmShade}><View accessibilityRole="alert" style={s.resumePanel}>
      <Text style={s.confirmTitle}>前回の続きがあります</Text>
      <Text style={s.resumeExam}>{examName}</Text>
      <Text style={s.confirmLine}>モード：{mode === 'exam' ? '試験モード' : '練習モード'}</Text>
      <Text style={s.confirmLine}>保存日時：{updatedAt}</Text>
      <Text style={s.confirmLine}>回答済み：{answered}/{total}</Text>
      <Text style={s.confirmLine}>前回の位置：{currentLabel}</Text>
      <JlptActionButton label="前回の続きから" onPress={onContinue} style={s.resumePrimary} />
      <JlptActionButton kind="secondary" label="最初からやり直す" onPress={onRestart} style={s.resumeSecondary} />
      <Pressable accessibilityRole="button" onPress={onCancel} style={s.resumeCancel}><Text style={s.resumeCancelText}>キャンセル</Text></Pressable>
    </View></View>
  </Modal>;
}

export function JlptRestartConfirmation({ visible, onCancel, onConfirm }: { visible: boolean; onCancel: () => void; onConfirm: () => void }) {
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View style={s.confirmShade}><View accessibilityRole="alert" style={s.confirmPanel}>
      <Text style={s.confirmTitle}>最初からやり直しますか</Text>
      <Text style={s.confirmLine}>この試験の保存中の回答だけが削除されます。</Text>
      <View style={s.confirmActions}><JlptActionButton kind="secondary" label="キャンセル" onPress={onCancel} style={s.confirmAction} /><JlptActionButton kind="danger" label="やり直す" onPress={onConfirm} style={s.confirmAction} /></View>
    </View></View>
  </Modal>;
}

export function JlptSubmitConfirmation({ visible, total, answered, onCancel, onSubmit }: { visible: boolean; total: number; answered: number; onCancel: () => void; onSubmit: () => void }) {
  const unanswered = Math.max(0, total - answered);
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View style={s.confirmShade}><View accessibilityRole="alert" style={s.confirmPanel}>
      <Text style={s.confirmTitle}>答案を提出しますか</Text>
      <Text style={s.confirmLine}>全問題：{total}</Text>
      <Text style={s.confirmLine}>回答済み：{answered}</Text>
      <Text style={[s.confirmLine, unanswered > 0 && s.confirmWarning]}>未回答：{unanswered}</Text>
      <View style={s.confirmActions}><JlptActionButton kind="secondary" label="戻る" onPress={onCancel} style={s.confirmAction} /><JlptActionButton label="提出する" onPress={onSubmit} style={s.confirmAction} /></View>
    </View></View>
  </Modal>;
}

function scaled(fontSize: number, lineHeight: number, scale: number): TextStyle {
  return { fontSize: Math.round(fontSize * scale), lineHeight: Math.round(lineHeight * scale) };
}

const s = StyleSheet.create({
  header:{minHeight:64,flexDirection:'row',alignItems:'center',paddingHorizontal:10,paddingVertical:8,backgroundColor:JLPT_EXAM.color.paper,borderBottomWidth:1,borderBottomColor:JLPT_EXAM.color.divider},
  back:{width:48,height:48,alignItems:'center',justifyContent:'center'},backText:{fontFamily:JLPT_EXAM.font.interface,fontSize:38,lineHeight:42,color:JLPT_EXAM.color.ink},pressed:{opacity:.62},
  headerCopy:{flex:1,minWidth:0,alignItems:'center'},headerTitle:{fontFamily:JLPT_EXAM.font.interface,fontSize:18,lineHeight:24,color:JLPT_EXAM.color.ink,textAlign:'center'},headerSubtitle:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:20,color:JLPT_EXAM.color.secondaryInk,textAlign:'center',marginTop:1},headerRight:{minWidth:48,alignItems:'flex-end'},headerSpacer:{width:48},
  paper:{width:'100%',maxWidth:JLPT_EXAM.contentMaxWidth,alignSelf:'center',backgroundColor:JLPT_EXAM.color.paper,paddingHorizontal:18,paddingVertical:22},
  sectionHeading:{borderBottomWidth:2,borderBottomColor:JLPT_EXAM.color.ink,paddingBottom:8,marginBottom:14,flexDirection:'row',alignItems:'baseline',gap:10},problem:{fontFamily:JLPT_EXAM.font.content,fontSize:JLPT_EXAM.type.problemTitle,lineHeight:28,color:JLPT_EXAM.color.ink},problemDetail:{flex:1,fontFamily:JLPT_EXAM.font.interface,fontSize:JLPT_EXAM.type.auxiliary,lineHeight:JLPT_EXAM.line.auxiliary,color:JLPT_EXAM.color.secondaryInk},
  instruction:{fontFamily:JLPT_EXAM.font.content,color:JLPT_EXAM.color.ink,marginBottom:18},passageBlock:{borderLeftWidth:3,borderLeftColor:JLPT_EXAM.color.divider,paddingLeft:14,marginVertical:18},passage:{fontFamily:JLPT_EXAM.font.content,color:JLPT_EXAM.color.ink},question:{fontFamily:JLPT_EXAM.font.content,color:JLPT_EXAM.color.ink,marginTop:18,marginBottom:14},
  answer:{width:'100%',minHeight:JLPT_EXAM.minimumTouch,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:12,paddingVertical:10,borderWidth:1,borderColor:JLPT_EXAM.color.divider,backgroundColor:JLPT_EXAM.color.paper,marginBottom:9},answerSelected:{borderColor:JLPT_EXAM.color.selectedBorder,backgroundColor:JLPT_EXAM.color.selectedFill},answerPressed:{opacity:.68},answerNumber:{width:30,height:30,borderRadius:15,borderWidth:1,borderColor:JLPT_EXAM.color.secondaryInk,alignItems:'center',justifyContent:'center'},answerNumberSelected:{borderColor:JLPT_EXAM.color.selectedBorder,backgroundColor:JLPT_EXAM.color.selectedFill},answerNumberText:{fontFamily:JLPT_EXAM.font.interface,fontSize:16,lineHeight:21,color:JLPT_EXAM.color.ink},answerNumberTextSelected:{color:JLPT_EXAM.color.selected},answerCopy:{flex:1,minWidth:0},answerText:{fontFamily:JLPT_EXAM.font.content,fontSize:JLPT_EXAM.type.answer,lineHeight:JLPT_EXAM.line.answer,color:JLPT_EXAM.color.ink},
  progressTrack:{height:3,width:'100%',overflow:'hidden',backgroundColor:JLPT_EXAM.color.divider},progressFill:{height:'100%',backgroundColor:JLPT_EXAM.color.selected},
  action:{minHeight:52,alignItems:'center',justifyContent:'center',paddingHorizontal:18,paddingVertical:13,backgroundColor:JLPT_EXAM.color.selected},actionSecondary:{backgroundColor:JLPT_EXAM.color.paper,borderWidth:1,borderColor:JLPT_EXAM.color.secondaryInk},actionDanger:{backgroundColor:JLPT_EXAM.color.wrong},actionText:{fontFamily:JLPT_EXAM.font.interface,fontSize:16,lineHeight:22,color:JLPT_EXAM.color.paper,textAlign:'center'},actionSecondaryText:{color:JLPT_EXAM.color.ink},disabled:{opacity:.4},
  fontControls:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8},fontControl:{minHeight:44,paddingHorizontal:12,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:JLPT_EXAM.color.divider,backgroundColor:JLPT_EXAM.color.paper},fontControlText:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,color:JLPT_EXAM.color.ink},fontScale:{minWidth:48,fontFamily:JLPT_EXAM.font.interface,fontSize:14,color:JLPT_EXAM.color.secondaryInk,textAlign:'center'},
  feedback:{marginTop:14,padding:13,borderLeftWidth:4},feedbackCorrect:{backgroundColor:JLPT_EXAM.color.correctFill,borderLeftColor:JLPT_EXAM.color.correct},feedbackWrong:{backgroundColor:JLPT_EXAM.color.wrongFill,borderLeftColor:JLPT_EXAM.color.wrong},feedbackTitle:{fontFamily:JLPT_EXAM.font.interface,fontSize:16,lineHeight:23},correct:{color:JLPT_EXAM.color.correct},wrong:{color:JLPT_EXAM.color.wrong},feedbackText:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:21,color:JLPT_EXAM.color.ink,marginTop:3},
  modalShade:{flex:1,backgroundColor:'rgba(0,0,0,.35)',justifyContent:'flex-end'},navigator:{maxHeight:'72%',backgroundColor:JLPT_EXAM.color.paper,padding:16},navigatorHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12},navigatorTitle:{fontFamily:JLPT_EXAM.font.interface,fontSize:20,color:JLPT_EXAM.color.ink},close:{minWidth:52,minHeight:44,alignItems:'center',justifyContent:'center'},closeText:{fontFamily:JLPT_EXAM.font.interface,fontSize:15,color:JLPT_EXAM.color.selected},legend:{flexDirection:'row',flexWrap:'wrap',gap:12,marginBottom:12},legendText:{fontFamily:JLPT_EXAM.font.interface,fontSize:12,color:JLPT_EXAM.color.secondaryInk},navigatorGrid:{flexDirection:'row',flexWrap:'wrap',gap:8,paddingBottom:24},navigatorCell:{width:48,height:48,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:JLPT_EXAM.color.divider,backgroundColor:JLPT_EXAM.color.paper},navigatorAnswered:{backgroundColor:JLPT_EXAM.color.selectedFill},navigatorCurrent:{backgroundColor:JLPT_EXAM.color.selected,borderColor:JLPT_EXAM.color.selected},navigatorCellText:{fontFamily:JLPT_EXAM.font.interface,fontSize:15,color:JLPT_EXAM.color.ink},navigatorCurrentText:{color:JLPT_EXAM.color.paper},
  confirmShade:{flex:1,backgroundColor:'rgba(0,0,0,.35)',alignItems:'center',justifyContent:'center',padding:20},confirmPanel:{width:'100%',maxWidth:420,backgroundColor:JLPT_EXAM.color.paper,padding:22,borderWidth:1,borderColor:JLPT_EXAM.color.divider},resumePanel:{width:'100%',maxWidth:460,backgroundColor:JLPT_EXAM.color.paper,padding:22,borderWidth:1,borderColor:JLPT_EXAM.color.divider},confirmTitle:{fontFamily:JLPT_EXAM.font.content,fontSize:20,lineHeight:29,color:JLPT_EXAM.color.ink,marginBottom:15},resumeExam:{fontFamily:JLPT_EXAM.font.content,fontSize:18,lineHeight:27,color:JLPT_EXAM.color.ink,marginBottom:10},confirmLine:{fontFamily:JLPT_EXAM.font.interface,fontSize:16,lineHeight:25,color:JLPT_EXAM.color.ink},confirmWarning:{color:JLPT_EXAM.color.wrong},confirmActions:{flexDirection:'row',gap:10,marginTop:20},confirmAction:{flex:1},resumePrimary:{marginTop:20},resumeSecondary:{marginTop:10},resumeCancel:{minHeight:48,alignItems:'center',justifyContent:'center',marginTop:4},resumeCancelText:{fontFamily:JLPT_EXAM.font.interface,fontSize:15,color:JLPT_EXAM.color.secondaryInk},
});
