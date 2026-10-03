import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import {
    Image,
    ImageBackground,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import BottomNav from '@/components/app/BottomNav';
import GameHeader from '@/components/app/GameHeader';
import RoyalPaperPanel from '@/components/ui/RoyalPaperPanel';
import { ROYAL_LAYOUT, ROYAL_FONT } from '@/components/ui/RoyalSurface';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getGameProgress } from '@/services/progress-storage';
import { getJlptProgress } from '@/services/jlpt-progress-storage';
import learningProgressIds from '@/data/generated/learning-progress-ids.json';
import { RANK_COLORS, RANKS, type LearningEconomy } from '@/services/learning-economy';
import { syncJlptQualification } from '@/services/sync-jlpt-qualification';


const RANK_BADGES = {N5:require('../../assets/app/ui/royal-af/rank-n5-v1.png'),N4:require('../../assets/app/ui/royal-af/rank-n4-v1.png'),N3:require('../../assets/app/ui/royal-af/rank-n3-v1.png'),N2:require('../../assets/app/ui/royal-af/rank-n2-v1.png'),N1:require('../../assets/app/ui/royal-af/rank-n1-v1.png')};

const NEXT_JLPT_LEVEL: Record<string,string> = { 未受験:'N5', N5:'N4', N4:'N3', N3:'N2', N2:'N1', N1:'N1' };

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
    bodyColor: string;
};

const LEVEL_CONTENT_IDS = Object.fromEntries(
    Object.entries(learningProgressIds).map(([level, ids]) => [level, new Set(ids)]),
) as Record<LevelItem['level'], Set<string>>;

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

        accentColor: RANK_COLORS.N5, bodyColor: '#dcebdc',
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

        accentColor: RANK_COLORS.N4, bodyColor: '#91bed5',
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

        accentColor: RANK_COLORS.N3, bodyColor: '#ead8bd',
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

        accentColor: RANK_COLORS.N2, bodyColor: '#d8c0aa',
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

        accentColor: RANK_COLORS.N1, bodyColor: '#f2c7c7',
    },
];

