import {Text,View,type StyleProp,type TextStyle} from 'react-native';
import {agricultureLesson,type AgricultureLesson,type AgricultureLevel} from '@/data/agriculture';
import data from '@/data/agriculture/daily-reuse-caption-support.json';
import support from '@/data/agriculture/daily-learning-support.json';
import figures from '@/data/agriculture/recognition-images.json';
type Token={text:string;readingKana?:string};
type Entry={sourceHash:string;revision:string;levels:string[];canonicalJapanese:unknown;binding:unknown;figure:unknown;sourceJapanese:string;tokens:Token[];locales:Record<string,string>};
const registry=data as {schemaVersion:number;studyOnly:boolean;entries:Record<string,Entry>};
const snapshot=(l:AgricultureLesson)=>({titleJa:l.titleJa,objectiveJa:l.objectiveJa,paragraphs:l.paragraphs.map(p=>({id:p.id,titleJa:p.titleJa,textJa:p.textJa}))});
export function dailyReuseCaption(p:{lesson:AgricultureLesson;level:AgricultureLevel;figureId:string;text:string}){
 const e=registry.entries[p.lesson.id],current=agricultureLesson(p.lesson.id,p.level),b=(support.figureBindings as Record<string,unknown>)[p.lesson.id],f=figures.images.find(f=>f.id===p.figureId);
 if(registry.schemaVersion!==1||!registry.studyOnly||!e||!current||!e.levels.includes(p.level)||p.text!==e.sourceJapanese||p.lesson.sourceHash!==e.sourceHash||p.lesson.revision!==e.revision||current.sourceHash!==e.sourceHash||current.revision!==e.revision||JSON.stringify(snapshot(current))!==JSON.stringify(e.canonicalJapanese)||JSON.stringify(snapshot(p.lesson))!==JSON.stringify(e.canonicalJapanese)||JSON.stringify(b)!==JSON.stringify(e.binding)||JSON.stringify(f)!==JSON.stringify(e.figure))return null;
 return e;
}
export function DailyReuseCaption(p:Parameters<typeof dailyReuseCaption>[0]&{language:string;showTranslation:boolean;style?:StyleProp<TextStyle>;color:string}){
 const e=dailyReuseCaption(p),valid=e&&e.tokens.length&&e.tokens.map(t=>t.text).join('')===p.text&&e.tokens.every(t=>!!t.text&&(!/[\p{Script=Han}々]/u.test(t.text)||!!t.readingKana&&/^[\p{Script=Hiragana}\p{Script=Katakana}ー\s]+$/u.test(t.readingKana)));
 const target=e&&p.showTranslation&&p.language!=='ja'?e.locales[p.language]:null;
 return <View style={{gap:6}}>{valid?<View accessible accessibilityLabel={p.text} testID={`agri-reuse-caption-ruby-${p.lesson.id}`} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}>{e.tokens.map((t,i)=><View key={i} style={{alignItems:'center',maxWidth:'100%'}}><Text style={{fontSize:10,lineHeight:14,color:p.color}}>{t.readingKana||' '}</Text><Text style={p.style}>{t.text}</Text></View>)}</View>:<Text style={p.style}>{p.text}</Text>}{!!target&&<Text testID={`agri-reuse-caption-localized-${p.lesson.id}`} style={p.style}>{target}</Text>}</View>;
}
