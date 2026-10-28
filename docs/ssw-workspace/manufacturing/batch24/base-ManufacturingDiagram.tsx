import {useState} from 'react';
import {Image,Modal,Pressable,ScrollView,Text,View,useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {manufacturingUi} from '@/data/manufacturing/ui';
import captionData from '@/data/manufacturing/diagram-translations.json';
const ratios:Record<string,number>={"mfg1-mechanical-lesson-018":1400/1400,"mfg1-electrical-l005":1400/1100,"mfg1-mechanical-lesson-048":14/13,"mfg1-mechanical-lesson-081": 1.1428571428571428, "mfg1-mechanical-lesson-082": 1.1428571428571428, "mfg1-electrical-l087": 0.7947019867549668, "mfg1-electrical-l077": 1.6, "mfg1-electrical-l071": 1.5, "mfg1-surface-lesson-053": 1.6, "mfg1-surface-lesson-060": 1.6};
const figures:Record<string,{source:ReturnType<typeof require>;altJa:string}>={
 'mfg1-mechanical-lesson-018':{source:require('../../../assets/manufacturing/diagrams/batch23-mechanical-caliper-contacts.png'),altJa:'ノギスの部位と測定面を区別するための独自模式図。本尺側の固定ジョウとスライダ側の測定ジョウ、外側・内側・深さの測定面の役割を対応させる。外側は対象の外面、内側は穴や溝の向かい合う内面、深さは基準となる端面と底の当たりを確認する。デプスバーのある器具を例にした位置関係の説明であり、実寸・目盛りの読み値・合否や操作手順を示さない。実際には器具の仕様と指定された測定方法を確認し、動いている対象を測定しない。'},
 'mfg1-electrical-l005':{source:require('../../../assets/manufacturing/diagrams/batch20-electrical-meter-connections.png'),altJa:'測定する量と接続の違いを示す紙上の概念図。電圧計Vは対象の二点間に並列、電流計Aは対象の枝路に直列につなぐ。実機の端子・配線や接続手順を示す図ではない。電流レンジを電源両端へ直接当てない。実作業では担当範囲・教育・設備手順と測定器の適合を確認する。'},
 'mfg1-mechanical-lesson-048':{source:require('../../../assets/manufacturing/diagrams/batch19-mechanical-geometric-attachments.png'),altJa:'この資料の基本例では、表面の幾何公差は外形線またはその延長線へ矢印で示し、軸線の幾何公差は寸法線の延長線へ矢印で示します。データムは文字と三角形の記号で識別し、表面は外形線またはその延長線、軸線は寸法線の延長線への取付けを確認します。四つの模式図は取付位置の比較用で、公差値・実寸・測定合否を指定するものではありません。実際の図面の適用規格と指示を優先します。'},
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
 'mfg1-mechanical-lesson-081':{source:require('../../../assets/manufacturing/diagrams/batch12-mechanical-dimension-symbols.png'),altJa:'寸法補助記号の13項目。球の直径Sφと半径SR、円弧長さ、面取り、板厚、ざぐり、皿ざぐり、深さを区別する。寸法例は形状の読み方を示し、加工条件ではない。'},
 'mfg1-mechanical-lesson-082':{source:require('../../../assets/manufacturing/diagrams/batch12-mechanical-geometric-symbols.png'),altJa:'幾何公差の15名称と記号。形状・姿勢・位置・振れの対象を区別する。同心度と同軸度は同じ記号でも対象の意味を確認する。'},
 'mfg1-electrical-l087':{source:require('../../../assets/manufacturing/diagrams/batch12-electrical-symbol-bank.png'),altJa:'電気用図記号22項目。接点の常態、動作方式、半導体の端子と矢印を名称と対応させる。PNPの矢印はエミッタ側で内向き。実機の配線図や端子配列ではない。'},
 'mfg1-electrical-l077':{source:require('../../../assets/manufacturing/diagrams/batch12-electrical-time-delays.png'),altJa:'入力が1秒でオン、6秒でオフになる紙上例。3秒のオンディレーは4秒でオン、6秒でオフ。3秒のオフディレーは1秒でオン、9秒でオフ。設定や配線の手順ではない。'},
 'mfg1-electrical-l071':{source:require('../../../assets/manufacturing/diagrams/batch12-electrical-pn-junction.png'),altJa:'外部電圧のないpn接合。空乏層のp側には負、n側には正の固定イオンがあり、内部電界はn側からp側へ向かう。外側の正孔・電子は移動キャリアで、領域全体の帯電を示さない。'},
 'mfg1-surface-lesson-053':{source:require('../../../assets/manufacturing/diagrams/batch12-surface-right-grip.png'),altJa:'右ねじの関係を視点と量で区別する。直線導体の電流が紙面から手前へ出ると磁界は反時計回り。コイルを端面から見て電流が反時計回りなら内部磁界は手前へ向かう。'},
 'mfg1-surface-lesson-060':{source:require('../../../assets/manufacturing/diagrams/batch12-surface-coating-defects.png'),altJa:'めっき皮膜の断面例。ピンホールは皮膜を貫く穴、ここでのピットは途中までのくぼみ、ふくれは皮膜の局部的な浮き。模式図であり、寸法と合否基準は適用規格・限度見本で確認する。'},
};
export function ManufacturingDiagram({lessonId,language='ja',showTranslation=false}:{lessonId:string;language?:string;showTranslation?:boolean}){
 const [expanded,setExpanded]=useState(false),{width}=useWindowDimensions(),i=useSafeAreaInsets();
 const ratio=ratios[lessonId]??1.6,item=figures[lessonId],{colors}=useStudyAppearance();if(!item)return null;
 const candidate=captionData.locales[language as keyof typeof captionData.locales]?.[lessonId as keyof typeof captionData.locales.en];
 const translated=candidate&&showTranslation&&candidate.sourceJa===item.altJa?candidate.text:null;
 const zoomWidth=Math.max(960,width),button=(label:string,action:()=>void)=><Pressable accessibilityRole="button" accessibilityLabel={label} onPress={action} style={{minHeight:48,padding:12,borderWidth:1,borderColor:colors.border,borderRadius:8}}><Text style={{color:colors.text,fontSize:16,textAlign:'center'}}>{label}</Text></Pressable>;
 return <View style={{gap:8}}><Image testID="manufacturing-technical-diagram" accessibilityLabel={translated??item.altJa} source={item.source} resizeMode="contain" style={{width:'100%',aspectRatio:ratio}}/><Text style={{fontSize:15,lineHeight:25,color:colors.muted}}>{item.altJa}</Text>{translated&&<Text style={{fontSize:15,lineHeight:25,color:colors.translationText,backgroundColor:colors.translation,padding:12,borderRadius:8}}>{translated}</Text>}{button(manufacturingUi(language,'imageZoom'),()=>setExpanded(true))}
 <Modal visible={expanded} animationType="none" onRequestClose={()=>setExpanded(false)}><View style={{flex:1,paddingTop:i.top,paddingBottom:i.bottom,paddingLeft:i.left,paddingRight:i.right,backgroundColor:colors.background}}><View style={{padding:12}}>{button(manufacturingUi(language,'imageClose'),()=>setExpanded(false))}</View><ScrollView style={{flex:1}}><ScrollView horizontal nestedScrollEnabled style={{width:'100%'}}><Image testID="manufacturing-expanded-diagram" accessibilityLabel={translated??item.altJa} source={item.source} resizeMode="contain" style={{width:zoomWidth,height:zoomWidth/ratio}}/></ScrollView></ScrollView></View></Modal>
 </View>;
}
