import {useState} from 'react';
import {Linking,Pressable,StyleSheet,Text,View} from 'react-native';
import resources from '@/data/food-manufacturing/safety-video-resources.json';

/** Original external-resource navigation. Source videos are never rehosted. */
export function FoodSafetyVideoResources({lessonId,language,textColor}:{lessonId:string;language:string;textColor:string}){
 const [error,setError]=useState(false);
 if(lessonId!=='food-1-037')return null;
 const exact=resources.filter(v=>v.language===language),videos=exact.length?exact:resources.filter(v=>v.language==='ja');
 const open=async(url:string)=>{setError(false);try{await Linking.openURL(url);}catch{setError(true);}};
 return <View style={s.section} testID="food-safety-video-resources"><Text style={[s.heading,{color:textColor}]}>公式資料の安全動画</Text>
 <Text style={[s.body,{color:textColor}]}>{exact.length?'教材で案内されている言語の外部ページを開きます。':'この言語のリンクは教材にないため、日本語の外部ページを案内します。'}動画は職場の手順や訓練の代わりにはなりません。</Text>
 {videos.map(v=><Pressable key={v.id} accessibilityRole="link" accessibilityLabel={v.topicJa} onPress={()=>{void open(v.url);}} style={s.link}><Text style={[s.body,{color:textColor}]}>{v.topicJa} ↗</Text></Pressable>)}
 {error&&<Text accessibilityRole="alert" style={[s.body,{color:textColor}]}>リンクを開けませんでした。接続を確認して、もう一度お試しください。</Text>}
 </View>;
}
const s=StyleSheet.create({section:{paddingVertical:16,gap:10},heading:{fontSize:19,lineHeight:30,fontWeight:'700'},body:{fontSize:17,lineHeight:29},link:{minHeight:48,paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#b6aa93'}});
