import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';

import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { lessons } from '@/data/lessons';
import { modules } from '@/data/modules';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';

import {
    getAllLessonProgress,
} from '@/services/progress-storage';

import type {
    LessonProgress,
} from '@/types/progress';

export default function ModuleScreen() {
    const { moduleId } = useLocalSearchParams();

    const id = Array.isArray(moduleId)
        ? moduleId[0]
        : moduleId;

    const [progressList, setProgressList] =
        useState<LessonProgress[]>([]);

    const module = modules.find(
        (item) => item.id === id
    );

    const moduleLessons = lessons
        .filter(
            (item) =>
                item.moduleId === id
        )
        .sort(
            (a, b) =>
                a.order - b.order
        );

    useFocusEffect(
        useCallback(() => {
            let active = true;

            async function loadProgress() {
                const progress =
                    await getAllLessonProgress();

                if (active) {
                    setProgressList(progress);
                }
            }

            loadProgress();

            return () => {
                active = false;
            };
        }, [])
    );

    if (!module) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text>
                        モジュールが見つかりません。
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const completedLessons =
        moduleLessons.filter((lesson) => {
            const progress =
                progressList.find(
                    (item) =>
                        item.lessonId ===
                        lesson.id
                );

            return (
                progress?.status ===
                'completed'
            );
        }).length;

    const modulePercent =
        moduleLessons.length > 0
            ? Math.round(
                (completedLessons /
                    moduleLessons.length) *
                100
            )
            : 0;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={
                    styles.content
                }
            >
                <RoyalBackButton onPress={() => router.back()} />

                <Text style={styles.icon}>
                    {module.icon ?? '📘'}
                </Text>

                <Text style={styles.title}>
                    {module.titleJa}
                </Text>

                <Text style={styles.translation}>
                    {module.titleVi}
                </Text>

                {module.descriptionVi && (
                    <Text style={styles.description}>
                        {module.descriptionVi}
                    </Text>
                )}

                <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>
                            学習進捗
                        </Text>

                        <Text style={styles.progressPercent}>
                            {modulePercent}%
                        </Text>
                    </View>

                    <View style={styles.progressTrack}>
                        <View
                            style={[
                                styles.progressBar,
                                {
                                    width: `${modulePercent}%`,
                                },
                            ]}
                        />
                    </View>

                    <Text style={styles.progressText}>
                        {completedLessons} / {moduleLessons.length}
                        {' '}レッスン完了
                    </Text>
                </View>

                <Text style={styles.lessonCount}>
                    {moduleLessons.length} レッスン
                </Text>

                {moduleLessons.map(
                    (lesson, index) => {
                        const lessonProgress =
                            progressList.find(
                                (item) =>
                                    item.lessonId ===
                                    lesson.id
                            );

                        const completed =
                            lessonProgress?.status ===
                            'completed';

                        return (
                            <Pressable
                                key={lesson.id}
                                style={({ pressed }) => [
                                    styles.lessonCard,
                                    completed &&
                                    styles.lessonCardCompleted,
                                    pressed &&
                                    styles.cardPressed,
                                ]}
                                onPress={() => {
                                    router.push({
                                        pathname:
                                            '/lesson/[lessonId]',
                                        params: {
                                            lessonId:
                                                lesson.id,
                                        },
                                    });
                                }}
                            >
                                <View
                                    style={[
                                        styles.lessonNumber,

                                        completed &&
                                        styles.lessonNumberCompleted,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.lessonNumberText,

                                            completed &&
                                            styles.lessonNumberTextCompleted,
                                        ]}
                                    >
                                        {completed
                                            ? '✓'
                                            : index + 1}
                                    </Text>
                                </View>

                                <View
                                    style={
                                        styles.lessonContent
                                    }
                                >
                                    <Text
                                        style={
                                            styles.lessonTitle
                                        }
                                    >
                                        {lesson.titleJa}
                                    </Text>

                                    <Text
                                        style={
                                            styles.lessonTranslation
                                        }
                                    >
                                        {lesson.titleVi}
                                    </Text>

                                    <View
                                        style={
                                            styles.lessonMeta
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.lessonType
                                            }
                                        >
                                            {lesson.type}
                                        </Text>

                                        {lesson.estimatedMinutes && (
                                            <Text
                                                style={
                                                    styles.lessonTime
                                                }
                                            >
                                                {
                                                    lesson.estimatedMinutes
                                                }
                                                分
                                            </Text>
                                        )}
                                    </View>

                                    <View
                                        style={
                                            styles.statusRow
                                        }
                                    >
                                        {completed ? (
                                            <>
                                                <Text
                                                    style={
                                                        styles.completedText
                                                    }
                                                >
                                                    ✓ 完了
                                                </Text>

                                                {lessonProgress &&
                                                    lessonProgress.quizTotal >
                                                    0 && (
                                                        <Text
                                                            style={
                                                                styles.quizResultText
                                                            }
                                                        >
                                                            クイズ{' '}
                                                            {
                                                                lessonProgress.quizPercent
                                                            }
                                                            %
                                                        </Text>
                                                    )}
                                            </>
                                        ) : (
                                            <Text
                                                style={
                                                    styles.notStartedText
                                                }
                                            >
                                                未学習
                                            </Text>
                                        )}
                                    </View>

                                    <Text
                                        style={
                                            completed
                                                ? styles.reviewText
                                                : styles.startText
                                        }
                                    >
                                        {completed
                                            ? '復習する'
                                            : 'レッスンを始める'}
                                    </Text>
                                </View>

                                <Text style={styles.arrow}>
                                    ›
                                </Text>
                            </Pressable>
                        );
                    }
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8e2d6',
    },

    content: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 40,
    },

    backText: {
        fontSize: 16,
        marginBottom: 28,
    },

    icon: {
        fontSize: 44,
    },

    title: {
        fontSize: 34,
        fontWeight: '800',
        marginTop: 10,
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

    progressSection: {
        marginTop: 26,
    },

    progressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    progressTitle: {
        fontSize: 15,
        fontWeight: '700',
    },

    progressPercent: {
        fontSize: 15,
        fontWeight: '800',
    },

    progressTrack: {
        height: 8,
        backgroundColor: '#eeeeee',
        borderRadius: 4,
        marginTop: 10,
        overflow: 'hidden',
    },

    progressBar: {
        height: '100%',
        backgroundColor: '#222222',
    },

    progressText: {
        fontSize: 16,
        marginTop: 8,
    },

    lessonCount: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 30,
        marginBottom: 16,
    },

    lessonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        backgroundColor: '#f3f3f3',
        borderRadius: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'transparent',
    },

    lessonCardCompleted: {
        borderColor: '#d6eadb',
        backgroundColor: '#f5fbf6',
    },

    cardPressed: {
        opacity: 0.6,
    },

    lessonNumber: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#e8e2d6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },

    lessonNumberCompleted: {
        backgroundColor: '#dff7e5',
    },

    lessonNumberText: {
        fontSize: 16,
        fontWeight: '700',
    },

    lessonNumberTextCompleted: {
        color: '#2f8a48',
    },

    lessonContent: {
        flex: 1,
    },

    lessonTitle: {
        fontSize: 18,
        fontWeight: '700',
    },

    lessonTranslation: {
        fontSize: 16,
        marginTop: 3,
    },

    lessonMeta: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 8,
    },

    lessonType: {
        fontSize: 15,
    },

    lessonTime: {
        fontSize: 15,
    },

    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
    },

    completedText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2f8a48',
    },

    quizResultText: {
        fontSize: 16,
        fontWeight: '600',
    },

    notStartedText: {
        fontSize: 16,
        color: '#777777',
    },

    reviewText: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 10,
    },

    startText: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 10,
    },

    arrow: {
        fontSize: 28,
        marginLeft: 8,
    },
});
