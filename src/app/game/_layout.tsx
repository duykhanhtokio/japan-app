import { Slot, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import SafeAreaView from '@/components/ui/StableSafeAreaView';
import { RELEASE_FEATURES } from '@/config/release-features';
import { useAppLanguage } from '@/context/LanguageContext';

/** Layout guard covers direct links and restored child routes without mounting farm code. */
export default function GameReleaseGate() {
    const { language } = useAppLanguage();
    if (RELEASE_FEATURES.farmEnabled) return <Slot />;
    const vi = language === 'vi', ja = language === 'ja';
    return <SafeAreaView style={s.page}><View style={s.panel}>
        <Text style={s.title}>{vi ? 'Game đang phát triển' : ja ? 'ゲームは準備中です' : 'Game in development'}</Text>
        <Text style={s.copy}>{vi ? 'Nông trại sẽ có trong bản cập nhật sau. Hãy tiếp tục học và làm nhiệm vụ từ vựng hằng ngày.' : ja ? '農場は今後のアップデートで公開します。毎日の単語ミッションをお楽しみください。' : 'The farm will arrive in a later update. Continue learning with the daily vocabulary mission.'}</Text>
        <Pressable accessibilityRole="button" style={s.button} onPress={() => router.replace('/tasks')}><Text>{vi ? 'Nhiệm vụ ngày' : ja ? '毎日のミッション' : 'Daily mission'}</Text></Pressable>
        <Pressable accessibilityRole="button" style={s.button} onPress={() => router.replace('/home')}><Text>{vi ? 'Trang chủ' : ja ? 'ホーム' : 'Home'}</Text></Pressable>
    </View></SafeAreaView>;
}
const s = StyleSheet.create({page:{flex:1,backgroundColor:'#0b1830',justifyContent:'center',padding:24},panel:{borderWidth:1,borderColor:'#cba55a',borderRadius:18,padding:24,gap:20},title:{fontSize:24,color:'#f2db9b',fontWeight:'700'},copy:{fontSize:17,lineHeight:26,color:'#fffdf7'},button:{padding:16,backgroundColor:'#f2db9b',borderRadius:12,alignItems:'center'}});
