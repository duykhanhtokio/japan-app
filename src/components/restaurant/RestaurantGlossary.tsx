import {useState} from 'react';
import {Pressable,Text,View,useWindowDimensions} from 'react-native';
import links from '@/data/restaurant/glossary-links.json';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {RestaurantReading} from './RestaurantReading';
import {restaurantGlossaryTranslation,restaurantUi,type RestaurantGlossaryEntry as GlossaryEntry} from '@/data/restaurant';
type GlossaryGroup={id:string;titleJa:string;lessonIds:string[];entries:GlossaryEntry[]};
function Term({entry}:{entry:GlossaryEntry}){
 const {colors}=useStudyAppearance(),{width,fontScale}=useWindowDimensions();
 const readingValid=/^[ぁ-ゖー\s（）・、]+$/u.test(entry.reading||''),annotatedReading=/[（）・、]/u.test(entry.reading||''),available=Math.max(100,width-64)/(fontScale||1);
 if(annotatedReading||entry.termJa.length*17>available||(readingValid&&entry.reading.length*10>available))return <View style={{width:'100%',minWidth:0}}>{readingValid&&<Text style={{fontSize:10,lineHeight:16,color:colors.muted}}>{entry.reading}</Text>}<Text selectable style={{fontSize:17,lineHeight:29,color:colors.text}}>{entry.termJa}</Text></View>;
 return <RestaurantReading text={entry.termJa} segments={readingValid?[{text:entry.termJa,reading:entry.reading}]:undefined}/>;
}
function Group({group,language,showTranslation}:{group:GlossaryGroup;language:string;showTranslation:boolean}){
 const [limit,setLimit]=useState(25),{colors}=useStudyAppearance();
 const hasTranslation=showTranslation&&language!=='ja'&&group.entries.some(entry=>restaurantGlossaryTranslation(entry,language));
 return <View style={{gap:10,paddingVertical:12}}><RestaurantReading heading text={group.titleJa}/>
 <Text style={{color:colors.muted,fontSize:15,lineHeight:24}}>参考用語一覧 · 活動で指定された語を確認します。</Text>
 {group.entries.slice(0,limit).map(entry=>{const translation=showTranslation&&language!=='ja'?restaurantGlossaryTranslation(entry,language):null;return <View key={entry.id} testID={`restaurant-glossary-${entry.id}`} style={{paddingVertical:8,borderBottomWidth:1,borderColor:colors.border,gap:5}}>
 <Term entry={entry}/>
 {entry.explanationJa?<RestaurantReading text={entry.explanationJa}/>:<Text style={{fontSize:14,lineHeight:22,color:colors.muted}}>意味と使い方は本文・手順と合わせて確認します。</Text>}
 {hasTranslation&&<Text style={{fontSize:16,lineHeight:26,color:colors.text}}>{translation?`${translation.term}\n${translation.explanation}`:restaurantUi('この用語の訳は準備中です。',language)}</Text>}
 </View>;})}
 {limit<group.entries.length&&<Pressable accessibilityRole="button" accessibilityLabel="用語をさらに表示" onPress={()=>setLimit(n=>n+25)} style={{padding:14,borderWidth:1,borderRadius:8,borderColor:colors.border}}><Text style={{textAlign:'center',fontSize:16,color:colors.text}}>用語をさらに表示（{Math.min(limit,group.entries.length)}/{group.entries.length}）</Text></Pressable>}
 </View>;
}
/** Japanese first; only translations tied to the current definition are displayed. */
export function RestaurantGlossary({lessonId,language,showTranslation}:{lessonId:string;language:string;showTranslation:boolean}){
 const {colors}=useStudyAppearance();
 if(!links.lessonIds.includes(lessonId))return null;
 const data=require('../../data/restaurant/glossary.ja.json') as {groups:GlossaryGroup[]};
 const groups=data.groups.filter(group=>group.lessonIds.includes(lessonId));
 return <View testID="restaurant-glossary">
 {showTranslation&&language!=='ja'&&!groups.some(group=>group.entries.some(entry=>restaurantGlossaryTranslation(entry,language)))&&<Text style={{fontSize:15,lineHeight:24,color:colors.muted}}>{restaurantUi('この参考用語一覧の訳は準備中です。',language)}</Text>}
 {groups.map(group=><Group key={group.id} group={group} language={language} showTranslation={showTranslation}/>)}
 </View>;
}
