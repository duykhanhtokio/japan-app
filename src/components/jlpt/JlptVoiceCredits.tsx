import { StyleSheet, Text, View } from 'react-native';
import { useAppLanguage } from '@/context/LanguageContext';
import { JLPT_ORIGINAL_VOICE_CREDITS } from '@/data/jlpt-original/voice-casting';

const copy = {
  ja: {
    title: 'JLPT練習音声のクレジット',
    description: '練習問題の音声には、音声合成ソフトウェアVOICEVOXと以下の音声を使用しています。',
  },
  vi: {
    title: 'Ghi công giọng đọc luyện thi JLPT',
    description: 'Bản nghe luyện thi sử dụng phần mềm tổng hợp giọng nói VOICEVOX và các giọng sau.',
  },
  en: {
    title: 'JLPT practice voice credits',
    description: 'Practice recordings use the VOICEVOX speech synthesis software and the following voices.',
  },
};

/** Discoverable in Settings; voice names and required credit text stay canonical. */
export function JlptVoiceCredits() {
  const { language } = useAppLanguage();
  const labels = language === 'ja' || language === 'vi' ? copy[language] : copy.en;

  return (
    <View style={styles.panel} testID="jlpt-voice-credits">
      <Text accessibilityRole="header" style={styles.heading}>{labels.title}</Text>
      <Text style={styles.description}>{labels.description}</Text>
      {JLPT_ORIGINAL_VOICE_CREDITS.map(credit => (
        <Text key={credit} selectable style={styles.credit}>{credit}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { marginTop: 20, padding: 16, borderWidth: 1, borderColor: '#72501f', borderRadius: 12, backgroundColor: '#0b1830' },
  heading: { color: '#f2db9b', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  description: { color: '#fffdf7', fontSize: 15, lineHeight: 23, marginBottom: 12 },
  credit: { color: '#fffdf7', fontSize: 15, lineHeight: 24, marginVertical: 3, flexShrink: 1 },
});
