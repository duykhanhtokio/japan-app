import {
    useCallback,
    useMemo,
    useState,
} from 'react';

import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';

import {
    router,
    useFocusEffect,
} from 'expo-router';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import BottomNav from '@/components/app/BottomNav';

import {
    getWorkConversationHistory,
} from '@/services/work-conversation-history-storage';

import type {
    WorkConversationHistoryItem,
} from '@/types/work-conversation-history';
import { JSX } from 'react/jsx-runtime';

type FilterId =
    | 'all'
    | 'life'
    | 'work'
    | 'review'
    | 'mastered';

type MasteryStatus =
    | 'review'
    | 'mastered'
    | 'new';

const filters: {
    id: FilterId;
    label: string;
}[] = [
        {
            id: 'all',
            label: 'すべて',
        },

        {
            id: 'life',
            label: '生活会話',
        },

        {
            id: 'work',
            label: '仕事会話',
        },

        {
            id: 'review',
            label: '要復習',
        },

        {
            id: 'mastered',
            label: '習得済み',
        },
    ];

/*
 * =========================================================
 * SAFE NUMBER
 *
 * History cũ có thể chưa có:
 * correctCount
 * understandableCount
 * retryCount
 * =========================================================
 */

function safeNumber(
    value: number | undefined
): number {
    return typeof value === 'number' &&
        Number.isFinite(value)
        ? value
        : 0;
}

/*
 * =========================================================
 * MASTERY
 * =========================================================
 */

function getMasteryStatus(
    item: WorkConversationHistoryItem
): MasteryStatus {
    const correctCount =
        safeNumber(
            item.correctCount
        );

    const understandableCount =
        safeNumber(
            item.understandableCount
        );

    const retryCount =
        safeNumber(
            item.retryCount
        );

    const totalTurns =
        Math.max(
            1,
            safeNumber(
                item.totalPlayerTurns
            )
        );

    /*
     * Xem đáp án
     * → chắc chắn cần ôn lại.
     */

    if (
        item.usedAnswerReveal
    ) {
        return 'review';
    }

    /*
     * Retry nhiều.
     */

    if (
        retryCount >= 2
    ) {
        return 'review';
    }

    /*
     * "意味は通じます" nhiều hơn
     * câu correct.
     */

    if (
        understandableCount >
        correctCount
    ) {
        return 'review';
    }

    /*
     * 80% trở lên là correct
     * và retry tối đa 1 lần
     * → mastered.
     */

    const correctRate =
        correctCount /
        totalTurns;

    if (
        correctRate >= 0.8 &&
        retryCount <= 1
    ) {
        return 'mastered';
    }

    return 'new';
}

/*
 * =========================================================
 * FILTER
 * =========================================================
 */

