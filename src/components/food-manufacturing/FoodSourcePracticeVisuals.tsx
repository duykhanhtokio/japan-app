import {foodRoyalWeek7NativeFor} from '@/data/food-manufacturing/royal-week7-native';
import axisReadings from '@/data/food-manufacturing/royal-technical-axis-readings.json';
import axisLabels from '@/data/food-manufacturing/royal-technical-axis-labels.json';
import chartLabels from '@/data/food-manufacturing/management-label-translations.json';
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
import caption51 from '@/data/food-manufacturing/source-closure51.json';
import caption53 from '@/data/food-manufacturing/source-closure53.json';
import captionSupplements from '@/data/food-manufacturing/source-closure31.json';
import ui from '@/data/food-manufacturing/daily-ui-translations.json';
import {foodManufacturingLesson,foodManufacturingTranslation,type FoodManufacturingLesson} from '@/data/food-manufacturing';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
import {FoodLessonRuby} from './FoodLessonRuby';
import {FoodRoyalOjtCycle} from './FoodRoyalOjtCycle';
import {FoodRoyalChemicalSafety} from './FoodRoyalChemicalSafety';
type PracticeFigure={id:string;lessonId:string;paragraphId:string;source:ImageSourcePropType;aspectRatio:number;width?:number;height?:number;lessonSourceHash:string;altJa?:string;captionSupplementId?:string;captionSupplementSourceHash?:string};
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
 {id:'food-source-histogram-patterns',lessonId:'food-2-043',lessonSourceHash:'9619317927d194d061bec815a4ae09968e46a4f1c364fd5cbb1a1bd19d2c0f95',paragraphId:'p1',source:require('../../../assets/food-manufacturing/source-practice/histogram-patterns.webp'),aspectRatio:1584/1903},
 {id:'food-source-scatter-patterns',lessonId:'food-2-043',lessonSourceHash:'9619317927d194d061bec815a4ae09968e46a4f1c364fd5cbb1a1bd19d2c0f95',paragraphId:'p2',source:require('../../../assets/food-manufacturing/source-practice/scatter-patterns.webp'),aspectRatio:1584/1423},
 {id:'food-source-risk-matrix',lessonId:'food-2-047',lessonSourceHash:'1d00c166b8bf70b88402c08467d9f6c45fe304fecca856761fa42b6ae6ee54ea',paragraphId:'p2',source:require('../../../assets/food-manufacturing/source-practice/risk-matrix.webp'),aspectRatio:776/648},
 {id:'food-source-flow',lessonId:'food-2-041',lessonSourceHash:'37b8f67724801f136f0d3fae7655011a31ac7e6e2b7dd07b49fe8ac0613f9490',paragraphId:'p5',source:require('../../../assets/food-manufacturing/source-practice/multi-input-flow.webp'),aspectRatio:1272/894,width:1272,height:894},
 {id:'food-source-normal-bands',lessonId:'food-2-042',lessonSourceHash:'6219428efea79e6df03f3b4335a377b6221a80d83130f4222539fcc70a02c8e5',paragraphId:'p1',source:require('../../../assets/food-manufacturing/source-practice/normal-bands.webp'),aspectRatio:1147/780},
 {id:'food-source-cause-bars',lessonId:'food-2-042',lessonSourceHash:'6219428efea79e6df03f3b4335a377b6221a80d83130f4222539fcc70a02c8e5',paragraphId:'p4',source:require('../../../assets/food-manufacturing/source-practice/cause-bars.webp'),aspectRatio:1101/711},
];
/** Every figure pins the lesson revision that its pixels/labels were accepted against. */
export function foodSourcePracticeFigureMatches(lesson:FoodManufacturingLesson,figure:PracticeFigure){
 return figure.lessonId===lesson.id&&typeof figure.lessonSourceHash==='string'&&figure.lessonSourceHash.length>0&&figure.lessonSourceHash===lesson.sourceHash&&lesson.paragraphs.some(p=>p.id===figure.paragraphId);
}
/** Keep inline/zoom descriptions tied to the same current source and caption revision. */
export function foodSourcePracticeDescription(lesson:FoodManufacturingLesson,figure:PracticeFigure,language:string,showTranslation:boolean){
 const p=lesson.paragraphs.find(p=>p.id===figure.paragraphId);
 const supplement=figure.captionSupplementId?[...captionSupplements.sections,...caption43.sections,...caption44.sections,...caption45.sections,...caption46.sections,...caption47.sections,...caption48.sections,...caption49.sections,...caption51.sections,...caption53.sections].find(s=>s.id===figure.captionSupplementId&&s.lessonSourceHash===lesson.sourceHash&&s.sourceHash===figure.captionSupplementSourceHash):null;
 const original=figure.altJa??(supplement?`${supplement.titleJa}。${supplement.textJa}`:p?`${p.titleJa}。${p.textJa}`:'');
 if(!showTranslation||language==='ja')return original;
 if(supplement){const tr=(supplement.translations as Record<string,{sourceHash:string;title:string;text:string}>)[language];return tr?.sourceHash===supplement.sourceHash?`${original}。${tr.title}。${tr.text}`:original;}
 if(figure.captionSupplementId)return original;
 const tr=foodManufacturingTranslation(lesson,language);return p&&tr?`${original}。${tr.paragraphTitles[p.id]}。${tr.paragraphs[p.id]}`:original;
}
function TechnicalJapaneseLabel({text,color}:{text:string;color:string}){
 const dictionary=axisReadings.tokens as Record<string,{reading:string}>,tokens=Object.keys(dictionary).sort((a,b)=>b.length-a.length),parts:{text:string;reading?:string}[]=[];let offset=0;
 while(offset<text.length){const key=tokens.find(key=>text.startsWith(key,offset));if(key){parts.push({text:key,reading:dictionary[key].reading});offset+=key.length;}else{const character=Array.from(text.slice(offset))[0];parts.push({text:character});offset+=character.length;}}
 return <View accessible accessibilityLabel={text} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}>{parts.map((part,i)=><View key={i} style={{alignItems:'center'}}><Text style={{color,fontSize:10,lineHeight:14}}>{part.reading??' '}</Text><Text style={{color,fontSize:15,lineHeight:24}}>{part.text}</Text></View>)}</View>;
}
const week04TechnicalIds=new Set(['food-source35-time-pie-angle','food-source35-pareto-cumulative','food-source43-bar-order','food-source46-control-line-names','food-source49-inside-limit-sequences','food-source51-six-original-series','food-source53-original-progress']);
/** Native source teaching key keeps retained Japanese technical pixels readable with the selected locale. */
function TechnicalSourceKey({lesson,figure,language,showTranslation,textColor}:{lesson:FoodManufacturingLesson;figure:PracticeFigure;language:string;showTranslation:boolean;textColor:string}){
 if(!week04TechnicalIds.has(figure.id))return null;
 const kind=figure.id,terms=kind.includes('time-pie')?['時間の順序（週）','件数']:kind.includes('pareto')?['項目','件数','累積比']:kind.includes('bar-order')?['項目','件数']:kind.includes('control-line')?['上限規格値','UCL：上方管理限界','CL：管理中心線','LCL：下方管理限界','下限規格値']:kind.includes('original-progress')?['経過時間（分）','累積出来高（kg）','標準','仮定の許容幅','実績']:['記録した順番','測定値','UCL：上方管理限界','CL：管理中心線','LCL：下方管理限界',...(kind.includes('six-original')?['中心付近（この練習だけ）','限界付近（この練習だけ）']:[])];
 const axis=showTranslation&&language!=='ja'?(axisLabels.locales as Record<string,Record<string,string>>)[language]:null,chart=showTranslation&&language!=='ja'?(chartLabels.locales as Record<string,{labels:Record<string,string>;example:string}>)[language]:null;
 const exact=kind.includes('time-pie')?'1,2,3,4 → 6,9,4,7 · A:15 / 50% / 180° · B:9 / 30% / 108° · C:6 / 20% / 72°':kind.includes('pareto')?'A,B,C:15,9,6 → 15,24,30 → 50%,80%,100%':kind.includes('bar-order')?'X=4 · Y=9 · Z=2':kind.includes('inside-limit')?'CL=0 · UCL=10 · LCL=−10 · A:2,3,1,4,2,5,3,4,1 · B:−3,−2,−1,0,1,2':kind.includes('six-original')?'CL=0 · UCL=10 · LCL=−10 · −2…2 / ≥8 / ≤−8 · E:3 · F:14 · G:3 · H:5 · I:15 · J:8':kind.includes('original-progress')?'3kg/min · ±10kg · min:0,10,20,30 → kg:0,40,65,80':'';
 return <View testID={`food-technical-source-key-${figure.id}`} style={{gap:8,paddingVertical:12}}>{chart&&<Text style={{color:textColor,fontSize:14}}>{chart.example}</Text>}{terms.map(term=><View key={term} style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{kind.includes('original-progress')&&['標準','仮定の許容幅','実績'].includes(term)&&<View style={{width:18,height:6,alignSelf:'center',backgroundColor:term==='標準'?'#71814f':term==='実績'?'#237d9c':'#e1e6d8'}}/>}<TechnicalJapaneseLabel text={term} color={textColor}/>{(axis?.[term]??chart?.labels[term])&&<Text style={{color:textColor,fontSize:15}}>{axis?.[term]??chart?.labels[term]}</Text>}</View>)}{exact!==''&&<Text selectable style={{color:textColor,fontSize:15,lineHeight:26}}>{exact}</Text>}<Text selectable style={{color:textColor,fontSize:16,lineHeight:28}}>{foodSourcePracticeDescription(lesson,figure,language,showTranslation)}</Text></View>;
}
/** Source-audit visual exercises use original diagrams and explicit lesson assumptions. */
export function FoodSourcePracticeVisuals({lesson,textColor,readingColor,language,showTranslation,dailyPlacement=false}:{lesson:FoodManufacturingLesson;textColor:string;readingColor:string;language:string;showTranslation:boolean;dailyPlacement?:boolean}){
 const [expanded,setExpanded]=useState<PracticeFigure|null>(null);
 const labels=showTranslation&&language!=='ja'?(ui.locales as Record<string,{close:string}>)[language]:undefined;
 const base=foodManufacturingLesson(lesson.id,lesson.level);
 if(!base||base.sourceHash!==lesson.sourceHash)return null;
 const translated=showTranslation&&language!=='ja'?foodManufacturingTranslation(lesson,language):null;
 return <>{figures.filter(figure=>foodSourcePracticeFigureMatches(lesson,figure)&&(dailyPlacement?figure.id==='food-source-normal-bands':!(figure.id==='food-source-normal-bands'&&foodRoyalWeek7NativeFor(lesson)?.kind==='normal'))).map(figure=>{
 const p=lesson.paragraphs.find(p=>p.id===figure.paragraphId);if(!p)return null;
 const captionSupplement=figure.captionSupplementId?[...captionSupplements.sections,...caption43.sections,...caption44.sections,...caption45.sections,...caption46.sections,...caption47.sections,...caption48.sections,...caption49.sections,...caption51.sections,...caption53.sections].find(s=>s.id===figure.captionSupplementId&&s.lessonSourceHash===lesson.sourceHash&&s.sourceHash===figure.captionSupplementSourceHash):null;
 if(figure.captionSupplementId&&!captionSupplement)return null;
 const supplementTranslation=captionSupplement&&showTranslation&&language!=='ja'?(captionSupplement.translations as Record<string,{title:string;sourceHash:string}>)[language]:null;
 const supplementTitle=supplementTranslation?.sourceHash===captionSupplement?.sourceHash?supplementTranslation?.title:null;
 const headingOnly=figure.id.startsWith('food-source32-')||figure.id.startsWith('food-source37-')||figure.id.startsWith('food-source43-')||figure.id.startsWith('food-source46-');
 return <View key={figure.id} testID={figure.id} style={s.figure}>
 {captionSupplement?<View accessible accessibilityRole="header" accessibilityLabel={captionSupplement.titleJa} style={s.rubyLine}>{captionSupplement.titleRuby.map((token,i)=><View key={i} style={s.word}><Text style={{color:readingColor,fontSize:11,lineHeight:15}}>{'reading' in token?token.reading:' '}</Text><Text selectable style={{color:textColor,fontSize:19,lineHeight:30,fontWeight:'700'}}>{token.text}</Text></View>)}</View>:<FoodLessonRuby lesson={lesson} field={`paragraphs.${p.id}.titleJa`} text={p.titleJa} color={textColor} readingColor={readingColor} heading/>}
 {!headingOnly&&<FoodLessonRuby lesson={lesson} field={`paragraphs.${p.id}.textJa`} text={p.textJa} color={textColor} readingColor={readingColor}/>}
 {captionSupplement?supplementTitle&&<TranslationText>{supplementTitle}</TranslationText>:translated&&<TranslationText>{translated.paragraphTitles[p.id]}{!headingOnly?'\n'+translated.paragraphs[p.id]:''}</TranslationText>}
 {figure.id==='food-source-risk-matrix'&&<View><Text style={{color:readingColor,fontSize:10,lineHeight:17}}>はっせいかのうせい ↓　じゅうだいせい →</Text><Text style={{color:textColor,fontSize:16,lineHeight:27}}>発生可能性 ↓　重大性 →</Text>{translated&&<TranslationText>{translated.terms?.['発生可能性']} ↓　{translated.terms?.['重大性']} →</TranslationText>}</View>}
 <Pressable accessibilityRole="button" accessibilityLabel={`${captionSupplement?.titleJa??p.titleJa}・拡大`} onPress={()=>setExpanded(figure)}><Image source={figure.source} accessibilityLabel={foodSourcePracticeDescription(lesson,figure,language,showTranslation)} resizeMode="contain" style={[s.image,{aspectRatio:figure.aspectRatio}]}/></Pressable>
 <TechnicalSourceKey lesson={lesson} figure={figure} language={language} showTranslation={showTranslation} textColor={textColor}/>
 {figure.id==='food-source33-ojt-cycle'&&<FoodRoyalOjtCycle/>}
 {figure.id==='food-source33-chemical-ppe'&&<FoodRoyalChemicalSafety lesson={lesson} language={language} showTranslation={showTranslation}/>}
 </View>;
 })}<Modal visible={expanded!==null} animationType="none" onRequestClose={()=>setExpanded(null)}><View style={{flex:1,backgroundColor:'#fffaf0',paddingTop:36}}><Pressable accessibilityRole="button" accessibilityLabel={`図を閉じる${labels?` · ${labels.close}`:''}`} onPress={()=>setExpanded(null)} style={{padding:16}}><Text style={{color:'#233c4c',fontSize:18}}>図を閉じる{labels?` · ${labels.close}`:''}</Text></Pressable>{expanded&&<ScrollView horizontal><ScrollView style={{width:expanded.width??1200}}><Image testID="food-source-practice-zoom" source={expanded.source} resizeMode="contain" accessibilityLabel={foodSourcePracticeDescription(lesson,expanded,language,showTranslation)} style={{width:expanded.width??1200,height:expanded.height??1200/expanded.aspectRatio}}/><TechnicalSourceKey lesson={lesson} figure={expanded} language={language} showTranslation={showTranslation} textColor={textColor}/>{expanded.id==='food-source33-ojt-cycle'&&<FoodRoyalOjtCycle/>}{expanded.id==='food-source33-chemical-ppe'&&<FoodRoyalChemicalSafety lesson={lesson} language={language} showTranslation={showTranslation}/>}</ScrollView></ScrollView>}</View></Modal></>;
}
const s=StyleSheet.create({figure:{gap:10,paddingVertical:16},image:{width:'100%',height:undefined,alignSelf:'center'},rubyLine:{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'},word:{alignItems:'center',maxWidth:'100%'}});
