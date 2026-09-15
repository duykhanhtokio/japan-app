import {
    router,
} from 'expo-router';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import BottomNav from '@/components/app/BottomNav';
import GameHeader from '@/components/app/GameHeader';

import {
    useUserProfile,
} from '@/hooks/useUserProfile';

import {
    useAppLanguage,
} from '@/context/LanguageContext';

import {
    getResolvedWorkProfile,
} from '@/services/work-profile';

import {
    getDailyWorkMission,
} from '@/data/work-missions';

type TasksCopy = {
    title: string;

    subtitle: string;

    daily: string;

    dailySub: string;

    weekly: string;

    weeklySub: string;

    monthly: string;

    monthlySub: string;

    work: string;

    workDescription: string;

    todayWork: string;

    reward: string;

    noWork: string;

    goldenText: string;
};

const taskCopies:
    Record<
        string,
        TasksCopy
    > = {
    ja: {
        title:
            'ミッション',

        subtitle:
            'ミッションを達成して報酬とゴールデンキーを獲得しよう',

        daily:
            'デイリーミッション',

        dailySub:
            '毎日のミッション',

        weekly:
            '週間ミッション',

        weeklySub:
            '週間チャレンジ',

        monthly:
            '月間チャレンジ',

        monthlySub:
            '月間チャレンジ',

        work:
            '仕事会話',

        workDescription:
            '登録した仕事内容に合わせて仕事会話が個別に設定されます。',

        todayWork:
            '今日の仕事ミッション',

        reward:
            '報酬',

        noWork:
            '仕事内容が登録されていません。',

        goldenText:
            'City完成 + Weekly + Monthly + Work Mission',
    },

    vi: {
        title:
            'Nhiệm vụ',

        subtitle:
            'Hoàn thành nhiệm vụ để nhận thưởng và Golden Key',

        daily:
            'Nhiệm vụ hằng ngày',

        dailySub:
            'Daily Missions',

        weekly:
            'Nhiệm vụ tuần',

        weeklySub:
            'Weekly Missions',

        monthly:
            'Thử thách tháng',

        monthlySub:
            'Monthly Challenge',

        work:
            'Hội thoại công việc',

        workDescription:
            'Nội dung hội thoại được cá nhân hóa theo chính công việc bạn đã đăng ký.',

        todayWork:
            'Nhiệm vụ công việc hôm nay',

        reward:
            'Phần thưởng',

        noWork:
            'Bạn chưa đăng ký công việc.',

        goldenText:
            'Hoàn thành City + Weekly + Monthly + Work Mission',
    },

    en: {
        title:
            'Missions',

        subtitle:
            'Complete missions to earn rewards and Golden Keys',

        daily:
            'Daily Missions',

        dailySub:
            'Daily Missions',

        weekly:
            'Weekly Missions',

        weeklySub:
            'Weekly Challenge',

        monthly:
            'Monthly Challenge',

        monthlySub:
            'Monthly Challenge',

        work:
            'Work Conversation',

        workDescription:
            'Work conversations are personalized according to your registered occupation.',

        todayWork:
            'Today’s Work Mission',

        reward:
            'Reward',

        noWork:
            'No occupation has been registered.',

        goldenText:
            'City + Weekly + Monthly + Work Mission',
    },

    id: {
        title:
            'Misi',

        subtitle:
            'Selesaikan misi untuk mendapatkan hadiah dan Golden Key',

        daily:
            'Misi Harian',

        dailySub:
            'Daily Missions',

        weekly:
            'Misi Mingguan',

        weeklySub:
            'Weekly Missions',

        monthly:
            'Tantangan Bulanan',

        monthlySub:
            'Monthly Challenge',

        work:
            'Percakapan Kerja',

        workDescription:
            'Percakapan kerja disesuaikan dengan pekerjaan yang Anda daftarkan.',

        todayWork:
            'Misi Kerja Hari Ini',

        reward:
            'Hadiah',

        noWork:
            'Pekerjaan belum didaftarkan.',

        goldenText:
            'City + Weekly + Monthly + Work Mission',
    },

    'zh-CN': {
        title:
            '任务',

        subtitle:
            '完成任务即可获得奖励和黄金钥匙',

        daily:
            '每日任务',

        dailySub:
            'Daily Missions',

        weekly:
            '每周任务',

        weeklySub:
            'Weekly Missions',

        monthly:
            '每月挑战',

        monthlySub:
            'Monthly Challenge',

        work:
            '工作会话',

        workDescription:
            '工作会话会根据您登记的职业进行个性化设置。',

        todayWork:
            '今天的工作任务',

        reward:
            '奖励',

        noWork:
            '尚未登记工作信息。',

        goldenText:
            '完成城市 + 周任务 + 月任务 + 工作任务',
    },
};

