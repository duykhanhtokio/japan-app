import { router, useLocalSearchParams } from 'expo-router';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { lessons } from '@/data/lessons';
import { vocabulary } from '@/data/vocabulary';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';

export default function LessonDetailScreen() {
    const { lessonId } = useLocalSearchParams();

    const id = Array.isArray(lessonId)
        ? lessonId[0]
        : lessonId;

    const lesson = lessons.find(
        (item) => item.id === id
    );

    if (!lesson) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <RoyalBackButton onPress={() => router.back()} />

                    <Text>レッスンが見つかりません。</Text>
                </View>
            </SafeAreaView>
        );
    }

    const lessonWords = vocabulary.filter(
        (item) =>
            lesson.vocabularyIds?.includes(item.id)
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>

                <RoyalBackButton onPress={() => router.back()} />

                <Text style={styles.type}>
                    {lesson.type}
                </Text>

                <Text style={styles.title}>
                    {lesson.titleJa}
                </Text>

                <Text style={styles.translation}>
                    {lesson.titleVi}
                </Text>

                {lesson.descriptionVi && (
                    <Text style={styles.description}>
                        {lesson.descriptionVi}
                    </Text>
                )}

                {lesson.estimatedMinutes && (
                    <Text style={styles.time}>
                        ⏱ {lesson.estimatedMinutes}分
                    </Text>
                )}
                <Pressable
                    style={styles.startButton}
                    onPress={() => {
                        router.push({
                            pathname: '/lesson/play/[lessonId]',
                            params: {
                                lessonId: lesson.id,
                            },
                        });
                    }}
                >
                    <Text style={styles.startButtonText}>
                        レッスンを始める
                    </Text>
                </Pressable>
                {lesson.objectiveJa && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            🎯 学習目標
                        </Text>

                        <View style={styles.box}>
                            <Text style={styles.japaneseText}>
                                {lesson.objectiveJa}
                            </Text>

                            {lesson.objectiveVi && (
                                <Text style={styles.vietnameseText}>
                                    {lesson.objectiveVi}
                                </Text>
                            )}
                        </View>
                    </View>
                )}

                {lessonWords.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            📚 単語
                        </Text>

                        {lessonWords.map((word) => (
                            <Pressable
                                key={word.id}
                                style={styles.wordCard}
                                onPress={() =>
                                    router.push(
                                        `/${word.jlptLevel}/vocabulary/${word.id}`
                                    )
                                }
                            >
                                <View>
                                    <Text style={styles.word}>
                                        {word.word}
                                    </Text>

                                    <Text style={styles.reading}>
                                        {word.reading}
                                    </Text>
                                </View>

                                <Text style={styles.wordMeaning}>
                                    {word.meaningVi}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                )}

                {lesson.expressions &&
                    lesson.expressions.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                📝 表現
                            </Text>

                            {lesson.expressions.map((expression) => (
                                <View
                                    key={expression.id}
                                    style={styles.expressionCard}
                                >
                                    <Text style={styles.expression}>
                                        {expression.expression}
                                    </Text>

                                    <Text style={styles.expressionMeaning}>
                                        {expression.meaningVi}
                                    </Text>

                                    {expression.exampleJa && (
                                        <View style={styles.exampleBox}>
                                            <Text style={styles.japaneseText}>
                                                {expression.exampleJa}
                                            </Text>

                                            {expression.exampleVi && (
                                                <Text style={styles.vietnameseText}>
                                                    {expression.exampleVi}
                                                </Text>
                                            )}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                {lesson.dialogue &&
                    lesson.dialogue.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                💬 会話
                            </Text>

                            {lesson.dialogue.map((line) => (
                                <View
                                    key={line.id}
                                    style={styles.dialogueCard}
                                >
                                    <Text style={styles.speaker}>
                                        {line.speakerJa}
                                        {line.speakerVi
                                            ? ` / ${line.speakerVi}`
                                            : ''}
                                    </Text>

                                    <Text style={styles.dialogueJa}>
                                        {line.textJa}
                                    </Text>

                                    {line.reading && (
                                        <Text style={styles.reading}>
                                            {line.reading}
                                        </Text>
                                    )}

                                    <Text style={styles.dialogueVi}>
                                        {line.textVi}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        🗣️ 練習
                    </Text>

                    <Pressable
                        style={styles.practiceButton}
                        onPress={() => {
                            console.log(
                                'Speaking practice:',
                                lesson.id
                            );
                        }}
                    >
                        <Text style={styles.practiceButtonText}>
                            発音練習を始める
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        🤖 AI会話
                    </Text>

                    <Pressable
                        style={styles.aiButton}
                        onPress={() => {
                            console.log(
                                'AI conversation:',
                                lesson.id
                            );
                        }}
                    >
                        <Text style={styles.aiButtonText}>
                            AI会話を始める
                        </Text>
                    </Pressable>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    startButton: {
        backgroundColor: '#222222',
        padding: 17,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 24,
    },

    startButtonText: {
        color: '#ffffff',
        fontSize: 17,
        fontWeight: '700',
    },
    container: {
        flex: 1,
        backgroundColor: '#e8e2d6',
    },

    content: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 50,
    },

    backText: {
        fontSize: 16,
        marginBottom: 26,
    },

    type: {
        fontSize: 16,
        fontWeight: '700',
    },

    title: {
        fontSize: 34,
        fontWeight: '800',
        marginTop: 6,
    },

    translation: {
        fontSize: 18,
        marginTop: 5,
    },

    description: {
        fontSize: 15,
        lineHeight: 22,
        marginTop: 14,
    },

    time: {
        fontSize: 16,
        marginTop: 12,
    },

    section: {
        marginTop: 32,
    },

    sectionTitle: {
        fontSize: 21,
        fontWeight: '700',
        marginBottom: 14,
    },

    box: {
        backgroundColor: '#f3f3f3',
        padding: 18,
        borderRadius: 16,
    },

    japaneseText: {
        fontSize: 17,
        lineHeight: 25,
    },

    vietnameseText: {
        fontSize: 15,
        lineHeight: 22,
        marginTop: 8,
    },

    wordCard: {
        backgroundColor: '#f3f3f3',
        padding: 16,
        borderRadius: 14,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    word: {
        fontSize: 22,
        fontWeight: '700',
    },

    reading: {
        fontSize: 16,
        marginTop: 3,
    },

    wordMeaning: {
        fontSize: 15,
        fontWeight: '600',
    },

    expressionCard: {
        backgroundColor: '#f3f3f3',
        padding: 18,
        borderRadius: 16,
        marginBottom: 12,
    },

    expression: {
        fontSize: 20,
        fontWeight: '700',
    },

    expressionMeaning: {
        fontSize: 15,
        marginTop: 6,
    },

    exampleBox: {
        backgroundColor: '#e8e2d6',
        padding: 14,
        borderRadius: 12,
        marginTop: 12,
    },

    dialogueCard: {
        backgroundColor: '#f3f3f3',
        padding: 18,
        borderRadius: 16,
        marginBottom: 12,
    },

    speaker: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
    },

    dialogueJa: {
        fontSize: 18,
        lineHeight: 26,
    },

    dialogueVi: {
        fontSize: 15,
        lineHeight: 22,
        marginTop: 8,
    },

    practiceButton: {
        backgroundColor: '#eeeeee',
        padding: 17,
        borderRadius: 14,
        alignItems: 'center',
    },

    practiceButtonText: {
        fontSize: 17,
        fontWeight: '700',
    },

    aiButton: {
        backgroundColor: '#222222',
        padding: 17,
        borderRadius: 14,
        alignItems: 'center',
    },

    aiButtonText: {
        color: '#ffffff',
        fontSize: 17,
        fontWeight: '700',
    },
});
