import {StyleSheet,Text,View} from 'react-native';
import data from '@/data/food-manufacturing/royal-chemical-safety-translations.json';
import type {FoodManufacturingLesson} from '@/data/food-manufacturing';
/** Original chart lines remain exact; locale lines map by stable source-line position. */
export const foodRoyalChemicalSafetyText=data.lines.map(line=>line.ja);
export function foodRoyalChemicalSafetyFor(lesson:FoodManufacturingLesson,language:string,showTranslation:boolean){
 if(lesson.id!==data.lessonId||lesson.sourceHash!==data.lessonSourceHash||!lesson.paragraphs.some(p=>p.id===data.paragraphId))return null;
 const candidate=showTranslation&&language!=='ja'?(data.locales as Record<string,string[]>)[language]:undefined;
 const translated=candidate?.length===data.lines.length&&candidate.every(line=>typeof line==='string'&&line.trim())?candidate:undefined;
 return {lines:data.lines,translated};
}
export function FoodRoyalChemicalSafety({lesson,language,showTranslation}:{lesson:FoodManufacturingLesson;language:string;showTranslation:boolean}){
 const content=foodRoyalChemicalSafetyFor(lesson,language,showTranslation);if(!content)return null;
 return <View testID="food-royal-chemical-safety-text" style={s.root}>{content.lines.map((line,i)=><View key={line.id} testID={`food-royal-chemical-${line.id}`} style={s.line}>
 <Text selectable style={[s.body,([0,2,7,12].includes(i))&&s.heading]}>{line.ja}</Text>
 {content.translated&&<Text selectable style={s.translation}>{content.translated[i]}</Text>}
 </View>)}</View>;
}
const s=StyleSheet.create({root:{padding:16,gap:10,borderWidth:1,borderColor:'#b49b62',borderRadius:12,backgroundColor:'#fffaf0'},line:{gap:5},body:{fontSize:16,lineHeight:27,color:'#263c4c'},translation:{fontSize:16,lineHeight:27,color:'#263c4c'},heading:{fontSize:19,lineHeight:30,fontWeight:'700',color:'#183044'}});
