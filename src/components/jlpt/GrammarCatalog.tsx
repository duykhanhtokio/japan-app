import { Fragment } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppLanguage } from '@/context/LanguageContext';
import { getGrammarMeaning, getGrammarExampleTranslation, type GeneratedGrammar } from '@/data/jlpt-study-data';
import { getGrammarCopy } from '@/i18n/grammar-copy';
import RoyalPaperPanel from '@/components/ui/RoyalPaperPanel';
import { ROYAL_FONT } from '@/components/ui/RoyalSurface';

type Props = { grammar: GeneratedGrammar[]; learnedIds: string[]; limit: number; onToggle: (id: string) => void };

export default function GrammarCatalog({ grammar, learnedIds, limit, onToggle }: Props) {
    const { language } = useAppLanguage();
    const copy = getGrammarCopy(language);
    const learned = new Set(learnedIds);
    return <>
        <Text testID="grammar-count" style={styles.help}>{copy.count.replace('{count}', String(grammar.length))}</Text>
        <Text testID="grammar-notation-guide" style={styles.help}>{copy.legend}</Text>
        {grammar.slice(0, limit).map(item => {
            const complete = learned.has(item.id);
            return <RoyalPaperPanel key={item.id} style={styles.card}>
                <View testID={`grammar-card-${item.id}`}>
                    <View style={styles.cardTop}>
                        <Text style={styles.itemTitle}>{item.name}</Text>
                        <Pressable testID={`grammar-learned-${item.id}`} accessibilityRole="button"
                            accessibilityState={{ selected: complete }} accessibilityLabel={complete ? copy.learned : copy.mark}
                            style={[styles.mark, complete && styles.marked]} onPress={() => onToggle(item.id)}>
                            <Text>{complete ? `✓ ${copy.learned}` : copy.mark}</Text>
                        </Pressable>
                    </View>
                    {!!item.reading && <Text style={styles.muted}>{item.reading}</Text>}
                    <Text testID={`grammar-meaning-${item.id}`} style={styles.meaning}>{getGrammarMeaning(item, language)}</Text>
                    {!!item.pattern && <Text style={styles.detail}>{copy.structure}: {item.pattern}</Text>}
                    {!!item.formation && <Text style={styles.detail}>{copy.formation}: {item.formation}</Text>}
                    {!!item.exampleJa && <View style={styles.example}>
                        <Text style={styles.muted}>{copy.example}</Text>
                        <Text testID={`grammar-example-ja-${item.id}`} style={styles.exampleJa}>{item.exampleJa}</Text>
                        {!!item.exampleReading && <Text testID={`grammar-example-reading-${item.id}`} style={styles.detail}>{item.exampleReading}</Text>}
                        {language !== 'ja' && <Text testID={`grammar-example-translation-${item.id}`} style={styles.translation}>{getGrammarExampleTranslation(item, language)}</Text>}
                    </View>}
                    {!!item.commonMistakes?.length && <View style={styles.mistakes}>
                        <Text style={styles.muted}>{copy.mistakes}</Text>
                        {item.commonMistakes.map((value, i) => <Fragment key={i}><Text style={styles.detail}>{value}</Text></Fragment>)}
                    </View>}
                </View>
            </RoyalPaperPanel>;
        })}
        {limit < grammar.length && <Text style={styles.loading}>{copy.loading}</Text>}
    </>;
}

const styles = StyleSheet.create({
    help: { fontFamily: ROYAL_FONT.body, color: '#625f57', lineHeight: 23, marginBottom: 15 },
    card: { paddingHorizontal: 28, paddingVertical: 26, marginBottom: 14 },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
    itemTitle: { fontFamily: ROYAL_FONT.body, flex: 1, fontSize: 21, fontWeight: '900', color: '#24231f' },
    mark: { maxWidth: '46%', flexShrink: 1, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#b8b1a5', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
    marked: { backgroundColor: '#dce8dc', borderColor: '#78917d' },
    muted: { fontFamily: ROYAL_FONT.body, color: '#625f57', marginTop: 4 },
    meaning: { fontFamily: ROYAL_FONT.body, fontSize: 16, lineHeight: 25, marginTop: 9, color: '#24231f' },
    detail: { fontFamily: ROYAL_FONT.body, color: '#625f57', lineHeight: 23, marginTop: 7 },
    example: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#b8b1a5', padding: 12, borderRadius: 10, marginTop: 10 },
    exampleJa: { fontFamily: ROYAL_FONT.body, fontSize: 18, fontWeight: '700', marginTop: 5, marginBottom: 5, color: '#24231f' },
    translation: { color: '#24231f', lineHeight: 24, marginTop: 7 },
    mistakes: { marginTop: 12 },
    loading: { textAlign: 'center', color: '#625f57', padding: 18 },
});
