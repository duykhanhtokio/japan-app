import {AgricultureLateFourRuby} from './AgricultureLateFourRuby';
import {Text,View} from 'react-native';
import data from '@/data/agriculture/orchard-soil-machine-objectives.json';
import content from '@/data/agriculture/lessons.ja.json';
type Labels={title:string;alt:string;paragraphTitles:Record<string,string>;paragraphs:Record<string,string>};
type Colors={text:string;translation:string;translationText:string;border:string};
const fixed=['酸性に偏った土壌','アルカリ性の石灰質資材','pHを高める側への調整','土を耕す','薬剤をまく','除草','結実管理','運搬'];
const kana=['さんせいにかたよったどじょう','アルカリせいのせっかいしつしざい','ピーエイチをたかめるがわへのちょうせい','つちをたがやす','やくざいをまく','じょそう','けつじつかんり','うんぱん'];
export function orchardSoilMachineLabels(id:string,hash:string,revision:string|undefined,level:string|undefined,language:string){
 const l=content.lessons.find(l=>l.id===id);
 if(JSON.stringify(data.labels.ja)!==JSON.stringify(fixed)||data.schemaVersion!==1||id!==data.lessonId||hash!==data.sourceHash||revision!==data.revision||!level||!data.levels.includes(level)||!l||!l.levels.includes(level)||l.sourceHash!==hash||l.revision!==revision||l.titleJa!==data.sourceJapanese.title||l.objectiveJa!==data.sourceJapanese.alt||JSON.stringify(l.paragraphs.map(p=>p.id))!==JSON.stringify(data.paragraphIds)||l.paragraphs.some(p=>data.sourceJapanese.paragraphs[p.id as keyof typeof data.sourceJapanese.paragraphs]!==p.textJa||data.sourceJapanese.paragraphTitles[p.id as keyof typeof data.sourceJapanese.paragraphTitles]!==p.titleJa)||JSON.stringify(data.locales.ja)!==JSON.stringify(data.sourceJapanese))return null;
 const t=(data.locales as Record<string,Labels>)[language],labels=(data.labels as Record<string,string[]>)[language];
 return t&&labels?.length===8&&labels.every(x=>!!x.trim())&&t.title.trim()&&t.alt.trim()&&data.paragraphIds.every(id=>t.paragraphTitles[id]?.trim()&&t.paragraphs[id]?.trim())?{...t,labels}:null;
}
/** Qualitative amendment direction and five task categories, never an application rate or machine operation guide. */
export function OrchardSoilMachineObjectives({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors}){
 const ja=orchardSoilMachineLabels(lessonId,lessonSourceHash,lessonRevision,level,'ja');if(!ja)return null;
 const ruby=(field:string,value:string,style:{color:string;fontSize:number;lineHeight:number;fontWeight?:'700'})=><AgricultureLateFourRuby provider="orchard-machine" lessonId={lessonId} lessonSourceHash={lessonSourceHash} lessonRevision={lessonRevision} level={level} language="ja" field={field} text={value} style={style} color={colors.translationText}/>;
 const t=showTranslation&&language!=='ja'?orchardSoilMachineLabels(lessonId,lessonSourceHash,lessonRevision,level,language):null;
 const text={color:colors.translationText,fontSize:16,lineHeight:27},box={borderWidth:1,borderColor:colors.border,borderRadius:8,padding:10,gap:8};
 const label=(i:number)=><View testID={`agri-orchard-purpose-label-${i}`} style={{gap:3}}><View accessible accessibilityLabel={ja.labels[i]} style={{alignItems:'flex-start'}}><Text style={{color:colors.translationText,fontSize:10,lineHeight:14}}>{kana[i]}</Text><Text style={text}>{ja.labels[i]}</Text></View>{!!t&&<Text testID={`agri-orchard-purpose-localized-${i}`} style={text}>{t.labels[i]}</Text>}</View>;
 const paragraph=(i:number)=>{const id=data.paragraphIds[i];return <View style={{gap:5}}>{ruby(`paragraphTitle:${id}`,ja.paragraphTitles[id],{...text,fontWeight:'700'})}{!!t&&<Text style={text}>{t.paragraphTitles[id]}</Text>}{ruby(`paragraph:${id}`,ja.paragraphs[id],text)}{!!t&&<Text style={text}>{t.paragraphs[id]}</Text>}</View>;};
 return <View testID="agri-native-orchard-soil-machine" style={{...box,marginVertical:12,gap:14}}>{ruby('title',ja.title,{...text,fontSize:19,fontWeight:'700'})}{!!t&&<Text testID="agri-orchard-machine-localized-title" style={text}>{t.title}</Text>}
  <View testID="agri-orchard-ph-direction" accessibilityRole="image" accessibilityLabel={(t||ja).paragraphTitles[data.paragraphIds[0]]} style={{...box,backgroundColor:'#f8f0df'}}>{label(0)}<Text style={{...text,fontSize:26}}>↓</Text>{label(1)}<Text style={{...text,fontSize:26}}>↓</Text>{label(2)}</View>
  {paragraph(0)}
  <View testID="agri-orchard-five-machine-purposes" accessibilityRole="image" accessibilityLabel={(t||ja).paragraphTitles[data.paragraphIds[1]]} style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>{[3,4,5,6,7].map(i=><View key={i} testID={`agri-orchard-machine-purpose-${i-3}`} style={{...box,flexGrow:1,flexBasis:150,minWidth:0}}>{label(i)}</View>)}</View>
  {paragraph(1)}
  <Text style={{...text,fontSize:14}}>AGR-S1 · PDF p.92 / p.86 · PDF p.98 / p.92 · AGR-S2 · PDF p.116 / p.114 · PDF p.122 / p.120</Text>
 </View>;
}
