import {Image,StyleSheet,Text,View} from 'react-native';
import {foodSafetySignData as data,foodSafetySignImages} from '@/data/food-manufacturing/safety-signs';
import {foodManufacturingTranslation,type FoodManufacturingLesson} from '@/data/food-manufacturing';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
import {FoodLessonRuby} from './FoodLessonRuby';

type Labels={labels:string[];notice:string};
/** Original meaning-recognition drawings; not certified workplace sign artwork. */
export function FoodSafetySigns({lesson,textColor,readingColor,language,showTranslation}:{lesson:FoodManufacturingLesson;textColor:string;readingColor:string;language:string;showTranslation:boolean}){
 if(lesson.id!==data.lessonId||lesson.sourceHash!==data.sourceHash)return null;
 const labels=showTranslation&&language!=='ja'?(data.translations as Record<string,Labels>)[language]:undefined;
 const translated=showTranslation&&language!=='ja'?foodManufacturingTranslation(lesson,language):null;
 return <View testID="food-safety-signs" style={s.root}>
 <View accessible accessibilityLabel={data.noticeJa}><Text style={[s.reading,{color:readingColor}]}>{data.noticeReading}</Text><Text style={[s.notice,{color:textColor}]}>{data.noticeJa}</Text></View>
 {labels&&<TranslationText>{labels.notice}</TranslationText>}
 {['p1','p2','p3'].map(id=>{const p=lesson.paragraphs.find(p=>p.id===id);return p?<View key={id} style={s.group}>
 <FoodLessonRuby lesson={lesson} field={`paragraphs.${id}.titleJa`} text={p.titleJa} color={textColor} readingColor={readingColor} heading/>
 {translated&&<TranslationText>{translated.paragraphs[id]}</TranslationText>}
 <View style={s.grid}>{data.signs.map((sign,i)=>sign.paragraphId===id?<View key={sign.id} testID={`food-sign-${sign.id}`} style={s.card}>
 <Image source={foodSafetySignImages[i]} accessibilityLabel={sign.ja} resizeMode="contain" style={s.image}/>
 <View accessible accessibilityLabel={sign.ja}><Text style={[s.reading,{color:readingColor}]}>{sign.reading}</Text><Text style={[s.label,{color:textColor}]}>{sign.ja}</Text></View>
 {labels&&<TranslationText>{labels.labels[i]}</TranslationText>}
 </View>:null)}</View>
 </View>:null;})}
 </View>;
}
const s=StyleSheet.create({root:{gap:12,paddingVertical:16},group:{gap:12},grid:{flexDirection:'row',flexWrap:'wrap',gap:12},card:{flexBasis:'45%',flexGrow:1,minWidth:120,maxWidth:280,padding:8,gap:8,borderWidth:1,borderColor:'#aa9570',borderRadius:8},image:{width:'100%',aspectRatio:1},reading:{fontSize:10,lineHeight:17,textAlign:'center',maxWidth:'100%'},label:{fontSize:17,lineHeight:28,textAlign:'center',maxWidth:'100%'},notice:{fontSize:15,lineHeight:25,borderWidth:1,borderColor:'#aa9570',padding:10}});
