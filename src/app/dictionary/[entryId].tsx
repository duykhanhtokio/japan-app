import { Text } from '@/components/app/LocalizedText';
import JmdictProvider from '@/components/jmdict/JmdictProvider';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';
import {
    getJmdictEntry,
    JmdictEntry } from '@/services/jmdict';
import { router,
    useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect,
    useState } from 'react';
import type { ReactNode } from 'react';
import { ActivityIndicator,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const POS: Record<string,string> = {n:'Danh từ',adj_i:'Tính từ い',adj_na:'Tính từ な',adv:'Trạng từ',exp:'Cụm từ',prt:'Trợ từ',v1:'Động từ nhóm 2',v5u:'Động từ nhóm 1',v5k:'Động từ nhóm 1',v5g:'Động từ nhóm 1',v5s:'Động từ nhóm 1',v5t:'Động từ nhóm 1',v5n:'Động từ nhóm 1',v5b:'Động từ nhóm 1',v5m:'Động từ nhóm 1',v5r:'Động từ nhóm 1',vs:'Động từ する',vk:'Động từ 来る'};

function EntryContent() {
    const db = useSQLiteContext();
    const params = useLocalSearchParams();
    const raw = Array.isArray(params.entryId) ? params.entryId[0] : params.entryId;
    const seq = Number(raw);
    const [entry, setEntry] = useState<JmdictEntry | null>();
    useEffect(() => { void getJmdictEntry(db, seq).then(setEntry); }, [db, seq]);
    if (entry === undefined) return <SafeAreaView style={s.container}><ActivityIndicator style={s.loading} /></SafeAreaView>;
    if (!entry) return <SafeAreaView style={s.container}><View style={s.content}><RoyalBackButton onPress={() => router.back()} /><Text style={s.missing}>単語が見つかりません。</Text></View></SafeAreaView>;
    return <SafeAreaView style={s.container}><ScrollView contentContainerStyle={s.content}>
        <RoyalBackButton onPress={() => router.back()} />
        {!!entry.common&&<Text style={s.common}>よく使う言葉・Common</Text>}
        <Text style={s.word}>{entry.headword}</Text><Text style={s.reading}>{entry.reading}</Text>
        <Section title="意味・English meanings">{entry.glosses.map((x,i)=><Text key={i} style={s.gloss}>{i+1}. {x}</Text>)}</Section>
        {entry.kanji.length>0&&<Section title="表記・Cách viết"><Text style={s.value}>{entry.kanji.join('・')}</Text></Section>}
        <Section title="読み方・Cách đọc"><Text style={s.value}>{entry.kana.join('・')}</Text></Section>
        {entry.partsOfSpeech.length>0&&<Section title="品詞・Loại từ"><Text style={s.value}>{entry.partsOfSpeech.map(x=>POS[x]||x).join('・')}</Text></Section>}
        {entry.fields.length>0&&<Section title="分野・Lĩnh vực"><Text style={s.value}>{entry.fields.join('・')}</Text></Section>}
        {entry.misc.length>0&&<Section title="注記・Nhãn"><Text style={s.value}>{entry.misc.join('・')}</Text></Section>}
        <Text style={s.source}>JMdict sequence: {entry.seq}{'\n'}JMdict/EDRDG • CC BY-SA 4.0</Text>
    </ScrollView></SafeAreaView>;
}
function Section({title,children}:{title:string;children:ReactNode}){return <View style={s.section}><Text style={s.label}>{title}</Text><View style={s.box}>{children}</View></View>}
export default function DictionaryEntryScreen(){return <JmdictProvider><EntryContent/></JmdictProvider>}
const s=StyleSheet.create({container:{flex:1,backgroundColor:'#f6f8fc'},content:{padding:22,paddingBottom:60},loading:{marginTop:80},back:{fontSize:16,marginBottom:22},common:{color:'#087f5b',fontWeight:'900'},word:{fontSize:42,fontWeight:'900',marginTop:7},reading:{fontSize:20,color:'#667085',marginTop:5},section:{marginTop:25},label:{fontWeight:'900',color:'#475467',marginBottom:8},box:{backgroundColor:'#e8e2d6',padding:16,borderRadius:14},gloss:{fontSize:17,lineHeight:25,marginBottom:4},value:{fontSize:17,lineHeight:25},source:{fontSize:11,color:'#667085',marginTop:30,lineHeight:17},missing:{marginTop:30}});
