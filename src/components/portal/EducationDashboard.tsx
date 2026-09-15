import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoyalPositioning } from '@/components/ui/RoyalPositioning';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';

import { EDUCATION_CLASSES, INDUSTRY_VOCABULARY, RELATED_MATERIALS, type EducationClass } from '@/data/education-portal';

function ClassCard({ item, wide }: { item: EducationClass; wide: boolean }) {
  const present = item.students.filter((student) => student.present);
  const absent = item.students.filter((student) => !student.present);
  return (
    <Pressable onPress={() => item.online ? router.push('/portal/education/classroom') : Alert.alert(item.name, 'クラス詳細と次回授業の準備を開きます。')} style={({ pressed }) => [styles.classCard, wide && styles.classCardWide, item.online ? styles.classOnline : styles.classOffline, pressed && styles.pressed]}>
      <View style={styles.classTop}>
        <View style={[styles.liveLamp, { backgroundColor: item.online ? '#39b676' : '#667078' }]} />
        <Text style={[styles.liveText, { color: item.online ? '#278a5b' : '#647078' }]}>{item.online ? 'オンライン授業中' : 'オフライン'}</Text>
        <Text style={styles.levelBadge}>{item.level}</Text>
      </View>
      <Text style={styles.className}>{item.name}</Text>
      <Text style={styles.lessonName}>{item.lesson}</Text>
      <View style={styles.materialLine}><Text style={styles.materialIcon}>本</Text><Text style={styles.materialText}>{item.material}</Text></View>
      <View style={styles.classFacts}>
        <View><Text style={styles.factLabel}>担当教師</Text><Text style={styles.factValue}>{item.teacher}</Text></View>
        <View><Text style={styles.factLabel}>授業時間</Text><Text style={styles.factValue}>{item.time}</Text></View>
      </View>
      {item.online ? <View style={styles.countdown}><Text style={styles.countdownLabel}>終了まで</Text><Text style={styles.countdownValue}>{item.remaining?.replace('残り ', '')}</Text></View> : null}
      <View style={styles.attendanceSummary}>
        <Text style={styles.attendanceText}>参加 {present.length}名</Text><Text style={styles.absentText}>欠席 {absent.length}名</Text><Text style={styles.totalText}>登録 {item.students.length}名</Text>
      </View>
      {item.online ? <View style={styles.studentChips}>
        {item.students.map((student) => <View key={student.id} style={[styles.studentChip, student.present ? styles.studentPresent : styles.studentAbsent]}><Text style={[styles.studentChipText, !student.present && styles.studentAbsentText]}>{student.name}</Text><Text style={styles.studentState}>{student.present ? '参加中' : '欠席'}</Text></View>)}
      </View> : null}
      <View style={styles.openClass}><Text style={[styles.openClassText, { color: item.online ? '#278a5b' : '#5f6b72' }]}>{item.online ? '教室に入る' : 'クラス詳細を見る'}</Text><Text style={styles.arrow}>›</Text></View>
    </Pressable>
  );
}

