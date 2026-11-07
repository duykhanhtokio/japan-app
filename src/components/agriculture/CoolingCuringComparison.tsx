import {Text,View} from 'react-native';
import data from '@/data/agriculture/cooling-curing-comparison.json';
import content from '@/data/agriculture/lessons.ja.json';
type Labels={title:string;alt:string;paragraphTitles:Record<string,string>;paragraphs:Record<string,string>};
type Colors={text:string;translation:string;translationText:string;border:string};
const fixed=['強制通風','庫内の冷気を循環','差圧通風','容器の通気孔を通る冷気','真空冷却','水分の蒸発で熱を奪う','別に保冷庫が必要','キュアリング','傷口にコルク層','サツマイモ・花の球根：高温多湿','カボチャ：常温乾燥'];
const kana=['きょうせいつうふう','こないのれいきをじゅんかん','さあつつうふう','ようきのつうきこうをとおるれいき','しんくうれいきゃく','すいぶんのじょうはつでねつをうばう','べつにほれいこがひつよう','キュアリング','きずぐちにコルクそう','サツマイモ・はなのきゅうこん：こうおんたしつ','カボチャ：じょうおんかんそう'];
export function coolingCuringLabels(id:string,hash:string,revision:string|undefined,level:string|undefined,language:string){
 const l=content.lessons.find(l=>l.id===id);
 if(JSON.stringify(data.labels.ja)!==JSON.stringify(fixed)||data.schemaVersion!==1||id!==data.lessonId||hash!==data.sourceHash||revision!==data.revision||!level||!data.levels.includes(level)||!l||!l.levels.includes(level)||l.sourceHash!==hash||l.revision!==revision||l.titleJa!==data.sourceJapanese.title||l.objectiveJa!==data.sourceJapanese.alt||JSON.stringify(l.paragraphs.map(p=>p.id))!==JSON.stringify(data.paragraphIds)||l.paragraphs.some(p=>data.sourceJapanese.paragraphs[p.id as keyof typeof data.sourceJapanese.paragraphs]!==p.textJa||data.sourceJapanese.paragraphTitles[p.id as keyof typeof data.sourceJapanese.paragraphTitles]!==p.titleJa)||JSON.stringify(data.locales.ja)!==JSON.stringify(data.sourceJapanese))return null;
 const t=(data.locales as Record<string,Labels>)[language],labels=(data.labels as Record<string,string[]>)[language];
 return t&&labels?.length===11&&labels.every(x=>!!x.trim())&&t.title.trim()&&t.alt.trim()&&data.paragraphIds.every(id=>t.paragraphTitles[id]?.trim()&&t.paragraphs[id]?.trim())?{...t,labels}:null;
}
/** Qualitative paths and example conditions from AGR-S2 PDF41; no operating setpoints. */
export function CoolingCuringComparison({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors}){
 const ja=coolingCuringLabels(lessonId,lessonSourceHash,lessonRevision,level,'ja');if(!ja)return null;
 const t=showTranslation&&language!=='ja'?coolingCuringLabels(lessonId,lessonSourceHash,lessonRevision,level,language):null;
 const text={color:colors.translationText,fontSize:16,lineHeight:27},box={borderWidth:1,borderColor:colors.border,borderRadius:8,padding:10,gap:6};
 const label=(i:number)=><View style={{gap:3}}><View accessible accessibilityLabel={ja.labels[i]} style={{alignItems:'flex-start'}}><Text style={{color:colors.translationText,fontSize:10,lineHeight:14}}>{kana[i]}</Text><Text style={text}>{ja.labels[i]}</Text></View>{!!t&&<Text testID={`agri-cooling-label-${i}`} style={text}>{t.labels[i]}</Text>}</View>;
 return <View testID="agri-native-cooling-curing" style={{...box,marginVertical:12,gap:14}}><Text style={{...text,fontSize:19,fontWeight:'700'}}>{ja.title}</Text>{!!t&&<Text style={text}>{t.title}</Text>}
  <View accessibilityRole="image" accessibilityLabel={(t||ja).alt} style={{gap:12}}>
   <View testID="agri-cooling-room-circulation" style={box}>{label(0)}<View style={{...box,backgroundColor:'#e8f0f4'}}><Text style={{...text,fontSize:26}}>↻</Text>{label(1)}</View></View>
   <View testID="agri-cooling-through-container" style={box}>{label(2)}<View style={{flexDirection:'row',alignItems:'center',gap:8}}><Text style={{...text,fontSize:26}}>→</Text><View style={{...box,flex:1,borderStyle:'dashed',backgroundColor:'#e8f0f4'}}>{label(3)}</View><Text style={{...text,fontSize:26}}>→</Text></View></View>
   <View testID="agri-cooling-vacuum-separate-storage" style={box}>{label(4)}<View style={{...box,backgroundColor:'#e8f0f4'}}>{label(5)}</View><Text style={{...text,fontSize:26}}>↓</Text>{label(6)}</View>
   <View testID="agri-curing-distinct-conditions" style={{...box,backgroundColor:'#f8f0df'}}>{label(7)}{label(8)}<View testID="agri-curing-warm-humid" style={box}>{label(9)}</View><View testID="agri-curing-ambient-dry" style={box}>{label(10)}</View></View>
  </View>
  {data.paragraphIds.map(id=><View key={id} style={{gap:5}}><Text style={{...text,fontWeight:'700'}}>{ja.paragraphTitles[id]}</Text><Text style={text}>{ja.paragraphs[id]}</Text>{!!t&&<><Text style={{...text,fontWeight:'700'}}>{t.paragraphTitles[id]}</Text><Text style={text}>{t.paragraphs[id]}</Text></>}</View>)}
  <Text style={{...text,fontSize:14}}>AGR-S2 · PDF p.41 / p.39</Text>
 </View>;
}
