import { router, useLocalSearchParams } from 'expo-router';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { industries } from '@/data/industries';
import { modules } from '@/data/modules';
import { vocabulary } from '@/data/vocabulary';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';

export default function IndustryScreen() {
    const { industryId } = useLocalSearchParams();

    const id = Array.isArray(industryId)
        ? industryId[0]
        : industryId;

    const industry = industries.find(
        (item) => item.id === id
    );

    const industryModules = modules
        .filter(
            (item) =>
                item.industryId === id
        )
        .sort(
            (a, b) =>
                a.order - b.order
        );

    const industryWords = vocabulary.filter(
        (item) =>
            id &&
            item.industryIds.includes(id)
    );

    if (!industry) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text>
                        業種が見つかりません。
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>

                <RoyalBackButton onPress={() => router.back()} />

                <Text style={styles.label}>
                    業種
                </Text>

                <Text style={styles.title}>
                    {industry.nameJa}
                </Text>

                <Text style={styles.translation}>
                    {industry.nameVi}
                </Text>

                {industry.descriptionVi && (
                    <Text style={styles.description}>
                        {industry.descriptionVi}
                    </Text>
                )}

                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>
                            {industryModules.length}
                        </Text>

                        <Text style={styles.statLabel}>
                            モジュール
                        </Text>
                    </View>

                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>
                            {industryWords.length}
                        </Text>

                        <Text style={styles.statLabel}>
                            関連単語
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>
                    学習モジュール
                </Text>

                {industryModules.map((module) => (
                    <Pressable
                        key={module.id}
                        style={({ pressed }) => [
                            styles.moduleCard,
                            pressed && styles.cardPressed,
                        ]}
                        onPress={() => {
                            router.push({
                                pathname: '/module/[moduleId]',
                                params: {
                                    moduleId: module.id,
                                },
                            });
                        }}
                    >
                        <Text style={styles.moduleIcon}>
                            {module.icon ?? '📘'}
                        </Text>

                        <View style={styles.moduleContent}>
                            <Text style={styles.moduleTitle}>
                                {module.titleJa}
                            </Text>

                            <Text style={styles.moduleTranslation}>
                                {module.titleVi}
                            </Text>

                            {module.descriptionVi && (
                                <Text style={styles.moduleDescription}>
                                    {module.descriptionVi}
                                </Text>
                            )}
                        </View>

                        <Text style={styles.arrow}>
                            ›
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

    label: {
        fontSize: 16,
        fontWeight: '700',
    },

    title: {
        fontSize: 36,
        fontWeight: '800',
        marginTop: 4,
    },

    translation: {
        fontSize: 18,
        marginTop: 6,
    },

    description: {
        fontSize: 15,
        lineHeight: 22,
        marginTop: 14,
    },

    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 28,
    },

    statBox: {
        flex: 1,
        backgroundColor: '#f3f3f3',
        borderRadius: 16,
        padding: 18,
    },

    statNumber: {
        fontSize: 28,
        fontWeight: '800',
    },

    statLabel: {
        fontSize: 16,
        marginTop: 4,
    },

    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginTop: 32,
        marginBottom: 16,
    },

    moduleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
    },

    cardPressed: {
        opacity: 0.6,
    },

    moduleIcon: {
        fontSize: 30,
        width: 52,
    },

    moduleContent: {
        flex: 1,
    },

    moduleTitle: {
        fontSize: 19,
        fontWeight: '700',
    },

    moduleTranslation: {
        fontSize: 16,
        marginTop: 3,
    },

    moduleDescription: {
        fontSize: 16,
        marginTop: 8,
        lineHeight: 19,
    },

    arrow: {
        fontSize: 28,
        marginLeft: 10,
    },
});
