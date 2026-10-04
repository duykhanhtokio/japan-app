import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RoyalBackButton, ROYAL, ROYAL_FONT } from '@/components/ui/RoyalSurface';
import { useAppLanguage } from '@/context/LanguageContext';
import { getLifeLocationById, getLifeScenarioById } from '@/services/life-content-repository';
import { loadDialogueTurns } from '@/services/dialogue-content-loader';
import { loadNpcCollection } from '@/services/npc-progression-storage';
import { displayLocationNameJa } from '@/components/world/world-ja';

export default function CompletedDialogue() {
    const raw = useLocalSearchParams<{ scenarioId: string }>().scenarioId;
    const id = Array.isArray(raw) ? raw[0] : raw;
    const [completed, setCompleted] = useState(false);
    useEffect(() => {
        let active = true;
        setCompleted(false);
        void loadNpcCollection().then(state => { if (active) setCompleted(!!id && state.completedScenarioIds.includes(id)); });
        return () => { active = false; };
    }, [id]);
    const scenario = id ? getLifeScenarioById(id) : null;
    const location = scenario?.locationId ? getLifeLocationById(scenario.locationId) : null;
    const turns = completed && id ? loadDialogueTurns(id) : [];
    const { language } = useAppLanguage();
    return <SafeAreaView style={s.screen}>
        <View style={s.header}><RoyalBackButton onPress={() => router.back()} /><Text style={s.title}>{location ? displayLocationNameJa(location.nameJa,location.category) : '会話'} · {scenario?.name ?? ''}</Text></View>
        <ScrollView contentContainerStyle={s.content}>
            {!turns.length && <Text style={s.empty}>会話データがありません。</Text>}
            {turns.map((turn, index) => {
                const npc = turn.speaker === 'NPC';
                const data = npc ? turn.npc : turn.player;
                const japanese = npc ? turn.npc?.textJa : turn.player?.recommendedAnswerJa;
                const reading = npc ? turn.npc?.furigana : turn.player?.recommendedAnswerFurigana;
                const translated = data?.translations?.[language] ?? (language === 'vi' && npc ? turn.npc?.translationVi : null);
                return <View key={turn.id} style={s.card}>
                    <Text style={s.speaker}>{index + 1}. {npc ? 'NPC' : 'プレイヤー'}</Text>
                    <Text style={s.japanese}>{japanese}</Text>
                    {!!reading && <Text style={s.reading}>{reading}</Text>}
                    {!!translated && <Text style={s.translation}>{translated}</Text>}
                </View>;
            })}
        </ScrollView>
    </SafeAreaView>;
}

const s = StyleSheet.create({
    screen: { flex: 1, backgroundColor: 'transparent' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
    title: { flex: 1, color: ROYAL.paleGold, fontFamily: ROYAL_FONT.heading, fontSize: 19 },
    content: { padding: 16, paddingBottom: 42, gap: 12 },
    empty: { color: '#fff', fontFamily: ROYAL_FONT.body, fontSize: 16 },
    card: { backgroundColor: '#fff8e8', borderColor: '#c69b55', borderWidth: 2, borderRadius: 15, padding: 16, gap: 6 },
    speaker: { color: '#725124', fontFamily: ROYAL_FONT.heading, fontSize: 15 },
    japanese: { color: '#2a2b2b', fontFamily: ROYAL_FONT.body, fontSize: 18, lineHeight: 28 },
    reading: { color: '#59636b', fontFamily: ROYAL_FONT.body, fontSize: 14, lineHeight: 22 },
    translation: { color: '#40566b', fontFamily: ROYAL_FONT.body, fontSize: 15, lineHeight: 23 },
});
