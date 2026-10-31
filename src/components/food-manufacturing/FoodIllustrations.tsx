import warningTranslations from '@/data/food-manufacturing/illustration-label-translations.json';
import {Image,StyleSheet,Text,View} from 'react-native';
import {foodIllustrationsFor} from '@/data/food-manufacturing/illustrations';
import {foodManufacturingTranslation,type FoodManufacturingLesson} from '@/data/food-manufacturing';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
import {FoodLessonRuby} from './FoodLessonRuby';

/** Complete artwork stays visible; educational illustrations are not scene backgrounds. */
export function FoodIllustrations({lesson,textColor,readingColor,language,showTranslation}:{lesson:FoodManufacturingLesson;textColor:string;readingColor:string;language:string;showTranslation:boolean}){
 const translation=showTranslation&&language!=='ja'?foodManufacturingTranslation(lesson,language):null;
 return <>{foodIllustrationsFor(lesson).map(figure=>{
  const paragraph=lesson.paragraphs.find(p=>p.id===figure.captionParagraphId)!;
  return <View key={figure.id} testID={figure.id} style={s.figure}>
   {figure.incorrectExample&&<View><Text style={{fontSize:10,lineHeight:17,color:textColor}}>あやまったほかんれい</Text><Text accessibilityRole="header" style={s.warning}>誤った保管例</Text>{translation&&(warningTranslations.labels as Record<string,string>)[language]&&<TranslationText>{(warningTranslations.labels as Record<string,string>)[language]}</TranslationText>}</View>}
   <FoodLessonRuby lesson={lesson} field={`paragraphs.${paragraph.id}.titleJa`} text={paragraph.titleJa} color={textColor} readingColor={readingColor} heading/>
   {translation&&<TranslationText>{translation.paragraphTitles[paragraph.id]}</TranslationText>}
   <FoodLessonRuby lesson={lesson} field={`paragraphs.${paragraph.id}.textJa`} text={paragraph.textJa} color={textColor} readingColor={readingColor}/>
   {translation&&<TranslationText>{translation.paragraphs[paragraph.id]}</TranslationText>}
   <Image source={figure.source} accessibilityLabel={`${figure.incorrectExample?'誤った保管例。':''}${paragraph.titleJa}。${paragraph.textJa}`} resizeMode="contain" style={[s.image,{aspectRatio:figure.width/figure.height}]}/>
  </View>;
 })}</>;
}
const s=StyleSheet.create({figure:{gap:10,paddingVertical:16},image:{width:'100%',height:undefined,alignSelf:'center'},warning:{fontSize:19,lineHeight:30,fontWeight:'700',color:'#a02323',backgroundColor:'#fff2f0',borderWidth:2,borderColor:'#a02323',padding:10}});
