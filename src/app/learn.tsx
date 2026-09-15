import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import BottomNav from '@/components/app/BottomNav';
import GameHeader from '@/components/app/GameHeader';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';
import { getGameProgress } from '@/services/progress-storage';
import { getJlptProgress } from '@/services/jlpt-progress-storage';
import { generatedGrammar, generatedVocabulary } from '@/data/jlpt-learning';

type LevelItem = {
    level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

    titleJa: string;
    titleEn: string;
    titleVi: string;

    requirement: string;

    progressText: string;

    progressPercent: number;

    unlocked: boolean;

    accentColor: string;
};

const levels: LevelItem[] = [
    {
        level: 'N5',

        titleJa: '初級',
        titleEn: 'Beginner',
        titleVi: 'Tiếng Nhật nhập môn',

        requirement:
            'Đã hoàn thành 12 / 24 bài học',

        progressText:
            '12 / 24',

        progressPercent: 50,

        unlocked: true,

        accentColor: '#50745c',
    },

    {
        level: 'N4',

        titleJa: '初中級',
        titleEn: 'Elementary',
        titleVi: 'Tiếng Nhật sơ cấp',

        requirement:
            'Yêu cầu đạt 500 XP',

        progressText:
            '0 / 30',

        progressPercent: 0,

        unlocked: true,

        accentColor: '#50745c',
    },

    {
        level: 'N3',

        titleJa: '中級',
        titleEn: 'Intermediate',
        titleVi: 'Tiếng Nhật trung cấp',

        requirement:
            'Yêu cầu đạt 2,000 XP',

        progressText:
            '0 / 40',

        progressPercent: 0,

        unlocked: true,

        accentColor: '#50745c',
    },

    {
        level: 'N2',

        titleJa: '中上級',
        titleEn: 'Pre-Advanced',
        titleVi: 'Tiếng Nhật trung cao cấp',

        requirement:
            'Yêu cầu đạt 5,000 XP',

        progressText:
            '0 / 45',

        progressPercent: 0,

        unlocked: true,

        accentColor: '#50745c',
    },

    {
        level: 'N1',

        titleJa: '上級',
        titleEn: 'Advanced',
        titleVi: 'Tiếng Nhật cao cấp',

        requirement:
            'Yêu cầu đạt 10,000 XP',

        progressText:
            '0 / 50',

        progressPercent: 0,

        unlocked: true,

        accentColor: '#9f7aea',
    },
];

