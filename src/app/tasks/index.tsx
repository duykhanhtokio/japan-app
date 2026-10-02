import RoyalPageBackground from '@/components/ui/RoyalPageBackground';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    type ImageSourcePropType,
} from 'react-native';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import BottomNav from '@/components/app/BottomNav';
import GameHeader from '@/components/app/GameHeader';
import { ROYAL, ROYAL_FONT, ROYAL_LAYOUT, ROYAL_TYPE } from '@/components/ui/RoyalSurface';

import {
    useUserProfile,
} from '@/hooks/useUserProfile';
import { useGameProgress } from '@/hooks/useGameProgress';
import { RANKS, type LearningEconomy } from '@/services/learning-economy';
import { syncJlptQualification } from '@/services/sync-jlpt-qualification';

import {
    useAppLanguage,
} from '@/context/LanguageContext';

import {
    getResolvedWorkProfile,
} from '@/services/work-profile';

import {
    getDailyWorkMission,
} from '@/data/work-missions';

const MISSION_ICONS = {
    daily: require('../../../assets/app/ui/royal-af/nav-mission-v1.png'),
    weekly: require('../../../assets/app/ui/royal-af/checkmark-v2.png'),
    monthly: require('../../../assets/app/ui/royal-af/mission-trophy-v1.png'),
    work: require('../../../assets/app/ui/royal-af/mission-work-v1.png'),
    key: require('../../../assets/app/ui/royal-af/mission-key-v1.png'),
    coin: require('../../../assets/app/ui/royal-af/hud-coin-v1.png'),
    lock: require('../../../assets/app/ui/royal-af/lock-grape-v2.png'),
};
const PENDING_COPY: Record<string,string> = {ja:'準備中',vi:'Đang chuẩn bị',en:'Coming soon',id:'Segera hadir','zh-CN':'准备中'};

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
    const [economy,setEconomy]=useState<LearningEconomy|null>(null);
    useFocusEffect(useCallback(()=>{let active=true;void syncJlptQualification().then(value=>{if(active)setEconomy(value)}).catch(error=>console.log('Load Mission HUD error:',error));return()=>{active=false}},[]));
    const { progress } = useGameProgress();
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
            <RoyalPageBackground><SafeAreaView
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
            </SafeAreaView></RoyalPageBackground>
        );
    }

    return (
        <RoyalPageBackground><SafeAreaView
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
                <GameHeader variant="approved" name={profile.name?.trim() || 'プレイヤー'} abilityLevel={economy?.officialRank??'N5'} abilityTarget={economy?.officialRank?RANKS[RANKS.indexOf(economy.officialRank)+1]??economy.officialRank:'N5'} qualifiedExams={Object.fromEntries(RANKS.map(rank=>[rank,Object.keys(economy?.passed[rank]??{}).length]))} conversationCredits={economy?.credits??100} coins={progress.stats.coins} />

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
                        icon={MISSION_ICONS.daily}
                        title={
                            copy.daily
                        }
                        subtitle={
                            copy.dailySub
                        }
                        progress={PENDING_COPY[language]??PENDING_COPY.en}
                        items={[
                            '会話練習 ×1',
                            '単語 ×10',
                            'Water Farm',
                            'Harvest ×3',
                        ]}
                    />

                    <MissionSection
                        icon={MISSION_ICONS.weekly}
                        title={
                            copy.weekly
                        }
                        subtitle={
                            copy.weeklySub
                        }
                        progress={PENDING_COPY[language]??PENDING_COPY.en}
                        items={[
                            '会話練習 ×5',
                            '筆記学習 ×5',
                            'Location ×3',
                            'Harvest ×30',
                            'Login ×5',
                        ]}
                    />

                    <MissionSection
                        icon={MISSION_ICONS.monthly}
                        title={
                            copy.monthly
                        }
                        subtitle={
                            copy.monthlySub
                        }
                        progress={PENDING_COPY[language]??PENDING_COPY.en}
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
                            <Image source={MISSION_ICONS.work} resizeMode="contain" style={styles.workIcon} accessibilityLabel="仕事会話" />

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

                                    <View style={styles.rewardAmount}>
                                        <Text style={styles.rewardValue}>+{workMission.rewardXp} XP　+{workMission.rewardCoins}</Text>
                                        <Image source={MISSION_ICONS.coin} resizeMode="contain" style={styles.rewardCoin} accessibilityLabel="コイン" />
                                    </View>
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
                        <Image source={MISSION_ICONS.key} resizeMode="contain" style={styles.goldenKey} accessibilityLabel="ゴールデンキー" />

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

                        <Image source={MISSION_ICONS.lock} resizeMode="contain" style={styles.goldenLock} accessibilityLabel="ロック中" />
                    </View>
                </ScrollView>
            </View>

            <BottomNav
                active="tasks"
            />
        </SafeAreaView></RoyalPageBackground>
    );
}

