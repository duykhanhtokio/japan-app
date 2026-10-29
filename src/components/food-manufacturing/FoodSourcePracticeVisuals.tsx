import {Image,StyleSheet,Text,View} from 'react-native';
import {supplementalLessons} from '@/data/food-manufacturing/supplemental';
import {foodManufacturingTranslation,type FoodManufacturingLesson} from '@/data/food-manufacturing';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
import {FoodLessonRuby} from './FoodLessonRuby';
const figures=[
 {id:'food-source-histogram-patterns',lessonId:'food-2-043',paragraphId:'p1',source:require('../../../assets/food-manufacturing/source-practice/histogram-patterns.webp'),aspectRatio:1584/1903},
 {id:'food-source-scatter-patterns',lessonId:'food-2-043',paragraphId:'p2',source:require('../../../assets/food-manufacturing/source-practice/scatter-patterns.webp'),aspectRatio:1584/1423},
 {id:'food-source-risk-matrix',lessonId:'food-2-047',paragraphId:'p2',source:require('../../../assets/food-manufacturing/source-practice/risk-matrix.webp'),aspectRatio:776/648},
 {id:'food-source-flow',lessonId:'food-2-041',paragraphId:'p5',source:require('../../../assets/food-manufacturing/source-practice/multi-input-flow.webp'),aspectRatio:1272/894},
 {id:'food-source-normal-bands',lessonId:'food-2-042',paragraphId:'p1',source:require('../../../assets/food-manufacturing/source-practice/normal-bands.webp'),aspectRatio:1147/780},
 {id:'food-source-cause-bars',lessonId:'food-2-042',paragraphId:'p4',source:require('../../../assets/food-manufacturing/source-practice/cause-bars.webp'),aspectRatio:1101/711},
];
/** Source-audit visual exercises use original diagrams and explicit lesson assumptions. */
export function FoodSourcePracticeVisuals({lesson,textColor,readingColor,language,showTranslation}:{lesson:FoodManufacturingLesson;textColor:string;readingColor:string;language:string;showTranslation:boolean}){
 const base=supplementalLessons.find(l=>l.id===lesson.id);
 if(!base||base.sourceHash!==lesson.sourceHash)return null;
 const translated=showTranslation&&language!=='ja'?foodManufacturingTranslation(lesson,language):null;
 return <>{figures.filter(f=>f.lessonId===lesson.id).map(figure=>{
 const p=lesson.paragraphs.find(p=>p.id===figure.paragraphId);if(!p)return null;
 return <View key={figure.id} testID={figure.id} style={s.figure}>
 <FoodLessonRuby lesson={lesson} field={`paragraphs.${p.id}.titleJa`} text={p.titleJa} color={textColor} readingColor={readingColor} heading/>
 <FoodLessonRuby lesson={lesson} field={`paragraphs.${p.id}.textJa`} text={p.textJa} color={textColor} readingColor={readingColor}/>
 {translated&&<TranslationText>{translated.paragraphTitles[p.id]}{'\n'}{translated.paragraphs[p.id]}</TranslationText>}
 {figure.id==='food-source-risk-matrix'&&<View><Text style={{color:readingColor,fontSize:10,lineHeight:17}}>はっせいかのうせい ↓　じゅうだいせい →</Text><Text style={{color:textColor,fontSize:16,lineHeight:27}}>発生可能性 ↓　重大性 →</Text>{translated&&<TranslationText>{translated.terms?.['発生可能性']} ↓　{translated.terms?.['重大性']} →</TranslationText>}</View>}
 <Image source={figure.source} accessibilityLabel={`${p.titleJa}。${p.textJa}`} resizeMode="contain" style={[s.image,{aspectRatio:figure.aspectRatio}]}/>
 </View>;
 })}</>;
}
const s=StyleSheet.create({figure:{gap:10,paddingVertical:16},image:{width:'100%',height:undefined,alignSelf:'center'}});
