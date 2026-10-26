import {useState} from 'react';
import {Pressable,Text,View,useWindowDimensions} from 'react-native';
import links from '@/data/restaurant/glossary-links.json';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {RestaurantReading} from './RestaurantReading';
type GlossaryEntry={id:string;termJa:string;reading:string;explanationJa?:string;reviewStatus?:string};
type GlossaryGroup={id:string;titleJa:string;lessonIds:string[];entries:GlossaryEntry[]};
function Term({entry}:{entry:GlossaryEntry}){
 const {colors}=useStudyAppearance(),{width,fontScale}=useWindowDimensions();
 const readingValid=/^[ぁ-ゖー\s（）・、]+$/u.test(entry.reading||''),annotatedReading=/[（）・、]/u.test(entry.reading||''),available=Math.max(100,width-64)/(fontScale||1);
 if(annotatedReading||entry.termJa.length*17>available||(readingValid&&entry.reading.length*10>available))return <View style={{width:'100%',minWidth:0}}>{readingValid&&<Text style={{fontSize:10,lineHeight:16,color:colors.muted}}>{entry.reading}</Text>}<Text selectable style={{fontSize:17,lineHeight:29,color:colors.text}}>{entry.termJa}</Text></View>;
 return <RestaurantReading text={entry.termJa} segments={readingValid?[{text:entry.termJa,reading:entry.reading}]:undefined}/>;
}
function Group({group}:{group:GlossaryGroup}){
 const [limit,setLimit]=useState(25),{colors}=useStudyAppearance();
 return <View style={{gap:10,paddingVertical:12}}><RestaurantReading heading text={group.titleJa}/>
 <Text style={{color:colors.muted,fontSize:15,lineHeight:24}}>参考用語一覧 · 活動で指定された語を確認します。</Text>
 {group.entries.slice(0,limit).map(entry=><View key={entry.id} style={{paddingVertical:8,borderBottomWidth:1,borderColor:colors.border,gap:5}}>
 <Term entry={entry}/>
 {entry.explanationJa?<RestaurantReading text={entry.explanationJa}/>:<Text style={{fontSize:14,lineHeight:22,color:colors.muted}}>意味と使い方は本文・手順と合わせて確認します。</Text>}
 </View>)}
 {limit<group.entries.length&&<Pressable accessibilityRole="button" accessibilityLabel="用語をさらに表示" onPress={()=>setLimit(n=>n+25)} style={{padding:14,borderWidth:1,borderRadius:8,borderColor:colors.border}}><Text style={{textAlign:'center',fontSize:16,color:colors.text}}>用語をさらに表示（{Math.min(limit,group.entries.length)}/{group.entries.length}）</Text></Pressable>}
 </View>;
}
/** Factual source glossary is a Japanese reference; no fabricated locale fallback. */
export function RestaurantGlossary({lessonId,language,showTranslation}:{lessonId:string;language:string;showTranslation:boolean}){
 const {colors}=useStudyAppearance();
 if(!links.lessonIds.includes(lessonId))return null;
 const data=require('../../data/restaurant/glossary.ja.json') as {groups:GlossaryGroup[]};
 return <View testID="restaurant-glossary">
 {showTranslation&&language!=='ja'&&<Text style={{fontSize:15,lineHeight:24,color:colors.muted}}>この参考用語一覧の訳は準備中です。</Text>}
 {data.groups.filter(group=>group.lessonIds.includes(lessonId)).map(group=><Group key={group.id} group={group}/>)}
 </View>;
}
