import {useState} from 'react';
import {StyleSheet,View} from 'react-native';
import data from '@/data/food-manufacturing/royal-ojt-cycle.json';
import type {FoodManufacturingLesson} from '@/data/food-manufacturing';
import JapaneseRuby from '@/components/world/JapaneseRuby';
import {TranslationText} from '@/components/tokutei/StudyAppearance';

/** Exact Japanese teaching text retained from the previous OJT cycle raster. */
export const foodRoyalOjtSteps=[
 {id:'prepare',title:'1 目標と準備',lines:['本人の知識・技能を確認','測定器・基準・連絡先','何ができればよいか決める']},
 {id:'demonstrate',title:'2 指導者が示す',lines:['測定と記録を実演','重要な点と理由を説明','質問で理解を確かめる']},
 {id:'perform',title:'3 本人が実施',lines:['手順を説明して実施','安全・測定・記録を観察','異常時の連絡も確認']},
 {id:'improve',title:'4 評価して改善',lines:['目標と実際の行動を照合','不足に合わせて再指導','安全にできるか再確認']},
] as const;

export function foodRoyalOjtCycleFor(lesson:FoodManufacturingLesson,language:string,showTranslation:boolean){
 if(lesson.id!==data.lessonId||lesson.sourceHash!==data.lessonSourceHash||!lesson.paragraphs.some(p=>p.id===data.paragraphId&&p.titleJa.trim().length>0&&p.textJa.trim().length>0))return null;
 const packet=showTranslation&&language!=='ja'?(data.locales as Record<string,{sourceHash:string;lines:Record<string,string>}>)[language]:undefined;
 const translated=packet?.sourceHash===data.contentRevision&&data.lines.every(line=>typeof packet.lines[line.id]==='string'&&packet.lines[line.id].trim().length>0)?packet.lines:undefined;
 return {lines:data.lines,translated};
}
/** One column until there is room for two cards; never impose an overflowing fixed card minimum. */
export function foodRoyalOjtCardLayout(width:number){return {flexBasis:Number.isFinite(width)&&width>=560?'45%' as const:'100%' as const,minWidth:0,maxWidth:'100%' as const};}

export function FoodRoyalOjtCycle({lesson,language,showTranslation}:{lesson:FoodManufacturingLesson;language:string;showTranslation:boolean}){
 const [width,setWidth]=useState(0),content=foodRoyalOjtCycleFor(lesson,language,showTranslation);if(!content)return null;
 const lookup=(id:string)=>content.lines.find(line=>line.id===id)!;
 const Line=({id,heading=false}:{id:string;heading?:boolean})=>{const line=lookup(id);return <View style={s.line}><JapaneseRuby text={line.ja} segments={line.ruby} fontSize={heading?18:16} color="#183044" readingColor="#536676" testID={`food-royal-ojt-ja-${id}`}/>{content.translated&&<TranslationText>{content.translated[id]}</TranslationText>}</View>;};
 const cycleAlt=lookup('cycleAlt');
 return <View testID="food-royal-ojt-cycle-text" style={s.root} onLayout={event=>setWidth(event.nativeEvent.layout.width)}>
 <Line id="heading" heading/><Line id="context"/>
 <View style={s.steps}>{foodRoyalOjtSteps.map(step=><View key={step.id} testID={`food-royal-ojt-${step.id}`} style={[s.card,foodRoyalOjtCardLayout(width)]}>
 <Line id={`${step.id}Title`} heading/>{step.lines.map((_,i)=><Line key={i} id={`${step.id}${i+1}`}/>)}
 </View>)}</View>
 <View style={s.closure}><Line id="closureTitle" heading/><Line id="closure1"/><Line id="closure2"/></View>
 <View accessible accessibilityLabel={`${cycleAlt.ja}${content.translated?'。'+content.translated.cycleAlt:''}`}><Line id="cycle"/></View>
 </View>;
}
const s=StyleSheet.create({root:{gap:12,paddingVertical:12},line:{gap:8,minWidth:0,maxWidth:'100%'},steps:{flexDirection:'row',flexWrap:'wrap',gap:12},card:{flexGrow:1,padding:16,gap:10,borderWidth:1,borderColor:'#b49b62',borderRadius:12,backgroundColor:'#fffaf0',shadowColor:'#183044',shadowOpacity:0.12,shadowOffset:{width:0,height:3},shadowRadius:5,elevation:2},closure:{gap:10,padding:16,borderWidth:1,borderColor:'#b49b62',borderRadius:12,backgroundColor:'#f4ead4'}});
