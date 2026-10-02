import RoyalPageBackground from '@/components/ui/RoyalPageBackground';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState, type PropsWithChildren } from 'react';

import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import BottomNav from '@/components/app/BottomNav';
import GameHeader from '@/components/app/GameHeader';
import { ROYAL, ROYAL_FONT, ROYAL_TYPE, RoyalNavyFrame } from '@/components/ui/RoyalSurface';
import { RANKS, type LearningEconomy } from '@/services/learning-economy';
import { syncJlptQualification } from '@/services/sync-jlpt-qualification';

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
const PROFILE_AVATAR = require('../../../assets/app/ui/royal-af/hud-player-medallion-v1.png');
function ProfileFrame(){return <View pointerEvents="none" style={styles.royalFrame}><RoyalNavyFrame style={styles.royalFrame}/></View>}

/** Content measures independently from the decorative inset, preventing layout feedback. */
function ProfilePanel({children,style,kind='plain'}:PropsWithChildren<{style?:StyleProp<ViewStyle>;kind?:'profile'|'rating'|'plain'}>) {
    const [contentHeight,setContentHeight]=useState(0);
    const [width,setWidth]=useState(0);
    return <View onLayout={event=>setWidth(event.nativeEvent.layout.width)} style={[style,{position:'relative',flexDirection:'column',alignItems:'stretch',padding:0,paddingHorizontal:0,paddingVertical:0,borderWidth:0}]}>
        <ProfileFrame/>
        <View style={{paddingHorizontal:Math.max(24,width*.12),paddingVertical:Math.max(24,contentHeight*.28)}}>
            <View onLayout={event=>setContentHeight(event.nativeEvent.layout.height)} style={kind==='profile'?{flexDirection:width<480?'column':'row',flexWrap:'wrap',alignItems:width<480?'stretch':'center',gap:8}:kind==='rating'?{alignItems:'center'}:undefined}>
                {children}
            </View>
        </View>
    </View>;
}

