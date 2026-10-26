import {useState} from 'react';
import {Image,Modal,Pressable,ScrollView,Text,View,useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {manufacturingUi} from '@/data/manufacturing/ui';
const figures:Record<string,{source:ReturnType<typeof require>;altJa:string}>={
 'mfg1-electrical-l006':{source:require('../../../assets/manufacturing/diagrams/ohms-law.png'),altJa:'抵抗一定のとき、同じ電圧では抵抗が大きいほど電流は小さい。'},
 'mfg1-surface-lesson-006':{source:require('../../../assets/manufacturing/diagrams/surface-process-control.png'),altJa:'指定された電流・電圧条件と測定値を照合する。範囲外では職場の標準に従って報告する。'},
 'mfg1-mechanical-lesson-011':{source:require('../../../assets/manufacturing/diagrams/qc-control-plan.png'),altJa:'QC工程図では工程・管理項目・管理方法・管理頻度・異常時の処置を確認する。'},
 'mfg1-electrical-l017':{source:require('../../../assets/manufacturing/diagrams/series-parallel.png'),altJa:'直列では電流が共通で電圧を加え、並列では電圧が共通で電流を加える。抵抗と直流電源の基本関係を示す模式図。'},
 'mfg1-surface-lesson-011':{source:require('../../../assets/manufacturing/diagrams/concentration-units.png'),altJa:'g/Lは溶質の質量を溶液の体積で割り、mol/Lは溶質の物質量を溶液の体積で割る。単位を区別する。'},
};
export function ManufacturingDiagram({lessonId,language='ja'}:{lessonId:string;language?:string}){
 const [expanded,setExpanded]=useState(false),{width}=useWindowDimensions(),i=useSafeAreaInsets();
 const item=figures[lessonId],{colors}=useStudyAppearance();if(!item)return null;
 const zoomWidth=Math.max(960,width),button=(label:string,action:()=>void)=><Pressable accessibilityRole="button" accessibilityLabel={label} onPress={action} style={{minHeight:48,padding:12,borderWidth:1,borderColor:colors.border,borderRadius:8}}><Text style={{color:colors.text,fontSize:16,textAlign:'center'}}>{label}</Text></Pressable>;
 return <View style={{gap:8}}><Image testID="manufacturing-technical-diagram" accessibilityLabel={item.altJa} source={item.source} resizeMode="contain" style={{width:'100%',aspectRatio:1.6}}/><Text style={{fontSize:15,lineHeight:25,color:colors.muted}}>{item.altJa}</Text>{button(manufacturingUi(language,'imageZoom'),()=>setExpanded(true))}
 <Modal visible={expanded} animationType="none" onRequestClose={()=>setExpanded(false)}><View style={{flex:1,paddingTop:i.top,paddingBottom:i.bottom,paddingLeft:i.left,paddingRight:i.right,backgroundColor:colors.background}}><View style={{padding:12}}>{button(manufacturingUi(language,'imageClose'),()=>setExpanded(false))}</View><ScrollView style={{flex:1}}><ScrollView horizontal nestedScrollEnabled style={{width:'100%'}}><Image testID="manufacturing-expanded-diagram" accessibilityLabel={item.altJa} source={item.source} resizeMode="contain" style={{width:zoomWidth,height:zoomWidth/1.6}}/></ScrollView></ScrollView></View></Modal>
 </View>;
}
