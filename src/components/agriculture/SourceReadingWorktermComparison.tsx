import {AgricultureIncomingTwoRuby} from './AgricultureIncomingTwoRuby';
import {Text,View} from 'react-native';
import data from '@/data/agriculture/source-reading-workterm-comparison.json';
import content from '@/data/agriculture/lessons.ja.json';
type Labels={title:string;alt:string;paragraphTitles:Record<string,string>;paragraphs:Record<string,string>};
type Colors={text:string;translation:string;translationText:string;border:string};
const fixed=['まき方の範囲と地下の排水','ばらまき','うね全体','すじまき','一列','点まき','一か所に数粒ずつ','暗きょ排水','地表','土中の管','模式例：数・間隔・深さの基準ではない'];
const kana=['まきかたのはんいとちかのはいすい','ばらまき','うねぜんたい','すじまき','いちれつ','てんまき','いっかしょにすうつぶずつ','あんきょはいすい','ちひょう','どちゅうのくだ','もしきれい：かず・かんかく・ふかさのきじゅんではない'];
export function sourceReadingWorktermLabels(id:string,hash:string,revision:string|undefined,level:string|undefined,language:string){
 const l=content.lessons.find(l=>l.id===id);
 if(JSON.stringify(data.displayParagraphIds)!==JSON.stringify(l?.paragraphs.slice(-4).map(p=>p.id))||JSON.stringify(data.labels.ja)!==JSON.stringify(fixed)||data.schemaVersion!==1||id!==data.lessonId||hash!==data.sourceHash||revision!==data.revision||!level||!data.levels.includes(level)||!l||!l.levels.includes(level)||l.sourceHash!==hash||l.revision!==revision||l.titleJa!==data.sourceJapanese.title||l.objectiveJa!==data.sourceJapanese.alt||JSON.stringify(l.paragraphs.map(p=>p.id))!==JSON.stringify(data.paragraphIds)||l.paragraphs.some(p=>data.sourceJapanese.paragraphs[p.id as keyof typeof data.sourceJapanese.paragraphs]!==p.textJa||data.sourceJapanese.paragraphTitles[p.id as keyof typeof data.sourceJapanese.paragraphTitles]!==p.titleJa)||JSON.stringify(data.locales.ja)!==JSON.stringify(data.sourceJapanese))return null;
 const t=(data.locales as Record<string,Labels>)[language],labels=(data.labels as Record<string,string[]>)[language];
 return t&&labels?.length===11&&labels.every(x=>!!x.trim())&&t.title.trim()&&t.alt.trim()&&data.paragraphIds.every(id=>t.paragraphTitles[id]?.trim()&&t.paragraphs[id]?.trim())?{...t,labels}:null;
}
/** Qualitative sowing location and below-ground pipe schematics from source glossary; positions/counts are not dimensions or prescriptions. */
export function SourceReadingWorktermComparison({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors}){
 const ja=sourceReadingWorktermLabels(lessonId,lessonSourceHash,lessonRevision,level,'ja');if(!ja)return null;
 const ruby=(field:string,value:string,style:{color:string;fontSize:number;lineHeight:number;fontWeight?:'700'})=><AgricultureIncomingTwoRuby provider="source-workterm" lessonId={lessonId} lessonSourceHash={lessonSourceHash} lessonRevision={lessonRevision} level={level} language="ja" field={field} text={value} style={style} color={colors.translationText}/>;
 const t=showTranslation&&language!=='ja'?sourceReadingWorktermLabels(lessonId,lessonSourceHash,lessonRevision,level,language):null;
 const text={color:colors.translationText,fontSize:16,lineHeight:27},box={borderWidth:1,borderColor:colors.border,borderRadius:8,padding:10,gap:6};
 const label=(i:number)=><View style={{gap:3}}><View accessible accessibilityLabel={ja.labels[i]} style={{alignItems:'flex-start'}}><Text style={{color:colors.translationText,fontSize:10,lineHeight:14}}>{kana[i]}</Text><Text style={text}>{ja.labels[i]}</Text></View>{!!t&&<Text testID={`agri-source-workterm-label-${i}`} style={text}>{t.labels[i]}</Text>}</View>;
 return <View testID="agri-native-source-reading-workterms" style={{...box,marginVertical:12,gap:14}}>{ruby('title',ja.title,{...text,fontSize:19,fontWeight:'700'})}{!!t&&<Text testID="agri-source-workterm-localized-title" style={text}>{t.title}</Text>}
  <View accessibilityRole="image" accessibilityLabel={(t||ja).alt} style={{gap:12}}>
   {label(0)}<View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>{[
    {id:'broadcast',name:1,target:2,points:[[12,14],[64,12],[32,35],[80,46],[17,62],[53,65]]},
    {id:'row',name:3,target:4,points:[[15,40],[30,40],[45,40],[60,40],[75,40],[90,40]]},
    {id:'spot',name:5,target:6,points:[[15,20],[20,26],[15,32],[49,20],[54,26],[49,32],[80,20],[85,26],[80,32]]}
   ].map(panel=><View key={panel.id} testID={`agri-source-sowing-${panel.id}`} style={{...box,flexGrow:1,flexBasis:210}}>{label(panel.name)}<View style={{height:78,backgroundColor:'#e3d0aa',borderWidth:1,borderColor:'#907753',borderRadius:6}}>{panel.points.map(([x,y],i)=><View key={i} style={{position:'absolute',left:`${x}%`,top:`${y}%`,width:5,height:5,borderRadius:3,backgroundColor:'#473b27'}}/>)}</View>{label(panel.target)}</View>)}</View>
   <View testID="agri-source-underground-drain" style={box}>{label(7)}{label(8)}<View style={{borderTopWidth:3,borderColor:'#806844',backgroundColor:'#e3d0aa',height:90,padding:12,justifyContent:'center'}}><View style={{height:16,borderRadius:8,borderWidth:2,borderColor:'#6e8190',backgroundColor:'#e8f0f4'}}/></View>{label(9)}</View>{label(10)}
  </View>
  {data.displayParagraphIds.map(id=><View key={id} style={{gap:5}}>{ruby(`paragraphTitle:${id}`,ja.paragraphTitles[id],{...text,fontWeight:'700'})}{ruby(`paragraph:${id}`,ja.paragraphs[id],text)}{!!t&&<><Text style={{...text,fontWeight:'700'}}>{t.paragraphTitles[id]}</Text><Text style={text}>{t.paragraphs[id]}</Text></>}</View>)}
  <Text style={{...text,fontSize:14}}>AGR-S1 · PDF p.99 / p.93 · p.100 / p.94 · p.101 / p.95</Text>
 </View>;
}