export default function ProfileScreen() {
    const [economy,setEconomy]=useState<LearningEconomy|null>(null);
    useFocusEffect(useCallback(()=>{let active=true;void syncJlptQualification().then(value=>{if(active)setEconomy(value)});return()=>{active=false}},[]));
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
        <RoyalPageBackground tone="dark"><SafeAreaView
            style={
                styles.container
            }
            edges={[
                'top',
                'bottom',
            ]}
        >
            <View style={styles.fixedHeader}>
                <GameHeader variant="approved" name={profile.name?.trim()||'プレイヤー'} abilityLevel={economy?.officialRank??'N5'} abilityTarget={economy?.officialRank?RANKS[RANKS.indexOf(economy.officialRank)+1]??economy.officialRank:'N5'} qualifiedExams={Object.fromEntries(RANKS.map(rank=>[rank,Object.keys(economy?.passed[rank]??{}).length]))} conversationCredits={economy?.credits??100} coins={stats.coins}/>
            </View>
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

                <ProfilePanel kind="profile"
                    style={
                        styles.profileCard
                    }
                >
                    <View
                        style={
                            styles.avatar
                        }
                    >
                        <Image source={PROFILE_AVATAR} resizeMode="contain" style={styles.avatarArtwork}/>
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
                            {economy?.officialRank ?? 'N5'}

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
                </ProfilePanel>

                {/* =========================
                    COMMUNICATION RATING
                ========================== */}

                <ProfilePanel kind="rating"
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
                </ProfilePanel>

                {/* =========================
                    SPEAKING ABILITY
                ========================== */}

                <ProfilePanel kind="plain"
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
                </ProfilePanel>

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

                <ProfilePanel kind="plain"
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
                </ProfilePanel>

                {/* =========================
                    JAPAN JOURNEY
                ========================== */}

                <ProfilePanel kind="plain"
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
                </ProfilePanel>

                {/* =========================
                    CONVERSATION LOG
                ========================== */}

                <Pressable
                    style={({ pressed }) => [
                        {width:'100%'},

                        pressed &&
                        styles.pressed,
                    ]}
                    onPress={() =>
                        router.push(
                            '/conversation-log'
                        )
                    }
                ><ProfilePanel style={styles.logCard}>
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
                </ProfilePanel></Pressable>

                {/* =========================
                    ACHIEVEMENTS
                ========================== */}

                <ProfilePanel kind="plain"
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
                </ProfilePanel>

                {/* =========================
                    CERTIFICATES
                ========================== */}

                <ProfilePanel kind="plain"
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
                </ProfilePanel>
            </ScrollView>

            <BottomNav
                active="profile"
            />
        </SafeAreaView></RoyalPageBackground>
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
        <ProfilePanel kind="plain"
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
        </ProfilePanel>
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
        royalFrame: {...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},
        container: {
            flex: 1,

            backgroundColor:'transparent',
        },

        fixedHeader: { paddingHorizontal: 18, paddingTop: 18, marginBottom: 12 },

        scroll: {
            flex: 1,
        },

        content: {
            padding: 18,
            paddingTop: 0,

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
            flexWrap: 'wrap',
            gap: 8,
            position: 'relative',
            paddingHorizontal: 32,
            paddingVertical: 30,
            flexDirection: 'row',

            alignItems: 'center',


            borderRadius: 20,

            backgroundColor: 'transparent',

            borderWidth: 1,

            borderColor: ROYAL.gold,
        },

        avatar: {
            alignSelf: 'center',
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
            fontFamily: ROYAL_FONT.body,
            fontSize: 31,
        },
        avatarArtwork:{width:'100%',height:'100%'},

        profileInfo: {
            minWidth: 0,
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: 'auto',
        },

        name: {
            lineHeight: ROYAL_TYPE.bodyLine,
            color: '#ffffff',

            fontFamily: ROYAL_FONT.heading,

            fontSize: ROYAL_TYPE.sectionTitle,

            fontWeight: '900',
        },

        profileLevel: {
            color: '#ff76ad',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            fontWeight: '800',

            marginTop: 4,
        },

        occupation: {
            color: '#aeb7c5',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            marginTop: 5,
        },

        editButton: {
            alignSelf: 'center',
            paddingHorizontal: 11,

            paddingVertical: 7,

            borderRadius: 12,

            backgroundColor:
                '#303b52',
        },

        editText: {
            color: '#ffffff',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            fontWeight: '800',
        },

        /*
         * GENERAL
         */

        sectionTitle: {
            lineHeight: ROYAL_TYPE.bodyLine,
            color: '#ffffff',

            fontFamily: ROYAL_FONT.heading,

            fontSize: ROYAL_TYPE.sectionTitle,

            fontWeight: '900',

            marginBottom: 10,
        },

        cardLabel: {
            color: '#a9b2c0',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.caption,

            fontWeight: '900',
        },

        /*
         * RATING
         */

        ratingCard: {
            position: 'relative',
            paddingHorizontal: 32,
            paddingVertical: 30,
            alignItems: 'center',


            borderRadius: 20,

            backgroundColor: 'transparent',

            borderWidth: 1,

            borderColor: ROYAL.gold,
        },

        ratingTitle: {
            lineHeight: ROYAL_TYPE.bodyLine,
            color: '#ffffff',

            fontFamily: ROYAL_FONT.heading,

            fontSize: ROYAL_TYPE.pageTitle,

            fontWeight: '900',

            marginTop: 8,
        },

        ratingVi: {
            color: '#cbc6ff',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

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

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.caption,

            fontWeight: '900',
        },

        ratingNote: {
            color: '#a49eb8',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.caption,

            lineHeight: ROYAL_TYPE.bodyLine,

            textAlign: 'center',

            marginTop: 10,

            maxWidth: 290,
        },

        /*
         * ABILITY
         */

        abilityCard: {
            position: 'relative',
            paddingHorizontal: 32,
            paddingVertical: 30,

            borderRadius: 18,

            backgroundColor: 'transparent',
        },

        abilityRow: {
            marginBottom: 12,
        },

        abilityTitleRow: {
            flexWrap: 'wrap',
            gap: 8,
            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
                'space-between',

            marginBottom: 5,
        },

        abilityLabel: {
            flexShrink: 1,
            lineHeight: ROYAL_TYPE.bodyLine,
            color: '#ffffff',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            fontWeight: '800',
        },

        abilityEn: {
            color: '#8792a4',

            fontWeight: '500',
        },

        abilityValue: {
            lineHeight: ROYAL_TYPE.bodyLine,
            color: '#ffffff',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.value,

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
            position: 'relative',
            paddingHorizontal: 32,
            paddingVertical: 30,

            borderRadius: 18,

            backgroundColor:
                '#202a40',
        },

        statRow: {
            flexWrap: 'wrap',
            gap: 8,
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
            flexShrink: 1,
            lineHeight: ROYAL_TYPE.bodyLine,
            color: '#aab4c4',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,
        },

        statValue: {
            flexShrink: 1,
            lineHeight: ROYAL_TYPE.bodyLine,
            color: '#ffffff',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.value,

            fontWeight: '800',
        },

        /*
         * WORK
         */

        workCard: {
            position: 'relative',
            paddingHorizontal: 32,
            paddingVertical: 30,

            borderRadius: 19,

            backgroundColor: 'transparent',

            borderWidth: 1,

            borderColor: ROYAL.gold,
        },

        workHeader: {
            flexDirection: 'row',

            alignItems: 'center',
        },

        workIcon: {
            fontFamily: ROYAL_FONT.body,
            fontSize: 33,

            width: 48,
        },

        workHeaderText: {
            minWidth: 0,
            flex: 1,
        },

        workTitle: {
            lineHeight: ROYAL_TYPE.bodyLine,
            color: '#ffffff',

            fontFamily: ROYAL_FONT.heading,

            fontSize: ROYAL_TYPE.sectionTitle,

            fontWeight: '900',
        },

        workOccupation: {
            color: '#c5bfff',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            marginTop: 3,
        },

        workStats: {
            gap: 8,
            flexWrap: 'wrap',
            flexDirection: 'row',


            marginTop: 14,
        },

        workDescription: {
            color: '#aaa5bd',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            lineHeight: ROYAL_TYPE.bodyLine,

            marginTop: 12,
        },

        /*
         * MINI STATS
         */

        miniStat: {
            minWidth: 64,
            paddingHorizontal: 6,
            flex: 1,

            alignItems: 'center',

            paddingVertical: 10,

            borderRadius: 12,

            backgroundColor:
                'rgba(255,255,255,0.05)',
        },

        miniStatValue: {
            lineHeight: ROYAL_TYPE.bodyLine,
            color: '#ffffff',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.value,

            fontWeight: '900',
        },

        miniStatLabel: {
            flexShrink: 1,
            lineHeight: ROYAL_TYPE.bodyLine,
            color: '#8994a5',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.caption,

            marginTop: 2,
        },

        /*
         * JAPAN JOURNEY
         */

        journeyCard: {
            position: 'relative',
            paddingHorizontal: 32,
            paddingVertical: 30,

            borderRadius: 19,

            backgroundColor: 'transparent',
        },

        journeyHeader: {
            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
                'space-between',
        },

        journeySubtitle: {
            color: '#8792a3',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.caption,

            marginTop: 0,
        },

        journeyPercent: {
            color: '#ff659e',

            fontFamily: ROYAL_FONT.body,

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
            gap: 8,
            flexWrap: 'wrap',
            flexDirection: 'row',


            marginTop: 12,
        },

        prefectureRow: {
            flexWrap: 'wrap',
            gap: 8,
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
            flexShrink: 1,
            lineHeight: ROYAL_TYPE.bodyLine,
            color: '#ffffff',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.caption,

            fontWeight: '900',
        },

        prefectureSub: {
            color: '#778397',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.caption,

            marginTop: 2,
        },

        prefectureStatus: {
            flexShrink: 1,
            lineHeight: ROYAL_TYPE.bodyLine,
            color: '#00d493',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            fontWeight: '900',
        },

        prefectureLocked: {
            fontFamily: ROYAL_FONT.body,
            fontSize: ROYAL_TYPE.caption,
        },

        /*
         * LOG
         */

        logCard: {
            position: 'relative',
            paddingHorizontal: 32,
            paddingVertical: 30,

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
            lineHeight: ROYAL_TYPE.bodyLine,
            color: '#ffffff',

            fontFamily: ROYAL_FONT.heading,

            fontSize: ROYAL_TYPE.sectionTitle,

            fontWeight: '900',

            marginTop: 5,
        },

        logArrow: {
            color: '#ffffff',

            fontFamily: ROYAL_FONT.body,

            fontSize: 29,
        },

        logDescription: {
            color: '#a8b1c0',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            lineHeight: ROYAL_TYPE.bodyLine,

            marginTop: 5,
        },

        logStats: {
            gap: 8,
            flexWrap: 'wrap',
            flexDirection: 'row',

            marginTop: 14,

        },

        logStat: {
            minWidth: 64,
            paddingHorizontal: 6,
            flex: 1,

            backgroundColor:
                'rgba(255,255,255,0.05)',

            borderRadius: 12,

            paddingVertical: 9,

            alignItems: 'center',
        },

        logStatValue: {
            lineHeight: ROYAL_TYPE.bodyLine,
            color: '#ffffff',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.value,

            fontWeight: '900',
        },

        logStatLabel: {
            color: '#8d98a9',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.caption,

            marginTop: 2,
        },

        logOpen: {
            flexDirection: 'row',

            alignItems: 'center',

            marginTop: 13,
        },

        logOpenText: {
            color: '#ff73ae',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            fontWeight: '900',
        },

        logOpenArrow: {
            color: '#ff73ae',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            marginLeft: 5,
        },

        /*
         * ACHIEVEMENTS
         */

        achievementCard: {
            position: 'relative',
            paddingHorizontal: 32,
            paddingVertical: 30,

            borderRadius: 19,

            backgroundColor:
                '#202a40',
        },

        achievementGrid: {
            gap: 8,
            flexWrap: 'wrap',
            flexDirection: 'row',

        },

        achievement: {
            minWidth: 90,
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
            fontFamily: ROYAL_FONT.body,
            fontSize: 24,
        },

        achievementTitle: {
            flexShrink: 1,
            lineHeight: ROYAL_TYPE.bodyLine,
            color: '#ffffff',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.caption,

            textAlign: 'center',

            marginTop: 5,
        },

        /*
         * CERTIFICATE
         */

        certificateCard: {
            position: 'relative',
            paddingHorizontal: 32,
            paddingVertical: 30,

            borderRadius: 19,

            backgroundColor:
                '#202a40',
        },

        certificateDescription: {
            color: '#8994a5',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            lineHeight: ROYAL_TYPE.bodyLine,
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
            fontFamily: ROYAL_FONT.body,
            fontSize: ROYAL_TYPE.pageTitle,
        },

        certificateEmptyText: {
            color: '#778396',

            fontFamily: ROYAL_FONT.body,

            fontSize: ROYAL_TYPE.body,

            marginTop: 7,
        },
    });
