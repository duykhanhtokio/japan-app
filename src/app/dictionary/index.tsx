import { TextInput } from '@/components/app/LocalizedTextInput';
import {
    Text } from '@/components/app/LocalizedText';
import JmdictProvider from '@/components/jmdict/JmdictProvider';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';
import {
    getJmdictMetadata,
    JmdictEntry,
    searchJmdict } from '@/services/jmdict';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback,
    useEffect,
    useRef,
    useState } from 'react';
import { ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PAGE_SIZE = 50;

function DictionaryContent() {
    const db = useSQLiteContext();
    const [query, setQuery] = useState('');
    const [rows, setRows] = useState<JmdictEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [metadata, setMetadata] = useState<Record<string, string>>({});
    const requestId = useRef(0);

    const load = useCallback(async (reset: boolean) => {
        if (loading && !reset) return;
        const id = ++requestId.current;
        const offset = reset ? 0 : rows.length;
        setLoading(true);
        try {
            const result = await searchJmdict(db, query, PAGE_SIZE, offset);
            if (id !== requestId.current) return;
            setRows(current => reset ? result : [...current, ...result]);
            setHasMore(result.length === PAGE_SIZE);
        } finally {
            if (id === requestId.current) setLoading(false);
        }
    }, [db, loading, query, rows.length]);

    useEffect(() => { void getJmdictMetadata(db).then(setMetadata); }, [db]);
    useEffect(() => {
        const timer = setTimeout(() => { void load(true); }, 280);
        return () => clearTimeout(timer);
        // load intentionally changes with row/loading state; query is the search trigger.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, db]);

    return (
        <SafeAreaView style={s.container}>
            <View style={s.header}>
                <RoyalBackButton onPress={() => router.back()} />
                <Text style={s.title}>日本語辞書</Text>
                <Text style={s.subtitle}>Tra cứu toàn bộ {Number(metadata.entryCount || 0).toLocaleString()} mục JMdict</Text>
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="日本語・かな・English"
                    style={s.search}
                />
            </View>
            <FlatList
                data={rows}
                keyExtractor={item => String(item.seq)}
                contentContainerStyle={s.list}
                keyboardShouldPersistTaps="handled"
                onEndReached={() => { if (hasMore && !loading) void load(false); }}
                onEndReachedThreshold={0.5}
                renderItem={({ item }) => (
                    <Pressable style={s.card} onPress={() => router.push(`/dictionary/${item.seq}`)}>
                        <View style={s.wordLine}>
                            <Text style={s.word}>{item.headword}</Text>
                            {!!item.common && <Text style={s.common}>COMMON</Text>}
                        </View>
                        <Text style={s.reading}>{item.reading}</Text>
                        <Text style={s.gloss} numberOfLines={3}>{item.glosses.slice(0, 4).join('; ')}</Text>
                    </Pressable>
                )}
                ListFooterComponent={loading ? <ActivityIndicator style={s.loader} color="#4263eb" /> : null}
                ListEmptyComponent={!loading ? <Text style={s.empty}>Không tìm thấy mục phù hợp.</Text> : null}
            />
            <View style={s.credit}>
                <Text style={s.creditText}>JMdict/EDRDG • CC BY-SA 4.0 • dữ liệu {metadata.dictDate || '—'}</Text>
            </View>
        </SafeAreaView>
    );
}

export default function DictionaryScreen() {
    return <JmdictProvider><DictionaryContent /></JmdictProvider>;
}

const s = StyleSheet.create({
    container:{flex:1,backgroundColor:'#f6f8fc'},header:{paddingHorizontal:18,paddingTop:8},back:{fontSize:16,marginBottom:12},title:{fontSize:30,fontWeight:'900'},subtitle:{color:'#667085',marginTop:3},search:{backgroundColor:'#e8e2d6',borderRadius:14,paddingHorizontal:15,paddingVertical:13,fontSize:17,marginTop:14,marginBottom:10},list:{padding:18,paddingTop:4,paddingBottom:70},card:{backgroundColor:'#e8e2d6',borderRadius:15,padding:16,marginBottom:11},wordLine:{flexDirection:'row',alignItems:'center',gap:9},word:{fontSize:24,fontWeight:'900',flexShrink:1},common:{fontSize:9,fontWeight:'900',color:'#087f5b',backgroundColor:'#d3f9d8',paddingHorizontal:7,paddingVertical:3,borderRadius:7,overflow:'hidden'},reading:{color:'#667085',marginTop:3},gloss:{fontSize:15,lineHeight:21,marginTop:8},loader:{padding:22},empty:{textAlign:'center',color:'#667085',padding:30},credit:{position:'absolute',bottom:0,left:0,right:0,backgroundColor:'#eef2ff',padding:8},creditText:{textAlign:'center',fontSize:10,color:'#475467'},
});
