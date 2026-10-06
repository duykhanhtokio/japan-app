import { replacePrepared, backPrepared } from '@/components/ui/prepareSceneRoute';
import SafeAreaView from '@/components/ui/StableSafeAreaView';
import RoyalPaperPanel from '@/components/ui/RoyalPaperPanel';
import JlptStudyBackground from '@/components/jlpt/JlptStudyBackground';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import * as Speech from 'expo-speech';
import {
    generatedGrammar, getKanaRomaji, hiraganaCombinationRows, hiraganaRows,
    hiraganaVoicedRows, isJlptLevel, katakanaCombinationRows, katakanaRows,
    katakanaVoicedRows, type LearningSection,
} from '@/data/jlpt-study-data';
import { getJlptProgress, toggleLearnedId } from '@/services/jlpt-progress-storage';
import { RoyalBackButton, ROYAL_LAYOUT, ROYAL_FONT } from '@/components/ui/RoyalSurface';

const PAGE_SIZE = 8;
function param(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }

export default function JlptSectionScreen() {
    const params = useLocalSearchParams();
    const levelValue = param(params.level);
    const sectionValue = param(params.section) as LearningSection | undefined;
    const level = isJlptLevel(levelValue) ? levelValue : 'N5';
    const section = sectionValue === 'grammar' || sectionValue === 'test' || (sectionValue === 'characters' && level === 'N5') ? sectionValue : 'grammar';
    const [learnedIds, setLearnedIds] = useState<string[]>([]);
    const [limit, setLimit] = useState(PAGE_SIZE);
    const [kanaMode, setKanaMode] = useState<'hiragana' | 'katakana'>('hiragana');
    const [kanaGroup, setKanaGroup] = useState<'basic' | 'voiced' | 'combination'>('basic');
    useEffect(() => { void getJlptProgress().then((value) => setLearnedIds(value.learnedIds)); }, []);
    const grammar = useMemo(() => generatedGrammar.filter((item) => item.jlpt === level && item.status !== 'Rejected'), [level]);
    async function toggle(id: string) { const next = await toggleLearnedId(id); setLearnedIds(next.learnedIds); }
    function speak(text: string) { Speech.stop(); Speech.speak(text, { language: 'ja-JP', rate: 0.68 }); }
    function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) { if (section !== 'grammar') return; const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent; if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 240) setLimit((value) => Math.min(value + PAGE_SIZE, grammar.length)); }
    const title = section === 'characters' ? '文字' : section === 'grammar' ? '文法' : 'JLPT模擬試験';

    function renderCharacters() {
        const rows = kanaGroup === 'basic' ? (kanaMode === 'hiragana' ? hiraganaRows : katakanaRows) : kanaGroup === 'voiced' ? (kanaMode === 'hiragana' ? hiraganaVoicedRows : katakanaVoicedRows) : (kanaMode === 'hiragana' ? hiraganaCombinationRows : katakanaCombinationRows);
        return <><View style={styles.tabs}>{(['hiragana','katakana'] as const).map((mode) => <Pressable key={mode} onPress={() => setKanaMode(mode)} style={[styles.tab,kanaMode===mode&&styles.tabActive]}><Text style={[styles.tabText,kanaMode===mode&&styles.activeText]}>{mode==='hiragana'?'ひらがな':'カタカナ'}</Text></Pressable>)}</View>
            <View style={styles.tabs}>{(['basic','voiced','combination'] as const).map((group) => <Pressable key={group} onPress={() => setKanaGroup(group)} style={[styles.smallTab,kanaGroup===group&&styles.smallTabActive]}><Text style={kanaGroup===group&&styles.activeText}>{group==='basic'?'Âm cơ bản':group==='voiced'?'Âm đục':'Âm ghép'}</Text></Pressable>)}</View>
            <Text style={styles.help}>Mỗi ô gồm chữ Nhật, Romaji và nút nghe phát âm.</Text>
            {rows.map((row,rowIndex)=><View key={rowIndex} style={styles.kanaRow}>{row.map((character)=>{const id=`kana:${character}`;const learned=learnedIds.includes(id);return <View key={character} style={[styles.kanaCell,learned&&styles.learned]}><Pressable style={styles.kanaMain} onPress={()=>void toggle(id)}><Text style={styles.kana}>{character}</Text><Text style={styles.romaji}>{getKanaRomaji(character)}</Text>{learned&&<Text style={styles.tick}>✓</Text>}</Pressable><Pressable style={styles.voice} onPress={()=>speak(character)}><Text>🔊</Text></Pressable></View>;})}</View>)}</>;
    }
    function renderGrammar(){return <><Text style={styles.help}>{grammar.length} mẫu • tự động tải khi cuộn</Text>{grammar.slice(0,limit).map((item)=>{const learned=learnedIds.includes(item.id);return <RoyalPaperPanel key={item.id} style={styles.card}><View style={styles.cardTop}><Text style={styles.itemTitle}>{item.name}</Text><Pressable style={[styles.mark,learned&&styles.marked]} onPress={()=>void toggle(item.id)}><Text>{learned?'✓ Đã học':'Đánh dấu'}</Text></Pressable></View><Text style={styles.muted}>{item.reading}</Text><Text style={styles.meaning}>{item.meaningVi}</Text>{!!item.pattern&&<Text style={styles.detail}>Cấu trúc: {item.pattern}</Text>}{!!item.formation&&<Text style={styles.detail}>Cách tạo: {item.formation}</Text>}{!!item.exampleJa&&<View style={styles.example}><Text style={styles.exampleJa}>{item.exampleJa}</Text><Text>{item.exampleVi}</Text></View>}</RoyalPaperPanel>;})}{limit<grammar.length&&<Text style={styles.loading}>Đang tự tải thêm…</Text>}</>}
    if (section === 'test') {
      // Defer exam dataset initialization until the test branch is opened.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const ApprovedJlptExamCatalog = require('@/components/jlpt/ApprovedJlptExamCatalog').default as typeof import('@/components/jlpt/ApprovedJlptExamCatalog').default;
      return <View style={styles.testContainer}><ApprovedJlptExamCatalog level={level} onBack={()=>router.canGoBack()?backPrepared():replacePrepared(`/${level}`)} /></View>;
    }
    return <JlptStudyBackground><SafeAreaView style={styles.container}><View style={styles.header}><RoyalBackButton onPress={()=>backPrepared()} /></View><ScrollView contentContainerStyle={styles.content} onScroll={onScroll} scrollEventThrottle={200}><Text style={styles.level}>{level}</Text><View style={styles.titleRow}><Image fadeDuration={0} source={section==='grammar'?require('../../../assets/app/ui/royal-af/learning-grammar-v1.png'):require('../../../assets/app/ui/royal-af/learning-characters-v1.png')} resizeMode="contain" style={{width:30,height:30}}/><Text style={styles.title}>{title}</Text></View>{section==='characters'&&renderCharacters()}{section==='grammar'&&renderGrammar()}</ScrollView></SafeAreaView></JlptStudyBackground>;
}

