import { router } from 'expo-router';

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

import {
    getOccupation,
} from '@/data/occupations';

import {
    useGameProgress,
} from '@/hooks/useGameProgress';

import {
    useUserProfile,
} from '@/hooks/useUserProfile';

import {
    calculateCommunicationTitle,
} from '@/services/progress-engine';

export default function ProfileScreen() {
    const {
        profile,
    } =
        useUserProfile();

    const {
        progress,
    } =
        useGameProgress();

    const stats =
        progress.stats;
    const XP_PER_LEVEL =
        1000;

    const playerLevel =
        Math.floor(
            Math.max(
                0,
                stats.xp
            ) /
            XP_PER_LEVEL
        ) +
        1;

    const occupation =
        getOccupation(
            profile.occupationId
        );

    const communication =
        calculateCommunicationTitle(
            stats.speakingAccuracy,
            stats.speakingFluency,
            stats.pronunciation,
            stats.listening,
            stats.dialogueCompleted
        );

    const speakingHours =
        Math.floor(
            stats.speakingMinutes /
            60
        );

    const speakingRemainingMinutes =
        stats.speakingMinutes %
        60;

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
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={
                    styles.content
                }
                showsVerticalScrollIndicator={
                    false
                }
            >
                {/* =========================
                    PROFILE HEADER
                ========================== */}

                <View
                    style={
                        styles.profileCard
                    }
                >
                    <View
                        style={
                            styles.avatar
                        }
                    >
                        <Text
                            style={
                                styles.avatarText
                            }
                        >
                            👤
                        </Text>
                    </View>

                    <View
                        style={
                            styles.profileInfo
                        }
                    >
                        <Text
                            style={
                                styles.name
                            }
                        >
                            {profile.name ||
                                'Haruto'}
                        </Text>

                        <Text
                            style={
                                styles.profileLevel
                            }
                        >
                            LV.{playerLevel}
                            {' · '}
                            {profile.level}

                        </Text>

                        <Text
                            style={
                                styles.occupation
                            }
                        >
                            {occupation?.icon ??
                                '💼'}
                            {' '}
                            {occupation?.titleJa ??
                                'その他'}
                            {' / '}
                            {occupation?.titleVi ??
                                'Công việc khác'}
                        </Text>
                    </View>

                    <Pressable
                        style={({
                            pressed,
                        }) => [
                                styles.editButton,

                                pressed &&
                                styles.pressed,
                            ]}
                        onPress={() =>
                            router.push(
                                '/register'
                            )
                        }
                    >
                        <Text
                            style={
                                styles.editText
                            }
                        >
                            編集
                        </Text>
                    </Pressable>
                </View>

                {/* =========================
                    COMMUNICATION RATING
                ========================== */}

                <View
                    style={
                        styles.ratingCard
                    }
                >
                    <Text
                        style={
                            styles.cardLabel
                        }
                    >
                        総合コミュニケーション評価
                    </Text>

                    <Text
                        style={
                            styles.ratingTitle
                        }
                    >
                        {
                            communication.titleJa
                        }
                    </Text>

                    <Text
                        style={
                            styles.ratingVi
                        }
                    >
                        {
                            communication.titleVi
                        }
                    </Text>

                    <View
                        style={
                            styles.ratingLevelBadge
                        }
                    >
                        <Text
                            style={
                                styles.ratingLevel
                            }
                        >
                            COMMUNICATION LV.
                            {
                                communication.level
                            }
                        </Text>
                    </View>

                    <Text
                        style={
                            styles.ratingNote
                        }
                    >
                        評価は会話数だけでなく、
                        正確さ・流暢さ・発音・聴解などを
                        総合して判定します。
                    </Text>
                </View>

                {/* =========================
                    SPEAKING ABILITY
                ========================== */}

                <View
                    style={
                        styles.abilityCard
                    }
                >
                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        🗣 会話能力
                    </Text>

                    <AbilityBar
                        labelJa="正確さ"
                        labelEn="Accuracy"
                        value={
                            stats.speakingAccuracy
                        }
                    />

                    <AbilityBar
                        labelJa="流暢さ"
                        labelEn="Fluency"
                        value={
                            stats.speakingFluency
                        }
                    />

                    <AbilityBar
                        labelJa="発音"
                        labelEn="Pronunciation"
                        value={
                            stats.pronunciation
                        }
                    />

                    <AbilityBar
                        labelJa="聴解"
                        labelEn="Listening"
                        value={
                            stats.listening
                        }
                    />
                </View>

                {/* =========================
                    CONVERSATION STATS
                ========================== */}

                <StatSection
                    title="💬 会話統計"
                    rows={[
                        [
                            '生活会話',
                            `${stats.lifeDialogueCompleted}`,
                        ],

                        [
                            '仕事会話',
                            `${stats.workDialogueCompleted}`,
                        ],

                        [
                            '総会話数',
                            `${stats.dialogueCompleted}`,
                        ],

                        [
                            '会話時間',
                            `${speakingHours}h ${speakingRemainingMinutes}m`,
                        ],
                    ]}
                />

                {/* =========================
                    LEARNING STATS
                ========================== */}

                <StatSection
                    title="📚 学習統計"
                    rows={[
                        [
                            'Vocabulary',
                            `${stats.vocabularyLearned}`,
                        ],

                        [
                            'Kanji',
                            `${stats.kanjiLearned}`,
                        ],

                        [
                            'Experience',
                            `${stats.xp.toLocaleString()} XP`,
                        ],

                        [
                            'Coins',
                            `${stats.coins.toLocaleString()} 🪙`,
                        ],
                    ]}
                />

                {/* =========================
                    WORK JAPANESE
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
                            {occupation?.icon ??
                                '💼'}
                        </Text>

                        <View
                            style={
                                styles.workHeaderText
                            }
                        >
                            <Text
                                style={
                                    styles.workTitle
                                }
                            >
                                仕事日本語
                            </Text>

                            <Text
                                style={
                                    styles.workOccupation
                                }
                            >
                                {occupation?.titleJa ??
                                    'その他'}
                                {' / '}
                                {occupation?.titleVi ??
                                    ''}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={
                            styles.workStats
                        }
                    >
                        <MiniStat
                            value={
                                stats.workDialogueCompleted
                            }
                            label="仕事会話"
                        />

                        <MiniStat
                            value={5}
                            label="今月"
                        />

                        <MiniStat
                            value={1}
                            label="Weekly"
                        />
                    </View>

                    <Text
                        style={
                            styles.workDescription
                        }
                    >
                        Công việc đã đăng ký sẽ quyết định
                        nội dung hội thoại nghề nghiệp và
                        nhiệm vụ chuyên môn được hiển thị
                        trong tab ミッション.
                    </Text>
                </View>

                {/* =========================
                    JAPAN JOURNEY
                ========================== */}

                <View
                    style={
                        styles.journeyCard
                    }
                >
                    <View
                        style={
                            styles.journeyHeader
                        }
                    >
                        <View>
                            <Text
                                style={
                                    styles.sectionTitle
                                }
                            >
                                🗾 JAPAN JOURNEY
                            </Text>

                            <Text
                                style={
                                    styles.journeySubtitle
                                }
                            >
                                日本全国の学習記録
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.journeyPercent
                            }
                        >
                            3%
                        </Text>
                    </View>

                    <View
                        style={
                            styles.journeyProgressTrack
                        }
                    >
                        <View
                            style={
                                styles.journeyProgressFill
                            }
                        />
                    </View>

                    <View
                        style={
                            styles.journeyStats
                        }
                    >
                        <MiniStat
                            value={1}
                            label="City"
                        />

                        <MiniStat
                            value={5}
                            label="Stamps"
                        />

                        <MiniStat
                            value={0}
                            label="Certificates"
                        />

                        <MiniStat
                            value={0}
                            label="Golden Key"
                        />
                    </View>

                    <View
                        style={
                            styles.prefectureRow
                        }
                    >
                        <View>
                            <Text
                                style={
                                    styles.prefectureName
                                }
                            >
                                東京都
                            </Text>

                            <Text
                                style={
                                    styles.prefectureSub
                                }
                            >
                                Tokyo
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.prefectureStatus
                            }
                        >
                            進行中
                        </Text>
                    </View>

                    <View
                        style={
                            styles.prefectureRow
                        }
                    >
                        <View>
                            <Text
                                style={
                                    styles.prefectureName
                                }
                            >
                                神奈川県
                            </Text>

                            <Text
                                style={
                                    styles.prefectureSub
                                }
                            >
                                Kanagawa
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.prefectureLocked
                            }
                        >
                            🔒
                        </Text>
                    </View>
                </View>

                {/* =========================
                    CONVERSATION LOG
                ========================== */}

                <Pressable
                    style={({ pressed }) => [
                        styles.logCard,

                        pressed &&
                        styles.pressed,
                    ]}
                    onPress={() =>
                        router.push(
                            '/conversation-log'
                        )
                    }
                >
                    <View
                        style={
                            styles.logHeader
                        }
                    >
                        <View>
                            <Text
                                style={
                                    styles.cardLabel
                                }
                            >
                                📖 会話ログ
                            </Text>

                            <Text
                                style={
                                    styles.logTitle
                                }
                            >
                                Conversation Review
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.logArrow
                            }
                        >
                            ›
                        </Text>
                    </View>

                    <Text
                        style={
                            styles.logDescription
                        }
                    >
                        Xem lại hội thoại, câu trả lời đúng,
                        những câu cần ôn và nội dung đã thành thạo.
                    </Text>

                    <View
                        style={
                            styles.logStats
                        }
                    >
                        <View
                            style={
                                styles.logStat
                            }
                        >
                            <Text
                                style={
                                    styles.logStatValue
                                }
                            >
                                {
                                    stats.dialogueCompleted
                                }
                            </Text>

                            <Text
                                style={
                                    styles.logStatLabel
                                }
                            >
                                総会話
                            </Text>
                        </View>

                        <View
                            style={
                                styles.logStat
                            }
                        >
                            <Text
                                style={
                                    styles.logStatValue
                                }
                            >
                                8
                            </Text>

                            <Text
                                style={
                                    styles.logStatLabel
                                }
                            >
                                要復習
                            </Text>
                        </View>

                        <View
                            style={
                                styles.logStat
                            }
                        >
                            <Text
                                style={
                                    styles.logStatValue
                                }
                            >
                                14
                            </Text>

                            <Text
                                style={
                                    styles.logStatLabel
                                }
                            >
                                習得済み
                            </Text>
                        </View>
                    </View>

                    <View
                        style={
                            styles.logOpen
                        }
                    >
                        <Text
                            style={
                                styles.logOpenText
                            }
                        >
                            会話ログを見る
                        </Text>

                        <Text
                            style={
                                styles.logOpenArrow
                            }
                        >
                            →
                        </Text>
                    </View>
                </Pressable>

                {/* =========================
                    ACHIEVEMENTS
                ========================== */}

                <View
                    style={
                        styles.achievementCard
                    }
                >
                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        🏆 ACHIEVEMENTS
                    </Text>

                    <View
                        style={
                            styles.achievementGrid
                        }
                    >
                        <Achievement
                            icon="☕"
                            title="初めての会話"
                            unlocked
                        />

                        <Achievement
                            icon="🗾"
                            title="東京探検"
                            unlocked
                        />

                        <Achievement
                            icon="🔥"
                            title="7日連続"
                            unlocked
                        />

                        <Achievement
                            icon="🗝️"
                            title="Golden Key"
                            unlocked={false}
                        />
                    </View>
                </View>

                {/* =========================
                    CERTIFICATES
                ========================== */}

                <View
                    style={
                        styles.certificateCard
                    }
                >
                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        🎓 CERTIFICATES
                    </Text>

                    <Text
                        style={
                            styles.certificateDescription
                        }
                    >
                        Prefecture hoàn thành sẽ hiển thị
                        chứng chỉ kỹ thuật số tại đây.
                    </Text>

                    <View
                        style={
                            styles.certificateEmpty
                        }
                    >
                        <Text
                            style={
                                styles.certificateEmptyIcon
                            }
                        >
                            🔒
                        </Text>

                        <Text
                            style={
                                styles.certificateEmptyText
                            }
                        >
                            まだ修了証がありません
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <BottomNav
                active="profile"
            />
        </SafeAreaView>
    );
}

