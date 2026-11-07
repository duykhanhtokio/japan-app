import {Text,View,type ImageSourcePropType} from 'react-native';
import canonical from '@/data/agriculture/lessons.ja.json';
import controlled from '@/data/agriculture/daily-learning-support.json';
import support from '@/data/agriculture/daily-controlled-native-support.json';
import type {AgricultureLesson} from '@/data/agriculture';
import {ZoomableFigure} from './ZoomableFigure';
type Labels={title:string;caption:string;alt:string;labels:string[]};
type Token={text:string;readingKana?:string};
type Binding={sourceHash:string;revision:string;levels:string[];requiredParagraphIds:string[];controlledSnapshot:unknown;canonicalJapanese:unknown};
type Entry={assetSnapshot:{assetPath:string;assetSha256:string;width:number;height:number};sourceJapanese:Labels;locales:Record<string,Labels>;lessonBindings:Record<string,Binding>;fields:Record<string,{sourceJapanese:string;tokens:Token[]}>};
const registry=support as unknown as {schemaVersion:number;studyOnly:boolean;entries:Record<string,Entry>};
export const hasDailyControlledSupport=(kind:string)=>Object.prototype.hasOwnProperty.call(registry.entries,kind);
type Context={kind:string;lesson?:AgricultureLesson;level?:string;paragraphIds?:string[];title:string;caption:string;alt:string};
const japanese=(l:AgricultureLesson)=>({titleJa:l.titleJa,objectiveJa:l.objectiveJa,paragraphs:l.paragraphs.map(p=>({id:p.id,titleJa:p.titleJa,textJa:p.textJa}))});
export function currentDailyControlledEntry(p:Context){
 const e=registry.entries[p.kind],l=canonical.lessons.find(l=>l.id===p.lesson?.id),b=p.lesson&&e?.lessonBindings[p.lesson.id],d=(controlled.controlledDiagrams as Record<string,{kind:string;assetPath:string;assetSha256:string;width:number;height:number}>)[p.lesson?.id||''];
 if(registry.schemaVersion!==1||!registry.studyOnly||!e||!l||!p.lesson||!b||!p.level||!b.levels.includes(p.level)||!l.levels.includes(p.level)||l.sourceHash!==b.sourceHash||p.lesson.sourceHash!==b.sourceHash||l.revision!==b.revision||p.lesson.revision!==b.revision||JSON.stringify(japanese(l))!==JSON.stringify(b.canonicalJapanese)||JSON.stringify(japanese(p.lesson))!==JSON.stringify(b.canonicalJapanese)||JSON.stringify(d)!==JSON.stringify(b.controlledSnapshot)||!d||d.kind!==p.kind||JSON.stringify({assetPath:d.assetPath,assetSha256:d.assetSha256,width:d.width,height:d.height})!==JSON.stringify(e.assetSnapshot)||JSON.stringify(e.locales.ja)!==JSON.stringify(e.sourceJapanese)||p.title!==e.sourceJapanese.title||p.caption!==e.sourceJapanese.caption||p.alt!==e.sourceJapanese.alt||p.paragraphIds&&b.requiredParagraphIds.some(id=>!p.paragraphIds!.includes(id)))return null;
 return e;
}
export function dailyControlledLabels(p:Context&{language:string}){const e=currentDailyControlledEntry(p),t=e?.locales[p.language];return e&&t&&t.title?.trim()&&t.caption?.trim()&&t.alt?.trim()&&t.labels?.length===e.sourceJapanese.labels.length&&t.labels.every(x=>x?.trim())?t:null;}
export function dailyControlledReading(p:Context&{language:string;field:string;text:string}){const e=currentDailyControlledEntry(p),f=e?.fields[p.field];if(p.language!=='ja'||!f||f.sourceJapanese!==p.text||!f.tokens.length||f.tokens.map(t=>t.text).join('')!==p.text||!f.tokens.every(t=>!!t.text&&(!/[\p{Script=Han}々]/u.test(t.text)||typeof t.readingKana==='string'&&/^[\p{Script=Hiragana}\p{Script=Katakana}ー\s]+$/u.test(t.readingKana))))return null;return f.tokens;}
export function DailyControlledFigure(p:Context&{source:ImageSourcePropType;language?:string;showTranslation?:boolean;colors:{text:string;translation:string;translationText:string;border:string}}){
 const e=currentDailyControlledEntry(p);if(!e)return null;
 const language=p.language||'ja',t=p.showTranslation&&language!=='ja'?dailyControlledLabels({...p,language}):null;
 const ruby=(field:string,text:string,title=false)=>{const tokens=dailyControlledReading({...p,language:'ja',field,text}),style={color:p.colors.translationText,fontSize:title?19:12,lineHeight:title?29:20,fontWeight:title?'700' as const:'400' as const};if(!tokens)return <Text style={style}>{text}</Text>;const parts=tokens.flatMap(t=>t.readingKana?[t]:Array.from(t.text,text=>({text,readingKana:undefined})));return <View accessible accessibilityLabel={text} testID={`agri-daily-controlled-ruby-${p.kind}-${field}`} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}>{parts.map((t,i)=><View key={i} style={{alignItems:'center',maxWidth:'100%',minWidth:0}}><Text style={{color:p.colors.translationText,fontSize:10,lineHeight:14}}>{t.readingKana||' '}</Text><Text style={style}>{t.text}</Text></View>)}</View>;};
 return <View testID={`agri-daily-controlled-${p.kind}`} style={{width:'100%',maxWidth:'100%',minWidth:0,alignSelf:'center',gap:8,marginVertical:12}}>
  {ruby('title',p.title,true)}{!!t&&<Text testID={`agri-daily-controlled-${p.kind}-localized-title`} style={{color:p.colors.translationText,fontSize:18,lineHeight:28}}>{t.title}</Text>}
  <ZoomableFigure source={p.source} width={e.assetSnapshot.width} height={e.assetSnapshot.height} altJa={t?.alt||p.alt} testID={`agri-daily-diagram-${p.kind}`} colors={p.colors} presentation={p.kind==='flower-use'||p.kind==='flower-packaging'?'recognition':'diagram'} allowExpandedView/>
  {ruby('caption',p.caption)}{!!t&&<Text testID={`agri-daily-controlled-${p.kind}-localized-caption`} style={{color:p.colors.translationText,fontSize:12,lineHeight:20}}>{t.caption}</Text>}
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{e.sourceJapanese.labels.map((label,i)=><View key={i} style={{flexGrow:1,flexBasis:120,minWidth:0,gap:4}}>{ruby(`label:${i}`,label)}{!!t&&<Text testID={`agri-daily-controlled-${p.kind}-localized-label-${i}`} style={{color:p.colors.translationText,fontSize:12,lineHeight:20}}>{t.labels[i]}</Text>}</View>)}</View>
 </View>;
}
