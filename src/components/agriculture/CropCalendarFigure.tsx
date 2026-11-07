import {Text,View} from 'react-native';
import data from '@/data/agriculture/crop-calendar-native.json';
import figures from '@/data/agriculture/recognition-images.json';
type Colors={text:string;translation:string;translationText:string;border:string};
type Labels={title:string;alt:string;observation:string;limit:string;crops:Record<string,string>;types:Record<string,string>;sowingMonth:string;greenhouse:Record<string,string>;harvest:Record<string,string>};
type Binding={sourceHash:string;revision:string;scopeLevels:string[]};
const sourceFields=['title','alt','observation','limit'] as const;
export function cropCalendarLabels(lessonId:string,lessonSourceHash:string,lessonRevision:string|undefined,level:string|undefined,language:string){
 const binding=(data.lessonBindings as Record<string,Binding>)[lessonId];
 const figure=figures.images.find(f=>f.id===data.figureId);
 if(data.schemaVersion!==1||!binding||!lessonRevision||!level||!binding.scopeLevels.includes(level)||binding.sourceHash!==lessonSourceHash||binding.revision!==lessonRevision||!figure||figure.assetSha256!==data.referenceAssetSha256||sourceFields.some(k=>data.sourceJapanese[k]!==figure[`${k}Ja`]))return null;
 const labels=(data.labels as Record<string,Labels>)[language];
 if(!labels||sourceFields.some(k=>!labels[k]?.trim())||!labels.sowingMonth.includes('{month}')||data.rows.some(row=>!labels.crops[row.crop]?.trim()||!labels.types[row.type]?.trim()||!labels.harvest[row.harvest]?.trim())||!labels.greenhouse.present?.trim()||!labels.greenhouse.absent?.trim())return null;
 return labels;
}
const rowParts=(row:typeof data.rows[number],labels:Labels)=>[
 `${labels.crops[row.crop]} · ${labels.types[row.type]}`,
 labels.sowingMonth.replace('{month}',String(row.sowingMonth)),
 labels.greenhouse[row.greenhouseSymbol?'present':'absent'],
 labels.harvest[row.harvest],
];
export function CropCalendarFigure({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,includeMetadata=true,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;includeMetadata?:boolean;colors:Colors}){
 const ja=cropCalendarLabels(lessonId,lessonSourceHash,lessonRevision,level,'ja');
 if(!ja)return null;
 const t=showTranslation&&language!=='ja'?cropCalendarLabels(lessonId,lessonSourceHash,lessonRevision,level,language):null;
 const labels=t||ja;
 const alt=[labels.alt,...data.rows.map(row=>rowParts(row,labels).join(' → ')),labels.observation,labels.limit].join('\n');
 return <View testID="agri-native-crop-calendar" style={{gap:12,marginVertical:12}}>
  {includeMetadata&&<Text style={{color:colors.translationText,fontSize:19,lineHeight:29,fontWeight:'700'}}>{ja.title}</Text>}
  {!!t&&<Text testID="agri-crop-calendar-localized-title" style={{color:colors.translationText,fontSize:18,lineHeight:28,fontWeight:'700'}}>{t.title}</Text>}
  <View accessible accessibilityRole="image" accessibilityLabel={alt} testID="agri-crop-calendar-seven-source-rows" style={{gap:12}}>
   {data.rows.map(row=>{const original=rowParts(row,ja),translated=t?rowParts(row,t):null;return <View key={row.id} testID={`agri-crop-calendar-row-${row.id}`} style={{gap:8,paddingVertical:12,borderBottomWidth:1,borderColor:colors.border}}>
    <Text style={{color:colors.translationText,fontSize:17,lineHeight:28,fontWeight:'700'}}>{original[0]}</Text>
    {!!translated&&<Text style={{color:colors.translationText,fontSize:17,lineHeight:28}}>{translated[0]}</Text>}
    <View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>{original.slice(1).map((text,i)=><View key={i} style={{flexBasis:180,flexGrow:1,gap:4}}><Text style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{text}</Text>{!!translated&&<Text testID={`agri-crop-calendar-row-${row.id}-localized-${i}`} style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{translated[i+1]}</Text>}</View>)}</View>
   </View>;})}
  </View>
  {includeMetadata&&<><Text style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{ja.observation}</Text><Text style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{ja.limit}</Text></>}
  {!!t&&<><Text testID="agri-crop-calendar-localized-observation" style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{t.observation}</Text><Text testID="agri-crop-calendar-localized-limit" style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{t.limit}</Text></>}
  <Text style={{color:colors.translationText,fontSize:14,lineHeight:23}}>AGR-S1 · p.5 / AGR-S2 · p.11</Text>
 </View>;
}
