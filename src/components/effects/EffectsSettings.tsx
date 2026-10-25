import { StyleSheet, Switch, Text, View } from 'react-native';
import { useAppLanguage } from '@/context/LanguageContext';
import type { AppLanguageCode } from '@/i18n/languages';
import { useEffects, type EffectPreferences } from './EffectsProvider';

const copy: Record<AppLanguageCode, readonly [string, string, string, string, string]> = {
  ja: ['演出設定', '光の演出', '画面の動き', '操作音', 'BGM'],
  vi: ['Hiệu ứng', 'Ánh sáng', 'Chuyển động và chuyển cảnh', 'Âm thanh thao tác', 'Nhạc nền'],
  en: ['Effects', 'Lighting', 'Motion and transitions', 'Button sounds', 'Background music'],
  id: ['Efek', 'Pencahayaan', 'Gerakan dan transisi', 'Suara tombol', 'Musik latar'],
  'zh-CN': ['效果设置', '光效', '动态效果与转场', '按键音效', '背景音乐'],
  'zh-TW': ['效果設定', '光效', '動態效果與轉場', '按鍵音效', '背景音樂'],
  hi: ['इफ़ेक्ट', 'रोशनी के प्रभाव', 'हलचल और स्क्रीन बदलाव', 'बटन की आवाज़', 'बैकग्राउंड संगीत'],
  bn: ['ইফেক্ট', 'আলোর ইফেক্ট', 'নড়াচড়া ও স্ক্রিন পরিবর্তন', 'বোতামের শব্দ', 'পটভূমির সংগীত'],
  ne: ['इफेक्टहरू', 'प्रकाश प्रभाव', 'चाल र स्क्रिन परिवर्तन', 'बटनको आवाज', 'पृष्ठभूमि सङ्गीत'],
  my: ['အထူးပြုလုပ်ချက်များ', 'အလင်းအထူးပြုလုပ်ချက်', 'လှုပ်ရှားမှုနှင့် မျက်နှာပြင်အကူးအပြောင်း', 'ခလုတ်နှိပ်သံ', 'နောက်ခံတေးဂီတ'],
  th: ['เอฟเฟกต์', 'เอฟเฟกต์แสง', 'การเคลื่อนไหวและการเปลี่ยนหน้าจอ', 'เสียงปุ่ม', 'เพลงพื้นหลัง'],
  km: ['បែបផែន', 'បែបផែនពន្លឺ', 'ចលនា និងការប្តូរអេក្រង់', 'សំឡេងចុចប៊ូតុង', 'តន្ត្រីផ្ទៃខាងក្រោយ'],
  tl: ['Mga effect', 'Ilaw', 'Galaw at paglipat ng screen', 'Tunog ng mga button', 'Musika sa background'],
};
const keys: (keyof EffectPreferences)[] = ['sound', 'music'];
export function EffectsSettings() {
  const { language } = useAppLanguage();
  const { preferences, ready, update } = useEffects();
  const labels = copy[language];
  return <View style={s.panel}>
    <Text style={s.heading}>{labels[0]}</Text>
    {keys.map((key, index) => <View key={key} style={s.row}>
      <Text style={s.label}>{labels[index + 3]}</Text>
      <Switch accessibilityLabel={labels[index + 3]} disabled={!ready} value={preferences[key]}
        onValueChange={value => update(key, value)} trackColor={{ false: '#596477', true: '#8a692b' }} thumbColor="#f2db9b" />
    </View>)}
  </View>;
}
const s = StyleSheet.create({
  panel: { marginTop: 20, padding: 16, borderWidth: 1, borderColor: '#72501f', borderRadius: 12, backgroundColor: '#0b1830' },
  heading: { color: '#f2db9b', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52 },
  label: { flex: 1, flexShrink: 1, color: '#fffdf7', fontSize: 15, lineHeight: 23 },
});
