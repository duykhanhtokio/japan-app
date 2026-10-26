import {useState} from 'react';
import {Image,Modal,Pressable,ScrollView,Text,View,useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {manufacturingUi} from '@/data/manufacturing/ui';
import captionData from '@/data/manufacturing/diagram-translations.json';
const figures:Record<string,{source:ReturnType<typeof require>;altJa:string}>={
 'mfg1-mechanical-lesson-044':{source:require('../../../assets/manufacturing/diagrams/batch07-mechanical-third-angle.png'),altJa:'第三角法では、正面図の上に上から見た平面図、右に右から見た右側面図を配置する。配置関係だけを示す模式図で、部品の形状や寸法は示さない。'},
 'mfg1-electrical-l038':{source:require('../../../assets/manufacturing/diagrams/batch07-electrical-comparison-measurement.png'),altJa:'比較測定の紙上例。一目盛0.01mmを仮定し、4目盛の移動から差の大きさ0.04mmを求める。＋の符号はこの例の記録条件であり、対象の絶対寸法ではない。実機では基準、接触条件、符号、目盛値を確認する。'},
 'mfg1-surface-lesson-042':{source:require('../../../assets/manufacturing/diagrams/batch07-surface-resistor-topology.png'),altJa:'紙上の理想抵抗の数値例。直列は4Ωと8Ω、24Vで2A、電圧降下8Vと16V。並列は6Ωと3Ω、両端6Vで枝電流1Aと2A、全電流3A、合成抵抗2Ω。設備の配線手順ではない。'},
 'mfg1-mechanical-lesson-035':{source:require('../../../assets/manufacturing/diagrams/rolling-extrusion.png'),altJa:'圧延ではロール間で厚さを減らし、押出しではビレットをダイスの穴から押し出す。寸法や運転条件を示さない模式図。'},
 'mfg1-electrical-l030':{source:require('../../../assets/manufacturing/diagrams/transformer-ratio.png'),altJa:'交流の理想変圧器では、二次電圧と一次電圧の比は巻数の比に等しい。図の線数は実際の巻数ではない。'},
 'mfg1-surface-lesson-028':{source:require('../../../assets/manufacturing/diagrams/charge-efficiency.png'),altJa:'電気量は電流アンペアと時間秒の積。電流効率は実際の析出量を理論析出量で割った百分率。反応と単位の前提を確認する。'},
 'mfg1-electrical-l006':{source:require('../../../assets/manufacturing/diagrams/ohms-law.png'),altJa:'単純な直流抵抗回路で、電圧が同じなら、抵抗が大きいほど電流は小さい。'},
 'mfg1-surface-lesson-006':{source:require('../../../assets/manufacturing/diagrams/surface-process-control.png'),altJa:'指定された電流・電圧条件と測定値を照合する。範囲外では職場の標準に従って報告する。'},
 'mfg1-mechanical-lesson-011':{source:require('../../../assets/manufacturing/diagrams/qc-control-plan.png'),altJa:'QC工程図では工程・管理項目・管理方法・管理頻度・異常時の処置を確認する。'},
 'mfg1-electrical-l017':{source:require('../../../assets/manufacturing/diagrams/series-parallel.png'),altJa:'直列では電流が共通で電圧を加え、並列では電圧が共通で電流を加える。抵抗と直流電源の基本関係を示す模式図。'},
 'mfg1-surface-lesson-011':{source:require('../../../assets/manufacturing/diagrams/concentration-units.png'),altJa:'g/Lは溶質の質量を溶液の体積で割り、mol/Lは溶質の物質量を溶液の体積で割る。単位を区別する。'},
};
export function ManufacturingDiagram({lessonId,language='ja',showTranslation=false}:{lessonId:string;language?:string;showTranslation?:boolean}){
 const [expanded,setExpanded]=useState(false),{width}=useWindowDimensions(),i=useSafeAreaInsets();
 const item=figures[lessonId],{colors}=useStudyAppearance();if(!item)return null;
 const candidate=captionData.locales[language as keyof typeof captionData.locales]?.[lessonId as keyof typeof captionData.locales.en];
 const translated=candidate&&showTranslation&&candidate.sourceJa===item.altJa?candidate.text:null;
 const zoomWidth=Math.max(960,width),button=(label:string,action:()=>void)=><Pressable accessibilityRole="button" accessibilityLabel={label} onPress={action} style={{minHeight:48,padding:12,borderWidth:1,borderColor:colors.border,borderRadius:8}}><Text style={{color:colors.text,fontSize:16,textAlign:'center'}}>{label}</Text></Pressable>;
 return <View style={{gap:8}}><Image testID="manufacturing-technical-diagram" accessibilityLabel={translated??item.altJa} source={item.source} resizeMode="contain" style={{width:'100%',aspectRatio:1.6}}/><Text style={{fontSize:15,lineHeight:25,color:colors.muted}}>{item.altJa}</Text>{translated&&<Text style={{fontSize:15,lineHeight:25,color:colors.translationText,backgroundColor:colors.translation,padding:12,borderRadius:8}}>{translated}</Text>}{button(manufacturingUi(language,'imageZoom'),()=>setExpanded(true))}
 <Modal visible={expanded} animationType="none" onRequestClose={()=>setExpanded(false)}><View style={{flex:1,paddingTop:i.top,paddingBottom:i.bottom,paddingLeft:i.left,paddingRight:i.right,backgroundColor:colors.background}}><View style={{padding:12}}>{button(manufacturingUi(language,'imageClose'),()=>setExpanded(false))}</View><ScrollView style={{flex:1}}><ScrollView horizontal nestedScrollEnabled style={{width:'100%'}}><Image testID="manufacturing-expanded-diagram" accessibilityLabel={translated??item.altJa} source={item.source} resizeMode="contain" style={{width:zoomWidth,height:zoomWidth/1.6}}/></ScrollView></ScrollView></View></Modal>
 </View>;
}