export default function LearnScreen() {
    const { profile } = useUserProfile();
    const [runtimeLevels, setRuntimeLevels] = useState(levels);
    const [stats, setStats] = useState({ xp: 0, coins: 0, conversationCredits: 0 });
    const [economy,setEconomy] = useState<LearningEconomy|null>(null);
    const [helpVisible,setHelpVisible] = useState(false);

    useEffect(() => {
        void Promise.all([getGameProgress(), getJlptProgress(), syncJlptQualification()]).then(([game, learning, ledger]) => {
            setEconomy(ledger);
            setStats({ xp: game.stats.xp, coins: game.stats.coins, conversationCredits: game.stats.conversationCredits });
            setRuntimeLevels(levels.map((item) => {
                const levelIds = LEVEL_CONTENT_IDS[item.level];
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
    const currentTarget = economy?.officialRank ? NEXT_JLPT_LEVEL[economy.officialRank] as keyof typeof RANK_COLORS : 'N5';
    const qualifiedCount = Object.keys(economy?.passed[currentTarget]??{}).length;
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
        <ImageBackground source={require('../../assets/app/life/location-backgrounds/cafe/01-clear-morning.jpg')} blurRadius={40} resizeMode="cover" style={styles.background}>
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
                        name={profile.name?.trim() || 'プレイヤー'}
                        variant="approved"
                        abilityLevel={economy?.officialRank || 'N5'}
                        abilityTarget={economy?.officialRank?NEXT_JLPT_LEVEL[economy.officialRank]:'N5'}
                        qualifiedExams={Object.fromEntries(RANKS.map(rank=>[rank,Object.keys(economy?.passed[rank]??{}).length]))}
                        conversationCredits={economy?.credits ?? 100}
                        coins={stats.coins}
                    />

                    {/* TITLE */}

                    <View
                        style={
                            styles.headingArea
                        }
                    >
                        <View style={styles.headingTitleRow}><Text
                            numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.75}
                            style={
                                styles.heading
                            }
                        >
                            JLPT 学習
                        </Text><Pressable accessibilityRole="button" accessibilityLabel="JLPT の認定条件" onPress={()=>setHelpVisible(true)} style={styles.helpButton}><Text style={styles.helpGlyph}>?</Text></Pressable></View>

                        <Text
                            style={
                                styles.headingVi
                            }
                        >
                            Hành trình chinh phục JLPT
                        </Text>
                    </View>

                    {/* TOTAL PROGRESS */}

                    <RoyalPaperPanel
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
                                JLPT 認定進捗
                            </Text>

                            <Text
                                style={
                                    styles.totalProgressXp
                                }
                            >
                                {RANKS.filter(rank=>!economy?.officialRank||RANKS.indexOf(rank)>RANKS.indexOf(economy.officialRank)).map(rank=>`${rank} ${Object.keys(economy?.passed[rank]??{}).length}/6`).join(' · ')}
                            </Text>
                        </View>

                        <View
                            style={
                                styles.totalProgressTrack
                            }
                        >
                            <View
                                style={[styles.totalProgressFill,
                                    {width:`${Math.min(100,qualifiedCount/6*100)}%`,backgroundColor:RANK_COLORS[currentTarget]}]}
                            />
                        </View>

                    </RoyalPaperPanel>

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
                                    style={({pressed}) => [!item.unlocked && {opacity:.6}, pressed && item.unlocked && styles.pressed]}
                                    onPress={() =>
                                        openLevel(
                                            item
                                        )
                                    }
                                >
                                    <RoyalPaperPanel style={styles.levelCard}>
                                    {/* LEVEL BADGE */}

                                    <View style={styles.levelBadge}>
                                        <Image source={RANK_BADGES[item.level]} resizeMode="contain" style={{position:'absolute',left:0,top:0,width:72,height:72}}/>
                                        <Text style={styles.levelBadgeText}>{item.level}</Text>
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
                                    </RoyalPaperPanel>
                                </Pressable>
                            )
                        )}
                    </ScrollView>
                </View>

                <BottomNav active="home" variant="approved" />
                {helpVisible && <Modal visible={helpVisible} transparent animationType="none" onRequestClose={()=>setHelpVisible(false)}><View style={styles.helpBackdrop}><View style={styles.helpPanel}><ScrollView contentContainerStyle={styles.helpContent}><Text style={styles.helpTitle}>JLPT 認定の進め方</Text><Text style={styles.helpCopy}>Mỗi cấp cần 6 đề thi khác nhau đạt ít nhất 80% sau khi nộp bài. Thi lại đề chưa đạt được tính khi điểm mới đạt yêu cầu; làm một đề nhiều lần vẫn chỉ tính là một đề.</Text><Text style={styles.helpCopy}>Thanh x/6 cho biết số đề đã đạt tại cấp đó. Có thể thăng thẳng lên cấp cao khi đủ 6 đề tại cấp ấy. Cấp chính thức được hiển thị trong hồ sơ; tiến độ cấp thấp hơn sẽ ẩn sau khi đã được công nhận cấp cao.</Text></ScrollView><Pressable accessibilityRole="button" accessibilityLabel="閉じる" onPress={()=>setHelpVisible(false)} style={styles.helpClose}><Text style={styles.helpCloseText}>閉じる</Text></Pressable></View></View></Modal>}
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles =
    StyleSheet.create({
        headingTitleRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10},
        headingPlaque:{flex:1,minWidth:0,maxWidth:420,height:58,paddingHorizontal:36,justifyContent:'center'},
        helpButton:{width:42,height:42,borderRadius:21,borderWidth:2,borderColor:'#b68d47',backgroundColor:'#fff8e8',alignItems:'center',justifyContent:'center'},
        helpGlyph:{color:'#263b55',fontSize:24,fontWeight:'700',lineHeight:30},
        helpBackdrop:{flex:1,justifyContent:'center',padding:20,backgroundColor:'rgba(4,15,31,.65)'},
        helpPanel:{maxHeight:'80%',maxWidth:560,width:'100%',alignSelf:'center',backgroundColor:'#fff8e8',borderWidth:3,borderColor:'#c9a361',borderRadius:22,padding:18},
        helpContent:{gap:15,paddingBottom:12},helpTitle:{fontFamily:ROYAL_FONT.heading,fontSize:22,fontWeight:'700',color:'#193551',textAlign:'center'},helpCopy:{fontSize:16,lineHeight:25,color:'#23384d'},
        helpClose:{minHeight:48,alignItems:'center',justifyContent:'center',backgroundColor:'#223d5b',borderRadius:12},helpCloseText:{fontFamily:ROYAL_FONT.body,color:'#fff8e8',fontSize:17},
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
                'rgba(255,255,255,.45)',
        },

        container: {
            flex: 1,
        },

        content: {
            flex: 1,

            paddingHorizontal: ROYAL_LAYOUT.screenGutter,
            paddingTop: ROYAL_LAYOUT.backSafeTop,
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
            flex: 1,
            color: '#142847',

            fontSize: 28,
            fontFamily: ROYAL_FONT.heading,
            textAlign:'center',

            textShadowColor:
                '#fffdf7',

            textShadowOffset: {
                width: 0,
                height: 1,
            },

            textShadowRadius: 1,
        },

        headingVi: {
            color: '#625f57',

            fontSize: 15,

            marginTop: 3,
        },

        /*
         * TOTAL PROGRESS
         */

        totalProgressCard: {marginTop:14,paddingHorizontal:26,paddingVertical:22},

        totalProgressTop: {
            flexWrap:'wrap',
            gap:6,
            flexDirection: 'row',

            alignItems: 'flex-start',

            justifyContent:
                'space-between',
        },

        totalProgressTitle: {
            fontFamily: ROYAL_FONT.body,
            color: '#50745c',

            fontSize: 13,
            fontWeight: '900',

            letterSpacing: 0.7,
        },

        totalProgressXp: {
            color: '#24231f',
            flex:1,minWidth:0,marginLeft:8,textAlign:'right',
            fontSize: 12,
            fontWeight: '800',
        },

        totalProgressTrack: {
            height: 7,

            borderRadius: 4,

            marginTop: 10,

            backgroundColor:
                '#847457',

            overflow: 'hidden',
        },

        totalProgressFill: {
            width: '0%',
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

        levelCard: {minHeight:126,paddingHorizontal:24,paddingVertical:22,flexDirection:'row',alignItems:'center'},

        /*
         * LEVEL BADGE
         */

        levelBadge: {width:72,height:72,flexShrink:0,overflow:'hidden',alignItems:'center',justifyContent:'center',marginRight:12},
        levelBadgeText: {color:'#fff0bd',fontSize:22,fontWeight:'900',textShadowColor:'#020a17',textShadowOffset:{width:0,height:2},textShadowRadius:3},

        /*
         * LEVEL CONTENT
         */

        levelContent: {
            flex: 1,
            minWidth: 0,
        },

        levelTitleRow: {
            flexWrap:'wrap',
            flexDirection: 'row',
            alignItems: 'center',
        },

        levelTitleJa: {
            fontFamily: ROYAL_FONT.body,
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
                '#847457',

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
