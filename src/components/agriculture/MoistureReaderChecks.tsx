import {useState,type ComponentType} from 'react';
import {Text,View} from 'react-native';
import {TranslationText,useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import data from '@/data/agriculture/reader-moisture-checks.json';
type Token={text:string;readingKana?:string};
function Japanese({tokens,testID}:{tokens:Token[];testID:string}) {
 const {colors}=useStudyAppearance();
 return <View testID={testID} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',marginVertical:8}}>{tokens.map((t,i)=><View key={i} style={{alignItems:'center'}}>{t.readingKana&&<Text style={{fontSize:11,lineHeight:17,color:colors.muted}}>{t.readingKana}</Text>}<Text style={{fontSize:17,lineHeight:29,color:colors.text}}>{t.text}</Text></View>)}</View>;
}
export function MoistureReaderChecks({lessonId,level,language,showTranslation,Button}:{lessonId:string;level:string;language:string;showTranslation:boolean;Button:ComponentType<{title:string;onPress:()=>void}>}) {
 const [opened,setOpened]=useState<Record<string,boolean>>({});
 const checks=data.checks.filter(c=>c.lessonId===lessonId&&c.levels.includes(level));
 if(!checks.length)return null;
 return <View testID="agriculture-moisture-reader-checks">{checks.map(c=>{const t=(c.translations as Record<string,{prompt:string;modelAnswer:string}>)[language],open=!!opened[c.id];return <View key={c.id} testID={c.id}>
 <Japanese tokens={c.promptRuby} testID={`${c.id}-prompt`}/>
 {showTranslation&&t&&<TranslationText testID={`${c.id}-translation`}>{t.prompt}</TranslationText>}
 <View testID={`${c.id}-toggle`}><Button title={open?'答えを閉じる':'答えを確認する'} onPress={()=>setOpened(v=>({...v,[c.id]:!v[c.id]}))}/></View>
 {open&&<><Japanese tokens={c.modelAnswerRuby} testID={`${c.id}-answer`}/>{showTranslation&&t&&<TranslationText testID={`${c.id}-answer-translation`}>{t.modelAnswer}</TranslationText>}</>}
 </View>})}</View>;
}
