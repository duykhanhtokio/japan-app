import { router } from 'expo-router';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { VocabularyItem } from '@/types/vocabulary';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';

type Props = {
    typeLabel: string;
    title: string;
    translation: string;
    words: VocabularyItem[];
};

export function FilteredVocabularyList({
    typeLabel,
    title,
    translation,
    words,
}: Props) {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <RoyalBackButton onPress={() => router.back()} />

                <Text style={styles.smallTitle}>
                    {typeLabel}
                </Text>

                <Text style={styles.title}>
                    {title}
                </Text>

                <Text style={styles.translation}>
                    {translation}
                </Text>

                <Text style={styles.count}>
                    関連単語：{words.length} 語
                </Text>

                {words.map((item) => (
                    <Pressable
                        key={item.id}
                        style={styles.card}
                        onPress={() =>
                            router.push(
                                `/${item.jlptLevel}/vocabulary/${item.id}`
                            )
                        }
                    >
                        <View style={styles.wordHeader}>
                            <View>
                                <Text style={styles.word}>
                                    {item.word}
                                </Text>

                                <Text style={styles.reading}>
                                    {item.reading}
                                </Text>
                            </View>

                            <View style={styles.levelBadge}>
                                <Text style={styles.levelText}>
                                    {item.jlptLevel}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.meaning}>
                            {item.meaningVi}
                        </Text>
                    </Pressable>
                ))}
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

    smallTitle: {
        fontSize: 16,
        fontWeight: '700',
    },

    title: {
        fontSize: 34,
        fontWeight: '800',
        marginTop: 4,
    },

    translation: {
        fontSize: 16,
        marginTop: 6,
    },

    count: {
        fontSize: 15,
        marginTop: 24,
        marginBottom: 18,
        fontWeight: '600',
    },

    card: {
        backgroundColor: '#f3f3f3',
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
    },

    wordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    word: {
        fontSize: 26,
        fontWeight: '700',
    },

    reading: {
        fontSize: 15,
        marginTop: 3,
    },

    meaning: {
        fontSize: 17,
        fontWeight: '600',
        marginTop: 14,
    },

    levelBadge: {
        backgroundColor: '#e8e2d6',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },

    levelText: {
        fontSize: 16,
        fontWeight: '700',
    },
});