function matchFilter(
    log: WorkConversationHistoryItem,
    filter: FilterId
): boolean {
    if (
        filter === 'all'
    ) {
        return true;
    }

    /*
     * Hiện Conversation History mới chỉ có
     * WORK MISSION.
     *
     * Life Dialogue sẽ nối vào sau.
     */

    if (
        filter === 'life'
    ) {
        return false;
    }

    if (
        filter === 'work'
    ) {
        return true;
    }

    const mastery =
        getMasteryStatus(
            log
        );

    if (
        filter === 'review'
    ) {
        return (
            mastery ===
            'review'
        );
    }

    if (
        filter === 'mastered'
    ) {
        return (
            mastery ===
            'mastered'
        );
    }

    return true;
}
export default function ConversationLogScreen() {
    const [
        search,
        setSearch,
    ] =
        useState('');

    const [
        filter,
        setFilter,
    ] =
        useState<FilterId>(
            'all'
        );

    const [
        history,
        setHistory,
    ] =
        useState<
            WorkConversationHistoryItem[]
        >([]);

    /*
     * =========================================================
     * LOAD REAL HISTORY
     *
     * Mỗi lần quay lại màn này
     * sẽ đọc lại AsyncStorage.
     * =========================================================
     */

    useFocusEffect(
        useCallback(
            () => {
                let active =
                    true;

                const loadHistory =
                    async () => {
                        try {
                            const data =
                                await getWorkConversationHistory();

                            if (
                                !active
                            ) {
                                return;
                            }

                            setHistory(
                                data
                            );
                        } catch (
                        error
                        ) {
                            console.log(
                                'Load conversation history error:',
                                error
                            );

                            if (
                                active
                            ) {
                                setHistory(
                                    []
                                );
                            }
                        }
                    };

                void loadHistory();

                return () => {
                    active =
                        false;
                };
            },
            []
        )
    );

    /*
     * =========================================================
     * FILTERED HISTORY
     * =========================================================
     */

    const filteredLogs =
        useMemo(
            () => {
                const query =
                    search
                        .trim()
                        .toLowerCase();

                return history.filter(
                    (
                        log
                    ) => {
                        if (
                            !matchFilter(
                                log,
                                filter
                            )
                        ) {
                            return false;
                        }

                        if (
                            !query
                        ) {
                            return true;
                        }

                        const searchable =
                            [
                                log.scenarioTitleJa,

                                log.operationCode,

                                log.scenarioId,

                                log.playerLevel,
                            ]
                                .filter(
                                    Boolean
                                )
                                .join(
                                    ' '
                                )
                                .toLowerCase();

                        return searchable.includes(
                            query
                        );
                    }
                );
            },
            [
                history,
                search,
                filter,
            ]
        );

    /*
     * =========================================================
     * SUMMARY
     * =========================================================
     */

    const totalCount =
        history.length;

    /*
     * Hiện history thật mới chỉ lưu WORK.
     */

    const lifeCount =
        0;

    const workCount =
        history.length;

    const reviewCount =
        history.filter(
            (
                item
            ) =>
                getMasteryStatus(
                    item
                ) ===
                'review'
        ).length;

    return (
        <SafeAreaView
            style={
                styles.container
            }
            edges={[
                'top',
                'bottom',
            ]}
        >
            <View
                style={
                    styles.content
                }
            >
                <View
                    style={
                        styles.header
                    }
                >
                    <RoyalBackButton onPress={() => router.back()} />

                    <View>
                        <Text
                            style={
                                styles.title
                            }
                        >
                            会話ログ
                        </Text>

                        <Text
                            style={
                                styles.subtitle
                            }
                        >
                            Conversation Review
                        </Text>
                    </View>
                </View>

                <View
                    style={
                        styles.summary
                    }
                >
                    <SummaryItem
                        value={
                            totalCount
                        }
                        label="総会話"
                    />

                    <SummaryItem
                        value={
                            lifeCount
                        }
                        label="生活"
                    />

                    <SummaryItem
                        value={
                            workCount
                        }
                        label="仕事"
                    />

                    <SummaryItem
                        value={
                            reviewCount
                        }
                        label="要復習"
                    />
                </View>

                {reviewCount >
                    0 && (
                        <View
                            style={
                                styles.reviewQueue
                            }
                        >
                            <View>
                                <Text
                                    style={
                                        styles.reviewTitle
                                    }
                                >
                                    今日の復習
                                </Text>

                                <Text
                                    style={
                                        styles.reviewText
                                    }
                                >
                                    {
                                        reviewCount
                                    }件の会話を復習しましょう
                                </Text>
                            </View>

                            <Pressable
                                style={
                                    styles.reviewButton
                                }
                                onPress={() =>
                                    setFilter(
                                        'review'
                                    )
                                }
                            >
                                <Text
                                    style={
                                        styles.reviewButtonText
                                    }
                                >
                                    復習する
                                </Text>
                            </Pressable>
                        </View>
                    )}

                <TextInput
                    style={
                        styles.search
                    }
                    value={search}
                    onChangeText={
                        setSearch
                    }
                    placeholder="会話・作業コードを検索..."
                    placeholderTextColor="#7e8999"
                />

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={
                        false
                    }
                    contentContainerStyle={
                        styles.filters
                    }
                >
                    {filters.map(
                        (item) => (
                            <Pressable
                                key={
                                    item.id
                                }
                                style={[
                                    styles.filterButton,

                                    filter ===
                                    item.id &&
                                    styles.filterActive,
                                ]}
                                onPress={() =>
                                    setFilter(
                                        item.id
                                    )
                                }
                            >
                                <Text
                                    style={[
                                        styles.filterText,

                                        filter ===
                                        item.id &&
                                        styles.filterTextActive,
                                    ]}
                                >
                                    {
                                        item.label
                                    }
                                </Text>
                            </Pressable>
                        )
                    )}
                </ScrollView>

                <ScrollView
                    style={
                        styles.list
                    }
                    contentContainerStyle={
                        styles.listContent
                    }
                    showsVerticalScrollIndicator={
                        false
                    }
                >
                    {filteredLogs.map(
                        (log) => (
                            <ConversationCard
                                key={
                                    log.id
                                }
                                log={log}
                            />
                        )
                    )}

                    {filteredLogs.length ===
                        0 && (
                            <View
                                style={
                                    styles.empty
                                }
                            >
                                <Text
                                    style={
                                        styles.emptyText
                                    }
                                >
                                    会話ログがありません。
                                </Text>
                            </View>
                        )}
                </ScrollView>
            </View>

            <BottomNav
                active="profile"
            />
        </SafeAreaView>
    );
}

