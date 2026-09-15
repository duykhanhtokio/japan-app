import { generatedVocabulary } from '@/data/jlpt-learning';
import { getJlptProgress, toggleLearnedId } from '@/services/jlpt-progress-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';
export default function VocabularyDetailScreen(){
 const p=useLocalSearchParams(); const id=Array.isArray(p.wordId)?p.wordId[0]:p.wordId; const word=generatedVocabulary.find(x=>x.id===id); const [learned,setLearned]=useState(false);
 useEffect(()=>{if(id)void getJlptProgress().then(v=>setLearned(v.learnedIds.includes(id)));},[id]);
 if(!word)return <SafeAreaView style={s.container}><View style={s.content}><RoyalBackButton onPress={()=>router.back()} /><Text>単語が見つかりません。</Text></View></SafeAreaView>;
 async function toggle(){const next=await toggleLearnedId(word!.id);setLearned(next.learnedIds.includes(word!.id));}
 return <SafeAreaView style={s.container}><ScrollView contentContainerStyle={s.content}><RoyalBackButton onPress={()=>router.back()} /><Text style={s.level}>{word.jlpt}</Text><Text style={s.word}>{word.word}</Text><Text style={s.reading}>{word.reading}</Text><View style={s.section}><Text style={s.label}>意味・Nghĩa</Text><Text style={s.meaning}>{word.meaningVi}</Text>{!!word.meaningEn&&<Text style={s.english}>{word.meaningEn}</Text>}</View>{!!word.exampleJa&&<View style={s.section}><Text style={s.label}>例文・Ví dụ</Text><View style={s.example}><Text style={s.exampleJa}>{word.exampleJa}</Text><Text>{word.exampleVi}</Text></View></View>}<Pressable style={[s.button,learned&&s.done]} onPress={()=>void toggle()}><Text style={s.buttonText}>{learned?'✓ Đã thuộc':'Đánh dấu đã học'}</Text></Pressable></ScrollView></SafeAreaView>;
}
const s=StyleSheet.create({container:{flex:1,backgroundColor:'#e8e2d6'},content:{padding:22,paddingBottom:60,backgroundColor:'#e8e2d6'},back:{fontSize:16,marginBottom:24},level:{color:'#50745c',fontSize:18,fontWeight:'800'},word:{fontSize:44,fontWeight:'900',marginTop:8,color:'#24231f'},reading:{fontSize:21,color:'#625f57',marginTop:5},section:{marginTop:28},label:{fontWeight:'800',color:'#625f57',marginBottom:9},meaning:{fontSize:23,fontWeight:'700',color:'#24231f'},english:{color:'#625f57',marginTop:5},example:{backgroundColor:'#e8e2d6',borderWidth:1,borderColor:'#b8b1a5',padding:17,borderRadius:14},exampleJa:{fontSize:19,fontWeight:'600',marginBottom:8,color:'#24231f'},button:{backgroundColor:'#50745c',padding:16,borderRadius:14,alignItems:'center',marginTop:32},done:{backgroundColor:'#3f6b4f'},buttonText:{color:'#e8e2d6',fontWeight:'800',fontSize:16}});
