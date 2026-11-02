import {useState} from 'react';
import {Image,Modal,Pressable,ScrollView,StyleSheet,Text,View,type ImageSourcePropType} from 'react-native';
import {foodSourcePractice32} from '@/data/food-manufacturing/source-practice32';
import {foodSourcePractice33} from '@/data/food-manufacturing/source-practice33';
import {foodSourcePractice34} from '@/data/food-manufacturing/source-practice34';
import {foodSourcePractice35} from '@/data/food-manufacturing/source-practice35';
import {foodSourcePractice36} from '@/data/food-manufacturing/source-practice36';
import {foodSourcePractice37} from '@/data/food-manufacturing/source-practice37';
import {foodSourcePractice43} from '@/data/food-manufacturing/source-practice43';
import {foodSourcePractice46} from '@/data/food-manufacturing/source-practice46';
import caption43 from '@/data/food-manufacturing/source-closure43.json';
import caption44 from '@/data/food-manufacturing/source-closure44.json';
import caption45 from '@/data/food-manufacturing/source-closure45.json';
import caption46 from '@/data/food-manufacturing/source-closure46.json';
import caption47 from '@/data/food-manufacturing/source-closure47.json';
import caption48 from '@/data/food-manufacturing/source-closure48.json';
import caption49 from '@/data/food-manufacturing/source-closure49.json';
import {foodSourcePractice49} from '@/data/food-manufacturing/source-practice49';
import {foodSourcePractice51} from '@/data/food-manufacturing/source-practice51';
import {foodSourcePractice53} from '@/data/food-manufacturing/source-practice53';
import {foodSourcePractice55} from '@/data/food-manufacturing/source-practice55';
import {foodSourcePractice57} from '@/data/food-manufacturing/source-practice57';
import caption55 from '@/data/food-manufacturing/source-closure55.json';
import caption57 from '@/data/food-manufacturing/source-closure57.json';
import {foodSourcePractice60f8119} from '@/data/food-manufacturing/source-practice60-f8119';
import caption60f8119 from '@/data/food-manufacturing/source-closure60-f8119.json';
import {foodSourcePractice61f8119} from '@/data/food-manufacturing/source-practice61-f8119';
import caption61f8119 from '@/data/food-manufacturing/source-closure61-f8119.json';
import caption51 from '@/data/food-manufacturing/source-closure51.json';
import caption53 from '@/data/food-manufacturing/source-closure53.json';
import captionSupplements from '@/data/food-manufacturing/source-closure31.json';
import ui from '@/data/food-manufacturing/daily-ui-translations.json';
import {foodManufacturingLesson,foodManufacturingTranslation,type FoodManufacturingLesson} from '@/data/food-manufacturing';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
import {FoodLessonRuby} from './FoodLessonRuby';
type PracticeFigure={id:string;lessonId:string;paragraphId:string;source:ImageSourcePropType;aspectRatio:number;width?:number;height?:number;lessonSourceHash?:string;altJa?:string;captionSupplementId?:string;captionSupplementSourceHash?:string};
const figures:PracticeFigure[]=[
 ...foodSourcePractice32,
 ...foodSourcePractice33,
 ...foodSourcePractice34,
 ...foodSourcePractice35,
 ...foodSourcePractice36,
 ...foodSourcePractice37,
 ...foodSourcePractice43,
 ...foodSourcePractice46,
 ...foodSourcePractice49,
 ...foodSourcePractice51,
 ...foodSourcePractice53,
 ...foodSourcePractice55,
 ...foodSourcePractice57,
 ...foodSourcePractice60f8119,
 ...foodSourcePractice61f8119,
 {id:'food-source-histogram-patterns',lessonId:'food-2-043',paragraphId:'p1',source:require('../../../assets/food-manufacturing/source-practice/histogram-patterns.webp'),aspectRatio:1584/1903},
 {id:'food-source-scatter-patterns',lessonId:'food-2-043',paragraphId:'p2',source:require('../../../assets/food-manufacturing/source-practice/scatter-patterns.webp'),aspectRatio:1584/1423},
 {id:'food-source-risk-matrix',lessonId:'food-2-047',paragraphId:'p2',source:require('../../../assets/food-manufacturing/source-practice/risk-matrix.webp'),aspectRatio:776/648},
 {id:'food-source-flow',lessonId:'food-2-041',paragraphId:'p5',source:require('../../../assets/food-manufacturing/source-practice/multi-input-flow.webp'),aspectRatio:1272/894,width:1272,height:894},
 {id:'food-source-normal-bands',lessonId:'food-2-042',paragraphId:'p1',source:require('../../../assets/food-manufacturing/source-practice/normal-bands.webp'),aspectRatio:1147/780},
 {id:'food-source-cause-bars',lessonId:'food-2-042',paragraphId:'p4',source:require('../../../assets/food-manufacturing/source-practice/cause-bars.webp'),aspectRatio:1101/711},
];
/** Source-audit visual exercises use original diagrams and explicit lesson assumptions. */
export function FoodSourcePracticeVisuals({lesson,textColor,readingColor,language,showTranslation}:{lesson:FoodManufacturingLesson;textColor:string;readingColor:string;language:string;showTranslation:boolean}){
 const [expanded,setExpanded]=useState<PracticeFigure|null>(null);
 const labels=showTranslation&&language!=='ja'?(ui.locales as Record<string,{close:string}>)[language]:undefined;
 const base=foodManufacturingLesson(lesson.id,lesson.level);
 if(!base||base.sourceHash!==lesson.sourceHash)return null;
 const translated=showTranslation&&language!=='ja'?foodManufacturingTranslation(lesson,language):null;
 return <>{figures.filter(f=>f.lessonId===lesson.id&&(!f.lessonSourceHash||f.lessonSourceHash===lesson.sourceHash)).map(figure=>{
 const p=lesson.paragraphs.find(p=>p.id===figure.paragraphId);if(!p)return null;
 const captionSupplement=figure.captionSupplementId?[...captionSupplements.sections,...caption43.sections,...caption44.sections,...caption45.sections,...caption46.sections,...caption47.sections,...caption48.sections,...caption49.sections,...caption51.sections,...caption53.sections,...caption55.sections,...caption57.sections,...caption60f8119.sections,...caption61f8119.sections].find(s=>s.id===figure.captionSupplementId&&s.lessonSourceHash===lesson.sourceHash&&s.sourceHash===figure.captionSupplementSourceHash):null;
 if(figure.captionSupplementId&&!captionSupplement)return null;
 const supplementTranslation=captionSupplement&&showTranslation&&language!=='ja'?(captionSupplement.translations as Record<string,{title:string;sourceHash:string}>)[language]:null;
 const supplementTitle=supplementTranslation?.sourceHash===captionSupplement?.sourceHash?supplementTranslation?.title:null;
 const headingOnly=figure.id.startsWith('food-source32-')||figure.id.startsWith('food-source37-')||figure.id.startsWith('food-source43-')||figure.id.startsWith('food-source46-');
 return <View key={figure.id} testID={figure.id} style={s.figure}>
 {captionSupplement?<View accessible accessibilityRole="header" accessibilityLabel={captionSupplement.titleJa} style={s.rubyLine}>{captionSupplement.titleRuby.map((token,i)=><View key={i} style={s.word}><Text style={{color:readingColor,fontSize:11,lineHeight:15}}>{'reading' in token?token.reading:' '}</Text><Text selectable style={{color:textColor,fontSize:19,lineHeight:30,fontWeight:'700'}}>{token.text}</Text></View>)}</View>:<FoodLessonRuby lesson={lesson} field={`paragraphs.${p.id}.titleJa`} text={p.titleJa} color={textColor} readingColor={readingColor} heading/>}
 {!headingOnly&&<FoodLessonRuby lesson={lesson} field={`paragraphs.${p.id}.textJa`} text={p.textJa} color={textColor} readingColor={readingColor}/>}
 {captionSupplement?supplementTitle&&<TranslationText>{supplementTitle}</TranslationText>:translated&&<TranslationText>{translated.paragraphTitles[p.id]}{!headingOnly?'\n'+translated.paragraphs[p.id]:''}</TranslationText>}
 {figure.id==='food-source-risk-matrix'&&<View><Text style={{color:readingColor,fontSize:10,lineHeight:17}}>はっせいかのうせい ↓　じゅうだいせい →</Text><Text style={{color:textColor,fontSize:16,lineHeight:27}}>発生可能性 ↓　重大性 →</Text>{translated&&<TranslationText>{translated.terms?.['発生可能性']} ↓　{translated.terms?.['重大性']} →</TranslationText>}</View>}
 <Pressable accessibilityRole="button" accessibilityLabel={`${captionSupplement?.titleJa??p.titleJa}・拡大`} onPress={()=>setExpanded(figure)}><Image source={figure.source} accessibilityLabel={figure.altJa??`${p.titleJa}。${p.textJa}`} resizeMode="contain" style={[s.image,{aspectRatio:figure.aspectRatio}]}/></Pressable>
 </View>;
 })}<Modal visible={expanded!==null} animationType="none" onRequestClose={()=>setExpanded(null)}><View style={{flex:1,backgroundColor:'#fffaf0',paddingTop:36}}><Pressable accessibilityRole="button" accessibilityLabel="図を閉じる" onPress={()=>setExpanded(null)} style={{padding:16}}><Text style={{color:'#233c4c',fontSize:18}}>図を閉じる{labels?` · ${labels.close}`:''}</Text></Pressable>{expanded&&<ScrollView horizontal><ScrollView style={{width:expanded.width??1200}}><Image testID="food-source-practice-zoom" source={expanded.source} resizeMode="contain" accessibilityLabel={expanded.altJa??lesson.paragraphs.find(p=>p.id===expanded.paragraphId)?.titleJa} style={{width:expanded.width??1200,height:expanded.height??1200/expanded.aspectRatio}}/></ScrollView></ScrollView>}</View></Modal></>;
}
const s=StyleSheet.create({figure:{gap:10,paddingVertical:16},image:{width:'100%',height:undefined,alignSelf:'center'},rubyLine:{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'},word:{alignItems:'center',maxWidth:'100%'}});
