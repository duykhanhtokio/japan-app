import { Text } from '@/components/app/LocalizedText';
import type { AppLanguageCode } from '@/i18n/languages';
import curriculum from '@/game/data/n5/n5-curriculum-data';
import type { N5ActivityKind, N5StudyDay } from '@/game/data/n5/n5-curriculum-types';
import { useMemo, useRef, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { useRoyalPositioning } from '@/components/ui/RoyalPositioning';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';

type DetailTab = 'overview' | 'vocabulary' | 'grammar' | 'practice';

type Props = {
    language: AppLanguageCode;
    onBack: () => void;
    onOpenCharacters: () => void;
    onOpenGrammar: () => void;
    onOpenTest: () => void;
};

const COPY = {
    vi: {
        route: 'Lộ trình N5', subtitle: '16 tuần · 25 bài Minna I · 2 giờ mỗi buổi',
        day: 'Ngày', week: 'Tuần', minutes: 'phút', vocabulary: 'Từ vựng', grammar: 'Ngữ pháp',
        mockTest: 'JLPT mô phỏng', overview: 'Nội dung', activities: 'Tiến trình trong buổi',
        focus: 'Trọng tâm', noNewWords: 'Ngày kiểm tra không thêm từ mới.',
        noNewGrammar: 'Ngày ôn hoặc kiểm tra dùng lại toàn bộ mẫu đã học.',
        start: 'Bắt đầu buổi học', checkpoint: 'Checkpoint', lesson: 'Buổi học',
        progress: 'Toàn lộ trình', reward: 'Phần thưởng', words: 'mục từ', patterns: 'mẫu',
        practice: 'Luyện tập', kaiwa: 'Kaiwa', listening: 'Luyện nghe', lessonSource: 'Bài Minna',
    },
    ja: {
        route: 'N5 学習プラン', subtitle: '16週間 · みんなの日本語I 25課 · 1回120分',
        day: '日目', week: '第', minutes: '分', vocabulary: '単語', grammar: '文法',
        mockTest: 'JLPT模擬試験', overview: '学習内容', activities: '今日の流れ', focus: '重点',
        noNewWords: 'テスト日は新しい単語を追加しません。',
        noNewGrammar: '復習・テスト日は学習済みの文型を使います。',
        start: '学習を始める', checkpoint: 'チェックポイント', lesson: 'レッスン',
        progress: '全コース', reward: '報酬', words: '語', patterns: '文型',
        practice: '練習', kaiwa: '会話', listening: '聴解', lessonSource: 'みんなの日本語',
    },
    en: {
        route: 'N5 Study Plan', subtitle: '16 weeks · 25 Minna I lessons · 120 minutes/session',
        day: 'Day', week: 'Week', minutes: 'min', vocabulary: 'Vocabulary', grammar: 'Grammar',
        mockTest: 'JLPT Mock Test', overview: 'Overview', activities: 'Lesson flow', focus: 'Focus',
        noNewWords: 'Checkpoint days add no new vocabulary.',
        noNewGrammar: 'Review and checkpoint days reuse learned patterns.',
        start: 'Start lesson', checkpoint: 'Checkpoint', lesson: 'Lesson',
        progress: 'Full course', reward: 'Reward', words: 'items', patterns: 'patterns',
        practice: 'Practice', kaiwa: 'Kaiwa', listening: 'Listening', lessonSource: 'Minna lesson',
    },
} as const;

const ACTIVITY_ICON: Record<N5ActivityKind, string> = {
    kana: 'あ', vocabulary: '語', grammar: '文', listening: '🎧', writing: '✍️',
    quiz: '？', dog_game: '🐕', review: '↻', checkpoint: '✓', break: '☕',
    reading: '読', speaking: '話',
};

function copyFor(language: AppLanguageCode) {
    if (language === 'vi') return COPY.vi;
    if (language === 'en') return COPY.en;
    return COPY.ja;
}

function localizedReviewText(language: AppLanguageCode, vi: string | undefined, fallback: string) {
    return language === 'vi' && vi ? vi : fallback;
}

export default function N5StudyPlan({
    language,
    onBack,
    onOpenCharacters,
    onOpenGrammar,
    onOpenTest,
}: Props) {
    const copy = copyFor(language);
    const { width } = useRoyalPositioning();
    const compact = width < 560;
    const [week, setWeek] = useState(1);
    const [selectedDay, setSelectedDay] = useState(1);
    const [detailTab, setDetailTab] = useState<DetailTab>('overview');
    const bodyRef = useRef<ScrollView>(null);
    const selected = curriculum.days.find((day) => day.day === selectedDay) ?? curriculum.days[0]!;
    const weekData = curriculum.weeks.find((item) => item.week === week) ?? curriculum.weeks[0]!;
    const totals = useMemo(() => ({
        words: curriculum.stats.uniqueVocabularyEntries,
        grammar: curriculum.stats.grammarPoints,
    }), []);

    function selectWeek(nextWeek: number) {
        const next = curriculum.weeks.find((item) => item.week === nextWeek);
        if (!next) return;
        setWeek(nextWeek);
        setSelectedDay(next.days[0]?.day ?? 1);
        setDetailTab('overview');
        bodyRef.current?.scrollTo({ y: 0, animated: true });
    }

    function startDay(day: N5StudyDay) {
        if (day.phase === 'kana') onOpenCharacters();
        else onOpenGrammar();
    }

    function openTab(tab: DetailTab) {
        setDetailTab(tab);
        bodyRef.current?.scrollTo({ y: 300, animated: true });
    }

    return <View style={styles.root}>
        <View style={styles.hero}>
            <View style={styles.heroTop}>
                <RoyalBackButton onPress={onBack} />
                <View style={styles.heroCopy}>
                    <Text style={styles.eyebrow}>JLPT N5</Text>
                    <Text style={styles.heroTitle}>{copy.route}</Text>
                    <Text style={styles.heroSubtitle}>{copy.subtitle}</Text>
                </View>
            </View>
            <View style={styles.metrics}>
                <View style={styles.metric}><Text style={styles.metricLabel}>{copy.progress}</Text><Text style={styles.metricValue}>{curriculum.stats.weeks}W · {curriculum.stats.sessions}S</Text></View>
                <View style={styles.metric}><Text style={styles.metricLabel}>{copy.vocabulary}</Text><Text style={styles.metricValue}>{totals.words}</Text></View>
                <View style={styles.metric}><Text style={styles.metricLabel}>{copy.grammar}</Text><Text style={styles.metricValue}>{totals.grammar}</Text></View>
            </View>
        </View>

        <View style={styles.quickActions}>
            <Pressable style={[styles.quickButton, detailTab === 'vocabulary' && styles.quickButtonActive]} onPress={() => openTab('vocabulary')}>
                <Text style={[styles.quickText, detailTab === 'vocabulary' && styles.quickTextActive]}>単語</Text>
            </Pressable>
            <Pressable style={[styles.quickButton, detailTab === 'grammar' && styles.quickButtonActive]} onPress={() => openTab('grammar')}>
                <Text style={[styles.quickText, detailTab === 'grammar' && styles.quickTextActive]}>文法</Text>
            </Pressable>
            <Pressable style={[styles.quickButton, detailTab === 'practice' && styles.quickButtonActive]} onPress={() => openTab('practice')}>
                <Text style={[styles.quickText, detailTab === 'practice' && styles.quickTextActive]}>練習</Text>
            </Pressable>
            <Pressable style={styles.quickButton} onPress={onOpenTest}>
                <Text style={styles.quickText}>JLPT模擬試験</Text>
            </Pressable>
        </View>

        <ScrollView ref={bodyRef} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekTabs}>
                {curriculum.weeks.map((item) => <Pressable key={item.week} onPress={() => selectWeek(item.week)} style={[styles.weekCard, item.week === week && styles.weekCardActive]}>
                    <Text style={[styles.weekNumber, item.week === week && styles.onDark]}>{copy.week} {item.week}</Text>
                    <Text style={[styles.weekTitle, item.week === week && styles.onDark]}>{item.title}</Text>
                    {!compact && <Text numberOfLines={2} style={[styles.weekGoal, item.week === week && styles.onDarkMuted]}>{item.goal}</Text>}
                </Pressable>)}
            </ScrollView>

            <Text style={styles.sectionTitle}>{weekData.title}</Text>
            <Text style={styles.sectionSubtitle}>{weekData.goal}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayStrip}>
                {weekData.days.map((day) => <Pressable key={day.day} onPress={() => { setSelectedDay(day.day); setDetailTab('overview'); }} style={[styles.dayCard, day.day === selectedDay && styles.dayCardActive]}>
                    <View style={styles.dayTop}><Text style={[styles.dayIndex, day.day === selectedDay && styles.onBlue]}>{copy.day} {day.day}</Text><Text style={[styles.dayMinutes, day.day === selectedDay && styles.onBlue]}>{day.estimatedMinutes} {copy.minutes}</Text></View>
                    <Text numberOfLines={3} style={[styles.dayTitle, day.day === selectedDay && styles.onBlue]}>{day.title}</Text>
                    {day.isCheckpoint && <Text style={[styles.checkpoint, day.day === selectedDay && styles.onBlue]}>★ {copy.checkpoint}</Text>}
                </Pressable>)}
            </ScrollView>

            <View style={styles.lessonCard}>
                <View style={styles.lessonHeader}>
                    <View style={styles.lessonHeaderCopy}>
                        <Text style={styles.lessonType}>{selected.isCheckpoint ? copy.checkpoint : copy.lesson} · {selected.estimatedMinutes} {copy.minutes}</Text>
                        {selected.lessonNumber && <Text style={styles.lessonSource}>{copy.lessonSource} {selected.lessonNumber}{selected.lessonHalf ?? ''}</Text>}
                        <Text style={styles.lessonTitle}>{selected.title}</Text>
                        <Text style={styles.lessonSubtitle}>{selected.subtitle}</Text>
                    </View>
                    <View style={styles.reward}><Text style={styles.rewardText}>⭐ {selected.rewards.xp}</Text><Text style={styles.rewardText}>🪙 {selected.rewards.coins}{selected.rewards.key ? `  🔑 ${selected.rewards.key}` : ''}</Text></View>
                </View>

                <Text style={styles.subheading}>{copy.focus}</Text>
                <View style={styles.chips}>{selected.focusItems.map((item) => <View key={item} style={styles.chip}><Text style={styles.chipText}>{item}</Text></View>)}</View>

                {(detailTab === 'overview') && <>
                    <Text style={styles.subheading}>{copy.activities}</Text>
                    <View style={styles.activityList}>{selected.activities.map((activity) => <View key={activity.id} style={styles.activityRow}>
                        <View style={styles.activityIcon}><Text style={styles.activityIconText}>{ACTIVITY_ICON[activity.kind]}</Text></View>
                        <View style={styles.activityCopy}><Text style={styles.activityTitle}>{activity.title}</Text><Text style={styles.activityInstruction}>{activity.instruction}</Text><Text style={styles.completion}>✓ {activity.completionRule}</Text></View>
                        <Text style={styles.activityMinutes}>{activity.minutes}′</Text>
                    </View>)}</View>
                </>}

                {(detailTab === 'overview' || detailTab === 'vocabulary') && <>
                    <Text style={styles.subheading}>{copy.vocabulary} · {selected.vocabulary.length} {copy.words}</Text>
                    {selected.vocabulary.length === 0 ? <Text style={styles.empty}>{copy.noNewWords}</Text> : <View style={styles.vocabGrid}>{selected.vocabulary.map((item) => <View key={`${item.japanese}:${item.romaji}`} style={[styles.vocabCard, compact && styles.vocabCardCompact]}>
                        <Text style={styles.japanese}>{item.japanese}</Text>
                        <Text style={styles.reading}>{item.reading} · {item.romaji}</Text>
                        <Text style={styles.meaning}>{localizedReviewText(language, item.reviewMeaningVi, item.romaji)}</Text>
                    </View>)}</View>}
                </>}

                {(detailTab === 'overview' || detailTab === 'grammar') && <>
                    <Text style={styles.subheading}>{copy.grammar} · {selected.grammar.length} {copy.patterns}</Text>
                    {selected.grammar.length === 0 ? <Text style={styles.empty}>{copy.noNewGrammar}</Text> : selected.grammar.map((item) => <View key={item.pattern} style={styles.grammarCard}>
                        <Text style={styles.pattern}>{item.pattern}</Text>
                        <Text style={styles.explanation}>{localizedReviewText(language, item.reviewExplanationVi, language === 'en' ? 'Study the pattern and example below.' : '文型と例文を確認してください。')}</Text>
                        <View style={styles.example}>
                            <Text style={styles.exampleReading}>{item.example.reading}</Text>
                            <Text style={styles.exampleJapanese}>{item.example.japanese}</Text>
                            {item.example.reviewTranslationVi && <Text style={styles.exampleTranslation}>{item.example.reviewTranslationVi}</Text>}
                        </View>
                    </View>)}
                </>}

                {(detailTab === 'overview' || detailTab === 'practice') && (selected.practiceVi.length > 0 || selected.kaiwaVi.length > 0 || selected.listeningVi) && <>
                    <Text style={styles.subheading}>{copy.practice}</Text>
                    {selected.practiceVi.map((item, index) => <View key={`practice-${index}`} style={styles.practiceRow}>
                        <Text style={styles.practiceIndex}>{index + 1}</Text>
                        <Text style={styles.practiceText}>{item}</Text>
                    </View>)}
                    {selected.kaiwaVi.length > 0 && <View style={styles.kaiwaCard}>
                        <Text style={styles.practiceTitle}>{copy.kaiwa}</Text>
                        {selected.kaiwaVi.map((line, index) => <Text key={`kaiwa-${index}`} style={styles.kaiwaLine}>{line}</Text>)}
                    </View>}
                    {!!selected.listeningVi && <View style={styles.listeningCard}>
                        <Text style={styles.practiceTitle}>{copy.listening}</Text>
                        <Text style={styles.practiceText}>{selected.listeningVi}</Text>
                    </View>}
                </>}

                <Pressable style={styles.startButton} onPress={() => startDay(selected)}>
                    <Text style={styles.startText}>{copy.start} · {selected.phase === 'kana' ? '文字' : selected.lessonNumber ? `第${selected.lessonNumber}課` : 'N5'}</Text>
                </Pressable>
            </View>
        </ScrollView>
    </View>;
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#f4f7fb' },
    hero: { backgroundColor: '#3759c7', paddingHorizontal: 18, paddingTop: 10, paddingBottom: 17, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
    heroTop: { flexDirection: 'row', alignItems: 'flex-start' },
    backButton: { width: 40, height: 40, borderRadius: 13, backgroundColor: 'rgba(232,226,214,.15)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    backText: { color: '#fff', fontSize: 31, lineHeight: 33, fontWeight: '500' },
    heroCopy: { flex: 1 }, eyebrow: { color: '#dbe5ff', fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
    heroTitle: { color: '#fff', fontSize: 26, fontWeight: '900', marginTop: 2 },
    heroSubtitle: { color: '#dbe5ff', fontSize: 12, marginTop: 3, lineHeight: 17 },
    metrics: { flexDirection: 'row', gap: 8, marginTop: 14 },
    metric: { flex: 1, backgroundColor: 'rgba(232,226,214,.13)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 9 },
    metricLabel: { color: '#dbe5ff', fontSize: 9 }, metricValue: { color: '#fff', fontWeight: '900', fontSize: 16, marginTop: 2 },
    quickActions: { flexDirection: 'row', gap: 7, paddingHorizontal: 13, paddingTop: 12 },
    quickButton: { flex: 1, minHeight: 42, borderRadius: 12, backgroundColor: '#e8e2d6', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 7, borderWidth: 1, borderColor: '#e0e7f0' },
    quickButtonActive: { backgroundColor: '#26375f', borderColor: '#26375f' }, quickText: { color: '#26375f', fontWeight: '800', fontSize: 12 }, quickTextActive: { color: '#fff' },
    body: { padding: 13, paddingBottom: 50 }, weekTabs: { gap: 8, paddingBottom: 4 },
    weekCard: { width: 196, minHeight: 86, backgroundColor: '#e8e2d6', borderWidth: 1, borderColor: '#dfe6ef', borderRadius: 15, padding: 12 },
    weekCardActive: { backgroundColor: '#26375f', borderColor: '#26375f' }, weekNumber: { color: '#5371b5', fontSize: 10, fontWeight: '800' },
    weekTitle: { color: '#1e2e45', fontWeight: '900', fontSize: 13, marginTop: 4 }, weekGoal: { color: '#718096', fontSize: 10, lineHeight: 14, marginTop: 5 },
    onDark: { color: '#fff' }, onDarkMuted: { color: '#d9e2f1' }, onBlue: { color: '#fff' },
    sectionTitle: { fontSize: 18, fontWeight: '900', marginTop: 17, color: '#1d2b42' }, sectionSubtitle: { color: '#6b7a8c', fontSize: 11, lineHeight: 17, marginTop: 3 },
    dayStrip: { gap: 8, paddingVertical: 12 }, dayCard: { width: 154, minHeight: 102, borderRadius: 15, backgroundColor: '#e8e2d6', padding: 11, borderWidth: 1, borderColor: '#dfe6ef' },
    dayCardActive: { backgroundColor: '#4972e8', borderColor: '#4972e8' }, dayTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 5 },
    dayIndex: { color: '#4868ac', fontSize: 9, fontWeight: '800' }, dayMinutes: { color: '#8491a2', fontSize: 9 }, dayTitle: { color: '#26354b', fontWeight: '800', fontSize: 11, lineHeight: 15, marginTop: 7 }, checkpoint: { color: '#a77500', fontSize: 9, fontWeight: '800', marginTop: 7 },
    lessonCard: { backgroundColor: '#e8e2d6', borderRadius: 20, padding: 15, borderWidth: 1, borderColor: '#dfe6ef' }, lessonHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    lessonHeaderCopy: { flex: 1 }, lessonType: { color: '#4b6dc1', fontSize: 10, fontWeight: '800' }, lessonSource: { color: '#2d7d5a', fontSize: 10, fontWeight: '900', marginTop: 3 }, lessonTitle: { fontSize: 20, lineHeight: 26, fontWeight: '900', color: '#1d2b42', marginTop: 4 },
    lessonSubtitle: { color: '#6a788b', fontSize: 11, lineHeight: 17, marginTop: 5 }, reward: { backgroundColor: '#fff4d7', borderRadius: 12, padding: 9 }, rewardText: { color: '#6d520e', fontSize: 10, fontWeight: '700' },
    subheading: { fontSize: 14, fontWeight: '900', color: '#22324b', marginTop: 21, marginBottom: 9 }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 }, chip: { backgroundColor: '#edf3ff', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 6 }, chipText: { color: '#365da9', fontSize: 10, fontWeight: '700' },
    activityList: { gap: 7 }, activityRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, borderRadius: 13, backgroundColor: '#f5f8fb', padding: 10 }, activityIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#e4ebf6', alignItems: 'center', justifyContent: 'center' }, activityIconText: { fontWeight: '900', color: '#35558e' }, activityCopy: { flex: 1 }, activityTitle: { fontSize: 12, fontWeight: '900', color: '#25354d' }, activityInstruction: { color: '#6b798a', fontSize: 10, lineHeight: 15, marginTop: 3 }, completion: { color: '#258159', fontSize: 9, lineHeight: 14, marginTop: 4 }, activityMinutes: { color: '#758296', fontSize: 10 },
    vocabGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, vocabCard: { width: '31.8%', minWidth: 142, borderWidth: 1, borderColor: '#e0e6ee', borderRadius: 13, padding: 10 }, vocabCardCompact: { width: '48.5%', minWidth: 125 }, japanese: { fontSize: 17, fontWeight: '900', color: '#1e2f48' }, reading: { color: '#4e70a5', fontSize: 10, marginTop: 3 }, meaning: { color: '#737f8f', fontSize: 10, marginTop: 4 },
    grammarCard: { borderRadius: 14, backgroundColor: '#faf7ff', borderWidth: 1, borderColor: '#e7def4', padding: 12, marginBottom: 8 }, pattern: { color: '#7045b2', fontWeight: '900', fontSize: 15 }, explanation: { color: '#465368', fontSize: 11, lineHeight: 17, marginTop: 5 }, example: { backgroundColor: '#e8e2d6', borderRadius: 10, padding: 9, marginTop: 8 }, exampleReading: { color: '#62779b', fontSize: 10, lineHeight: 15 }, exampleJapanese: { color: '#21304a', fontWeight: '800', fontSize: 14, lineHeight: 20, marginTop: 2 }, exampleTranslation: { color: '#526177', fontSize: 11, lineHeight: 17, marginTop: 4 },
    practiceRow: { flexDirection: 'row', gap: 9, alignItems: 'flex-start', backgroundColor: '#f5f8fb', borderRadius: 12, padding: 10, marginBottom: 7 },
    practiceIndex: { width: 22, height: 22, borderRadius: 11, textAlign: 'center', lineHeight: 22, overflow: 'hidden', backgroundColor: '#dce8ff', color: '#315aa7', fontWeight: '900', fontSize: 10 },
    practiceText: { flex: 1, color: '#465368', fontSize: 11, lineHeight: 17 }, practiceTitle: { color: '#24354d', fontSize: 12, fontWeight: '900', marginBottom: 6 },
    kaiwaCard: { backgroundColor: '#f5f0ff', borderRadius: 13, padding: 12, marginTop: 8 }, kaiwaLine: { color: '#3d3156', fontSize: 12, lineHeight: 20 },
    listeningCard: { backgroundColor: '#edf8f4', borderRadius: 13, padding: 12, marginTop: 8 },
    empty: { color: '#778395', fontSize: 11, lineHeight: 17, backgroundColor: '#f5f7fa', borderRadius: 12, padding: 12 }, startButton: { marginTop: 22, minHeight: 50, borderRadius: 14, backgroundColor: '#3867db', alignItems: 'center', justifyContent: 'center' }, startText: { color: '#fff', fontWeight: '900', fontSize: 14 },
});
