import {useState} from 'react';
import {Pressable,StyleSheet,Text,View} from 'react-native';
import data from '@/data/food-manufacturing/source-assessment34.json';
import additions35 from '@/data/food-manufacturing/source-assessment35.json';
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
import c58a099 from '@/data/food-manufacturing/source-closure58-upstream-a099.json';
import c59f8119 from '@/data/food-manufacturing/source-closure59-f8119.json';
import c60f8119 from '@/data/food-manufacturing/source-closure60-f8119.json';
import c61f8119 from '@/data/food-manufacturing/source-closure61-f8119.json';
import type {FoodManufacturingLesson} from '@/data/food-manufacturing';
import {TranslationText} from '@/components/tokutei/StudyAppearance';

type RubyToken={text:string;reading?:string};
type Translation={title:string;prompt:string;expectedPoints:string[];sourceHash:string};
type RuntimeCheck={id:string;lessonId:string;lessonSourceHash:string;titleJa:string;promptJa:string;expectedPointsJa:string[];sourceHash:string;titleRuby:RubyToken[];promptRuby:RubyToken[];expectedPointsRuby:RubyToken[][];translations:Record<string,Translation>};
const checks:RuntimeCheck[]=[...data.checks,...additions35.checks,...additions38.checks,...additions39.checks,...additions40.checks,...additions41.checks,...additions42.checks,...additions43.checks,...additions44.checks,...additions45.checks,...additions46.checks,...additions47.checks,...additions48.checks,...additions49.checks,...additions50.checks,...additions51.checks,...additions52.checks,...additions53.checks,...additions54.checks,...additions55.checks,...additions56.checks,...additions57.checks,...c58a099.checks,...c59f8119.checks,...c60f8119.checks,...c61f8119.checks];
function RubyLine({tokens,color,readingColor,heading=false}:{tokens:RubyToken[];color:string;readingColor:string;heading?:boolean}){
 return <View style={styles.line}>{tokens.map((token,i)=><View key={i} style={styles.word}><Text style={{color:readingColor,fontSize:10,lineHeight:14}}>{token.reading??' '}</Text><Text selectable style={{color,fontSize:heading?19:17,lineHeight:29,fontWeight:heading?'700':'400'}}>{token.text}</Text></View>)}</View>;
}

function Check({check,language,showTranslation,textColor,readingColor}:{check:RuntimeCheck;language:string;showTranslation:boolean;textColor:string;readingColor:string}){
 const [revealed,setRevealed]=useState(false);
 const candidate=(check.translations as Record<string,Translation>)[language];
 const t=showTranslation&&language!=='ja'&&candidate?.sourceHash===check.sourceHash?candidate:null;
 const labels=(data.uiLabels as Record<string,{show:string;hide:string}>)[t?language:'ja']??data.uiLabels.ja;
 return <View testID={check.id} style={styles.check}>
 <View accessible accessibilityRole="header" accessibilityLabel={check.titleJa}><RubyLine tokens={check.titleRuby} color={textColor} readingColor={readingColor} heading/></View>
 {t&&<TranslationText>{t.title}</TranslationText>}
 <View accessible accessibilityLabel={check.promptJa}><RubyLine tokens={check.promptRuby} color={textColor} readingColor={readingColor}/></View>
 {t&&<TranslationText>{t.prompt}</TranslationText>}
 <Pressable testID={`${check.id}-reveal`} accessibilityRole="button" accessibilityState={{expanded:revealed}} aria-expanded={revealed} onPress={()=>setRevealed(value=>!value)} style={[styles.button,{borderColor:readingColor}]}><Text style={{color:textColor,fontSize:16,lineHeight:26}}>{revealed?labels.hide:labels.show}</Text></Pressable>
 {revealed&&<View testID={`${check.id}-points`} style={styles.points}>{check.expectedPointsJa.map((point,i)=><View key={i} style={styles.point}>
 <Text style={{color:textColor,fontSize:16}}>{i+1}.</Text><View style={styles.pointBody}><View accessible accessibilityLabel={point}><RubyLine tokens={check.expectedPointsRuby[i]} color={textColor} readingColor={readingColor}/></View>{t&&<TranslationText>{t.expectedPoints[i]}</TranslationText>}</View>
 </View>)}</View>}
 </View>;
}

/** Ungraded source-bound practice; no exam answer or saved-progress mutation. */
export function FoodSourceAssessmentChecks({lesson,language,showTranslation,textColor,readingColor}:{lesson:FoodManufacturingLesson;language:string;showTranslation:boolean;textColor:string;readingColor:string}){
 return <>{checks.filter(check=>check.lessonId===lesson.id&&check.lessonSourceHash===lesson.sourceHash).map(check=><Check key={check.id} check={check} language={language} showTranslation={showTranslation} textColor={textColor} readingColor={readingColor}/>)}</>;
}
const styles=StyleSheet.create({check:{gap:12,paddingVertical:18},line:{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'},word:{alignItems:'center',maxWidth:'100%'},button:{borderWidth:1,borderRadius:8,paddingHorizontal:14,paddingVertical:10,alignSelf:'flex-start',maxWidth:'100%'},points:{gap:12},point:{flexDirection:'row',gap:8,alignItems:'flex-start'},pointBody:{flex:1,minWidth:0}});
