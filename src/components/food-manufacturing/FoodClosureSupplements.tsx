import {useState} from 'react';
import {Image,Modal,Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';
import ui from '@/data/food-manufacturing/daily-ui-translations.json';
import data from '@/data/food-manufacturing/source-closure31.json';
import additions34 from '@/data/food-manufacturing/source-closure34.json';
import additions38 from '@/data/food-manufacturing/source-closure38.json';
import additions39 from '@/data/food-manufacturing/source-closure39.json';
import additions40 from '@/data/food-manufacturing/source-closure40.json';
import additions41 from '@/data/food-manufacturing/source-closure41.json';
import additions42 from '@/data/food-manufacturing/source-closure42.json';
import additions43 from '@/data/food-manufacturing/source-closure43.json';
import additions44 from '@/data/food-manufacturing/source-closure44.json';
import additions45 from '@/data/food-manufacturing/source-closure45.json';
import additions46 from '@/data/food-manufacturing/source-closure46.json';
import additions47 from '@/data/food-manufacturing/source-closure47.json';
import additions48 from '@/data/food-manufacturing/source-closure48.json';
import additions49 from '@/data/food-manufacturing/source-closure49.json';
import additions50 from '@/data/food-manufacturing/source-closure50.json';
import additions51 from '@/data/food-manufacturing/source-closure51.json';
import additions52 from '@/data/food-manufacturing/source-closure52.json';
import additions53 from '@/data/food-manufacturing/source-closure53.json';
import additions54 from '@/data/food-manufacturing/source-closure54.json';
import additions55 from '@/data/food-manufacturing/source-closure55.json';
import additions56 from '@/data/food-manufacturing/source-closure56.json';
import additions57 from '@/data/food-manufacturing/source-closure57.json';
import additions58 from '@/data/food-manufacturing/source-closure58.json';
import additions62 from '@/data/food-manufacturing/source-closure62.json';
import additions64 from '@/data/food-manufacturing/source-closure64.json';
import additions65 from '@/data/food-manufacturing/source-closure65.json';
import type {FoodManufacturingLesson} from '@/data/food-manufacturing';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
import {FoodSourceAssessmentChecks} from './FoodSourceAssessmentChecks';

/** Pin retained technical pixels to the accepted lesson and independent caption revision. */
export function foodRoyalClosure64FigureMatches(lesson:FoodManufacturingLesson,section:{id:string;lessonId:string;lessonSourceHash:string;sourceHash:string}){
 return lesson.id==="food-2-021"&&lesson.sourceHash==="ade1274e1f97c56590f312f3131d51e3452b917fb7e8d399d093b9c7fd82b74f"&&section.id==='food64-teaching'&&section.lessonId===lesson.id&&section.lessonSourceHash===lesson.sourceHash&&section.sourceHash==="4f2cf3ebdfa7bc6f2d9d65967347a9b36aa0a96e869976c084ac4e8e010631fa";
}
/** Separate source-bound additions preserve original lesson completion revisions. */
export function FoodClosureSupplements({lesson,language,showTranslation,textColor,readingColor}:{lesson:FoodManufacturingLesson;language:string;showTranslation:boolean;textColor:string;readingColor:string}){
 const [expanded,setExpanded]=useState(false),closeLabel=showTranslation&&language!=='ja'?(ui.locales as Record<string,{close:string}>)[language]?.close:null;
 return <>{[...data.sections,...additions34.sections,...additions38.sections,...additions39.sections,...additions40.sections,...additions41.sections,...additions42.sections,...additions43.sections,...additions44.sections,...additions45.sections,...additions46.sections,...additions47.sections,...additions48.sections,...additions49.sections,...additions50.sections,...additions51.sections,...additions52.sections,...additions53.sections,...additions54.sections,...additions55.sections,...additions56.sections,...additions57.sections,...additions58.sections,...additions62.sections,...additions64.sections,...additions65.sections].filter(s=>s.lessonId===lesson.id&&s.lessonSourceHash===lesson.sourceHash).map(section=>{
 const candidate=(section.translations as Record<string,{title:string;text:string;sourceHash:string}>)[language];
 const t=candidate?.sourceHash===section.sourceHash?candidate:null;
 const description=section.textJa+(showTranslation&&language!=='ja'&&t?'。'+t.text:'');
 return <View key={section.id} testID={section.id} style={styles.section}>
 <View accessible accessibilityRole="header" accessibilityLabel={section.titleJa} style={styles.line}>{section.titleRuby.map((token,i)=><View key={i} style={styles.word}><Text style={{color:readingColor,fontSize:11,lineHeight:15}}>{'reading' in token?token.reading:' '}</Text><Text selectable style={{color:textColor,fontSize:19,lineHeight:30,fontWeight:'700'}}>{token.text}</Text></View>)}</View>
 <View accessible accessibilityLabel={section.textJa} style={styles.line}>{section.ruby.map((token,i)=><View key={i} style={styles.word}><Text style={{color:readingColor,fontSize:10,lineHeight:14}}>{'reading' in token?token.reading:' '}</Text><Text selectable style={{color:textColor,fontSize:17,lineHeight:29}}>{token.text}</Text></View>)}</View>
 {foodRoyalClosure64FigureMatches(lesson,section)&&<><Pressable accessibilityRole="button" accessibilityLabel={`${section.titleJa}・拡大${showTranslation&&language!=='ja'&&t?' · '+t.title:''}`} onPress={()=>setExpanded(true)}><Image testID="food64-original-histogram" source={require('../../../assets/food-manufacturing/source-practice64/same-centre-different-spread.webp')} accessibilityLabel={description} resizeMode="contain" style={{width:'100%',aspectRatio:1200/960,height:undefined}}/></Pressable><Modal visible={expanded} onRequestClose={()=>setExpanded(false)}><View style={{flex:1,backgroundColor:'#fffaf0',paddingTop:36}}><Pressable accessibilityRole="button" accessibilityLabel={`図を閉じる${closeLabel?' · '+closeLabel:''}`} onPress={()=>setExpanded(false)} style={{padding:16}}><Text style={{color:textColor,fontSize:18}}>図を閉じる{closeLabel?' · '+closeLabel:''}</Text></Pressable><ScrollView horizontal><ScrollView style={{width:1200}}><Image testID="food64-original-histogram-zoom" source={require('../../../assets/food-manufacturing/source-practice64/same-centre-different-spread.webp')} accessibilityLabel={description} resizeMode="contain" style={{width:1200,height:960}}/><View style={{padding:16,gap:12}}><View accessible accessibilityRole="header" accessibilityLabel={section.titleJa} style={styles.line}>{section.titleRuby.map((token,i)=><View key={i} style={styles.word}><Text style={{color:readingColor,fontSize:11,lineHeight:15}}>{'reading' in token?token.reading:' '}</Text><Text selectable style={{color:textColor,fontSize:19,lineHeight:30,fontWeight:'700'}}>{token.text}</Text></View>)}</View><View accessible accessibilityLabel={section.textJa} style={styles.line}>{section.ruby.map((token,i)=><View key={i} style={styles.word}><Text style={{color:readingColor,fontSize:10,lineHeight:14}}>{'reading' in token?token.reading:' '}</Text><Text selectable style={{color:textColor,fontSize:17,lineHeight:29}}>{token.text}</Text></View>)}</View></View>{showTranslation&&language!=='ja'&&t&&<TranslationText>{t.title}{'\n'}{t.text}</TranslationText>}</ScrollView></ScrollView></View></Modal></>}
 {showTranslation&&language!=='ja'&&t&&<TranslationText>{t.title}{'\n'}{t.text}</TranslationText>}
 </View>;
 })}<FoodSourceAssessmentChecks lesson={lesson} language={language} showTranslation={showTranslation} textColor={textColor} readingColor={readingColor}/></>;
}
const styles=StyleSheet.create({section:{gap:10,paddingVertical:16},line:{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'},word:{alignItems:'center',maxWidth:'100%'}});
