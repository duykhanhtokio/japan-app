import {Text,View} from 'react-native';
import data from '@/data/agriculture/crop-classification-native.json';
import content from '@/data/agriculture/lessons.ja.json';
type Labels={title:string;alt:string;paragraphTitles:Record<string,string>;paragraphs:Record<string,string>;labels:Record<string,string>};
type Colors={text:string;translation:string;translationText:string;border:string};
export function cropClassificationLabels(lessonId:string,sourceHash:string,revision:string|undefined,level:string|undefined,language:string){
 const lesson=content.lessons.find(l=>l.id===lessonId),ja=data.locales.ja;
 if(data.schemaVersion!==1||lessonId!==data.lessonId||sourceHash!==data.sourceHash||revision!==data.revision||level!=='2'||!lesson||!lesson.levels.includes(level)||lesson.sourceHash!==sourceHash||lesson.revision!==revision||lesson.titleJa!==data.sourceJapanese.title||lesson.objectiveJa!==data.sourceJapanese.alt||lesson.paragraphs.length!==data.paragraphIds.length||lesson.paragraphs.some(p=>data.sourceJapanese.paragraphs[p.id as keyof typeof data.sourceJapanese.paragraphs]!==p.textJa||data.sourceJapanese.paragraphTitles[p.id as keyof typeof data.sourceJapanese.paragraphTitles]!==p.titleJa)||JSON.stringify(ja.labels)!==JSON.stringify(data.sourceLabelsJapanese)||JSON.stringify(data.branches)!==JSON.stringify([{parent:'field',children:['food','fodderGreen','industrial']},{parent:'horticultural',children:['fruit','vegetable','ornamental']}]))return null;
 for(const key of ['title','alt','paragraphTitles','paragraphs'] as const)if(JSON.stringify(ja[key])!==JSON.stringify(data.sourceJapanese[key]))return null;
 const t=(data.locales as Record<string,Labels>)[language];
 return t&&t.title.trim()&&t.alt.trim()&&data.labelKeys.every(k=>t.labels[k]?.trim())&&data.paragraphIds.every(id=>t.paragraphs[id]?.trim()&&t.paragraphTitles[id]?.trim())?t:null;
}
// A source-exact taxonomy: connector geometry represents parent/child relations only.
export function CropClassificationFigure({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors}){
 const ja=cropClassificationLabels(lessonId,lessonSourceHash,lessonRevision,level,'ja');
 if(!ja)return null;
 const t=showTranslation&&language!=='ja'?cropClassificationLabels(lessonId,lessonSourceHash,lessonRevision,level,language):null,active=t||ja;
 const text={color:colors.translationText,fontSize:16,lineHeight:27},label=(key:string)=><View style={{gap:3}}><Text style={{...text,fontWeight:'700'}}>{ja.labels[key]}</Text>{!!t&&<Text style={text}>{t.labels[key]}</Text>}</View>;
 const relations=data.branches.map(b=>`${active.labels.crop} → ${active.labels[b.parent]} → ${b.children.map(k=>active.labels[k]).join(' / ')}`).join('\n');
 return <View testID="agri-native-crop-classification" style={{gap:14,padding:12,marginVertical:12,borderWidth:1,borderColor:colors.border,borderRadius:10}}>
  <Text style={{...text,fontSize:19,fontWeight:'700'}}>{ja.title}</Text>{!!t&&<Text testID="agri-crop-classification-localized-title" style={text}>{t.title}</Text>}
  <View accessible accessibilityRole="image" accessibilityLabel={`${active.alt}\n${relations}`} style={{gap:12}}>
   {label('crop')}
   <View style={{marginLeft:12,paddingLeft:16,borderLeftWidth:2,borderColor:colors.border,gap:18}}>{data.branches.map(b=><View key={b.parent} testID={`agri-crop-branch-${b.parent}`} style={{gap:8}}>{label(b.parent)}<View style={{marginLeft:12,paddingLeft:16,borderLeftWidth:2,borderColor:colors.border,gap:10}}>{b.children.map(k=><View key={k} testID={`agri-crop-category-${k}`} style={{borderTopWidth:1,borderColor:colors.border,paddingTop:6}}>{label(k)}</View>)}</View></View>)}</View>
  </View>
  {data.paragraphIds.map(id=><View key={id} style={{gap:5}}><Text style={{...text,fontWeight:'700'}}>{ja.paragraphTitles[id]}</Text><Text style={text}>{ja.paragraphs[id]}</Text>{!!t&&<><Text style={{...text,fontWeight:'700'}}>{t.paragraphTitles[id]}</Text><Text style={text}>{t.paragraphs[id]}</Text></>}</View>)}
  <Text style={{...text,fontSize:14}}>AGR-S2 · PDF p.10 / p.8</Text>
 </View>;
}
