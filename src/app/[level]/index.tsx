import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';

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
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <RoyalBackButton onPress={() => router.back()} />

                <Text style={styles.level}>{levelName}</Text>

                <Text style={styles.title}>{info.title}</Text>

                <Text style={styles.subtitle}>
                    {info.description}
                </Text>

                <View style={styles.section}>
                    {isN5 && <Pressable
                        style={styles.card}
                        onPress={() => router.push(`/${levelName}/characters`)}
                    >
                        <Text style={styles.cardIcon}>🔤</Text>
                        <View>
                            <Text style={styles.cardTitle}>文字</Text>
                            <Text style={styles.cardText}>
                                ひらがな・カタカナ・漢字
                            </Text>
                        </View>
                    </Pressable>}

                    <Pressable
                        style={styles.card}
                        onPress={() =>
                            router.push(`/${levelName}/vocabulary`)
                        }
                    >
                        <Text style={styles.cardIcon}>📝</Text>

                        <View>
                            <Text style={styles.cardTitle}>単語</Text>
                            <Text style={styles.cardText}>語彙を学ぶ</Text>
                        </View>
                    </Pressable>

                    <Pressable
                        style={styles.card}
                        onPress={() => router.push(`/${levelName}/grammar`)}
                    >
                        <Text style={styles.cardIcon}>📖</Text>
                        <View>
                            <Text style={styles.cardTitle}>文法</Text>
                            <Text style={styles.cardText}>
                                文法を学ぶ
                            </Text>
                        </View>
                    </Pressable>

                    <Pressable
                        style={styles.card}
                        onPress={() => router.push(`/${levelName}/test`)}
                    >
                        <Text style={styles.cardIcon}>🎯</Text>
                        <View>
                            <Text style={styles.cardTitle}>JLPT模擬試験</Text>
                            <Text style={styles.cardText}>
                                本番形式で練習する
                            </Text>
                        </View>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8e2d6',
    },

    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
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
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        backgroundColor: '#e8e2d6',
        borderWidth: 1,
        borderColor: '#b8b1a5',
        borderRadius: 16,
    },

    cardIcon: {
        fontSize: 30,
        width: 52,
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
    },

    cardText: {
        fontSize: 16,
        marginTop: 4,
    },
});
