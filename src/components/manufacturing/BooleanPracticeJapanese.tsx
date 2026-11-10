import {Pressable,StyleSheet,Text,View} from 'react-native';
import type {ManufacturingQuestion} from '@/data/manufacturing';
import {manufacturingBooleanPracticeRuby} from '@/data/manufacturing/boolean-practice';
import {TranslationText,useStudyAppearance} from '@/components/tokutei/StudyAppearance';
/** Optional ruby is scoped to the four additive Boolean practice items. */
export function BooleanPracticeJapanese({question,field}:{question:ManufacturingQuestion;field:'stem'|number}){
 const {colors}=useStudyAppearance(),parts=manufacturingBooleanPracticeRuby(question,field),text=field==='stem'?question.stemJa:question.optionsJa[field];
 return parts?<View style={styles.ruby} accessibilityLabel={text}>{parts.map((p,i)=><View key={i} accessible={false} style={styles.word}><Text style={{fontSize:10,lineHeight:14,color:colors.muted}}>{p.reading??' '}</Text><Text selectable style={[styles.text,{color:colors.text}]}>{p.text}</Text></View>)}</View>:<Text style={[styles.text,{color:colors.text}]}>{text}</Text>;
}
export function BooleanPracticeOption({question,index,translation,selected,disabled,onPress}:{question:ManufacturingQuestion;index:number;translation?:string;selected:boolean;disabled:boolean;onPress:()=>void}){
 const {colors}=useStudyAppearance(),text=question.optionsJa[index];
 return <Pressable accessibilityRole="button" accessibilityLabel={`${index+1}. ${text}${translation?' '+translation:''}`} accessibilityState={{disabled,selected}} disabled={disabled} onPress={onPress} style={[styles.button,{borderColor:colors.border,backgroundColor:selected?colors.translation:colors.background,opacity:disabled?.45:1}]}><Text style={[styles.text,{color:colors.text}]}>{index+1}.</Text><BooleanPracticeJapanese question={question} field={index}/>{translation&&<TranslationText>{translation}</TranslationText>}</Pressable>;
}
const styles=StyleSheet.create({ruby:{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'},word:{alignItems:'center',maxWidth:'100%'},text:{fontSize:17,lineHeight:29},button:{paddingHorizontal:15,paddingVertical:12,borderWidth:1,borderRadius:8,marginVertical:5,minHeight:48}});
