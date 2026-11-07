import {StyleSheet,Text,View} from 'react-native';
import {foodManufacturingTranslation,type FoodManufacturingLesson} from '@/data/food-manufacturing';
import {foodRoyalWeek2NativeFor} from '@/data/food-manufacturing/royal-week2-native';
import {FoodConceptDiagrams} from './ConceptDiagrams';
/** Source-controlled labels. Checklist positions are fields, not operational steps. */
export function FoodRoyalWeek2Native({lesson,language,showTranslation,textColor}:{lesson:FoodManufacturingLesson;language:string;showTranslation:boolean;textColor:string}){
 const binding=foodRoyalWeek2NativeFor(lesson);if(!binding)return null;
 if(binding.kind==='hazards')return <FoodConceptDiagrams lessonId={lesson.id} language={language} showTranslation={showTranslation} textColor={textColor} dailyPlacement/>;
 const labels=binding.labels as Record<string,string[]>;
 const t=showTranslation&&language!=='ja'?foodManufacturingTranslation(lesson,language):null;
 const candidate=t?labels[language]:undefined;
 const translated=candidate?.length===labels.ja.length&&candidate.every(label=>t?.paragraphs[binding.captionParagraphId]?.includes(label))?candidate:undefined;
 const sequence=binding.kind==='haccp-preparation';
 return <View testID={`food-royal-native-${lesson.id}`} style={s.root}>
 {labels.ja.map((label,i)=><View key={label} style={s.step}>
 <View testID={`food-royal-native-${lesson.id}-${i+1}`} style={s.card}>
 <Text selectable style={[s.label,{color:textColor}]}>{binding.kind==='hygiene-targets'?'':`${i+1}. `}{label}</Text>
 {translated?.[i]&&<Text selectable style={[s.translation,{color:textColor}]}>{translated[i]}</Text>}
 </View>{sequence&&i<labels.ja.length-1&&<Text accessibilityLabel={`${i+1} → ${i+2}`} style={[s.arrow,{color:textColor}]}>↓</Text>}
 </View>)}
 </View>;
}
const s=StyleSheet.create({root:{gap:12},step:{gap:10},card:{padding:16,gap:8,borderWidth:1,borderColor:'#b49b62',borderRadius:12,backgroundColor:'#fffaf0',shadowColor:'#183044',shadowOpacity:0.12,shadowOffset:{width:0,height:3},shadowRadius:5,elevation:2},label:{fontSize:18,lineHeight:29,fontWeight:'700'},translation:{fontSize:16,lineHeight:27},arrow:{fontSize:24,textAlign:'center'}});
