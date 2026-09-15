import { useMemo, useRef, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import type { JlptMockPart, JlptMockQuestion } from '@/data/jlpt-mock/types';
import JlptAudioButton from '@/components/jlpt/JlptAudioButton';
import {
    ROYAL,
    ROYAL_FONT,
    ROYAL_TYPE,
    RoyalDialogueFrame,
    RoyalOptionRow,
    RoyalSelectionMark,
    RoyalTitlePanel,
} from '@/components/ui/RoyalSurface';

type Props = {
    parts: readonly JlptMockPart[];
    questions: readonly JlptMockQuestion[];
    answers: Readonly<Record<string, string>>;
    onChoose: (questionId: string, optionId: string) => void;
    initialScrollOffset?: number;
    onScrollOffset?: (offset: number) => void;
};

/**
 * A scroll-first JLPT surface. It renders section instructions exactly once,
 * keeps question numbering stable, and progressively appends cards while the
 * learner swipes down instead of forcing previous/next navigation.
 */
export default function JlptQuestionFeed({ parts, questions, answers, onChoose, initialScrollOffset = 0, onScrollOffset }: Props) {
    const [visibleCount, setVisibleCount] = useState(12);
    const initialOffset = useRef(initialScrollOffset).current;
    const visibleQuestions = questions.slice(0, visibleCount);
    const sections = useMemo(() => parts.map((part) => ({
        key: part.id,
        part,
        data: visibleQuestions.filter((question) => question.family === part.family),
    })).filter((section) => section.data.length > 0), [parts, visibleQuestions]);

    return <SectionList<JlptMockQuestion, { key: string; part: JlptMockPart; data: JlptMockQuestion[] }>
        sections={sections}
        keyExtractor={(question) => question.id}
        contentContainerStyle={styles.content}
        contentOffset={{ x: 0, y: initialOffset }}
        onScroll={(event) => onScrollOffset?.(event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={100}
        stickySectionHeadersEnabled={false}
        onEndReached={() => setVisibleCount((current) => Math.min(current + 12, questions.length))}
        onEndReachedThreshold={0.4}
        renderSectionHeader={({ section }) => <RoyalTitlePanel style={styles.partHeader}>
            <Text style={styles.partTitle}>{section.part.title}</Text>
            <Text style={styles.instructions}>{section.part.instructions}</Text>
        </RoyalTitlePanel>}
        renderItem={({ item }) => {
            const number = questions.findIndex((question) => question.id === item.id) + 1;
            return <RoyalDialogueFrame style={styles.card}>
                <Text style={styles.questionNumber}>問題 {number}</Text>
                {item.passage ? <RoyalDialogueFrame style={styles.passageFrame}><Text style={styles.passage}>{item.passage}</Text></RoyalDialogueFrame> : null}
                <Text style={styles.prompt}>{item.prompt}</Text>
                {item.audioScript ? <JlptAudioButton prompt={item.prompt} script={item.audioScript} /> : null}
                <View style={styles.options}>
                    {item.options.map((option, optionIndex) => {
                        const selected = answers[item.id] === option.id;
                        return <RoyalOptionRow key={option.id} onPress={() => onChoose(item.id, option.id)} style={styles.option} contentStyle={selected ? styles.selected : undefined}>
                            <Text style={[styles.optionIndex, selected && styles.selectedText]}>{optionIndex + 1}</Text>
                            <Text style={[styles.optionText, selected && styles.selectedText]}>{option.text}</Text>
                            {selected ? <RoyalSelectionMark style={styles.selectionMark} /> : null}
                        </RoyalOptionRow>;
                    })}
                </View>
            </RoyalDialogueFrame>;
        }}
        ListFooterComponent={visibleCount < questions.length ? <Text style={styles.loading}>Kéo xuống để tải thêm câu hỏi…</Text> : <Text style={styles.end}>Đã tải toàn bộ câu hỏi của phần này.</Text>}
    />;
}

const styles = StyleSheet.create({
    content: { padding: 16, paddingBottom: 48 },
    partHeader: { paddingVertical: 20, marginTop: 12, marginBottom: 10 },
    partTitle: { color: ROYAL.white, fontSize: ROYAL_TYPE.pageTitle, lineHeight: 34, fontFamily: ROYAL_FONT.heading, textAlign: 'center' },
    instructions: { color: ROYAL.paleGold, fontSize: ROYAL_TYPE.explanation, lineHeight: ROYAL_TYPE.explanationLine, fontFamily: ROYAL_FONT.body, marginTop: 8, textAlign: 'center' },
    card: { marginBottom: 12 },
    questionNumber: { color: ROYAL.darkGold, fontSize: ROYAL_TYPE.fieldValue, lineHeight: 24, fontFamily: ROYAL_FONT.heading, marginBottom: 9 },
    prompt: { color: ROYAL.ink, fontSize: 20, fontFamily: ROYAL_FONT.heading, lineHeight: 32 },
    passageFrame: { marginBottom: 14 },
    passage: { color: ROYAL.ink, fontSize: 18, lineHeight: 30, fontFamily: ROYAL_FONT.body },
    options: { marginTop: 16, gap: 9 },
    option: { minHeight: 72 },
    selected: { opacity: 1 },
    optionIndex: { width: 30, color: ROYAL.darkGold, fontFamily: ROYAL_FONT.heading, fontSize: 18, lineHeight: 26, textAlign: 'center' },
    optionText: { flex: 1, color: ROYAL.ink, fontSize: 17, lineHeight: 26, fontFamily: ROYAL_FONT.body },
    selectedText: { color: ROYAL.lacquer },
    selectionMark: { marginLeft: 8 },
    loading: { color: ROYAL.darkGold, fontFamily: ROYAL_FONT.body, textAlign: 'center', padding: 20 },
    end: { color: ROYAL.darkGold, fontFamily: ROYAL_FONT.heading, textAlign: 'center', padding: 20 },
});
