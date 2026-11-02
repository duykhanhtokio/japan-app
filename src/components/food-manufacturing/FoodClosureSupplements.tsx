import {StyleSheet,Text,View} from 'react-native';
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
import type {FoodManufacturingLesson} from '@/data/food-manufacturing';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
import {FoodSourceAssessmentChecks} from './FoodSourceAssessmentChecks';

/** Separate source-bound additions preserve original lesson completion revisions. */
export function FoodClosureSupplements({lesson,language,showTranslation,textColor,readingColor}:{lesson:FoodManufacturingLesson;language:string;showTranslation:boolean;textColor:string;readingColor:string}){
 return <>{[...data.sections,...additions34.sections,...additions38.sections,...additions39.sections,...additions40.sections,...additions41.sections,...additions42.sections,...additions43.sections,...additions44.sections,...additions45.sections,...additions46.sections,...additions47.sections,...additions48.sections,...additions49.sections,...additions50.sections].filter(s=>s.lessonId===lesson.id&&s.lessonSourceHash===lesson.sourceHash).map(section=>{
 const candidate=(section.translations as Record<string,{title:string;text:string;sourceHash:string}>)[language];
 const t=candidate?.sourceHash===section.sourceHash?candidate:null;
 return <View key={section.id} testID={section.id} style={styles.section}>
 <View accessible accessibilityRole="header" accessibilityLabel={section.titleJa} style={styles.line}>{section.titleRuby.map((token,i)=><View key={i} style={styles.word}><Text style={{color:readingColor,fontSize:11,lineHeight:15}}>{'reading' in token?token.reading:' '}</Text><Text selectable style={{color:textColor,fontSize:19,lineHeight:30,fontWeight:'700'}}>{token.text}</Text></View>)}</View>
 <View accessible accessibilityLabel={section.textJa} style={styles.line}>{section.ruby.map((token,i)=><View key={i} style={styles.word}><Text style={{color:readingColor,fontSize:10,lineHeight:14}}>{'reading' in token?token.reading:' '}</Text><Text selectable style={{color:textColor,fontSize:17,lineHeight:29}}>{token.text}</Text></View>)}</View>
 {showTranslation&&language!=='ja'&&t&&<TranslationText>{t.title}{'\n'}{t.text}</TranslationText>}
 </View>;
 })}<FoodSourceAssessmentChecks lesson={lesson} language={language} showTranslation={showTranslation} textColor={textColor} readingColor={readingColor}/></>;
}
const styles=StyleSheet.create({section:{gap:10,paddingVertical:16},line:{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'},word:{alignItems:'center',maxWidth:'100%'}});
