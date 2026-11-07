import {Text,View} from 'react-native';
import data from '@/data/agriculture/soil-group-comparison.json';
import content from '@/data/agriculture/lessons.ja.json';
type Labels={title:string;alt:string;paragraphTitles:Record<string,string>;paragraphs:Record<string,string>};
type Colors={text:string;translation:string;translationText:string;border:string};
export function soilGroupLabels(lessonId:string,sourceHash:string,revision:string|undefined,level:string|undefined,language:string){
 const lesson=content.lessons.find(l=>l.id===lessonId);
 if(data.schemaVersion!==1||lessonId!==data.lessonId||sourceHash!==data.sourceHash||revision!==data.revision||!level||!data.levels.includes(level)||!lesson||!lesson.levels.includes(level)||lesson.sourceHash!==sourceHash||lesson.revision!==revision||lesson.titleJa!==data.sourceJapanese.title||lesson.objectiveJa!==data.sourceJapanese.alt||lesson.paragraphs.some(p=>data.sourceJapanese.paragraphs[p.id as keyof typeof data.sourceJapanese.paragraphs]!==p.textJa||data.sourceJapanese.paragraphTitles[p.id as keyof typeof data.sourceJapanese.paragraphTitles]!==p.titleJa)||JSON.stringify(data.locales.ja)!==JSON.stringify(data.sourceJapanese))return null;
 const t=(data.locales as Record<string,Labels>)[language];
 return t&&t.title.trim()&&t.alt.trim()&&[...data.rows,...data.notes].every(id=>t.paragraphs[id]?.trim()&&t.paragraphTitles[id]?.trim())?t:null;
}
// Exact classification comparison, not a geographic map or a soil-profile photo.
export function SoilGroupComparison({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors}){
 const ja=soilGroupLabels(lessonId,lessonSourceHash,lessonRevision,level,'ja');
 if(!ja)return null;
 const t=showTranslation&&language!=='ja'?soilGroupLabels(lessonId,lessonSourceHash,lessonRevision,level,language):null,active=t||ja;
 const text={color:colors.translationText,fontSize:16,lineHeight:27};
 return <View testID="agri-native-soil-groups" style={{gap:12,padding:12,marginVertical:12,borderWidth:1,borderColor:colors.border,borderRadius:10}}>
  <Text style={{...text,fontSize:19,fontWeight:'700'}}>{ja.title}</Text>{!!t&&<Text testID="agri-soil-groups-localized-title" style={text}>{t.title}</Text>}
  <View accessible accessibilityRole="image" accessibilityLabel={[active.alt,...data.rows.map(id=>`${active.paragraphTitles[id]}: ${active.paragraphs[id]}`),...data.notes.map(id=>active.paragraphs[id])].join('\n')} style={{gap:12}}>
   {data.rows.map(id=><View key={id} testID={`agri-soil-group-row-${id}`} style={{gap:6,borderBottomWidth:1,borderColor:colors.border,paddingVertical:10}}><Text style={{...text,fontWeight:'700'}}>{ja.paragraphTitles[id]}</Text><Text style={text}>{ja.paragraphs[id]}</Text>{!!t&&<><Text style={{...text,fontWeight:'700'}}>{t.paragraphTitles[id]}</Text><Text style={text}>{t.paragraphs[id]}</Text></>}</View>)}
   {data.notes.map(id=><View key={id} style={{gap:6}}><Text style={text}>{ja.paragraphs[id]}</Text>{!!t&&<Text style={text}>{t.paragraphs[id]}</Text>}</View>)}
  </View>
  <Text style={{...text,fontSize:14}}>AGR-S1 · p.11 / AGR-S2 · p.20</Text>
 </View>;
}