function SummaryItem({
    value,
    label,
}: {
    value: number;

    label: string;
}) {
    return (
        <View
            style={
                styles.summaryItem
            }
        >
            <Text
                style={
                    styles.summaryValue
                }
            >
                {value}
            </Text>

            <Text
                style={
                    styles.summaryLabel
                }
            >
                {label}
            </Text>
        </View>
    );
}

function ConversationCard({
    log,
}: {
    log:
    WorkConversationHistoryItem;
}): JSX.Element {
    const date =
        new Date(
            log.completedAt
        );

    const mastery =
        getMasteryStatus(
            log
        );

    const correctCount =
        safeNumber(
            log.correctCount
        );

    const understandableCount =
        safeNumber(
            log.understandableCount
        );

    const retryCount =
        safeNumber(
            log.retryCount
        );

    const totalTurns =
        safeNumber(
            log.totalPlayerTurns
        );

    const hints =
        safeNumber(
            log.totalHintsUsed
        );

    const xp =
        safeNumber(
            log.earnedXp
        );

    const coins =
        safeNumber(
            log.earnedCoins
        );

    return (
        <Pressable
            style={
                styles.card
            }
        >
            <View
                style={
                    styles.cardTop
                }
            >
                <View
                    style={[
                        styles.categoryBadge,
                        styles.workBadge,
                    ]}
                >
                    <Text
                        style={
                            styles.categoryText
                        }
                    >
                        仕事
                    </Text>
                </View>

                <Text
                    style={
                        styles.score
                    }
                >
                    +{xp} XP
                </Text>
            </View>

            <Text
                style={
                    styles.cardTitle
                }
            >
                {
                    log.scenarioTitleJa
                }
            </Text>

            <Text
                style={
                    styles.cardVi
                }
            >
                {
                    log.operationCode
                }
                {' · '}
                {
                    log.playerLevel
                }
            </Text>

            <View
                style={
                    styles.metrics
                }
            >
                <MetricItem
                    label="正解"
                    value={
                        `${correctCount}/${totalTurns}`
                    }
                />

                <MetricItem
                    label="意味OK"
                    value={
                        understandableCount
                    }
                />

                <MetricItem
                    label="Retry"
                    value={
                        retryCount
                    }
                />

                <MetricItem
                    label="Hint"
                    value={
                        hints
                    }
                />
            </View>

            <View
                style={
                    styles.rewardRow
                }
            >
                <Text
                    style={
                        styles.rewardText
                    }
                >
                    XP +{xp}
                </Text>

                <Text
                    style={
                        styles.rewardText
                    }
                >
                    Coin +{coins}
                </Text>

                {log.usedAnswerReveal && (
                    <Text
                        style={
                            styles.answerRevealText
                        }
                    >
                        答えを使用
                    </Text>
                )}
            </View>

            <View
                style={
                    styles.cardFooter
                }
            >
                <Text
                    style={
                        styles.date
                    }
                >
                    {
                        Number.isNaN(
                            date.getTime()
                        )
                            ? ''
                            : date.toLocaleString()
                    }
                </Text>

                <View
                    style={
                        styles.masteryRow
                    }
                >
                    <Text
                        style={[
                            styles.mastery,

                            mastery ===
                                'review'
                                ? styles.review
                                : mastery ===
                                    'mastered'
                                    ? styles.mastered
                                    : styles.newStatus,
                        ]}
                    >
                        {
                            mastery ===
                                'review'
                                ? '要復習'
                                : mastery ===
                                    'mastered'
                                    ? '習得済み'
                                    : 'NEW'
                        }
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}

/*
 * =========================================================
 * METRIC
 * =========================================================
 */

function MetricItem({
    label,
    value,
}: {
    label:
    string;

    value:
    string | number;
}) {
    return (
        <View
            style={
                styles.metricItem
            }
        >
            <Text
                style={
                    styles.metricValue
                }
            >
                {value}
            </Text>

            <Text
                style={
                    styles.metricLabel
                }
            >
                {label}
            </Text>
        </View>
    );
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,

            backgroundColor:
                '#101827',
        },

        content: {
            flex: 1,

            paddingHorizontal: 18,
        },

        header: {
            flexDirection: 'row',

            alignItems: 'center',

            marginTop: 8,
        },

        backButton: {
            width: 40,
            height: 40,

            borderRadius: 20,

            backgroundColor:
                '#202a40',

            alignItems: 'center',

            justifyContent:
                'center',

            marginRight: 12,
        },

        backText: {
            color: '#ffffff',

            fontSize: 24,
        },

        title: {
            color: '#ffffff',

            fontSize: 25,

            fontWeight: '900',
        },

        subtitle: {
            color: '#8792a3',

            fontSize: 16,
        },

        summary: {
            flexDirection: 'row',

            marginTop: 16,

            gap: 8,
        },

        summaryItem: {
            flex: 1,

            paddingVertical: 10,

            borderRadius: 14,

            backgroundColor:
                '#202a40',

            alignItems: 'center',
        },

        summaryValue: {
            color: '#ffffff',

            fontSize: 18,

            fontWeight: '900',
        },

        summaryLabel: {
            color: '#8994a5',

            fontSize: 15,

            marginTop: 2,
        },

        reviewQueue: {
            marginTop: 12,

            padding: 13,

            borderRadius: 16,

            backgroundColor:
                '#30263d',

            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
                'space-between',
        },

        reviewTitle: {
            color: '#ffffff',

            fontSize: 16,

            fontWeight: '900',
        },

        reviewText: {
            color: '#bbaec4',

            fontSize: 16,

            marginTop: 3,
        },

        reviewButton: {
            backgroundColor:
                '#ff659e',

            paddingHorizontal: 11,

            paddingVertical: 7,

            borderRadius: 12,
        },

        reviewButtonText: {
            color: '#ffffff',

            fontSize: 16,

            fontWeight: '900',
        },

        search: {
            height: 43,

            borderRadius: 14,

            backgroundColor:
                '#202a40',

            color: '#ffffff',

            paddingHorizontal: 13,

            marginTop: 12,
        },

        filters: {
            gap: 7,

            paddingVertical: 10,
        },

        filterButton: {
            paddingHorizontal: 11,

            paddingVertical: 7,

            borderRadius: 13,

            backgroundColor:
                '#202a40',
        },

        filterActive: {
            backgroundColor:
                '#ff659e',
        },

        filterText: {
            color: '#a8b2c1',

            fontSize: 16,

            fontWeight: '700',
        },

        filterTextActive: {
            color: '#ffffff',
        },

        list: {
            flex: 1,
        },

        listContent: {
            gap: 10,

            paddingBottom: 20,
        },

        card: {
            padding: 14,

            borderRadius: 17,

            backgroundColor:
                '#202a40',

            borderWidth: 1,

            borderColor:
                '#2d3951',
        },

        cardTop: {
            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
                'space-between',
        },

        categoryBadge: {
            paddingHorizontal: 7,

            paddingVertical: 3,

            borderRadius: 7,
        },

        lifeBadge: {
            backgroundColor:
                '#00a97b',
        },

        workBadge: {
            backgroundColor:
                '#6657e8',
        },

        categoryText: {
            color: '#ffffff',

            fontSize: 15,

            fontWeight: '900',
        },

        score: {
            color: '#ffd75e',

            fontSize: 17,

            fontWeight: '900',
        },

        cardTitle: {
            color: '#ffffff',

            fontSize: 15,

            fontWeight: '900',

            marginTop: 8,
        },

        cardVi: {
            color: '#9ba6b6',

            fontSize: 16,

            marginTop: 2,
        },

        location: {
            color: '#748094',

            fontSize: 15,

            marginTop: 7,
        },

        cardFooter: {
            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
                'space-between',

            marginTop: 10,
        },

        date: {
            color: '#6f7b8f',

            fontSize: 15,
        },

        masteryRow: {
            flexDirection: 'row',

            alignItems: 'center',

            gap: 6,
        },

        mastery: {
            fontSize: 15,

            fontWeight: '900',
        },

        review: {
            color: '#ff9b52',
        },

        mastered: {
            color: '#00d493',
        },

        newStatus: {
            color: '#5aa7ff',
        },

        empty: {
            padding: 30,

            alignItems: 'center',
        },

        emptyText: {
            color: '#8792a3',
        },
        metrics: {
            flexDirection:
                'row',

            gap:
                6,

            marginTop:
                12,
        },

        metricItem: {
            flex:
                1,

            backgroundColor:
                '#182133',

            borderRadius:
                10,

            paddingVertical:
                7,

            alignItems:
                'center',
        },

        metricValue: {
            color:
                '#ffffff',

            fontSize:
                12,

            fontWeight:
                '900',
        },

        metricLabel: {
            color:
                '#7f8ba0',

            fontSize:
                7,

            marginTop:
                2,
        },

        rewardRow: {
            flexDirection:
                'row',

            alignItems:
                'center',

            gap:
                12,

            marginTop:
                10,
        },

        rewardText: {
            color:
                '#ffd75e',

            fontSize:
                9,

            fontWeight:
                '800',
        },

        answerRevealText: {
            color:
                '#ff8e8e',

            fontSize:
                8,

            fontWeight:
                '800',
        },
    });
