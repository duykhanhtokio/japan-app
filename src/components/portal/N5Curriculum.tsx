import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoyalPositioning } from '@/components/ui/RoyalPositioning';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';

import { N5_SCHEDULE } from '@/data/education-portal';

const TIME_PLAN = [
  { time: '10分', label: '復習・出席確認' }, { time: '25分', label: '語彙・漢字' },
  { time: '30分', label: '文法・例文' }, { time: '20分', label: '読解または聴解' },
  { time: '25分', label: '会話・練習' }, { time: '10分', label: '確認・課題' },
];

export function N5Curriculum() {
  const [week, setWeek] = useState(1);
  const { width } = useRoyalPositioning();
  const wide = width >= 800;
  const days = N5_SCHEDULE.filter((item) => item.week === week);

  return (
    <View style={styles.screen}><SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.topBar}><RoyalBackButton onPress={() => router.back()} /><Text style={styles.topTitle}>N5 カリキュラム</Text><View style={styles.levelBadge}><Text style={styles.levelText}>N5</Text></View></View>
      <ScrollView contentContainerStyle={[styles.content, wide && styles.contentWide]} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <View style={styles.summaryTop}><View><Text style={styles.eyebrow}>4か月標準コース</Text><Text style={styles.title}>N5 修了までの学習計画</Text></View><View style={styles.totalHours}><Text style={styles.totalHoursValue}>160</Text><Text style={styles.totalHoursLabel}>総学習時間</Text></View></View>
          <Text style={styles.description}>16週間・週5日・1日2時間。文字から生活・職場の基礎日本語、N5試験対策まで段階的に学びます。</Text>
          <View style={styles.stats}><View style={styles.stat}><Text style={styles.statValue}>16週</Text><Text style={styles.statLabel}>4か月</Text></View><View style={styles.stat}><Text style={styles.statValue}>80日</Text><Text style={styles.statLabel}>授業日</Text></View><View style={styles.stat}><Text style={styles.statValue}>2時間</Text><Text style={styles.statLabel}>1日</Text></View><View style={styles.stat}><Text style={styles.statValue}>5日</Text><Text style={styles.statLabel}>週あたり</Text></View></View>
        </View>

        <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>1日の授業配分</Text><Text style={styles.sectionNote}>合計120分</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeRow}>{TIME_PLAN.map((item, index) => <View key={item.label} style={styles.timeItem}><View style={styles.timeNumber}><Text style={styles.timeNumberText}>{index + 1}</Text></View><Text style={styles.timeValue}>{item.time}</Text><Text style={styles.timeLabel}>{item.label}</Text></View>)}</ScrollView>

        <View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>週を選択</Text><Text style={styles.sectionSub}>各週5日・週末に確認クイズと個別復習</Text></View><Text style={styles.currentWeek}>第{week}週 / 16</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekRow}>{Array.from({ length: 16 }, (_, index) => index + 1).map((item) => <Pressable key={item} onPress={() => setWeek(item)} style={[styles.weekButton, week === item && styles.weekButtonActive]}><Text style={[styles.weekNumber, week === item && styles.weekNumberActive]}>{item}</Text><Text style={[styles.weekLabel, week === item && styles.weekLabelActive]}>週</Text></Pressable>)}</ScrollView>

        <View style={styles.weekTitleCard}><View style={styles.weekIcon}><Text style={styles.weekIconText}>{week}</Text></View><View><Text style={styles.weekEyebrow}>第{week}週のテーマ</Text><Text style={styles.weekTheme}>{days[0]?.title.replace('・導入', '')}</Text></View></View>
        <View style={[styles.dayGrid, wide && styles.dayGridWide]}>{days.map((day) => <View key={day.day} style={[styles.dayCard, wide && styles.dayCardWide]}>
          <View style={styles.dayTop}><View><Text style={styles.dayNumber}>DAY {day.day}</Text><Text style={styles.dayFocus}>{day.focus}</Text></View><Text style={styles.duration}>120分</Text></View>
          <Text style={styles.dayTitle}>{day.title}</Text>
          <View style={styles.learningList}>
            <View style={styles.learningRow}><Text style={[styles.learningTag, { backgroundColor: '#e8f5ee', color: '#2c7a55' }]}>語彙</Text><Text style={styles.learningText}>{day.vocabulary}</Text></View>
            <View style={styles.learningRow}><Text style={[styles.learningTag, { backgroundColor: '#eaf2fa', color: '#326e9b' }]}>文法</Text><Text style={styles.learningText}>{day.grammar}</Text></View>
            <View style={styles.learningRow}><Text style={[styles.learningTag, { backgroundColor: '#f3edfa', color: '#72529b' }]}>読解</Text><Text style={styles.learningText}>{day.reading}</Text></View>
            <View style={styles.learningRow}><Text style={[styles.learningTag, { backgroundColor: '#fff1e4', color: '#a3622d' }]}>聴解</Text><Text style={styles.learningText}>{day.listening}</Text></View>
            <View style={styles.learningRow}><Text style={[styles.learningTag, { backgroundColor: '#fff0f2', color: '#a84658' }]}>課題</Text><Text style={styles.learningText}>{day.exercise}</Text></View>
          </View>
          <View style={styles.materials}><Text style={styles.materialsTitle}>この日の教材</Text><View style={styles.materialButtons}>{day.materials.map((material) => <Pressable key={material} onPress={() => Alert.alert(material, `DAY ${day.day} の教材を開きます。`)} style={styles.materialButton}><Text style={styles.materialButtonText}>本 {material}</Text></Pressable>)}</View></View>
        </View>)}</View>

        <View style={styles.completion}><Text style={styles.completionTitle}>N5修了判定</Text><Text style={styles.completionText}>出席率80%以上・週末確認クイズ・語彙文法到達度・読解聴解評価・N5模擬試験の結果を総合して判定します。</Text><Pressable onPress={() => Alert.alert('N5評価基準', '評価項目・合格基準・再学習ルールを表示します。')} style={styles.completionButton}><Text style={styles.completionButtonText}>評価基準を見る　›</Text></Pressable></View>
      </ScrollView>
    </SafeAreaView></View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4f8f5' }, safe: { flex: 1 }, topBar: { minHeight: 66, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#dae6dd', backgroundColor: '#e8e2d6' }, back: { minHeight: 48, flexDirection: 'row', alignItems: 'center' }, backArrow: { marginRight: 5, color: '#316f50', fontSize: 35 }, backText: { color: '#316f50', fontSize: 15, fontWeight: '900' }, topTitle: { flex: 1, color: '#244b36', fontSize: 20, fontWeight: '900', textAlign: 'center' }, levelBadge: { width: 44, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#def2e6' }, levelText: { color: '#2e8258', fontSize: 15, fontWeight: '900' }, content: { padding: 18, paddingBottom: 48 }, contentWide: { width: '100%', maxWidth: 1120, alignSelf: 'center', paddingHorizontal: 28 },
  summary: { padding: 21, borderRadius: 22, borderLeftWidth: 6, borderLeftColor: '#3fa36c', borderBottomWidth: 6, borderBottomColor: '#277a4e', backgroundColor: '#e8e2d6' }, summaryTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 }, eyebrow: { color: '#328058', fontSize: 14, fontWeight: '900' }, title: { marginTop: 6, color: '#234a35', fontSize: 27, lineHeight:35,fontWeight: '900' }, totalHours: { minWidth: 94, padding: 12, borderRadius: 15, alignItems: 'center', backgroundColor: '#e5f5eb' }, totalHoursValue: { color: '#2b8256', fontSize: 26, fontWeight: '900' }, totalHoursLabel: { marginTop: 3, color: '#4c745f', fontSize: 12, fontWeight: '800' }, description: { marginTop: 14, color: '#4f6a59', fontSize: 15, lineHeight: 23, fontWeight: '700' }, stats: { marginTop: 18, flexDirection: 'row', flexWrap:'wrap',gap: 9 }, stat: { minWidth: 105, flex: 1, padding: 12, borderRadius: 12, alignItems: 'center', backgroundColor: '#f1f7f3' }, statValue: { color: '#315d44', fontSize: 18, fontWeight: '900' }, statLabel: { marginTop: 4, color: '#60776a', fontSize: 12, fontWeight: '800' },
  sectionHeading: { marginTop: 27, marginBottom: 11, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }, sectionTitle: { color: '#294d38', fontSize: 19, fontWeight: '900' }, sectionSub: { marginTop: 4, color: '#71857a', fontSize: 10, fontWeight: '700' }, sectionNote: { color: '#568069', fontSize: 10, fontWeight: '900' }, timeRow: { gap: 9, paddingRight: 16 }, timeItem: { width: 135, minHeight: 102, padding: 12, borderRadius: 15, backgroundColor: '#e8e2d6' }, timeNumber: { width: 25, height: 25, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#dff2e6' }, timeNumberText: { color: '#2d8156', fontSize: 10, fontWeight: '900' }, timeValue: { position: 'absolute', right: 11, top: 14, color: '#2d8156', fontSize: 12, fontWeight: '900' }, timeLabel: { marginTop: 13, color: '#3f5d49', fontSize: 11, lineHeight: 16, fontWeight: '800' }, currentWeek: { color: '#2d8156', fontSize: 11, fontWeight: '900' }, weekRow: { gap: 7, paddingRight: 16 }, weekButton: { width: 49, height: 53, borderRadius: 12, borderWidth: 1, borderColor: '#cad9cf', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e8e2d6' }, weekButtonActive: { borderColor: '#348e5e', borderBottomWidth: 4, backgroundColor: '#daf1e3' }, weekNumber: { color: '#60766a', fontSize: 15, fontWeight: '900' }, weekNumberActive: { color: '#26784d' }, weekLabel: { color: '#8a9a91', fontSize: 8, fontWeight: '800' }, weekLabelActive: { color: '#4c7860' },
  weekTitleCard: { marginTop: 17, padding: 17, flexDirection: 'row', alignItems: 'center', borderRadius: 17, backgroundColor: '#deefe4' }, weekIcon: { width: 50, height: 50, marginRight: 13, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#3a9562' }, weekIconText: { color: '#fff', fontSize: 20, fontWeight: '900' }, weekEyebrow: { color: '#526f5d', fontSize: 13, fontWeight: '800' }, weekTheme: { marginTop: 4, color: '#28523a', fontSize: 20, fontWeight: '900' }, dayGrid: { marginTop: 13, gap: 13 }, dayGridWide: { flexDirection: 'row', flexWrap: 'wrap' }, dayCard: { padding: 19, borderRadius: 19, borderWidth: 1, borderBottomWidth: 5, borderColor: '#d5e1d8', borderBottomColor: '#6b9c7c', backgroundColor: '#e8e2d6' }, dayCardWide: { width: '48.8%', flexGrow: 1, maxWidth: '49.5%' }, dayTop: { flexDirection: 'row', justifyContent: 'space-between' }, dayNumber: { color: '#328158', fontSize: 15, fontWeight: '900', letterSpacing: 1 }, dayFocus: { marginTop: 4, color: '#667d6f', fontSize: 13, fontWeight: '800' }, duration: { paddingHorizontal: 10, paddingVertical: 7, overflow: 'hidden', borderRadius: 9, color: '#347a54', backgroundColor: '#e7f4eb', fontSize: 13, fontWeight: '900' }, dayTitle: { marginTop: 12, color: '#294837', fontSize: 20, lineHeight:27,fontWeight: '900' }, learningList: { marginTop: 14, gap: 9 }, learningRow: { flexDirection: 'row', alignItems: 'flex-start' }, learningTag: { width: 52, marginRight: 10, paddingVertical: 7, overflow: 'hidden', borderRadius: 8, fontSize: 13, fontWeight: '900', textAlign: 'center' }, learningText: { flex: 1, paddingTop: 4, color: '#465f50', fontSize: 14, lineHeight: 21, fontWeight: '700' }, materials: { marginTop: 15, paddingTop: 13, borderTopWidth: 1, borderTopColor: '#e1e9e3' }, materialsTitle: { color: '#405f4b', fontSize: 14, fontWeight: '900' }, materialButtons: { marginTop: 9, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, materialButton: { paddingHorizontal: 11, paddingVertical: 9, borderRadius: 9, backgroundColor: '#eef5f0' }, materialButtonText: { color: '#3f684f', fontSize: 13, fontWeight: '800' },
  completion: { marginTop: 18, padding: 17, borderRadius: 18, borderWidth: 1, borderColor: '#d8c899', backgroundColor: '#fffaf0' }, completionTitle: { color: '#7e5e23', fontSize: 16, fontWeight: '900' }, completionText: { marginTop: 7, color: '#776d57', fontSize: 11, lineHeight: 17, fontWeight: '700' }, completionButton: { marginTop: 12, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 10, backgroundColor: '#f2e3bb' }, completionButtonText: { color: '#7f5b1e', fontSize: 10, fontWeight: '900' },
});
