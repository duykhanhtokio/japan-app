import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import data from '@/data/food-manufacturing/safety-signs.json';
import { RoyalContentPanel } from '@/components/ui/RoyalPanels';
import { TranslationText } from '@/components/tokutei/StudyAppearance';
import { FoodRubyText } from './FoodRubyText';

type Props = {
  lessonId: string;
  language: string;
  showTranslation: boolean;
  showReadings?: boolean;
  textColor: string;
};
type Translation = { label: string; action: string };

/** Original, source-mapped vectors; expo-image is already a project dependency. */
const signs = data.signs.map(sign => ({
  ...sign,
  image: { uri: `data:image/svg+xml;utf8,${encodeURIComponent(sign.svg)}` },
}));

function segments(annotated: string) {
  const result: { text: string; reading?: string }[] = [];
  const pattern = /([\u3400-\u9fff々]+)\{([ぁ-ゖー]+)\}/g;
  let position = 0;
  for (const match of annotated.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > position) result.push({ text: annotated.slice(position, start) });
    result.push({ text: match[1], reading: match[2] });
    position = start + match[0].length;
  }
  if (position < annotated.length) result.push({ text: annotated.slice(position) });
  return result;
}

/** Recognition cards belong only to the dedicated fifteen-sign lesson. */
export function FoodSafetySigns({ lessonId, language, showTranslation, textColor, showReadings = true }: Props) {
  if (!data.lessonIds.includes(lessonId)) return null;
  const introduction = showTranslation && language !== 'ja'
    ? (data.translations as Record<string, { title: string; note: string }>)[language]
    : undefined;
  return <View testID="food-safety-signs" style={styles.section}>
    <FoodRubyText text={data.titleJa} segments={showReadings ? segments(data.titleRuby) : undefined} style={[styles.heading, { color: textColor }]} />
    {introduction && <TranslationText>{introduction.title}</TranslationText>}
    <View style={styles.grid}>
      {signs.map(sign => {
        const translation = showTranslation && language !== 'ja'
          ? (sign.translations as Record<string, Translation>)[language]
          : undefined;
        return <View key={sign.id} testID={`food-safety-sign-${sign.id}`} style={styles.slot}>
          <RoyalContentPanel style={styles.card}>
            <View style={styles.imageRow}>
              <Text accessible={false} style={[styles.number, { color: textColor }]}>{sign.number}</Text>
              <Image
                source={sign.image}
                style={styles.image}
                contentFit="contain"
                transition={0}
                accessible
                accessibilityLabel={translation ? `${sign.labelJa}。${translation.label}` : sign.labelJa}
              />
            </View>
            <FoodRubyText text={sign.labelJa} segments={showReadings ? segments(sign.labelRuby) : undefined} style={[styles.label, { color: textColor }]} />
            {translation && <TranslationText>{translation.label}</TranslationText>}
            <FoodRubyText text={sign.actionJa} segments={showReadings ? segments(sign.actionRuby) : undefined} style={[styles.action, { color: textColor }]} />
            {translation && <TranslationText>{translation.action}</TranslationText>}
          </RoyalContentPanel>
        </View>;
      })}
    </View>
    <FoodRubyText text={data.noteJa} segments={showReadings ? segments(data.noteRuby) : undefined} style={[styles.note, { color: textColor }]} />
    {introduction && <TranslationText>{introduction.note}</TranslationText>}
  </View>;
}

const styles = StyleSheet.create({
  section: { gap: 14, marginVertical: 14 },
  heading: { fontSize: 18, lineHeight: 29, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  slot: { flexBasis: 260, flexGrow: 1, flexShrink: 1, minWidth: 0, maxWidth: '100%' },
  card: { padding: 14, gap: 10, flexGrow: 1 },
  imageRow: { alignItems: 'center', justifyContent: 'center', minHeight: 160 },
  number: { alignSelf: 'flex-start', fontSize: 14 },
  image: { width: 144, height: 144, backgroundColor: '#ffffff' },
  label: { fontSize: 17, lineHeight: 28, fontWeight: '700' },
  action: { fontSize: 16, lineHeight: 26 },
  note: { fontSize: 14, lineHeight: 24 },
});
