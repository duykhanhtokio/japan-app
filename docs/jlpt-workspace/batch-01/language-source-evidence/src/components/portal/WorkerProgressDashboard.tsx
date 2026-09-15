import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';

const PEOPLE = [
  { name: 'グエン・ヴァン・アン', company: '東和製作株式会社', level: 'N3相当', days: 1, score: 82, status: '継続中', color: '#3e9b72' },
  { name: 'チャン・ティ・リン', company: '東和製作株式会社', level: 'N4相当', days: 16, score: 61, status: '学習停止', color: '#c45b68' },
  { name: 'レ・ミン・フン', company: '北関東食品株式会社', level: 'N2相当', days: 3, score: 91, status: '順調', color: '#3e86a8' },
];

export function WorkerProgressDashboard() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('すべて');
  const filtered = useMemo(() => PEOPLE.filter((person) => {
    const matchesQuery = `${person.name}${person.company}`.includes(query.trim());
    const matchesFilter = filter === 'すべて' || (filter === '学習停止' ? person.status === '学習停止' : person.status !== '学習停止');
    return matchesQuery && matchesFilter;
  }), [filter, query]);

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.topBar}>
          <RoyalBackButton onPress={() => router.back()} />
          <View style={styles.sharedBadge}><Text style={styles.sharedBadgeText}>企業・監理団体 共通データ</Text></View>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}><Text style={styles.eyebrow}>共同管理ワークスペース</Text><Text style={styles.title}>学習進捗・能力評価</Text><Text style={styles.summary}>受け入れ企業と監理団体が同じ記録、同じ評価項目、同じ対応履歴を確認します。</Text></View>

          <View style={styles.metrics}>
            <View style={styles.metric}><Text style={styles.metricLabel}>管理対象</Text><Text style={styles.metricValue}>128名</Text></View>
            <View style={styles.metric}><Text style={styles.metricLabel}>継続学習</Text><Text style={[styles.metricValue, { color: '#328260' }]}>87%</Text></View>
            <View style={styles.metric}><Text style={styles.metricLabel}>14日以上停止</Text><Text style={[styles.metricValue, { color: '#ba5064' }]}>12名</Text></View>
          </View>

          <View style={styles.searchPanel}>
            <View style={styles.searchShell}><Text style={styles.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder="氏名または会社名で検索" placeholderTextColor="#8899a1" style={styles.searchInput} /></View>
            <View style={styles.filters}>{['すべて', '学習継続', '学習停止'].map((item) => <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}><Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text></Pressable>)}</View>
          </View>

          <View style={styles.sectionRow}><Text style={styles.sectionTitle}>人材別の学習・評価</Text><Pressable onPress={() => Alert.alert('評価項目', '企業と監理団体で共通の評価項目を設定します。')}><Text style={styles.settings}>評価項目を設定</Text></Pressable></View>
          <View style={styles.peopleList}>
            {filtered.map((person) => (
              <Pressable key={person.name} onPress={() => Alert.alert(person.name, '個人ページでは学習履歴、企業評価、監理団体評価、面談、通知、対応結果を同じ時系列で表示します。')} style={({ pressed }) => [styles.personCard, pressed && styles.pressed]}>
                <View style={[styles.avatar, { backgroundColor: `${person.color}20` }]}><Text style={[styles.avatarText, { color: person.color }]}>{person.name.slice(0, 1)}</Text></View>
                <View style={styles.personMain}><View style={styles.personTitleRow}><Text style={styles.personName}>{person.name}</Text><Text style={[styles.status, { color: person.color, backgroundColor: `${person.color}16` }]}>{person.status}</Text></View><Text style={styles.company}>{person.company}</Text>
                  <View style={styles.details}><Text style={styles.detail}>現在 {person.level}</Text><Text style={styles.detail}>平均 {person.score}点</Text><Text style={styles.detail}>最終学習 {person.days}日前</Text></View>
                  <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${person.score}%`, backgroundColor: person.color }]} /></View>
                </View><Text style={styles.chevron}>›</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.note}><Text style={styles.noteTitle}>評価を一致させる仕組み</Text><Text style={styles.noteText}>学習データは自動集計し、企業評価と監理団体評価は別々に記録します。差がある項目だけを表示して、面談と合意内容を同じ履歴へ保存します。</Text></View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f5ee' }, safe: { flex: 1 }, topBar: { height: 58, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#e5e0d4', backgroundColor: '#e8e2d6' }, back: { minHeight: 44, flexDirection: 'row', alignItems: 'center' }, backArrow: { marginRight: 5, color: '#5b4b2c', fontSize: 34 }, backText: { color: '#5b4b2c', fontSize: 11, fontWeight: '900' }, sharedBadge: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 12, backgroundColor: '#f4e9ce' }, sharedBadgeText: { color: '#836224', fontSize: 8, fontWeight: '900' },
  content: { width: '100%', maxWidth: 1080, alignSelf: 'center', padding: 15, paddingBottom: 36 }, hero: { padding: 18, borderRadius: 20, borderLeftWidth: 5, borderLeftColor: '#c88a45', borderBottomWidth: 5, borderBottomColor: '#956328', backgroundColor: '#e8e2d6' }, eyebrow: { color: '#986628', fontSize: 9, fontWeight: '900' }, title: { marginTop: 7, color: '#3f3422', fontSize: 24, fontWeight: '900' }, summary: { marginTop: 8, color: '#706552', fontSize: 10, lineHeight: 16, fontWeight: '700' },
  metrics: { marginTop: 12, flexDirection: 'row', gap: 8 }, metric: { minWidth: 0, flex: 1, padding: 12, borderRadius: 14, backgroundColor: '#e8e2d6' }, metricLabel: { color: '#7b7467', fontSize: 8, fontWeight: '800' }, metricValue: { marginTop: 5, color: '#55472f', fontSize: 19, fontWeight: '900' },
  searchPanel: { marginTop: 15, padding: 12, borderRadius: 16, backgroundColor: '#e8e2d6' }, searchShell: { height: 43, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderRadius: 11, borderWidth: 1, borderColor: '#d6c8ae', backgroundColor: '#fcfbf7' }, searchIcon: { marginRight: 8, color: '#a07135', fontSize: 18 }, searchInput: { minWidth: 0, flex: 1, color: '#4d4435', fontSize: 10, fontWeight: '700' }, filters: { marginTop: 9, flexDirection: 'row', gap: 7 }, filter: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 9, backgroundColor: '#f0eee8' }, filterActive: { backgroundColor: '#f1dfbb' }, filterText: { color: '#776f61', fontSize: 8, fontWeight: '800' }, filterTextActive: { color: '#8a5d23' },
  sectionRow: { marginTop: 22, marginBottom: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, sectionTitle: { color: '#443a2a', fontSize: 14, fontWeight: '900' }, settings: { color: '#96672e', fontSize: 8, fontWeight: '900' }, peopleList: { gap: 9 }, personCard: { minHeight: 105, padding: 13, flexDirection: 'row', alignItems: 'center', borderRadius: 16, backgroundColor: '#e8e2d6' }, avatar: { width: 44, height: 44, marginRight: 11, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, avatarText: { fontSize: 17, fontWeight: '900' }, personMain: { minWidth: 0, flex: 1 }, personTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 }, personName: { flexShrink: 1, color: '#41382a', fontSize: 11, fontWeight: '900' }, status: { paddingHorizontal: 7, paddingVertical: 3, overflow: 'hidden', borderRadius: 7, fontSize: 7, fontWeight: '900' }, company: { marginTop: 3, color: '#82796c', fontSize: 8, fontWeight: '700' }, details: { marginTop: 7, flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, detail: { color: '#655d51', fontSize: 7, fontWeight: '800' }, progressTrack: { height: 5, marginTop: 7, overflow: 'hidden', borderRadius: 3, backgroundColor: '#ece9e2' }, progressFill: { height: '100%', borderRadius: 3 }, chevron: { marginLeft: 8, color: '#b28449', fontSize: 25 },
  note: { marginTop: 16, padding: 14, borderRadius: 15, borderWidth: 1, borderColor: '#dccba9', backgroundColor: '#fffaf0' }, noteTitle: { color: '#775421', fontSize: 10, fontWeight: '900' }, noteText: { marginTop: 5, color: '#736958', fontSize: 8, lineHeight: 13, fontWeight: '700' }, pressed: { opacity: 0.7, transform: [{ scale: 0.994 }] },
});
