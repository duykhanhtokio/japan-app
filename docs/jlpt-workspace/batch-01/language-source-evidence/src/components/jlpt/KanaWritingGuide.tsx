import { Text } from '@/components/app/LocalizedText';
import { getKanaRomaji } from '@/data/jlpt-learning';
import { KANA_STROKE_ASSETS } from '@/data/kana-stroke-assets';
import * as Speech from 'expo-speech';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';

type Props = {
    kana: string | null;
    learned: boolean;
    onClose: () => void;
    onToggleLearned: () => void;
};

const HIRAGANA_STROKES: Record<string, number> = {
    あ:3,い:2,う:2,え:2,お:3,か:3,き:4,く:1,け:3,こ:2,
    さ:3,し:1,す:2,せ:3,そ:1,た:4,ち:2,つ:1,て:1,と:2,
    な:4,に:3,ぬ:2,ね:2,の:1,は:3,ひ:1,ふ:4,へ:1,ほ:4,
    ま:3,み:2,む:3,め:2,も:3,や:3,ゆ:2,よ:2,
    ら:2,り:2,る:1,れ:2,ろ:1,わ:2,を:3,ん:1,
};

const KATAKANA_STROKES: Record<string, number> = {
    ア:2,イ:2,ウ:3,エ:3,オ:3,カ:2,キ:3,ク:2,ケ:3,コ:2,
    サ:3,シ:3,ス:2,セ:2,ソ:2,タ:3,チ:3,ツ:3,テ:3,ト:2,
    ナ:2,ニ:2,ヌ:2,ネ:4,ノ:1,ハ:2,ヒ:2,フ:1,ヘ:1,ホ:4,
    マ:2,ミ:3,ム:2,メ:2,モ:3,ヤ:2,ユ:2,ヨ:3,
    ラ:2,リ:2,ル:2,レ:1,ロ:3,ワ:2,ヲ:3,ン:2,
};

const BASE_KANA: Record<string, string> = {
    が:'か',ぎ:'き',ぐ:'く',げ:'け',ご:'こ',ざ:'さ',じ:'し',ず:'す',ぜ:'せ',ぞ:'そ',
    だ:'た',ぢ:'ち',づ:'つ',で:'て',ど:'と',ば:'は',び:'ひ',ぶ:'ふ',べ:'へ',ぼ:'ほ',
    ぱ:'は',ぴ:'ひ',ぷ:'ふ',ぺ:'へ',ぽ:'ほ',
    ガ:'カ',ギ:'キ',グ:'ク',ゲ:'ケ',ゴ:'コ',ザ:'サ',ジ:'シ',ズ:'ス',ゼ:'セ',ゾ:'ソ',
    ダ:'タ',ヂ:'チ',ヅ:'ツ',デ:'テ',ド:'ト',バ:'ハ',ビ:'ヒ',ブ:'フ',ベ:'ヘ',ボ:'ホ',
    パ:'ハ',ピ:'ヒ',プ:'フ',ペ:'ヘ',ポ:'ホ',
};

const SMALL_TO_FULL: Record<string, string> = {
    ゃ:'や',ゅ:'ゆ',ょ:'よ',ャ:'ヤ',ュ:'ユ',ョ:'ヨ',
};


function strokeCount(kana: string) {
    return [...kana].reduce((total, character) => {
        const base = BASE_KANA[character] ?? SMALL_TO_FULL[character] ?? character;
        const baseCount = HIRAGANA_STROKES[base] ?? KATAKANA_STROKES[base] ?? 1;
        const markCount = BASE_KANA[character] ? (/[ぱぴぷぺぽパピプペポ]/.test(character) ? 1 : 2) : 0;
        return total + baseCount + markCount;
    }, 0);
}

export default function KanaWritingGuide({ kana, learned, onClose, onToggleLearned }: Props) {
    if (!kana) return null;
    const count = strokeCount(kana);
    const strokeAsset = KANA_STROKE_ASSETS[kana];

    function speak() {
        Speech.stop();
        Speech.speak(kana!, { language: 'ja-JP', rate: 0.62 });
    }

    return <Modal visible animationType="fade" transparent onRequestClose={onClose}>
        <Pressable style={styles.shade} onPress={onClose}>
            <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
                <View style={styles.header}>
                    <View><Text style={styles.eyebrow}>書き順ガイド</Text><Text style={styles.title}>{getKanaRomaji(kana)} · {count}画</Text></View>
                </View>

                <View style={styles.guideImage}>
                    {strokeAsset ? <Image source={strokeAsset} resizeMode="contain" style={styles.strokeImage}/> : <Text style={styles.fallbackKana}>{kana}</Text>}
                </View>

                <Text style={styles.instruction}>数字の順に、●の太い始点から細い終点へ書いてください。</Text>

                <View style={styles.actions}>
                    <Pressable onPress={speak} style={styles.voice}><Text style={styles.voiceIcon}>🔊</Text><View><Text style={styles.voiceTitle}>発音を聞く</Text><Text style={styles.voiceReading}>{kana} · {getKanaRomaji(kana)}</Text></View></Pressable>
                    <Pressable onPress={onToggleLearned} style={[styles.learned, learned && styles.learnedActive]}><Text style={[styles.learnedText, learned && styles.learnedTextActive]}>{learned ? '✓ 覚えた' : '○ 覚えたにする'}</Text></Pressable>
                </View>
            </Pressable>
        </Pressable>
    </Modal>;
}

const styles = StyleSheet.create({
    shade: { flex: 1, backgroundColor: 'rgba(13,22,38,.62)', justifyContent: 'center', padding: 18 },
    sheet: { width: '100%', maxWidth: 620, alignSelf: 'center', backgroundColor: '#e8e2d6', borderRadius: 26, padding: 18 },
    header: { flexDirection: 'row', alignItems: 'center' }, eyebrow: { color: '#4168b5', fontWeight: '900', fontSize: 12, letterSpacing: 1 }, title: { color: '#1e2f48', fontSize: 21, fontWeight: '900', marginTop: 3 },
    guideImage: { width: '100%', aspectRatio: 1.35, maxHeight: 380, alignSelf: 'center', marginTop: 15, borderRadius: 18, backgroundColor: '#fffdf7', borderWidth: 2, borderColor: '#e0cda9', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
    strokeImage: { width: '100%', height: '100%' }, fallbackKana: { color: '#243650', fontSize: 150, lineHeight: 180, fontWeight: '400' }, instruction: { color: '#657286', fontSize: 12, lineHeight: 18, marginTop: 12 },
    actions: { flexDirection: 'row', gap: 9, marginTop: 14 }, voice: { flex: 1.4, minHeight: 58, borderRadius: 15, backgroundColor: '#eaf2ff', flexDirection: 'row', alignItems: 'center', gap: 10, padding: 11 }, voiceIcon: { fontSize: 24 }, voiceTitle: { color: '#294e91', fontWeight: '900' }, voiceReading: { color: '#6380af', fontSize: 11, marginTop: 2 }, learned: { flex: 1, minHeight: 58, borderRadius: 15, backgroundColor: '#eef1f5', alignItems: 'center', justifyContent: 'center', padding: 9 }, learnedActive: { backgroundColor: '#2d9b61' }, learnedText: { color: '#536176', fontWeight: '900', textAlign: 'center' }, learnedTextActive: { color: '#fff' },
});
