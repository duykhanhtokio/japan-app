import {ManufacturingIllustrationText as Text} from './ManufacturingIllustrationText';
import {View} from 'react-native';
import type {ManufacturingLesson} from '@/data/manufacturing';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';

type NativeLabels={items:{number:number;text:string;view:string}[];scope:string};
const data=require('@/data/manufacturing/royal-week03-mechanical-native.json') as {lessonId:string;sourceHash:string;locales:Record<string,NativeLabels>};
/** Native text identifies the four numbered diagram views without baking translations into the artwork. */
export function RoyalWeek03MechanicalDetails({lesson,language='ja'}:{lesson:ManufacturingLesson;language?:string}){
 const {colors}=useStudyAppearance();
 if(lesson.id!==data.lessonId||lesson.sourceHash!==data.sourceHash)return null;
 const target=Object.prototype.hasOwnProperty.call(data.locales,language)?data.locales[language]:data.locales.ja;
 return <View testID="manufacturing-native-test-measurement-views" style={{gap:8,padding:14,borderWidth:1,borderColor:colors.border,borderRadius:10}}>
  {target.items.map(item=><Text readingLanguage={target===data.locales.ja?'ja':language} key={item.number} style={{color:colors.text,fontSize:17,lineHeight:29}}>{item.number} · {item.text}{item.view?`（${item.view}）`:''}</Text>)}
  <Text readingLanguage={target===data.locales.ja?'ja':language} style={{color:colors.muted,fontSize:15,lineHeight:25}}>{target.scope}</Text>
 </View>;
}