function AbilityBar({
    labelJa,
    labelEn,
    value,
}: {
    labelJa: string;

    labelEn: string;

    value: number;
}) {
    const safeValue =
        Math.max(
            0,
            Math.min(
                100,
                value
            )
        );

    return (
        <View
            style={
                styles.abilityRow
            }
        >
            <View
                style={
                    styles.abilityTitleRow
                }
            >
                <Text
                    style={
                        styles.abilityLabel
                    }
                >
                    {labelJa}
                    {' '}
                    <Text
                        style={
                            styles.abilityEn
                        }
                    >
                        {labelEn}
                    </Text>
                </Text>

                <Text
                    style={
                        styles.abilityValue
                    }
                >
                    {safeValue}%
                </Text>
            </View>

            <View
                style={
                    styles.abilityTrack
                }
            >
                <View
                    style={[
                        styles.abilityFill,

                        {
                            width: `${safeValue}%`,
                        },
                    ]}
                />
            </View>
        </View>
    );
}

function StatSection({
    title,
    rows,
}: {
    title: string;

    rows: [
        string,
        string
    ][];
}) {
    return (
        <View
            style={
                styles.statCard
            }
        >
            <Text
                style={
                    styles.sectionTitle
                }
            >
                {title}
            </Text>

            {rows.map(
                (
                    [
                        label,
                        value,
                    ]
                ) => (
                    <View
                        key={
                            label
                        }
                        style={
                            styles.statRow
                        }
                    >
                        <Text
                            style={
                                styles.statLabel
                            }
                        >
                            {label}
                        </Text>

                        <Text
                            style={
                                styles.statValue
                            }
                        >
                            {value}
                        </Text>
                    </View>
                )
            )}
        </View>
    );
}

