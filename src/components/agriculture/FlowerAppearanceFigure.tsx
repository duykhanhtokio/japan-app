import {Text,View} from 'react-native';
import {ZoomableFigure} from './ZoomableFigure';
import data from '@/data/agriculture/flower-appearance-figure.json';
import type {AgricultureLesson} from '@/data/agriculture';
import type {AgricultureTranslation} from '@/data/agriculture/translations';
const source=require('../../../assets/agriculture/royal-weekly-20261107/week01/cut-potted-flower-examples.webp');
type Colors={text:string;translation:string;translationText:string;border:string};
type Labels={groups:string[];limit:string};
export function FlowerAppearanceFigure({lesson,level,language='ja',showTranslation=false,translation,colors}:{lesson:AgricultureLesson;level:string;language?:string;showTranslation?:boolean;translation:AgricultureTranslation|null;colors:Colors}){
 if(level!=='2'||lesson.id!==data.lessonId||lesson.sourceHash!==data.sourceHash)return null;
 const paragraphs=['agr-flowers-p2','agr-flowers-p3'].map(id=>lesson.paragraphs.find(p=>p.id===id));
 if(paragraphs.some(p=>!p))return null;
 const t=showTranslation&&translation?.sourceHash===data.sourceHash?translation:null;
 const localized=t?(data.labels as Record<string,Labels>)[language]:undefined;
 const labels=localized||data.labels.ja;
 return <View testID="agri-royal-flower-appearance" style={{gap:12,marginVertical:16}}>
  <Text style={{color:colors.text,fontSize:19,lineHeight:29,fontWeight:'700'}}>切り花類と鉢もの類の外観例</Text>
  <ZoomableFigure source={source} width={data.asset.width} height={data.asset.height} altJa={[...labels.groups,labels.limit].join('。')} testID="agri-royal-flower-appearance" colors={colors} allowExpandedView/>
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>{data.labels.ja.groups.map((group,i)=><View key={group} style={{flexGrow:1,flexBasis:220,gap:6}}><Text style={{color:colors.translationText,fontSize:17,lineHeight:28,fontWeight:'700'}}>{group}</Text>{!!localized&&language!=='ja'&&<Text testID={`agri-flower-appearance-localized-group-${i}`} style={{color:colors.translationText,fontSize:17,lineHeight:28}}>{localized.groups[i]}</Text>}</View>)}</View>
  {paragraphs.map(p=>p&&<View key={p.id} style={{gap:6}}><Text style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{p.textJa}</Text>{!!t&&<Text testID={`${p.id}-figure-translation`} style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{t.paragraphs[p.id]}</Text>}</View>)}
  <Text style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{data.labels.ja.limit}</Text>
  {!!localized&&language!=='ja'&&<Text testID="agri-flower-appearance-localized-limit" style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{localized.limit}</Text>}
  <Text style={{color:colors.translationText,fontSize:14,lineHeight:23}}>AGR-S2 · pp.4–5</Text>
 </View>;
}
