import {StyleSheet,View} from 'react-native';
import {foodManufacturingTranslation,type FoodManufacturingLesson} from '@/data/food-manufacturing';
import {FoodSourceLabel} from './FoodRoyalWeek7Native';
import {FoodLessonRuby} from './FoodLessonRuby';
import {TranslationText} from '@/components/tokutei/StudyAppearance';

// Exact associations from the current independently authored lesson, not diagnostic criteria.
const sourceHash='0ded9546f014949f38323e43f02f5380b527b18553c49d388e6b35481b8c8432';
const groups=[
 {paragraphId:'p1',rows:[['カンピロバクター属菌','食肉、特に鶏肉'],['サルモネラ属菌','鶏卵や食肉、特に鶏肉'],['腸炎ビブリオ','魚介類'],['腸管出血性大腸菌','食肉、特に牛肉、野菜、井戸水など']]},
 {paragraphId:'p2',rows:[['黄色ブドウ球菌','おにぎりやサンドイッチなど'],['セレウス菌','穀物加工品や炒飯など']]},
 {paragraphId:'p3',rows:[['ウェルシュ菌','土のついた原料や水、カレー・シチューなどの加熱済み食品'],['ボツリヌス菌','瓶詰め・レトルト食品など']]},
];
/** The microscope scene is context. This responsive table makes its eight food associations inspectable. */
export function FoodPathogenComparison({lesson,language,showTranslation}:{lesson:FoodManufacturingLesson;language:string;showTranslation:boolean}){
 if(lesson.id!=='food-1-039'||lesson.sourceHash!==sourceHash||!groups.every(g=>{const p=lesson.paragraphs.find(p=>p.id===g.paragraphId);return p&&g.rows.every(([name,foods])=>p.textJa.includes(name)&&p.textJa.includes(foods));}))return null;
 const tr=showTranslation&&language!=='ja'?foodManufacturingTranslation(lesson,language):null;
 return <View testID="food-pathogen-food-comparison" style={s.root}>{groups.map(group=>{const p=lesson.paragraphs.find(p=>p.id===group.paragraphId)!;return <View key={p.id} style={s.group}>
 <FoodLessonRuby lesson={lesson} field={`paragraphs.${p.id}.titleJa`} text={p.titleJa} color="#183044" readingColor="#536676" heading/>
 {group.rows.map(([name,foods],i)=><View key={name} testID={`food-pathogen-${p.id}-${i}`} style={s.row}>
 <View style={s.name}><FoodSourceLabel lesson={lesson} text={name}/></View>
 <View style={s.foods}><FoodSourceLabel lesson={lesson} text={foods}/></View>
 </View>)}
 <FoodLessonRuby lesson={lesson} field={`paragraphs.${p.id}.textJa`} text={p.textJa} color="#183044" readingColor="#536676"/>
 {tr&&<TranslationText>{tr.paragraphTitles[p.id]}{'\n'}{tr.paragraphs[p.id]}</TranslationText>}
 </View>;})}</View>;
}
const s=StyleSheet.create({root:{backgroundColor:'#fffdf7',padding:16,borderRadius:12,gap:24},group:{gap:12},row:{flexDirection:'row',flexWrap:'wrap',borderBottomWidth:1,borderColor:'#b8a47a',paddingVertical:12,gap:12,alignItems:'flex-start'},name:{flexGrow:1,flexBasis:210,minWidth:0},foods:{flexGrow:1,flexBasis:240,minWidth:0}});
