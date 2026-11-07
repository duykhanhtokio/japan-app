import {AgricultureSafetyThreeRuby} from './AgricultureSafetyThreeRuby';
import {Text,View} from 'react-native';
import data from '@/data/agriculture/pesticide-label-fields.json';
import content from '@/data/agriculture/lessons.ja.json';
type Labels={title:string;alt:string;paragraphTitles:Record<string,string>;paragraphs:Record<string,string>};
type Colors={text:string;translation:string;translationText:string;border:string};
const fixed=['用途名','農薬の名称','農薬の種類','成分名','含有量','内容量','製造場所の名称','製造場所の住所','最終有効期限','購入する量','トマト','ミニトマト','製品の重量','希釈後の薬液の量'];
const kana=['ようとめい','のうやくのめいしょう','のうやくのしゅるい','せいぶんめい','がんゆうりょう','ないようりょう','せいぞうばしょのめいしょう','せいぞうばしょのじゅうしょ','さいしゅうゆうこうきげん','こうにゅうするりょう','トマト','ミニトマト','せいひんのじゅうりょう','きしゃくごのやくえきのりょう'];
const groups=[[0,1,2],[3,4,5],[6,7],[8,9],[10,11],[12,13]] as const;
export function pesticideLabelFields(id:string,hash:string,revision:string|undefined,level:string|undefined,language:string){
 const l=content.lessons.find(l=>l.id===id);
 if(JSON.stringify(data.labels.ja)!==JSON.stringify(fixed)||data.schemaVersion!==1||id!==data.lessonId||hash!==data.sourceHash||revision!==data.revision||!level||!data.levels.includes(level)||!l||!l.levels.includes(level)||l.sourceHash!==hash||l.revision!==revision||l.titleJa!==data.sourceJapanese.title||l.objectiveJa!==data.sourceJapanese.alt||JSON.stringify(l.paragraphs.map(p=>p.id))!==JSON.stringify(data.paragraphIds)||l.paragraphs.some(p=>data.sourceJapanese.paragraphs[p.id as keyof typeof data.sourceJapanese.paragraphs]!==p.textJa||data.sourceJapanese.paragraphTitles[p.id as keyof typeof data.sourceJapanese.paragraphTitles]!==p.titleJa)||JSON.stringify(data.locales.ja)!==JSON.stringify(data.sourceJapanese))return null;
 const t=(data.locales as Record<string,Labels>)[language],labels=(data.labels as Record<string,string[]>)[language];
 return t&&labels?.length===14&&labels.every(x=>!!x.trim())&&t.title.trim()&&t.alt.trim()&&data.paragraphIds.every(id=>t.paragraphTitles[id]?.trim()&&t.paragraphs[id]?.trim())?{...t,labels}:null;
}
/** Separate source-label record fields, not a real product label or current approval. */
export function PesticideLabelFields({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors}){
 const ja=pesticideLabelFields(lessonId,lessonSourceHash,lessonRevision,level,'ja');if(!ja)return null;
 const ruby=(field:string,value:string,style:{color:string;fontSize:number;lineHeight:number;fontWeight?:'700'})=><AgricultureSafetyThreeRuby provider="pesticide-label" lessonId={lessonId} lessonSourceHash={lessonSourceHash} lessonRevision={lessonRevision} level={level} language="ja" field={field} text={value} style={style} color={colors.translationText}/>;
 const t=showTranslation&&language!=='ja'?pesticideLabelFields(lessonId,lessonSourceHash,lessonRevision,level,language):null;
 const text={color:colors.translationText,fontSize:16,lineHeight:27},box={borderWidth:1,borderColor:colors.border,borderRadius:8,padding:10,gap:8};
 return <View testID="agri-native-label-fields" style={{...box,marginVertical:12,gap:14}}>{ruby('title',ja.title,{...text,fontSize:19,fontWeight:'700'})}{!!t&&<Text testID="agri-pesticide-label-localized-title" style={text}>{t.title}</Text>}
  {groups.map((group,index)=>{const id=data.paragraphIds[index];return <View key={index} testID={`agri-label-field-group-${index}`} style={box}>{ruby(`paragraphTitle:${id}`,ja.paragraphTitles[id],{...text,fontWeight:'700'})}{!!t&&<Text style={text}>{t.paragraphTitles[id]}</Text>}
   <View accessibilityRole="image" accessibilityLabel={(t||ja).paragraphTitles[id]} style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>{group.map(i=><View key={i} testID={`agri-label-distinct-field-${i}`} style={{...box,flexGrow:1,flexBasis:150,minWidth:0,backgroundColor:'#f8f0df'}}><View accessible accessibilityLabel={ja.labels[i]} style={{alignItems:'flex-start'}}><Text style={{color:colors.translationText,fontSize:10,lineHeight:14}}>{kana[i]}</Text><Text style={text}>{ja.labels[i]}</Text></View>{!!t&&<Text testID={`agri-label-localized-field-${i}`} style={text}>{t.labels[i]}</Text>}</View>)}</View>
   {ruby(`paragraph:${id}`,ja.paragraphs[id],text)}{!!t&&<Text style={text}>{t.paragraphs[id]}</Text>}
  </View>;})}
  <Text style={{...text,fontSize:14}}>AGR-S2 · PDF p.55 / p.53 · PDF p.56 / p.54</Text>
 </View>;
}
