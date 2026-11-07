import {AgricultureCoreAppearanceRuby,coreAppearanceLocalizedTitle} from './AgricultureCoreAppearanceRuby';
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
 const ruby=(field:string,text:string,style:import('react-native').StyleProp<import('react-native').TextStyle>)=><AgricultureCoreAppearanceRuby provider="flower-appearance" lesson={lesson} level={level} language="ja" field={field} text={text} style={style} color={colors.translationText}/>;
 const t=showTranslation&&translation?.sourceHash===data.sourceHash?translation:null;
 const localized=t?(data.labels as Record<string,Labels>)[language]:undefined;
 const labels=localized||data.labels.ja;
 return <View testID="agri-royal-flower-appearance" style={{minWidth:0,maxWidth:'100%',flexShrink:1,gap:12,marginVertical:12}}>
  {ruby('title','切り花類と鉢もの類の外観例',{color:colors.text,fontSize:19,lineHeight:29,fontWeight:'700'})}{!!localized&&language!=='ja'&&<Text testID="agri-flower-appearance-localized-title" style={{color:colors.translationText,fontSize:17,lineHeight:28}}>{coreAppearanceLocalizedTitle({provider:'flower-appearance',lesson,level,language})}</Text>}
  <ZoomableFigure source={source} width={data.asset.width} height={data.asset.height} altJa={[...labels.groups,labels.limit].join('。')} testID="agri-royal-flower-appearance" colors={colors} allowExpandedView/>
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>{data.labels.ja.groups.map((group,i)=><View key={group} style={{flexGrow:1,flexBasis:220,minWidth:0,maxWidth:'100%',flexShrink:1,gap:8}}>{ruby(`group:${i}`,group,{color:colors.translationText,fontSize:17,lineHeight:28,fontWeight:'700'})}{!!localized&&language!=='ja'&&<Text testID={`agri-flower-appearance-localized-group-${i}`} style={{color:colors.translationText,fontSize:17,lineHeight:28}}>{localized.groups[i]}</Text>}</View>)}</View>
  {paragraphs.map(p=>p&&<View key={p.id} style={{minWidth:0,maxWidth:'100%',flexShrink:1,gap:8}}>{ruby(`paragraph:${p.id}`,p.textJa,{color:colors.translationText,fontSize:16,lineHeight:27})}{!!t&&<Text testID={`${p.id}-figure-translation`} style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{t.paragraphs[p.id]}</Text>}</View>)}
  {ruby('limit',data.labels.ja.limit,{color:colors.translationText,fontSize:16,lineHeight:27})}
  {!!localized&&language!=='ja'&&<Text testID="agri-flower-appearance-localized-limit" style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{localized.limit}</Text>}
  <Text style={{color:colors.translationText,fontSize:14,lineHeight:23}}>AGR-S2 · pp.4–5</Text>
 </View>;
}
