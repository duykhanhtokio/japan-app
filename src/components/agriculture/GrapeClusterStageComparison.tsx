import {AgricultureManagementProtectionRuby} from './AgricultureManagementProtectionRuby';
import {Text,View} from 'react-native';
import data from '@/data/agriculture/grape-cluster-stage-comparison.json';
import content from '@/data/agriculture/lessons.ja.json';
type Labels={title:string;alt:string;paragraphTitles:Record<string,string>;paragraphs:Record<string,string>};
type Colors={text:string;translation:string;translationText:string;border:string};
const fixed=['開花数日前','房づくり','副穂・岐肩を除く','房の長さを整える','着粒後','摘粒','不良果粒などを除く','品種特性と果実品質を考える'];
const kana=['かいかすうじつまえ','ふさづくり','ふくすい・きけんをのぞく','ふさのながさをととのえる','ちゃくりゅうご','てきりゅう','ふりょうかりゅうなどをのぞく','ひんしゅとくせいとかじつひんしつをかんがえる'];
export function grapeClusterStageLabels(id:string,hash:string,revision:string|undefined,level:string|undefined,language:string){
 const l=content.lessons.find(l=>l.id===id);
 if(JSON.stringify(data.labels.ja)!==JSON.stringify(fixed)||data.schemaVersion!==1||id!==data.lessonId||hash!==data.sourceHash||revision!==data.revision||!level||!data.levels.includes(level)||!l||!l.levels.includes(level)||l.sourceHash!==hash||l.revision!==revision||l.titleJa!==data.sourceJapanese.title||l.objectiveJa!==data.sourceJapanese.alt||JSON.stringify(l.paragraphs.map(p=>p.id))!==JSON.stringify(data.paragraphIds)||l.paragraphs.some(p=>data.sourceJapanese.paragraphs[p.id as keyof typeof data.sourceJapanese.paragraphs]!==p.textJa||data.sourceJapanese.paragraphTitles[p.id as keyof typeof data.sourceJapanese.paragraphTitles]!==p.titleJa)||JSON.stringify(data.locales.ja)!==JSON.stringify(data.sourceJapanese))return null;
 const t=(data.locales as Record<string,Labels>)[language],labels=(data.labels as Record<string,string[]>)[language];
 return t&&labels?.length===8&&labels.every(x=>!!x.trim())&&t.title.trim()&&t.alt.trim()&&data.paragraphIds.every(id=>t.paragraphTitles[id]?.trim()&&t.paragraphs[id]?.trim())?{...t,labels}:null;
}
/** Source-specific pre-flowering cluster shaping versus post-set berry thinning; no treatment, count or length prescription. */
export function GrapeClusterStageComparison({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors}){
 const ja=grapeClusterStageLabels(lessonId,lessonSourceHash,lessonRevision,level,'ja');if(!ja)return null;
 const ruby=(field:string,value:string,style:{color:string;fontSize:number;lineHeight:number;fontWeight?:'700'})=><AgricultureManagementProtectionRuby provider="grape-cluster" lessonId={lessonId} lessonSourceHash={lessonSourceHash} lessonRevision={lessonRevision} level={level} language="ja" field={field} text={value} style={style} color={colors.translationText}/>;
 const t=showTranslation&&language!=='ja'?grapeClusterStageLabels(lessonId,lessonSourceHash,lessonRevision,level,language):null;
 const text={color:colors.translationText,fontSize:16,lineHeight:27},box={borderWidth:1,borderColor:colors.border,borderRadius:8,padding:10,gap:6};
 const label=(i:number)=><View style={{gap:3}}><View accessible accessibilityLabel={ja.labels[i]} style={{alignItems:'flex-start'}}><Text style={{color:colors.translationText,fontSize:10,lineHeight:14}}>{kana[i]}</Text><Text style={text}>{ja.labels[i]}</Text></View>{!!t&&<Text testID={`agri-grape-cluster-label-${i}`} style={text}>{t.labels[i]}</Text>}</View>;
 return <View testID="agri-native-grape-cluster-stage" style={{...box,marginVertical:12,gap:14}}>{ruby('title',ja.title,{...text,fontSize:19,fontWeight:'700'})}{!!t&&<Text testID="agri-grape-cluster-localized-title" style={text}>{t.title}</Text>}
  <View accessibilityRole="image" accessibilityLabel={(t||ja).alt} style={{gap:12}}>
   <View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>
    <View testID="agri-grape-cluster-before-flowering" style={{...box,flexGrow:1,flexBasis:240,backgroundColor:'#edf2df'}}>{label(0)}<View style={{borderBottomWidth:1,borderColor:colors.border,paddingBottom:6}}>{label(1)}</View>{label(2)}{label(3)}</View>
    <View testID="agri-grape-cluster-after-fruit-set" style={{...box,flexGrow:1,flexBasis:240,backgroundColor:'#f3e7ef'}}>{label(4)}<View style={{borderBottomWidth:1,borderColor:colors.border,paddingBottom:6}}>{label(5)}</View>{label(6)}</View>
   </View><View testID="agri-grape-cluster-shared-condition" style={box}>{label(7)}</View>
  </View>
  {data.paragraphIds.map(id=><View key={id} style={{gap:5}}>{ruby(`paragraphTitle:${id}`,ja.paragraphTitles[id],{...text,fontWeight:'700'})}{ruby(`paragraph:${id}`,ja.paragraphs[id],text)}{!!t&&<><Text style={{...text,fontWeight:'700'}}>{t.paragraphTitles[id]}</Text><Text style={text}>{t.paragraphs[id]}</Text></>}</View>)}
  <Text style={{...text,fontSize:14}}>AGR-S2 · PDF p.110 / p.108</Text>
 </View>;
}