const styles=StyleSheet.create({testContainer:{flex:1,backgroundColor:'transparent'},container:{flex:1,backgroundColor:'transparent'},header:{paddingHorizontal:ROYAL_LAYOUT.screenGutter,paddingTop:ROYAL_LAYOUT.backSafeTop,paddingBottom:6,backgroundColor:'transparent'},content:{padding:20,paddingBottom:60,backgroundColor:'transparent'},back:{fontSize:16,marginBottom:8},level:{fontFamily:ROYAL_FONT.body,color:'#50745c',fontWeight:'800',fontSize:18},titleRow:{flexDirection:'row',alignItems:'center',gap:8,marginTop:4,marginBottom:18},title:{fontFamily:ROYAL_FONT.body,fontSize:29,fontWeight:'900',color:'#24231f'},help:{fontFamily:ROYAL_FONT.body,color:'#625f57',lineHeight:21,marginBottom:15},tabs:{flexDirection:'row',gap:8,marginBottom:10},tab:{flex:1,padding:13,borderRadius:12,backgroundColor:'transparent',borderWidth:1,borderColor:'#b8b1a5',alignItems:'center'},tabActive:{backgroundColor:'#dce8dc',borderColor:'#78917d'},smallTab:{flex:1,paddingVertical:10,borderRadius:10,backgroundColor:'transparent',borderWidth:1,borderColor:'#b8b1a5',alignItems:'center'},smallTabActive:{backgroundColor:'#dce8dc',borderColor:'#78917d'},tabText:{fontWeight:'800',color:'#24231f'},activeText:{color:'#50745c',fontWeight:'800'},kanaRow:{flexDirection:'row',gap:7,marginBottom:7},kanaCell:{flex:1,minHeight:96,backgroundColor:'transparent',borderWidth:1,borderColor:'#b8b1a5',borderRadius:12,alignItems:'center'},learned:{backgroundColor:'#dce8dc',borderColor:'#78917d'},kanaMain:{flex:1,width:'100%',alignItems:'center',justifyContent:'center'},kana:{fontSize:25,fontWeight:'800',color:'#24231f'},romaji:{fontSize:15,color:'#625f57',fontWeight:'700',marginTop:2},tick:{position:'absolute',right:5,top:3,color:'#50745c'},voice:{paddingHorizontal:12,paddingBottom:8},card:{paddingHorizontal:28,paddingVertical:26,marginBottom:14},cardTop:{flexDirection:'row',justifyContent:'space-between',gap:10},itemTitle:{fontFamily:ROYAL_FONT.body,flex:1,fontSize:21,fontWeight:'900',color:'#24231f'},mark:{backgroundColor:'transparent',borderWidth:1,borderColor:'#b8b1a5',paddingHorizontal:10,paddingVertical:8,borderRadius:10},marked:{backgroundColor:'#dce8dc',borderColor:'#78917d'},muted:{fontFamily:ROYAL_FONT.body,color:'#625f57',marginTop:4},meaning:{fontFamily:ROYAL_FONT.body,fontSize:16,lineHeight:23,marginTop:9,color:'#24231f'},detail:{fontFamily:ROYAL_FONT.body,color:'#625f57',lineHeight:21,marginTop:7},example:{backgroundColor:'transparent',borderWidth:1,borderColor:'#b8b1a5',padding:12,borderRadius:10,marginTop:10},exampleJa:{fontFamily:ROYAL_FONT.body,fontSize:18,fontWeight:'700',marginBottom:5,color:'#24231f'},loading:{textAlign:'center',color:'#625f57',padding:18}});
