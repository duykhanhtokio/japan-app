import {Image,Text,View} from 'react-native';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';
const figures:Record<string,{source:ReturnType<typeof require>;altJa:string}>={
 'mfg1-electrical-l006':{source:require('../../../assets/manufacturing/diagrams/ohms-law.png'),altJa:'抵抗一定のとき、同じ電圧では抵抗が大きいほど電流は小さい。'},
 'mfg1-surface-lesson-006':{source:require('../../../assets/manufacturing/diagrams/surface-process-control.png'),altJa:'指定された電流・電圧条件と測定値を照合する。範囲外では職場の標準に従って報告する。'},
};
export function ManufacturingDiagram({lessonId}:{lessonId:string}){
 const item=figures[lessonId],{colors}=useStudyAppearance();if(!item)return null;
 return <View style={{gap:8}}><Image accessibilityLabel={item.altJa} source={item.source} resizeMode="contain" style={{width:'100%',aspectRatio:1.6}}/><Text style={{fontSize:15,lineHeight:25,color:colors.muted}}>{item.altJa}</Text></View>;
}