function MiniStat({
    value,
    label,
}: {
    value:
    | string
    | number;

    label: string;
}) {
    return (
        <View
            style={
                styles.miniStat
            }
        >
            <Text
                style={
                    styles.miniStatValue
                }
            >
                {value}
            </Text>

            <Text
                style={
                    styles.miniStatLabel
                }
            >
                {label}
            </Text>
        </View>
    );
}

function Achievement({
    icon,
    title,
    unlocked,
}: {
    icon: string;

    title: string;

    unlocked: boolean;
}) {
    return (
        <View
            style={[
                styles.achievement,

                !unlocked &&
                styles.achievementLocked,
            ]}
        >
            <Text
                style={
                    styles.achievementIcon
                }
            >
                {unlocked
                    ? icon
                    : '🔒'}
            </Text>

            <Text
                style={
                    styles.achievementTitle
                }
                numberOfLines={2}
            >
                {title}
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

        scroll: {
            flex: 1,
        },

        content: {
            padding: 18,

            paddingBottom: 26,

            gap: 12,
        },

        pressed: {
            opacity: 0.65,
        },

        /*
         * PROFILE
         */

        profileCard: {
            flexDirection: 'row',

            alignItems: 'center',

            padding: 17,

            borderRadius: 20,

            backgroundColor:
                '#202a40',

            borderWidth: 1,

            borderColor:
                '#2d3951',
        },

        avatar: {
            width: 64,
            height: 64,

            borderRadius: 32,

            backgroundColor:
                '#ffffff',

            alignItems: 'center',

            justifyContent:
                'center',

            marginRight: 14,
        },

        avatarText: {
            fontSize: 31,
        },

        profileInfo: {
            flex: 1,
        },

        name: {
            color: '#ffffff',

            fontSize: 21,

            fontWeight: '900',
        },

        profileLevel: {
            color: '#ff76ad',

            fontSize: 16,

            fontWeight: '800',

            marginTop: 4,
        },

        occupation: {
            color: '#aeb7c5',

            fontSize: 16,

            marginTop: 5,
        },

        editButton: {
            paddingHorizontal: 11,

            paddingVertical: 7,

            borderRadius: 12,

            backgroundColor:
                '#303b52',
        },

        editText: {
            color: '#ffffff',

            fontSize: 16,

            fontWeight: '800',
        },

        /*
         * GENERAL
         */

        sectionTitle: {
            color: '#ffffff',

            fontSize: 16,

            fontWeight: '900',

            marginBottom: 10,
        },

        cardLabel: {
            color: '#a9b2c0',

            fontSize: 15,

            fontWeight: '900',
        },

        /*
         * RATING
         */

        ratingCard: {
            alignItems: 'center',

            padding: 20,

            borderRadius: 20,

            backgroundColor:
                '#292545',

            borderWidth: 1,

            borderColor:
                '#6558f5',
        },

        ratingTitle: {
            color: '#ffffff',

            fontSize: 25,

            fontWeight: '900',

            marginTop: 8,
        },

        ratingVi: {
            color: '#cbc6ff',

            fontSize: 16,

            marginTop: 3,
        },

        ratingLevelBadge: {
            backgroundColor:
                'rgba(255,207,89,0.12)',

            borderWidth: 1,

            borderColor:
                'rgba(255,207,89,0.35)',

            paddingHorizontal: 10,

            paddingVertical: 5,

            borderRadius: 10,

            marginTop: 10,
        },

        ratingLevel: {
            color: '#ffcf59',

            fontSize: 15,

            fontWeight: '900',
        },

        ratingNote: {
            color: '#a49eb8',

            fontSize: 15,

            lineHeight: 13,

            textAlign: 'center',

            marginTop: 10,

            maxWidth: 290,
        },

        /*
         * ABILITY
         */

        abilityCard: {
            padding: 15,

            borderRadius: 18,

            backgroundColor:
                '#202a40',
        },

        abilityRow: {
            marginBottom: 12,
        },

        abilityTitleRow: {
            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
                'space-between',

            marginBottom: 5,
        },

        abilityLabel: {
            color: '#ffffff',

            fontSize: 16,

            fontWeight: '800',
        },

        abilityEn: {
            color: '#8792a4',

            fontWeight: '500',
        },

        abilityValue: {
            color: '#ffffff',

            fontSize: 16,

            fontWeight: '900',
        },

        abilityTrack: {
            height: 6,

            borderRadius: 3,

            backgroundColor:
                '#303b52',

            overflow: 'hidden',
        },

        abilityFill: {
            height: '100%',

            borderRadius: 3,

            backgroundColor:
                '#ff659e',
        },

        /*
         * STAT
         */

        statCard: {
            padding: 15,

            borderRadius: 18,

            backgroundColor:
                '#202a40',
        },

        statRow: {
            minHeight: 32,

            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
                'space-between',

            borderBottomWidth: 1,

            borderBottomColor:
                'rgba(255,255,255,0.06)',
        },

        statLabel: {
            color: '#aab4c4',

            fontSize: 16,
        },

        statValue: {
            color: '#ffffff',

            fontSize: 16,

            fontWeight: '800',
        },

        /*
         * WORK
         */

        workCard: {
            padding: 16,

            borderRadius: 19,

            backgroundColor:
                '#292545',

            borderWidth: 1,

            borderColor:
                '#4c4383',
        },

        workHeader: {
            flexDirection: 'row',

            alignItems: 'center',
        },

        workIcon: {
            fontSize: 33,

            width: 48,
        },

        workHeaderText: {
            flex: 1,
        },

        workTitle: {
            color: '#ffffff',

            fontSize: 16,

            fontWeight: '900',
        },

        workOccupation: {
            color: '#c5bfff',

            fontSize: 16,

            marginTop: 3,
        },

        workStats: {
            flexDirection: 'row',

            gap: 8,

            marginTop: 14,
        },

        workDescription: {
            color: '#aaa5bd',

            fontSize: 16,

            lineHeight: 14,

            marginTop: 12,
        },

        /*
         * MINI STATS
         */

        miniStat: {
            flex: 1,

            alignItems: 'center',

            paddingVertical: 10,

            borderRadius: 12,

            backgroundColor:
                'rgba(255,255,255,0.05)',
        },

        miniStatValue: {
            color: '#ffffff',

            fontSize: 17,

            fontWeight: '900',
        },

        miniStatLabel: {
            color: '#8994a5',

            fontSize: 15,

            marginTop: 2,
        },

        /*
         * JAPAN JOURNEY
         */

        journeyCard: {
            padding: 16,

            borderRadius: 19,

            backgroundColor:
                '#202a40',
        },

        journeyHeader: {
            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
                'space-between',
        },

        journeySubtitle: {
            color: '#8792a3',

            fontSize: 15,

            marginTop: -5,
        },

        journeyPercent: {
            color: '#ff659e',

            fontSize: 18,

            fontWeight: '900',
        },

        journeyProgressTrack: {
            height: 6,

            borderRadius: 3,

            backgroundColor:
                '#303b52',

            marginTop: 12,

            overflow: 'hidden',
        },

        journeyProgressFill: {
            width: '3%',

            height: '100%',

            backgroundColor:
                '#ff659e',
        },

        journeyStats: {
            flexDirection: 'row',

            gap: 6,

            marginTop: 12,
        },

        prefectureRow: {
            minHeight: 47,

            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
                'space-between',

            borderTopWidth: 1,

            borderTopColor:
                'rgba(255,255,255,0.06)',

            marginTop: 10,

            paddingTop: 10,
        },

        prefectureName: {
            color: '#ffffff',

            fontSize: 15,

            fontWeight: '900',
        },

        prefectureSub: {
            color: '#778397',

            fontSize: 15,

            marginTop: 2,
        },

        prefectureStatus: {
            color: '#00d493',

            fontSize: 16,

            fontWeight: '900',
        },

        prefectureLocked: {
            fontSize: 15,
        },

        /*
         * LOG
         */

        logCard: {
            padding: 16,

            borderRadius: 19,

            backgroundColor:
                '#202a40',

            borderWidth: 1,

            borderColor:
                '#2d3951',
        },

        logHeader: {
            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
                'space-between',
        },

        logTitle: {
            color: '#ffffff',

            fontSize: 18,

            fontWeight: '900',

            marginTop: 5,
        },

        logArrow: {
            color: '#ffffff',

            fontSize: 29,
        },

        logDescription: {
            color: '#a8b1c0',

            fontSize: 16,

            lineHeight: 14,

            marginTop: 5,
        },

        logStats: {
            flexDirection: 'row',

            marginTop: 14,

            gap: 8,
        },

        logStat: {
            flex: 1,

            backgroundColor:
                'rgba(255,255,255,0.05)',

            borderRadius: 12,

            paddingVertical: 9,

            alignItems: 'center',
        },

        logStatValue: {
            color: '#ffffff',

            fontSize: 17,

            fontWeight: '900',
        },

        logStatLabel: {
            color: '#8d98a9',

            fontSize: 15,

            marginTop: 2,
        },

        logOpen: {
            flexDirection: 'row',

            alignItems: 'center',

            marginTop: 13,
        },

        logOpenText: {
            color: '#ff73ae',

            fontSize: 16,

            fontWeight: '900',
        },

        logOpenArrow: {
            color: '#ff73ae',

            fontSize: 16,

            marginLeft: 5,
        },

        /*
         * ACHIEVEMENTS
         */

        achievementCard: {
            padding: 16,

            borderRadius: 19,

            backgroundColor:
                '#202a40',
        },

        achievementGrid: {
            flexDirection: 'row',

            gap: 7,
        },

        achievement: {
            flex: 1,

            minHeight: 74,

            borderRadius: 13,

            backgroundColor:
                'rgba(255,255,255,0.05)',

            alignItems: 'center',

            justifyContent:
                'center',

            padding: 6,
        },

        achievementLocked: {
            opacity: 0.35,
        },

        achievementIcon: {
            fontSize: 24,
        },

        achievementTitle: {
            color: '#ffffff',

            fontSize: 15,

            textAlign: 'center',

            marginTop: 5,
        },

        /*
         * CERTIFICATE
         */

        certificateCard: {
            padding: 16,

            borderRadius: 19,

            backgroundColor:
                '#202a40',
        },

        certificateDescription: {
            color: '#8994a5',

            fontSize: 16,

            lineHeight: 14,
        },

        certificateEmpty: {
            alignItems: 'center',

            justifyContent:
                'center',

            paddingVertical: 20,

            marginTop: 10,

            borderRadius: 14,

            backgroundColor:
                'rgba(255,255,255,0.04)',
        },

        certificateEmptyIcon: {
            fontSize: 25,
        },

        certificateEmptyText: {
            color: '#778396',

            fontSize: 16,

            marginTop: 7,
        },
    });