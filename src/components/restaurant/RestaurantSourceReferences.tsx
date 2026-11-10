import {useState} from 'react';
import {Linking,Pressable,Text,View} from 'react-native';
import {TranslationText,useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {restaurantUi} from '@/data/restaurant';
import {sourceTarget31,type SourceReference31} from '@/data/restaurant/source31';
/** Official shape/procedure references remain links where image reuse is restricted. */
export function RestaurantSourceReferences({references,language,showTranslation}:{references:SourceReference31[];language:string;showTranslation:boolean}){
 const [failed,setFailed]=useState<string|null>(null),{colors}=useStudyAppearance();
 const open=(reference:SourceReference31)=>{setFailed(null);void Linking.openURL(reference.url).catch(()=>setFailed(reference.id));};
 return <View style={{gap:12}}>{references.map(reference=>{const t=showTranslation?sourceTarget31(reference,language):null;return <View key={reference.id} style={{gap:8}}><Pressable testID={`source31-reference-${reference.id}`} accessibilityRole="link" accessibilityLabel={t?.title??reference.titleJa} onPress={()=>open(reference)} style={{minHeight:48,padding:12,borderWidth:1,borderColor:colors.border}}><Text style={{color:colors.text,fontSize:17,lineHeight:28}}>{reference.titleJa}</Text></Pressable><Text style={{color:colors.text,fontSize:17,lineHeight:28}}>{reference.textJa}</Text>{t?.title&&t.text&&<TranslationText>{t.title}{'\n'}{t.text}</TranslationText>}{failed===reference.id&&<View><Text selectable accessibilityRole="alert" style={{color:colors.text}}>{reference.url}</Text><Pressable accessibilityRole="button" accessibilityLabel={restaurantUi('読み込みを再試行',language)} onPress={()=>open(reference)} style={{minHeight:48,padding:12}}><Text style={{color:colors.text}}>{restaurantUi('読み込みを再試行',language)}</Text></Pressable></View>}</View>;})}</View>;
}
