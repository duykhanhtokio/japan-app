import { pushPrepared, replacePrepared } from '@/components/ui/prepareSceneRoute';
import JlptStudyBackground from '@/components/jlpt/JlptStudyBackground';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RoyalPaperPanel from '@/components/ui/RoyalPaperPanel';
import { RoyalBackButton, ROYAL_LAYOUT, ROYAL, ROYAL_FONT } from '@/components/ui/RoyalSurface';

const levelInfo = {
    N5: {
        title: 'はじめての日本語',
        description: '日本語の基礎を学びましょう',
    },
    N4: {
        title: '基礎日本語',
        description: '基本的な日本語を身につけましょう',
    },
    N3: {
        title: '中級日本語',
        description: 'より自然な日本語を学びましょう',
    },
    N2: {
        title: '中上級日本語',
        description: '仕事や生活で使える日本語を学びましょう',
    },
    N1: {
        title: '上級日本語',
        description: '高度な日本語表現を学びましょう',
    },
};

export default function LevelScreen() {
    const { level } = useLocalSearchParams();

    const levelName = Array.isArray(level) ? level[0] : level;

    const info =
        levelInfo[levelName as keyof typeof levelInfo] ?? levelInfo.N5;
    const isN5 = levelName === 'N5';

    return (
        <JlptStudyBackground><SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <RoyalBackButton onPress={() => router.canGoBack() ? router.back() : replacePrepared('/learn')} />

                <Text style={styles.level}>{levelName}</Text>

                <Text style={styles.title}>{info.title}</Text>

                <Text style={styles.subtitle}>
                    {info.description}
                </Text>

                <ScrollView contentContainerStyle={styles.section} showsVerticalScrollIndicator={false}>
                    {isN5 && <Pressable
                        style={styles.card}
                        onPress={() => pushPrepared(`/${levelName}/characters`)}
                    >
                        <RoyalPaperPanel style={styles.paper}><View style={styles.cardRow}><Image source={require('../../../assets/app/ui/royal-af/learning-characters-v1.png')} resizeMode="contain" style={styles.cardIcon}/>
                        <View style={styles.cardCopy}>
                            <Text style={styles.cardTitle}>文字</Text>
                            <Text style={styles.cardText}>
                                ひらがな・カタカナ・漢字
                            </Text>
                        </View>
                        </View></RoyalPaperPanel>
                    </Pressable>}

                    <Pressable
                        style={styles.card}
                        onPress={() =>
                            pushPrepared(`/${levelName}/vocabulary`)
                        }
                    >
                        <RoyalPaperPanel style={styles.paper}><View style={styles.cardRow}><Image source={require('../../../assets/app/ui/royal-af/learning-vocabulary-v1.png')} resizeMode="contain" style={styles.cardIcon}/>

                        <View style={styles.cardCopy}>
                            <Text style={styles.cardTitle}>単語</Text>
                            <Text style={styles.cardText}>語彙を学ぶ</Text>
                        </View>
                        </View></RoyalPaperPanel>
                    </Pressable>

                    <Pressable
                        style={styles.card}
                        onPress={() => pushPrepared(`/${levelName}/grammar`)}
                    >
                        <RoyalPaperPanel style={styles.paper}><View style={styles.cardRow}><Image source={require('../../../assets/app/ui/royal-af/learning-grammar-v1.png')} resizeMode="contain" style={styles.cardIcon}/>
                        <View style={styles.cardCopy}>
                            <Text style={styles.cardTitle}>文法</Text>
                            <Text style={styles.cardText}>
                                文法を学ぶ
                            </Text>
                        </View>
                        </View></RoyalPaperPanel>
                    </Pressable>

                    <Pressable
                        style={styles.card}
                        onPress={() => pushPrepared(`/${levelName}/test`)}
                    >
                        <RoyalPaperPanel style={styles.paper}><View style={styles.cardRow}><Image source={require('../../../assets/app/ui/royal-af/learning-exam-v1.png')} resizeMode="contain" style={styles.cardIcon}/>
                        <View style={styles.cardCopy}>
                            <Text style={styles.cardTitle}>JLPT模擬試験</Text>
                            <Text style={styles.cardText}>
                                本番形式で練習する
                            </Text>
                        </View>
                        </View></RoyalPaperPanel>
                    </Pressable>
                </ScrollView>
            </View>
        </SafeAreaView></JlptStudyBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },

    content: {
        flex: 1,
        paddingHorizontal: ROYAL_LAYOUT.screenGutter,
        paddingTop: ROYAL_LAYOUT.backSafeTop,
    },

    backButton: {
        marginBottom: 20,
    },

    backText: {
        fontSize: 16,
    },

    level: {
        fontSize: 44,
        fontWeight: '800',
        marginBottom: 4,
    },

    title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 16,
        marginBottom: 28,
    },

    section: {
        gap: 14,
        paddingBottom:24,
    },

    card: {width:'100%'},
    paper: {paddingHorizontal:24,paddingVertical:24},
    cardRow: {flexDirection:'row',alignItems:'center',gap:14},
    cardCopy: {flex:1,minWidth:0},
    cardIcon: {width:58,height:58},
    cardTitle: {
        fontSize: 18,
        fontFamily:ROYAL_FONT.heading,
        color:ROYAL.lacquer,
        fontWeight: '700',
    },

    cardText: {
        fontSize: 16,
        lineHeight:24,
        fontFamily:ROYAL_FONT.body,
        color:ROYAL.lacquerLight,
        marginTop: 4,
    },
});
