import {useState} from 'react';
import ui from '@/data/food-manufacturing/daily-ui-translations.json';
import {foodRoyalSafetySignsFor} from '@/data/food-manufacturing/royal-safety-signs';
import {Image,Modal,Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';
import {foodSafetySignData as data,foodSafetySignImages} from '@/data/food-manufacturing/safety-signs';
import {foodManufacturingTranslation,type FoodManufacturingLesson} from '@/data/food-manufacturing';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
import {FoodLessonRuby} from './FoodLessonRuby';

type Labels={labels:string[];notice:string};
/** Original meaning-recognition drawings; not certified workplace sign artwork. */
export function FoodSafetySigns({lesson,textColor,readingColor,language,showTranslation,dailyPlacement=false}:{dailyPlacement?:boolean;lesson:FoodManufacturingLesson;textColor:string;readingColor:string;language:string;showTranslation:boolean}){
 const [expanded,setExpanded]=useState<number|null>(null);
 const binding=foodRoyalSafetySignsFor(lesson);if(!binding||!dailyPlacement)return null;
 const labels=showTranslation&&language!=='ja'?(data.translations as Record<string,Labels>)[language]:undefined;
 const close=showTranslation&&language!=='ja'?(ui.locales as Record<string,{close:string}>)[language]?.close:undefined;
 const translated=showTranslation&&language!=='ja'?foodManufacturingTranslation(lesson,language):null;
 const description=(i:number)=>{const sign=data.signs[i],p=lesson.paragraphs.find(p=>p.id===(lesson.id===data.lessonId?sign.paragraphId:'p1'))!;return `${sign.ja}。${p.titleJa}。${p.textJa}。${data.noticeJa}${labels?`。${labels.labels[i]}。${translated?.paragraphTitles[p.id]??''}。${translated?.paragraphs[p.id]??''}。${labels.notice}`:''}`;};
 return <View testID="food-safety-signs" style={s.root}>
 <View accessible accessibilityLabel={data.noticeJa}><Text style={[s.reading,{color:readingColor}]}>{data.noticeReading}</Text><Text style={[s.notice,{color:textColor}]}>{data.noticeJa}</Text></View>
 {labels&&<TranslationText>{labels.notice}</TranslationText>}
 {(lesson.id===data.lessonId?['p1','p2','p3']:['p1']).map(id=>{const p=lesson.paragraphs.find(p=>p.id===id);return p?<View key={id} style={s.group}>
 <FoodLessonRuby lesson={lesson} field={`paragraphs.${id}.titleJa`} text={p.titleJa} color={textColor} readingColor={readingColor} heading/>
 {translated&&<TranslationText>{translated.paragraphs[id]}</TranslationText>}
 <View style={s.grid}>{data.signs.map((sign,i)=>(lesson.id===data.lessonId?sign.paragraphId===id:!['keep-door-closed','head-impact'].includes(sign.id))?<View key={sign.id} testID={`food-sign-${sign.id}`} style={s.card}>
 <Pressable accessibilityRole="button" accessibilityLabel={description(i)} onPress={()=>setExpanded(i)}><Image source={foodSafetySignImages[i]} accessibilityLabel={description(i)} resizeMode="contain" style={s.image}/></Pressable>
 <View accessible accessibilityLabel={sign.ja}><Text style={[s.reading,{color:readingColor}]}>{sign.reading}</Text><Text style={[s.label,{color:textColor}]}>{sign.ja}</Text></View>
 {labels&&<TranslationText>{labels.labels[i]}</TranslationText>}
 </View>:null)}</View>
 </View>:null;})}
 <Modal visible={expanded!==null} animationType="none" onRequestClose={()=>setExpanded(null)}><View style={s.modal}><Pressable accessibilityRole="button" accessibilityLabel={`図を閉じる${close?` · ${close}`:''}`} onPress={()=>setExpanded(null)}><Text style={s.close}>図を閉じる{close?` · ${close}`:''}</Text></Pressable><ScrollView>{expanded!==null&&<View><Image source={foodSafetySignImages[expanded]} accessibilityLabel={description(expanded)} resizeMode="contain" style={s.zoom}/><Text style={[s.reading,{color:'#596267'}]}>{data.signs[expanded].reading}</Text><Text style={s.close}>{description(expanded)}</Text></View>}</ScrollView></View></Modal>
 </View>;
}
const s=StyleSheet.create({modal:{flex:1,backgroundColor:'#fffaf0',padding:20,paddingTop:36},close:{color:'#183044',fontSize:17,lineHeight:28,padding:12},zoom:{width:'100%',aspectRatio:1},root:{gap:12,paddingVertical:16},group:{gap:12},grid:{flexDirection:'row',flexWrap:'wrap',gap:12},card:{flexBasis:'45%',flexGrow:1,minWidth:120,maxWidth:280,padding:8,gap:8,borderWidth:1,borderColor:'#aa9570',borderRadius:8},image:{width:'100%',aspectRatio:1},reading:{fontSize:10,lineHeight:17,textAlign:'center',maxWidth:'100%'},label:{fontSize:17,lineHeight:28,textAlign:'center',maxWidth:'100%'},notice:{fontSize:15,lineHeight:25,borderWidth:1,borderColor:'#aa9570',padding:10}});
