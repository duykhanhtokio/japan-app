import {useState} from 'react';
import {Pressable,StyleSheet,Text,View} from 'react-native';
import data from '@/data/food-manufacturing/source-assessment34.json';
import type {FoodManufacturingLesson} from '@/data/food-manufacturing';
import {TranslationText} from '@/components/tokutei/StudyAppearance';

type RubyToken={text:string;reading?:string};
type Translation={title:string;prompt:string;expectedPoints:string[];sourceHash:string};
function RubyLine({tokens,color,readingColor,heading=false}:{tokens:RubyToken[];color:string;readingColor:string;heading?:boolean}){
 return <View style={styles.line}>{tokens.map((token,i)=><View key={i} style={styles.word}><Text style={{color:readingColor,fontSize:10,lineHeight:14}}>{token.reading??' '}</Text><Text selectable style={{color,fontSize:heading?19:17,lineHeight:29,fontWeight:heading?'700':'400'}}>{token.text}</Text></View>)}</View>;
}

function Check({check,language,showTranslation,textColor,readingColor}:{check:typeof data.checks[number];language:string;showTranslation:boolean;textColor:string;readingColor:string}){
 const [revealed,setRevealed]=useState(false);
 const candidate=(check.translations as Record<string,Translation>)[language];
 const t=showTranslation&&language!=='ja'&&candidate?.sourceHash===check.sourceHash?candidate:null;
 const labels=(data.uiLabels as Record<string,{show:string;hide:string}>)[t?language:'ja']??data.uiLabels.ja;
 return <View testID={check.id} style={styles.check}>
 <View accessible accessibilityRole="header" accessibilityLabel={check.titleJa}><RubyLine tokens={check.titleRuby} color={textColor} readingColor={readingColor} heading/></View>
 {t&&<TranslationText>{t.title}</TranslationText>}
 <View accessible accessibilityLabel={check.promptJa}><RubyLine tokens={check.promptRuby} color={textColor} readingColor={readingColor}/></View>
 {t&&<TranslationText>{t.prompt}</TranslationText>}
 <Pressable testID={`${check.id}-reveal`} accessibilityRole="button" accessibilityState={{expanded:revealed}} onPress={()=>setRevealed(value=>!value)} style={[styles.button,{borderColor:readingColor}]}><Text style={{color:textColor,fontSize:16,lineHeight:26}}>{revealed?labels.hide:labels.show}</Text></Pressable>
 {revealed&&<View testID={`${check.id}-points`} style={styles.points}>{check.expectedPointsJa.map((point,i)=><View key={i} style={styles.point}>
 <Text style={{color:textColor,fontSize:16}}>{i+1}.</Text><View style={styles.pointBody}><View accessible accessibilityLabel={point}><RubyLine tokens={check.expectedPointsRuby[i]} color={textColor} readingColor={readingColor}/></View>{t&&<TranslationText>{t.expectedPoints[i]}</TranslationText>}</View>
 </View>)}</View>}
 </View>;
}

/** Ungraded source-bound practice; no exam answer or saved-progress mutation. */
export function FoodSourceAssessmentChecks({lesson,language,showTranslation,textColor,readingColor}:{lesson:FoodManufacturingLesson;language:string;showTranslation:boolean;textColor:string;readingColor:string}){
 return <>{data.checks.filter(check=>check.lessonId===lesson.id&&check.lessonSourceHash===lesson.sourceHash).map(check=><Check key={check.id} check={check} language={language} showTranslation={showTranslation} textColor={textColor} readingColor={readingColor}/>)}</>;
}
const styles=StyleSheet.create({check:{gap:12,paddingVertical:18},line:{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'},word:{alignItems:'center',maxWidth:'100%'},button:{borderWidth:1,borderRadius:8,paddingHorizontal:14,paddingVertical:10,alignSelf:'flex-start',maxWidth:'100%'},points:{gap:12},point:{flexDirection:'row',gap:8,alignItems:'flex-start'},pointBody:{flex:1,minWidth:0}});
