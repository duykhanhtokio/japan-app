import { Text } from '@/components/app/LocalizedText';
import {
    generatedGrammar,
    generatedVocabulary,
    hiraganaCombinationRows,
    hiraganaRows,
    hiraganaVoicedRows,
    katakanaCombinationRows,
    katakanaRows,
    katakanaVoicedRows,
} from '@/data/jlpt-learning';
import curriculum from '@/game/data/n5/n5-curriculum-data';
import { getJlptProgress } from '@/services/jlpt-progress-storage';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

type Props = {
    onOpenVocabulary: () => void;
    onOpenGrammar: () => void;
};

export default function N5CurriculumOverview({ onOpenVocabulary, onOpenGrammar }: Props) {
    const [learnedIds, setLearnedIds] = useState<string[]>([]);
    const [currentWeek, setCurrentWeek] = useState(1);
    const [currentDay, setCurrentDay] = useState(1);
    useEffect(() => {
        void getJlptProgress().then((progress) => {
            setLearnedIds(progress.learnedIds);
            setCurrentWeek(progress.n5JourneyPosition?.week ?? 1);
            setCurrentDay(progress.n5JourneyPosition?.day ?? 1);
        });
    }, []);
    const metrics = useMemo(() => {
        const learned = new Set(learnedIds);
        const vocabularyIds = generatedVocabulary.filter((item) => item.jlpt === 'N5' && item.status !== 'Rejected').map((item) => item.id);
        const grammarIds = generatedGrammar.filter((item) => item.jlpt === 'N5' && item.status !== 'Rejected').map((item) => item.id);
        const kanaTotal = [hiraganaRows, hiraganaVoicedRows, hiraganaCombinationRows, katakanaRows, katakanaVoicedRows, katakanaCombinationRows].flat(2).length;
        const kanaLearned = learnedIds.filter((id) => id.startsWith('kana:')).length;
        const vocabularyLearned = vocabularyIds.filter((id) => learned.has(id)).length;
        const grammarLearned = grammarIds.filter((id) => learned.has(id)).length;
        const total = kanaTotal + vocabularyIds.length + grammarIds.length;
        const completed = kanaLearned + vocabularyLearned + grammarLearned;
        return { kanaTotal, kanaLearned, vocabularyTotal: vocabularyIds.length, vocabularyLearned, grammarTotal: grammarIds.length, grammarLearned, percent: total ? Math.round(completed / total * 100) : 0 };
    }, [learnedIds]);
    const currentStudyDay = curriculum.days.find((day) => day.day === currentDay) ?? curriculum.days[0];

    return <View style={styles.root}>
        <View style={styles.headingRow}>
            <View style={styles.headingCopy}><Text style={styles.kicker}>N5 STUDY ROADMAP</Text><Text style={styles.title}>16週間の学習ロードマップ</Text><Text style={styles.subtitle}>週6回・1日120分 · 文字から模擬試験まで</Text></View>
            <View style={styles.stats}><Text style={styles.statsValue}>{metrics.percent}%</Text><Text style={styles.statsLabel}>総合進捗</Text></View>
        </View>

        <View style={styles.currentCard}>
            <View style={styles.currentTop}><View><Text style={styles.currentLabel}>現在地 · 第{currentWeek}週 / {currentDay}日目</Text><Text numberOfLines={2} style={styles.currentTitle}>{currentStudyDay.title}</Text></View><Text style={styles.currentMinutes}>{currentStudyDay.estimatedMinutes}分</Text></View>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${metrics.percent}%` as `${number}%` }]}/></View>
            <View style={styles.metricRow}>
                <View style={styles.metric}><Text style={styles.metricValue}>{metrics.kanaLearned}/{metrics.kanaTotal}</Text><Text style={styles.metricLabel}>文字</Text></View>
                <View style={styles.metric}><Text style={styles.metricValue}>{metrics.vocabularyLearned}/{metrics.vocabularyTotal}</Text><Text style={styles.metricLabel}>語彙</Text></View>
                <View style={styles.metric}><Text style={styles.metricValue}>{metrics.grammarLearned}/{metrics.grammarTotal}</Text><Text style={styles.metricLabel}>文法</Text></View>
                <View style={styles.metric}><Text style={styles.metricValue}>{currentWeek}/{curriculum.stats.weeks}</Text><Text style={styles.metricLabel}>週</Text></View>
            </View>
        </View>

        <View style={styles.milestones}>
            <View style={[styles.milestone, styles.kana]}><Text style={styles.milestoneWeek}>WEEK 1</Text><Text style={styles.milestoneTitle}>かな完成</Text><Text style={styles.milestoneCopy}>ひらがな3回・カタカナ3回・総合テスト</Text></View>
            <View style={[styles.milestone, styles.minna]}><Text style={styles.milestoneWeek}>WEEK 2–11</Text><Text style={styles.milestoneTitle}>みんなの日本語 1–25課</Text><Text style={styles.milestoneCopy}>語彙・文法・会話・聴解・練習</Text></View>
            <View style={[styles.milestone, styles.exam]}><Text style={styles.milestoneWeek}>WEEK 12–16</Text><Text style={styles.milestoneTitle}>復習・模擬試験</Text><Text style={styles.milestoneCopy}>弱点補強・読解・聴解・本番対策</Text></View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekRow}>
            {curriculum.weeks.map((week) => <View key={week.week} style={[styles.weekCard, week.week === currentWeek && styles.weekCardCurrent]}>
                <View style={styles.weekTop}><Text style={styles.weekNumber}>第{week.week}週</Text><Text style={styles.dayCount}>{week.days.length}日</Text></View>
                <Text numberOfLines={2} style={styles.weekTitle}>{week.title}</Text>
                <Text numberOfLines={3} style={styles.weekGoal}>{week.goal}</Text>
                <View style={styles.weekTrack}><View style={[styles.weekFill, { width: week.week < currentWeek ? '100%' as const : week.week === currentWeek ? '45%' as const : '0%' as const }]}/></View>
            </View>)}
        </ScrollView>

        <View style={styles.quickRow}>
            <Pressable onPress={onOpenVocabulary} style={({ pressed }) => [styles.quickButton, styles.vocabularyButton, pressed && styles.pressed]}><Text style={styles.quickIcon}>🗂️</Text><View><Text style={styles.quickTitle}>今日の語彙へ</Text><Text style={styles.quickCopy}>学習日と未習得語を確認</Text></View></Pressable>
            <Pressable onPress={onOpenGrammar} style={({ pressed }) => [styles.quickButton, styles.grammarButton, pressed && styles.pressed]}><Text style={styles.quickIcon}>📖</Text><View><Text style={styles.quickTitle}>今日の文法へ</Text><Text style={styles.quickCopy}>例文と練習を開始</Text></View></Pressable>
        </View>
    </View>;
}

const styles = StyleSheet.create({
    root: { marginTop: 16, padding: 16, borderRadius: 22, backgroundColor: 'rgba(232,226,214,.86)', borderWidth: 1, borderColor: 'rgba(232,226,214,.92)' }, headingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 }, headingCopy: { flex: 1 }, kicker: { color: '#4267b2', fontSize: 10, fontWeight: '900', letterSpacing: 1 }, title: { color: '#1e3049', fontSize: 21, fontWeight: '900', marginTop: 3 }, subtitle: { color: '#64748b', fontSize: 11, marginTop: 3 }, stats: { minWidth: 68, borderRadius: 16, backgroundColor: '#2e59ad', alignItems: 'center', padding: 10 }, statsValue: { color: '#fff', fontSize: 20, fontWeight: '900' }, statsLabel: { color: '#dce8ff', fontSize: 9 },
    currentCard: { marginTop: 14, padding: 13, borderRadius: 18, backgroundColor: '#203f79' }, currentTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 }, currentLabel: { color: '#aecdff', fontSize: 9, fontWeight: '900' }, currentTitle: { color: '#fff', fontSize: 15, fontWeight: '900', marginTop: 3 }, currentMinutes: { color: '#fff3a3', fontWeight: '900' }, progressTrack: { height: 7, borderRadius: 4, backgroundColor: 'rgba(232,226,214,.2)', overflow: 'hidden', marginTop: 11 }, progressFill: { height: '100%', borderRadius: 4, backgroundColor: '#57e4b6' }, metricRow: { flexDirection: 'row', marginTop: 11 }, metric: { flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: 'rgba(232,226,214,.15)' }, metricValue: { color: '#fff', fontWeight: '900', fontSize: 12 }, metricLabel: { color: '#bdd2f0', fontSize: 8, marginTop: 2 },
    milestones: { flexDirection: 'row', gap: 8, marginTop: 14 }, milestone: { flex: 1, minHeight: 104, padding: 11, borderRadius: 16, borderWidth: 1 }, kana: { backgroundColor: '#fff4dd', borderColor: '#eed39a' }, minna: { backgroundColor: '#eaf2ff', borderColor: '#bcd0f2' }, exam: { backgroundColor: '#eaf8f3', borderColor: '#b7ddcf' }, milestoneWeek: { color: '#526276', fontSize: 8, fontWeight: '900' }, milestoneTitle: { color: '#23364e', fontSize: 13, fontWeight: '900', marginTop: 5 }, milestoneCopy: { color: '#647386', fontSize: 9, lineHeight: 13, marginTop: 4 },
    weekRow: { gap: 9, paddingTop: 14, paddingBottom: 4 }, weekCard: { width: 172, minHeight: 124, borderRadius: 16, backgroundColor: 'rgba(246,249,253,.96)', borderWidth: 1, borderColor: '#dce5ef', padding: 12 }, weekCardCurrent: { borderWidth: 2, borderColor: '#4267b2', backgroundColor: '#edf4ff' }, weekTop: { flexDirection: 'row', justifyContent: 'space-between' }, weekNumber: { color: '#4267b2', fontSize: 10, fontWeight: '900' }, dayCount: { color: '#8190a3', fontSize: 9, fontWeight: '800' }, weekTitle: { color: '#26384f', fontSize: 13, fontWeight: '900', lineHeight: 18, marginTop: 7 }, weekGoal: { color: '#6a788a', fontSize: 9, lineHeight: 13, marginTop: 4 }, weekTrack: { height: 4, borderRadius: 2, backgroundColor: '#dfe6ef', overflow: 'hidden', marginTop: 'auto' }, weekFill: { height: '100%', backgroundColor: '#32a678' },
    quickRow: { flexDirection: 'row', gap: 9, marginTop: 12 }, quickButton: { flex: 1, minHeight: 60, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 9, padding: 11, borderWidth: 1 }, vocabularyButton: { backgroundColor: '#edf4ff', borderColor: '#bfd2f2' }, grammarButton: { backgroundColor: '#f3edff', borderColor: '#d8c6f2' }, quickIcon: { fontSize: 22 }, quickTitle: { color: '#283a52', fontWeight: '900', fontSize: 12 }, quickCopy: { color: '#728095', fontSize: 8, marginTop: 2 }, pressed: { opacity: .65 },
});
