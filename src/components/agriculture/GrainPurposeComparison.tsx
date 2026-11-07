import {Text,View} from 'react-native';
import data from '@/data/agriculture/grain-purpose-comparison.json';
import content from '@/data/agriculture/lessons.ja.json';
type Labels={title:string;alt:string;paragraphTitles:Record<string,string>;paragraphs:Record<string,string>};
type Colors={text:string;translation:string;translationText:string;border:string};
const fixed=["コムギ", "食用が多い", "オオムギ・ライムギ・エンバク", "食用・飼料", "スイートコーン", "未成熟", "野菜", "デントコーン", "飼料", "青刈り", "サイレージ", "専用品種", "利用目的", "F1・ハイブリッド", "交配による由来", "ほぼ全て", "野菜の跡地", "トウモロコシ（クリーニングクロップ）", "過剰な養分の吸収"];
const kana=['コムギ','しょくようがおおい','オオムギ・ライムギ・エンバク','しょくよう・しりょう','スイートコーン','みせいじゅく','やさい','デントコーン','しりょう','あおがり','サイレージ','せんようひんしゅ','りようもくてき','エフワン・ハイブリッド','こうはいによるゆらい','ほぼすべて','やさいのあとち','トウモロコシ（クリーニングクロップ）','かじょうなようぶんのきゅうしゅう'];
const groups=[[[0,1],[2,3]],[[4,5,6]],[[7,8],[9,10]],[[11,12]],[[13,14,15]],[[16,17,18]]] as const;
export function grainPurposeLabels(id:string,hash:string,revision:string|undefined,level:string|undefined,language:string){
 const l=content.lessons.find(l=>l.id===id);
 if(JSON.stringify(data.labels.ja)!==JSON.stringify(fixed)||data.schemaVersion!==1||id!==data.lessonId||hash!==data.sourceHash||revision!==data.revision||!level||!data.levels.includes(level)||!l||!l.levels.includes(level)||l.sourceHash!==hash||l.revision!==revision||l.titleJa!==data.sourceJapanese.title||l.objectiveJa!==data.sourceJapanese.alt||JSON.stringify(l.paragraphs.map(p=>p.id))!==JSON.stringify(data.paragraphIds)||l.paragraphs.some(p=>data.sourceJapanese.paragraphs[p.id as keyof typeof data.sourceJapanese.paragraphs]!==p.textJa||data.sourceJapanese.paragraphTitles[p.id as keyof typeof data.sourceJapanese.paragraphTitles]!==p.titleJa)||JSON.stringify(data.locales.ja)!==JSON.stringify(data.sourceJapanese))return null;
 const t=(data.locales as Record<string,Labels>)[language],labels=(data.labels as Record<string,string[]>)[language];
 return t&&labels?.length===19&&labels.every(x=>!!x.trim())&&t.title.trim()&&t.alt.trim()&&data.paragraphIds.every(id=>t.paragraphTitles[id]?.trim()&&t.paragraphs[id]?.trim())?{...t,labels}:null;
}
/** Compare source crops and information axes without substituting rice/WCS or prescribing crop use. */
export function GrainPurposeComparison({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors}){
 const ja=grainPurposeLabels(lessonId,lessonSourceHash,lessonRevision,level,'ja');if(!ja)return null;
 const t=showTranslation&&language!=='ja'?grainPurposeLabels(lessonId,lessonSourceHash,lessonRevision,level,language):null;
 const text={color:colors.translationText,fontSize:16,lineHeight:27},box={borderWidth:1,borderColor:colors.border,borderRadius:8,padding:10,gap:8};
 const label=(i:number)=><View testID={`agri-grain-label-${i}`} style={{...box,flexGrow:1,flexBasis:140,minWidth:0,backgroundColor:'#f8f0df'}}><View accessible accessibilityLabel={ja.labels[i]} style={{alignItems:'flex-start'}}><Text style={{color:colors.translationText,fontSize:10,lineHeight:14}}>{kana[i]}</Text><Text style={text}>{ja.labels[i]}</Text></View>{!!t&&<Text testID={`agri-grain-localized-${i}`} style={text}>{t.labels[i]}</Text>}</View>;
 return <View testID="agri-native-grain-purpose" style={{...box,marginVertical:12,gap:14}}><Text style={{...text,fontSize:19,fontWeight:'700'}}>{ja.title}</Text>{!!t&&<Text style={text}>{t.title}</Text>}
  {groups.map((group,index)=>{const id=data.paragraphIds[index];return <View key={index} testID={`agri-grain-comparison-${index}`} style={box}><Text style={{...text,fontWeight:'700'}}>{ja.paragraphTitles[id]}</Text>{!!t&&<Text style={text}>{t.paragraphTitles[id]}</Text>}
   <View accessibilityRole="image" accessibilityLabel={(t||ja).paragraphTitles[id]} style={{gap:10}}>{group.map((row,j)=><View key={j} testID={`agri-grain-comparison-row-${index}-${j}`} style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>{row.map(i=><View key={i} style={{flexGrow:1,flexBasis:140,minWidth:0}}>{label(i)}</View>)}</View>)}</View>
   <Text style={text}>{ja.paragraphs[id]}</Text>{!!t&&<Text style={text}>{t.paragraphs[id]}</Text>}
  </View>;})}
  <Text style={{...text,fontSize:14}}>AGR-S2 · PDF p.71 / p.69 · PDF p.72 / p.70</Text>
 </View>;
}
