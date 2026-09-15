import { generatedVocabulary, isJlptLevel } from '@/data/jlpt-learning';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';
const PAGE_SIZE = 50;
export default function VocabularyScreen() {
 const params=useLocalSearchParams(); const raw=Array.isArray(params.level)?params.level[0]:params.level; const level=isJlptLevel(raw)?raw:'N5';
 const [query,setQuery]=useState(''); const [limit,setLimit]=useState(PAGE_SIZE);
 const words=useMemo(()=>{const q=query.trim().toLocaleLowerCase(); return generatedVocabulary.filter(x=>x.status!=='Rejected'&&(q?`${x.word} ${x.reading} ${x.meaningVi} ${x.meaningEn??''}`.toLocaleLowerCase().includes(q):x.jlpt===level));},[level,query]);
 return <SafeAreaView style={s.container}><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
  <RoyalBackButton onPress={()=>router.back()} /><Text style={s.level}>{level}</Text><Text style={s.title}>📝 単語</Text><Text style={s.count}>{words.length} từ vựng</Text>
  <TextInput value={query} onChangeText={v=>{setQuery(v);setLimit(PAGE_SIZE);}} placeholder="Tra toàn bộ 8.350 từ: Nhật, cách đọc, nghĩa..." style={s.search}/>
  {!!query.trim()&&<Text style={s.searchNotice}>Đang tìm trong toàn bộ N5–N1 • {words.length} kết quả</Text>}
  {words.slice(0,limit).map(x=><Pressable key={x.id} style={s.card} onPress={()=>router.push(`/${x.jlpt}/vocabulary/${x.id}`)}><View style={s.row}><View style={s.wordRow}><Text style={s.word}>{x.word}</Text><Text style={s.badge}>{x.jlpt}</Text></View><Text style={s.arrow}>›</Text></View><Text style={s.reading}>{x.reading}</Text><Text style={s.meaning}>{x.meaningVi}</Text>{!!x.exampleJa&&<View style={s.example}><Text>{x.exampleJa}</Text><Text style={s.exampleVi}>{x.exampleVi}</Text></View>}</Pressable>)}
  {limit<words.length&&<Pressable style={s.more} onPress={()=>setLimit(v=>v+PAGE_SIZE)}><Text style={s.moreText}>Xem thêm {PAGE_SIZE} từ</Text></Pressable>}
 </ScrollView></SafeAreaView>;
}
const s=StyleSheet.create({container:{flex:1,backgroundColor:'#e8e2d6'},content:{padding:20,paddingBottom:60,backgroundColor:'#e8e2d6'},back:{fontSize:16,marginBottom:18},level:{color:'#50745c',fontWeight:'800',fontSize:18},title:{fontSize:30,fontWeight:'800',marginTop:4,color:'#24231f'},count:{color:'#625f57',marginTop:5,marginBottom:15},search:{backgroundColor:'#e8e2d6',borderWidth:1,borderColor:'#b8b1a5',borderRadius:13,paddingHorizontal:15,paddingVertical:13,fontSize:16,marginBottom:8,color:'#24231f'},searchNotice:{color:'#50745c',fontWeight:'700',marginBottom:14},card:{backgroundColor:'#e8e2d6',borderWidth:1,borderColor:'#b8b1a5',borderRadius:16,padding:17,marginBottom:12},row:{flexDirection:'row',justifyContent:'space-between'},wordRow:{flexDirection:'row',alignItems:'center',gap:9},word:{fontSize:25,fontWeight:'800',color:'#24231f'},badge:{backgroundColor:'#dce8dc',color:'#50745c',fontWeight:'800',paddingHorizontal:8,paddingVertical:3,borderRadius:8,overflow:'hidden'},arrow:{fontSize:28,color:'#756f65'},reading:{color:'#625f57',marginTop:3},meaning:{fontSize:16,fontWeight:'600',marginTop:9,color:'#24231f'},example:{backgroundColor:'#e8e2d6',borderWidth:1,borderColor:'#b8b1a5',borderRadius:10,padding:11,marginTop:10},exampleVi:{color:'#625f57',marginTop:5},more:{padding:18,alignItems:'center'},moreText:{color:'#50745c',fontWeight:'800'}});
