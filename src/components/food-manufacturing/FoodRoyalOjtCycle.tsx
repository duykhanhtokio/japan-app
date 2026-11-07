import {StyleSheet,Text,View} from 'react-native';

/** Exact Japanese teaching text retained from the previous OJT cycle raster.
 * Keep ordered learning conditions deterministic; generated artwork is context only.
 */
export const foodRoyalOjtSteps=[
 {id:'prepare',title:'1 目標と準備',lines:['本人の知識・技能を確認','測定器・基準・連絡先','何ができればよいか決める']},
 {id:'demonstrate',title:'2 指導者が示す',lines:['測定と記録を実演','重要な点と理由を説明','質問で理解を確かめる']},
 {id:'perform',title:'3 本人が実施',lines:['手順を説明して実施','安全・測定・記録を観察','異常時の連絡も確認']},
 {id:'improve',title:'4 評価して改善',lines:['目標と実際の行動を照合','不足に合わせて再指導','安全にできるか再確認']},
] as const;
export function FoodRoyalOjtCycle(){
 return <View testID="food-royal-ojt-cycle-text" style={s.root}>
 <Text style={s.heading}>OJT：受講から実行確認へ</Text>
 <Text style={s.body}>充填量の確認を教える、授業内の仮想例。</Text>
 <View style={s.steps}>{foodRoyalOjtSteps.map(step=><View key={step.id} testID={`food-royal-ojt-${step.id}`} style={s.card}>
 <Text style={s.title}>{step.title}</Text>{step.lines.map(line=><Text key={line} style={s.body}>{line}</Text>)}
 </View>)}</View>
 <View style={s.closure}><Text style={s.title}>閉じる条件</Text>
 <Text style={s.body}>受講記録や速さだけで習得済みにしない。</Text>
 <Text style={s.body}>本人の能力と実作業に合わせて指導し、効果を確認する。</Text>
 </View>
 <Text style={s.body} accessibilityLabel="評価と改善の結果を次の目標と準備につなぐ">4 評価して改善 → 1 目標と準備</Text>
 </View>;
}
const s=StyleSheet.create({root:{gap:12,paddingVertical:12},heading:{fontSize:19,lineHeight:30,fontWeight:'700',color:'#183044'},body:{fontSize:16,lineHeight:27,color:'#263c4c'},steps:{flexDirection:'row',flexWrap:'wrap',gap:12},card:{flexGrow:1,flexBasis:'45%',minWidth:240,padding:16,gap:8,borderWidth:1,borderColor:'#b49b62',borderRadius:12,backgroundColor:'#fffaf0',shadowColor:'#183044',shadowOpacity:0.12,shadowOffset:{width:0,height:3},shadowRadius:5,elevation:2},title:{fontSize:18,lineHeight:29,fontWeight:'700',color:'#183044'},closure:{gap:8,padding:16,borderWidth:1,borderColor:'#b49b62',borderRadius:12,backgroundColor:'#f4ead4'}});
