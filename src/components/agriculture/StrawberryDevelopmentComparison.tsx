import {AgricultureIncomingTwoRuby} from './AgricultureIncomingTwoRuby';
import {Text,View} from 'react-native';
import data from '@/data/agriculture/strawberry-development-comparison.json';
import content from '@/data/agriculture/lessons.ja.json';
type Labels={title:string;alt:string;paragraphTitles:Record<string,string>;paragraphs:Record<string,string>};
type Colors={text:string;translation:string;translationText:string;border:string};
const fixed=['開花・結実の終了','又は','栄養の過剰','ランナー発生','自然条件：秋以降','低温・短日','花芽分化','翌年の春以降','高温・長日','開花・結実','分化促進の条件例','低温・短日・肥料中断','高冷地育苗','夜冷育苗','低温暗黒育苗','ポット育苗'];
const kana=['かいか・けつじつのしゅうりょう','または','えいようのかじょう','ランナーはっせい','しぜんじょうけん：あきいこう','ていおん・たんじつ','かがぶんか','よくねんのはるいこう','こうおん・ちょうじつ','かいか・けつじつ','ぶんかそくしんのじょうけんれい','ていおん・たんじつ・ひりょうちゅうだん','こうれいちいくびょう','やれいいくびょう','ていおんあんこくいくびょう','ポットいくびょう'];
export function strawberryDevelopmentLabels(id:string,hash:string,revision:string|undefined,level:string|undefined,language:string){
 const l=content.lessons.find(l=>l.id===id);
 if(JSON.stringify(data.labels.ja)!==JSON.stringify(fixed)||data.schemaVersion!==1||id!==data.lessonId||hash!==data.sourceHash||revision!==data.revision||!level||!data.levels.includes(level)||!l||!l.levels.includes(level)||l.sourceHash!==hash||l.revision!==revision||l.titleJa!==data.sourceJapanese.title||l.objectiveJa!==data.sourceJapanese.alt||JSON.stringify(l.paragraphs.map(p=>p.id))!==JSON.stringify(data.paragraphIds)||l.paragraphs.some(p=>data.sourceJapanese.paragraphs[p.id as keyof typeof data.sourceJapanese.paragraphs]!==p.textJa||data.sourceJapanese.paragraphTitles[p.id as keyof typeof data.sourceJapanese.paragraphTitles]!==p.titleJa)||JSON.stringify(data.locales.ja)!==JSON.stringify(data.sourceJapanese))return null;
 const t=(data.locales as Record<string,Labels>)[language],labels=(data.labels as Record<string,string[]>)[language];
 return t&&labels?.length===16&&labels.every(x=>!!x.trim())&&t.title.trim()&&t.alt.trim()&&data.paragraphIds.every(id=>t.paragraphTitles[id]?.trim()&&t.paragraphs[id]?.trim())?{...t,labels}:null;
}
/** Separate OR runner triggers, natural cross-year differentiation/flowering, and induction-condition examples; no cultivation setpoints. */
export function StrawberryDevelopmentComparison({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors}){
 const ja=strawberryDevelopmentLabels(lessonId,lessonSourceHash,lessonRevision,level,'ja');if(!ja)return null;
 const ruby=(field:string,value:string,style:{color:string;fontSize:number;lineHeight:number;fontWeight?:'700'})=><AgricultureIncomingTwoRuby provider="strawberry-development" lessonId={lessonId} lessonSourceHash={lessonSourceHash} lessonRevision={lessonRevision} level={level} language="ja" field={field} text={value} style={style} color={colors.translationText}/>;
 const t=showTranslation&&language!=='ja'?strawberryDevelopmentLabels(lessonId,lessonSourceHash,lessonRevision,level,language):null;
 const text={color:colors.translationText,fontSize:16,lineHeight:27},box={borderWidth:1,borderColor:colors.border,borderRadius:8,padding:10,gap:6};
 const label=(i:number)=><View style={{gap:3}}><View accessible accessibilityLabel={ja.labels[i]} style={{alignItems:'flex-start'}}><Text style={{color:colors.translationText,fontSize:10,lineHeight:14}}>{kana[i]}</Text><Text style={text}>{ja.labels[i]}</Text></View>{!!t&&<Text testID={`agri-strawberry-development-label-${i}`} style={text}>{t.labels[i]}</Text>}</View>;
 return <View testID="agri-native-strawberry-development" style={{...box,marginVertical:12,gap:14}}>{ruby('title',ja.title,{...text,fontSize:19,fontWeight:'700'})}{!!t&&<Text testID="agri-strawberry-development-localized-title" style={text}>{t.title}</Text>}
  <View accessibilityRole="image" accessibilityLabel={(t||ja).alt} style={{gap:12}}>
   <View testID="agri-strawberry-runner-or" style={{...box,backgroundColor:'#edf2df'}}><View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:10}}><View style={{...box,flexGrow:1,flexBasis:200}}>{label(0)}</View>{label(1)}<View style={{...box,flexGrow:1,flexBasis:200}}>{label(2)}</View></View><Text style={text}>↓</Text>{label(3)}</View>
   <View testID="agri-strawberry-natural-cross-year" style={{...box,backgroundColor:'#e8f0f4'}}><View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}><View style={{...box,flexGrow:1,flexBasis:240}}>{label(4)}{label(5)}<Text style={text}>↓</Text>{label(6)}</View><View style={{...box,flexGrow:1,flexBasis:240}}>{label(7)}{label(8)}<Text style={text}>↓</Text>{label(9)}</View></View></View>
   <View testID="agri-strawberry-induction-separate" style={{...box,backgroundColor:'#f8f0df'}}>{label(10)}{label(11)}</View>
   <View testID="agri-strawberry-four-nursery-names" style={box}><View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>{[12,13,14,15].map(i=><View key={i} style={{...box,flexGrow:1,flexBasis:220}}>{label(i)}</View>)}</View></View>
  </View>
  {data.paragraphIds.map(id=><View key={id} style={{gap:5}}>{ruby(`paragraphTitle:${id}`,ja.paragraphTitles[id],{...text,fontWeight:'700'})}{ruby(`paragraph:${id}`,ja.paragraphs[id],text)}{!!t&&<><Text style={{...text,fontWeight:'700'}}>{t.paragraphTitles[id]}</Text><Text style={text}>{t.paragraphs[id]}</Text></>}</View>)}
  <Text style={{...text,fontSize:14}}>AGR-S2 · PDF p.82 / p.80</Text>
 </View>;
}
