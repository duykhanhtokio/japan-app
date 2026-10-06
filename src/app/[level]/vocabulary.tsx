import SafeAreaView from '@/components/ui/StableSafeAreaView';
import { pushPrepared, backPrepared } from '@/components/ui/prepareSceneRoute';
import { RoyalContentPanel } from '@/components/ui/RoyalPanels';
import JlptStudyBackground from '@/components/jlpt/JlptStudyBackground';
import { generatedVocabulary, isJlptLevel } from '@/data/jlpt-study-data';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { RoyalBackButton, ROYAL_LAYOUT, ROYAL_FONT } from '@/components/ui/RoyalSurface';
const PAGE_SIZE = 50;
export default function VocabularyScreen() {
 const params=useLocalSearchParams(); const raw=Array.isArray(params.level)?params.level[0]:params.level; const level=isJlptLevel(raw)?raw:'N5';
 const [query,setQuery]=useState(''); const [limit,setLimit]=useState(8);
 const words=useMemo(()=>{const q=query.trim().toLocaleLowerCase(); return generatedVocabulary.filter(x=>x.status!=='Rejected'&&(q?`${x.word} ${x.reading} ${x.meaningVi} ${x.meaningEn??''}`.toLocaleLowerCase().includes(q):x.jlpt===level));},[level,query]);
 return <JlptStudyBackground><SafeAreaView style={s.container}><View style={s.header}><RoyalBackButton onPress={()=>backPrepared()} /></View><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
  <Text style={s.level}>{level}</Text><Text style={s.title}>単語</Text><Text style={s.count}>{words.length} từ vựng</Text>
  <TextInput value={query} onChangeText={v=>{setQuery(v);setLimit(8);}} placeholder="Tra toàn bộ 8.350 từ: Nhật, cách đọc, nghĩa..." placeholderTextColor="#586373" selectionColor="#72501f" style={s.search}/>
  {!!query.trim()&&<Text style={s.searchNotice}>Đang tìm trong toàn bộ N5–N1 • {words.length} kết quả</Text>}
  {words.slice(0,limit).map(x=><Pressable key={x.id} style={{marginBottom:12}} onPress={()=>pushPrepared(`/${x.jlpt}/vocabulary/${x.id}`)}><RoyalContentPanel style={s.card}><View style={s.row}><View style={s.wordRow}><Text style={s.word}>{x.word}</Text><Text style={s.badge}>{x.jlpt}</Text></View><Text style={s.arrow}>›</Text></View><Text style={s.reading}>{x.reading}</Text><Text style={s.meaning}>{x.meaningVi}</Text>{!!x.exampleJa&&<View style={s.example}><Text style={{color:'#142847',fontFamily:ROYAL_FONT.body}}>{x.exampleJa}</Text><Text style={s.exampleVi}>{x.exampleVi}</Text></View>}</RoyalContentPanel></Pressable>)}
  {limit<words.length&&<Pressable style={s.more} onPress={()=>setLimit(v=>v+PAGE_SIZE)}><Text style={s.moreText}>Xem thêm {PAGE_SIZE} từ</Text></Pressable>}
 </ScrollView></SafeAreaView></JlptStudyBackground>;
}
const s=StyleSheet.create({container:{flex:1,backgroundColor:'transparent'},header:{paddingHorizontal:ROYAL_LAYOUT.screenGutter,paddingTop:ROYAL_LAYOUT.backSafeTop,paddingBottom:6,backgroundColor:'transparent'},content:{padding:20,paddingBottom:60,backgroundColor:'transparent'},back:{fontSize:16,marginBottom:18},level:{fontFamily:ROYAL_FONT.body,color:'#50745c',fontWeight:'800',fontSize:18},title:{fontFamily:ROYAL_FONT.body,fontSize:30,fontWeight:'800',marginTop:4,color:'#24231f'},count:{fontFamily:ROYAL_FONT.body,color:'#625f57',marginTop:5,marginBottom:15},search:{fontFamily:ROYAL_FONT.body,backgroundColor:'transparent',borderWidth:1,borderColor:'#b8b1a5',borderRadius:13,paddingHorizontal:15,paddingVertical:13,fontSize:16,marginBottom:8,color:'#24231f'},searchNotice:{fontFamily:ROYAL_FONT.body,color:'#50745c',fontWeight:'700',marginBottom:14},card:{paddingHorizontal:28,paddingVertical:26},row:{flexDirection:'row',justifyContent:'space-between'},wordRow:{flexDirection:'row',alignItems:'center',gap:9},word:{fontFamily:ROYAL_FONT.body,fontSize:25,fontWeight:'800',color:'#24231f'},badge:{fontFamily:ROYAL_FONT.body,backgroundColor:'#dce8dc',color:'#50745c',fontWeight:'800',paddingHorizontal:8,paddingVertical:3,borderRadius:8,overflow:'hidden'},arrow:{fontFamily:ROYAL_FONT.body,fontSize:28,color:'#756f65'},reading:{fontFamily:ROYAL_FONT.body,color:'#625f57',marginTop:3},meaning:{fontFamily:ROYAL_FONT.body,fontSize:16,fontWeight:'600',marginTop:9,color:'#24231f'},example:{backgroundColor:'transparent',borderWidth:1,borderColor:'#b8b1a5',padding:12,borderRadius:10,marginTop:10},exampleVi:{fontFamily:ROYAL_FONT.body,color:'#38465a',marginTop:5},more:{padding:18,alignItems:'center'},moreText:{fontFamily:ROYAL_FONT.body,color:'#50745c',fontWeight:'800'}});
