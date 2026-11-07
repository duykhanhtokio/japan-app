import {AgricultureSafetyThreeRuby} from './AgricultureSafetyThreeRuby';
import {Text,View} from 'react-native';
import data from '@/data/agriculture/pesticide-formulation-comparison.json';
import content from '@/data/agriculture/lessons.ja.json';
type Labels={title:string;alt:string;paragraphTitles:Record<string,string>;paragraphs:Record<string,string>};
type Colors={text:string;translation:string;translationText:string;border:string};
const fixed=['剤型','商品の形状','水を加えた場合の表の記述','成分が水に溶けるか','液剤','乳剤','フロアブル剤','水溶剤','水和剤','ドライフロアブル剤','粉剤・粒剤','油剤','液体','粉末状','粉末状・粒状','透明','濁る','成分は水に溶ける','成分は水に溶けない','—（表に記載なし）'];
const kana=['ざいけい','しょうひんのけいじょう','みずをくわえたばあいのひょうのきじゅつ','せいぶんがみずにとけるか','えきざい','にゅうざい','フロアブルざい','すいようざい','すいわざい','ドライフロアブルざい','ふんざい・りゅうざい','ゆざい','えきたい','ふんまつじょう','ふんまつじょう・りゅうじょう','とうめい','にごる','せいぶんはみずにとける','せいぶんはみずにとけない','—（ひょうにきさいなし）'];
const rows=[[4,12,15,17],[5,12,16,18],[6,12,16,18],[7,13,15,17],[8,13,16,18],[9,13,16,18],[10,14,19,19],[11,12,19,19]] as const;
export function pesticideFormulationLabels(id:string,hash:string,revision:string|undefined,level:string|undefined,language:string){
 const l=content.lessons.find(l=>l.id===id);
 if(JSON.stringify(data.labels.ja)!==JSON.stringify(fixed)||data.schemaVersion!==1||id!==data.lessonId||hash!==data.sourceHash||revision!==data.revision||!level||!data.levels.includes(level)||!l||!l.levels.includes(level)||l.sourceHash!==hash||l.revision!==revision||l.titleJa!==data.sourceJapanese.title||l.objectiveJa!==data.sourceJapanese.alt||JSON.stringify(l.paragraphs.map(p=>p.id))!==JSON.stringify(data.paragraphIds)||l.paragraphs.some(p=>data.sourceJapanese.paragraphs[p.id as keyof typeof data.sourceJapanese.paragraphs]!==p.textJa||data.sourceJapanese.paragraphTitles[p.id as keyof typeof data.sourceJapanese.paragraphTitles]!==p.titleJa)||JSON.stringify(data.locales.ja)!==JSON.stringify(data.sourceJapanese))return null;
 const t=(data.locales as Record<string,Labels>)[language],labels=(data.labels as Record<string,string[]>)[language];
 return t&&labels?.length===20&&labels.every(x=>!!x.trim())&&t.title.trim()&&t.alt.trim()&&data.paragraphIds.every(id=>t.paragraphTitles[id]?.trim()&&t.paragraphs[id]?.trim())?{...t,labels}:null;
}
/** Source table comparison only: no preparation-method column, rates or product recommendations. */
export function PesticideFormulationComparison({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors}){
 const ja=pesticideFormulationLabels(lessonId,lessonSourceHash,lessonRevision,level,'ja');if(!ja)return null;
 const ruby=(field:string,value:string,style:{color:string;fontSize:number;lineHeight:number;fontWeight?:'700'})=><AgricultureSafetyThreeRuby provider="formulation" lessonId={lessonId} lessonSourceHash={lessonSourceHash} lessonRevision={lessonRevision} level={level} language="ja" field={field} text={value} style={style} color={colors.translationText}/>;
 const t=showTranslation&&language!=='ja'?pesticideFormulationLabels(lessonId,lessonSourceHash,lessonRevision,level,language):null;
 const text={color:colors.translationText,fontSize:16,lineHeight:27},box={borderWidth:1,borderColor:colors.border,borderRadius:8,padding:10,gap:8};
 const label=(i:number)=><View style={{gap:3}}><View accessible accessibilityLabel={ja.labels[i]} style={{alignItems:'flex-start'}}><Text style={{color:colors.translationText,fontSize:10,lineHeight:14}}>{kana[i]}</Text><Text style={text}>{ja.labels[i]}</Text></View>{!!t&&<Text testID={`agri-formulation-label-${i}`} style={text}>{t.labels[i]}</Text>}</View>;
 return <View testID="agri-native-formulation-comparison" style={{...box,marginVertical:12,gap:14}}>{ruby('title',ja.title,{...text,fontSize:19,fontWeight:'700'})}{!!t&&<Text testID="agri-formulation-localized-title" style={text}>{t.title}</Text>}
  <View accessibilityRole="image" accessibilityLabel={(t||ja).alt} style={{gap:12}}>{rows.map((row,index)=><View key={index} testID={`agri-formulation-row-${index}`} style={box}><View style={{backgroundColor:'#f8f0df',padding:8,gap:5}}>{label(0)}{label(row[0])}</View><View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>{[1,2,3].map(column=><View key={column} testID={`agri-formulation-cell-${index}-${column}`} style={{flexGrow:1,flexBasis:180,minWidth:0,gap:6,padding:8,borderTopWidth:1,borderColor:colors.border}}>{label(column)}{label(row[column])}</View>)}</View></View>)}</View>
  {data.paragraphIds.map(id=><View key={id} style={{gap:5}}>{ruby(`paragraphTitle:${id}`,ja.paragraphTitles[id],{...text,fontWeight:'700'})}{ruby(`paragraph:${id}`,ja.paragraphs[id],text)}{!!t&&<><Text style={{...text,fontWeight:'700'}}>{t.paragraphTitles[id]}</Text><Text style={text}>{t.paragraphs[id]}</Text></>}</View>)}
  <Text style={{...text,fontSize:14}}>AGR-S2 · PDF p.48 / p.46</Text>
 </View>;
}