export function EducationDashboard() {
  const { width } = useRoyalPositioning();
  const wide = width >= 820;
  const totalStudents = new Set(EDUCATION_CLASSES.flatMap((item) => item.students.map((student) => student.id))).size;

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.topBar}><RoyalBackButton onPress={() => router.back()} /><Text style={styles.screenTitle}>日本語教育機関</Text><View style={styles.teacherBadge}><Text style={styles.teacherBadgeText}>教師</Text></View></View>
        <ScrollView contentContainerStyle={[styles.content, wide && styles.contentWide]} showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => router.push('/portal/education/new-class')} style={({ pressed }) => [styles.createClass, pressed && styles.createPressed]}>
            <View style={styles.createIcon}><Text style={styles.createPlus}>＋</Text></View><View style={styles.createCopy}><Text style={styles.createTitle}>新しいクラスを作成</Text><Text style={styles.createDescription}>レベル・授業・教材・学生を選択してオンライン教室を準備</Text><Text style={styles.clickText}>クリックして作成を始める</Text></View><Text style={styles.createArrow}>›</Text>
          </Pressable>

          <View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>クラス・学生一覧</Text><Text style={styles.sectionDescription}>授業で開いている共通教材から、現在の学習内容を自動表示</Text></View><View style={styles.listCounts}><Text style={styles.listCount}>{EDUCATION_CLASSES.length}クラス</Text><Text style={styles.listCount}>{totalStudents}名</Text></View></View>
          <View style={[styles.classGrid, wide && styles.rowWrap]}>{EDUCATION_CLASSES.map((item) => <ClassCard key={item.id} item={item} wide={wide} />)}</View>

          <View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>業務スペース</Text><Text style={styles.sectionDescription}>レベルを選択して、修了までの日程と毎日の教材を確認</Text></View></View>
          <View style={styles.levelGrid}>{['N5', 'N4', 'N3', 'N2', 'N1'].map((level, index) => {
            const enabled = level === 'N5';
            return <Pressable key={level} onPress={() => enabled ? router.push('/portal/education/n5') : Alert.alert(level, 'N5の設計承認後に作成します。')} style={({ pressed }) => [styles.levelCard, { backgroundColor: ['#e9f7ef', '#edf5fb', '#f4effb', '#fff4e9', '#fff0f1'][index], borderBottomColor: ['#3d9b69', '#4386b1', '#8063ad', '#bc783b', '#b65463'][index] }, pressed && styles.pressed]}>
              <Text style={[styles.levelName, { color: ['#2f8057', '#316f99', '#684a98', '#9c5f2d', '#93404f'][index] }]}>{level}</Text><Text style={styles.levelSub}>{enabled ? '60日カリキュラム' : 'カリキュラム'}</Text><Text style={styles.levelLink}>{enabled ? '時間割を見る' : '準備中'}　›</Text>
            </Pressable>;
          })}</View>

          <View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>関連教材</Text><Text style={styles.sectionDescription}>授業、評価、生活支援に使える共通ライブラリ</Text></View></View>
          <View style={[styles.resourceGrid, wide && styles.rowWrap]}>{RELATED_MATERIALS.map((item) => <Pressable key={item.title} onPress={() => Alert.alert(item.title, item.description)} style={({ pressed }) => [styles.resourceCard, wide && styles.resourceWide, pressed && styles.pressed]}><View style={styles.resourceIcon}><Text style={styles.resourceIconText}>{item.icon}</Text></View><View style={styles.resourceCopy}><Text style={styles.resourceTitle}>{item.title}</Text><Text style={styles.resourceDescription}>{item.description}</Text></View><Text style={styles.resourceArrow}>›</Text></Pressable>)}</View>

          <View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>専門分野の拡張語彙</Text><Text style={styles.sectionDescription}>仕事や生活で必要な専門語彙を分野別に学習・配信</Text></View></View>
          <View style={[styles.industryGrid, wide && styles.rowWrap]}>{INDUSTRY_VOCABULARY.map((item) => <Pressable key={item.title} onPress={() => Alert.alert(`${item.title}専門語彙`, item.words)} style={({ pressed }) => [styles.industryCard, wide && styles.industryWide, pressed && styles.pressed]}><View style={styles.industryIcon}><Text style={styles.industryIconText}>{item.icon}</Text></View><Text style={styles.industryTitle}>{item.title}</Text><Text style={styles.industryWords}>{item.words}</Text></Pressable>)}</View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f1f8fb' }, safe: { flex: 1 }, topBar: { minHeight: 66, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#dbe8ed', backgroundColor: '#e8e2d6' }, back: { minHeight: 48, flexDirection: 'row', alignItems: 'center' }, backArrow: { marginRight: 5, color: '#245a70', fontSize: 35 }, backText: { color: '#245a70', fontSize: 15, fontWeight: '900' }, screenTitle: { flex: 1, color: '#183f52', fontSize: 20, fontWeight: '900', textAlign: 'center' }, teacherBadge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 13, backgroundColor: '#e7f5fa' }, teacherBadgeText: { color: '#267a9f', fontSize: 13, fontWeight: '900' }, content: { padding: 18, paddingBottom: 48 }, contentWide: { width: '100%', maxWidth: 1180, alignSelf: 'center', paddingHorizontal: 28 },
  createClass: { minHeight: 142, padding: 20, flexDirection: 'row', alignItems: 'center', borderRadius: 24, borderWidth: 2, borderBottomWidth: 7, borderColor: '#52b9df', borderBottomColor: '#257eaa', backgroundColor: '#e8f8fe', shadowColor: '#216c8f', shadowOpacity: 0.16, shadowRadius: 14, shadowOffset: { width: 0, height: 8 } }, createPressed: { transform: [{ translateY: 3 }], borderBottomWidth: 4, opacity: 0.8 }, createIcon: { width: 64, height: 64, marginRight: 16, borderRadius: 19, borderBottomWidth: 5, borderBottomColor: '#247da6', alignItems: 'center', justifyContent: 'center', backgroundColor: '#49add3' }, createPlus: { color: '#fff', fontSize: 36, lineHeight: 40, fontWeight: '500' }, createCopy: { flex: 1 }, createTitle: { color: '#154c65', fontSize: 24, fontWeight: '900' }, createDescription: { marginTop: 7, color: '#3e687b', fontSize: 15, lineHeight: 23, fontWeight: '700' }, clickText: { marginTop: 9, color: '#147ca7', fontSize: 14, fontWeight: '900', textDecorationLine: 'underline' }, createArrow: { marginLeft: 8, color: '#2385ad', fontSize: 34 },
  sectionHeading: { marginTop: 32, marginBottom: 15, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }, sectionTitle: { color: '#183f52', fontSize: 23, fontWeight: '900' }, sectionDescription: { marginTop: 6, color: '#536f7c', fontSize: 14, lineHeight: 21, fontWeight: '700' }, listCounts: { flexDirection: 'row', gap: 7 }, listCount: { paddingHorizontal: 10, paddingVertical: 8, overflow: 'hidden', borderRadius: 9, color: '#326b82', backgroundColor: '#e2f1f6', fontSize: 13, fontWeight: '900' },
  classGrid: { gap: 15 }, rowWrap: { flexDirection: 'row', flexWrap: 'wrap' }, classCard: { width: '100%', minHeight: 310, padding: 20, borderRadius: 22, borderWidth: 1.5, borderBottomWidth: 6, backgroundColor: '#e8e2d6' }, classCardWide: { width: '48.8%', flexGrow: 1, maxWidth: '49.5%' }, classOnline: { borderColor: '#71c99a', borderBottomColor: '#299364', backgroundColor: '#f8fffb' }, classOffline: { borderColor: '#c2c9cd', borderBottomColor: '#68757c', backgroundColor: '#f4f5f5' }, classTop: { flexDirection: 'row', alignItems: 'center' }, liveLamp: { width: 13, height: 13, marginRight: 8, borderRadius: 7 }, liveText: { flex: 1, fontSize: 15, fontWeight: '900' }, levelBadge: { paddingHorizontal: 11, paddingVertical: 7, overflow: 'hidden', borderRadius: 10, color: '#285e75', backgroundColor: '#e3f1f6', fontSize: 14, fontWeight: '900' }, className: { marginTop: 14, color: '#193f50', fontSize: 22, lineHeight:29,fontWeight: '900' }, lessonName: { marginTop: 8, color: '#315b6d', fontSize: 17, lineHeight: 25, fontWeight: '800' }, materialLine: { marginTop: 11, flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 11, backgroundColor: 'rgba(77,156,190,0.10)' }, materialIcon: { marginRight: 9, color: '#2c7c9d', fontSize: 16, fontWeight: '900' }, materialText: { flex: 1, color: '#3e6372', fontSize: 15, lineHeight:22,fontWeight: '800' }, classFacts: { marginTop: 15, flexDirection: 'row', gap: 28 }, factLabel: { color: '#72858d', fontSize: 13, fontWeight: '700' }, factValue: { marginTop: 4, color: '#2e5261', fontSize: 15, fontWeight: '900' }, countdown: { marginTop: 15, padding: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 12, backgroundColor: '#e4f8ec' }, countdownLabel: { color: '#337a58', fontSize: 14, fontWeight: '800' }, countdownValue: { color: '#18764b', fontSize: 21, fontWeight: '900', letterSpacing: 1 }, attendanceSummary: { marginTop: 15, flexDirection: 'row', gap: 13 }, attendanceText: { color: '#238255', fontSize: 14, fontWeight: '900' }, absentText: { color: '#b34858', fontSize: 14, fontWeight: '900' }, totalText: { marginLeft: 'auto', color: '#596f79', fontSize: 14, fontWeight: '800' }, studentChips: { marginTop: 11, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, studentChip: { paddingHorizontal: 11, paddingVertical: 9, borderRadius: 11, borderWidth: 1.5 }, studentPresent: { borderColor: '#42ad73', backgroundColor: '#effcf4' }, studentAbsent: { borderColor: '#a94b59', backgroundColor: '#67363e' }, studentChipText: { color: '#286b4b', fontSize: 13, fontWeight: '900' }, studentAbsentText: { color: '#fff' }, studentState: { marginTop: 3, color: '#667b70', fontSize: 11, fontWeight: '800' }, openClass: { marginTop: 17, paddingTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(55,93,108,0.12)' }, openClassText: { fontSize: 15, fontWeight: '900' }, arrow: { color: '#5c7782', fontSize: 27 },
  levelGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 11 }, levelCard: { minWidth: 145, flex: 1, padding: 18, borderRadius: 19, borderBottomWidth: 5 }, levelName: { fontSize: 31, fontWeight: '900' }, levelSub: { marginTop: 7, color: '#526a75', fontSize: 14, fontWeight: '800' }, levelLink: { marginTop: 13, color: '#294f5e', fontSize: 14, fontWeight: '900' },
  resourceGrid: { gap: 11 }, resourceCard: { minHeight: 105, padding: 17, flexDirection: 'row', alignItems: 'center', borderRadius: 17, backgroundColor: '#e8e2d6' }, resourceWide: { width: '48.8%', flexGrow: 1, maxWidth: '49.5%' }, resourceIcon: { width: 50, height: 50, marginRight: 14, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e4f3f8' }, resourceIconText: { color: '#287899', fontSize: 19, fontWeight: '900' }, resourceCopy: { flex: 1 }, resourceTitle: { color: '#244b5c', fontSize: 18, lineHeight:24,fontWeight: '900' }, resourceDescription: { marginTop: 6, color: '#586f79', fontSize: 14, lineHeight: 21, fontWeight: '700' }, resourceArrow: { color: '#55a1bd', fontSize: 26 },
  industryGrid: { gap: 11 }, industryCard: { minHeight: 145, padding: 18, borderRadius: 17, borderBottomWidth: 4, borderBottomColor: '#8b9da5', backgroundColor: '#e8e2d6' }, industryWide: { width: '23.8%', minWidth: 220, flexGrow: 1, maxWidth: '49%' }, industryIcon: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#edf2f4' }, industryIconText: { color: '#4f6874', fontSize: 18, fontWeight: '900' }, industryTitle: { marginTop: 11, color: '#294e5e', fontSize: 18, fontWeight: '900' }, industryWords: { marginTop: 7, color: '#596f79', fontSize: 14, lineHeight: 21, fontWeight: '700' }, pressed: { opacity: 0.72, transform: [{ scale: 0.993 }] },
});