export default function TasksScreen() {
    const {
        profile,
        loading,
    } =
        useUserProfile();

    const {
        language,
    } =
        useAppLanguage();

    const copy =
        taskCopies[
        language
        ] ??
        taskCopies.en;

    const workProfile =
        getResolvedWorkProfile(
            profile,
            language
        );

    const workMission =
        workProfile
            ? getDailyWorkMission(
                workProfile.operationCode,
                language
            )
            : null;

    if (loading) {
        return (
            <SafeAreaView
                style={
                    styles.container
                }
            >
                <View
                    style={
                        styles.loading
                    }
                >
                    <Text
                        style={
                            styles.loadingText
                        }
                    >
                        ...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

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
                <GameHeader />

                <Text
                    style={
                        styles.title
                    }
                >
                    {copy.title}
                </Text>

                <Text
                    style={
                        styles.subtitle
                    }
                >
                    {
                        copy.subtitle
                    }
                </Text>

                <ScrollView
                    contentContainerStyle={
                        styles.scroll
                    }
                    showsVerticalScrollIndicator={
                        false
                    }
                >
                    <MissionSection
                        icon="☀️"
                        title={
                            copy.daily
                        }
                        subtitle={
                            copy.dailySub
                        }
                        progress="2 / 4"
                        items={[
                            '会話練習 ×1',
                            '単語 ×10',
                            '🌱 Water Farm',
                            '🌾 Harvest ×3',
                        ]}
                    />

                    <MissionSection
                        icon="📅"
                        title={
                            copy.weekly
                        }
                        subtitle={
                            copy.weeklySub
                        }
                        progress="3 / 5"
                        items={[
                            '会話練習 ×5',
                            '筆記学習 ×5',
                            'Location ×3',
                            'Harvest ×30',
                            'Login ×5',
                        ]}
                    />

                    <MissionSection
                        icon="🏆"
                        title={
                            copy.monthly
                        }
                        subtitle={
                            copy.monthlySub
                        }
                        progress="2 / 6"
                        items={[
                            'Speaking ×20',
                            'Writing ×20',
                            'Vocabulary ×100',
                            'Kanji ×10',
                            'Locations ×10',
                            'Weekly ×3',
                        ]}
                    />

                    {/* =========================
                        WORK MISSION
                    ========================== */}

                    <View
                        style={
                            styles.workCard
                        }
                    >
                        <View
                            style={
                                styles.workHeader
                            }
                        >
                            <Text
                                style={
                                    styles.workIcon
                                }
                            >
                                {workProfile?.groupIcon ??
                                    '💼'}
                            </Text>

                            <View
                                style={
                                    styles.workHeaderContent
                                }
                            >
                                <Text
                                    style={
                                        styles.workTitle
                                    }
                                >
                                    {copy.work}
                                </Text>

                                {workProfile && (
                                    <>
                                        <Text
                                            style={
                                                styles.workLocalized
                                            }
                                        >
                                            {
                                                workProfile.operationLocalized
                                            }
                                        </Text>

                                        {language !==
                                            'ja' && (
                                                <Text
                                                    style={
                                                        styles.workJapanese
                                                    }
                                                >
                                                    {
                                                        workProfile.operationJa
                                                    }
                                                </Text>
                                            )}
                                    </>
                                )}
                            </View>
                        </View>

                        <Text
                            style={
                                styles.workDescription
                            }
                        >
                            {
                                copy.workDescription
                            }
                        </Text>

                        {workMission ? (
                            <Pressable
                                style={({
                                    pressed,
                                }) => [
                                        styles.workMission,

                                        pressed &&
                                        styles.pressed,
                                    ]}
                                onPress={() => {
                                    if (
                                        !workProfile
                                    ) {
                                        return;
                                    }

                                    router.push(
                                        `/game/work/${workProfile.operationCode}` as any
                                    );
                                }}

                            >
                                <View
                                    style={
                                        styles.workMissionTop
                                    }
                                >
                                    <Text
                                        style={
                                            styles.workMissionLabel
                                        }
                                    >
                                        {
                                            copy.todayWork
                                        }
                                    </Text>

                                    <Text
                                        style={
                                            styles.workMissionProgress
                                        }
                                    >
                                        0 / 1
                                    </Text>
                                </View>

                                <Text
                                    style={
                                        styles.workMissionTitle
                                    }
                                >
                                    {
                                        workMission.localizedTitle
                                    }
                                </Text>

                                {language !==
                                    'ja' && (
                                        <Text
                                            style={
                                                styles.workMissionJapanese
                                            }
                                        >
                                            {
                                                workMission.titleJa
                                            }
                                        </Text>
                                    )}


                                <Text
                                    style={
                                        styles.workMissionDescription
                                    }
                                >
                                    {
                                        workMission.localizedDescription
                                    }
                                </Text>


                                <View
                                    style={
                                        styles.rewardRow
                                    }
                                >
                                    <Text
                                        style={
                                            styles.rewardLabel
                                        }
                                    >
                                        {
                                            copy.reward
                                        }
                                    </Text>

                                    <Text
                                        style={
                                            styles.rewardValue
                                        }
                                    >
                                        +
                                        {
                                            workMission.rewardXp
                                        }{' '}
                                        XP
                                        {'  '}
                                        +
                                        {
                                            workMission.rewardCoins
                                        }{' '}
                                        🪙
                                    </Text>
                                </View>
                            </Pressable>
                        ) : (
                            <View
                                style={
                                    styles.noWork
                                }
                            >
                                <Text
                                    style={
                                        styles.noWorkText
                                    }
                                >
                                    {
                                        copy.noWork
                                    }
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* GOLDEN KEY */}

                    <View
                        style={
                            styles.goldenCard
                        }
                    >
                        <Text
                            style={
                                styles.goldenKey
                            }
                        >
                            🗝️
                        </Text>

                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            <Text
                                style={
                                    styles.goldenTitle
                                }
                            >
                                GOLDEN KEY
                            </Text>

                            <Text
                                style={
                                    styles.goldenText
                                }
                            >
                                {
                                    copy.goldenText
                                }
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.goldenLock
                            }
                        >
                            🔒
                        </Text>
                    </View>
                </ScrollView>
            </View>

            <BottomNav
                active="tasks"
            />
        </SafeAreaView>
    );
}

function MissionSection({
    icon,
    title,
    subtitle,
    progress,
    items,
}: {
    icon: string;

    title: string;

    subtitle: string;

    progress: string;

    items: string[];
}) {
    return (
        <View
            style={
                styles.section
            }
        >
            <View
                style={
                    styles.sectionHeader
                }
            >
                <Text
                    style={
                        styles.sectionIcon
                    }
                >
                    {icon}
                </Text>

                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        {title}
                    </Text>

                    <Text
                        style={
                            styles.sectionSubtitle
                        }
                    >
                        {subtitle}
                    </Text>
                </View>

                <Text
                    style={
                        styles.sectionProgress
                    }
                >
                    {progress}
                </Text>
            </View>

            {items.map(
                (
                    item,
                    index
                ) => (
                    <View
                        key={
                            `${item}-${index}`
                        }
                        style={
                            styles.taskRow
                        }
                    >
                        <View
                            style={[
                                styles.checkbox,

                                index <
                                2 &&
                                styles.checkboxDone,
                            ]}
                        >
                            <Text
                                style={
                                    styles.check
                                }
                            >
                                {index <
                                    2
                                    ? '✓'
                                    : ''}
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.taskText
                            }
                        >
                            {item}
                        </Text>
                    </View>
                )
            )}
        </View>
    );
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,

            backgroundColor:
                '#111827',
        },

        content: {
            flex: 1,

            paddingHorizontal:
                18,
        },

        loading: {
            flex: 1,

            alignItems:
                'center',

            justifyContent:
                'center',
        },

        loadingText: {
            color:
                '#ffffff',
        },

        pressed: {
            opacity: 0.65,
        },

        title: {
            color:
                '#ffffff',

            fontSize: 28,

            fontWeight:
                '900',

            marginTop: 12,
        },

        subtitle: {
            color:
                '#aeb7c5',

            fontSize: 16,

            marginTop: 3,
        },

        scroll: {
            paddingTop: 14,

            paddingBottom:
                25,

            gap: 12,
        },

        section: {
            borderRadius:
                18,

            padding: 14,

            backgroundColor:
                '#202a40',
        },

        sectionHeader: {
            flexDirection:
                'row',

            alignItems:
                'center',

            marginBottom:
                12,
        },

        sectionIcon: {
            fontSize: 25,

            width: 42,
        },

        sectionTitle: {
            color:
                '#ffffff',

            fontSize: 15,

            fontWeight:
                '900',
        },

        sectionSubtitle: {
            color:
                '#8995a6',

            fontSize: 15,

            marginTop: 2,
        },

        sectionProgress: {
            color:
                '#ff72ab',

            fontSize: 15,

            fontWeight:
                '900',
        },

        taskRow: {
            minHeight: 37,

            flexDirection:
                'row',

            alignItems:
                'center',
        },

        checkbox: {
            width: 20,

            height: 20,

            borderRadius: 6,

            borderWidth: 1,

            borderColor:
                '#5a6578',

            alignItems:
                'center',

            justifyContent:
                'center',

            marginRight: 10,
        },

        checkboxDone: {
            backgroundColor:
                '#00b982',

            borderColor:
                '#00b982',
        },

        check: {
            color:
                '#ffffff',

            fontSize: 16,

            fontWeight:
                '900',
        },

        taskText: {
            color:
                '#dce1e8',

            fontSize: 16,
        },

        /*
         * WORK
         */

        workCard: {
            padding: 16,

            borderRadius:
                19,

            backgroundColor:
                '#2a2546',

            borderWidth: 1,

            borderColor:
                '#6558f5',
        },

        workHeader: {
            flexDirection:
                'row',

            alignItems:
                'center',
        },

        workIcon: {
            fontSize: 34,

            width: 50,
        },

        workHeaderContent: {
            flex: 1,
        },

        workTitle: {
            color:
                '#ffffff',

            fontSize: 18,

            fontWeight:
                '900',
        },

        workLocalized: {
            color:
                '#d7d3ff',

            fontSize: 16,

            fontWeight:
                '800',

            marginTop: 3,
        },

        workJapanese: {
            color:
                '#8f8aa8',

            fontSize: 15,

            marginTop: 2,
        },

        workDescription: {
            color:
                '#b9b4d2',

            fontSize: 16,

            lineHeight: 14,

            marginTop: 11,
        },

        workMission: {
            marginTop: 13,

            padding: 13,

            borderRadius:
                14,

            backgroundColor:
                'rgba(255,255,255,0.07)',

            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.08)',
        },

        workMissionTop: {
            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'space-between',
        },

        workMissionLabel: {
            color:
                '#ffcf59',

            fontSize: 15,

            fontWeight:
                '900',
        },

        workMissionProgress: {
            color:
                '#ffffff',

            fontSize: 16,

            fontWeight:
                '900',
        },

        workMissionTitle: {
            color:
                '#ffffff',

            fontSize: 16,

            fontWeight:
                '900',

            marginTop: 7,
        },

        workMissionJapanese: {
            color:
                '#9994ad',

            fontSize: 16,

            marginTop: 3,
        },

        workMissionDescription: {
            color:
                '#b8b3ca',

            fontSize: 16,

            lineHeight: 14,

            marginTop: 6,
        },

        rewardRow: {
            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'space-between',

            marginTop: 11,

            paddingTop: 9,

            borderTopWidth: 1,

            borderTopColor:
                'rgba(255,255,255,0.08)',
        },

        rewardLabel: {
            color:
                '#8f899f',

            fontSize: 15,
        },

        rewardValue: {
            color:
                '#ffd75e',

            fontSize: 16,

            fontWeight:
                '900',
        },

        noWork: {
            marginTop: 13,

            padding: 14,

            borderRadius:
                13,

            backgroundColor:
                'rgba(255,255,255,0.05)',
        },

        noWorkText: {
            color:
                '#918ca5',

            fontSize: 16,
        },

        /*
         * GOLDEN KEY
         */

        goldenCard: {
            flexDirection:
                'row',

            alignItems:
                'center',

            padding: 15,

            borderRadius:
                18,

            backgroundColor:
                '#43351b',

            borderWidth: 1,

            borderColor:
                '#d8a72d',
        },

        goldenKey: {
            fontSize: 34,

            marginRight: 12,
        },

        goldenTitle: {
            color:
                '#ffd75e',

            fontSize: 15,

            fontWeight:
                '900',
        },

        goldenText: {
            color:
                '#cbbf9d',

            fontSize: 15,

            marginTop: 3,
        },

        goldenLock: {
            fontSize: 18,
        },
    });