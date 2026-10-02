import { useFocusEffect, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RoyalBackButton, RoyalButton, ROYAL, ROYAL_FONT } from '@/components/ui/RoyalSurface';
import { categoryLabelJa, displayLocationNameJa } from '@/components/world/world-ja';
import { getLifeLocationById, getLifeScenarioById } from '@/services/life-content-repository';
import { loadNpcCollection } from '@/services/npc-progression-storage';

type Completed = { id: string; title: string; location: string; category: string };

export default function DialogueHistory() {
    const [items, setItems] = useState<Completed[]>([]);
    useFocusEffect(useCallback(() => {
        let active = true;
        void loadNpcCollection().then(state => {
            if (!active) return;
            setItems(state.completedScenarioIds.flatMap(id => {
                const scenario = getLifeScenarioById(id);
                const location = scenario?.locationId ? getLifeLocationById(scenario.locationId) : null;
                return scenario && location ? [{ id, title: scenario.name, location: displayLocationNameJa(location.nameJa,location.category), category: location.category ?? 'Other' }] : [];
            }));
        });
        return () => { active = false; };
    }, []));
    const categories = [...new Set(items.map(x => x.category))];
    return <SafeAreaView style={s.screen}>
        <View style={s.header}><RoyalBackButton onPress={() => router.back()} /><Text style={s.title}>学習した会話</Text></View>
        <ScrollView contentContainerStyle={s.content}>
            {!items.length && <Text style={s.empty}>会話を終えると、ここで内容を見直せます。</Text>}
            {categories.map(category => <View key={category} style={s.group}>
                <Text style={s.category}>{categoryLabelJa(category)}</Text>
                {items.filter(x => x.category === category).map(item => <RoyalButton key={item.id} onPress={() => router.push(`/world/dialogue-history/${item.id}`)} style={s.item}>
                    <Text style={s.itemText}>{item.location} · {item.title}</Text>
                </RoyalButton>)}
            </View>)}
        </ScrollView>
    </SafeAreaView>;
}

const s = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#173747' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
    title: { color: ROYAL.paleGold, fontFamily: ROYAL_FONT.heading, fontSize: 22, flexShrink: 1 },
    content: { paddingHorizontal: 18, paddingBottom: 40, gap: 20 },
    empty: { color: '#fff', fontFamily: ROYAL_FONT.body, fontSize: 17, lineHeight: 26 },
    group: { gap: 9 }, category: { color: ROYAL.paleGold, fontFamily: ROYAL_FONT.heading, fontSize: 20 },
    item: { minHeight: 70, width: '100%' }, itemText: { color: '#fff', fontFamily: ROYAL_FONT.body, fontSize: 15, lineHeight: 23, textAlign: 'center', paddingHorizontal: 22 },
});
