import type {FoodManufacturingLesson} from '@/data/food-manufacturing';
import data from '@/data/food-manufacturing/royal-ojt-native-locales.json';
import {FoodRoyalNativeLabel} from './FoodRoyalNativeLabel';
import {StyleSheet,Text,View} from 'react-native';

/** Exact Japanese teaching text retained from the previous OJT cycle raster.
 * Keep ordered learning conditions deterministic; generated artwork is context only.
 */
export const foodRoyalOjtSteps=[
 {id:'prepare',title:'1 目標と準備',lines:['本人の知識・技能を確認','測定器・基準・連絡先','何ができればよいか決める']},
 {id:'demonstrate',title:'2 指導者が示す',lines:['測定と記録を実演','重要な点と理由を説明','質問で理解を確かめる']},
 {id:'perform',title:'3 本人が実施',lines:['手順を説明して実施','安全・測定・記録を観察','異常時の連絡も確認']},
 {id:'improve',title:'4 評価して改善',lines:['目標と実際の行動を照合','不足に合わせて再指導','安全にできるか再確認']},
] as const;
export function foodRoyalOjtCycleFor(lesson:FoodManufacturingLesson,language:string,showTranslation:boolean){
 if(lesson.id!==data.lessonId||lesson.sourceHash!==data.lessonSourceHash||!lesson.paragraphs.some(p=>p.id===data.paragraphId&&p.titleJa.trim()&&p.textJa.trim()))return null;
 const candidate=showTranslation&&language!=='ja'?(data.locales as Record<string,string[]>)[language]:undefined;
 const translated=candidate?.length===data.keysJa.length&&candidate.every(line=>line.trim())?candidate:undefined;
 return {keysJa:data.keysJa,translated};
}
export function FoodRoyalOjtCycle({lesson,language,showTranslation}:{lesson:FoodManufacturingLesson;language:string;showTranslation:boolean}){
 const content=foodRoyalOjtCycleFor(lesson,language,showTranslation);if(!content)return null;
 const line=(index:number,size=16,strong=false)=><View style={{gap:5}}><FoodRoyalNativeLabel lesson={lesson} text={content.keysJa[index]} color="#183044" size={size} strong={strong}/>{content.translated&&<Text style={s.body}>{content.translated[index]}</Text>}</View>;
 return <View testID="food-royal-ojt-cycle-text" style={s.root}>
 {line(0,19,true)}{line(1)}
 <View style={s.steps}>{foodRoyalOjtSteps.map((step,i)=><View key={step.id} testID={`food-royal-ojt-${step.id}`} style={s.card}>{line(2+i*4,18,true)}{[3,4,5].map(j=><View key={j}>{line(j+i*4)}</View>)}</View>)}</View>
 <View style={s.closure}>{line(18,18,true)}{line(19)}{line(20)}</View>{line(21)}
 </View>;
}
const s=StyleSheet.create({root:{gap:12,paddingVertical:12},heading:{fontSize:19,lineHeight:30,fontWeight:'700',color:'#183044'},body:{fontSize:16,lineHeight:27,color:'#263c4c'},steps:{flexDirection:'row',flexWrap:'wrap',gap:12},card:{flexGrow:1,flexBasis:'45%',minWidth:240,padding:16,gap:8,borderWidth:1,borderColor:'#b49b62',borderRadius:12,backgroundColor:'#fffaf0',shadowColor:'#183044',shadowOpacity:0.12,shadowOffset:{width:0,height:3},shadowRadius:5,elevation:2},title:{fontSize:18,lineHeight:29,fontWeight:'700',color:'#183044'},closure:{gap:8,padding:16,borderWidth:1,borderColor:'#b49b62',borderRadius:12,backgroundColor:'#f4ead4'}});