function MissionSection({
    icon,
    title,
    subtitle,
    progress,
    items,
}: {
    icon: ImageSourcePropType;

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
                <Image source={icon} resizeMode="contain" style={styles.sectionIcon} accessibilityLabel={title} />

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


                            ]}
                        >
                            <Text
                                style={
                                    styles.check
                                }
                            >
                                {''}
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
            backgroundColor:'transparent',
        },

        content: {
            flex: 1,
            paddingHorizontal: ROYAL_LAYOUT.screenGutter,
            paddingTop: ROYAL_LAYOUT.backSafeTop,
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
                ROYAL.lacquer,

            fontFamily: ROYAL_FONT.heading,

            fontSize: ROYAL_TYPE.pageTitle,

            fontWeight:
                '900',

            marginTop: 12,
        },

        subtitle: {
            lineHeight: ROYAL_TYPE.bodyLine,
            color:
                ROYAL.darkGold,

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

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
                ROYAL.lacquer,
            borderWidth: 1,
            borderColor: ROYAL.gold,
        },

        sectionHeader: {
            flexWrap: 'wrap',
            gap: 8,
            flexDirection:
                'row',

            alignItems:
                'center',

            marginBottom:
                12,
        },

        sectionIcon: {
            width: 38,
            height: 38,
            marginRight: 8,
        },

        sectionTitle: {
            lineHeight: ROYAL_TYPE.bodyLine,
            color:
                '#ffffff',

            fontFamily: ROYAL_FONT.heading,

            fontSize: ROYAL_TYPE.sectionTitle,

            fontWeight:
                '900',
        },

        sectionSubtitle: {
            lineHeight: ROYAL_TYPE.bodyLine,
            color:
                '#8995a6',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.caption,

            marginTop: 2,
        },

        sectionProgress: {
            color:
                ROYAL.paleGold,

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.caption,

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
                ROYAL.darkGold,

            borderColor:
                ROYAL.gold,
        },

        check: {
            color:
                '#ffffff',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            fontWeight:
                '900',
        },

        taskText: {
            flex: 1,
            minWidth: 0,
            lineHeight: ROYAL_TYPE.bodyLine,
            color:
                '#dce1e8',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,
        },

        /*
         * WORK
         */

        workCard: {
            padding: 16,

            borderRadius:
                19,

            backgroundColor:
                ROYAL.lacquer,

            borderWidth: 1,

            borderColor:
                ROYAL.gold,
        },

        workHeader: {
            flexDirection:
                'row',

            alignItems:
                'center',
        },

        workIcon: {
            width: 44,
            height: 44,
            marginRight: 6,
        },

        workHeaderContent: {
            minWidth: 0,
            flex: 1,
        },

        workTitle: {
            lineHeight: ROYAL_TYPE.bodyLine,
            color:
                '#ffffff',

            fontFamily: ROYAL_FONT.heading,

            fontSize: ROYAL_TYPE.sectionTitle,

            fontWeight:
                '900',
        },

        workLocalized: {
            color:
                ROYAL.paleGold,

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            fontWeight:
                '800',

            marginTop: 3,
        },

        workJapanese: {
            color:
                ROYAL.ivoryDeep,

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.caption,

            marginTop: 2,
        },

        workDescription: {
            color:
                ROYAL.ivory,

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            lineHeight: ROYAL_TYPE.bodyLine,

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
            flexWrap: 'wrap',
            gap: 8,
            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'space-between',
        },

        workMissionLabel: {
            lineHeight: ROYAL_TYPE.bodyLine,
            color:
                '#ffcf59',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.caption,

            fontWeight:
                '900',
        },

        workMissionProgress: {
            color:
                '#ffffff',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            fontWeight:
                '900',
        },

        workMissionTitle: {
            lineHeight: ROYAL_TYPE.bodyLine,
            color:
                '#ffffff',

            fontFamily: ROYAL_FONT.heading,

            fontSize: ROYAL_TYPE.sectionTitle,

            fontWeight:
                '900',

            marginTop: 7,
        },

        workMissionJapanese: {
            color:
                ROYAL.ivoryDeep,

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            marginTop: 3,
        },

        workMissionDescription: {
            color:
                ROYAL.ivory,

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            lineHeight: ROYAL_TYPE.bodyLine,

            marginTop: 6,
        },

        rewardRow: {
            flexWrap: 'wrap',
            gap: 8,
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

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.caption,
        },

        rewardValue: {
            color:
                '#ffd75e',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            fontWeight:
                '900',
        },
        rewardAmount: { flexDirection: 'row', alignItems: 'center', gap: 3, flexShrink: 1 },
        rewardCoin: { width: 18, height: 18 },

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

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,
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
                ROYAL.lacquer,

            borderWidth: 1,

            borderColor:
                ROYAL.gold,
        },

        goldenKey: {
            width: 42,
            height: 42,
            marginRight: 12,
        },

        goldenTitle: {
            lineHeight: ROYAL_TYPE.bodyLine,
            color:
                '#ffd75e',

            fontFamily: ROYAL_FONT.heading,

            fontSize: ROYAL_TYPE.sectionTitle,

            fontWeight:
                '900',
        },

        goldenText: {
            color:
                '#cbbf9d',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.caption,

            marginTop: 3,
        },

        goldenLock: {
            width: 24,
            height: 24,
        },
    });
