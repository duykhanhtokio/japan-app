import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import catalog from '@/data/food-manufacturing/illustrations.json';
import { TranslationText } from '@/components/tokutei/StudyAppearance';

const sources: Record<string, ImageSourcePropType> = {
  hygiene: require('../../data/food-manufacturing/illustrations/hygiene.png'),
  'cross-contamination': require('../../data/food-manufacturing/illustrations/cross-contamination.png'),
  'protective-clothing': require('../../data/food-manufacturing/illustrations/protective-clothing.png'),
  'hazard-recognition': require('../../data/food-manufacturing/illustrations/hazard-recognition.png'),
  'machine-safety': require('../../data/food-manufacturing/illustrations/machine-safety.png'),
  'monitoring-records': require('../../data/food-manufacturing/illustrations/monitoring-records.png'),
};

type Props = {
  lessonId: string;
  language: string;
  showTranslation: boolean;
  textColor: string;
};

export function FoodIllustrations({ lessonId, language, showTranslation, textColor }: Props) {
  return <>{catalog.illustrations.filter(item => item.lessonIds.includes(lessonId)).map(item => {
    const translations = item.translations as Record<string, { caption: string }>;
    const caption = showTranslation && language !== 'ja' ? translations[language]?.caption : undefined;
    return <View key={item.id} style={styles.figure} testID={`food-illustration-${item.id}`}>
      <Image
        source={sources[item.id]}
        style={[styles.image, { aspectRatio: item.width / item.height }]}
        resizeMode="cover"
        accessible
        accessibilityLabel={item.captionJa}
      />
      <Text selectable style={[styles.caption, { color: textColor }]}>{item.captionJa}</Text>
      {caption && <TranslationText>{caption}</TranslationText>}
    </View>;
  })}</>;
}

const styles = StyleSheet.create({
  figure: { width: '100%', gap: 10, marginVertical: 12 },
  image: { width: '100%', borderRadius: 10 },
  caption: { fontSize: 16, lineHeight: 27 },
});
