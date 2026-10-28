import {useState} from 'react';
import {Pressable,StyleSheet,Text,View} from 'react-native';
import {RoyalExplanationPanel} from '@/components/ui/RoyalPanels';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
import {foodManufacturingSupplements,type FoodSupplement} from '@/data/food-manufacturing/supplements';
import type {FoodManufacturingLesson} from '@/data/food-manufacturing';
import {FoodRubyText} from './FoodRubyText';
import {FoodAppliedPractice} from './AppliedPractice';

function Supplement({item,language,showTranslation,showReadings,textColor}:{item:FoodSupplement;language:string;showTranslation:boolean;showReadings:boolean;textColor:string}){
 const [answer,setAnswer]=useState(false),candidate=item.translations[language],translated=candidate?.sourceHash===item.contentHash?candidate:undefined;
 const ruby=(key:string)=>showReadings?item.ruby?.[key]:undefined;
 return <RoyalExplanationPanel style={s.panel}><View testID={item.id} style={s.content}>
 <FoodRubyText text={item.titleJa} segments={ruby('titleJa')} style={[s.heading,{color:textColor}]}/>
 <FoodRubyText text={item.textJa} segments={ruby('textJa')} style={[s.body,{color:textColor}]}/>
 {showTranslation&&translated&&<TranslationText>{translated.title}{'\n'}{translated.text}</TranslationText>}
 <FoodAppliedPractice item={item} textColor={textColor} language={language} showTranslation={showTranslation}/>
 {!!item.answerJa&&<><Pressable accessibilityRole="button" accessibilityState={{expanded:answer}} onPress={()=>setAnswer(v=>!v)} style={s.button}><Text style={[s.body,{color:textColor}]}>{answer?'考え方を閉じる':'考え方を確認する'}</Text></Pressable>{answer&&<><FoodRubyText text={item.answerJa} segments={ruby('answerJa')} style={[s.body,{color:textColor}]}/>{showTranslation&&translated?.answer&&<TranslationText>{translated.answer}</TranslationText>}</>}</>}
 </View></RoyalExplanationPanel>;
}
export function FoodSourceSupplements({lesson,language,showTranslation,showReadings,textColor}:{lesson:FoodManufacturingLesson;language:string;showTranslation:boolean;showReadings:boolean;textColor:string}){
 return <>{foodManufacturingSupplements(lesson).map(item=><Supplement key={item.id} item={item} language={language} showTranslation={showTranslation} showReadings={showReadings} textColor={textColor}/>)}</>;
}
const s=StyleSheet.create({panel:{padding:20},content:{gap:12},heading:{fontSize:19,lineHeight:31,fontWeight:'700'},body:{fontSize:17,lineHeight:29},button:{minHeight:48,paddingVertical:12,borderWidth:1,borderColor:'#b6aa93',borderRadius:8,paddingHorizontal:12}});