export default function LearnScreen() {
    const [runtimeLevels, setRuntimeLevels] = useState(levels);
    const [stats, setStats] = useState({ xp: 0, coins: 0, diamonds: 0 });

    useEffect(() => {
        void Promise.all([getGameProgress(), getJlptProgress()]).then(([game, learning]) => {
            setStats({ xp: game.stats.xp, coins: game.stats.coins, diamonds: game.stats.diamonds });
            setRuntimeLevels(levels.map((item) => {
                const levelIds = new Set([
                    ...generatedVocabulary.filter((entry) => entry.jlpt === item.level).map((entry) => entry.id),
                    ...generatedGrammar.filter((entry) => entry.jlpt === item.level).map((entry) => entry.id),
                ]);
                const completed = learning.learnedIds.filter((id) => levelIds.has(id) || (item.level === 'N5' && id.startsWith('kana:'))).length;
                const total = Number(item.progressText.split('/')[1]?.trim()) || 1;
                return {
                    ...item,
                    unlocked: true,
                    progressText: `${Math.min(completed, total)} / ${total}`,
                    progressPercent: Math.min(100, Math.round((completed / total) * 100)),
                    requirement: `Miễn phí • ${completed} nội dung đã hoàn thành`,
                };
            }));
        });
    }, []);
    function openLevel(
        item: LevelItem
    ) {
        if (!item.unlocked) {
            return;
        }

        router.push(
            `/${item.level}`
        );
    }

    return (
        <View style={styles.background}>
            <View
                pointerEvents="none"
                style={styles.overlay}
            />

            <SafeAreaView
                style={styles.container}
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
                    {/* HEADER */}

                    <GameHeader
                        name="Haruto"
                        level={12}
                        xpCurrent={stats.xp}
                        xpMax={5000}
                        coins={stats.coins}
                        diamonds={stats.diamonds}
                    />

                    {/* BACK */}

                    <RoyalBackButton onPress={() => router.back()} />

                    {/* TITLE */}

                    <View
                        style={
                            styles.headingArea
                        }
                    >
                        <Text
                            style={
                                styles.heading
                            }
                        >
                            JLPT 学習
                        </Text>

                        <Text
                            style={
                                styles.headingVi
                            }
                        >
                            Hành trình chinh phục JLPT
                        </Text>
                    </View>

                    {/* TOTAL PROGRESS */}

                    <View
                        style={
                            styles.totalProgressCard
                        }
                    >
                        <View
                            style={
                                styles.totalProgressTop
                            }
                        >
                            <Text
                                style={
                                    styles.totalProgressTitle
                                }
                            >
                                TOTAL PROGRESS
                            </Text>

                            <Text
                                style={
                                    styles.totalProgressXp
                                }
                            >
                                {stats.xp.toLocaleString()} / 5,000 XP
                            </Text>
                        </View>

                        <View
                            style={
                                styles.totalProgressTrack
                            }
                        >
                            <View
                                style={
                                    styles.totalProgressFill
                                }
                            />
                        </View>

                        <Text
                            style={
                                styles.totalProgressNote
                            }
                        >
                            N5 đang được mở
                        </Text>
                    </View>

                    {/* LEVEL LIST */}

                    <ScrollView
                        style={
                            styles.scroll
                        }
                        contentContainerStyle={
                            styles.levelList
                        }
                        showsVerticalScrollIndicator={
                            false
                        }
                    >
                        {runtimeLevels.map(
                            (
                                item
                            ) => (
                                <Pressable
                                    key={
                                        item.level
                                    }
                                    disabled={
                                        !item.unlocked
                                    }
                                    style={({
                                        pressed,
                                    }) => [
                                            styles.levelCard,

                                            item.unlocked
                                                ? styles.levelCardUnlocked
                                                : styles.levelCardLocked,

                                            pressed &&
                                            item.unlocked &&
                                            styles.pressed,
                                        ]}
                                    onPress={() =>
                                        openLevel(
                                            item
                                        )
                                    }
                                >
                                    {/* LEVEL BADGE */}

                                    <View
                                        style={[
                                            styles.levelBadge,

                                            {
                                                backgroundColor:
                                                    item.unlocked
                                                        ? item.accentColor
                                                        : 'rgba(255,255,255,0.10)',
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={
                                                styles.levelBadgeText
                                            }
                                        >
                                            {
                                                item.level
                                            }
                                        </Text>
                                    </View>

                                    {/* CONTENT */}

                                    <View
                                        style={
                                            styles.levelContent
                                        }
                                    >
                                        <View
                                            style={
                                                styles.levelTitleRow
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.levelTitleJa
                                                }
                                            >
                                                {
                                                    item.titleJa
                                                }
                                            </Text>

                                            <Text
                                                style={
                                                    styles.levelTitleEn
                                                }
                                            >
                                                {
                                                    item.titleEn
                                                }
                                            </Text>
                                        </View>

                                        <Text
                                            style={
                                                styles.levelTitleVi
                                            }
                                        >
                                            {
                                                item.titleVi
                                            }
                                        </Text>

                                        {/* PROGRESS */}

                                        <View
                                            style={
                                                styles.levelProgressRow
                                            }
                                        >
                                            <View
                                                style={
                                                    styles.levelProgressTrack
                                                }
                                            >
                                                <View
                                                    style={[
                                                        styles.levelProgressFill,

                                                        {
                                                            width: `${item.progressPercent}%`,
                                                            backgroundColor:
                                                                item.accentColor,
                                                        },
                                                    ]}
                                                />
                                            </View>

                                            <Text
                                                style={
                                                    styles.levelProgressText
                                                }
                                            >
                                                {
                                                    item.progressText
                                                }
                                            </Text>
                                        </View>

                                        <Text
                                            style={
                                                styles.requirement
                                            }
                                        >
                                            {
                                                item.requirement
                                            }
                                        </Text>
                                    </View>

                                    {/* RIGHT SIDE */}

                                    <View
                                        style={
                                            styles.rightArea
                                        }
                                    >
                                        {item.unlocked ? (
                                            <>
                                                <View
                                                    style={
                                                        styles.openBadge
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.openBadgeText
                                                        }
                                                    >
                                                        OPEN
                                                    </Text>
                                                </View>

                                                <Text
                                                    style={
                                                        styles.arrow
                                                    }
                                                >
                                                    ›
                                                </Text>
                                            </>
                                        ) : (
                                            <Text
                                                style={
                                                    styles.lock
                                                }
                                            >
                                                🔒
                                            </Text>
                                        )}
                                    </View>
                                </Pressable>
                            )
                        )}
                    </ScrollView>
                </View>

                <BottomNav active="home" />
            </SafeAreaView>
        </View>
    );
}

const styles =
    StyleSheet.create({
        background: {
            flex: 1,
            backgroundColor: '#e8e2d6',
        },

        overlay: {
            position: 'absolute',

            top: 0,
            right: 0,
            bottom: 0,
            left: 0,

            backgroundColor:
                '#e8e2d6',
        },

        container: {
            flex: 1,
        },

        content: {
            flex: 1,

            paddingHorizontal: 18,
        },

        pressed: {
            opacity: 0.68,

            transform: [
                {
                    scale: 0.985,
                },
            ],
        },

        /*
         * BACK
         */

        backButton: {
            width: 40,
            height: 40,

            borderRadius: 20,

            backgroundColor:
                'rgba(255,255,255,0.13)',

            alignItems: 'center',
            justifyContent: 'center',

            marginTop: 6,
        },

        backText: {
            color: '#24231f',

            fontSize: 24,
            fontWeight: '700',
        },

        /*
         * HEADING
         */

        headingArea: {
            marginTop: 8,
        },

        heading: {
            color: '#24231f',

            fontSize: 28,
            fontWeight: '900',

            textShadowColor:
                'rgba(0,0,0,0.40)',

            textShadowOffset: {
                width: 0,
                height: 2,
            },

            textShadowRadius: 4,
        },

        headingVi: {
            color: '#625f57',

            fontSize: 15,

            marginTop: 3,
        },

        /*
         * TOTAL PROGRESS
         */

        totalProgressCard: {
            marginTop: 14,

            padding: 14,

            borderRadius: 17,

            backgroundColor:
                '#e8e2d6',

            borderWidth: 1,

            borderColor:
                '#b8b1a5',
        },

        totalProgressTop: {
            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
                'space-between',
        },

        totalProgressTitle: {
            color: '#50745c',

            fontSize: 16,
            fontWeight: '900',

            letterSpacing: 0.7,
        },

        totalProgressXp: {
            color: '#24231f',

            fontSize: 16,
            fontWeight: '800',
        },

        totalProgressTrack: {
            height: 7,

            borderRadius: 4,

            marginTop: 10,

            backgroundColor:
                '#b8b1a5',

            overflow: 'hidden',
        },

        totalProgressFill: {
            width: '28.4%',
            height: '100%',

            borderRadius: 4,

            backgroundColor:
                '#50745c',
        },

        totalProgressNote: {
            color: '#625f57',

            fontSize: 16,

            marginTop: 6,
        },

        /*
         * LIST
         */

        scroll: {
            flex: 1,

            marginTop: 14,
        },

        levelList: {
            gap: 12,

            paddingBottom: 22,
        },

        levelCard: {
            minHeight: 102,

            borderRadius: 20,

            padding: 13,

            flexDirection: 'row',

            alignItems: 'center',
        },

        levelCardUnlocked: {
            backgroundColor:
                '#e8e2d6',

            borderWidth: 2,

            borderColor:
                '#78917d',
        },

        levelCardLocked: {
            backgroundColor:
                '#e8e2d6',

            borderWidth: 1,

            borderColor:
                '#b8b1a5',

            opacity: 0.48,
        },

        /*
         * LEVEL BADGE
         */

        levelBadge: {
            width: 62,
            height: 62,

            borderRadius: 18,

            alignItems: 'center',
            justifyContent: 'center',

            marginRight: 13,

            shadowColor: '#000000',

            shadowOpacity: 0.18,

            shadowRadius: 6,

            shadowOffset: {
                width: 0,
                height: 3,
            },

            elevation: 4,
        },

        levelBadgeText: {
            color: '#e8e2d6',

            fontSize: 23,
            fontWeight: '900',
        },

        /*
         * LEVEL CONTENT
         */

        levelContent: {
            flex: 1,
            minWidth: 0,
        },

        levelTitleRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        levelTitleJa: {
            color: '#24231f',

            fontSize: 17,
            fontWeight: '900',
        },

        levelTitleEn: {
            color:
                '#625f57',

            fontSize: 16,

            fontWeight: '700',

            marginLeft: 7,
        },

        levelTitleVi: {
            color:
                '#625f57',

            fontSize: 16,

            marginTop: 2,
        },

        /*
         * LEVEL PROGRESS
         */

        levelProgressRow: {
            flexDirection: 'row',

            alignItems: 'center',

            marginTop: 8,
        },

        levelProgressTrack: {
            flex: 1,

            height: 5,

            borderRadius: 3,

            backgroundColor:
                '#b8b1a5',

            overflow: 'hidden',
        },

        levelProgressFill: {
            height: '100%',

            borderRadius: 3,
        },

        levelProgressText: {
            color:
                '#625f57',

            fontSize: 16,

            fontWeight: '800',

            marginLeft: 7,
        },

        requirement: {
            color:
                '#625f57',

            fontSize: 15,

            marginTop: 5,
        },

        /*
         * RIGHT AREA
         */

        rightArea: {
            width: 46,

            alignItems: 'center',

            marginLeft: 6,
        },

        openBadge: {
            backgroundColor:
                '#50745c',

            paddingHorizontal: 7,
            paddingVertical: 3,

            borderRadius: 7,
        },

        openBadgeText: {
            color: '#e8e2d6',

            fontSize: 15,
            fontWeight: '900',
        },

        arrow: {
            color: '#24231f',

            fontSize: 27,

            fontWeight: '300',

            marginTop: 4,
        },

        lock: {
            fontSize: 18,
        },
    });
