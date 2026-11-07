import {Text,View} from 'react-native';
import data from '@/data/agriculture/fruit-management-support.json';
import content from '@/data/agriculture/lessons.ja.json';
import figures from '@/data/agriculture/recognition-images.json';
import {getAgricultureFigureAsset,recognitionImageTranslation} from './RecognitionImages';
import {ZoomableFigure} from './ZoomableFigure';
type Labels={title:string;alt:string;paragraphTitles:Record<string,string>;paragraphs:Record<string,string>};
type Colors={text:string;translation:string;translationText:string;border:string};
const fixed=['甘ガキ','渋ガキ','渋抜きの加工をする場合','干し柿にする場合'];
const readings=['あまガキ','しぶガキ','しぶぬきのかこうをするばあい','ほしがきにするばあい'];
export function fruitManagementLabels(lessonId:string,sourceHash:string,revision:string|undefined,level:string|undefined,language:string){
 const lesson=content.lessons.find(l=>l.id===lessonId),f=figures.images.find(f=>f.id===data.contextImageSnapshot.id),alias=content.lessons.find(l=>l.id===data.contextSourceLesson.id);
 if(data.schemaVersion!==1||lessonId!==data.lessonId||sourceHash!==data.sourceHash||revision!==data.revision||!level||!data.levels.includes(level)||!lesson||!lesson.levels.includes(level)||lesson.sourceHash!==sourceHash||lesson.revision!==revision||lesson.titleJa!==data.sourceJapanese.title||lesson.objectiveJa!==data.sourceJapanese.alt||JSON.stringify(lesson.paragraphs.map(p=>p.id))!==JSON.stringify(data.paragraphIds)||lesson.paragraphs.some(p=>data.sourceJapanese.paragraphs[p.id as keyof typeof data.sourceJapanese.paragraphs]!==p.textJa||data.sourceJapanese.paragraphTitles[p.id as keyof typeof data.sourceJapanese.paragraphTitles]!==p.titleJa)||JSON.stringify(data.locales.ja)!==JSON.stringify(data.sourceJapanese)||JSON.stringify(data.diagramLabels.ja)!==JSON.stringify(fixed)||!fixed.every(s=>lesson.paragraphs[0].textJa.includes(s))||!f||JSON.stringify(f)!==JSON.stringify(data.contextImageSnapshot)||!alias||alias.sourceHash!==data.contextSourceLesson.sourceHash||alias.revision!==data.contextSourceLesson.revision||f.lessonSourceHashes[alias.id as keyof typeof f.lessonSourceHashes]!==alias.sourceHash)return null;
 const t=(data.locales as Record<string,Labels>)[language],labels=(data.diagramLabels as Record<string,string[]>)[language];
 return t&&labels?.length===4&&labels.every(s=>!!s.trim())&&t.title.trim()&&t.alt.trim()&&data.paragraphIds.every(id=>t.paragraphs[id]?.trim()&&t.paragraphTitles[id]?.trim())?{...t,labels}:null;
}
/** Exact canonical comparison plus separately limited subject appearance. */
export function FruitManagementSupport({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors}){
 const ja=fruitManagementLabels(lessonId,lessonSourceHash,lessonRevision,level,'ja');if(!ja)return null;
 const t=showTranslation&&language!=='ja'?fruitManagementLabels(lessonId,lessonSourceHash,lessonRevision,level,language):null;
 const f=data.contextImageSnapshot,source=getAgricultureFigureAsset(f.assetKey),caption=t?recognitionImageTranslation(f,data.contextSourceLesson.id,data.contextSourceLesson.sourceHash,data.contextSourceLesson.revision,language):null;
 const text={color:colors.translationText,fontSize:16,lineHeight:27};
 const label=(i:number)=><View key={i} style={{gap:4}}><View accessible accessibilityLabel={fixed[i]} testID={`agri-fruit-processing-ruby-${i}`} style={{alignItems:'center'}}><Text style={{color:colors.translationText,fontSize:10,lineHeight:14}}>{readings[i]}</Text><Text style={{...text,fontWeight:'700'}}>{fixed[i]}</Text></View>{!!t&&<Text testID={`agri-fruit-processing-label-${i}`} style={text}>{t.labels[i]}</Text>}</View>;
 return <View testID="agri-native-fruit-management" style={{gap:14,padding:12,borderWidth:1,borderColor:colors.border,borderRadius:10}}>
  <Text style={{...text,fontSize:19,fontWeight:'700'}}>{ja.title}</Text>{!!t&&<Text testID="agri-fruit-management-localized-title" style={text}>{t.title}</Text>}
  <View accessibilityRole="image" accessibilityLabel={(t||ja).alt} style={{flexDirection:'row',flexWrap:'wrap',gap:14}}><View style={{flexGrow:1,minWidth:140,borderWidth:1,borderColor:colors.border,padding:10}}>{label(0)}</View><View style={{flexGrow:1,minWidth:140,borderWidth:1,borderColor:colors.border,padding:10,gap:8}}>{label(1)}<View style={{gap:8,borderTopWidth:1,borderColor:colors.border,paddingTop:8}}>{label(2)}{label(3)}</View></View></View>
  {data.paragraphIds.map(id=><View key={id} style={{gap:5}}><Text style={{...text,fontWeight:'700'}}>{ja.paragraphTitles[id]}</Text><Text style={text}>{ja.paragraphs[id]}</Text>{!!t&&<><Text style={{...text,fontWeight:'700'}}>{t.paragraphTitles[id]}</Text><Text style={text}>{t.paragraphs[id]}</Text></>}</View>)}
  {!!source&&<><ZoomableFigure source={source} width={f.width} height={f.height} altJa={caption?.alt||f.altJa} testID="agri-fruit-management-context-persimmon" colors={colors} allowExpandedView/><Text style={text}>{f.titleJa}{'\n'}{f.limitJa}</Text>{!!caption&&<Text testID="agri-fruit-management-context-localized-limit" style={text}>{caption.title}{'\n'}{caption.limit}</Text>}</>}
  <Text style={{...text,fontSize:14}}>AGR-S1 · PDF p.96 / p.90 · AGR-S2 · PDF p.120 / p.118 · PDF p.121 / p.119</Text>
 </View>;
}
