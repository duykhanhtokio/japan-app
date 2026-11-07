import {StyleSheet,Text,View} from 'react-native';
/** Exact Japanese chart text; artwork provides context, never safety labels. */
export const foodRoyalChemicalSafetyText=["薬剤作業：保護と禁止を分ける", "食品用の手袋と、薬剤作業で指定される保護具を混同しない。", "身体を守る", "保護メガネ → 目", "指定の手袋 → 手", "エプロン → 身体", "用途に合う物を正しく着ける", "混ぜてはいけない", "塩素系洗剤 ＋ 酸性洗剤", "→ 有害なガスの危険", "保護具があっても", "混ぜて使わない", "作業前に説明する", "「何を守るか」と「してはいけないこと」を別々に答える。", "指定・表示・承認済み手順を確認し、不明なら責任者へ。", "保護具だけで薬剤の誤使用を安全にできるわけではない。"] as const;
export function FoodRoyalChemicalSafety(){return <View testID="food-royal-chemical-safety-text" style={s.root}>{foodRoyalChemicalSafetyText.map((line,i)=><Text selectable key={line} style={[s.body,([0,2,7,12].includes(i))&&s.heading]}>{line}</Text>)}</View>;}
const s=StyleSheet.create({root:{padding:16,gap:10,borderWidth:1,borderColor:'#b49b62',borderRadius:12,backgroundColor:'#fffaf0'},body:{fontSize:16,lineHeight:27,color:'#263c4c'},heading:{fontSize:19,lineHeight:30,fontWeight:'700',color:'#183044'}});
